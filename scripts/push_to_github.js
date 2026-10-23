import fs from 'fs';
import path from 'path';
import https from 'https';
import { execSync } from 'child_process';

const REPO_OWNER = 'vanshu6969';
const REPO_NAME = 'kavana-ai';

console.log('1. Retrieving GitHub token from Windows Credential Manager...');
const token = execSync('powershell -ExecutionPolicy Bypass -File scripts/get_token.ps1', { encoding: 'utf8' }).trim();
if (!token || !token.startsWith('ghp_')) {
  console.error('Failed to retrieve valid GitHub token.');
  process.exit(1);
}
console.log('GitHub token retrieved successfully.');

function githubRequest(endpoint, method = 'GET', body = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(`https://api.github.com${endpoint}`);
    const options = {
      hostname: url.hostname,
      path: url.pathname + url.search,
      method,
      headers: {
        'User-Agent': 'Kavana-AI-Uploader',
        'Authorization': `token ${token}`,
        'Accept': 'application/vnd.github.v3+json'
      }
    };
    if (body) {
      const jsonStr = JSON.stringify(body);
      options.headers['Content-Type'] = 'application/json';
      options.headers['Content-Length'] = Buffer.byteLength(jsonStr);
    }

    const req = https.request(options, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          try {
            resolve(JSON.parse(data));
          } catch(e) {
            resolve(data);
          }
        } else {
          reject(new Error(`GitHub API Error ${res.statusCode}: ${data}`));
        }
      });
    });

    req.on('error', reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

async function uploadBlob(filePath) {
  const isBinary = filePath.endsWith('.jpg') || filePath.endsWith('.png') || filePath.endsWith('.ico');
  let content = '';
  let encoding = 'utf-8';

  if (isBinary) {
    const buf = fs.readFileSync(filePath);
    content = buf.toString('base64');
    encoding = 'base64';
  } else {
    content = fs.readFileSync(filePath, 'utf8');
  }

  const res = await githubRequest(`/repos/${REPO_OWNER}/${REPO_NAME}/git/blobs`, 'POST', {
    content,
    encoding
  });
  return res.sha;
}

async function main() {
  console.log('\n2. Fetching current main branch on GitHub...');
  const branchData = await githubRequest(`/repos/${REPO_OWNER}/${REPO_NAME}/branches/main`);
  const latestCommitSha = branchData.commit.sha;
  const baseTreeSha = branchData.commit.commit.tree.sha;
  console.log(`Latest commit: ${latestCommitSha.slice(0, 8)} (Tree: ${baseTreeSha.slice(0, 8)})`);

  const textFiles = [
    'index.html',
    'public/index.html',
    'app.js',
    'public/app.js',
    'engine.js',
    'public/engine.js',
    'stories-catalog.js',
    'public/stories-catalog.js',
    'character-lore-engine.js',
    'public/character-lore-engine.js',
    'ai-service.js',
    'public/ai-service.js',
    'style.css',
    'public/style.css',
    'server.js'
  ];

  // Scan ALL poster and avatar assets in both assets/ and public/assets/
  const getAssetsFromDir = (dir) => {
    if (!fs.existsSync(dir)) return [];
    return fs.readdirSync(dir)
      .filter(f => f.endsWith('.jpg') || f.endsWith('.png') || f.endsWith('.webp'))
      .map(f => `${dir}/${f}`.replace(/\\/g, '/'));
  };

  const assetFiles = [
    ...getAssetsFromDir('assets'),
    ...getAssetsFromDir('public/assets')
  ];

  const allFiles = [...textFiles, ...assetFiles.filter(f => fs.existsSync(f))];

  console.log(`\n3. Uploading ${allFiles.length} files as Git blobs with concurrency...`);
  const treeItems = [];

  const BATCH_SIZE = 8;
  for (let i = 0; i < allFiles.length; i += BATCH_SIZE) {
    const batch = allFiles.slice(i, i + BATCH_SIZE);
    await Promise.all(batch.map(async (relPath) => {
      try {
        const sha = await uploadBlob(relPath);
        treeItems.push({
          path: relPath.replace(/\\/g, '/'),
          mode: '100644',
          type: 'blob',
          sha
        });
      } catch(err) {
        console.error(`Failed ${relPath}: ${err.message}`);
      }
    }));
    process.stdout.write(`Uploaded ${Math.min(i + BATCH_SIZE, allFiles.length)} / ${allFiles.length} files\r`);
  }
  console.log(`\n✓ Successfully uploaded ${treeItems.length} Git blobs.`);

  console.log(`\n4. Creating new Git tree with ${treeItems.length} entries on top of base tree...`);
  const newTree = await githubRequest(`/repos/${REPO_OWNER}/${REPO_NAME}/git/trees`, 'POST', {
    base_tree: baseTreeSha,
    tree: treeItems
  });
  console.log(`New Tree SHA: ${newTree.sha.slice(0, 8)}`);

  console.log('\n5. Creating commit...');
  const commitMsg = 'Feat: Rename all 105 stories to definitive female romance leads and render movie posters with Love Villa typography and styling';
  const newCommit = await githubRequest(`/repos/${REPO_OWNER}/${REPO_NAME}/git/commits`, 'POST', {
    message: commitMsg,
    tree: newTree.sha,
    parents: [latestCommitSha]
  });
  console.log(`New Commit SHA: ${newCommit.sha.slice(0, 8)}`);

  console.log('\n6. Updating refs/heads/main...');
  await githubRequest(`/repos/${REPO_OWNER}/${REPO_NAME}/git/refs/heads/main`, 'PATCH', {
    sha: newCommit.sha,
    force: false
  });

  console.log('\n🎉 SUCCESS! Changes pushed to GitHub:');
  console.log(`Commit: https://github.com/${REPO_OWNER}/${REPO_NAME}/commit/${newCommit.sha}`);
}

main().catch(err => {
  console.error('\n❌ ERROR during GitHub push:', err);
  process.exit(1);
});

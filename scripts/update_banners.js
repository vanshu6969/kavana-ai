const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'lib', 'stories-data.ts');
let content = fs.readFileSync(filePath, 'utf8');

const MAPPINGS = {
  'still-yours': {
    cover: '/images/still_yours_banner.jpg',
    avatar: 'https://image.tmdb.org/t/p/w780/7ZXLZ3KYL3IVvsSHBZaHjcNQzNU.jpg'
  },
  'playboy-reborn': {
    cover: 'https://image.tmdb.org/t/p/w1280/clGOzO82lN4gPI4Fon7wNVXS90i.jpg',
    avatar: 'https://image.tmdb.org/t/p/w780/6vs7qtD5KUwijUhpthuhA6PkwxI.jpg'
  },
  'raaz-e-haveli': {
    cover: 'https://image.tmdb.org/t/p/w1280/hy2rW1MYHXL3kajNSqvEYhYnjGn.jpg',
    avatar: 'https://image.tmdb.org/t/p/w780/poiO705KRR4L8gkTeQNhJJr9ylX.jpg'
  },
  'spy-x-family': {
    cover: 'https://image.tmdb.org/t/p/w1280/lysUnU6V0VfcthDbviuVlIqgHOR.jpg',
    avatar: 'https://image.tmdb.org/t/p/w780/7NAvPYPAu7MeHwP8E9sn81PqsRh.jpg'
  },
  'tere-bin-murtasim': {
    cover: '/images/murtasim_khan_banner.jpg',
    avatar: 'https://image.tmdb.org/t/p/w780/4mBTFqDRzSxuLD8MM59nXvwyWEU.jpg'
  },
  'kabhi-main-kabhi-tum-sharjeena': {
    cover: 'https://image.tmdb.org/t/p/w1280/iavWdHPaiMnUf0xhcsjudqEzjif.jpg',
    avatar: 'https://image.tmdb.org/t/p/w780/l21CIu76YwyZBn3GIPqXULgKVQu.jpg'
  },
  'ishq-murshid-shahmeer': {
    cover: 'https://image.tmdb.org/t/p/w1280/bOWeRgeqmjLNuZQI3SjZMW7w4tB.jpg',
    avatar: 'https://image.tmdb.org/t/p/w780/m3meE0v00iTarAl4oMzPN9fq2zm.jpg'
  },
  'parizaad-poet': {
    cover: 'https://image.tmdb.org/t/p/w1280/rir2tvfLpYZym2G9WBUHWgapNwV.jpg',
    avatar: 'https://image.tmdb.org/t/p/w780/rKPB1TNRmHLvB7CWDs5qltwSlwG.jpg'
  },
  'mirzapur-kaleen-bhaiya': {
    cover: 'https://image.tmdb.org/t/p/w1280/3dV7pWAdwIPKR2lMIACMfObXdgK.jpg',
    avatar: 'https://image.tmdb.org/t/p/w780/1rxLUFVrtTo82OxhbDXJDiJVkwL.jpg'
  },
  'peaky-blinders-tommy': {
    cover: 'https://image.tmdb.org/t/p/w1280/dzq83RHwQcnP6WGJ6YkenIqeaa5.jpg',
    avatar: 'https://image.tmdb.org/t/p/w780/vUUqzWa2LnHIVqkaKVlVGkVcZIW.jpg'
  },
  'jujutsu-satoru-gojo': {
    cover: 'https://image.tmdb.org/t/p/w1280/qpin8cASXEVtwhzNsprHYFiOAGk.jpg',
    avatar: 'https://image.tmdb.org/t/p/w780/6qQzMJG27XOJsyAEEIisoJB45j2.jpg'
  },
  'solo-leveling-sung-jinwoo': {
    cover: 'https://image.tmdb.org/t/p/w1280/xMNH87maNLt9n2bMDYeI6db5VFm.jpg',
    avatar: 'https://image.tmdb.org/t/p/w780/geCRueV3ElhRTr0xtJuEWJt6dJ1.jpg'
  },
  'khaani-mir-hadi': {
    cover: 'https://image.tmdb.org/t/p/w1280/trbCMpcE01bRgfHUq8De7AYMa9F.jpg',
    avatar: 'https://image.tmdb.org/t/p/w780/iJgahmVRiy7zxLXzqjzpt2R0HVI.jpg'
  },
  'humsafar-ashar': {
    cover: 'https://image.tmdb.org/t/p/w1280/jvmhaK1IMtTuDmhLkqxTJTlLhKp.jpg',
    avatar: 'https://image.tmdb.org/t/p/w780/6zEJBpSl42mCwMghEyzCsloVscZ.jpg'
  },
  'zindagi-gulzar-hai-zaroon': {
    cover: 'https://image.tmdb.org/t/p/w1280/93Y7yqk0KdYsZt4n3q7lgQ5pqdg.jpg',
    avatar: 'https://image.tmdb.org/t/p/w780/hssHwWMboXTENQ7QlAj45ojTEmy.jpg'
  },
  'kabir-oberoi-kingpin': {
    cover: 'https://image.tmdb.org/t/p/w1280/qtac9X9lSLqZFbxS71347N8MiID.jpg',
    avatar: 'https://image.tmdb.org/t/p/w780/uEbNtFbK4At9WBDGap23lt1qO9n.jpg'
  },
  'priya-bad-husband': {
    cover: 'https://image.tmdb.org/t/p/w1280/uBDbyoufp7TGaDDVTHOCxl3dz8p.jpg',
    avatar: 'https://image.tmdb.org/t/p/w780/lyA7kXCIAG17hVuvFOxlMmmv31A.jpg'
  },
  'cyberpunk-neo-tokyo': {
    cover: 'https://image.tmdb.org/t/p/w1280/3UbHGmu9vIMSC5uNfnGt7DjetqT.jpg',
    avatar: 'https://image.tmdb.org/t/p/w780/lqcDVZ8pyk08AVftMBildDR3QUK.jpg'
  },
  'asylum-tapes-dr-elena': {
    cover: 'https://image.tmdb.org/t/p/w1280/rbZvGN1A1QyZuoKzhCw8QPmf2q0.jpg',
    avatar: 'https://image.tmdb.org/t/p/w780/nrmXQ0zcZUL8jFLrakWc90IR8z9.jpg'
  },
  'cartel-heiress-sofia': {
    cover: 'https://image.tmdb.org/t/p/w1280/3NVXTxrzxm5x7MBaQlzeLZk9pRD.jpg',
    avatar: 'https://image.tmdb.org/t/p/w780/rzdC5EHkkKJE6OPVdh6gT1pR1c9.jpg'
  },
  'vampire-sovereign-seraphina': {
    cover: 'https://image.tmdb.org/t/p/w1280/2OAoGOvysScieVhIazrWTXj2ESp.jpg',
    avatar: 'https://image.tmdb.org/t/p/w780/keJOhJXGiLL54EW6QocbyvQGquA.jpg'
  },
  'chief-surgeon-alisha': {
    cover: 'https://image.tmdb.org/t/p/w1280/cmk8d1e1GxrwTaau0Tj4zm1osm0.jpg',
    avatar: 'https://image.tmdb.org/t/p/w780/9fbRJgZ2zDTnSUId1bOwsllHNr7.jpg'
  },
  'bollywood-starlet-ria': {
    cover: 'https://image.tmdb.org/t/p/w1280/rSctHn6sxFCnKfKPjAOShCOoBTe.jpg',
    avatar: 'https://image.tmdb.org/t/p/w780/rLqX8PWdSJVmKfBqSEg24bERIEg.jpg'
  },
  'forbidden-princess-noor': {
    cover: 'https://image.tmdb.org/t/p/w1280/50reJgWrWTXK3fvGh8idw71gxAO.jpg',
    avatar: 'https://image.tmdb.org/t/p/w780/5kk71s8Vmvt8XQOojevhTA5QcB0.jpg'
  },
  'suits-harvey-specter': {
    cover: 'https://image.tmdb.org/t/p/w1280/or0E36KfzJYZwqXeiCfm1JgeKF.jpg',
    avatar: 'https://image.tmdb.org/t/p/w780/vQiryp6LioFxQThywxbC6TuoDjy.jpg'
  },
  'aot-captain-levi': {
    cover: 'https://image.tmdb.org/t/p/w1280/rqbCbjB19amtOtFQbb3K2lgm2zv.jpg',
    avatar: 'https://image.tmdb.org/t/p/w780/hTP1DtLGFamjfu8WqjnuQdP1n4i.jpg'
  },
  'aryan-singhania-ceo': {
    cover: 'https://image.tmdb.org/t/p/w1280/lq0YqJuffMuZhoKTiC5xDqvtCSn.jpg',
    avatar: 'https://image.tmdb.org/t/p/w780/iLh7L8ZuvgdxFaM9sImyv2iKYLe.jpg'
  },
  'churail-murree-hills': {
    cover: 'https://image.tmdb.org/t/p/w1280/rfxj5AoOuvbqi0019TVZLy6gyCC.jpg',
    avatar: 'https://image.tmdb.org/t/p/w780/4XYEqHqvcf6vxFhNyeKZz5xbUfV.jpg'
  },
  'demon-slayer-hashira': {
    cover: 'https://image.tmdb.org/t/p/w1280/1RgPyOhN4DRs225BGTlHJqCudII.jpg',
    avatar: 'https://image.tmdb.org/t/p/w780/fWVSwgjpT2D78VUh6X8UBd2rorW.jpg'
  },
  'chainsaw-makima': {
    cover: 'https://image.tmdb.org/t/p/w1280/5DUMPBSnHOZsbBv81GFXZXvDpo6.jpg',
    avatar: 'https://image.tmdb.org/t/p/w780/iFM1dyFi0rByvEomEkmm7NpQeeb.jpg'
  },
  'rajputana-cursed-haveli': {
    cover: 'https://image.tmdb.org/t/p/w1280/l0YKBu3LaehIFzBNjseLjx7MbaN.jpg',
    avatar: 'https://image.tmdb.org/t/p/w780/vzjZAKozbDplHWcQXbXo0APKxst.jpg'
  },
  'formula-1-paddock': {
    cover: 'https://image.tmdb.org/t/p/w1280/xefmNmSGCApfRPaqhIRTaAjFlpo.jpg',
    avatar: 'https://image.tmdb.org/t/p/w780/xGOGjJFYYeRSoOpnhN9IHZTXIxj.jpg'
  },
  'sun-chanda-arsal': {
    cover: 'https://image.tmdb.org/t/p/w1280/y3vJWu4ZJJuuKGYjF0lbGwTxB5y.jpg',
    avatar: 'https://image.tmdb.org/t/p/w780/9LHUup1oFpO3OYIiuVIbNUmrP9T.jpg'
  },
  'godfather-corleone': {
    cover: 'https://image.tmdb.org/t/p/w1280/tSPT36ZKlP2WVHJLM4cQPLSzv3b.jpg',
    avatar: 'https://image.tmdb.org/t/p/w780/3bhkrj58Vtu7enYsRolD1fZdja1.jpg'
  },
  'mere-humsafar-hamza': {
    cover: 'https://image.tmdb.org/t/p/w1280/bOWeRgeqmjLNuZQI3SjZMW7w4tB.jpg',
    avatar: 'https://image.tmdb.org/t/p/w780/hRb0yB8z1B5zoSVQbeiGZ1bV609.jpg'
  },
  'tokyo-revengers-mikey': {
    cover: 'https://image.tmdb.org/t/p/w1280/naTQ1UmfUCAhe9PWmeVqx8nQ5Zh.jpg',
    avatar: 'https://image.tmdb.org/t/p/w780/arB3L9pZZBSzUPSC8BEv8c3X0bF.jpg'
  },
  'divorce-me-billionaire': {
    cover: 'https://image.tmdb.org/t/p/w1280/wcP3FsRLog4GNEs9PFrDKKQdcof.jpg',
    avatar: 'https://image.tmdb.org/t/p/w780/7ZXLZ3KYL3IVvsSHBZaHjcNQzNU.jpg'
  },
  'blackwood-manor-seance': {
    cover: 'https://image.tmdb.org/t/p/w1280/dQF17lG4OZ3pC4QD9iNjaMS96gO.jpg',
    avatar: 'https://image.tmdb.org/t/p/w780/nWPZb800NCGiDPNGsKCfY0w44Z2.jpg'
  },
  'london-penthouse-vance': {
    cover: 'https://image.tmdb.org/t/p/w1280/6umsRLI7t0ydFwCl0JNEIO0q2LH.jpg',
    avatar: 'https://image.tmdb.org/t/p/w780/uXTg565ahu9RwonCX1V2Hex1NU6.jpg'
  },
  'fitoor-hamza-return': {
    cover: 'https://image.tmdb.org/t/p/w1280/xiEg2x7uRiX7xWHLrSJ0TIHiSgx.jpg',
    avatar: 'https://image.tmdb.org/t/p/w780/tLnhNWhmY7R6nJ4ijUJA3kR4q7L.jpg'
  }
};

let replacedCount = 0;
for (const [id, data] of Object.entries(MAPPINGS)) {
  // Regex to match the story block
  const pattern = new RegExp(`(id:\\s*['"]` + id + `['"][\\s\\S]*?avatar:\\s*['"])([^'"]+)(['"][\\s\\S]*?cover:\\s*['"])([^'"]+)(['"])`);
  if (pattern.test(content)) {
    content = content.replace(pattern, (match, p1, oldAv, p3, oldCov, p5) => {
      replacedCount++;
      return p1 + data.avatar + p3 + data.cover + p5;
    });
  } else {
    console.warn('Pattern did not match for id:', id);
  }
}

fs.writeFileSync(filePath, content, 'utf8');
console.log(`Updated banners and posters for ${replacedCount} / 40 stories.`);

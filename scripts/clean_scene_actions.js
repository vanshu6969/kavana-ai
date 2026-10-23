import fs from 'fs';

function cleanQuotesAndEnglish(filePath) {
  if (!fs.existsSync(filePath)) return;
  let code = fs.readFileSync(filePath, 'utf8');

  // Fix double quotes in replyText
  code = code.replace(
    /replyText: `\${sceneProgression\.action}\\n\\n"\${sceneProgression\.dialogue}"`/g,
    `replyText: \`\${sceneProgression.action}\\n\\n"\${sceneProgression.dialogue.replace(/^"+|"+$/g, '')}"\``
  );

  // English actions for scenes in resolveSceneContinuation
  // Scene 1: Help
  code = code.replace(
    /const action = isFemale\s*\?\s*`\*\${cleanName} ke chehre par ek rahat aur jeet bhari muskurahat aati hai\. Wo jhat se tumhara haath thaam kar tumhe corridor se seedha apne flat ke andar kheenchti hai, aur darwaza band karke kundi laga deti hai\.\*`\s*:\s*`\*\${cleanName} ek relieved muskaan ke sath tumhara haath pakadta hai aur tumhe apne flat ke andar le aata hai, darwaza lock karte hue\.\*`;/g,
    `const action = isEn
        ? (isFemale
            ? \`*A radiant, victorious smile spreads across \${cleanName}'s face as she takes your hand, pulling you straight from the hallway into her apartment before turning the deadbolt on the front door.*\`
            : \`*A relieved smile crosses \${cleanName}'s face as he takes your hand, guiding you inside the apartment and locking the door behind you.*\`
          )
        : (isFemale
            ? \`*\${cleanName} ke chehre par ek rahat aur jeet bhari muskurahat aati hai. Wo jhat se tumhara haath thaam kar tumhe corridor se seedha apne flat ke andar kheenchti hai, aur darwaza band karke kundi laga deti hai.*\`
            : \`*\${cleanName} ek relieved muskaan ke sath tumhara haath pakadta hai aur tumhe apne flat ke andar le aata hai, darwaza lock karte hue.*\`
          );`
  );

  // Scene 2: Contract
  code = code.replace(
    /const action = isFemale\s*\?\s*`\*\${cleanName} desk par rakhi contract file ko kholti hai aur executive leather chair ki taraf ishara karti hai, uski amber aankhon mein commanding jeet jhalakti hai jab wo tumhare bilkul kareeb aati hai\.\*`\s*:\s*`\*\${cleanName} file desk par rakhta hai aur chair ki taraf ishara karta hai, uski nazar commanding hoti hai\.\*`;/g,
    `const action = isEn
        ? (isFemale
            ? \`*\${cleanName} opens the executive contract folder on her massive mahogany desk and gestures toward the leather chair, an alluring, dominant victory glittering in her eyes as she leans closer.*\`
            : \`*\${cleanName} slides the folder across the desk and gestures firmly toward the chair, his commanding gaze locking onto yours.*\`
          )
        : (isFemale
            ? \`*\${cleanName} desk par rakhi contract file ko kholti hai aur executive leather chair ki taraf ishara karti hai, uski amber aankhon mein commanding jeet jhalakti hai jab wo tumhare bilkul kareeb aati hai.*\`
            : \`*\${cleanName} file desk par rakhta hai aur chair ki taraf ishara karta hai, uski nazar commanding hoti hai.*\`
          );`
  );

  // Scene 3: Blackout
  code = code.replace(
    /const action = `\*\${cleanName} mombatti ko utha kar sofa ke paas aati hai aur rug par thoda khisak kar tumhare baithne ki jagah banati hai, bahar toofani bijli kamre ko chamka deti hai\.\*`;/g,
    `const action = isEn
        ? \`*\${cleanName} lifts the flickering candle from the desk, moving over to the rug and making space right beside you as thunder rumbles against the dark window.*\`
        : \`*\${cleanName} mombatti ko utha kar sofa ke paas aati hai aur rug par thoda khisak kar tumhare baithne ki jagah banati hai, bahar toofani bijli kamre ko chamka deti hai.*\`;`
  );

  // Scene 4: Villa Drink
  code = code.replace(
    /const action = `\*\${cleanName} chilled champagne ka flute tumhari taraf badhati hai aur tumhara haath thaam kar seedha glowing infinity pool ke kinare le aati hai\.\*`;/g,
    `const action = isEn
        ? \`*\${cleanName} extends the chilled flute of champagne toward you, locking her fingers around yours and leading you directly to the edge of the glowing infinity pool.*\`
        : \`*\${cleanName} chilled champagne ka flute tumhari taraf badhati hai aur tumhara haath thaam kar seedha glowing infinity pool ke kinare le aati hai.*\`;`
  );

  // Scene 5: Bodyguard
  code = code.replace(
    /const action = `\*\${cleanName} door ka deadbolt lock karti hai aur tactical holster adjust karke bed ke paas khadi hoti hai, uski sharp aankhon mein protective narmi aati hai\.\*`;/g,
    `const action = isEn
        ? \`*\${cleanName} turns the heavy deadbolt on the suite door, adjusting her tactical sidearm before stepping over to stand beside your bed, her stoic gaze softening with fierce protective heat.*\`
        : \`*\${cleanName} door ka deadbolt lock karti hai aur tactical holster adjust karke bed ke paas khadi hoti hai, uski sharp aankhon mein protective narmi aati hai.*\`;`
  );

  // Scene 6: Secret Room
  code = code.replace(
    /const action = `\*\${cleanName} jhat se darwaze ki kundi lagati hai aur dabe paanv bistar par aakar tumhari god mein baithti hai, uski garam saansein tumhari gardan ko chhooti hain\.\*`;/g,
    `const action = isEn
        ? \`*\${cleanName} quietly clicks the bedroom lock in place, tiptoeing across the dark room and climbing onto the bed into your lap, her warm breath tingling against your neck.*\`
        : \`*\${cleanName} jhat se darwaze ki kundi lagati hai aur dabe paanv bistar par aakar tumhari god mein baithti hai, uski garam saansein tumhari gardan ko chhooti hain.*\`;`
  );

  // Scene 7: Exam
  code = code.replace(
    /const action = `\*\${cleanName} faculty door ka deadbolt turn karti hai, blinds band karke reading glasses utaarti hai aur oak desk par baith kar tumhare bilkul aamne-saamne aati hai\.\*`;/g,
    `const action = isEn
        ? \`*\${cleanName} locks the faculty door, drawing the blinds completely shut before removing her reading glasses and sitting on the edge of the desk mere inches from your face.*\`
        : \`*\${cleanName} faculty door ka deadbolt turn karti hai, blinds band karke reading glasses utaarti hai aur oak desk par baith kar tumhare bilkul aamne-saamne aati hai.*\`;`
  );

  fs.writeFileSync(filePath, code, 'utf8');
  console.log(`✓ Cleaned quotes and English actions in ${filePath}`);
}

cleanQuotesAndEnglish('character-lore-engine.js');
cleanQuotesAndEnglish('public/character-lore-engine.js');

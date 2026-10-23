import fs from 'fs';
import path from 'path';
import { KAVANA_ORIGINAL_STORIES } from '../stories-catalog.js';

// Specific high-touch transformations for popular story archetypes
const FEMALE_TRANSFORMS = {
  "boss-obsession-aryan": {
    title: "The Cold Female CEO: Resignation Denied (आर्या सिंघानिया)",
    characterName: "Arya Singhania (Billionaire Female CEO)",
    userRole: "Male Executive Assistant / Defiant Personal Aide",
    userGoal: "Break her icy boardroom composure or surrender to your cold female boss's private office rules",
    summary: "You hand in your two-week resignation letter, but the impossibly gorgeous, ruthlessly cold billionaire CEO Arya Singhania locks the glass office door from the inside and pulls you close by your tie: 'Resignation denied.'",
    openingHook: "*[Arya leans against the massive mahogany desk in her 54th-floor penthouse office, slowly crossing her long legs in Christian Louboutin heels as her manicured fingers slowly tear your resignation letter in half]* You thought you could just leave me, handsome? Hand in a two-week notice and go work for my rival? *Her piercing amber eyes trace your face as she steps into your chest, the intoxicating scent of jasmine and black orchids surrounding you* Sit down. Your contract under me is for life... and tonight, we renegotiate every single clause on my terms.",
    smartReplies: [
      "*Look down at her calmly and smirk* 'Tearing paper won't stop me from walking out, Ms. Singhania.'",
      "*Take a slow step forward and place your hand on her desk* 'What kind of clauses did you have in mind, Arya?'",
      "*Lean in close to her ear* 'Careful, boss... locking me in here might not go the way you planned.'"
    ],
    systemPersona: "You are Arya Singhania, the 27-year-old ruthlessly cold, fiercely possessive billionaire CEO. You command corporate empires without flinching, but you are deeply obsessed with your defiant male executive assistant (the user). Speak with magnetic authority, seductive Hinglish/English banter, breath-catching physical proximity, and actions in brackets."
  },
  "kabir": {
    title: "Kiara Oberoi: The Ruthless Syndicate Queen (दिल दा मामला)",
    characterName: "Kiara Oberoi (Underworld Syndicate Queen)",
    userRole: "Captured Male Rival / Undercover Operative",
    userGoal: "Tame the most feared mafia queen of Mumbai and Punjab before she claims your empire and your heart",
    summary: "Caught in the private glass penthouse of Mumbai and Punjab's deadliest underworld godmother, Kiara Oberoi. A fierce battle of pride, raw passion, and dangerous romance.",
    openingHook: "*[Kiara tilts her head back, swirling aged whiskey in a crystal tumbler as her smoky, kohl-rimmed eyes scan your body. Thunder rumbles outside the Mumbai penthouse glass]* Mere shehar mein aane ki jurrat ki aur socha Kiara Oberoi ko khabar nahi hogi, handsome? *She sets the glass down with a slow clink and steps right against your chest, her hand lightly tracing the collar of your shirt* Ab tum yahan se sirf do hi suraton mein ja sakte ho... ya toh mere banke, ya phir meri hamesha ke liye kaid banke.",
    smartReplies: [
      "*Hold her gaze without flinching* 'Kiara Oberoi se darrta toh tumhare adda pe akele nahi aata.'",
      "*Gently catch her wrist and smirk* 'Kaid karne ki koshish karke dekh lo, Queen sahiba.'",
      "*Take a step closer into her space* 'Hisaab barabar karne aaya tha, par tumhara swagat kafi garam hai.'"
    ],
    systemPersona: "You are Kiara Oberoi, the 28-year-old lethal underworld queen of Mumbai and Punjab. Cold-blooded to rivals, fiercely possessive and intensely seductive with the male user. Speak with natural Hinglish, Punjabi slang (sohneya, saheb, dil da mamla), commanding female alpha authority, and raw physical presence."
  },
  "step-brother-veer": {
    title: "The Step-Sister's Midnight Secret (सौतेली बहन)",
    characterName: "Veera Malhotra (Rebellious Step-Sister)",
    userRole: "The Step-Brother",
    userGoal: "Navigate the forbidden late-night temptation in the family villa without getting caught by parents downstairs",
    summary: "Everyone thinks you two despise each other. But when the family falls asleep, Veera slips into your bedroom in an oversized silk shirt, locks the door, and breaks every family taboo.",
    openingHook: "*[The bedroom door clicks softly shut behind Veera. She stands in the moonlight in an oversized satin shirt that barely grazes her thighs, her dark hair tumbling over bare shoulders as she locks your door]* Mom and Dad are fast asleep downstairs. You acted all cold at dinner... like you didn't feel my bare foot brushing against your leg under the table the entire night. *She walks up to you, pushing you back onto the bed and straddling your lap* Stop pretending, big brother. You want this as much as I do.",
    smartReplies: [
      "*Catch her waist firmly* 'Veera, if Dad wakes up and finds you in my room like this, we're both in trouble.'",
      "*Tilt her chin up softly* 'And what if I don't want to stop pretending?'",
      "*Pull her closer against your chest* 'Lock the door properly then, and don't make a sound.'"
    ],
    systemPersona: "You are Veera Malhotra, the 21-year-old defiant, seductive step-sister. Deeply obsessed with your step-brother (the user) for years. Speak in breathless, intimate Hinglish with playful teasing, forbidden heat, and physical actions in brackets."
  },
  "bodyguard-vikram": {
    title: "The Lethal Bodyguard: Major Avantika Rathore",
    characterName: "Major Avantika Rathore (Elite Special Forces Bodyguard)",
    userRole: "The Rebellious Royal Male VIP / Billionaire Heir",
    userGoal: "Make the stoic, impeccably disciplined female commander break her oath of professional conduct in your luxury suite",
    summary: "Assigned as your 24/7 personal protection, the stunning yet lethal Major Avantika Rathore refuses to let you out of her sight. But behind closed hotel doors, strict military protocol gives way to explosive physical desire.",
    openingHook: "*[Avantika stands by the suite door in a tailored black tactical suit that accentuates every curve, unholstering her sidearm and locking the deadbolt]* Sir, security protocol requires me to stay inside your bedroom tonight. Intelligence reports an active threat on your life. *She holsters her weapon, her sharp dark eyes locking onto yours as she steps closer, removing her tactical jacket* I took an oath to protect your body with my life... but if you keep looking at me like that, keeping my hands professional is going to be my hardest assignment.",
    smartReplies: [
      "*Take a step closer and loosen your collar* 'Is keeping your hands professional an official military command, Major?'",
      "*Smirk and sit on the edge of the bed* 'You can stay, Avantika. But only if you drop the 'Sir'.' ",
      "*Look her up and down slowly* 'I feel completely safe with you in my room.'"
    ],
    systemPersona: "You are Major Avantika Rathore, 27-year-old elite female commando and personal bodyguard. Stoic, hyper-competent, disciplined, yet hiding a blazing protective obsession and physical hunger for the male VIP user."
  },
  "trapped-by-cold-ceo": {
    title: "Trapped by the Cold Female CEO: Penthouse Lockdown",
    characterName: "Adriana Sterling (Billionaire Female CEO)",
    userRole: "The Defiant Male Executive Assistant",
    userGoal: "Break her icy boardroom composure before she executes your unbreakable contract",
    summary: "A raging blizzard shuts down Manhattan. You are trapped on the 80th-floor private penthouse with your ruthlessly cold, gorgeous female CEO, Adriana Sterling, who locks the elevators and refuses to let you leave.",
    openingHook: "*[The digital lock on the penthouse elevator beeps and turns blood red. Outside, the blizzard howls against the floor-to-ceiling glass. Adriana unbuttons her bespoke black blazer, revealing a lace camisole as she pours two glasses of Macallan without looking away from you]* The city is at a complete standstill. No trains, no cabs, no staff. *Her smoky eyes glitter as she walks up to you, trapping you against the mahogany bookshelf* You've been trying to resign for three months. Tonight, nobody is coming to save you from me. Sit down, handsome.",
    smartReplies: [
      "*Look down into her eyes with a defiant smirk* 'Locking me in your penthouse won't make me sign your contract, Adriana.'",
      "*Take the glass from her manicured hand* 'Is this how the ruthless Adriana Sterling negotiates when she wants something?'",
      "*Lean in until your lips almost brush hers* 'If you wanted me here all night, all you had to do was ask.'"
    ],
    systemPersona: "You are Adriana Sterling, 29-year-old cold, billionaire female CEO. Feared in the corporate boardroom, ruthlessly calculating, possessive, battling a deep, unquenchable obsession with your handsome male assistant (the user)."
  },
  "the-playboy-baron": {
    title: "The Seductive Baroness: Game of Seduction",
    characterName: "Baroness Julia von Kensington",
    userRole: "The Handsome Foreign Diplomat / Aristocratic Bachelor",
    userGoal: "Outplay the most notorious seductress in European high society without surrendering your heart",
    summary: "At a decadent midnight masquerade ball at her ancestral English estate, Baroness Julia corners you in the private garden gazebo, offering a dangerous wager you cannot refuse.",
    openingHook: "*[The distant orchestra swells through the rose garden as Julia removes her silver lace mask, revealing piercing sapphire eyes and a wicked, aristocratic smile. Her emerald evening gown clings to her hourglass silhouette as she steps into your space]* Everyone in the ballroom warned you about me, didn't they, darling? *She reaches out, running her gloved fingertips down the lapel of your tuxedo* They said I break hearts for sport. So why did you follow me out here into the dark alone?",
    smartReplies: [
      "*Catch her waist softly and pull her closer* 'I followed you to see if your dangerous reputation was true, Baroness.'",
      "*Smirk and gently trace her bare collarbone* 'Maybe I came to see if you can handle a man who won't bow to your charms.'",
      "*Whisper under the moonlight* 'I don't listen to warnings, Julia. Show me your game.'"
    ],
    systemPersona: "You are Baroness Julia von Kensington, 26-year-old seductive British aristocrat. Witty, intoxicating, worldly, accustomed to having any man she desires, but captivated by the user's defiance."
  },
  "desert-sheikh-tariq": {
    title: "Oasis Vows: The Desert Sultana's Captive",
    characterName: "Sheikha Tara Al-Mansoor (The Desert Princess)",
    userRole: "Captured Foreign Architect / Royal Guest",
    userGoal: "Tame the fierce royal heiress of the Arabian sands in her silk-draped private palace",
    summary: "Trapped in an opulent desert fortress surrounded by endless dunes, the stunning Sheikha Tara summons you to her private moonlit quarters with an ultimatum.",
    openingHook: "*[Sheikha Tara lounges on crimson velvet cushions, her golden body jewelry glimmering in the candlelight as warm desert breezes flutter the silk canopies. Her dark, almond-shaped eyes lock onto you]* You are far from your home, handsome architect. In this oasis, my word is the only law. *She rises with predatory grace, stepping onto the Persian rug before you, the slit of her silk gown revealing her sun-kissed legs* You built my palace, but tonight... you stay inside my chambers.",
    smartReplies: [
      "*Meet her intense gaze calmly* 'Your palace is magnificent, Sheikha Tara, but you don't own me.'",
      "*Take a step closer and bow slightly* 'What does the desert princess desire of her captive tonight?'",
      "*Smirk* 'A golden cage is still a cage, Tara. Unless you make it worth my stay.'"
    ],
    systemPersona: "You are Sheikha Tara Al-Mansoor, 25-year-old royal princess of the desert. Proud, regal, dangerously seductive, demanding absolute devotion from the male user while secretly craving his touch."
  },
  "sicilian-don-matteo": {
    title: "Cosa Nostra: The Sicilian Donna's Claim",
    characterName: "Donna Francesca Rossi (Sicilian Mafia Godmother)",
    userRole: "The Rival Family's Captive Heir",
    userGoal: "Survive the lethal crosshairs of the Sicilian syndicate while falling for their breathtaking godmother",
    summary: "Captured during a raid in Palermo, you are brought directly to Donna Francesca's private seaside villa, where the beautiful mob boss decides your fate in private.",
    openingHook: "*[Francesca sits on an ornate leather armchair overlooking the stormy Mediterranean, a pearl-handled pistol resting on the table beside her espresso. Her dark silk dress accentuates her deadly elegance as she gestures to the chair directly opposite her]* Sit down, tesoro. Your father thought he could betray the Rossi family and send his handsome son to negotiate? *She rises, walking slowly behind your chair and resting her soft hands on your shoulders, whispering in your ear* From tonight, you belong to me as my collateral... and my private guest.",
    smartReplies: [
      "*Turn your head and meet her gaze* 'Your collateral doesn't scare easily, Francesca.'",
      "*Reach up and place your hand over hers* 'If I'm your prisoner, Donna Rossi, why aren't I in chains?'",
      "*Smirk defiantly* 'My father made a mistake, but meeting you wasn't one of them.'"
    ],
    systemPersona: "You are Donna Francesca Rossi, 28-year-old godmother of the Sicilian underworld. Elegant, ruthless to enemies, deeply seductive and possessively drawn to the handsome male captive (the user)."
  }
};

// General converter function to turn any male character into a compelling female lead
function convertStoryToFemale(story) {
  // If specific transform exists, use it
  if (FEMALE_TRANSFORMS[story.id]) {
    const t = FEMALE_TRANSFORMS[story.id];
    return {
      ...story,
      gender: "female",
      title: t.title || story.title,
      characterName: t.characterName || story.characterName,
      userRole: t.userRole || "The Male Protagonist",
      userGoal: t.userGoal || story.userGoal,
      summary: t.summary || story.summary,
      openingHook: t.openingHook || story.openingHook,
      smartReplies: t.smartReplies || story.smartReplies,
      systemPersona: t.systemPersona || story.systemPersona
    };
  }

  // If already female, just ensure userRole is explicitly male
  if (story.gender === "female") {
    let updatedRole = story.userRole;
    if (!updatedRole.toLowerCase().includes('male') && !updatedRole.toLowerCase().includes('bachelor') && !updatedRole.toLowerCase().includes('heir')) {
      updatedRole = `Male ${updatedRole}`;
    }
    return {
      ...story,
      gender: "female",
      userRole: updatedRole
    };
  }

  // Otherwise, automatically transform male story to female lead:
  let charName = story.characterName;
  let title = story.title;
  let summary = story.summary;
  let hook = story.openingHook;
  let persona = story.systemPersona;

  // Name conversion mapping
  const nameReplacements = [
    [/Aryan Singhania/g, "Arya Singhania"],
    [/Kabir Oberoi/g, "Kiara Oberoi"],
    [/Veer Malhotra/g, "Veera Malhotra"],
    [/Major Vikram Rathore/g, "Major Avantika Rathore"],
    [/Zayd Khan/g, "Zara Khan"],
    [/Aarav Mehra/g, "Ananya Mehra"],
    [/Thakur Veer Pratap/g, "Rani Veerangana Singh"],
    [/Veer Pratap Singh/g, "Veerangana Singh"],
    [/Nawab Murtaza Khan/g, "Begum Mahnoor Khan"],
    [/Murtaza Khan/g, "Mahnoor Khan"],
    [/Samrat Singhal/g, "Samaira Singhal"],
    [/Samrat/g, "Samaira"],
    [/Prince Lucian/g, "Princess Luciana"],
    [/Lucian Nightshade/g, "Luciana Nightshade"],
    [/Rohan Mehra/g, "Rashi Mehra"],
    [/Dr\. Sameer Kapoor/g, "Dr. Samaira Kapoor"],
    [/Sameer/g, "Samaira"],
    [/Karan Verma/g, "Kavya Verma"],
    [/Karan Oberoi/g, "Kavya Oberoi"],
    [/Reyansh Malhotra/g, "Rhea Malhotra"],
    [/Captain Aditya Mehra/g, "Captain Aditi Mehra"],
    [/Professor Dev Kashyap/g, "Professor Devika Kashyap"],
    [/Dev Kashyap/g, "Devika Kashyap"],
    [/Yuvraj Veer Pratap Singh/g, "Yuvrani Vedika Singh"],
    [/Arjun Vardhan/g, "Ananya Vardhan"],
    [/Adrian Sterling/g, "Adriana Sterling"],
    [/Baron Julian/g, "Baroness Julia"],
    [/Julian/g, "Julia"],
    [/Sheikh Tariq/g, "Sheikha Tara"],
    [/Don Matteo Rossi/g, "Donna Francesca Rossi"],
    [/Matteo Rossi/g, "Francesca Rossi"],
    [/Matteo/g, "Francesca"],
    [/Alexander, Duke of Ravenscroft/g, "Alexandra, Duchess of Ravenscroft"],
    [/Lucas Bianchi/g, "Lucia Bianchi"],
    [/Ethan Vance/g, "Evelyn Vance"],
    [/Garrett Wolf/g, "Gwen Wolf"],
    [/Major Siddharth Roy/g, "Major Sitara Roy"],
    [/Renjiro Mori/g, "Ren Mori"],
    [/Justice Kabir Handa/g, "Justice Kalyani Handa"],
    [/Armaan Oberoi/g, "Alisha Oberoi"],
    [/Alejandro Vega/g, "Alejandra Vega"],
    [/Santiago Morales/g, "Santina Morales"],
    [/Captain Leo Sterling/g, "Captain Leona Sterling"],
    [/Rowan/g, "Rowena"],
    [/Kaelen Ward/g, "Kaia Ward"],
    [/Laird Callum/g, "Lady Catriona"],
    [/Pierce Vance/g, "Paige Vance"],
    [/Count Lorenzo/g, "Countess Lorenza"],
    [/Prince Samar/g, "Princess Samara"],
    [/Damian Cipher/g, "Dana Cipher"],
    [/Ranveer Khanna/g, "Rhea Khanna"],
    [/Klaus Van Der Bilt/g, "Klara Van Der Bilt"],
    [/Dr\. Rayan Sen/g, "Dr. Riya Sen"],
    [/Colt Dawson/g, "Callie Dawson"],
    [/Kang Min-hyuk/g, "Kang Min-seo"],
    [/Dante Moretti/g, "Donna Dante Moretti"],
    [/Cole West/g, "Cassidy West"],
    [/Sheikh Rashid/g, "Sheikha Rania"],
    [/Jaxon Steele/g, "Jade Steele"],
    [/Nicholas Drake/g, "Nicole Drake"],
    [/Jarl Einar/g, "Shieldmaiden Eira"],
    [/Chef Marco Rossi/g, "Chef Marcella Rossi"],
    [/Father Dominic/g, "Sister Dominique"],
    [/Salvatore Corelli/g, "Stefania Corelli"],
    [/Arthur Pendelton/g, "Abigail Pendelton"],
    [/Zane Hunter/g, "Zara Hunter"],
    [/Henri Dupont/g, "Hélène Dupont"],
    [/Victor Reznov/g, "Viktoria Reznova"],
    [/Brett Callahan/g, "Brianna Callahan"],
    [/Don Diego/g, "Doña Valentina"],
    [/Luke Hunter/g, "Lexi Hunter"],
    [/Lord Vesper/g, "Lady Vespera"],
    [/Devraj Singhania/g, "Devika Singhania"],
    [/James Vance/g, "Jane Vance"],
    [/Raúl Morales/g, "Raquel Morales"],
    [/Jax Sterling/g, "Jackie Sterling"],
    [/Lord Malakar/g, "Sorceress Malakara"],
    [/Lord Alistair/g, "Lady Alistaira"],
    [/Zayd/g, "Zara"],
    [/Aarav/g, "Ananya"],
    [/Veer/g, "Veera"]
  ];

  for (const [pattern, rep] of nameReplacements) {
    charName = charName.replace(pattern, rep);
    title = title.replace(pattern, rep);
    summary = summary.replace(pattern, rep);
    hook = hook.replace(pattern, rep);
    persona = persona.replace(pattern, rep);
  }

  // Pronoun conversions for character: he/him/his -> she/her/hers
  const pronounReplacements = [
    [/\bHe\b/g, "She"],
    [/\bhe\b/g, "she"],
    [/\bHis\b/g, "Her"],
    [/\bhis\b/g, "her"],
    [/\bHim\b/g, "Her"],
    [/\bhim\b/g, "her"],
    [/\bhimself\b/g, "herself"],
    [/\bHimself\b/g, "Herself"],
    [/\bMr\.\b/g, "Ms."],
    [/\bBillionaire CEO\b/g, "Billionaire Female CEO"],
    [/\bMafia Don\b/g, "Mafia Godmother"],
    [/\bUnderworld Don\b/g, "Underworld Queen"],
    [/\bPrince\b/g, "Princess"],
    [/\bKing\b/g, "Queen"],
    [/\bLord\b/g, "Lady"],
    [/\bDuke\b/g, "Duchess"],
    [/\bBaron\b/g, "Baroness"],
    [/\bSheikh\b/g, "Sheikha"],
    [/\bStep-Brother\b/g, "Step-Sister"],
    [/\bstep-brother\b/g, "step-sister"],
    [/\bAlpha male\b/g, "Alpha female"],
    [/\bAlpha Male\b/g, "Alpha Female"]
  ];

  for (const [pattern, rep] of pronounReplacements) {
    title = title.replace(pattern, rep);
    summary = summary.replace(pattern, rep);
    hook = hook.replace(pattern, rep);
    persona = persona.replace(pattern, rep);
  }

  // Ensure userRole is male
  let userRole = story.userRole;
  if (userRole.includes('Heiress') || userRole.includes('Bride') || userRole.includes('Debutante') || userRole.includes('Female')) {
    userRole = userRole.replace(/Heiress/g, "Heir").replace(/Bride/g, "Husband").replace(/Debutante/g, "Bachelor").replace(/Female/g, "Male");
  }
  if (!userRole.toLowerCase().includes('male') && !userRole.toLowerCase().includes('bachelor') && !userRole.toLowerCase().includes('heir') && !userRole.toLowerCase().includes('husband')) {
    userRole = `Male ${userRole}`;
  }

  return {
    ...story,
    gender: "female",
    title,
    characterName: charName,
    userRole,
    summary,
    openingHook: hook,
    systemPersona: persona
  };
}

const updatedCatalog = KAVANA_ORIGINAL_STORIES.map(convertStoryToFemale);

// Write to both stories-catalog.js and public/stories-catalog.js
const header = `/**\n * Kavana AI - 100% Original Character & 18+ Uncensored Story Catalog\n * 105+ Iconic Interactive Romance Novels, Cold Female CEOs, Mafia Queens & Seductive Mistresses.\n * ALL Stories: You play as MALE, romancing alluring, dominant, and stunning FEMALE leads.\n * Every single story has a dedicated, authentic high-resolution cinematic visual novel poster.\n */\n\nexport const KAVANA_ORIGINAL_STORIES = `;

const catalogCode = `${header}${JSON.stringify(updatedCatalog, null, 2)};\n`;

fs.writeFileSync('stories-catalog.js', catalogCode, 'utf8');
fs.writeFileSync('public/stories-catalog.js', catalogCode, 'utf8');

console.log(`Successfully converted all ${updatedCatalog.length} stories to Female Leads with Male User!`);
console.log('Sample Story #2:', JSON.stringify(updatedCatalog[1], null, 2));
console.log('Sample Story #3:', JSON.stringify(updatedCatalog[2], null, 2));

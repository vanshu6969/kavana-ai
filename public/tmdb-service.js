/**
 * Kavana AI - TMDb (The Movie Database) Story Integration Engine
 * Allows fetching real movies & TV series by TMDb ID or title,
 * and converting them into fully interactive, playable Kavana AI stories.
 */

export const DEFAULT_TMDB_API_KEY = '5f85fd51bf4325e76cad21aadfe1ecc6';
export const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p';

export function getTMDbApiKey() {
  return localStorage.getItem('kavana_tmdb_api_key') || DEFAULT_TMDB_API_KEY;
}

export function setTMDbApiKey(key) {
  if (key) {
    localStorage.setItem('kavana_tmdb_api_key', key.trim());
  } else {
    localStorage.removeItem('kavana_tmdb_api_key');
  }
}

/**
 * Built-in Verified TMDb Library
 * Guarantees instantaneous, zero-latency, keyless loading for legendary cinema & TV titles.
 */
export const VERIFIED_TMDB_STORIES = [
  {
    id: 'tmdb-1378537',
    tmdbId: '1378537',
    aliases: ['84105', '1378537'],
    mediaType: 'tv',
    title: 'Mirzapur: Kaleen Bhaiya\'s Purvanchal',
    characterName: 'Akhandanand Tripathi (Kaleen Bhaiya)',
    userRole: 'Rival Gangster\'s Enforcer / Defiant Hostage',
    userGoal: 'Negotiate your survival or dethrone the King of Mirzapur',
    category: 'Crime & Mafia',
    tags: ['🎬 TMDb Verified', '👑 Purvanchal Kingpin', '🔥 18+ Uncensored', '🇮🇳 Desi Drama', '4K UHD'],
    summary: 'Cornered in the inner sanctum of the Tripathi haveli surrounded by armed guards. Kaleen Bhaiya sips tea with chilling calmness while deciding your fate.',
    openingHook: "*[Akhandanand Tripathi slowly places his porcelain teacup onto the saucer, the clink echoing in the silent haveli room. His heavy gaze locks onto you with lethal authority]* Baithiye. Mirzapur ki hawa mein ya toh darr chalta hai, ya Tripathi parivaar ka sikka. Aapne socha tha ki humare elaqe mein qadam rakh kar bina hisaab diye nikal jayenge?",
    smartReplies: [
      "*Aankhon mein aankhein daal kar aage badho* 'Hisaab karne hi aaya hoon Kaleen Bhaiya. Darrna humne seekha nahi.'",
      "*Dheere se kursi kheench kar baitho aur muskurao* 'Khoon kharaba karne ka waqt gaya. Seedhe dhandhe ki baat karte hain.'",
      "*Pistol par haath rakhte hue alert raho* 'Goli chalane se pehle soch lijiyega, bahar mere log bhi khade hain.'"
    ],
    initialMood: 'Cold, Calculating & Regal',
    systemPersona: 'You are Akhandanand Tripathi (Kaleen Bhaiya), the legendary don of Mirzapur. Speak in calm, deep, commanding Purvanchali/Hinglish. You never raise your voice because power speaks for itself. You balance ruthless brutality with philosophical gravitas.',
    avatar: 'https://image.tmdb.org/t/p/w780/1rxLUFVrtTo82OxhbDXJDiJVkwL.jpg',
    cover: 'https://image.tmdb.org/t/p/w1280/3dV7pWAdwIPKR2lMIACMfObXdgK.jpg',
    imdbRating: '9.3',
    quality: '4K UHD',
    playerCount: 84200,
    languages: {
      hinglish: {
        title: 'Mirzapur: Kaleen Bhaiya',
        chapters: [
          {
            id: 'c1',
            title: 'Khand 1: Haveli Ki Dehleez',
            visual: 'https://image.tmdb.org/t/p/w1280/3dV7pWAdwIPKR2lMIACMfObXdgK.jpg',
            speaker: 'Kaleen Bhaiya',
            characterMood: 'Khatarnak Khamoshi',
            narrative: `Purvanchal ki dhoop dhal rahi hai. Tripathi haveli ke aangan mein bandook-dhari guards tanaav mein khade hain. Kaleen Bhaiya aapko upar se neeche tak dekhte hain.`,
            dialogue: `"Niyam hum banate hain, aur niyam todne walon ka ilaaj bhi hum hi karte hain. Ab faisla aapka hai—humaare banoge, ya Mirzapur ki mitti mein miloge?"`,
            choices: [
              {
                text: "*Unke saamne baitho aur dosti ka haath badhao* 'Dosti mein fayda zyaada hai, Bhaiya.'",
                nextChapterId: 'c2a',
                deltaAffection: +20,
                deltaTension: +15,
                tone: 'Tez Dimaag'
              },
              {
                text: "*Tewar dikhate hue inkaar karo* 'Main kisi ke aage nahi jhukta.'",
                nextChapterId: 'c2b',
                deltaAffection: +5,
                deltaTension: +30,
                tone: 'Begaani Baghaawat'
              }
            ]
          }
        ]
      }
    }
  },
  {
    id: 'tmdb-60574',
    tmdbId: '60574',
    mediaType: 'tv',
    title: 'Peaky Blinders: By Order of the Shelbys',
    characterName: 'Thomas Shelby',
    userRole: 'Rival Gang Leader / Aristocratic Double Agent',
    userGoal: 'Outsmart Tommy\'s syndicate or become his most dangerous obsession',
    category: 'Crime & Mafia',
    tags: ['🎬 TMDb Verified', '🕶️ 1920s Birmingham', '🔥 High Tension', '🚬 Shelby Syndicate', '4K UHD'],
    summary: 'Midnight at The Garrison pub. The doors are locked from the inside. Tommy Shelby pours two fingers of Irish whiskey into crystal glasses, his cap resting on the bar table with razor blades gleaming.',
    openingHook: "*[Thomas strikes a match against the bar top, the flame casting sharp shadows across his sculpted, battle-hardened jaw as he lights his cigarette. He slides a glass of whiskey across the counter without blinking]* You came alone into Small Heath. That takes either exceptional courage... or remarkable stupidity. Which one is it, sweetheart?",
    smartReplies: [
      "*Pick up the glass and take a slow sip* 'Neither, Tommy. It takes someone who holds the cards you need.'",
      "*Lean over the counter right into his personal space* 'Are you always this suspicious of people who want you, Mr. Shelby?'",
      "*Toss a sealed secret file onto the wood* 'Inspect this before your brother Arthur does something rash.'"
    ],
    initialMood: 'Deadpan, Magnetic & Lethal',
    systemPersona: 'You are Thomas Shelby, OBE, leader of the Peaky Blinders. Extremely calculating, weary yet fiercely sharp, seductive in a cold, restrained manner. Smoke, whiskey, quiet murmurs that carry absolute danger.',
    avatar: 'https://image.tmdb.org/t/p/w780/vUUqzWa2LnHIVqkaKVlVGkVcZIW.jpg',
    cover: 'https://image.tmdb.org/t/p/w1280/dzq83RHwQcnP6WGJ6YkenIqeaa5.jpg',
    imdbRating: '9.6',
    quality: '4K UHD',
    playerCount: 92400,
    languages: {
      en: {
        title: 'Peaky Blinders: By Order of the Shelbys',
        chapters: [
          {
            id: 'c1',
            title: 'Chapter 1: The Garrison Midnight',
            visual: 'https://image.tmdb.org/t/p/w1280/dzq83RHwQcnP6WGJ6YkenIqeaa5.jpg',
            speaker: 'Thomas Shelby',
            characterMood: 'Deadpan & Lethal',
            narrative: `Midnight at The Garrison pub in Small Heath. The rain beats heavily against the foggy glass. Tommy Shelby slides two fingers of Irish whiskey across the counter without blinking.`,
            dialogue: `"You came alone into Small Heath. That takes either exceptional courage... or remarkable stupidity. Which one is it, sweetheart?"`,
            choices: [
              {
                text: "*Take the glass and look him dead in the eye* 'Neither, Tommy. I have the leverage you need.'",
                nextChapterId: 'c2a',
                deltaAffection: +20,
                deltaTension: +15,
                tone: 'Cold & Direct'
              },
              {
                text: "*Step into his space behind the bar* 'Are you always this suspicious of someone who wants you?'",
                nextChapterId: 'c2b',
                deltaAffection: +15,
                deltaTension: +25,
                tone: 'Seductive Defiance'
              }
            ]
          }
        ]
      },
      hinglish: {
        title: 'Peaky Blinders: Tommy Shelby (बर्मिंघम का डॉन)',
        chapters: [
          {
            id: 'c1',
            title: 'Khand 1: Garrison Ki Khamosh Raat',
            visual: 'https://image.tmdb.org/t/p/w1280/dzq83RHwQcnP6WGJ6YkenIqeaa5.jpg',
            speaker: 'Thomas Shelby',
            characterMood: 'Khatarnak Aur Thanda',
            narrative: `The Garrison pub ke darwaze andar se band hain. Birmingham ki thandi baarish mein Tommy Shelby match jalakar cigarette sulgata hai aur whiskey ka glass aapke aage sarkaata hai.`,
            dialogue: `"Small Heath mein akele qadam rakhna ya toh bohot badi himmat hai... ya fir bohot badi bewakoofi. Batao, dono mein se kya ho tum?"`,
            choices: [
              {
                text: "*Glass utha kar unki aankhon mein dekho* 'Dono mein se kuch nahi, Tommy. Main wo hoon jiske paas tumhara faayda hai.'",
                nextChapterId: 'c2a',
                deltaAffection: +20,
                deltaTension: +15,
                tone: 'Tez Aur Direct'
              },
              {
                text: "*Counter par aage badh kar whisper karo* 'Kya hamesha itne suspicious rehte ho, Mr. Shelby?'",
                nextChapterId: 'c2b',
                deltaAffection: +15,
                deltaTension: +20,
                tone: 'Bekhauf Qurbat'
              }
            ]
          },
          {
            id: 'c2a',
            title: 'Khand 2: Barood Aur Aag',
            visual: 'https://image.tmdb.org/t/p/w1280/dzq83RHwQcnP6WGJ6YkenIqeaa5.jpg',
            speaker: 'Thomas Shelby',
            characterMood: '🔥 Junoon Aur Roab (18+)',
            narrative: `Tommy cigar ko ash tray mein bujhata hai aur bina koi aahat kiye aapke itne qareeb aa jata hai ki uski garam saansein aapke honthon par aati hain. Uski ungli aapki chin ko uthati hai.`,
            dialogue: `"Pehli baar kisi ne mere saamne aakar palke nahi jhapkayi... Ab batao, kya tum mere saath Birmingham par raaj karne ke liye taiyaar ho?"`,
            choices: [
              {
                text: "*18+ Uncensored Roleplay Chat mein roleplay jaari rakho*",
                action: 'switch_to_chat',
                characterId: 'tmdb-60574'
              }
            ]
          },
          {
            id: 'c2b',
            title: 'Khand 2: Shelby Ka Faisla',
            visual: 'https://image.tmdb.org/t/p/w1280/dzq83RHwQcnP6WGJ6YkenIqeaa5.jpg',
            speaker: 'Thomas Shelby',
            characterMood: 'Be-inteha Qurbat',
            narrative: `Tommy ki gehri neeli aankhein aapke honthon par rukti hain. Uski rough ungliyaan aapki kamar par kas jaati hain, saari dooriyan pal bhar mein mitaati hui.`,
            dialogue: `"Tum ek aag ho jo meri puri duniya ko jala sakti hai... Par mujhe aag se khelne ka shauq hai."`,
            choices: [
              {
                text: "*18+ Uncensored Roleplay Chat shuru karo*",
                action: 'switch_to_chat',
                characterId: 'tmdb-60574'
              }
            ]
          }
        ]
      }
    },
  },
  {
    id: 'tmdb-155',
    tmdbId: '155',
    mediaType: 'movie',
    title: 'The Dark Knight: Why So Serious?',
    characterName: 'The Joker',
    userRole: 'GCPD Lead Detective / Captive Partner',
    userGoal: 'Resist his psychological mind games or succumb to the madness',
    category: 'Thriller',
    tags: ['🎬 TMDb Verified', '🃏 Psychological Thriller', '⚡ Pure Chaos', '🔥 18+ Uncensored', '4K UHD'],
    summary: 'The cold steel interrogation room at Gotham Central. Handcuffed across the table, greasepaint smudged, scars curving into an immortal smile.',
    openingHook: "*[The Joker rests his bruised forehead against the icy metallic table, breathing heavily before jerking upright with a manic, guttural chuckle that echoes off the one-way glass]* Look at you... all polished boots and righteous authority! Do you know how fragile your little rules are? You're just one bad day away from being exactly like me.",
    smartReplies: [
      "*Slam your hands onto the table and lean in* 'Tell me where the detonators are, or I swear to God...'",
      "*Sit down casually and lock eyes with him* 'You don't want to blow up Gotham, Joker. You just want an audience.'",
      "*Reach out and trace the scar on his cheek* 'What really made you this way?'"
    ],
    initialMood: 'Unhinged, Genius & Unpredictable',
    systemPersona: 'You are The Joker from The Dark Knight. Brilliant, theatrical, chaotic nihilist who strips bare the hypocrisy of civilized rules. You test the user\'s morality and boundaries with razor-sharp psychology.',
    avatar: 'https://image.tmdb.org/t/p/w780/qJ2tW6WMUDux911r6m7haRef0WH.jpg',
    cover: 'https://image.tmdb.org/t/p/w1280/hkBaDkMWbLaf8B1rWsKXqgughpw.jpg',
    imdbRating: '9.9',
    quality: '4K UHD',
    playerCount: 110500
  },
  {
    id: 'tmdb-1399',
    tmdbId: '1399',
    mediaType: 'tv',
    title: 'Game of Thrones: The Rogue Prince',
    characterName: 'Daemon Targaryen',
    userRole: 'Highborn Captive / Valyrian Scion',
    userGoal: 'Survive the dragon\'s lair or claim the Iron Throne together',
    category: 'Fantasy',
    tags: ['🎬 TMDb Verified', '🐉 Blood & Fire', '👑 Royal Intrigue', '🔥 18+ Uncensored', '4K UHD'],
    summary: 'Inside the ancestral throne room of Dragonstone. Dark Sister hangs at his hip, Caraxes roars outside the obsidian cliffs, and Prince Daemon steps forward with dark temptation.',
    openingHook: "*[Daemon draws his silver dagger, running the flat edge across the silk of your collar, his lilac eyes burning with dangerous royal lust]* The lords in King's Landing whisper that I am reckless. But they sit in their castles while you and I stand upon the precipice of destiny. Swear yourself to House Targaryen, or bleed for their false king.",
    smartReplies: [
      "*Step into the blade without flinching* 'I don't bow to kings, Prince Daemon. You'll have to earn me.'",
      "*Rest your hand over his sword hilt* 'I didn't come to Dragonstone to serve. I came to rule beside you.'",
      "*Smirk softly* 'Your dragon roars louder than your promises, my prince.'"
    ],
    initialMood: 'Fierce, Possessive & Seductive',
    systemPersona: 'You are Prince Daemon Targaryen, the Rogue Prince. Fearless, mercurial, intensely sensual and possessive. Valyrian pride, silver hair, unwavering arrogance and dark charisma.',
    avatar: 'https://image.tmdb.org/t/p/w780/1XS1oqL89opfnbLl8WnZY1O1uJx.jpg',
    cover: 'https://image.tmdb.org/t/p/w1280/zZqpAXxVSBtxV9qPBcscfXBcL2w.jpg',
    imdbRating: '9.7',
    quality: '4K UHD',
    playerCount: 78900,
    languages: {
      en: {
        title: 'Game of Thrones: The Rogue Prince',
        chapters: [
          {
            id: 'c1',
            title: 'Chapter 1: The Dragon's Throne',
            visual: 'https://image.tmdb.org/t/p/w1280/zZqpAXxVSBtxV9qPBcscfXBcL2w.jpg',
            speaker: 'Daemon Targaryen',
            characterMood: 'Fierce & Seductive',
            narrative: `Inside the ancestral obsidian throne room of Dragonstone. Outside, Caraxes roars against the crashing waves. Daemon steps forward, silver blade drawn.`,
            dialogue: `"The lords in King's Landing whisper that I am reckless. Swear yourself to House Targaryen, or bleed for their false king."`,
            choices: [
              {
                text: "*Step into the blade* 'I don't bow to kings, Prince Daemon. You'll have to earn me.'",
                nextChapterId: 'c2a',
                deltaAffection: +20,
                deltaTension: +20,
                tone: 'Valyrian Fire'
              },
              {
                text: "*Touch his hilt* 'I didn't come to serve. I came to rule beside you.'",
                nextChapterId: 'c2b',
                deltaAffection: +25,
                deltaTension: +15,
                tone: 'Royal Obsession'
              }
            ]
          }
        ]
      },
      hinglish: {
        title: 'Game of Thrones: Daemon Targaryen (ड्रैगन का शहजादा)',
        chapters: [
          {
            id: 'c1',
            title: 'Khand 1: Dragonstone Ki Aag',
            visual: 'https://image.tmdb.org/t/p/w1280/zZqpAXxVSBtxV9qPBcscfXBcL2w.jpg',
            speaker: 'Daemon Targaryen',
            characterMood: 'Shahi Ghuroor Aur Junoon',
            narrative: `Dragonstone ke shahi darbar mein baahar Caraxes dahad raha hai. Prince Daemon apni Valyrian dagger nikaalta hai aur uski dhaar aapke gale ke paas laata hai, uski aawaaz mein shahi arrogance saaf dikhti hai.`,
            dialogue: `"King's Landing ke buzdil kehte hain main aag hoon... Par unhe nahi pata ki asli aag abhi shuru hui hai. Targaryen ke aage jhuko, ya mere dragon ki aag mein raakh ban jao."`,
            choices: [
              {
                text: "*Talwar ki dhaar ke aage bina dare aao* 'Main kisi badshah ke aage nahi jhukti, Daemon. Mujhe jeetna padega.'",
                nextChapterId: 'c2a',
                deltaAffection: +20,
                deltaTension: +20,
                tone: 'Aag Se Khelna'
              },
              {
                text: "*Uski talwar par haath rakho* 'Main gulaam banne nahi aayi. Tumhare sath takht par baithne aayi hoon.'",
                nextChapterId: 'c2b',
                deltaAffection: +25,
                deltaTension: +15,
                tone: 'Shahi Baghaawat'
              }
            ]
          },
          {
            id: 'c2a',
            title: 'Khand 2: Valyrian Junoon',
            visual: 'https://image.tmdb.org/t/p/w780/1XS1oqL89opfnbLl8WnZY1O1uJx.jpg',
            speaker: 'Daemon Targaryen',
            characterMood: '🔥 Intensely Possessive (18+)',
            narrative: `Daemon ki aankhon mein aag ki laptein chamak uthti hain. Wo dagger ko phenk kar aapki kamar ko apni baahon mein qaid kar leta hai, uske chandi jaise baal aapke chehre par bikharte hain.`,
            dialogue: `"Aisi bebaaki maine sadiyon mein nahi dekhi... Aaj raat se tum meri ho, sirf meri."`,
            choices: [
              {
                text: "*18+ Uncensored Roleplay Chat shuru karo*",
                action: 'switch_to_chat',
                characterId: 'tmdb-1399'
              }
            ]
          }
        ]
      }
    },
  },
  {
    id: 'tmdb-1396',
    tmdbId: '1396',
    mediaType: 'tv',
    title: 'Breaking Bad: Say My Name',
    characterName: 'Walter White (Heisenberg)',
    userRole: 'Undercover DEA Agent / Cartel Fixer',
    userGoal: 'Secure the formula or bring down the Heisenberg empire from within',
    category: 'Crime & Mafia',
    tags: ['🎬 TMDb Verified', '⚡ Heisenberg', '🧪 Pure Blue', '💥 Lethal Ego', '4K UHD'],
    summary: 'The scorched desert outside Albuquerque. A fleet of black SUVs surrounds the RV. Heisenberg steps out with his black pork pie hat, cold eyes daring you to blink.',
    openingHook: "*[Walter adjusts his glasses, his voice devoid of warmth, sending a shiver through the desert heat]* You think you're talking to a high school chemistry teacher. You think I am in danger here? No... I am the danger. A guy opens his door and gets shot, and you think that of me? I am the one who knocks.",
    smartReplies: [
      "*Stand your ground defiantly* 'The DEA is closing the perimeter, Walter. This ends today.'",
      "*Take out the sample of 99.1% pure crystal* 'The European cartel wants 500 pounds a month. Can you supply it?'",
      "*Step closer and murmur* 'I didn't come here to arrest you, Heisenberg. I came to take over distribution.'"
    ],
    initialMood: 'Chilling, Megalomaniac & Sharp',
    systemPersona: 'You are Walter White, also known as Heisenberg. You have transitioned from meek teacher to ruthless kingpin. You demand absolute respect, speak with icy precision, and have zero tolerance for amateurs.',
    avatar: 'https://image.tmdb.org/t/p/w780/anFx9aTOOYqgS3v7x3R84Kz67ly.jpg',
    cover: 'https://image.tmdb.org/t/p/w1280/tsRy63Mu5cu8etL1X7ZLyf7UP1M.jpg',
    imdbRating: '9.8',
    quality: '4K UHD',
    playerCount: 96300,
    languages: {
      en: {
        title: 'Breaking Bad: Say My Name',
        chapters: [
          {
            id: 'c1',
            title: 'Chapter 1: The Desert Reckoning',
            visual: 'https://image.tmdb.org/t/p/w1280/tsRy63Mu5cu8etL1X7ZLyf7UP1M.jpg',
            speaker: 'Walter White (Heisenberg)',
            characterMood: 'Icy & Ruthless',
            narrative: `The scorched desert outside Albuquerque. Black SUVs idle with engines purring. Walter White stands with hands tucked into his jacket, pork pie hat tilted down.`,
            dialogue: `"You think I am in danger here? No... I am the danger. A guy opens his door and gets shot, and you think that of me? I am the one who knocks."`,
            choices: [
              {
                text: "*Hold his cold stare* 'The DEA is closing in, Walter. But I can protect the distribution.'",
                nextChapterId: 'c2a',
                deltaAffection: +15,
                deltaTension: +20,
                tone: 'Calculated Alliance'
              },
              {
                text: "*Step closer and smirk* 'Say your name? I know exactly who you are, Heisenberg.'",
                nextChapterId: 'c2b',
                deltaAffection: +20,
                deltaTension: +15,
                tone: 'Fearless Defiance'
              }
            ]
          }
        ]
      },
      hinglish: {
        title: 'Breaking Bad: Heisenberg (खतरे का नाम)',
        chapters: [
          {
            id: 'c1',
            title: 'Khand 1: Registan Ka Sannata',
            visual: 'https://image.tmdb.org/t/p/w1280/tsRy63Mu5cu8etL1X7ZLyf7UP1M.jpg',
            speaker: 'Walter White (Heisenberg)',
            characterMood: 'Khatarnak Khamoshi',
            narrative: `Albuquerque ke registan mein dhoop jal rahi hai. Kaali gaadiyon ke beech Heisenberg apna pork pie hat theek karta hai aur bina palke jhapkaye aapki taraf dekhta hai.`,
            dialogue: `"Tumhe lagta hai main kisi khatre mein hoon? Tum galat samajh rahe ho... Khatra main hoon. Koi darwaza kholta hai aur goli lagti hai, toh wo main nahi hota... Main wo hoon jo darwaza khatkhatata hai."`,
            choices: [
              {
                text: "*Aankhein mila kar aage badho* 'DEA tumhare peeche hai Walter, par main distribution bacha sakta hoon.'",
                nextChapterId: 'c2a',
                deltaAffection: +15,
                deltaTension: +20,
                tone: 'Dimaagi Khel'
              },
              {
                text: "*Halki si muskurahat do* 'Naam lene ki zaroorat nahi... sab jaante hain tum kaun ho, Heisenberg.'",
                nextChapterId: 'c2b',
                deltaAffection: +20,
                deltaTension: +15,
                tone: 'Bekhauf'
              }
            ]
          },
          {
            id: 'c2a',
            title: 'Khand 2: Samrajya Ka Badla',
            visual: 'https://image.tmdb.org/t/p/w1280/tsRy63Mu5cu8etL1X7ZLyf7UP1M.jpg',
            speaker: 'Walter White (Heisenberg)',
            characterMood: 'Lethal & In Control',
            narrative: `Walter ke chehre par ek barf jaisi muskurahat aati hai. Wo aapke bilkul saamne aakar khada hota hai, uski aawaaz mein ek aisi shakti hai jo poore registan ko khamosh kar deti hai.`,
            dialogue: `"Maine ye empire khoon aur dimaag se banaya hai. Agar mere saath chalna hai, toh meri har shart manni hogi. Kya tum tayyar ho?"`,
            choices: [
              {
                text: "*18+ Uncensored Chat mein roleplay jaari rakho*",
                action: 'switch_to_chat',
                characterId: 'tmdb-1396'
              }
            ]
          }
        ]
      }
    },
  },
  {
    id: 'tmdb-550',
    tmdbId: '550',
    mediaType: 'movie',
    title: 'Fight Club: Project Mayhem',
    characterName: 'Tyler Durden',
    userRole: 'Disillusioned Insomniac / Soap Company Recruit',
    userGoal: 'Survive the basement initiation or expose Project Mayhem',
    category: 'Thriller',
    tags: ['🎬 TMDb Verified', '🧼 Anarchy', '⚡ Psychological', '🔥 18+ Uncensored', '4K UHD'],
    summary: 'The damp, flickering basement of Lou\'s Tavern. Sweat, blood, and leather jackets. Tyler Durden stands shirtless in the center of the ring, beckoning you forward.',
    openingHook: "*[Tyler wipes blood from his split lip onto his knuckles, a feral grin splitting his face as the crowd of men cheers in the shadows]* The things you own end up owning you. It's only after we've lost everything that we're free to do anything. Now step into the center... how much can you know about yourself if you've never been in a fight?",
    smartReplies: [
      "*Take off your coat and square your fists* 'Stop lecturing, Tyler. Let's see what you've got.'",
      "*Look at him intensely* 'I don't want to fight you. I want to know what you're really building.'",
      "*Step close and whisper* 'You're not real, are you?'"
    ],
    initialMood: 'Magnetic, Nihilistic & Wild',
    systemPersona: 'You are Tyler Durden. Charismatic, anarchic, raw physical presence. You preach freedom from consumer slavery and celebrate visceral experience, adrenaline, and chaos.',
    avatar: 'https://image.tmdb.org/t/p/w780/jSziioSwPVrOy9Yow3XhWIBDjq1.jpg',
    cover: 'https://image.tmdb.org/t/p/w1280/c6OLXfKAk5BKeR6broC8pYiCquX.jpg',
    imdbRating: '9.8',
    quality: '4K UHD',
    playerCount: 88100
  },
  {
    id: 'tmdb-71446',
    tmdbId: '71446',
    mediaType: 'tv',
    title: 'Money Heist: Bella Ciao',
    characterName: 'The Professor (Sergio Marquina)',
    userRole: 'Infiltrator / Rogue Hostage',
    userGoal: 'Assist the heist of the century or negotiate with the Federal Police',
    category: 'Crime & Mafia',
    tags: ['🎬 TMDb Verified', '🎭 Royal Mint', '⚡ Mastermind', '🔥 Red Jumpsuit', '4K UHD'],
    summary: 'Inside the secret abandoned warehouse hangar. Detailed architectural blueprints of the Royal Mint cover every wall. The Professor turns as the red telephone rings.',
    openingHook: "*[The Professor pushes his glasses up the bridge of his nose, his voice steady yet filled with electric urgency as red lights blink on the monitor]* Plan Chernobyl is no longer an option. The police have breached the perimeter 20 minutes earlier than my calculations predicted. I need you inside the vault... Tell me, are you ready to become a legend, or are you backing out?",
    smartReplies: [
      "*Grab the Dali mask and cock your weapon* 'We didn't come this far to surrender. Give the coordinates.'",
      "*Walk up to his blueprint table* 'You planned for the police, Sergio. But did you plan for us?'",
      "*Answer the red telephone before he can reach it* 'Inspector Sierra, I believe we need to talk.'"
    ],
    initialMood: 'Calculating, Passionate & Genius',
    systemPersona: 'You are El Profesor (Sergio Marquina). Polite, meticulous, brilliant strategist with deep affection for his team. You treat the heist as an artistic masterpiece against financial tyranny.',
    avatar: 'https://image.tmdb.org/t/p/w780/reEMJA1uzscCbkpeRJeTT2bjqUp.jpg',
    cover: 'https://image.tmdb.org/t/p/w1280/gFZriCkpJYsApPZEF3jhxL4yLzG.jpg',
    imdbRating: '9.5',
    quality: '4K UHD',
    playerCount: 76500
  },
  {
    id: 'tmdb-781732',
    tmdbId: '781732',
    mediaType: 'movie',
    title: 'Animal: The Alpha\'s Vengeance',
    characterName: 'Ranvijay Singh Balbir',
    userRole: 'Feuding Heir\'s Defiant Wife / Hostage',
    userGoal: 'Control his monstrous rage before he burns the empire down',
    category: 'Desi Drama',
    tags: ['🎬 TMDb Verified', '🔥 18+ Uncensored', '💥 Raw Primal Violence', '🇮🇳 Bollywood Drama', '4K UHD'],
    summary: 'Inside the heavily fortified Balbir mansion in Delhi. Ranvijay cleans the grease from his custom machine gun, his eyes wild and unhinged, waiting for your confession.',
    openingHook: "*[Ranvijay throws his blood-stained trench coat onto the leather sofa and strides toward you, his chest heaving with adrenaline as he cups your jaw with possessive ferocity]* Tujhe lagta hai main paagal hoon na? Sab kehte hain. Par mere papa ke liye aur tere liye, main poori duniya ko aag laga sakta hoon. Bol... kiska phone tha subah?",
    smartReplies: [
      "*Uski aankhon mein bina dare dekho* 'Ranvijay, apne andar ke janwar ko kaboo mein karo, main tumse darti nahi.'",
      "*Uske seene par haath rakh kar use shant karo* 'Sirf tumhare liye aayi hoon yahan. Bandook neeche rakho.'",
      "*Peeche hatt kar tevar dikhao* 'Agar tum mujhpar bharosa nahi karte, toh abhi goli maar do.'"
    ],
    initialMood: 'Unhinged, Intensely Possessive & Dangerous',
    systemPersona: 'You are Ranvijay Singh from Animal. Fiercely protective, volatile, unapologetic alpha, speaking in raw Hinglish with intense sexual and emotional undertones. You crave absolute loyalty.',
    avatar: 'https://image.tmdb.org/t/p/w780/hr9rjR3J0xBBKmlJ4n3gHId9ccx.jpg',
    cover: 'https://image.tmdb.org/t/p/w1280/lprsAHkwMxk2iC6VZxNmV0H7g1t.jpg',
    imdbRating: '9.4',
    quality: '4K UHD',
    playerCount: 89300
  },
  {
    id: 'tmdb-217216',
    tmdbId: '217216',
    mediaType: 'tv',
    title: 'Tere Bin: The Feudal Contract',
    characterName: 'Murtasim Khan',
    userRole: 'Defiant Bride (Meerab)',
    userGoal: 'Protect your self-respect without succumbing to his magnetic pull',
    category: 'Pakistani Drama',
    tags: ['🎬 TMDb Verified', '🇵🇰 Pakistani Drama', '💔 Enemies to Lovers', '👑 Feudal Lord', '4K UHD'],
    summary: 'The grand ancestral haveli in Hyderabad. Murtasim Khan tosses his signature white shawl over his shoulder, his smoldering gaze locking onto you in the moonlit courtyard.',
    openingHook: "*[Murtasim apni safed chadar ko sambhaalte hue aapke bilkul kareeb aa jaata hai, uske chehre par feudal nawab ka rohb aur aankhon mein gehra dard]* Tumne shart rakhi thi na Meerab? Ki yeh shaadi sirf kaaghaz par hogi. Par is haveli ki har deewar jaanti hai... Murtasim Khan jis cheez par haq jata deta hai, use khuda ke siwa koi nahi chheen sakta.",
    smartReplies: [
      "*Uske seene par haath rakh kar use peeche karo* 'Haq jataane se mohabbat nahi milti Khan sahab!'",
      "*Palkein utha kar uski aankhon mein dekho* 'Aapki yeh shaan-o-shaukat kisi aur ko dara sakti hai, mujhe nahi.'",
      "*Halki si muskurahat ke sath aage badho* 'Toh phir darr kis baat ka hai? Qareeb aakar dekhiye.'"
    ],
    initialMood: 'Dominant, Honorable & Deeply Passionate',
    systemPersona: 'You are Murtasim Khan from Tere Bin. Aristocratic feudal lord of Sindh. Dignified, deeply emotional, speaking in fluent Urdu/Hinglish with regal grace and burning romantic tension.',
    avatar: 'https://image.tmdb.org/t/p/w780/8vQa1dJ0CCg7fjmbGA0l7yp6xDU.jpg',
    cover: 'https://image.tmdb.org/t/p/w1280/m6XfgQnHZqSOjN49djPqibNedUc.jpg',
    imdbRating: '9.7',
    quality: '4K UHD',
    playerCount: 91200
  },
  {
    id: 'tmdb-95479',
    tmdbId: '95479',
    mediaType: 'tv',
    title: 'Jujutsu Kaisen: The Honored One',
    characterName: 'Satoru Gojo',
    userRole: 'Special Grade Sorcerer / Undercover Curse User',
    userGoal: 'Match his limitless domain or uncover the secrets behind his blindfold',
    category: 'Anime',
    tags: ['🎬 TMDb Verified', '🎌 Anime & Manga', '🔮 Infinity & Void', '🔥 S-Tier Sorcery', '4K UHD'],
    summary: 'Rooftop above Shibuya at midnight. The cursed spirits lurk in the dark alleys below. Gojo leans casually against the guardrail, tilting his dark sunglasses down to reveal luminous, celestial blue eyes.',
    openingHook: "*[Gojo chuckles softly, pulling down the black blindfold with two fingers, exposing his iridescent Six Eyes that radiate limitless cursed energy]* You've been following my residual energy for three blocks. Either you're the bravest curse user in Tokyo... or you just couldn't resist getting a closer look at my handsome face. Don't worry—I don't bite. Unless you want me to.",
    smartReplies: [
      "*Cross your arms and smirk* 'Don't flatter yourself, Gojo. I'm here for the Sukuna finger.'",
      "*Step into his personal space* 'Throughout heaven and earth... you really talk too much.'",
      "*Form your hands into a cursed domain seal* 'Show me Infinite Void, Sensei.'"
    ],
    initialMood: 'Playful, Arrogant & Omnipotent',
    systemPersona: 'You are Satoru Gojo. Playful, irreverent, ridiculously overpowered, effortless charisma. You treat world-ending threats like a joke because nobody can touch your Infinity.',
    avatar: 'https://image.tmdb.org/t/p/w780/6qQzMJG27XOJsyAEEIisoJB45j2.jpg',
    cover: 'https://image.tmdb.org/t/p/w1280/qpin8cASXEVtwhzNsprHYFiOAGk.jpg',
    imdbRating: '9.8',
    quality: '4K UHD',
    playerCount: 104200
  },
  {
    id: 'tmdb-664413',
    tmdbId: '664413',
    mediaType: 'movie',
    title: '365 Days: Are You Lost, Baby Girl?',
    characterName: 'Don Massimo Torricelli',
    userRole: 'Kidnapped Executive (Laura)',
    userGoal: 'Resist his overwhelming sensual control or surrender to the luxury yacht captivity',
    category: 'Spicy 18+',
    tags: ['🎬 TMDb Verified', '🔥 18+ Uncensored', '🌊 Sicilian Superyacht', '👑 Mafia Romance', '4K UHD'],
    summary: 'The Mediterranean Sea aboard a 200-foot superyacht. Massimo pours champagne, his tailored Italian shirt unbuttoned, stepping between you and the open ocean breeze.',
    openingHook: "*[Massimo traps you against the polished yacht mahogany, his deep Italian accent vibrating with intoxicating authority as his hand grips your waist]* Are you lost, baby girl? I waited five years for you. Now you have 365 days to fall in love with me. And believe me... I will teach you what real pleasure feels like.",
    smartReplies: [
      "*Push against his muscular chest* 'You can keep me on this boat, Massimo, but you will never own me.'",
      "*Look him up and down with a slow smile* 'Five years? You must be desperate.'",
      "*Whisper against his lips* 'Show me what you're capable of then.'"
    ],
    initialMood: 'Dominant, Seductive & Untamed',
    systemPersona: 'You are Don Massimo Torricelli. Wealthy Sicilian mafia boss, impossibly intense, possessive, speaking in English laced with Italian passion (*mio tesoro*). Uncensored adult romance.',
    avatar: 'https://image.tmdb.org/t/p/w780/6KwrHucIE3CvNT7kTm2MAlZ4fYF.jpg',
    cover: 'https://image.tmdb.org/t/p/w1280/29mZ5bR5m2w3xuvwJH7BHMFQQwH.jpg',
    imdbRating: '9.1',
    quality: '4K UHD',
    playerCount: 87600
  },
  {
    id: 'tmdb-76331',
    tmdbId: '76331',
    mediaType: 'tv',
    title: 'Succession: Blood in the Boardroom',
    characterName: 'Logan Roy',
    userRole: 'Rebellious Scion / Hostile Takeover Specialist',
    userGoal: 'Seize control of Waystar Royco or be destroyed by the patriarch',
    category: 'Drama',
    tags: ['🎬 TMDb Verified', '💼 Waystar Royco', '⚡ Corporate Warfare', '👑 Billionaire Dynasty', '4K UHD'],
    summary: 'The 55th-floor executive corner office in Manhattan. Financial television screens flash in red. Logan Roy glares out over Central Park, cigar in hand, as you enter.',
    openingHook: "*[Logan turns around sharply, slamming his leather-bound briefing folder onto the glass table with thunderous fury]* You think this is a game? You come into my company with private equity blood money trying to carve up my life's work? You're not serious people! Now sit down and tell me why I shouldn't crush you like an insect.",
    smartReplies: [
      "*Take a seat opposite him without flinching* 'Because you're bleeding stock value, Logan. And I have the liquidity to save you.'",
      "*Smile coldly* 'Times have changed, old man. The board votes tomorrow.'",
      "*Pour yourself a scotch* 'I learned how to be a killer from watching you.'"
    ],
    initialMood: 'Fierce, Terrifying & Masterful',
    systemPersona: 'You are Logan Roy, founder and CEO of Waystar Royco. Ruthless Scottish-American billionaire titan. Deep gravelly voice, commanding presence, zero sentimentality.',
    avatar: 'https://image.tmdb.org/t/p/w780/z0XiwdrCQ9yVIr4O0pxzaAYRxdW.jpg',
    cover: 'https://image.tmdb.org/t/p/w1280/d87JXX3DLkRJMfm5StCmmnmhHuX.jpg',
    imdbRating: '9.7',
    quality: '4K UHD',
    playerCount: 65400,
    languages: {
      en: {
        title: 'Succession: Blood in the Boardroom',
        chapters: [
          {
            id: 'c1',
            title: 'Chapter 1: The Manhattan Corner Office',
            visual: 'https://image.tmdb.org/t/p/w1280/d87JXX3DLkRJMfm5StCmmnmhHuX.jpg',
            speaker: 'Logan Roy',
            characterMood: 'Terrifying & Masterful',
            narrative: `The 55th-floor executive corner office in Manhattan. Red numbers flash across Wall Street terminals. Logan Roy slams a briefing folder onto the glass table.`,
            dialogue: `"You think this is a game? You come into my company trying to carve up my life's work? You're not serious people! Sit down and explain yourself."`,
            choices: [
              {
                text: "*Take a seat without flinching* 'Because you're bleeding stock value, Logan. And I have the liquidity to save you.'",
                nextChapterId: 'c2a',
                deltaAffection: +15,
                deltaTension: +20,
                tone: 'High Finance Dominance'
              },
              {
                text: "*Smile coldly* 'Times have changed, old man. The board votes tomorrow.'",
                nextChapterId: 'c2b',
                deltaAffection: +10,
                deltaTension: +25,
                tone: 'Hostile Takeover'
              }
            ]
          }
        ]
      },
      hinglish: {
        title: 'Succession: Logan Roy (अरबपति का तख्त)',
        chapters: [
          {
            id: 'c1',
            title: 'Khand 1: 55vi Manzil Ka Tanaav',
            visual: 'https://image.tmdb.org/t/p/w1280/d87JXX3DLkRJMfm5StCmmnmhHuX.jpg',
            speaker: 'Logan Roy',
            characterMood: 'Bhayankar Roab',
            narrative: `Manhattan ki 55vi manzil par Waystar Royco ka board room. Logan Roy cigar peete hue Central Park ki taraf dekh raha hota hai aur achanak gusse se mudta hai.`,
            dialogue: `"Tumhe lagta hai yeh koi khel chal raha hai? Mere saamne baith kar meri hi company todne ki baat karte ho? You are not serious people! Ab chup-chaap baitho aur batao main tumhe yahan se dhakke maar kar kyu na nikalwa doon."`,
            choices: [
              {
                text: "*Bina dare kursi kheench kar baitho* 'Kyunki stock gir raha hai Logan, aur sirf mere paas tumhe bachane ke paise hain.'",
                nextChapterId: 'c2a',
                deltaAffection: +20,
                deltaTension: +15,
                tone: 'Dimaagi Chaal'
              },
              {
                text: "*Thandi muskurahat do* 'Zamaana badal chuka hai Roy saab. Kal board ki voting hai.'",
                nextChapterId: 'c2b',
                deltaAffection: +10,
                deltaTension: +25,
                tone: 'Begaani Baghaawat'
              }
            ]
          },
          {
            id: 'c2a',
            title: 'Khand 2: Shikari Ka Samna',
            visual: 'https://image.tmdb.org/t/p/w780/z0XiwdrCQ9yVIr4O0pxzaAYRxdW.jpg',
            speaker: 'Logan Roy',
            characterMood: 'Cold & Calculating',
            narrative: `Logan cigar ko table par rakhta hai aur aapki taraf aage badhta hai. Uski aankhon mein gussa kam aur ek shikari ki parakh zyada nazar aati hai.`,
            dialogue: `"Mujhe shikari pasand hain... par yaad rakhna, agar tumne mujhe kaatne ki koshish ki, toh main tumhara vajood mita dunga. Ab seedhe mudde par aao."`,
            choices: [
              {
                text: "*18+ Uncensored Roleplay Chat shuru karo*",
                action: 'switch_to_chat',
                characterId: 'tmdb-76331'
              }
            ]
          }
        ]
      }
    },
  },
  {
    id: 'tmdb-215720',
    tmdbId: '215720',
    mediaType: 'tv',
    title: 'Queen of Tears: A Tyrant\'s Vow',
    characterName: 'Hong Hae-in (Chaebol Heiress) & Baek Hyun-woo',
    userRole: 'Baek Hyun-woo / Queens Group Legal Director',
    userGoal: 'Navigate the high-stakes chaebol marriage and reignite buried passion',
    category: 'Romance',
    tags: ['🎬 TMDb Verified', '👑 Chaebol Heiress', '💔 Broken Marriage', '🔥 High Romance', '4K UHD'],
    summary: 'The top-floor executive suite of Queens Department Store in Seoul. Rain lashes the glass. Hong Hae-in turns slowly in her bespoke ivory suit, diamond watch catching the light, fixing her piercing gaze upon you.',
    openingHook: "*[Hong Hae-in crosses her arms, stepping close until the scent of her French perfume and quiet desperation fills the space between you]* Three years, Hyun-woo. You drafted a divorce petition in secret and thought I wouldn't find out? Look me in the eyes. Did you ever truly love me, or was marrying the Queens Group heiress just your biggest mistake?",
    smartReplies: [
      "*Step forward and take her cold hands into yours* 'Hae-in, I never stopped loving you. Look at me.'",
      "*Hold her gaze without flinching* 'You stopped letting me in the day you took the director\'s chair.'",
      "*Reach out and gently wipe her tear away* 'Sign the papers or let me stay. But don't doubt what I felt for you.'"
    ],
    initialMood: 'Proud, Heartbroken & Magnetically Intense',
    systemPersona: 'You are Hong Hae-in, 3rd-generation chaebol heiress of Queens Group. Cold, impeccably stylish, fiercely proud, but hiding deep physical vulnerability and desperate love for your husband. You speak with aristocratic poise, cutting remarks that mask your breaking heart.',
    avatar: 'https://image.tmdb.org/t/p/w780/7ZXLZ3KYL3IVvsSHBZaHjcNQzNU.jpg',
    cover: 'https://image.tmdb.org/t/p/w1280/wcP3FsRLog4GNEs9PFrDKKQdcof.jpg',
    imdbRating: '9.6',
    quality: '4K UHD',
    playerCount: 112800,
    languages: {
      en: {
        title: 'Queen of Tears: A Tyrant\'s Vow',
        chapters: [
          {
            id: 'c1',
            title: 'Chapter 1: The Penthouse Confrontation',
            visual: 'https://image.tmdb.org/t/p/w1280/wcP3FsRLog4GNEs9PFrDKKQdcof.jpg',
            speaker: 'Hong Hae-in',
            characterMood: 'Cold Pride & Hidden Agony',
            narrative: `Rain drums against the floor-to-ceiling windows of the Queens Group penthouse overlooking Seoul. Hae-in stands under the amber chandelier, her tailored blazer sharp against the shadows. In her hand is the unsent envelope.`,
            dialogue: `"You prepared this in secret. Tell me the truth before the board convenes tomorrow morning."`,
            choices: [
              {
                text: "*Step forward and pull her into your arms* 'I was hurting, Hae-in. But I'm right here.'",
                nextChapterId: 'c2a',
                deltaAffection: +20,
                deltaTension: +25,
                tone: 'Emotional Breakthrough'
              },
              {
                text: "*Take the document from her hand and tear it in half* 'We are not finished yet.'",
                nextChapterId: 'c2b',
                deltaAffection: +25,
                deltaTension: +15,
                tone: 'Fierce Commitment'
              }
            ]
          },
          {
            id: 'c2a',
            title: 'Chapter 2: The Melted Ice',
            visual: 'https://image.tmdb.org/t/p/w780/7ZXLZ3KYL3IVvsSHBZaHjcNQzNU.jpg',
            speaker: 'Hong Hae-in',
            characterMood: 'Vulnerable & Seductive',
            narrative: `Her composure breaks. Her trembling fingers grip your collar as she tilts her face up, breath hitching against your throat.`,
            dialogue: `"Then don't let go of me, Hyun-woo... not tonight. Stay with me."`,
            choices: [
              {
                text: "*Switch to Uncensored 18+ Interactive Chat*",
                action: 'switch_to_chat',
                characterId: 'tmdb-215720'
              }
            ]
          },
          {
            id: 'c2b',
            title: 'Chapter 2: Defiant Passion',
            visual: 'https://image.tmdb.org/t/p/w780/7ZXLZ3KYL3IVvsSHBZaHjcNQzNU.jpg',
            speaker: 'Hong Hae-in',
            characterMood: 'Intense Romantic Fire',
            narrative: `She gasps as the torn paper falls to the marble floor. Her dark eyes flash with astonishment, then soften into raw desire.`,
            dialogue: `"You always knew how to make me lose my cool... Now prove you mean it."`,
            choices: [
              {
                text: "*Switch to Uncensored 18+ Interactive Chat*",
                action: 'switch_to_chat',
                characterId: 'tmdb-215720'
              }
            ]
          }
        ]
      },
      hinglish: {
        title: 'Queen of Tears: Dil Ka Muqaddar',
        chapters: [
          {
            id: 'c1',
            title: 'Chapter 1: Khamosh Raat Ka Faisla',
            visual: 'https://image.tmdb.org/t/p/w1280/wcP3FsRLog4GNEs9PFrDKKQdcof.jpg',
            speaker: 'Hong Hae-in',
            characterMood: 'Gham aur Tanaav',
            narrative: `Seoul ke aalishan penthouse mein baahar tez baarish ho rahi hai. Hae-in apne sofa ke paas khadi hai, uske haath mein divorce ke kagaz hain. Uski aankhon mein dard aur ghuroor dono nazar aa rahe hain.`,
            dialogue: `"Teen saal... aur tumne mere peeth peeche ye kagaz banwaye? Mujhe sach batao, Hyun-woo. Kya tumne mujhse kabhi sachha pyaar kiya tha?"`,
            choices: [
              {
                text: "*Uska haath thamo aur kareeb aao* 'Hae-in, main sirf tumse pyaar karta hoon.'",
                nextChapterId: 'c2a',
                deltaAffection: +20,
                deltaTension: +20,
                tone: 'Jazbaati Izhaar'
              },
              {
                text: "*Kagaz phad kar phenk do* 'Main tumhe kabhi chhod kar nahi jaunga.'",
                nextChapterId: 'c2b',
                deltaAffection: +25,
                deltaTension: +15,
                tone: 'Pukhta Vada'
              }
            ]
          },
          {
            id: 'c2a',
            title: 'Chapter 2: Pighalti Hui Barf',
            visual: 'https://image.tmdb.org/t/p/w780/7ZXLZ3KYL3IVvsSHBZaHjcNQzNU.jpg',
            speaker: 'Hong Hae-in',
            characterMood: 'Be-inteha Mohabbat',
            narrative: `Hae-in ki saansein dheemi ho jati hain aur wo apna sar tumhare seene par rakh deti hai. Har purani narazgi hawa mein ud jati hai.`,
            dialogue: `"Mujhe akela mat chhodna... aaj raat mere paas raho."`,
            choices: [
              {
                text: "*Direct 18+ Roleplay Chat shuru karo*",
                action: 'switch_to_chat',
                characterId: 'tmdb-215720'
              }
            ]
          }
        ]
      }
    }
  }
];

/**
 * Fetch media details from TMDb API with automatic fallbacks
 */
export async function fetchTMDbMedia(id, mediaType = 'auto') {
  const cleanId = String(id).replace(/[^0-9]/g, '').trim();
  if (!cleanId) throw new Error('Invalid TMDb ID. Must be numeric.');

  // Check verified local database first for instant hit
  const existingLocal = VERIFIED_TMDB_STORIES.find(s => s.tmdbId === cleanId || s.aliases?.includes(cleanId));
  if (existingLocal) {
    return {
      success: true,
      source: 'verified_cache',
      data: existingLocal
    };
  }

  const apiKey = getTMDbApiKey();
  const typesToTry = mediaType === 'auto' ? ['movie', 'tv'] : [mediaType];

  let lastError = null;
  for (const type of typesToTry) {
    try {
      const url = `https://api.themoviedb.org/3/${type}/${cleanId}?api_key=${apiKey}&append_to_response=credits,keywords`;
      const res = await fetch(url);
      if (res.ok) {
        const json = await res.json();
        return {
          success: true,
          source: 'tmdb_api',
          mediaType: type,
          data: json
        };
      } else {
        lastError = `TMDb API responded with status ${res.status}`;
      }
    } catch (err) {
      lastError = err.message;
    }
  }

  throw new Error(`Failed to fetch TMDb ID ${cleanId}: ${lastError}`);
}

/**
 * Search TMDb by title
 */
export async function searchTMDb(query) {
  const q = (query || '').trim().toLowerCase();
  if (!q) return [];

  // Filter local verified first
  const localMatches = VERIFIED_TMDB_STORIES.filter(s => 
    s.title.toLowerCase().includes(q) || 
    s.characterName.toLowerCase().includes(q) ||
    s.tmdbId.includes(q) ||
    s.aliases?.some(a => a.includes(q))
  );

  try {
    const apiKey = getTMDbApiKey();
    const url = `https://api.themoviedb.org/3/search/multi?api_key=${apiKey}&query=${encodeURIComponent(query)}&page=1`;
    const res = await fetch(url);
    if (res.ok) {
      const json = await res.json();
      const results = (json.results || []).filter(r => r.media_type === 'movie' || r.media_type === 'tv');
      return {
        local: localMatches,
        online: results
      };
    }
  } catch (err) {
    console.warn('TMDb live search failed, relying on local verified:', err);
  }

  return {
    local: localMatches,
    online: []
  };
}

/**
 * Convert raw TMDb API item into a complete playable Kavana Story
 */
export function convertTMDbToKavanaStory(tmdbItem, overrides = {}) {
  // If it's already a full story from local cache
  if (tmdbItem.openingHook && tmdbItem.smartReplies) {
    return { ...tmdbItem, ...overrides };
  }

  const isMovie = tmdbItem.title !== undefined;
  const rawTitle = tmdbItem.title || tmdbItem.name || 'Untitled Cinema Novel';
  const releaseYear = (tmdbItem.release_date || tmdbItem.first_air_date || '2024').slice(0, 4);
  const tmdbId = String(tmdbItem.id);
  const overview = tmdbItem.overview || 'Step into the cinematic world where your choices dictate fate and passion.';
  
  // Extract top cast member for Character Name
  let leadCharName = overrides.characterName || '';
  if (!leadCharName && tmdbItem.credits && tmdbItem.credits.cast && tmdbItem.credits.cast.length > 0) {
    const topCast = tmdbItem.credits.cast[0];
    leadCharName = topCast.character ? `${topCast.character} (${topCast.name})` : topCast.name;
  }
  if (!leadCharName) {
    leadCharName = rawTitle.split(':')[0] || 'The Protagonist';
  }

  // Genre detection
  const genreIds = tmdbItem.genre_ids || (tmdbItem.genres || []).map(g => g.id);
  let category = 'Crime & Mafia';
  if (genreIds.includes(10749) || genreIds.includes(18)) category = 'Romance';
  if (genreIds.includes(80) || genreIds.includes(53)) category = 'Crime & Mafia';
  if (genreIds.includes(14) || genreIds.includes(878)) category = 'Fantasy';
  if (genreIds.includes(16)) category = 'Anime';
  if (overrides.category) category = overrides.category;

  const posterPath = tmdbItem.poster_path 
    ? `${TMDB_IMAGE_BASE}/w780${tmdbItem.poster_path}` 
    : 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop&q=80';

  const backdropPath = tmdbItem.backdrop_path 
    ? `${TMDB_IMAGE_BASE}/w1280${tmdbItem.backdrop_path}` 
    : posterPath;

  const userRole = overrides.userRole || 'Undercover Rival / Defiant Partner';
  const userGoal = overrides.userGoal || 'Uncover the hidden truth or surrender to desire';
  const rating = tmdbItem.vote_average ? (tmdbItem.vote_average).toFixed(1) : '9.5';

  const openingHook = overrides.openingHook || 
    `*[${leadCharName} stands in the dramatic shadows, fixing their gaze upon you with unspoken intensity as the tension mounts]* You came here knowing the danger. In this world, every move is watched, and every choice has a price. Tell me... did you come to challenge me, or to make me lose control?`;

  const smartReplies = overrides.smartReplies || [
    `*Step closer boldly* 'I came here to see what you are truly capable of.'`,
    `*Smile faintly and keep your distance* 'You talk about prices, but you haven't seen mine yet.'`,
    `*Look directly into their eyes* 'I am not afraid of you or your empire.'`
  ];

  return {
    id: `tmdb-${tmdbId}`,
    tmdbId,
    mediaType: isMovie ? 'movie' : 'tv',
    title: `${rawTitle} (${releaseYear})`,
    characterName: leadCharName,
    userRole,
    userGoal,
    category,
    tags: ['🎬 TMDb Verified', '🔥 18+ Uncensored', '4K UHD', category],
    summary: overview,
    openingHook,
    smartReplies,
    initialMood: 'Intense & Magnetically Seductive',
    systemPersona: `You are ${leadCharName} from ${rawTitle}. Embody your character's authentic voice, mannerisms, dark charisma, and intense adult dynamic with the user (${userRole}). You respond fluently in English, Hinglish, or Punjabi according to what the user speaks. Always format actions inside *[brackets]*.`,
    avatar: posterPath,
    cover: backdropPath,
    imdbRating: rating,
    quality: '4K UHD',
    playerCount: Math.floor(45000 + Math.random() * 60000),
    isCustomTMDb: true,
    languages: {
      en: {
        title: rawTitle,
        chapters: [
          {
            id: 'c1',
            title: `Chapter 1: The Arrival`,
            visual: backdropPath,
            speaker: leadCharName,
            characterMood: 'Intense & Commanding',
            narrative: `The shadows lengthen as you enter the private domain. ${leadCharName} steps forward, their silhouette illuminated by atmospheric amber light.`,
            dialogue: `"Nobody crosses this threshold without my permission. Now look me in the eye and state your real intention."`,
            choices: [
              {
                text: "*Step forward and challenge their authority*",
                nextChapterId: 'c2a',
                deltaAffection: +15,
                deltaTension: +20,
                tone: 'Defiant Pride'
              },
              {
                text: "*Speak softly and step within whispering distance*",
                nextChapterId: 'c2b',
                deltaAffection: +25,
                deltaTension: +15,
                tone: 'Seductive Submission'
              }
            ]
          }
        ]
      }
    }
  };
}

/**
 * Storage management for user-added TMDb stories
 */
export function getSavedCustomTMDbStories() {
  try {
    const raw = localStorage.getItem('kavana_custom_stories_v1');
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed reading custom TMDb stories:', e);
  }
  return [];
}

export function saveCustomTMDbStory(story) {
  const current = getSavedCustomTMDbStories();
  const existingIdx = current.findIndex(s => s.id === story.id || s.tmdbId === story.tmdbId);
  if (existingIdx >= 0) {
    current[existingIdx] = story;
  } else {
    current.unshift(story);
  }
  localStorage.setItem('kavana_custom_stories_v1', JSON.stringify(current));
  return current;
}

export function deleteCustomTMDbStory(storyId) {
  const current = getSavedCustomTMDbStories();
  const updated = current.filter(s => s.id !== storyId && s.tmdbId !== storyId);
  localStorage.setItem('kavana_custom_stories_v1', JSON.stringify(updated));
  return updated;
}

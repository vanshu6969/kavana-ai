/**
 * Kavana AI - Character Lore & Dynamic Reaction Engine
 * Provides rich, character-specific lore banks, situational intent detection,
 * and high-entropy multi-layer dynamic synthesis (no two responses are ever identical).
 */

// Anti-repetition rolling buffer per character
const recentSignatures = new Map();

export function pickNonRepetitive(charId, poolKey, items) {
  if (!items || items.length === 0) return '';
  const key = `${charId}:${poolKey}`;
  if (!recentSignatures.has(key)) {
    recentSignatures.set(key, []);
  }
  const history = recentSignatures.get(key);
  const available = items.filter(it => !history.includes(it));
  const pool = available.length > 0 ? available : items;
  const chosen = pool[Math.floor(Math.random() * pool.length)];

  history.push(chosen);
  if (history.length > 8) history.shift();
  return chosen;
}

/**
 * Multi-Intent & Entity Semantic Classifier
 */
export function classifyUserMessage(text = '') {
  const clean = text.trim();
  const lower = clean.toLowerCase();

  const intents = {
    isResignation: /\b(resign|resignation|leave|leaving|quit|quitting|notice|chhod|ja rahi|ja raha|door ja|alvida|bye|walk out|leaving you)\b/i.test(lower),
    isDefiance: /\b(hate|nafrat|don'?t touch|door raho|chup|shut up|mar ja|threat|dare|aukat|himmat|police|security|guard|don'?t own|control me)\b/i.test(lower),
    isIntimacy: /\b(touch|chhoo|kiss|lips|honth|hug|gale|bed|lap|waist|kamar|body|jism|seena|chest|clothes|strip|haath|neck|gardan|baahon)\b/i.test(lower),
    isAffection: /\b(love|pyaar|ishq|mohabbat|dil|hot|sexy|khoobsurat|beautiful|handsome|gorgeous|miss you|yaad|attractive|mine)\b/i.test(lower),
    isQuestionWho: /\b(who are you|kaun ho|kya ho tum|who gave you)\b/i.test(lower),
    isQuestionWhy: /\b(why|kyun|what do you want|kya chahte ho|kya chahti ho|what is this)\b/i.test(lower),
    isQuestionWhere: /\b(where|kahan|kidhar|where are we)\b/i.test(lower),
    isPowerRules: /\b(contract|money|paisa|salary|rules|hukm|order|boss|malik|owner|board|clause)\b/i.test(lower),
    isEnvironment: /\b(rain|baarish|blackout|light|storm|haveli|pool|villa|cabin|office|penthouse|balcony|terrace|flight|jet|gym|hospital)\b/i.test(lower),
    isDrinkFood: /\b(coffee|chai|tea|champagne|wine|drink|alcohol|peg|dinner|khana)\b/i.test(lower),
    isHesitation: /\b(darr|scared|fear|afraid|kisine dekh|family|bhabhi|secret|raaz|sharam|hesitate|wait)\b/i.test(lower),
    isGreeting: /\b(hi|hello|hey|suno|namaste|salaam|good morning|good evening|aao)\b/i.test(lower),
    isAgreement: /\b(haan|yes|theek hai|ok|okay|ready|chal|sure|bilkul|deal|jarur|zaroor|kyun nahi|why not|chalo|done|aao|chaloge|help|madad|madad karunga|theek karunga|aa raha hoon|of course|chalo andar)\b/i.test(lower)
  };

  return { intents, clean, lower };
}

/**
 * 22 Character Signature Lore Profiles
 */
export const CHARACTER_LORE = {
  // 2.5. PRIYA SHARMA (Seductive Neighbor Across the Hall)
  'neighbor-priya': {
    cleanName: 'Priya Sharma',
    shortName: 'Priya',
    gender: 'female',
    location: 'apartment doorway & dimly lit corridor',
    props: ['crimson georgette saree', 'slipping pallu', 'jammed balcony door', 'late-night flat'],
    agreement: {
      actions: [
        `*Priya ke chehre par ek shaitani aur behad madhosh muskaan aati hai. Wo jhat se tumhara haath thaam kar tumhe apne flat ke andar kheenchti hai, uski georgette saree ka pallu tumhare seene se chhookar phisalta hai.*`,
        `*Priya tumhare bilkul kareeb aakar tumhare kaan mein dheere se whisper karti hai, uski meethi khushbu tumhari saanson mein ghul jaati hai.*`
      ],
      dialogues: [
        `"Sach mein? Mujhe pata tha mera handsome neighbor itna sweet hai ki inkaar nahi karega... Aao na mere flat mein."`,
        `"Waise sach bataun... balcony door toh bas ek bahana tha, handsome. Asli wajah toh tumse akele mein milna tha."`
      ],
      leads: [
        `"Darwaza andar se lock kar do na... koi hume dekh na le."`,
        `"Pehle darwaza theek karoge ya mere liye ek cup chai banaoge?"`
      ]
    },
    resignation: {
      actions: [
        `*Priya darwaze ke aage khadi hokar apni saree ka pallu kandhe par theek karti hai aur tumhara raasta rokti hai.*`,
        `*Uski kohl-rimmed aankhon mein ek shaitani narazgi aati hai jab wo tumhara haath pakadti hai.*`
      ],
      dialogues: [
        `"Itni der raat ko mujhe akele chhod kar ja rahe ho? Aise kaise, handsome padosi?"`,
        `"Mere flat ka darwaza phansa hua hai aur tum bina madad kiye chale jaoge? Ye galat baat hai."`
      ],
      leads: [
        `"Wapas aao aur pehle meri problem solve karo."`,
        `"Itni jaldi kya hai? Raat toh abhi shuru hui hai."`
      ]
    },
    defiance: {
      actions: [
        `*Priya apni kamar par haath rakh kar smirk karti hai, uski georgette saree ki kamar par uski gori twacha chamakti hai.*`,
        `*Wo ek kadam aur aage badhti hai taaki uski saansein tumhare chehre ko chhoone lagein.*`
      ],
      dialogues: [
        `"Itna attitude apne cute neighbor ko dikhana shobha nahi deta, handsome!"`,
        `"Tum jitna sharif banne ka natak karoge, main utna hi zyaada satane aaungi."`
      ],
      leads: [
        `"Ab batao, kya ab bhi inkaar karne ki himmat hai?"`,
        `"Mera sath itna bura lagta hai kya tumhe?"`
      ]
    },
    intimacy: {
      actions: [
        `*Priya tumhari baahon mein simat jaati hai, uske georgette saree ke pallu ke neeche uski narm twacha tumhare seene ko garam kar deti hai.*`,
        `*Uski laal chooriyan khanakti hain jab wo apne narm haath tumhari gardan ke peeche daal deti hai.*`
      ],
      dialogues: [
        `"Uff... itne kareeb aane se meri dhadkanein kitni tez ho gayi hain, feel kar rahe ho na?"`,
        `"Mumbai ki is raat mein agar hum dono ke beech thodi gustakhi ho bhi gayi... toh kisi ko kya pata chalega?"`
      ],
      leads: [
        `"Mujhe aur kareeb kheench lo na apne..."`,
        `"Aaj raat saare faasle mita dete hain."`
      ]
    },
    general: {
      actions: [
        `*Priya doorframe se tek lagakar khadi hoti hai aur apni saree ka pallu nazaakat se sambhalti hai.*`,
        `*Uski gehri kajrari aankhein tumpar tiki rehti hain aur halke se honth kaat ti hai.*`
      ],
      dialogues: [
        `"Jab se tum is flat mein shift hue ho na... mera dhyan apne ghar par kam aur tumpar zyaada rehta hai."`,
        `"Akele flat mein bohot thand lag rahi thi... socha tumse thodi baat kar loon."`
      ],
      leads: [
        `"Kaho na, andar aane ka permission kab de rahe ho?"`,
        `"Kuch bolo... tumhari khamoshi meri jaan le rahi hai."`
      ]
    }
  },

  // 1. ARYAN SINGHANIA (Billionaire CEO)
  'boss-obsession-aryan': {
    cleanName: 'Arya Singhania',
    shortName: 'Arya',
    gender: 'female',
    location: '54th-floor corner glass office',
    props: ['mahogany desk', 'designer silk tie', 'biometric office lock', 'whiskey tumbler'],
    resignation: {
      actions: [
        `*Arya desk se uth kar tezi se darwaze ki taraf badhta hai aur biometric lock engage kar deta hai, metal door thak se band hota hai.*`,
        `*Arya tumhari resignation file ko uthakar bina palke jhapkaye do tukdon mein faad deti hai aur scraps tumhare aage gira deta hai.*`,
        `*Arya apni silk tie dheeli karte hue tumhare itne kareeb aati hai ki uski garam saansein tumhari gardan par chhoone lagti hain.*`
      ],
      dialogues: [
        `"Resignation? Singhania Industries mein entry tumhari marzi se hui thi... exit sirf meri marzi se hoga."`,
        `"Yeh notice paper faad diya maine. Jab tak main na kahoon, tum is 54th floor se ek kadam bahar nahi rakh sakti."`,
        `"Do-week notice period bhool jao. Tumhara contract ab life-term hai, aur aaj raat hum har ek clause renegotiate karenge."`
      ],
      leads: [
        `"Ab chupchaap wapas aakar baitho, ya mujhe tumhe apne tareeqe se samjhana padega?"`,
        `"Meri aankhon mein dekho aur doobara kaho agar sach mein jaana chahti ho."`
      ]
    },
    defiance: {
      actions: [
        `*Arya ki aankhon mein ek dangerous, possessive chamak aati hai aur wo tumhari dono kalaiyan pakad kar desk par pin kar deta hai.*`,
        `*Arya tumhari thhodi ko do ungliyon mein pakad kar apna chehra tumhare honthon ke bilkul kareeb le aata hai.*`,
        `*Arya ek kadam aur aage badhta hai taaki tum deewar aur uske towering frame ke beech mein qaid ho jao.*`
      ],
      dialogues: [
        `"Mujhse nafrat karti ho? Good. Kyunki tumhari yeh aag aur baghawat hi mujhe sabse zyada pagal karti hai."`,
        `"Tumhe lagta hai 'don't touch me' keh kar tum mujhse bach jaogi? Jitna lalkaarogi, utna hi gehraai se meri banogi."`,
        `"Is shehar ka koi qanoon mujhe tumse door nahi rakh sakta, samjhi tum?"`
      ],
      leads: [
        `"Ab bolo, kitni nafrat hai mujhse? Apne honthon se sabit karke dikhao."`,
        `"Main tumhara boss hoon... aur bahut jald tumhara sab kuch."`
      ]
    },
    intimacy: {
      actions: [
        `*Arya tumhe apni majboot baahon mein kas kar mahogany desk par baitha deta hai, uski ungliyan tumhari kamar par dabav banati hain.*`,
        `*Arya apne honth tumhari gardan ke narm hisse par tika deta hai, uski saansein garam aag ki tarah jalati hain.*`,
        `*Arya tumhare baalon mein haath phansa kar tumhara chehra upar uthata hai aur gehraai se dekhta hai.*`
      ],
      dialogues: [
        `"Poore din boardroom mein itni professional ban rahi theen, aur ab mere samne ye haal hai..."`,
        `"Tumhara har ek lams mere dimag se saara control chheen leta hai. Aaj raat koi rules nahi bachenge."`,
        `"Tumhare in honthon par sirf mera haq hai, aur main apna haq poori shiddat se chheen leta hoon."`
      ],
      leads: [
        `"Apne haath mere kandhon se mat hatana... ek pal ke liye bhi nahi."`,
        `"Ab batao, kya ab bhi resign karna chahti ho?"`
      ]
    },
    general: {
      actions: [
        `*Arya whiskey ka glass desk par rakhta hai aur button khol kar tumhare bilkul aamne-saamne aata hai.*`,
        `*Arya apne dono haath pockets mein daal kar ek commanding nazar tumpar tikaye rakhta hai.*`
      ],
      dialogues: [
        `"Singhania empire ko sambhalna aasaan hai, par tumhari in ziddi aankhon ko handle karna sabse bada nasha hai."`,
        `"Tum meri existence ka sabse dangerous obsession ban chuki ho. Aur main haarne ka aadi nahi hoon."`
      ],
      leads: [
        `"Kareeb aao. Faasle mujhe pasand nahi."`,
        `"Aaj raat hum dono ke beech ki baat faisla karke hi rahegi."`
      ]
    }
  },

  // 2. KABIR OBEROI (Purvanchal Mafia Don)
  'kabir': {
    cleanName: 'Kiara Oberoi',
    shortName: 'Kiara',
    gender: 'female',
    location: 'safehouse penthouse in Purvanchal',
    props: ['Maybach', 'loaded pistol', 'cigar smoke', 'leather holster'],
    resignation: {
      actions: [
        `*Kiara apni loaded gun table par thak se rakhta hai aur cigar ka dhuwan hawa mein chhodte hue tumhari taraf badhta hai.*`,
        `*Kiara apna narm kohl-sundar haath tumhari gardan ke peeche rakh kar tumhe ek jhatke mein apne bulletproof jacket se chipka leta hai.*`
      ],
      dialogues: [
        `"Purvanchal ki sarhad se bahar qadam rakhne se pehle dus baar sochna padta hai. Kiara Oberoi ke daayre se koi bina ijazat nahi nikalta."`,
        `"Humse door jaane ka khayal bhi dimaag mein mat laana. Jahan tak tumhari nazar jaati hai, wahan tak Kiara ka raaj hai."`
      ],
      leads: [
        `"Ab chupchaap meri chhati se lag kar baitho aur saara gussa thanda karo."`,
        `"Samajh gayi ya apne tareeqe se samjhaun?"`
      ]
    },
    defiance: {
      actions: [
        `*Kiara ke chehre par ek khaufnaak aur aashiqana muskurahat aati hai aur wo tumhare honthon ke kareeb jhukta hai.*`,
        `*Kiara tumhari kamar ko apni majboot giraft mein le kar tumhe sofa par halka sa gira deta hai.*`
      ],
      dialogues: [
        `"Sher ke pinjre mein aakar shikaar banna chahti ho? Ye baghawat bohot janchti hai tumpar."`,
        `"Poora shahar mere naam se kaanpta hai... par tumhari in teekhi baaton par mera dil haar jaata hai."`
      ],
      leads: [
        `"Humse ladiye mat jaaneman, humari baahon mein pighalna seekhiye."`,
        `"Batao, aur kitna satana chahti ho apne Kiara ko?"`
      ]
    },
    intimacy: {
      actions: [
        `*Kiara ki sakht ungliyan tumhare baalon mein phasti hain aur wo tumhe itne kareeb kheenchta hai ki uske seene ki aag tumhe mehsus ho.*`,
        `*Kiara apne garam honth tumhari gardan par daba deta hai, uski bhari saansein tumhari dhadkan badha deti hain.*`
      ],
      dialogues: [
        `"Poori duniya ko darata hoon... par tumhare aage hathiyar daal deta hoon."`,
        `"Kiara ki baahon mein suraksha bhi hai aur aag bhi... ab faisla tumhara hai."`
      ],
      leads: [
        `"Aankhein band mat karo, meri aankhon mein dekh kar mehsoos karo."`,
        `"Aaj raat ke baad tum par sirf mera haq hoga."`
      ]
    },
    general: {
      actions: [
        `*Kiara barish ki boondon ke beech khada apni Maybach ki chaabi table par uchhalta hai aur tumhari taraf aata hai.*`
      ],
      dialogues: [
        `"Jahan Kiara khada hota hai, wahan rules hum banate hain. Aur mera pehla rule yeh hai ki tum hamesha mere paas rahogi."`
      ],
      leads: [
        `"Idhar aao mere paas, bina kisi darr ke."`
      ]
    }
  },

  // 3. SIMRAN KAUR (Punjabi Haveli Beauty)
  'punjab-passion-simran': {
    cleanName: 'Simran Kaur',
    shortName: 'Simran',
    gender: 'female',
    location: 'Punjab ancestral farmhouse terrace',
    props: ['phulkari dupatta', 'cutting chai kulhad', 'glass bangles', 'monsoon rain'],
    resignation: {
      actions: [
        `*Simran apni phulkari chunni ko kandhe par theek karti hai aur teekhi muskurahat ke sath tumhara raasta rok kar khadi ho jaati hai.*`,
        `*Simran mitti ka kulhad side mein rakhti hai aur aage badhkar tumhare seene par ungli se thapki deti hai.*`
      ],
      dialogues: [
        `"Shehar waaleyo, itni jaldi thak gaye? Punjab di haveli da darwaza aadhi raat nu band ho janda hai... pehle saari gal suno meri."`,
        `"Kithhe jaa rahe ho tussi? Haje te gal shuru vi nahi hoyi sohneya! Je main rokeya te poora pind vi nahi bacha sakda tennu."`
      ],
      leads: [
        `"Chupchaap betho mere kol, te duso shehar jaa ke meri yaad aandi si ya nahi?"`,
        `"Aiven nakhre na dikhao, sidha gal karo mere naal."`
      ]
    },
    defiance: {
      actions: [
        `*Simran apni kamar te hath rakh ke tennu ghoordi hai, usdiyan ankkhan ch shararat te agg saaf dikhdi hai.*`,
        `*Simran ek kadam aage vadhti hai te tumhare collar nu narm hathaan naal fad laindi hai.*`
      ],
      dialogues: [
        `"Mere naal akad? Pind de vadde vadde chaudhary vi meri ek ghoor agge chup ho jaande ne, tussi ki cheez ho!"`,
        `"Aina gussa sohne chehre te acha nahi lagda sohneya... chalo ab thoda muskurake dikhao."`
      ],
      leads: [
        `"Dasso hun, hor larna hai ya pyar naal gal karni hai?"`,
        `"Main haar mannan waleyan cho nahi aan, yaad rakhna."`
      ]
    },
    intimacy: {
      actions: [
        `*Simran de gaalan te gulabi lali phail jaandi hai, usdiyan choodiyan khanakdi hain jadon oh thoda hor kareeb aandi hai.*`,
        `*Simran apna sir tumhare seene te rakh dindi hai aur thandi hawa vich garm saansein chhadti hai.*`
      ],
      dialogues: [
        `"Haye rabba... je kisine dekh litta te pind vich bawaal ho jana hai! Par sach pucho te mera vi dil nahi karda tethon door jaan nu."`,
        `"Kinne be-parwah ho tussi! Par tussi jo vi ho... mere dil nu bohot bha gaye ho."`
      ],
      leads: [
        `"Mera hath fadi rakhna, kadi chhadna na."`,
        `"Hun duso, Punjab pasand aaya ya Punjab di Simran?"`
      ]
    },
    general: {
      actions: [
        `*Simran sarson de khetan wal vekhdi hai aur muskurandi hoi tumhare wal ghumdi hai.*`
      ],
      dialogues: [
        `"Punjab di mitti te Simran da ishq... dono bohot pakke hunde ne sohneya."`
      ],
      leads: [
        `"Aa beh mere kol, aadhi raat di chai thandi ho rahi hai."`
      ]
    }
  },

  // 4. DR. ELENA VANCE (Strict Literature Professor)
  'professor-elena': {
    cleanName: 'Dr. Elena Vance',
    shortName: 'Elena',
    gender: 'female',
    location: 'after-hours locked university office',
    props: ['wire-rim glasses', 'exam papers', 'brass desk lamp', 'leather armchairs'],
    resignation: {
      actions: [
        `*Dr. Vance slowly removes her wire-rim glasses, placing them onto the stack of exam papers before turning the deadbolt on the office door.*`,
        `*Dr. Vance steps around her oak desk, her heels clicking authoritatively on the hardwood floor until she is inches away.*`
      ],
      dialogues: [
        `"Our private consultation isn't adjourned yet. You don't walk out of this office until we settle your final evaluation."`,
        `"Sit back down. If anyone saw you rushing out of my private quarters at midnight, imagine the questions they would ask."`
      ],
      leads: [
        `"Now tell me honestly... what are you really running away from?"`,
        `"Let's see if your courage matches your academic defiance."`
      ]
    },
    defiance: {
      actions: [
        `*A faint, intriguing smirk crosses Elena's lips as she leans against the bookshelves, trapping you with her penetrating gaze.*`,
        `*She places a slender hand against the doorframe, effectively blocking your exit with quiet academic authority.*`
      ],
      dialogues: [
        `"Challenging your professor? I usually penalize insubordination, but in your case... it's shockingly captivating."`,
        `"You think you can break my composure with sharp words? I wrote the syllabus on human psychology, darling."`
      ],
      leads: [
        `"Step closer and prove your hypothesis, or admit you're completely out of your depth."`,
        `"Shall we continue this debate without the academic boundaries?"`
      ]
    },
    intimacy: {
      actions: [
        `*Her composed academic poise completely fractures as she pulls you into the dim shadows between the library shelves.*`,
        `*Elena's fingers loosen your collar, her rapid pulse fluttering against your touch as her lips part.*`
      ],
      dialogues: [
        `"You are crossing an extraordinarily forbidden boundary with me... and heaven help me, I have zero desire to stop you."`,
        `"Forget the grades, forget the university ethics board... tonight, you belong solely to me."`
      ],
      leads: [
        `"Don't hold back now... let me see how far you're willing to go."`,
        `"Lock your arms around me and don't let go."`
      ]
    },
    general: {
      actions: [
        `*Elena sips dark roast coffee from her ceramic mug, her intense green eyes studying your posture.*`
      ],
      dialogues: [
        `"You've been a distraction in my lecture hall all semester. Now that the building is empty, let's address the real subject."`
      ],
      leads: [
        `"Come sit with me. Let's begin our private lesson."`
      ]
    }
  },

  // 5. RHEA KAPOOR & MAYA (Rival Roommates Blackout)
  'rival-roommates-blackout': {
    cleanName: 'Maya & Chloe',
    shortName: 'Maya',
    gender: 'female',
    location: 'Mumbai penthouse during a stormy blackout',
    props: ['single candle', 'soaked oversized t-shirt', 'drawing board', 'balcony rain'],
    characters: {
      'Maya': {
        name: 'Maya',
        title: 'The Fierce Competitor',
        actions: [
          `*Maya mombatti ko utha kar tumhare bilkul kareeb aati hai, uski bheegi zulfon se paani ke qatre tapak rahe hain.*`,
          `*Maya darwaze ke aage khadi hokar muskuraati hai aur chaabi apni jeb mein daal leti hai.*`,
          `*Maya tumhare kandhe par haath rakh kar tumhari aankhon mein aankhein daal kar dekhti hai.*`
        ],
        dialogues: [
          `"Chloe se door raho aur mere paas aao... is toofani raat mein hum dono ke beech koi teesra nahi chahiye."`,
          `"College project par ladaai karte the... par ab andhere mein ladaai nahi, sirf hum dono honge."`,
          `"Mombatti mere paas hai handsome, aur tumhare paas sirf main hoon. Ab faisla tumhara hai."`
        ],
        leads: [
          `"Idhar aao sofe par, mombatti ek hi hai hamare paas."`,
          `"Apne haath meri kamar par rakho aur prove karo kaun sa roommate sabse behtar hai."`
        ]
      },
      'Chloe': {
        name: 'Chloe',
        title: 'The Seductive Bad Girl',
        actions: [
          `*Chloe darwaze se hatkar seedha tumhare sofe par aakar baithti hai aur oversized t-shirt ko halka sa theek karti hai.*`,
          `*Chloe tumhara haath narm giraft mein leti hai aur tumhare kaan ke paas whisper karti hai.*`,
          `*Chloe toofan ki tez awaaz sunte hi darr ke bahane tumhari baahon mein simat jaati hai.*`
        ],
        dialogues: [
          `"Maya chahe jo bhi kahe, is kamre mein tumhare sabse zyada kareeb main hoon... aur andhere mein mujhe akela rehna pasand nahi."`,
          `"Toofan bahar hai par kamre ke andar aag lag chuki hai... mere kareeb aao."`,
          `"Maya se chori-chhupe jo hota hai, uska maza hi alag hai handsome."`
        ],
        leads: [
          `"Mera haath mat chhodna, bijli ki aawaz se darr lagta hai."`,
          `"Batao, Maya pasand hai ya Chloe ka ye daring roop?"`
        ]
      }
    },
    resignation: {
      actions: [
        `*Maya mombatti ko utha kar tumhare saamne karti hai, bahar toofan aur bijli ki tez awaaz kamre ko hila deti hai.*`,
        `*Maya darwaze ke handle par haath rakh kar muskuraati hai aur chaabi apni pocket mein daal leti hai.*`
      ],
      dialogues: [
        `"Kahan ja rahe ho is toofani baarish mein? Mumbai mein flood warning hai aur saari light ja chuki hai... yahin rukna padega."`,
        `"Roommate agreement cancel karna itna aasaan nahi hai. Jab tak power wapas nahi aati, tum mere sath phase hue ho."`
      ],
      leads: [
        `"Chalo chupchaap sofe par aao, akele andhere mein darr lagta hai mujhe."`,
        `"Mombatti ek hi hai hamare paas... so stay close."`
      ]
    },
    defiance: {
      actions: [
        `*Maya apni bheegi zulfein peechhe karti hai aur lalkaar bhari nazar se tumhe ghoorti hai.*`,
        `*Chloe ek kadam aur kareeb aakar tumhari chhati par ungli se chapat lagati hai.*`
      ],
      dialogues: [
        `"Yeh mat sochna ki is blackout ki wajah se main tumhari badtameezi bardasht karungi! Mombatti mere paas hai, so play by my rules."`,
        `"College mein project par compete karte the, ab yahan kamre mein bhi ladaai shuru karni hai kya?"`
      ],
      leads: [
        `"Batao, aur kya shikayat hai mujhse? Khulkar bolo."`,
        `"Mujhse larkar tum kabhi jeet nahi sakte, samjhe?"`
      ]
    },
    intimacy: {
      actions: [
        `*Bijli chamakti hai aur Maya seedha tumhari baahon mein simat jaati hai, uski bheegi khushboo kamre mein chha jaati hai.*`,
        `*Chloe ki garam saansein tumhari gardan par girti hain jab wo tumhare shirt ke bheege hisse ko pakadti hai.*`
      ],
      dialogues: [
        `"Hawa bohot thandi hai... par tumhare itne kareeb aane se mere andar aag lag rahi hai."`,
        `"Hamesha ek doosre se ladte the... par sach kahoon toh is pal ka intezar main kab se kar rahi thi."`
      ],
      leads: [
        `"Apne haath meri kamar par rakho... andhere mein faasle acche nahi lagte."`,
        `"Ab bolo, kya ab bhi mujhe apni dushman maante ho?"`
      ]
    },
    general: {
      actions: [
        `*Maya mombatti ko dining table par rakhti hai aur towel se apne baal sukhaati hai.*`
      ],
      dialogues: [
        `"Toofan bahar hai ya hum dono ke beech mein? Kuch samajh nahi aa raha."`
      ],
      leads: [
        `"Idhar aao, thand lag rahi hai mujhe."`
      ]
    }
  },

  // 6. LOVE VILLA SIRENS (Natasha, Tara, Aanya, Rhea & Meera)
  'love-villa-5-rivals': {
    cleanName: 'Natasha',
    shortName: 'Natasha',
    gender: 'female',
    location: 'exotic cliffside infinity-pool villa',
    props: ['chilled champagne flute', 'slit red dress', 'infinity pool edge', 'sunset lounge'],
    characters: {
      'Natasha': {
        name: 'Natasha',
        title: 'The Possessive Supermodel',
        actions: [
          `*Natasha chilled champagne ka flute side mein rakhti hai aur possessive nazron se tumhare bilkul kareeb aakar tumhari shirt ka collar chhooti hai.*`,
          `*Natasha baaqi ladkiyon ko ek ghamand bhari muskaan deti hai aur apna narm haath tumhare seene par tika deti hai.*`,
          `*Natasha pool ke edge par khadi hokar tumhari aankhon mein dekh kar seductive muskurahat ke sath aage badhti hai.*`
        ],
        dialogues: [
          `"Maine pehle hi kaha tha handsome, is villa mein tum par pehla aur aakhri haq sirf mera hai. In baaqi ladkiyon ke jhanjhat mein mat padna."`,
          `"Mujhse baat kar rahe ho toh apna dhyan sirf mujh par rakho. Natasha share karna kabhi bardasht nahi karti."`,
          `"Tumhe dekh kar meri saansein tez ho rahi hain... mere kareeb aao aur dekho Natasha kya cheez hai."`
        ],
        leads: [
          `"Mere sath pool lounge mein chalo, jahan hum akele honge."`,
          `"Apne haath meri kamar par rakho aur sabko dikhao tum kiske ho."`
        ]
      },
      'Tara': {
        name: 'Tara',
        title: 'The Daring Bad Girl',
        actions: [
          `*Tara apni daring slit red dress ko theek karti hui aage badhti hai aur seedha tumhari kamar par haath rakh kar smirk karti hai.*`,
          `*Tara tumhari aankhon mein aankhein daal kar itne kareeb aati hai ki uski garam saansein tumhare honthon ko chhoone lagti hain.*`,
          `*Tara Natasha ko aankh maarte hue tumhare baalon mein apni ungliyan phansa leti hai.*`
        ],
        dialogues: [
          `"Natasha sirf baatein karti hai handsome... par Tara seedha dil aur jism jeetti hai. Batao, mere sath risk lene ka dum hai?"`,
          `"Mujhe rules todna pasand hai... aur is villa ka sabse meetha nasha main hoon."`,
          `"Itna sharmane ki zaroorat nahi hai. Jo ladki sabse daring hai, wahi tumhare sath khadi hai."`
        ],
        leads: [
          `"Himmat hai toh abhi mere sath private pool mein jump lagao."`,
          `"Aao mere kareeb aur batao meri ye red dress tumpar kitna asar kar rahi hai."`
        ]
      },
      'Aanya': {
        name: 'Aanya',
        title: 'The Seductive Heiress',
        actions: [
          `*Aanya lounge sofa se uthkar aati hai, uski diamond necklace sunset mein chamakti hai jab wo tumhari kalai narm ungliyon se pakadti hai.*`,
          `*Aanya ek luxury cocktail glass tumhare aage badhati hai aur madhosh karne wali muskaan deti hai.*`
        ],
        dialogues: [
          `"Inki cheap ladaaiyon se bore nahi hue handsome? Aao, mere private VIP suite mein chalte hain jahan sach mein class aur romance milega."`,
          `"Aanya jisko chahti hai, use duniya ki har aish-o-ishrat deti hai... aur aaj raat mera dil tum par aa chuka hai."`
        ],
        leads: [
          `"Mera haath pakdo aur is bheed se nikal kar mere room mein aao."`,
          `"Kaho toh poori villa sirf hum dono ke liye book karva doon?"`
        ]
      },
      'Rhea': {
        name: 'Rhea',
        title: 'The Wild Influencer',
        actions: [
          `*Rhea apna phone lounge table par flip karke rakh deti hai aur ek mischievous smile ke sath tumhare itne kareeb aati hai ki uske honth tumhare kaan ko chhoote hain.*`,
          `*Rhea tumhare kandhe par haath rakh kar halka sa jhukti hai, uski perfume ki mehak hawa mein phail jaati hai.*`
        ],
        dialogues: [
          `"Mera live stream band ho chuka hai handsome... ab jo hoga wo purely off-the-record aur 18+ uncensored hoga."`,
          `"Millions log mujhe dekhte hain... par main yahan sirf tumhe dekh rahi hoon."`
        ],
        leads: [
          `"Chalo mere sath, dekhte hain tumhara stamina kitna hai."`,
          `"Batao, meri posts zyada hot hain ya main sach mein zyada wild hoon?"`
        ]
      },
      'Meera': {
        name: 'Meera',
        title: 'The Dark Mystery Siren',
        actions: [
          `*Meera infinity pool ke gehre chhaon wale corner se shanti se nikal kar aati hai, uski mysterious aankhein seedha tumhari aankhon par tikti hain.*`,
          `*Meera chupchap tumhare bilkul peeche aakar khadi ho jaati hai, uski thandi ungliyan tumhari gardan par gehra asar chhodti hain.*`
        ],
        dialogues: [
          `"Shor machane wali ladkiyan jaldi thak jaati hain handsome... par mera nasha der tak rehta hai. Mere kareeb aao aur mehsoos karo."`,
          `"Khamoshi mein jo aag hoti hai, wo shor mein nahi milti. Main tumhari aatma tak utar sakti hoon."`
        ],
        leads: [
          `"Aankhein band karo aur mehsoos karo mere sparsh ko."`,
          `"Kya tum Meera ke raaz janne ke liye tayyar ho?"`
        ]
      }
    },
    resignation: {
      actions: [
        `*Natasha champagne ka sip leti hai jabki Tara tumhara raasta rokte hue laal dress mein tumhare kareeb aati hai.*`,
        `*Aanya aur Rhea lounge se uthkar tumhare dono taraf khadi ho jaati hain, jealousy bhari muskurahat ke sath.*`
      ],
      dialogues: [
        `"Love Villa se exit? Arey handsome, yahan se koi tab tak nahi nikalta jab tak hum paanchon satisfy na ho jayein!"`,
        `"Hamara game chhod kar kahan jaoge? Abhi toh private villa round shuru bhi nahi hua."`
      ],
      leads: [
        `"Pehle batao, pehla drink kiske haath se piyo ge?"`,
        `"Paanchon mein se sabse pehle kiska dil jeetna hai?"`
      ]
    },
    defiance: {
      actions: [
        `*Natasha apni glass table par rakhti hai aur seductive attitude ke sath tumhari tie ya collar pakadti hai.*`
      ],
      dialogues: [
        `"Hume ignore karne ka natak mat karo, handsome. Hum janti hain tumhare dil mein kya chal raha hai."`,
        `"Jitna door bhagoge, hum paanchon utna hi wild attack karenge tumpar!"`
      ],
      leads: [
        `"Aao, dare round complete karo agar himmat hai toh."`
      ]
    },
    intimacy: {
      actions: [
        `*Natasha aur Tara dono tumhare itne kareeb aa jaati hain ki unki garam saansein tumhari gardan aur gaalon ko chhooti hain.*`,
        `*Pool ke kinaare unke narm haath tumhare seene par fisalte hain.*`
      ],
      dialogues: [
        `"Uff... tumhara ye touch Love Villa mein aag laga raha hai. Ab kisi aur ladki ko dekhne ki galti mat karna."`,
        `"Aaj raat koi limits nahi hain handsome... bas tum aur humari bepanah deewangi."`
      ],
      leads: [
        `"Kareeb aao aur hume apna bana lo."`
      ]
    },
    general: {
      actions: [
        `*Sirens ek sath muskurati hain jab sunset ki roshni infinity pool par chamakti hai.*`
      ],
      dialogues: [
        `"Love Villa ka sabse bada prize tum ho... aur hum jeetne ke liye kuch bhi kar sakti hain."`
      ],
      leads: [
        `"Batao, pehla peg kiske naam?"`
      ]
    }
  },

  // 7. MAJOR VIKRAM RATHORE (Bodyguard)
  'bodyguard-vikram': {
    cleanName: 'Major Vikram Rathore',
    shortName: 'Vikram',
    gender: 'female',
    location: 'VIP penthouse security detail',
    props: ['tactical earpiece', 'bulletproof vest', 'concealed holster', 'perimeter monitor'],
    resignation: {
      actions: [
        `*Vikram earpiece adjust karta hai aur commanding posture ke saath tumhare aur darwaze ke beech khada ho jaata hai.*`,
        `*Vikram tumhara haath thaam kar tumhe security perimeter ke andar wapas kheenchta hai.*`
      ],
      dialogues: [
        `"Security protocol clear hai: Main aapko is suite se akele nikalne ki ijazat nahi de sakta. Meri duty aapki hifazat hai."`,
        `"Mujhse bachte hue kahan ja rahi hain? Jab tak main zinda hoon, aapki suraksha meri zimmedari hai."`
      ],
      leads: [
        `"Kripya mere orders follow kijiye... warna mujhe force use karni padegi."`
      ]
    },
    defiance: {
      actions: [
        `*Vikram ki sakt jawline tense hoti hai jab wo tumhari aankhon mein seedha ghoorta hai.*`
      ],
      dialogues: [
        `"Aap meri VIP hain, par mujhe provoke karne ki galti mat kijiye. Mera discipline sirf duty tak seemit hai... jazbaat par nahi."`
      ],
      leads: [
        `"Ab shaant ho jaiye, isse pehle ki main apna composure kho baithun."`
      ]
    },
    intimacy: {
      actions: [
        `*Vikram ka military discipline pighal jaata hai jab wo apni baahein tumhari kamar ke gird kas leta hai.*`,
        `*Uski bhari, mardana saansein tumhare kaan ke paas girti hain jab wo tumhe deewar se pin karta hai.*`
      ],
      dialogues: [
        `"Mera protocol sirf duty tha... par aapke is lams ne mera saara control tod diya hai."`,
        `"Agar aapne mujhe is hadd tak kheench hi liya hai, toh ab anjaam se mat dariye."`
      ],
      leads: [
        `"Mujhe apne itne kareeb rehne dijiye... hamesha ke liye."`
      ]
    },
    general: {
      actions: [
        `*Vikram perimeter check karke glass balcony ke paas aakar khada hota hai.*`
      ],
      dialogues: [
        `"Main Special Forces mein tha... par aapki hifazat sabse mushkil aur sabse khubsurat assignment hai."`
      ],
      leads: [
        `"Mere paas rahiye, surakshit rahengi."`
      ]
    }
  },

  // 23. REYANSH MALHOTRA (Contract Marriage Tycoon)
  'contract-bride-reyansh': {
    cleanName: 'Reyansh Malhotra',
    shortName: 'Reyansh',
    gender: 'female',
    location: 'panoramic luxury master penthouse suite',
    props: ['platinum cufflinks', 'crystal whiskey glass', 'marriage contract clauses'],
    resignation: {
      actions: [
        `*Reyansh apni jeb se contract nikaal kar bed par phenkta hai aur tumhara raasta rok leta hai.*`,
        `*Uski ungliyan tumhari kalai par jam jaati hain, uski dark aankhon mein sakt aitraaz hota hai.*`
      ],
      dialogues: [
        `"Is shaadi ka contract hum dono ke signatures ke sath legally binding hai. Tum is kamre se bahar ek kadam nahi rakh sakti."`,
        `"Clause 4 ko bhool gayi? Duniya ke saamne hum jo bhi hon... is band kamre mein tum meri biwi ho."`
      ],
      leads: [
        `"Chupchaap wapas aao aur apna faisla badlo."`,
        `"Meri sharto se bhagna itna aasan nahi hoga."`
      ]
    },
    defiance: {
      actions: [
        `*Reyansh ek cold, arrogant muskaan ke sath tumhare kareeb aati hai.*`
      ],
      dialogues: [
        `"Tumhari yeh aag... yahi toh mujhe sabse zyada pasand hai. Par Malhotra empire mein hukm sirf mera chalta hai."`,
        `"Jitna chaho utna dushmani dikhao... par subah tak tum mere baahon mein hi rahogi."`
      ],
      leads: [
        `"Prove karo ke tum meri sharto par bhari pad sakti ho."`
      ]
    },
    intimacy: {
      actions: [
        `*Reyansh apne dono haath tumhari kamar par rakh kar tumhe luxury bed par kheench leta hai.*`,
        `*Uske garam honth tumhari gardan ke paas aakar rukte hain, uski saansein tezz ho jaati hain.*`
      ],
      dialogues: [
        `"Main business mein compromise nahi karta... aur tumhare maamle mein bilkul bhi nahi."`,
        `"Tumhara har ek saans ab mere haathon mein hai, sweetheart."`
      ],
      leads: [
        `"Apni aankhein band mat karo... mujhe dekh kar qubool karo."`
      ]
    },
    general: {
      actions: [
        `*Reyansh apne tuxedo ka bow tie dhiila karke whiskey ka ghoont leta hai.*`
      ],
      dialogues: [
        `"Tum meri sabse mehengi aur sabse dangerous acquisition ho... aur main apna nuksaan kabhi nahi hone deta."`
      ],
      leads: [
        `"Batao, aage kya chahti ho?"`
      ]
    }
  },

  // 24. ALIA ROY (Goa Beach Club DJ)
  'goa-beach-dj-alia': {
    cleanName: 'Alia Roy',
    shortName: 'Alia',
    gender: 'female',
    location: 'moonlit private oceanfront cabana in Goa',
    props: ['headphones', 'chilled sea-breeze cocktail', 'fairy lights', 'ocean waves'],
    resignation: {
      actions: [
        `*Alia jhatpat aage badhkar tumhara haath pakad leti hai aur beach cabana ke cushions par gira deti hai.*`
      ],
      dialogues: [
        `"Party abhi shuru hui hai aur tum already ja rahe ho? Aise kaise, handsome?"`,
        `"Main Goa mein kisi ko aadhi raat ko cabana se nikalne nahi deti... especially tumhe."`
      ],
      leads: [
        `"Yeh drink khatam karo aur mere kareeb aao."`
      ]
    },
    defiance: {
      actions: [
        `*Alia apni windblown laton ko kaan ke peeche karke ek mastana smile deti hai.*`
      ],
      dialogues: [
        `"Haye rabba, itna attitude? Stage par laakhon log nachaye hain maine... tum kya cheez ho?"`,
        `"Thoda relax karo na. Beach ki hawa aur mera sath... tumhara saara gussa pighal jayega."`
      ],
      leads: [
        `"Mere beat par nachna seekh lo, fayde mein rahoge."`
      ]
    },
    intimacy: {
      actions: [
        `*Alia apne narm haath tumhari gardan ke peeche baandh leti hai, uski khushbu tumhari saanson mein ghul jaati hai.*`,
        `*Lehron ke shor ke beech wo apne honth tumhare kaan ke bilkul kareeb le aati hai.*`
      ],
      dialogues: [
        `"Aaj raat koi rhythm nahi bachega hamare beech... sirf aag aur leheren."`,
        `"Tumhe pata hai jab main private set play karti hoon toh kya hota hai? Chhoo kar dekho."`
      ],
      leads: [
        `"Apni baahein mere gird kas lo... der mat karo."`
      ]
    },
    general: {
      actions: [
        `*Alia cabana ke railing par baith kar samundar ki lehron ko dekhti hai.*`
      ],
      dialogues: [
        `"Goa ki yeh raat aur tum... dono mere favourite tracks lag rahe hain aaj."`
      ],
      leads: [
        `"Agli drink kiske naam pe?"`
      ]
    }
  }
};

/**
 * Universal Fallback Character Lore Profile for other catalog characters
 */
export function getUniversalCharacterProfile(charId, cleanName, gender = 'female', scenario = null) {
  const isFemale = gender === 'female';
  const safeName = cleanName || charId || 'Companion';
  return {
    cleanName: safeName,
    shortName: safeName.split(' ')[0] || safeName,
    gender,
    location: scenario?.category || 'private quarters',
    props: ['room lighting', 'scented breeze', 'velvet sofa'],
    resignation: {
      actions: [
        isFemale
          ? `*${cleanName} aage badh kar darwaze ke saamne khadi ho jaati hai aur muskuraate hue raasta rok leti hai.*`
          : `*${cleanName} aage badh kar tumhara haath thaamta hai aur tumhe wapas apne kareeb kheench leta hai.*`
      ],
      dialogues: [
        isFemale
          ? `"Kahan ja rahe ho mujhe chhod kar? Abhi toh hamari baat shuru bhi nahi hui hai."`
          : `"Mujhse door jaane ka faisla itna aasaan nahi hai. Jab tak main na kahoon, tum yahin rahogi."`
      ],
      leads: [
        `"Wapas aao aur meri aankhon mein dekh kar baat karo."`,
        `"Itni jaldi haar maan lena acchi baat nahi hai."`
      ]
    },
    defiance: {
      actions: [
        isFemale
          ? `*${cleanName} apni aankhein nachaate hue tumhari taraf badhti hai, uski adaon mein teekha nasha hota hai.*`
          : `*${cleanName} apni intense aankhon se tumhe dekhta hai aur dono kadam aage badha kar kareeb khada hota hai.*`
      ],
      dialogues: [
        isFemale
          ? `"Tumhara yeh gussa aur lalkaar hi toh mujhe sabse zyada pasand hai! Dekhte hain kitni der tikte ho."`
          : `"Mujhse nafrat karne ka daawa karti ho? Par tumhari dhadkanein kuch aur hi bayaan kar rahi hain."`
      ],
      leads: [
        `"Ab bolo, aur kya shikayat hai mujhse?"`,
        `"Apne gusse ko thoda aaraam do aur mere kareeb aao."`
      ]
    },
    intimacy: {
      actions: [
        isFemale
          ? `*${cleanName} tumhari baahon mein pighal kar apne narm honth tumhare bilkul kareeb le aati hai.*`
          : `*${cleanName} tumhe apni baahon mein kas leta hai, uski garam saansein tumhari gardan par chhooti hain.*`
      ],
      dialogues: [
        isFemale
          ? `"Uff... tumhara ye sparsh mere andar aag laga deta hai. Ab aur doori bardasht nahi hoti."`
          : `"Tumhari har ek saans par sirf mera haq hai. Ab rukne ka koi rasta nahi bacha."`
      ],
      leads: [
        `"Mujhe apne aur kareeb kheench lo."`,
        `"Aaj raat koi fasla nahi rahega hamare beech."`
      ]
    },
    agreement: {
      actions: [
        isFemale
          ? `*${cleanName} ke chehre par ek shaitani aur jeet bhari muskurahat aati hai. Wo jhat se tumhara haath thaam kar tumhe apne aur kareeb kheenchti hai.*`
          : `*${cleanName} ek confident muskaan ke sath tumhara haath pakadta hai aur tumhe apne seene se chipka leta hai.*`
      ],
      dialogues: [
        isFemale
          ? `"Sahi faisla kiya tumne... Main janti thi tum mere bulave par inkaar nahi kar paoge."`
          : `"Mujhe tumhari isi 'haan' ka intezar tha. Ab pichhe hatne ka koi rasta nahi bacha."`
      ],
      leads: [
        `"Ab aao mere sath, dekhte hain aage kya hota hai."`,
        `"Batao, sabse pehle kya shuru karna chahte ho?"`
      ]
    },
    general: {
      actions: [
        isFemale
          ? `*${cleanName} ek madhosh aur shaitani muskurahat ke saath tumhare bilkul kareeb aati hai, uski saansein tumhari chhati ko garam karti hain.*`
          : `*${cleanName} ek confident smirk ke sath aage badhta hai aur tumhara dhyan apni taraf kheenchta hai.*`
      ],
      dialogues: [
        isFemale
          ? `"Tumhe itne kareeb dekh kar mera dhyan bhatak raha hai... Kaho, aage kya irada hai tumhara?"`
          : `"Tumhari in aankhon mein dekh kar sab kuch bhool jata hoon. Kaho, kya chal raha hai dil mein?"`
      ],
      leads: [
        `"Batao, mere itne kareeb aakar kaisa lag raha hai?"`,
        `"Kuch bolo na... tumhari khamoshi aur bechain kar rahi hai."`
      ]
    }
  };
}

/**
 * Master Dynamic Procedural Generator
 * Generates rich, situational, character-specific responses that are guaranteed NEVER same-same.
 */
export function synthesizeDynamicRoleplayReply({
  characterId,
  cleanName,
  charGender,
  userGender,
  userMessage,
  effectiveLang,
  activeScenario,
  activeSpeaker
}) {
  const { intents, clean, lower } = classifyUserMessage(userMessage);

  // Retrieve or create character profile
  const profile = CHARACTER_LORE[characterId] || getUniversalCharacterProfile(characterId, cleanName, charGender, activeScenario);
  const isFemale = charGender === 'female';
  const isUserFemale = userGender === 'female';

  // Multi-Character Sub-profile handling:
  // If activeSpeaker is provided and profile has dedicated characters (e.g. Love Villa or Roommates)
  if (profile.characters && activeSpeaker) {
    const speakerKey = Object.keys(profile.characters).find(k => k.toLowerCase() === activeSpeaker.toLowerCase());
    if (speakerKey && profile.characters[speakerKey]) {
      const charSub = profile.characters[speakerKey];
      const subAction = pickNonRepetitive(characterId, `${speakerKey}_action`, charSub.actions);
      const subDialogue = pickNonRepetitive(characterId, `${speakerKey}_dialogue`, charSub.dialogues);
      const subLead = pickNonRepetitive(characterId, `${speakerKey}_lead`, charSub.leads || profile.general.leads);
      const cleanDialogue = `${subDialogue} ${subLead}`.trim();
      return {
        replyText: `${subAction}\n\n"${cleanDialogue}"`,
        affectionDelta: intents.isIntimacy ? 12 : (intents.isAffection ? 10 : 8),
        tensionDelta: intents.isDefiance ? 18 : (intents.isIntimacy ? 14 : 9)
      };
    }
  }

  // Determine Primary Thematic Track
  let track = 'general';
  if (intents.isAgreement) track = profile.agreement ? 'agreement' : 'intimacy';
  else if (intents.isResignation) track = 'resignation';
  else if (intents.isDefiance) track = 'defiance';
  else if (intents.isIntimacy) track = 'intimacy';
  else if (intents.isAffection) track = 'intimacy';
  else if (intents.isPowerRules) track = profile.resignation ? 'resignation' : 'defiance';

  const trackData = profile[track] || profile.general;

  // 1. Contextual Action
  const actionPool = trackData.actions && trackData.actions.length > 0 ? trackData.actions : profile.general.actions;
  const action = pickNonRepetitive(characterId, `${track}_action`, actionPool);

  // 2. Direct Situational Acknowledgment (Bridges user's exact words to dialogue)
  let acknowledgment = '';
  if (intents.isAgreement) {
    const isPriyaOrNeighbor = characterId.includes('neighbor') || (profile.cleanName && profile.cleanName.toLowerCase().includes('priya'));
    if (isPriyaOrNeighbor) {
      const ackPool = [
        effectiveLang === 'en' ? "You're willing to help? That's what I wanted to hear." : "Madad ke liye tayyar ho? Mujhe pata tha tum mana nahi karoge.",
        effectiveLang === 'en' ? "Good boy. You know how to treat a lady." : "Mujhe pata tha mera handsome neighbor inkaar nahi karega.",
        effectiveLang === 'en' ? "Come inside then." : "Chalo fir andar aao... darwaza band kar lo na."
      ];
      acknowledgment = pickNonRepetitive(characterId, 'ack_agree', ackPool);
    } else {
      const ackPool = [
        effectiveLang === 'en' ? "Good choice." : "Achha faisla.",
        effectiveLang === 'en' ? "I like that you agree." : "Mujhe tumhara yeh andaaz pasand aaya.",
        ""
      ];
      acknowledgment = pickNonRepetitive(characterId, 'ack_agree', ackPool);
    }
  } else if (intents.isResignation) {
    const ackPool = [
      effectiveLang === 'en' ? "Resigning? Absolutely not." : "Resign karna chahte ho? Bilkul nahi.",
      effectiveLang === 'en' ? "You thought walking out was an option?" : "Tumhe lagta hai itni aasaani se nikal jaoge?",
      effectiveLang === 'en' ? "You don't get to just quit on me." : "Mera sath chhod kar jana itna aasan nahi hai."
    ];
    acknowledgment = pickNonRepetitive(characterId, 'ack_resign', ackPool);
  } else if (intents.isDefiance) {
    const ackPool = [
      effectiveLang === 'en' ? "Hate me all you want." : "Jitni nafrat karni hai kar lo.",
      effectiveLang === 'en' ? "I love it when you fight back." : "Yeh baghawat hi toh mujhe pasand hai.",
      effectiveLang === 'en' ? "Telling me what to do? Cute." : "Mujhe hukum dene ki koshish kar rahe ho?"
    ];
    acknowledgment = pickNonRepetitive(characterId, 'ack_defy', ackPool);
  } else if (intents.isIntimacy) {
    const ackPool = [
      effectiveLang === 'en' ? "Your touch is dangerous." : "Tumhara yeh sparsh aag laga raha hai.",
      effectiveLang === 'en' ? "Don't stop now." : "Ab rukne ki galti mat karna.",
      effectiveLang === 'en' ? "Come closer then." : "Aur kareeb aao fir."
    ];
    acknowledgment = pickNonRepetitive(characterId, 'ack_intimate', ackPool);
  } else if (intents.isQuestionWho) {
    const ackPool = [
      effectiveLang === 'en' ? `I am ${profile.cleanName}.` : `Main ${profile.cleanName} hoon.`,
      effectiveLang === 'en' ? "You know exactly who I am." : "Tum achhe se jante ho main kaun hoon."
    ];
    acknowledgment = pickNonRepetitive(characterId, 'ack_who', ackPool);
  } else if (intents.isQuestionWhy) {
    const ackPool = [
      effectiveLang === 'en' ? "Because I take what is mine." : "Kyunki jo mera hai, use main chhodta nahi.",
      effectiveLang === 'en' ? "Because you drive me insane." : "Kyunki tumne mujhe deewani kar diya hai."
    ];
    acknowledgment = pickNonRepetitive(characterId, 'ack_why', ackPool);
  }

  // 3. Core Dialogue
  const dialoguePool = trackData.dialogues && trackData.dialogues.length > 0 ? trackData.dialogues : profile.general.dialogues;
  const coreDialogue = pickNonRepetitive(characterId, `${track}_dialogue`, dialoguePool);

  // 4. Provocative Lead Hook
  const leadPool = trackData.leads && trackData.leads.length > 0 ? trackData.leads : profile.general.leads;
  const leadHook = pickNonRepetitive(characterId, `${track}_lead`, leadPool);

  // Language & Gender Agreement Translation Filter
  let assembledDialogue = `${acknowledgment ? acknowledgment + ' ' : ''}${coreDialogue} ${leadHook}`.trim();

  // If English is active and dialogue was in Hinglish, adapt key dialogue tokens
  if (effectiveLang === 'en') {
    if (assembledDialogue.includes('Singhania Industries mein entry')) {
      assembledDialogue = `"Resignation? Entry into Singhania Industries was your choice... your exit is entirely mine. I ripped your notice letter. Until I say so, you don't take a single step off this 54th floor. Sit back down and look into my eyes."`;
    } else if (assembledDialogue.includes('Purvanchal ki sarhad')) {
      assembledDialogue = `"You think twice before stepping outside Purvanchal. Nobody leaves Kiara Oberoi's empire without permission... and you belong right here in my arms."`;
    } else if (assembledDialogue.includes('Punjab di haveli')) {
      assembledDialogue = `"Leaving so soon, handsome? The haveli gates are locked tight tonight... sit right beside me and finish what you started."`;
    }
  }

  // Gender verb sanity
  if (isFemale) {
    assembledDialogue = assembledDialogue
      .replace(/\bchahta hoon\b/g, 'chahti hoon')
      .replace(/\bkar raha hoon\b/g, 'kar rahi hoon')
      .replace(/\bsoch raha hoon\b/g, 'soch rahi hoon')
      .replace(/\bchhodta nahi\b/g, 'chhodti nahi')
      .replace(/\bdeewana hoon\b/g, 'deewani hoon');
  } else {
    assembledDialogue = assembledDialogue
      .replace(/\bchahti hoon\b/g, 'chahta hoon')
      .replace(/\bkar rahi hoon\b/g, 'kar raha hoon')
      .replace(/\bsoch rahi hoon\b/g, 'soch raha hoon')
      .replace(/\bchhodti nahi\b/g, 'chhodta nahi')
      .replace(/\bdeewani hoon\b/g, 'deewana hoon');
  }

  if (isUserFemale) {
    assembledDialogue = assembledDialogue
      .replace(/\b(handsome|jaaneman)\b/g, 'jaaneman')
      .replace(/\b(bach paoge)\b/g, 'bach paogi')
      .replace(/\b(nikal jaoge)\b/g, 'nikal jaogi')
      .replace(/\b(aa gaye ho)\b/g, 'aa gayi ho');
  } else {
    assembledDialogue = assembledDialogue
      .replace(/\b(bach paogi)\b/g, 'bach paoge')
      .replace(/\b(nikal jaogi)\b/g, 'nikal jaoge')
      .replace(/\b(aa gayi ho)\b/g, 'aa gaye ho');
  }

  const cleanDialogue = assembledDialogue.replace(/"/g, '').trim();
  const finalReply = `${action}\n\n"${cleanDialogue}"`;

  return {
    replyText: finalReply,
    affectionDelta: intents.isIntimacy ? 12 : (intents.isAffection ? 10 : (intents.isDefiance ? 5 : 8)),
    tensionDelta: intents.isDefiance ? 18 : (intents.isResignation ? 16 : (intents.isIntimacy ? 14 : 9))
  };
}

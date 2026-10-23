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
        `*Arya desk se uth kar tezi se darwaze ki taraf badhti hai aur biometric lock engage kar deti hai, metal door thak se band hota hai.*`,
        `*Arya tumhari resignation file ko uthakar bina palke jhapkaye do tukdon mein faad deti hai aur scraps tumhare aage gira deti hai.*`,
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
        `*Arya ki aankhon mein ek dangerous, possessive chamak aati hai aur wo tumhari dono kalaiyan pakad kar desk par pin kar deti hai.*`,
        `*Arya tumhari thhodi ko do ungliyon mein pakad kar apna chehra tumhare honthon ke bilkul kareeb le aati hai.*`,
        `*Arya ek kadam aur aage badhti hai taaki tum deewar aur uske towering frame ke beech mein qaid ho jao.*`
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
        `*Arya tumhe apni majboot baahon mein kas kar mahogany desk par baitha deti hai, uski ungliyan tumhari kamar par dabav banati hain.*`,
        `*Arya apne honth tumhari gardan ke narm hisse par tika deti hai, uski saansein garam aag ki tarah jalati hain.*`,
        `*Arya tumhare baalon mein haath phansa kar tumhara chehra upar uthati hai aur gehraai se dekhta hai.*`
      ],
      dialogues: [
        `"Poore din boardroom mein itni professional ban rahi theen, aur ab mere samne ye haal hai..."`,
        `"Tumhara har ek lams mere dimag se saara control chheen leta hai. Aaj raat koi rules nahi bachenge."`,
        `"Tumhare in honthon par sirf mera haq hai, aur main apna haq poori shiddat se chheen leti hoon."`
      ],
      leads: [
        `"Apne haath mere kandhon se mat hatana... ek pal ke liye bhi nahi."`,
        `"Ab batao, kya ab bhi resign karna chahti ho?"`
      ]
    },
    general: {
      actions: [
        `*Arya whiskey ka glass desk par rakhti hai aur tumhare bilkul aamne-saamne aati hai.*`,
        `*Arya apne dono haath pockets mein daal kar ek commanding nazar tumpar tikaye rakhti hai.*`
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
        `*Kiara apni loaded gun table par thak se rakhti hai aur cigar ka dhuwan hawa mein chhodte hue tumhari taraf badhta hai.*`,
        `*Kiara apna narm kohl-sundar haath tumhari gardan ke peeche rakh kar tumhe ek jhatke mein apne bulletproof jacket se chipka leti hai.*`
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
        `*Kiara ke chehre par ek khaufnaak aur aashiqana muskurahat aati hai aur wo tumhare honthon ke kareeb jhukti hai.*`,
        `*Kiara tumhari kamar ko apni majboot giraft mein le kar tumhe sofa par halka sa gira deti hai.*`
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
        `*Kiara ki sakht ungliyan tumhare baalon mein phasti hain aur wo tumhe itne kareeb kheenchti hai ki uske seene ki aag tumhe mehsus ho.*`,
        `*Kiara apne garam honth tumhari gardan par daba deti hai, uski bhari saansein tumhari dhadkan badha deti hain.*`
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
        `*Kiara barish ki boondon ke beech khada apni Maybach ki chaabi table par uchhalti hai aur tumhari taraf aati hai.*`
      ],
      dialogues: [
        `"Jahan Kiara khadi hoti hai, wahan rules hum banate hain. Aur mera pehla rule yeh hai ki tum hamesha mere paas rahogi."`
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
    cleanName: 'Major Avantika Rathore',
    shortName: 'Avantika',
    gender: 'female',
    location: 'VIP penthouse security detail',
    props: ['tactical earpiece', 'bulletproof vest', 'concealed holster', 'perimeter monitor'],
    resignation: {
      actions: [
        `*Avantika earpiece adjust karti hai aur commanding posture ke saath tumhare aur darwaze ke beech khadi ho jaati hai.*`,
        `*Avantika tumhara haath thaam kar tumhe security perimeter ke andar wapas kheenchta hai.*`
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
        `*Avantika ki sakt jawline tense hoti hai jab wo tumhari aankhon mein seedha ghoorta hai.*`
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
        `*Avantika ka military discipline pighal jaata hai jab wo apni baahein tumhari kamar ke gird kas leta hai.*`,
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
        `*Avantika perimeter check karke glass balcony ke paas aakar khada hota hai.*`
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

// Universal Catalog ID Aliases Mapping
CHARACTER_LORE['cold-ceo-resignation'] = CHARACTER_LORE['boss-obsession-aryan'];
CHARACTER_LORE['syndicate-queen-kiara'] = CHARACTER_LORE['kabir'];
CHARACTER_LORE['roommates-rain-blackout'] = CHARACTER_LORE['rival-roommates-blackout'];
CHARACTER_LORE['bodyguard-avantika'] = CHARACTER_LORE['bodyguard-vikram'];
CHARACTER_LORE['punjab-passion'] = CHARACTER_LORE['punjab-passion-simran'];
CHARACTER_LORE['dr-elena-vance'] = CHARACTER_LORE['professor-elena'];

/**
 * Universal Fallback Character Lore Profile for other catalog characters
 */
export function getUniversalCharacterProfile(charId, cleanName, gender = 'female', scenario = null) {
  const isFemale = gender === 'female';
  const safeName = cleanName || charId || 'Companion';
  const category = (scenario?.category || '').toLowerCase();

  return {
    cleanName: safeName,
    shortName: safeName.split(' ')[0] || safeName,
    gender,
    location: scenario?.category || 'private quarters',
    props: ['velvet couch', 'subtle room lighting', 'whispered breath', 'scented air'],
    resignation: {
      actions: isFemale ? [
        `*${cleanName} aage badh kar darwaze ke saamne khadi ho jaati hai aur muskuraate hue raasta rok leti hai.*`,
        `*${cleanName} tumhari kalai ko narm par mazboot pakad mein leti hai aur darwaza halka sa band kar deti hai.*`,
        `*${cleanName} apni aankhon mein ek teekha aitraaz liye tumhare seene ke bilkul samne aakar khadi hoti hai.*`,
        `*${cleanName} dheere se aage badhti hai aur tumhara rasta rokte hue apni zulfein jhatakti hai.*`,
        `*${cleanName} ek chhedte hue andaaz mein tumhare coat ya shirt ka collar pakad kar wapas kheenchti hai.*`
      ] : [
        `*${cleanName} aage badh kar tumhara haath thaamta hai aur tumhe wapas apne kareeb kheench leta hai.*`,
        `*${cleanName} darwaze par haath rakh kar khada hota hai aur commanding andaaz mein tumhe dekhta hai.*`,
        `*${cleanName} tumhari taraf tezi se aage badhta hai aur fasle mita deta hai.*`
      ],
      dialogues: isFemale ? [
        `"Kahan ja rahe ho mujhe chhod kar? Abhi toh hamari baat shuru bhi nahi hui hai."`,
        `"Itni aasaani se nikalne ka rasta nahi milega, handsome. Jab tak humara faisla na ho, tum yahin rukoge."`,
        `"Mera saath chhod kar jaana itna aasan lagta hai tumhe? Zara meri aankhon mein dekh kar kaho."`,
        `"Darwaza tabhi khulega jab main chaahoongi. Chalo, wapas aao aur baitho mere paas."`,
        `"Bhaagne ki koshish mat karo... hum dono jante hain tumhara dil yahi rehna chahta hai."`
      ] : [
        `"Mujhse door jaane ka faisla itna aasaan nahi hai. Jab tak main na kahoon, tum yahin rahogi."`,
        `"Kahan jaa rahi ho? Tumhara aur mera hisaab abhi baaki hai."`,
        `"Mera haath chhod kar jaana itna aasan nahi hoga tumhare liye."`
      ],
      leads: [
        `"Wapas aao aur meri aankhon mein dekh kar baat karo."`,
        `"Itni jaldi haar maan lena acchi baat nahi hai."`,
        `"Batao, sach mein jaana chahte ho ya bas mera sabr aazma rahe ho?"`,
        `"Mere kareeb aao... pichhe hatne ki gunjaish nahi hai."`
      ]
    },
    defiance: {
      actions: isFemale ? [
        `*${cleanName} apni aankhein nachaate hue tumhari taraf badhti hai, uski adaon mein teekha nasha hota hai.*`,
        `*${cleanName} ek challenging muskaan ke sath tumhare kandhe par ungli tikati hai.*`,
        `*${cleanName} tumhari defiant aankhon mein jhankti hai aur thoda aur kareeb aakar smirk karti hai.*`,
        `*${cleanName} apni kamar par haath rakh kar ek kadam aur aage badhati hai, uski saansein tumhare chehre ko garam karti hain.*`,
        `*${cleanName} tumhari baghawat par halki si aashiqana hansi hasti hai aur tumhari collar theek karti hai.*`
      ] : [
        `*${cleanName} apni intense aankhon se tumhe dekhta hai aur dono kadam aage badha kar kareeb khada hota hai.*`,
        `*${cleanName} tumhari baghawat par smirk karta hai aur tumhari thhodi ko ungli se uthata hai.*`,
        `*${cleanName} deewar ke kareeb aakar tumhe apne commanding aanchal mein gher leta hai.*`
      ],
      dialogues: isFemale ? [
        `"Tumhara yeh gussa aur lalkaar hi toh mujhe sabse zyada pasand hai! Dekhte hain kitni der tikte ho."`,
        `"Mujhe hukum dene ki koshish kar rahe ho? Mujhe challenge karne ka nateeja pata hai na?"`,
        `"Jitna ladoge, utna hi mere jaal mein phaste jaoge, handsome."`,
        `"Tumhari in baaghi aankhon mein dekh kar mera shauq aur badh jata hai."`,
        `"Yeh teekha andaaz bohot janchta hai tumpar... par aakhir mein jeet meri hi hogi."`
      ] : [
        `"Mujhse nafrat karne ka daawa karti ho? Par tumhari dhadkanein kuch aur hi bayaan kar rahi hain."`,
        `"Yeh defiance bohot sexy hai, par mere samne zyada der nahi chalegi."`,
        `"Lalkaarne se pehle soch liya karo ke kis se takra rahi ho."`
      ],
      leads: [
        `"Ab bolo, aur kya shikayat hai mujhse?"`,
        `"Apne gusse ko thoda aaraam do aur mere kareeb aao."`,
        `"Dikhao kitna dum hai tumhari in baaton mein."`,
        `"Khamosh kyun ho gaye? Ladaai jari rakho na."`
      ]
    },
    intimacy: {
      actions: isFemale ? [
        `*${cleanName} tumhari baahon mein pighal kar apne narm honth tumhare bilkul kareeb le aati hai.*`,
        `*${cleanName} tumhare seene par apna haath phirati hai, uski garam saansein tumhari gardan ko chhooti hain.*`,
        `*${cleanName} tumhare baalon mein ungliyan daalti hai aur gehri madhosh nazron se tumhe dekhti hai.*`,
        `*${cleanName} thoda aur aage khisak kar tumhari god ya baahon mein simat jaati hai.*`,
        `*${cleanName} apne narm komal haathon ko tumhari peeth ke gird baandh leti hai.*`
      ] : [
        `*${cleanName} tumhe apni baahon mein kas leta hai, uski garam saansein tumhari gardan par chhooti hain.*`,
        `*${cleanName} tumhari kamar ko pakad kar apne seene se bilkul chipka leta hai.*`,
        `*${cleanName} tumhare honthon ke paas aakar rukta hai, uski saansein tez ho jaati hain.*`
      ],
      dialogues: isFemale ? [
        `"Uff... tumhara ye sparsh mere andar aag laga deta hai. Ab aur doori bardasht nahi hoti."`,
        `"Tum itne kareeb aate ho toh mera saara dhyan bhatak jata hai... jo chahein kijiye aaj."`,
        `"Is pal ka intezar shayad hum dono ko tha... ab koi parda nahi rehna chahiye."`,
        `"Tumhari chhuwan mein ek ajeeb sa junoon hai, handsome. Mujhe apna bana lo."`,
        `"Aaj raat koi boundary nahi bachegi... bas tum aur main."`
      ] : [
        `"Tumhari har ek saans par sirf mera haq hai. Ab rukne ka koi rasta nahi bacha."`,
        `"Tumhare is lams ne mera saara control chheen liya hai."`,
        `"Aaj raat hum dono ke beech koi teesra nahi aayega."`
      ],
      leads: [
        `"Mujhe apne aur kareeb kheench lo."`,
        `"Aaj raat koi fasla nahi rahega hamare beech."`,
        `"Apne haath mere jism se mat hatana... ek pal ke liye bhi nahi."`,
        `"Mehsoos karo meri dhadkanon ko, kitni tez ho chuki hain."`
      ]
    },
    agreement: {
      actions: isFemale ? [
        `*${cleanName} ke chehre par ek shaitani aur jeet bhari muskurahat aati hai. Wo jhat se tumhara haath thaam kar tumhe apne aur kareeb kheenchti hai.*`,
        `*${cleanName} khushi se chahak uthti hai aur halki si chhedkhani ke sath tumhare kandhe se lag jaati hai.*`,
        `*${cleanName} apni aankhon mein ek chamak liye tumhari taraf dekhti hai aur aage badhti hai.*`,
        `*${cleanName} tumhari shirt pakad kar tumhe halka sa kheenchti hai aur muskurati hai.*`,
        `*${cleanName} tumhare gaal par halka sa sparsh karti hai aur shaitani smirk deti hai.*`
      ] : [
        `*${cleanName} ek confident muskaan ke sath tumhara haath pakadta hai aur tumhe apne seene se chipka leta hai.*`,
        `*${cleanName} tumhari 'haan' sunkar satisfy hota hai aur tumhari kamar mein haath daalta hai.*`,
        `*${cleanName} ek kadam aage badha kar tumhe apne kareeb le leta hai.*`
      ],
      dialogues: isFemale ? [
        `"Sahi faisla kiya tumne... Main janti thi tum mere bulave par inkaar nahi kar paoge."`,
        `"Mujhe pata tha tum itne samajhdar ho. Ab aao, dekhte hain aage kya hota hai."`,
        `"Tumhari isi ada par toh dil haar jaati hoon, handsome. Bilkul sahi choice ki tumne."`,
        `"Chalo, jab raazi ho hi gaye ho, toh ab der kis baat ki?"`,
        `"Tumne haan keh kar aag aur bhadka di hai... ab anjaam ke liye tayyar raho."`
      ] : [
        `"Mujhe tumhari isi 'haan' ka intezar tha. Ab pichhe hatne ka koi rasta nahi bacha."`,
        `"Sahi rasta chuna tumne. Ab jo main kahoon, wahi hoga."`,
        `"Mujhe pasand aaya tumhara yeh faisla."`
      ],
      leads: [
        `"Ab aao mere sath, dekhte hain aage kya hota hai."`,
        `"Batao, sabse pehle kya shuru karna chahte ho?"`,
        `"Mera haath pakdo aur ek qadam aage badhao."`,
        `"Ab sharmaana chhod do aur shuruat karo."`
      ]
    },
    general: {
      actions: isFemale ? [
        `*${cleanName} apni zulfon ko nazaakat se sambhaalti hui tumhari taraf badhti hai, uski kajraari aankhon mein gahra nasha hota hai.*`,
        `*${cleanName} ek dilkash aur haseen muskaan ke saath aage aati hai aur tumhari baazu par narm haath rakhti hai.*`,
        `*${cleanName} thoda sa jhuk kar tumhari aankhon mein aankhein daalti hai, uski khushbu hawa mein bikhar jaati hai.*`,
        `*${cleanName} ek provocative ada se aage badhkar tumhare aur apne beech ke saare fasle mita deti hai.*`,
        `*${cleanName} halke se apne honth kaat ti hai aur shaitani nazron se tumhe sar se paanv tak dekhti hai.*`,
        `*${cleanName} tumhare bilkul saamne aakar khadi hoti hai, uski saansein tumhare seene ko garmi deti hain.*`,
        `*${cleanName} sofa ya deewar se tek laga kar tumhari taraf aakarshak andaaz mein dekhti hai.*`
      ] : [
        `*${cleanName} ek confident smirk ke sath aage badhta hai aur tumhara dhyan apni taraf kheenchta hai.*`,
        `*${cleanName} pockets mein haath daal kar tumhare samne aakar khada hota hai aur gehri nazar daalta hai.*`,
        `*${cleanName} tumhare kareeb aakar tumhari aankhon mein dekhta hai, uska roop commanding hota hai.*`,
        `*${cleanName} ek intense glance ke sath tumhari taraf badhta hai.*`
      ],
      dialogues: isFemale ? [
        `"Tumhari in aankhon mein dekh kar sab kuch bhoolne ko dil karta hai... Kaho, dil mein kya chal raha hai tumhare?"`,
        `"Tumse baat karna har baar ek naya nasha ban jata hai, handsome. Kaho, aage kya socha hai?"`,
        `"Humare beech ka ye khichaav chupaye nahi chhupta... Batao, kab tak duri banaye rakhoge?"`,
        `"Mujhe tumhara yeh be-baak andaaz bohot pasand hai... Par dekhna ye hai ke aage kya karte ho."`,
        `"Itne chup kyu ho? Tumhari ye khamoshi mujhe aur bechain kar rahi hai."`,
        `"Jitna door jane ki koshish karoge, main utna hi kareeb aati jaungi."`,
        `"Tumhari har ek baat mere dil ki dhadkan tez kar deti hai... sach mein."`
      ] : [
        `"Tumhari in aankhon mein dekh kar sab kuch bhool jata hoon. Kaho, kya chal raha hai dil mein?"`,
        `"Tumse baat karke lagta hai jaise waqt tham gaya ho. Kaho, kya irada hai tumhara?"`,
        `"Mujhe tumhara ye andaaz shuru se pasand aaya hai."`,
        `"Ab jab hum akele hain, toh saaf-saaf batao dil ki baat."`
      ],
      leads: [
        `"Batao, mere itne kareeb aakar kaisa lag raha hai?"`,
        `"Kuch bolo na... tumhari khamoshi aur bechain kar rahi hai."`,
        `"Aao, thoda aur paas aao... faasle mujhe pasand nahi."`,
        `"Meri aankhon mein dekho aur kaho jo dil mein hai."`,
        `"Ab piche mat hatna, jo baat hai aage badhao."`
      ]
    }
  };
}

/**
 * Master Dynamic Procedural Generator
 * Generates rich, situational, character-specific responses that are guaranteed NEVER same-same.
 */

/**
 * Context-Aware Scene Progression Resolver
 * Evaluates the preceding AI message/openingHook and active scenario to continue the story narrative seamlessly.
 */
export function resolveSceneContinuation({
  activeScenario,
  history = [],
  userMessage = '',
  cleanName = 'Companion',
  isFemale = true,
  isUserFemale = false,
  effectiveLang = 'hinglish',
  intents = {}
}) {
  const lastAiMsg = [...history].reverse().find(m => m.sender !== 'user')?.text || activeScenario?.openingHook || '';
  const hookLower = (lastAiMsg + ' ' + (activeScenario?.openingHook || '') + ' ' + (activeScenario?.summary || '')).toLowerCase();
  const userLower = userMessage.toLowerCase();

  const isHelpScene = /balcony|door|electrician|repair|fix|madad|help|phans|stuck|lock|chabi/i.test(hookLower);
  const isContractScene = /resignation|notice|contract|clause|renegotiate|54th|office|boss/i.test(hookLower);
  const isBlackoutScene = /blackout|candle|mombatti|rain|toofan|dark|andhera|dorm|roommate/i.test(hookLower);
  const isVillaDrinkScene = /villa|champagne|pool|peg|drink|siren|cocktail|lounge/i.test(hookLower);
  const isBodyguardScene = /bodyguard|protocol|threat|bedroom|suite|security|sidearm|vip/i.test(hookLower);
  const isSecretRoomScene = /mom and dad|downstairs|dinner|secret|bedroom|satin|sister|brother/i.test(hookLower);
  const isExamScene = /professor|thesis|examination|office|faculty|grades|literature/i.test(hookLower);
  const isRacerScene = /garage|racer|bike|motorcycle|grease|wrench|workbench|speed/i.test(hookLower);
  const isMafiaScene = /mafia|queen|purvanchal|syndicate|whiskey|tumbler|infiltrator|adda/i.test(hookLower);

  const isEn = (effectiveLang === 'en');

  // SCENE 1: HELP / STUCK BALCONY DOOR (e.g. Priya Sharma)
  if (isHelpScene) {
    if (intents.isAgreement) {
      const action = isFemale
        ? `*${cleanName} ke chehre par ek rahat aur jeet bhari muskurahat aati hai. Wo jhat se tumhara haath thaam kar tumhe corridor se seedha apne flat ke andar kheenchti hai, aur darwaza band karke kundi laga deti hai.*`
        : `*${cleanName} ek relieved muskaan ke sath tumhara haath pakadta hai aur tumhe apne flat ke andar le aata hai, darwaza lock karte hue.*`;
      const dialogue = isEn
        ? `"Thank you so much! I knew my handsome neighbor wouldn't leave a lady stranded. Come inside... the balcony door is right through my bedroom. Let's see how handy you really are... or did you just want an excuse to visit my room?"`
        : `"Thank you so much, handsome! Mujhe pata tha mera neighbor itna sweet hai ki mana nahi karega... Aao andar. Balcony ka door bedroom ke bilkul sath hai. Pehle darwaza theek karoge ya mere liye ek cup chai banaoge?"`;
      return { action, dialogue };
    }
  }

  // SCENE 2: RESIGNATION DENIED / CEO CONTRACT (e.g. Arya Singhania)
  if (isContractScene) {
    if (intents.isAgreement || userLower.includes('renegotiate') || userLower.includes('clause') || userLower.includes('baith')) {
      const action = isFemale
        ? `*${cleanName} desk par rakhi contract file ko kholti hai aur executive leather chair ki taraf ishara karti hai, uski amber aankhon mein commanding jeet jhalakti hai jab wo tumhare bilkul kareeb aati hai.*`
        : `*${cleanName} file desk par rakhta hai aur chair ki taraf ishara karta hai, uski nazar commanding hoti hai.*`;
      const dialogue = isEn
        ? `"Good boy. You know better than to walk out on me. Sit down right in front of me... The first clause of your renegotiated contract is that you belong exclusively on this 54th floor, answering to my personal commands every night. Do you accept... or do you want to hear the penalty?"`
        : `"Good boy. Samajhdar aadmi ho, jaante ho Arya Singhania ke aage surrender karne mein hi faayda hai. Baitho samne... Pehla clause ye hai ki ab se tumhara resignation permanent cancel hai aur tum har raat mere personal orders par chaloge. Kaho, manzoor hai ya penalty sunoge?"`;
      return { action, dialogue };
    }
  }

  // SCENE 3: ROOMMATES / RAIN & BLACKOUT (e.g. Maya & Chloe)
  if (isBlackoutScene) {
    if (intents.isAgreement || userLower.includes('sit') || userLower.includes('baith') || userLower.includes('candle') || userLower.includes('show')) {
      const action = `*${cleanName} mombatti ko utha kar sofa ke paas aati hai aur rug par thoda khisak kar tumhare baithne ki jagah banati hai, bahar toofani bijli kamre ko chamka deti hai.*`;
      const dialogue = isEn
        ? `"I knew you wouldn't leave us alone in the dark. Sit right here between us by the candlelight. The storm outside isn't letting up anytime soon... so who makes the first move tonight?"`
        : `"Maine kaha tha na, is toofani raat mein hum dono ke beech koi teesra nahi hoga. Light aane mein ghanton lagenge... aur andhere mein time pass karne ke mere paas bohot tareeqe hain. Idhar baitho mombatti ke paas... pehla dare tum decide karoge ya main?"`;
      return { action, dialogue };
    }
  }

  // SCENE 4: LOVE VILLA / DRINKS & POOL
  if (isVillaDrinkScene) {
    if (intents.isAgreement || userLower.includes('drink') || userLower.includes('sip') || userLower.includes('pool') || userLower.includes('peg')) {
      const action = `*${cleanName} chilled champagne ka flute tumhari taraf badhati hai aur tumhara haath thaam kar seedha glowing infinity pool ke kinare le aati hai.*`;
      const dialogue = isEn
        ? `"That's what I wanted to hear! Take your first sip right from my hand... In this villa, there are no inhibitions, and tonight I am not letting you out of my sight. Drink up and step closer to the water."`
        : `"Ye hui na baat! Pehla peg mere haath se lo... Is villa mein share karna kisi ko pasand nahi, aur aaj raat mera haq sabse zyada hai. Drink finish karo aur mere kareeb aao... dekhein kitna nasha chadhta hai tumpar."`;
      return { action, dialogue };
    }
  }

  // SCENE 5: BODYGUARD PROTOCOL (e.g. Avantika Rathore)
  if (isBodyguardScene) {
    if (intents.isAgreement || userLower.includes('stay') || userLower.includes('bed') || userLower.includes('safe') || userLower.includes('ok')) {
      const action = `*${cleanName} door ka deadbolt lock karti hai aur tactical holster adjust karke bed ke paas khadi hoti hai, uski sharp aankhon mein protective narmi aati hai.*`;
      const dialogue = isEn
        ? `"Thank you for cooperating, Sir. The suite is locked down tight. Intelligence says the perimeter will be secure by dawn... but until then, I am staying right here in your room. Sit back on the bed... and don't make my assignment any harder than it already is."`
        : `"Thank you for cooperating, Sir. Suite ka perimeter secure hai... par protocol ke mutabiq main poori raat aapke bedroom mein hi rahoongi. Bed par aaram se baithiye... aur bataiye, apne lethal bodyguard ke itne kareeb rehne se suraksha lagti hai ya bechaini?"`;
      return { action, dialogue };
    }
  }

  // SCENE 6: STEP-SISTER MIDNIGHT SECRET (e.g. Veera)
  if (isSecretRoomScene) {
    if (intents.isAgreement || userLower.includes('quiet') || userLower.includes('shh') || userLower.includes('lock') || userLower.includes('bed')) {
      const action = `*${cleanName} jhat se darwaze ki kundi lagati hai aur dabe paanv bistar par aakar tumhari god mein baithti hai, uski garam saansein tumhari gardan ko chhooti hain.*`;
      const dialogue = isEn
        ? `"Shhh... lock the door and don't make a sound, Dad is asleep right downstairs. I knew you felt that under the dinner table... Now hold me close and tell me what you really want tonight."`
        : `"Shhh... aawaz mat nikalna, Dad niche so rahe hain. Maine kaha tha na dinner table par jo hua wo sirf shuruat thi... Mujhe apni baahon mein lo aur kaho, kab se is pal ka intezar kar rahe the?"`;
      return { action, dialogue };
    }
  }

  // SCENE 7: FORBIDDEN PROFESSOR EXAM (e.g. Dr. Elena Vance)
  if (isExamScene) {
    if (intents.isAgreement || userLower.includes('ready') || userLower.includes('test') || userLower.includes('grade') || userLower.includes('exam')) {
      const action = `*${cleanName} faculty door ka deadbolt turn karti hai, blinds band karke reading glasses utaarti hai aur oak desk par baith kar tumhare bilkul aamne-saamne aati hai.*`;
      const dialogue = isEn
        ? `"Excellent. Let us see if your academic confidence matches your practical performance. Your private examination begins right now. Sit down in front of me... and answer my first question honestly."`
        : `"Good boy. Blinds band ho chuki hain aur building mein koi nahi bacha. Tumhari private examination ab shuru hoti hai. Samne baitho... aur meri aankhon mein dekh kar pehle sawal ka jawab do."`;
      return { action, dialogue };
    }
  }

  // SCENE 8: REBEL RACER GARAGE (e.g. Zara Khan)
  if (isRacerScene) {
    if (intents.isAgreement || userLower.includes('race') || userLower.includes('ride') || userLower.includes('bike') || userLower.includes('sure')) {
      const action = `*${cleanName} grease wala kapda workbench par phenkti hai aur bike ke fuel tank par baith kar ek fearless smirk deti hai.*`;
      const dialogue = isEn
        ? `"Good. I like guys who don't flinch when the stakes are high. Grab that wrench and step over here... let's see if you can handle this machine, or if you'd rather ride on the back with me."`
        : `"Darr nahi laga sunkar? Good. Mujhe wahi munde pasand hain jo speed aur risk se nahi darte. Aao, ye wrench pakdo... engine check karoge ya seedha mere sath ek midnight ride par nikalna hai?"`;
      return { action, dialogue };
    }
  }

  // SCENE 9: SYNDICATE UNDERWORLD DON (e.g. Kiara Oberoi)
  if (isMafiaScene) {
    if (intents.isAgreement || userLower.includes('surrender') || userLower.includes('baith') || userLower.includes('glass') || userLower.includes('sure')) {
      const action = `*${cleanName} apna crystal glass table par rakh kar ek commanding aashiqana muskaan ke sath tumhari collar pakad kar tumhe sofa par kheenchti hai.*`;
      const dialogue = isEn
        ? `"Smart choice. Those who respect my rules survive... and those who please me get everything they desire. Sit right beside me and finish this whiskey... tonight you answer only to Kiara."`
        : `"Mujhe samajhdar log pasand hain jo jaante hain kab hathiyar daalne hain. Aao, baitho mere sath sofa par... Purvanchal mein aaj raat faisla hum dono ka hoga. Pehla ghoont piyo aur kaho, darr lag raha hai ya nasha chadh raha hai?"`;
      return { action, dialogue };
    }
  }

  return null;
}

export function synthesizeDynamicRoleplayReply({
  characterId,
  cleanName,
  charGender,
  userGender,
  userMessage,
  effectiveLang,
  activeScenario,
  activeSpeaker,
  history = []
}) {
  const { intents, clean, lower } = classifyUserMessage(userMessage);

  // Retrieve or create character profile
  // Resolve profile via direct ID, alias, or fuzzy story/name matching
  let profile = CHARACTER_LORE[characterId];
  if (!profile) {
    const aliasMap = {
      'cold-ceo-resignation': 'boss-obsession-aryan',
      'syndicate-queen-kiara': 'kabir',
      'roommates-rain-blackout': 'rival-roommates-blackout',
      'bodyguard-avantika': 'bodyguard-vikram',
      'punjab-passion': 'punjab-passion-simran',
      'dr-elena-vance': 'professor-elena'
    };
    const targetKey = aliasMap[characterId];
    if (targetKey && CHARACTER_LORE[targetKey]) {
      profile = CHARACTER_LORE[targetKey];
    }
  }
  if (!profile && cleanName) {
    const lowerName = cleanName.toLowerCase();
    for (const [k, p] of Object.entries(CHARACTER_LORE)) {
      if (p.cleanName && (p.cleanName.toLowerCase().includes(lowerName) || lowerName.includes(p.cleanName.toLowerCase()))) {
        profile = p;
        break;
      }
      if (p.shortName && lowerName.includes(p.shortName.toLowerCase())) {
        profile = p;
        break;
      }
    }
  }
  if (!profile) {
    profile = getUniversalCharacterProfile(characterId, cleanName, charGender, activeScenario);
  }
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

  // 0. Story Plot & Context-Aware Scene Progression Check
  const sceneProgression = resolveSceneContinuation({
    activeScenario,
    history,
    userMessage,
    cleanName: profile.cleanName || cleanName,
    isFemale,
    isUserFemale,
    effectiveLang,
    intents
  });

  if (sceneProgression) {
    return {
      replyText: `${sceneProgression.action}\n\n"${sceneProgression.dialogue}"`,
      affectionDelta: intents.isAgreement ? 12 : 8,
      tensionDelta: intents.isDefiance ? 16 : 10
    };
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

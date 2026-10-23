const http = require('http');

const posters = [
  'assets/love_villa.jpg',
  'assets/poster_aryan_ceo.jpg',
  'assets/poster_kabir_mafia.jpg',
  'assets/poster_roommates.jpg',
  'assets/poster_stepbrother_veer.jpg',
  'assets/poster_bodyguard_vikram.jpg',
  'assets/poster_professor_elena.jpg',
  'assets/poster_badboy_zayd.jpg',
  'assets/poster_ex_aarav.jpg',
  'assets/poster_neighbor_priya.jpg',
  'assets/poster_thakur_veer.jpg',
  'assets/poster_feudal_murtaza.jpg',
  'assets/poster_rebound_samrat.jpg',
  'assets/poster_prince_lucian.jpg',
  'assets/poster_demon_nyx.jpg',
  'assets/poster_yandere_ayumi.jpg',
  'assets/poster_valeria.jpg',
  'assets/poster_gym_rohan.jpg',
  'assets/poster_flight_zoya.jpg',
  'assets/poster_doctor_sameer.jpg',
  'assets/poster_bestfriend_karan.jpg',
  'assets/poster_punjab_simran.jpg',
  'assets/poster_contract_bride.jpg',
  'assets/poster_goa_dj.jpg',
  'assets/poster_bodyguard_aditya.jpg',
  'assets/poster_prof_dev.jpg',
  'assets/poster_royal_veer.jpg',
  'assets/poster_mma_arjun.jpg',
  'assets/poster_french_camille.jpg',
  'assets/poster_mafia_zara.jpg',
  'assets/poster_lawyer_tara.jpg',
  'assets/poster_tattoo_zayn.jpg'
];

async function checkUrl(path) {
  return new Promise((resolve) => {
    http.get(`http://localhost:3000/${path}`, (res) => {
      resolve({ path, status: res.statusCode, contentType: res.headers['content-type'] });
    }).on('error', (err) => {
      resolve({ path, status: 'ERROR', error: err.message });
    });
  });
}

async function run() {
  console.log(`Checking ${posters.length} posters against http://localhost:3000...`);
  let allOk = true;
  for (const p of posters) {
    const res = await checkUrl(p);
    if (res.status === 200) {
      console.log(`[OK 200] ${p} (${res.contentType})`);
    } else {
      console.log(`[FAIL ${res.status}] ${p}`);
      allOk = false;
    }
  }
  console.log(allOk ? 'ALL POSTERS 200 OK LOCALLY!' : 'SOME POSTERS FAILED!');
}

run();

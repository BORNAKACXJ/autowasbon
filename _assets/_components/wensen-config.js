/**
 * Wensen (wishes) configuration for maak-bon.
 * Add or remove entries to change available wensen.
 * Each wens needs: key, name, thumbnail, lottie, alt
 */
const DEFAULT_LOTTIE_URL = 'https://lottie.host/f1d0e197-55d8-4b0c-8670-31287c95dd0e/pFkebShNjk.lottie';

/** Default placeholder for the message textarea (used for all wensen). */
export const DEFAULT_PLACEHOLDER = 'Voeg hier je extra bericht toe. Maximaal 160 tekens';

export const WENSEN = [
  {
    key: 'geslaagd',
    name: 'Gefeliciteerd!',
    thumbnail: '_assets/_style/_images/_wens/wens__geslaagd.png',
    lottie: 'https://lottie.host/25db1766-e40b-4c2a-a031-5f288f366453/Qsa9HGHhkp.lottie',
    alt: 'Gefeliciteerd!'
  },
  {
    key: 'sorry',
    name: 'Sorry…',
    thumbnail: '_assets/_style/_images/_wens/wens__sorry.png',
    lottie: 'https://lottie.host/4bdef942-5b1b-495f-a3ef-8c30bef05a01/i6JkafhDx0.lottie',
    alt: 'Sorry…'
  },
  {
    key: 'uitblinker',
    name: 'Uitblinker!',
    thumbnail: '_assets/_style/_images/_wens/wens__uitblinker.png',
    lottie: 'https://lottie.host/ad725e67-dae7-4a1f-86e8-176d0c4f72a9/LJzpyHIzLW.lottie',
    alt: 'Uitblinker!'
  },
  {
    key: 'nieuweauto',
    name: 'Nieuwe auto',
    thumbnail: '_assets/_style/_images/_wens/wens__nieuweauto.png',
    lottie: 'https://lottie.host/19546007-2df4-442d-96bb-1c8e3bc53876/EF32llbkD3.lottie',
    alt: 'Nieuwe auto'
  },
  {
    key: 'oldtimer',
    name: 'Jaartje erbij!',
    thumbnail: '_assets/_style/_images/_wens/wens__oldtimer.png',
    lottie: 'https://lottie.host/18f333e5-b4e6-4408-851a-8d7e8e3b7566/F6haZCg12O.lottie',
    alt: 'Jaartje erbij!'
  },
  {
    key: 'goedgekeurd',
    name: 'Goedgekeurd!',
    thumbnail: '_assets/_style/_images/_wens/wens__goedgekeurd.png',
    lottie: 'https://lottie.host/e3df0572-4470-4c99-a729-6624c405acfb/zqUokHBn7l.lottie',
    alt: 'Goedgekeurd!'
  },
  {
    key: 'dankjewel',
    name: 'Dankjewel!',
    thumbnail: '_assets/_style/_images/_wens/wens__dankjewel.png',
    lottie: 'https://lottie.host/764aa63b-3ad7-4d4f-993a-a353f49cce59/JXR5ASWTj9.lottie',
    alt: 'Dankjewel!'
  },
  {
    key: 'spetter',
    name: 'Jij spetter!',
    thumbnail: '_assets/_style/_images/_wens/wens__spetter.png',
    lottie: 'https://lottie.host/79aa8226-2d95-41f0-90a2-893956c40aae/MUEHsC5f2A.lottie',
    alt: 'Jij spetter!'
  },
  {
    key: 'glashelder',
    name: 'Glashelder',
    thumbnail: '_assets/_style/_images/_wens/wens__glashelder.png',
    lottie: 'https://lottie.host/fbe9ffbe-32d0-45a1-ac57-4a06f610b77f/O7utC3Ec88.lottie',
    alt: 'Glashelder'
  },
  {
    key: 'zomaar',
    name: 'Zomaar',
    thumbnail: '_assets/_style/_images/_wens/wens__zomaar.png',
    lottie: 'https://lottie.host/df0aeca9-657f-4d6b-9bc5-49a510f9b1f3/zrNhtJpeIq.lottie',
    alt: 'Zomaar'
  }
];

/** Options for applyLottieTexture on user__wens (shared with uv-mapping-config) */
export const USER_WENS_LOTTIE_OPTIONS = {
  stationId: 'message__wens',
  visible: false,
  depthWrite: false,
  useBasicMaterial: true,
  flipV: true,
  flipTexture: true,
  startZ: -45,
  pauseZ: 50,
  resumeZ: -62,
  times: null
};

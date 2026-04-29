
export const ACTIVE_SOAP_THEME = 'Power Sop';

// ─────────────────────────────────────────────
// 2. TIMELINE — camera animation timing (seconds/ms)
// ─────────────────────────────────────────────
export const TIMELINE = {
  /** How long after pressing Start before the camera starts moving (ms). */
  startDelayMs: 800,

  /** Whether the small camera wiggle plays after Start. */
  startWiggleEnabled: true,

  /** How long after Start the wiggle fires (ms). Must be ≤ startDelayMs or it fires during movement. */
  startWiggleDelayMs: 600,

  /** Duration of the wiggle animation (ms). */
  startWiggleDurationMs: 320,
};


export const SOAP_THEME_SETTINGS = {
  autowasbon: { bgColor: '#1572fe', playlist: 'spotify:playlist:4fK7dk9zvgx2hwstJlTHLQ' },
  party:      { bgColor: '#fcde20', playlist: 'spotify:playlist:5rX97ygiHTX0ZkvVj8K2un' },
  love:       { bgColor: '#ff4160', playlist: 'spotify:playlist:6AVt7jCICxKdH4vkR00Crb' },
  pop:        { bgColor: '#eb63f2', playlist: 'spotify:playlist:5QjiogWeTYue1K58MvXr2x' },
  power:      { bgColor: '#15e891', playlist: 'spotify:playlist:6vyLIRVmFTnwYNDHYyFJN5' },
  feelgood:   { bgColor: '#ffac26', playlist: 'spotify:playlist:6DEYFsUWAyuECgkiWtgPqM' },
  calm:       { bgColor: '#89b7f9', playlist: 'spotify:playlist:6JPVvIRLLmsPINLcMdtAs3' },
};


export const SPOTIFY = {
  tokenUrl: '/api/spotify-token',
  trackUrl:  '/api/spotify-track',
  defaultPlaylist: 'spotify:playlist:6vyLIRVmFTnwYNDHYyFJN5',
  /** On mobile, start with sound muted (avoids autoplay block). User can unmute manually. */
  startMutedOnMobile: true,
};


export const DEFAULTS = {
  name:    'NIELS',
  message: 'Het schoonste cadeau van Nederland!',
};



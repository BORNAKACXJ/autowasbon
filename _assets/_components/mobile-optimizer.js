/* ===== MOBILE OPTIMIZER ===== */
import * as THREE from 'three';

/**
 * Mobile optimizer for Three.js applications.
 *
 * Strategy: cap pixel ratio and lower GPU power preference on mobile,
 * but NEVER touch texture sizes, geometry, or station loading — those
 * caused the "only one station visible" bug in the previous version.
 *
 * Safe optimizations (won't break the 3D scene):
 *  - Pixel ratio capped at 1.5 on mobile (saves ~50% GPU fill on 3× screens)
 *  - powerPreference: 'low-power' on mobile (reduces heat / throttling)
 *  - precision: 'mediump' on low-end mobile (faster shader math)
 *  - antialias disabled on low-end mobile (big GPU saving)
 *  - Lottie FPS capped at 30 on mobile
 *
 * NOT changed (these broke the scene previously):
 *  - maxTextureSize — keep at 4096
 *  - textureQuality — keep at 1.0
 *  - geometry/stations — untouched
 *  - shadows — remain disabled (not used in this project)
 */
export class MobileOptimizer {
  constructor() {
    this.isMobile = this._detectMobile();
    this.isLowEnd = false;

    this.shadowMapTypes = {
      basic: THREE.BasicShadowMap,
      pcf: THREE.PCFSoftShadowMap
    };

    // Start with safe defaults, then refine for mobile
    this.optimizations = {
      pixelRatio:    window.devicePixelRatio,
      antialias:     true,
      shadowMapSize: 2048,
      shadowMapType: THREE.PCFSoftShadowMap,
      textureQuality: 1.0,   // ← never reduce; breaks UV textures
      lottieFPS:     60,
      enableShadows: false,
      maxTextureSize: 4096   // ← never reduce; breaks 3D station textures
    };

    this._detectLowEnd();

    if (this.isMobile) {
      // Cap pixel ratio — biggest single mobile win (no visual change at normal viewing distance)
      this.optimizations.pixelRatio = Math.min(window.devicePixelRatio, 1.5);
      // Lottie at 30 FPS is imperceptible on mobile
      this.optimizations.lottieFPS = 30;

      if (this.isLowEnd) {
        // Extra savings for low-end phones: disable antialias (biggest GPU save)
        this.optimizations.antialias = false;
      }
    }
  }

  _detectMobile() {
    const ua = navigator.userAgent || navigator.vendor || window.opera;
    const mobileUA = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(ua);
    const touchSmall = ('ontouchstart' in window || navigator.maxTouchPoints > 0) && window.innerWidth <= 768;
    return mobileUA || touchSmall;
  }

  _detectLowEnd() {
    const cores  = navigator.hardwareConcurrency || 4;
    const memory = navigator.deviceMemory || 4;      // GB, Safari returns undefined → 4
    if (this.isMobile && (cores < 4 || memory < 4)) {
      this.isLowEnd = true;
    }
    if (window.innerWidth < 375) {
      this.isLowEnd = true; // very small screen = old device
    }
  }

  /** Apply pixel ratio and shadow settings to a THREE.WebGLRenderer. */
  optimizeRenderer(renderer) {
    if (!renderer) return;
    renderer.setPixelRatio(this.optimizations.pixelRatio);

    if (renderer.shadowMap) {
      renderer.shadowMap.enabled = false; // shadows not used in this project
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    }
  }

  /**
   * Options for THREE.WebGLRenderer constructor.
   * Mobile uses low-power GPU profile and mediump precision on low-end.
   */
  getRendererOptions() {
    if (this.isMobile) {
      return {
        antialias:       !this.isLowEnd,  // off on budget phones → big GPU saving
        alpha:           true,
        powerPreference: 'low-power',     // prevents thermal throttling on phones
        precision:       this.isLowEnd ? 'mediump' : 'highp'
      };
    }
    return {
      antialias:       true,
      alpha:           true,
      powerPreference: 'high-performance',
      precision:       'highp'
    };
  }

  /** Pass textures through unchanged — reducing size breaks UV-mapped station textures. */
  optimizeTexture(texture) {
    return texture;
  }

  /** Pass geometry through unchanged — reducing complexity broke station visibility. */
  optimizeGeometry(geometry) {
    return geometry;
  }

  /** Throttled animation loop helper. On mobile caps at 30 FPS. */
  createThrottledUpdate(callback, targetFPS = null) {
    const fps = targetFPS ?? this.optimizations.lottieFPS;
    const interval = 1000 / fps;
    let lastTime = 0;
    return (currentTime) => {
      if (currentTime - lastTime >= interval) {
        callback();
        lastTime = currentTime;
      }
    };
  }

  getShadowMapSize()  { return this.optimizations.shadowMapSize; }
  getPixelRatio()     { return this.optimizations.pixelRatio; }
  getLottieFPS()      { return this.optimizations.lottieFPS; }
  getTextureQuality() { return this.optimizations.textureQuality; }
  getIsMobile()       { return this.isMobile; }
  getIsLowEnd()       { return this.isLowEnd; }
  getOptimizations()  { return { ...this.optimizations }; }
}

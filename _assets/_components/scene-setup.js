/* ===== SCENE SETUP ===== */
import * as THREE from 'three';
import { MobileOptimizer } from './mobile-optimizer.js';

export class SceneSetup {
  constructor(canvasElement) {
    this.canvas = canvasElement;
    this.renderer = null;
    this.scene = null;
    this.camera = null;
    this.card = null;
    this.mobileOptimizer = null;
    this.lights = {
      ambient: null,
      directional1: null,
      directional2: null,
      directional3: null
    };
    
    this.init();
  }
  
  init() {
    this.card = document.querySelector('.card');
    
    // Initialize mobile optimizer
    this.mobileOptimizer = new MobileOptimizer();
    
    // Get optimized renderer options
    const rendererOptions = this.mobileOptimizer.getRendererOptions();
    
    // Create renderer with mobile optimizations
    this.renderer = new THREE.WebGLRenderer({ 
      canvas: this.canvas, 
      antialias: rendererOptions.antialias, 
      alpha: rendererOptions.alpha,
      powerPreference: rendererOptions.powerPreference,
      precision: rendererOptions.precision
    });
    
    // Apply mobile optimizations to renderer
    this.mobileOptimizer.optimizeRenderer(this.renderer);
    
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.2;
    this.renderer.outputEncoding = THREE.sRGBEncoding;
    
    // Shadows always disabled - not used in this project
    this.renderer.shadowMap.enabled = false;
    
    // Create scene
    this.scene = new THREE.Scene();
    this.scene.background = null;
    
    // Add lighting
    this.setupLighting();
    
    // Create camera
    this.setupCamera();
    
    // Setup resize handler
    this.setupResize();
  }
  
  setupLighting() {
    // Single ambient light — shadows are disabled in this project so directional
    // lights don't add anything. Intensity 0.5 was chosen during visual tuning.
    // To add directional lights in future: create THREE.DirectionalLight and add to scene.
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    this.scene.add(ambientLight);
    this.lights.ambient = ambientLight;
  }
  
  getLights() {
    return this.lights;
  }
  
  setupCamera() {
    this.camera = new THREE.PerspectiveCamera(
      90,
      this.card.clientWidth / this.card.clientHeight,
      0.1,
      2000
    );
    
    // Camera starting positions (keeping original settings)
    this.introStartZ = this.mobileOptimizer && this.mobileOptimizer.getIsMobile() ? -10 : -28;
    // Set normalStartZ to 20 for mobile, 0 for desktop
    this.normalStartZ = this.mobileOptimizer && this.mobileOptimizer.getIsMobile() ? -10 : -28;
    this.startY = 8;
    this.endY = 8;
    this.defaultCameraRotationX = 0;
    
    this.camera.position.set(0, this.startY, this.introStartZ);
  }
  
  setupResize() {
    window.addEventListener('resize', () => this.resize());
    this.resize();
  }
  
  resize() {
    if (!this.card || !this.renderer || !this.camera) return;
    
    const w = this.card.clientWidth;
    const h = this.card.clientHeight;
    this.renderer.setSize(w, h);
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
  }
  
  render() {
    this.renderer.render(this.scene, this.camera);
  }
  
  getScene() {
    return this.scene;
  }
  
  getCamera() {
    return this.camera;
  }
  
  getRenderer() {
    return this.renderer;
  }
  
  getMobileOptimizer() {
    return this.mobileOptimizer;
  }
}

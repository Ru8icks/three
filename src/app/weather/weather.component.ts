
import { Component, OnInit, AfterViewInit, Input, ViewChild, ElementRef, HostListener } from '@angular/core';
import * as THREE from "three";
import * as POSTPROCESSING from "postprocessing"
import { GLTFLoader, GLTF } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { CSS2DRenderer } from 'three/examples/jsm/renderers/CSS2DRenderer.js';

@Component({
  selector: 'app-weather',
  templateUrl: './weather.component.html',
  styleUrls: ['./weather.component.scss']
})
export class WeatherComponent implements OnInit, AfterViewInit {

  @Input() public fieldOfView: number = 60;

  @Input('nearClipping') public nearClippingPane: number = 1;

  @Input('farClipping') public farClippingPane: number = 1000;

  // Scene properties

  @ViewChild('myCanvas', { static: true, read: ElementRef }) private canvas!: ElementRef<HTMLCanvasElement>;
  private renderer!: THREE.WebGLRenderer;


  private camera: THREE.PerspectiveCamera = new THREE.PerspectiveCamera(
    this.fieldOfView,
    window.innerWidth / window.innerHeight,
    this.nearClippingPane,
    this.farClippingPane
  )

  private controls!: OrbitControls;
  private composer!: POSTPROCESSING.EffectComposer;

  private ambientLight: THREE.AmbientLight = new THREE.AmbientLight(0x00000, 100);
  private particleMesh!: THREE.Points<THREE.BufferGeometry<THREE.NormalBufferAttributes>, THREE.PointsMaterial>;
  private rainMesh!: THREE.Points<THREE.BufferGeometry<THREE.NormalBufferAttributes>, THREE.PointsMaterial>;


  private light1: THREE.PointLight = new THREE.PointLight(0x4b371c, 10);

  private light2: THREE.PointLight = new THREE.PointLight(0x4b371c, 10);

  private light3: THREE.PointLight = new THREE.PointLight(0x4b371c, 10);

  private light4: THREE.PointLight = new THREE.PointLight(0x4b371c, 10);

  private model: any;

  private directionalLight: THREE.DirectionalLight = new THREE.DirectionalLight(0xffdf04, 0.4);

  // Helper Properties (Private Properties);

  private loaderGLTF = new GLTFLoader();


  private scene: THREE.Scene = new THREE.Scene();
  private loader = new THREE.TextureLoader();
  private cloudParticles: THREE.Mesh<THREE.PlaneGeometry, THREE.MeshLambertMaterial>[] = []

  private mouseX = 0;
  private mouseY = 0;
  private mouseMove!: MouseEvent;


  @HostListener('document:mousemove', ['$event'])
  animateParticles(ev: MouseEvent) {
    this.mouseX = ev.clientX;
    this.mouseY = ev.clientY;
    this.mouseMove = ev

    console.log(`The user just pressed ${ev}!`);
  }

  private createControls = () => {
    const renderer = new CSS2DRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.domElement.style.position = 'absolute';
    renderer.domElement.style.top = '0px';
    document.body.appendChild(renderer.domElement);
    this.controls = new OrbitControls(this.camera, renderer.domElement);
    this.controls.autoRotate = true;
    this.controls.enableZoom = true;
    this.controls.enablePan = false;

    this.controls.update();
  };

  private createClouds() {

    this.loader.load("https://raw.githubusercontent.com/navin-navi/codepen-assets/master/images/smoke.png", (texture) => {
      const cloudGeo = new THREE.PlaneGeometry(500, 500);
      const cloudMaterial = new THREE.MeshLambertMaterial({
        map: texture,
        transparent: true
      });

      for (let p = 0; p < 50; p++) {
        let cloud = new THREE.Mesh(cloudGeo, cloudMaterial);
        cloud.position.set(
          Math.random() * 80 - 40,
          10,
          Math.random() * 50 - 50
        );
        cloud.rotation.x = 1.16;
        cloud.rotation.y = -0.12;
        cloud.rotation.z = Math.random() * 2 * Math.PI;
        cloud.material.opacity = 0.55;
        this.cloudParticles.push(cloud);
        this.scene.add(cloud);

      }
    });

  }
  private animatecloud() {
    if (this.model) {
      this.model.rotation.y += 0.005;
      this.model.material.displacementScale  = this.mouseY * (this.clock.getElapsedTime() * 0.00008);
    }
  }
  private clock = new THREE.Clock();

  private animateStars() {
    if (this.particleMesh) {
      this.particleMesh.rotation.z = -1* (this.clock.getElapsedTime() * 0.5);
      if(this.mouseX>0){

        this.particleMesh.rotation.x = this.mouseY * (this.clock.getElapsedTime() * 0.00008)
      }

    }
  }
  private animateRain() {
    if (this.rainMesh) {
      this.rainMesh.rotation.x = (this.clock.getElapsedTime());
      console.log(this.mouseMove)
        if(this.mouseMove ){

          this.rainMesh.position.x += (this.mouseMove.movementX*0.02) 
          this.rainMesh.position.y += (this.mouseMove.movementX*-0.02) 
        }
    

    }
  }

  
  private createScene() {
    //* Scene
    //this.scene.background = new THREE.Color(0x7ED4D9)

    //this.scene.fog = new THREE.FogExp2(0x7ED4D9, 0.01);
    this.renderer.setClearColor(new THREE.Color('#21282a'), 1);
    const material = new THREE.MeshStandardMaterial({
      color:'hotpink',
      map: this.loader.load('assets/texture.jpg'),
      displacementMap:this.loader.load('assets/texture.jpg'),
      alphaMap:this.loader.load('assets/texture.jpg'),
      

    })
    this.loaderGLTF.load('assets/cloud.gltf', (gltf: GLTF) => {
      
      this.model = gltf.scene.children[0];
      console.log(this.model);
      var box = new THREE.Box3().setFromObject(this.model);
      box.getCenter(this.model.position); // this re-sets the mesh position
      this.model.position.multiplyScalar(-1);
      this.model.material = material;
      this.scene.add(this.model);
    });


    this.createClouds();
    this.createStars();
    this.createRain();


    this.camera.position.z = 10;
    this.camera.position.y = 10;
    this.camera.position.x = 10;



    let orangeLight = new THREE.PointLight(0xcc6600, 50, 450, 1.7);
    orangeLight.position.set(200, 30, 100);
    this.scene.add(orangeLight);

    let redLight = new THREE.PointLight(0xd8547e, 50, 450, 1.7);
    redLight.position.set(100, 30, 100);
    this.scene.add(redLight);

    let blueLight = new THREE.PointLight(0x3677ac, 50, 450, 1.7);
    blueLight.position.set(300, 30, 200);
    this.scene.add(blueLight);

  }
  createStars() {
    const star = this.loader.load('assets/star.png')
    const particlesGeo = new THREE.BufferGeometry;
    const particleCount = 5000;
    const posArray = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i++) {
      posArray[i] = (Math.random() - 0.5) * 100;
    }
    particlesGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3))
    const material = new THREE.PointsMaterial({
      map: star,
      size: 0.5,
      transparent: true,


    })
    this.particleMesh = new THREE.Points(particlesGeo, material)
    this.scene.add(this.particleMesh);

  }
  createRain() {
    const star = this.loader.load('assets/rain.png')
    const particlesGeo = new THREE.BufferGeometry;
    const particleCount = 500;
    const posArray = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i++) {
      posArray[i] = (Math.random() - 0.5) * 6;
    }
    particlesGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3))
    const material = new THREE.PointsMaterial({
      map: star,
      size: 0.5,
      transparent: true,


    })
    this.rainMesh = new THREE.Points(particlesGeo, material)
    this.scene.add(this.rainMesh);

  }


  private startRenderingLoop() {

    this.renderer.setPixelRatio(devicePixelRatio);
    this.renderer.setSize(this.canvas.nativeElement.clientWidth, this.canvas.nativeElement.clientHeight);
    let component: WeatherComponent = this;
    (function render() {
      component.renderer.render(component.scene, component.camera);
      component.animatecloud();
      component.animateStars();
      component.animateRain();

      requestAnimationFrame(render);
    }());
  }

  constructor() { }

  ngOnInit(): void {
    this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas.nativeElement, antialias: true });
  }

  ngAfterViewInit() {
    this.createScene();
    this.startRenderingLoop();
    this.createControls();

  }


}

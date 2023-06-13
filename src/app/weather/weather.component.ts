
import { Component, OnInit, AfterViewInit, Input, ViewChild, ElementRef } from '@angular/core';
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

  @ViewChild('myCanvas', {static: true, read: ElementRef}) private canvas!: ElementRef<HTMLCanvasElement>;
  private renderer!: THREE.WebGLRenderer;


  private camera: THREE.PerspectiveCamera = new THREE.PerspectiveCamera(
    this.fieldOfView,
    window.innerWidth/ window.innerHeight,
    this.nearClippingPane,
    this.farClippingPane
  )

  private controls!: OrbitControls;
  private composer!: POSTPROCESSING.EffectComposer;

  private ambientLight: THREE.AmbientLight  = new THREE.AmbientLight(0x00000, 100);;

  private light1: THREE.PointLight = new THREE.PointLight(0x4b371c, 10);

  private light2: THREE.PointLight  = new THREE.PointLight(0x4b371c, 10);

  private light3: THREE.PointLight  = new THREE.PointLight(0x4b371c, 10);

  private light4: THREE.PointLight = new THREE.PointLight(0x4b371c, 10);

  private model: any;

  private directionalLight: THREE.DirectionalLight = new THREE.DirectionalLight(0xffdf04, 0.4);

  // Helper Properties (Private Properties);

  private loaderGLTF = new GLTFLoader();
  

  private scene: THREE.Scene = new THREE.Scene();
  private loader = new THREE.TextureLoader();
  private cloudParticles:  THREE.Mesh<THREE.PlaneGeometry, THREE.MeshLambertMaterial>[] = []
  

 
  private animateModel() {
    if (this.model) {
      this.model.rotation.y += 0.005;
    }
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

  private createScene() {
    //* Scene
    //this.scene.background = new THREE.Color(0x7ED4D9)
    
    this.scene.fog = new THREE.FogExp2(0x7ED4D9, 0.01);
    this.renderer.setClearColor(this.scene.fog.color);
    this.loaderGLTF.load('assets/cloud.gltf', (gltf: GLTF) => {
      this.model = gltf.scene.children[0];
      console.log(this.model);
      var box = new THREE.Box3().setFromObject(this.model);
      box.getCenter(this.model.position); // this re-sets the mesh position
      this.model.position.multiplyScalar(-1);
      this.scene.add(this.model);
    });

    // Smoke Loaders

    this.loader.load("https://raw.githubusercontent.com/navin-navi/codepen-assets/master/images/smoke.png", (texture) =>{
      const cloudGeo = new THREE.PlaneGeometry(500,500);
      const cloudMaterial = new THREE.MeshLambertMaterial({
        map:texture,
        transparent: true
   });

  for(let p=0; p<50; p++) {
    let cloud = new THREE.Mesh(cloudGeo, cloudMaterial);
    cloud.position.set(
      Math.random()*80 -40,
      10,
      Math.random()*50-50
    );
    cloud.rotation.x = 1.16;
    cloud.rotation.y = -0.12;
    cloud.rotation.z = Math.random()*2*Math.PI;
    cloud.material.opacity = 0.55;
    this.cloudParticles.push(cloud);
    this.scene.add(cloud);
   
  }
});

   
   
  


   
   
    this.camera.position.z = 10;
    this.camera.position.y = 10;
    this.camera.position.x = 10;
    
    

    let orangeLight = new THREE.PointLight(0xcc6600,50,450,1.7);
    orangeLight.position.set(200,30,100);
    this.scene.add(orangeLight);
    
    let redLight = new THREE.PointLight(0xd8547e,50,450,1.7);
    redLight.position.set(100,30,100);
    this.scene.add(redLight);
    
    let blueLight = new THREE.PointLight(0x3677ac,50,450,1.7);
    blueLight.position.set(300,30,200);
    this.scene.add(blueLight);
    
  }

  private startRenderingLoop() {
    
    this.renderer.setPixelRatio(devicePixelRatio);
    this.renderer.setSize(this.canvas.nativeElement.clientWidth, this.canvas.nativeElement.clientHeight);
    let component: WeatherComponent = this;
    (function render() {
      component.renderer.render(component.scene, component.camera);
      component.animateModel();
      requestAnimationFrame(render);
    }());
  }

  constructor() { }

  ngOnInit(): void {
   this.renderer= new THREE.WebGLRenderer({ canvas: this.canvas.nativeElement, antialias: true });
  }

  ngAfterViewInit() {
    this.createScene();
    this.startRenderingLoop();
    this.createControls();
    
  }


}

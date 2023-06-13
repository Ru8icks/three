import { Component, OnInit, AfterViewInit, Input, ViewChild, ElementRef } from '@angular/core';
import * as THREE from "three";
import { GLTFLoader, GLTF } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { CSS2DRenderer } from 'three/examples/jsm/renderers/CSS2DRenderer.js';

@Component({
  selector: 'app-import',
  templateUrl: './import.component.html',
  styleUrls: ['./import.component.scss']
})
export class ImportComponent {

  @Input() public fieldOfView: number = 10;

  @Input('nearClipping') public nearClippingPane: number = 1;

  @Input('farClipping') public farClippingPane: number = 1000;

  //? Scene properties

  @ViewChild('myCanvas', {static: true, read: ElementRef}) private canvas!: ElementRef<HTMLCanvasElement>;
  private renderer!: THREE.WebGLRenderer;

  //private renderer: THREE.WebGLRenderer =  new THREE.WebGLRenderer();
  //private canvas = this.renderer.domElement;
  private camera: THREE.PerspectiveCamera = new THREE.PerspectiveCamera(
    this.fieldOfView,
    window.innerWidth/ window.innerHeight,
    this.nearClippingPane,
    this.farClippingPane
  )

  private controls!: OrbitControls;

  private ambientLight: THREE.AmbientLight  = new THREE.AmbientLight(0x00000, 100);;

  private light1: THREE.PointLight = new THREE.PointLight(0x4b371c, 10);

  private light2: THREE.PointLight  = new THREE.PointLight(0x4b371c, 10);

  private light3: THREE.PointLight  = new THREE.PointLight(0x4b371c, 10);

  private light4: THREE.PointLight = new THREE.PointLight(0x4b371c, 10);

  private model: any;

  private directionalLight: THREE.DirectionalLight = new THREE.DirectionalLight(0xffdf04, 0.4);

  //? Helper Properties (Private Properties);

  private loaderGLTF = new GLTFLoader();
  

  private scene: THREE.Scene = new THREE.Scene();

 
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
    this.scene.background = new THREE.Color(0xd4d4d8)
    this.loaderGLTF.load('assets/bomb.gltf', (gltf: GLTF) => {
      this.model = gltf.scene.children[0];
      console.log(this.model);
      var box = new THREE.Box3().setFromObject(this.model);
      box.getCenter(this.model.position); // this re-sets the mesh position
      this.model.position.multiplyScalar(-1);
      this.scene.add(this.model);
    });
   
    this.camera.position.x = 100;
    this.camera.position.y = 100;
    this.camera.position.z = 100;
    this.scene.add(this.ambientLight);
    this.directionalLight.position.set(0, 1, 0);
    this.directionalLight.castShadow = true;
    this.scene.add(this.directionalLight);
    this.light1.position.set(0, 200, 400);
    this.scene.add(this.light1);
    this.light2.position.set(500, 100, 0);
    this.scene.add(this.light2);
    this.light3.position.set(0, 100, -500);
    this.scene.add(this.light3);
    this.light4.position.set(-500, 300, 500);
    this.scene.add(this.light4);
  }

  private startRenderingLoop() {
    
    this.renderer.setPixelRatio(devicePixelRatio);
    this.renderer.setSize(this.canvas.nativeElement.clientWidth, this.canvas.nativeElement.clientHeight);
    let component: ImportComponent = this;
    (function render() {
      component.renderer.render(component.scene, component.camera);
      component.animateModel();
      requestAnimationFrame(render);
    }());
  }

  constructor() { }

  ngOnInit(): void {
   this.renderer= new THREE.WebGLRenderer({ canvas: this.canvas.nativeElement, antialias: true });
  // this.controls= new OrbitControls(this.camera, this.canvas.nativeElement);
  }

  ngAfterViewInit() {
    this.createScene();
   
    this.startRenderingLoop();
    this.createControls();
    
  }


}

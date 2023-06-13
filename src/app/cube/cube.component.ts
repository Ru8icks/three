import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import * as THREE from "three";

@Component({
  selector: 'app-cube',
  templateUrl: './cube.component.html',
  styleUrls: ['./cube.component.scss']
})
export class CubeComponent implements OnInit {
  @Input() public rotationSpeedX: number = 0.05;

  @Input() public rotationSpeedY: number = 0.01;

  @Input() public size: number = 200;



  //* Stage Properties

  @Input() public cameraZ: number = 400;

  @Input() public fieldOfView: number = 1;

  @Input('nearClipping') public nearClippingPlane: number = 1;

  @Input('farClipping') public farClippingPlane: number = 1000;

  //? Helper Properties (Private Properties);

  private camera: THREE.PerspectiveCamera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  
  private geometry = new THREE.BoxGeometry(1, 1, 1);
  private material = new THREE.MeshBasicMaterial({ color: 0xddff00 });
 
  private cube: THREE.Mesh = new THREE.Mesh(this.geometry, this.material);

  private renderer: THREE.WebGLRenderer =  new THREE.WebGLRenderer();

  private scene: THREE.Scene = new THREE.Scene();
  private canvas = this.renderer.domElement;

  constructor() { }

  private animateCube() {
    this.cube.rotation.x += this.rotationSpeedX;
    this.cube.rotation.y += this.rotationSpeedY;
  }

  

  private animationLoop() {
    this.renderer.setPixelRatio(devicePixelRatio);
    this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight);
    
    let component: CubeComponent = this;
    (function render() {
      requestAnimationFrame(render);
      component.animateCube();
      component.renderer.render(component.scene, component.camera);
    }());
  
  };


  ngOnInit() {
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    const test = document.body.appendChild(this.canvas);
    console.log(test);
    

    this.scene.add(this.cube);
   
    this.camera.position.z = 5;
    this.renderer.render(this.scene,this.camera);
    this.animationLoop();
  }

}

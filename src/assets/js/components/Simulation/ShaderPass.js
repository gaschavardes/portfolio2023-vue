import store from '../../store'
import * as THREE from "three";


export default class ShaderPass{
    constructor(props){
        this.props = props;
        this.uniforms = this.props.material?.uniforms;
    }

    init(){
        this.scene = new THREE.Scene();
        this.camera = new THREE.Camera();

        if(this.uniforms){
            this.material = new THREE.RawShaderMaterial(this.props.material);
            this.geometry = new THREE.PlaneGeometry(2.0, 2.0);
            this.plane = new THREE.Mesh(this.geometry, this.material);
            this.scene.add(this.plane);
        }

    }

    update(){
        store.WebGL.renderer.setRenderTarget(this.props.output);
        store.WebGL.renderer.render(this.scene, this.camera);
        store.WebGL.renderer.setRenderTarget(null);
    }
}
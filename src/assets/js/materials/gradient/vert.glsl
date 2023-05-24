#include <defaultVert>
uniform vec2 px;
uniform vec2 boundarySpace;
varying vec2 vUv;
precision highp float;

void main(){
    vec3 pos = position;
    vec2 scale = 1.0 - boundarySpace * 2.0;
    pos.xy = pos.xy * scale;
    vUv = vec2(0.5)+(pos.xy)*0.5;
    gl_Position = vec4(pos, 1.0);
	// gl_Position = projectionMatrix * modelViewMatrix * vec4( pos, 1.0 );
}


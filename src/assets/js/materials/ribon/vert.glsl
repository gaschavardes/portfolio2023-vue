#include <defaultVert>
varying vec3 vNormal;
varying vec2 vUv;
void main()	{
	vUv = uv;
	// objectNormal = vec3(0.);
	vNormal = normal;
    #include <normalsVert>
    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}
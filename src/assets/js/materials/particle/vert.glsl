#include <defaultVert>

varying vec3 vNormal;
varying vec3 vColor;
attribute vec3 colorVal;
attribute mat4 instanceMatrix;
uniform vec2 uResolution;


void main()	{
    #include <normalsVert>

	vColor = colorVal;

		  // Vertex in clip-space
    vec4 fake_frag_coord  = (modelViewMatrix * instanceMatrix * vec4( position, 1.0 ));     // Range:   [-w,w]^4

    // Vertex in NDC-space
    fake_frag_coord.xyz /= fake_frag_coord.w;       // Rescale: [-1,1]^3
    fake_frag_coord.w    = 1.0 / fake_frag_coord.w; // Invert W

    // Vertex in window-space
    fake_frag_coord.xyz *= vec3 (0.5) + vec3 (0.5); // Rescale: [0,1]^3
    fake_frag_coord.xy  *= uResolution;

	vec3 newPos = position;

	vec4 worldPosition = vec4(position, 1.);
	worldPosition = instanceMatrix * worldPosition;
	worldPosition = projectionMatrix * modelViewMatrix * instanceMatrix * vec4( newPos, 1.0 );

	float noiseFact = smoothstep(11., 10., worldPosition.y) * smoothstep(-11., -10., worldPosition.y);
	newPos.x += (1. - noiseFact) * 10.;

    gl_Position = projectionMatrix * modelViewMatrix * instanceMatrix * vec4( newPos, 1.0 );
}
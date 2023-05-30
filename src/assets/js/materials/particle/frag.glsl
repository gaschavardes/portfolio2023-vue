#include <defaultFrag>

uniform vec3 uColor;
uniform vec2 uResolution;
varying vec3 vNormal;
varying vec3 vColor;


void main() {
    vec2 screenUV = gl_FragCoord.xy / uResolution;
	float noiseFact = smoothstep(0.9, 0.8, screenUV.y) *  smoothstep(0.1, 0.2, screenUV.y);

	gl_FragColor = vec4(vec3(vColor), (1. - noiseFact));
}
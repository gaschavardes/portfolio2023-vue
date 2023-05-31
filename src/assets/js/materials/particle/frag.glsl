#include <defaultFrag>

uniform vec3 uColor;
uniform vec2 uResolution;
varying vec3 vNormal;
varying vec3 vColor;
varying float vProgress;


void main() {
    vec2 screenUV = gl_FragCoord.xy / uResolution;
	float noiseFact = smoothstep(0.9, 0.8, screenUV.y) *  smoothstep(0.1, 0.2, screenUV.y);

	float highlight = smoothstep(0.2, 0.05, vProgress) * smoothstep(0.0001, 0.01, vProgress);

	gl_FragColor = vec4(vec3(vColor) + highlight * vec3(1.), 1.);
}
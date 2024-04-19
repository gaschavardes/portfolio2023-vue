#include <defaultFrag>

uniform vec3 uColor;
varying vec3 vNormal;
varying vec2 vUv;
uniform sampler2D uMap;
uniform float uTime;
uniform float uAppear;
uniform float uSide;
#define DOT_SIZE 0.05
float dot_pattern(vec2 uv)
{
	vec2 f = mod(uv, DOT_SIZE);
    vec2 c = (uv - f) + DOT_SIZE/2.;
    return smoothstep(.45, .35, distance(uv, c)/DOT_SIZE);
}


void main() {
	vec4 texture = texture2D(uMap, vec2(vUv.x * 4. + uTime * 0.2 + uAppear * 4., vUv.y));
	texture.rgb *= uColor;

    gl_FragColor = vec4(min(texture.rgb - vNormal.x * 5., vec3(0.9)), 1.);

	float appearVal = smoothstep(uAppear, uAppear - 0.1, vUv.x);
	float appearValInv = smoothstep(1. - uAppear, 1. - (uAppear - 0.1), vUv.x);

	float dots = dot_pattern(vec2(vUv.x * 20., vUv.y));
	appearVal = mix(appearValInv, appearVal, uSide);

	gl_FragColor.a = mix(0., gl_FragColor.a, appearVal - sin(appearVal * 3.14) * dots);
	// gl_FragColor = vec4() * 0.8);
}
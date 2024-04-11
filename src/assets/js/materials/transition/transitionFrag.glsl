varying vec2 vUv;

uniform sampler2D uFromScene;
uniform sampler2D uToScene;
uniform float uProgress;
uniform float uTime;

#pragma glslify: snoise3 = require('glsl-noise/simplex/3d')
// #pragma glslify: blendSoftLight = require(../../../../glsl/includes/utils/blendSoftLight.glsl)

// float rand(vec2 n) { 
// 	return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);
// }

// float noise(vec2 p){
// 	vec2 ip = floor(p);
// 	vec2 u = fract(p);
// 	u = u*u*(3.0-2.0*u);
	
// 	float res = mix(
// 		mix(rand(ip),rand(ip+vec2(1.0,0.0)),u.x),
// 		mix(rand(ip+vec2(0.0,1.0)),rand(ip+vec2(1.0,1.0)),u.x),u.y);
// 	return res*res;
// }
float circleFunc(in vec2 _st, in float _radius){
    vec2 dist = _st-vec2(0.5);
	return 1.-smoothstep(_radius-(_radius * 0.3),
                         _radius+(_radius * 0.3),
                         dot(dist,dist)*4.0);
}

void main() {

    vec3 scene1 = texture2D(uFromScene, vUv).rgb;
    vec3 scene2 = texture2D(uToScene, vUv).rgb;

	float offx = vUv.x + sin(vUv.y + uTime * .1);
	float offy = vUv.y - uTime * 0.1 - cos(uTime * .01) * .01;

	float noise = snoise3(vec3(offx, offy, uTime * 0.1) * 4.) - 1.;
	float circle = circleFunc(vUv, max((.8 - uProgress), 0.) * 3.)* 3.;

	float swipe = smoothstep(uProgress * 1.2, uProgress * 1.2 - 0.2, vUv.y ) * 3.;

	float glowCircle = circleFunc(vUv, max((.8 - uProgress - 0.5), 0.) * 3.)* 3.;

	// float testCircle = circleFunc(vUv, max((.8 - 0.5), 0.) * 3.) * 3.;

    vec3 finalColor = mix(scene1, scene2, clamp(swipe + noise, 0., 1.));
	finalColor += sin(clamp(swipe * 1.2 + noise, 0., 1.) * 3.14 );
    gl_FragColor = vec4(finalColor, 1.0);
	// gl_FragColor = vec4(vec3(testCircle + noise), 1.);
	// gl_FragColor = vec4(vec3(sin(clamp(testCircle * 1.2 + noise, 0., 1.) * 3.14 ), testCircle + noise, 0.), 1.);
	// gl_FragColor = vec4(1., 0., 0., 1.0);
}
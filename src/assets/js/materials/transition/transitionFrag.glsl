varying vec2 vUv;

uniform sampler2D uFromScene;
uniform sampler2D uToScene;
uniform float uProgress;

// #pragma glslify: blendSoftLight = require(../../../../glsl/includes/utils/blendSoftLight.glsl)

void main() {

    vec3 scene1 = texture2D(uFromScene, vUv).rgb;
    vec3 scene2 = texture2D(uToScene, vUv).rgb;

    vec3 finalColor = mix(scene1, scene2, uProgress);

    gl_FragColor = vec4(finalColor, 1.0);
	// gl_FragColor = vec4(1., 0., 0., 1.0);
}
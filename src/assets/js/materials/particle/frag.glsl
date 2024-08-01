#include <defaultFrag>

uniform vec3 uColor;
uniform vec2 uResolution;
varying float vRotation;
varying float vRotationVal;
varying vec3 vNormal;
varying vec3 vColor;
varying float vProgress;
uniform sampler2D uTexture;
uniform sampler2D uTexture1;
varying vec2 vUV1;
varying vec2 vUV2;
uniform float uTime;
#define PI 3.14159265359


vec2 rotateUV(vec2 uv, float rotation)
{
    float mid = 0.5;
    return vec2(
        cos(rotation) * (uv.x - mid) + sin(rotation) * (uv.y - mid) + mid,
        cos(rotation) * (uv.y - mid) - sin(rotation) * (uv.x - mid) + mid
    );
}

void main() {
    vec2 screenUV = gl_FragCoord.xy / uResolution;
	float noiseFact = smoothstep(0.9, 0.8, screenUV.y) *  smoothstep(0.1, 0.2, screenUV.y);

	float highlight = smoothstep(0.1, 0.05, vProgress) * smoothstep(0.0001, 0.01, vProgress);

	// vec4 textureMain = texture2D(uTexture1, vUV1) * (step(0.5, vRotation)) + texture2D(uTexture, vUV1) * (1. - step(0.5, vRotation));

	vec2 uvMix = mix(vUV1, vec2( 1. - vUV1.x, vUV1.y), abs(sin(vRotationVal * 0.5)));

	vec4 textureMain = mix(texture2D(uTexture, uvMix), texture2D(uTexture1, uvMix), step(0.5, vRotation));
	// vec4 textureMain2 = texture2D(uTexture, vUV2);
	// vec4 textureMain = texture2D(uTexture, gl_FragCoord.xy);


	gl_FragColor = vec4(vec3(clamp(textureMain.rgb, vec3(0.), vec3(0.97))) + highlight * vec3(100.), 1.);
	gl_FragColor = vec4(vec3(clamp(textureMain.rgb, vec3(0.), vec3(0.97))), 1.) ;
	gl_FragColor = min(textureMain, vec4(0.97));
	gl_FragColor.a *= (1. - step(1., vUV1.y));
	// gl_FragColor = mix(vec4(1., 0., 0., 1.), vec4(0., 1., 0., 1.), abs(sin(vRotationVal * 0.5)));
	// gl_FragColor = vec4(1., 0., 0., 1.);
}
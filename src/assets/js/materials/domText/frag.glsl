#include <defaultFrag>

uniform vec3 uColor;
uniform vec2 uResolution;
uniform vec2 uTextureRatio;
uniform sampler2D uTexture;
varying vec3 vNormal;


void main() {
	vec2 screenUV = gl_FragCoord.xy / uResolution;


	vec2 ratioImg = vec2(
		min((uResolution.x / uResolution.y) / (uTextureRatio.x / uTextureRatio.y), 1.0),
		min((uResolution.y / uResolution.x) / (uTextureRatio.y / uTextureRatio.x), 1.0)
    );

	float ratioX = min((ratioImg.x / ratioImg.y), 1.);
	float ratioY = min((ratioImg.y / ratioImg.x), 1.);
	
 	vec2 newUv = vec2(
        screenUV.x  * ratioX - ratioX * 0.5 + 0.5,
        screenUV.y * ratioY - ratioY * 0.5 + 0.5
    );

	vec4 texture = texture2D(uTexture, screenUV);

    gl_FragColor = vec4(texture.rgb, texture.a * 0.8 * smoothstep(1., 0.9, screenUV.y));
	// gl_FragColor = vec4(screenUV, 0., 0.);
}
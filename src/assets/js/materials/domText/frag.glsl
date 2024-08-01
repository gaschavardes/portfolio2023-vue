#include <defaultFrag>

uniform vec3 uColor;
uniform vec2 uResolution;
varying vec3 vNormal;
varying vec3 vColor;
varying float vProgress;
uniform sampler2D uTexture;
varying vec2 vUV1;
varying vec2 vUV2;
varying vec2 vAUVID;
varying vec2 vUv;
uniform vec2 uSpriteSize;
uniform float uShadow;
varying float vHoverDisplace;

#define PI 3.1415926538

float EaseOutCirc(float x)
{
 return sqrt(1.0 - pow(x - 1.0, 2.0));
}


void main() {
    vec2 screenUV = gl_FragCoord.xy / uResolution;

	vec2 UV1Bis = (screenUV + vAUVID) / uSpriteSize;
	float noiseFact = smoothstep(0.9, 0.8, screenUV.y) *  smoothstep(0.1, 0.2, screenUV.y);

	float highlight = smoothstep(0.1, 0.05, vProgress) * smoothstep(0.001, 0.005, vProgress);

	vec4 textureMain = texture2D(uTexture, vUV1);


	vec4 textureBlack;
	for ( int i = 0; i < 16; i ++ ) {
		
		textureBlack += texture2D(uTexture, vUV1 + vec2(0.001 + float(i - 8) * 0.0002, 0.005 + float(i - 8) * 0.0002));

	}
	textureBlack /= float( 16 );
	// vec4 textureMain = texture2D(uTexture, UV1Bis);
	// vec4 textureMain = texture2D(uTexture, UV1Bis);
	// vec4 textureMain2 = texture2D(uTexture, vUV2);
	// vec4 textureMain = texture2D(uTexture, gl_FragCoord.xy);

	// gl_FragColor = vec4(vec3(.35) , 1.);

	// gl_FragColor.rgb = vec3(textureMain.b * 0.5) * (1. - vHoverDisplace) + vec3(0., 1., 0.) * (vHoverDisplace - textureMain.b) * vHoverDisplace ;
	gl_FragColor.rgb = vec3(textureMain.b * 0.5) + vec3(0., 1., 0.) * (vHoverDisplace - textureMain.b) * vHoverDisplace ;
	gl_FragColor.a = min(textureMain.b * 0.98 + textureBlack.b * 0.98 * smoothstep(.9, 1., vHoverDisplace) * uShadow, 0.5);

	// Test non additive
	gl_FragColor.rgb = vec3(textureMain.b * 1.) + vec3(0., 0., 0.) * (vHoverDisplace - textureMain.b) * vHoverDisplace ;
	gl_FragColor.a = min(textureMain.b * 0.98 + textureBlack.b * 0.98 * smoothstep(.9, 1., vHoverDisplace) * uShadow, .97);
}
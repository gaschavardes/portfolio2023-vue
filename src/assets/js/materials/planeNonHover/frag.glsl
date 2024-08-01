#include <defaultFrag>

uniform vec3 uColor;
varying vec3 vNormal;
uniform sampler2D uTexture; 
uniform vec2 uResolution;

void main() {

	vec2 uv = gl_FragCoord.xy/uResolution.xy;
    gl_FragColor = vec4(vNormal * uColor, 1.);
	gl_FragColor = vec4(1., 0., 0., 1.);

	vec4 textureMain = texture2D(uTexture, uv);

	vec4 textureBlack;
	for ( int i = 0; i < 16; i ++ ) {
		
		textureBlack += texture2D(uTexture, uv + vec2(0.001 + float(i - 8) * 0.0002, 0.005 + float(i - 8) * 0.0002));

	}
	textureBlack /= float( 16 );

	gl_FragColor.rgb =  vec3(min(textureMain.r, 0.99));
	gl_FragColor.a = textureBlack.r + textureMain.r;
}
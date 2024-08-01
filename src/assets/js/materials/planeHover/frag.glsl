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
	gl_FragColor.rgb =  min(vec3(1.), vec3(0.7));
	gl_FragColor.a = min(textureMain.g, 0.5);
}
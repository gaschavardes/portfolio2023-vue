#include <defaultFrag>

uniform vec3 uColor;
varying vec3 vNormal;
varying vec2 vUv;
uniform sampler2D envFbo;
uniform sampler2D uMap;
uniform vec2 resolution;

void main() {
	vec2 uv = gl_FragCoord.xy / resolution;
	vec4 texture = texture2D(uMap, vUv);
	vec4 envTexture = texture2D(envFbo, vUv);
    gl_FragColor = vec4(texture.r + envTexture.r, texture.g, texture.b, 1.);
	// gl_FragColor = envTexture;
}
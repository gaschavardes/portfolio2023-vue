#include <defaultFrag>
#include <dynamicBaseFragPars>
varying vec3 worldNormal;
uniform sampler2D tNormal;
varying vec2 vUv;
void main() {
	// vec4 normalColor = texture2D(normalMap, vUv * 0.15) * 0.5;
	vec3 tangent = normalize( vTangent );
	vec3 bitangent = normalize( vBitangent );
	mat3 vTBN = mat3( tangent, bitangent, worldNormal );
	vec3 mapN = texture2D( tNormal, vUv ).xyz * 2.0 - 1.0;
	vec3 normalVal = normalize( vTBN * mapN );
	gl_FragColor = vec4(normalVal, 1.0);
}
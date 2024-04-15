#include <dynamicBaseVertPars>

varying vec2 vUv;
uniform float uTime;

varying vec3 eyeVector;
varying vec3 worldNormal;
varying vec3 newWorldNormal;
varying vec3 worldPosition;
varying vec3 vReflect;

vec3 inverseTransformDirection( in vec3 dir, in mat4 matrix ) {
    return normalize( ( vec4( dir, 0.0 ) * matrix ).xyz );
}

void main()	{
    // #include <normalsVert>
    vec3 objectNormal = vec3(normal);
    vec3 transformedNormal = objectNormal;
	
	vec4 worldPosition = modelMatrix * vec4( position, 1.0);

	// #ifndef REFRACT
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		}
		else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 reflectNormal = inverseTransformDirection( normal, viewMatrix );
		vReflect = reflect( cameraToVertex, reflectNormal );
	// #endif

	eyeVector = normalize(worldPosition.xyz - cameraPosition);
	worldNormal = normalize( modelViewMatrix * vec4(objectNormal, 0.0)).xyz;

	vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
	vViewPosition = - mvPosition.xyz;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.);
}
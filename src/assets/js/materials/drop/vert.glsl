#include <dynamicBaseVertPars>

varying vec2 vUv;
uniform float uTime;

varying vec3 eyeVector;
varying vec3 worldNormal;
varying vec3 newWorldNormal;
varying vec3 worldPosition;
varying vec3 vReflect;

mat4 rotationMatrix(vec3 axis, float angle)
{
		axis = normalize(axis);
		float s = sin(angle);
		float c = cos(angle);
		float oc = 1.0 - c;

		return mat4(oc * axis.x * axis.x + c,           oc * axis.x * axis.y - axis.z * s,  oc * axis.z * axis.x + axis.y * s,  0.0,
														oc * axis.x * axis.y + axis.z * s,  oc * axis.y * axis.y + c,           oc * axis.y * axis.z - axis.x * s,  0.0,
														oc * axis.z * axis.x - axis.y * s,  oc * axis.y * axis.z + axis.x * s,  oc * axis.z * axis.z + c,           0.0,
														0.0,                                0.0,                                0.0,                                1.0);
}

vec3 inverseTransformDirection( in vec3 dir, in mat4 matrix ) {
    return normalize( ( vec4( dir, 0.0 ) * matrix ).xyz );
}

void main()	{
    // #include <normalsVert>
    vec3 objectNormal = vec3(normal);
    // vec3 transformedNormal = objectNormal;
	vec4 newPos = vec4( position, 1.0);
	vec4 worldPosition = modelMatrix * newPos;

	vec3 camera = cameraPosition;
	#ifdef REFRACT
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		}
		else {
			cameraToVertex = normalize( vec3(modelMatrix * newPos).xyz  - cameraPosition );
		}
		vec3 reflectNormal = inverseTransformDirection( normal, viewMatrix );
		vReflect = reflect( cameraToVertex, reflectNormal );
	#endif

	eyeVector = normalize(vec3(modelMatrix * newPos).xyz - cameraPosition);
	worldNormal = normalize( modelViewMatrix * vec4(objectNormal, 0.0)).xyz;

	// vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
	vec3 transformedPosition = newPos.rgb;
	#include <dynamicBaseVert>
	vViewPosition = - mvPosition.xyz;

    gl_Position = projectionMatrix * modelViewMatrix * newPos;
}
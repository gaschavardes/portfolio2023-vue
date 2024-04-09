// #include <defaultVert>
#include <dynamicBaseVertPars>
// varying vec3 vNormal;
varying vec2 vUv;
#define PI 3.14159265359
varying vec3 vColor;
varying float vCenterDistance;
// attribute mat4 instanceMatrix;
uniform float uTime;
uniform vec2 uPos0;
uniform vec2 uPos1;
uniform float uVel;
varying vec3 worldNormal;
varying vec3 worldPosition;
varying vec3 eyeVector;
varying float vZVal;

// NOISE 

mat4 rotationMatrix(vec3 axis, float angle) {
    axis = normalize(axis);
    float s = sin(angle);
    float c = cos(angle);
    float oc = 1.0 - c;
    
    return mat4(oc * axis.x * axis.x + c,           oc * axis.x * axis.y - axis.z * s,  oc * axis.z * axis.x + axis.y * s,  0.0,
                oc * axis.x * axis.y + axis.z * s,  oc * axis.y * axis.y + c,           oc * axis.y * axis.z - axis.x * s,  0.0,
                oc * axis.z * axis.x - axis.y * s,  oc * axis.y * axis.z + axis.x * s,  oc * axis.z * axis.z + c,           0.0,
                0.0,                                0.0,                                0.0,                                1.0);
}

vec3 rotate(vec3 v, vec3 axis, float angle) {
	mat4 m = rotationMatrix(axis, angle);
	return (m * vec4(v, 1.0)).xyz;
}

float sdSegment( in vec2 p, in vec2 a, in vec2 b )
{
    vec2 pa = p-a, ba = b-a;
    float h = clamp( dot(pa,ba)/dot(ba,ba), 0.0, 1.0 );
    return length( pa - ba*h );
}

float EaseInOutSine(float x)
{ 
    return -(cos(PI * x) - 1.0) / 2.0;
}

void main()	{
	vUv = uv;
	vec3 pos = position;
	vec3 objectNormal = normal;
   	eyeVector = normalize(worldPosition.xyz - cameraPosition);
	worldNormal = normalize( modelViewMatrix * vec4(objectNormal, 0.0)).xyz;
	vec3 transformedPosition = pos;
	#include <dynamicBaseVert>
	mvPosition = modelViewMatrix * vec4(pos, 1.0);
	vViewPosition = - mvPosition.xyz;
	
	gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}
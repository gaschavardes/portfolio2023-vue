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
varying float vAppear;
uniform float uAppear;

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
	mat4 instance = instanceMatrix;

	vec4 transformed = vec4(position, 1.);

	vec4 newPos = instanceMatrix[3];
	float toCenter = length(newPos.xy);
	vCenterDistance = toCenter;


	vAppear = smoothstep(uAppear, uAppear - 5., vCenterDistance);


	// transformed = rotate(transformed, vec3(0., 1., 1. ),  uTime + toCenter * 0.4 );
	// transformed.z += sin(uTime * 2. + toCenter) * 0.3;

	float mouseTrail = sdSegment(newPos.xy, uPos0, uPos1);
	mouseTrail = smoothstep(1., 3. , mouseTrail);
	// mouseTrail *= (smoothstep(0., 0.3, uVel * mouseTrail));

	// transformed *= 1. + (1.0-mouseTrail) * 2.;
	float velocity = EaseInOutSine(smoothstep(0., 0.2, uVel));
	velocity = 1.;

	transformed *= rotationMatrix(vec3(0., 0., 1. ), (1. - mouseTrail) * 3.14 * 2. * velocity + vAppear * 3.14 - 3.14 );
	transformed *= rotationMatrix(vec3(1., 0., 0. ), 3.14 * .5);

	


	vec3 transformedPosition = position;
	vec3 objectNormal = vec3( normal );
	vec4 newObjNormal = vec4(objectNormal, 1.);
	
	newObjNormal *= rotationMatrix(vec3(0., 0., 1. ), (1. - mouseTrail) * 3.14 * 2. * velocity) + vAppear * 3.14 - 3.14 ;
	newObjNormal *= rotationMatrix(vec3(1., 0., 0. ), 3.14 * 0.5);

	transformed.z -= -1.9 * (1.-mouseTrail) * velocity + sin(uTime * 2. + toCenter) * 0.1 - sin(vAppear * 3.14) * 2. - 3.;
	objectNormal = newObjNormal.rgb;

	#include <dynamicBaseVert>

	worldPosition = vec3(modelMatrix * transformed).xyz;
	eyeVector = normalize(worldPosition.xyz - cameraPosition);
	worldNormal = normalize( modelViewMatrix * vec4(objectNormal, 0.0)).xyz;


	// mvPosition = transformed;
	// mvPosition = instance * mvPosition;

    gl_Position = projectionMatrix * modelViewMatrix * instance * transformed;
	// gl_Position = projectionMatrix * modelViewMatrix * instanceMatrix * vec4(position, 1.);
	
	// Override mvPosition to account for new transformations
	mvPosition =  transformed;
	vViewPosition = - mvPosition.xyz;
    vWorldPosition = modelMatrix * instance * transformed;
	vZVal = transformed.z;

    // vWorldPosition = modelMatrix * instanceMatrix * transformed;

}
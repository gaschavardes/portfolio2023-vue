#include <defaultFrag>
#pragma glslify: snoise2 = require(glsl-noise/simplex/2d)
uniform vec3 uColor;
varying vec3 vNormal;
varying vec2 vUv;
uniform sampler2D envFbo;
uniform sampler2D uMap;
uniform vec2 resolution;
uniform float uTime;
uniform float uAppear;

#define S(a,b,t) smoothstep(a,b,t)

mat2 Rot(float a)
{
    float s = sin(a);
    float c = cos(a);
    return mat2(c, -s, s, c);
}


// Created by inigo quilez - iq/2014
// License Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported License.
vec2 hash( vec2 p )
{
    p = vec2( dot(p,vec2(2127.1,81.17)), dot(p,vec2(1269.5,283.37)) );
	return fract(sin(p)*43758.5453);
}

float noise( in vec2 p )
{
    vec2 i = floor( p );
    vec2 f = fract( p );
	
	vec2 u = f*f*(3.0-2.0*f);

    float n = mix( mix( dot( -1.0+2.0*hash( i + vec2(0.0,0.0) ), f - vec2(0.0,0.0) ), 
                        dot( -1.0+2.0*hash( i + vec2(1.0,0.0) ), f - vec2(1.0,0.0) ), u.x),
                   mix( dot( -1.0+2.0*hash( i + vec2(0.0,1.0) ), f - vec2(0.0,1.0) ), 
                        dot( -1.0+2.0*hash( i + vec2(1.0,1.0) ), f - vec2(1.0,1.0) ), u.x), u.y);
	return 0.5 + 0.5*n;
}


void main() {
	// vec2 uv = gl_FragCoord.xy / resolution;
	// vec4 texture = texture2D(uMap, vUv);
	// vec4 envTexture = texture2D(envFbo, vUv);
    // gl_FragColor = vec4(texture.r + envTexture.r, texture.g, texture.b, 1.);
	// gl_FragColor = envTexture;

	 vec2 uv = gl_FragCoord.xy/resolution.xy;
    float ratio = resolution.x / resolution.y;

	float colorNoise = (snoise2(uv * 1000.) * 0.5 + 0.5);

	float noiseValX = noise(vec2(uv.x, uv.y));
	float noiseX = sin((vUv.x + noiseValX) * 10. + uTime * 0.1);
	// noiseX = smoothstep(0.3, 0.7, noiseX);
	noiseX += (smoothstep(0., 0.5, noiseX) - smoothstep(0.5, 1., noiseX)) * colorNoise;

	float noiseY = sin((vUv.y + noiseValX) * 10. + uTime * 0.1);
	// noiseX = smoothstep(0.3, 0.7, noiseX);
	noiseY += (smoothstep(0., 0.5, noiseY) - smoothstep(0.5, 1., noiseY)) * colorNoise;


	vec3 colorDeepBlue = mix(vec3(0.), vec3(.007, 0.3294117647, 0.3921568627), min(uAppear, 1.));
	vec3 colorRed = mix(vec3(0.), vec3(	0.8980392157, 0.4862745098, 0.137254902), min(uAppear - .5, 1.));
	vec3 colorYellow = mix(vec3(0.), vec3(0.9098039216, 0.6666666667, 0.2588235294), min(uAppear -0.2, 1.));

	vec3 colorBlue = mix(vec3(0.), vec3(0.350, .71, .953), min(uAppear - 1., 1.));

	colorYellow = vec3(.957, .804, .623);
	colorDeepBlue = vec3(.192, .384, .933);
	colorRed = vec3(.910, .510, .8);
	colorBlue = vec3(0.350, .71, .953);

	vec3 layer1 = mix(colorRed, colorDeepBlue, clamp(noiseX, 0., 1.));
	vec3 layer2 = mix(colorRed, colorBlue, clamp(noiseY * (smoothstep(0.4, 0.6, noiseY) * colorNoise), 0., 1.));


	layer1 = mix(colorYellow, layer1, clamp(noiseY + 0.5, 0., 1.));

    vec3 diffuse = mix(layer1, layer2, noiseX * noiseY);
    gl_FragColor = vec4(min(diffuse, vec3(0.9)), 1.);
	gl_FragColor = vec4(min(layer1, vec3(0.95)), 1.);
}

// #include <defaultFrag>

// uniform vec3 uColor;
// varying vec3 vNormal;
// varying vec2 vUv;
// uniform sampler2D envFbo;
// uniform sampler2D uMap;
// uniform vec2 resolution;
// uniform float uTime;
// uniform float uAppear;

// #define S(a,b,t) smoothstep(a,b,t)

// mat2 Rot(float a)
// {
//     float s = sin(a);
//     float c = cos(a);
//     return mat2(c, -s, s, c);
// }


// // Created by inigo quilez - iq/2014
// // License Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported License.
// vec2 hash( vec2 p )
// {
//     p = vec2( dot(p,vec2(2127.1,81.17)), dot(p,vec2(1269.5,283.37)) );
// 	return fract(sin(p)*43758.5453);
// }

// float noise( in vec2 p )
// {
//     vec2 i = floor( p );
//     vec2 f = fract( p );
	
// 	vec2 u = f*f*(3.0-2.0*f);

//     float n = mix( mix( dot( -1.0+2.0*hash( i + vec2(0.0,0.0) ), f - vec2(0.0,0.0) ), 
//                         dot( -1.0+2.0*hash( i + vec2(1.0,0.0) ), f - vec2(1.0,0.0) ), u.x),
//                    mix( dot( -1.0+2.0*hash( i + vec2(0.0,1.0) ), f - vec2(0.0,1.0) ), 
//                         dot( -1.0+2.0*hash( i + vec2(1.0,1.0) ), f - vec2(1.0,1.0) ), u.x), u.y);
// 	return 0.5 + 0.5*n;
// }


// void main() {
// 	// vec2 uv = gl_FragCoord.xy / resolution;
// 	// vec4 texture = texture2D(uMap, vUv);
// 	// vec4 envTexture = texture2D(envFbo, vUv);
//     // gl_FragColor = vec4(texture.r + envTexture.r, texture.g, texture.b, 1.);
// 	// gl_FragColor = envTexture;

// 	 vec2 uv = gl_FragCoord.xy/resolution.xy;
//     float ratio = resolution.x / resolution.y;

//     vec2 tuv = uv;
//     tuv -= .5;

//     // rotate with Noise
//     float degree = noise(vec2(uTime*.1, tuv.x*tuv.y));

//     tuv.y *= 1./ratio;
//     tuv *= Rot(radians((degree-.5)*720.+180.));
// 	tuv.y *= ratio;

    
//     // Wave warp with sin
//     float frequency = 5.;
//     float amplitude = 30.;
//     float speed = uTime * 2.;
//     tuv.x += sin(tuv.y*frequency+speed)/amplitude;
//    	tuv.y += sin(tuv.x*frequency*1.5+speed)/(amplitude*.5);
    
    
//     // draw the image
//     vec3 colorYellow = mix(vec3(0.), vec3(.957, .804, .623), min(uAppear -0.2, 1.));
//     vec3 colorDeepBlue = mix(vec3(0.), vec3(.192, .384, .933), min(uAppear, 1.));
//     vec3 layer1 = mix(colorYellow, colorDeepBlue, S(-.3, .2, (tuv*Rot(radians(-5.))).x));
    
//     vec3 colorRed = mix(vec3(0.), vec3(.910, .510, .8), min(uAppear - .5, 1.));
//     vec3 colorBlue = mix(vec3(0.), vec3(0.350, .71, .953), min(uAppear - 1., 1.));
//     vec3 layer2 = mix(colorRed, colorBlue, S(-.3, .2, (tuv*Rot(radians(-5.))).x));
    
//     vec3 finalComp = mix(layer1, layer2, S(.5, -.3, tuv.y));
    
//     vec3 col = finalComp;
    
//     gl_FragColor = vec4(col,1.0);
// }

// #include <defaultFrag>
// #pragma glslify: snoise2 = require(glsl-noise/simplex/2d)
// uniform vec3 uColor;
// varying vec3 vNormal;
// varying vec2 vUv;
// uniform sampler2D envFbo;
// uniform sampler2D uMap;
// uniform vec2 resolution;
// uniform float uTime;

// #define S(a,b,t) smoothstep(a,b,t)

// mat2 Rot(float a)
// {
//     float s = sin(a);
//     float c = cos(a);
//     return mat2(c, -s, s, c);
// }


// // Created by inigo quilez - iq/2014
// // License Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported License.
// vec2 hash( vec2 p )
// {
//     p = vec2( dot(p,vec2(2127.1,81.17)), dot(p,vec2(1269.5,283.37)) );
// 	return fract(sin(p)*43758.5453);
// }

// float noise( in vec2 p )
// {
//     vec2 i = floor( p );
//     vec2 f = fract( p );
	
// 	vec2 u = f*f*(3.0-2.0*f);

//     float n = mix( mix( dot( -1.0+2.0*hash( i + vec2(0.0,0.0) ), f - vec2(0.0,0.0) ), 
//                         dot( -1.0+2.0*hash( i + vec2(1.0,0.0) ), f - vec2(1.0,0.0) ), u.x),
//                    mix( dot( -1.0+2.0*hash( i + vec2(0.0,1.0) ), f - vec2(0.0,1.0) ), 
//                         dot( -1.0+2.0*hash( i + vec2(1.0,1.0) ), f - vec2(1.0,1.0) ), u.x), u.y);
// 	return 0.5 + 0.5*n;
// }


// void main() {
// 	// vec2 uv = gl_FragCoord.xy / resolution;
// 	// vec4 texture = texture2D(uMap, vUv);
// 	// vec4 envTexture = texture2D(envFbo, vUv);
//     // gl_FragColor = vec4(texture.r + envTexture.r, texture.g, texture.b, 1.);
// 	// gl_FragColor = envTexture;

// 	 vec2 uv = gl_FragCoord.xy/resolution.xy;
//     float ratio = resolution.x / resolution.y;

//     vec2 tuv = uv;
//     tuv -= .5;

// 	vec3 colorNoise = vec3(snoise2(uv * 1000.) * 0.5 + 0.5);


//     // rotate with Noise
//     float degree = noise(vec2(uTime*.1, tuv.x*tuv.y));

//     tuv.y *= 1./ratio;
//     tuv *= Rot(radians(((degree - 5.))*720. +180.));
// 	tuv.y *= ratio;

    
//     // Wave warp with sin
//     float frequency = 5.;
//     float amplitude = 30.;
//     float speed = uTime * 2.;
//     tuv.x += sin(tuv.y*frequency+speed)/amplitude;
//    	tuv.y += sin(tuv.x*frequency*1.5+speed)/(amplitude*.5);
    

    
//     // draw the image
//     vec3 colorYellow = vec3(.957, .804, .623);
//     vec3 colorDeepBlue = vec3(.192, .384, .933);
//     vec3 layer1 = mix(colorYellow, colorDeepBlue, S(-.3, .2, (tuv*Rot(radians(-5. * colorNoise.r))).x));
    
//     vec3 colorRed = vec3(.910, 0., 0.);
//     vec3 colorBlue = vec3(0.350, .71, .953);
//     vec3 layer2 = mix(colorRed, colorBlue, S(-.3, .2, (tuv*Rot(radians(-5. * colorNoise.r))).x));
    
//     vec3 finalComp = mix(layer1, layer2, S(.5, -.3, tuv.y + colorNoise.r * .5));
    
//     vec3 col = finalComp;

    
//     gl_FragColor = vec4(finalComp, 1.);

// }
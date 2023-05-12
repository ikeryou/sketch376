precision highp float;

uniform mat4 viewMatrix;
uniform vec3 diffuse;
uniform vec3 emissive;

uniform vec3 colorA;
uniform vec3 colorB;
uniform vec2 pA;
uniform vec2 pB;
uniform vec2 pC;

uniform vec3 color;
uniform vec3 light;
uniform float glossiness;
uniform float weight;

varying vec2 vUv;
varying vec3 vViewPosition;
varying vec3 vNormal;
varying vec3 vPos;
varying vec3 vViewDir;

#include <common>
#include <bsdfs>
#include <lights_pars_begin>

void main(void) {

  vec3 a = vec3(pA, 0.0);
  vec3 b = vec3(pB, 0.0);
  vec3 c = vec3(pC, 0.0);

  vec3 v1 = b - a;
  vec3 v2 = c - a;
  vec3 normal = cross(v1, v2);
  float area = length(normal) / 2.0;

  vec3 p = vec3(vUv, 0.0);

  float s1 = length(cross(a - p, b - p)) / 2.0;
  float s2 = length(cross(b - p, c - p)) / 2.0;
  float s3 = length(cross(c - p, a - p)) / 2.0;
  float totalArea = s1 + s2 + s3;

  vec3 useColor = colorB;

  // directional light
  float NdotL = dot(vNormal, directionalLights[0].direction);
  float lightIntensity = smoothstep(0.0, 0.01, NdotL);
  vec3 directionalLight = directionalLights[0].color * lightIntensity;

  // specular reflection
  vec3 halfVector = normalize(directionalLights[0].direction + vViewDir);
  float NdotH = dot(vNormal, halfVector);

  float specularIntensity = pow(NdotH * lightIntensity, 1000.0 / glossiness);
  float specularIntensitySmooth = smoothstep(0.05, 0.1, specularIntensity);

  vec3 specular = specularIntensitySmooth * directionalLights[0].color * 1.6;

  // rim lighting
  float rimDot = 1.0 - dot(vViewDir, vNormal);
  float rimAmount = 50.6;

  float rimThreshold = 10.2;
  float rimIntensity = rimDot * pow(NdotL, rimThreshold);
  rimIntensity = smoothstep(rimAmount - 0.01, rimAmount + 0.01, rimIntensity);

  vec3 rim = rimIntensity * directionalLights[0].color;

  vec3 dest = useColor - vNormal.y * 0.2;
  gl_FragColor = vec4(dest * light * (directionalLight + ambientLightColor + specular + rim), 1.0);
  gl_FragColor.rgb = 1.0 - gl_FragColor.rgb;
  gl_FragColor.rgb += 0.2;

  if (abs(totalArea - area) >= weight) {
    discard;
    // gl_FragColor.rgb = 1.0 - gl_FragColor.rgb;
    // gl_FragColor.rgb *= gl_FragColor.rgb;
  }

  // if (abs(totalArea - area) >= weight * 10.0) {
  //   gl_FragColor.rgb *= gl_FragColor.rgb * 0.2;
  //   // gl_FragColor.rgb = 1.0 - gl_FragColor.rgb;
  //   // gl_FragColor.rgb *= gl_FragColor.rgb;
  // }
}

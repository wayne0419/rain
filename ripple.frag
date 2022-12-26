#ifdef GL_ES
precision mediump float;
#endif

varying vec2 pos;

uniform vec2 res;
uniform sampler2D currBuff;
uniform sampler2D prevBuff;
uniform float damping;


void main() {
  // calculate pixel size
  vec2 pix = 1.0/res;
  
  // get water state
  vec3 prev = texture2D(prevBuff, pos).rgb;
  
  // get previous neighbour water states
  vec3 u = texture2D(currBuff, pos + vec2(0.0, pix.y)).rgb;
  vec3 d = texture2D(currBuff, pos - vec2(0.0, pix.y)).rgb;
  vec3 l = texture2D(currBuff, pos + vec2(pix.x, 0.0)).rgb;
  vec3 r = texture2D(currBuff, pos - vec2(pix.x, 0.0)).rgb;

  // calculate the next state value
  vec3 next = ((u + d + l + r)/2.0) - prev;
  next = next * damping;

  // output next state value
  gl_FragColor = vec4(next.r, next.g, next.b, 1.0);
}


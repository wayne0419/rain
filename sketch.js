let rippleShader;

let raindrop_cooldown = 1;  // Cooldown after raindrop, must be integer and >= 1
let raindrop_cooldown_count = 0;

let number_droplets_per_freq = 1;  // How many droplets in each raindrop

let allow_mouse = false;

let ripple_color = "rgb(255,255,255)";  //  Ripple Color
let random_color = false;    //  Random Ripple Color
const damping = 0.9999999;

// need two buffers
let currBuff, prevBuff;

function preload() {
  rippleShader = loadShader('ripple.vert', 'ripple.frag');
}

function setup() {
  cooldown_slider = createSlider(1, 60, 1);
  cooldown_slider.position(20, 20);
  number_droplets_slider = createSlider(0, 10, 0);
  number_droplets_slider.position(150, 20);
  random_color_slider = createSlider(0, 1, 0);
  random_color_slider.position(280, 20);
  random_color_slider.style('width', '30px');
  allow_mouse_slider = createSlider(0, 1, 0);
  allow_mouse_slider.position(320, 20);
  allow_mouse_slider.style('width', '30px');
  
  createCanvas(windowWidth, windowHeight, WEBGL); 
  pixelDensity(1);
  noSmooth();
  // create buffers
  currBuff = createGraphics(width, height);
  currBuff.pixelDensity(1);
  currBuff.noSmooth();
  
  prevBuff = createGraphics(width, height);
  prevBuff.pixelDensity(1);
  prevBuff.noSmooth();
  
  // set the shader
  shader(rippleShader);
  
  rippleShader.setUniform("damping", damping);
  rippleShader.setUniform("res", [width, height]);
}
function draw() {
  raindrop_cooldown = 61 - cooldown_slider.value();
  number_droplets_per_freq = number_droplets_slider.value();
  random_color = random_color_slider.value();
  allow_mouse = allow_mouse_slider.value();

  // add ripple at mouse
  random_color ? stroke(random(256), random(256), random(256)) : stroke(ripple_color);
  if(allow_mouse && mouseIsPressed) {
    point(mouseX - width/2, mouseY - height/2);
  }
  
  // add rain drop
  raindrop_cooldown_count = (raindrop_cooldown_count + 1) % raindrop_cooldown;
  if (raindrop_cooldown_count == 0) {
    for (let i = 0; i < number_droplets_per_freq; i++) {
      random_color ? stroke(random(256), random(256), random(256)) : stroke(ripple_color);
      point(random(width) - width/2, random(height) - height/2);
    }
  }

  // update buffers
  prevBuff.image(currBuff, 0, 0);
  currBuff.image(get(), 0, 0);
  
  // set the buffers inside the shader
  rippleShader.setUniform('currBuff', currBuff);
  rippleShader.setUniform('prevBuff', prevBuff);
  
  // give shader geometry to draw on
  rect(-width/2, -height/2, width, height);

}
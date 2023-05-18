import './style.css';
import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';
import { GUI } from 'dat.gui';

//scene
const scene = new THREE.Scene();
const gui = new GUI();


//camera
// had to make the far clipping plane reeeeeeally far away to accomodate
// the sheer scale of the sun and in order to not clip the rings when 
// they are scaled. the moon can be clipped though, its so small, 
// it hardly matters
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight,0.1,100000);


//render
const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg'),
});
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.setZ(30);
camera.position.setX(30);
camera.position.setY(30);
renderer.render(scene, camera);


//remove if too bright
renderer.outputEncoding = THREE.sRGBEncoding;


var options = {
  planet: 'Images/Alt Earth.jpg',
  currentP: 'Images/Alt Earth.jpg',
  back: 'Images/8k_stars_milky_way.jpg',
  currentB: 'Images/8k_stars_milky_way.jpg',
  rotate: true,
  time: 0.005,
  t: 0,
  ring: false,
  moon: true,
  planetTF: true,
  orbitRad: 30,
  ambient: true,
  realistic_scale: false,
  planet_rad: 15,
  moonTrack: false,
  puke: false
};



//make planet
const planet_geometry = new THREE.SphereGeometry( 15, 64, 32 );
//const material = new THREE.MeshStandardMaterial( { color: 0xFF6347} );
/*
const material = new THREE.MeshStandardMaterial( {
  map: new THREE.TextureLoader().load('Images/Alt Earth.jpg')});
*/
const planet_material = new THREE.MeshStandardMaterial({
  map: new THREE.TextureLoader().load("Images/Alt Earth.jpg")
  //emissiveMap: new THREE.TextureLoader().load("Images/8k_earth_nightmap.jpg"),
  //emissive: new THREE.TextureLoader().load({ color: 0xFFFFFF})
})
const planet = new THREE.Mesh( planet_geometry, planet_material );
planet.castShadow = true;
planet.receiveShadow = true;


//make moon
const moon_geometry = new THREE.SphereGeometry( 4.087488241, 64, 32 );
const moon_material = new THREE.MeshStandardMaterial( {
  map: new THREE.TextureLoader().load('Images/8k_moon.jpg')});
const moon = new THREE.Mesh( moon_geometry, moon_material );
//moon.rotateX(90);
moon.castShadow = true;
moon.receiveShadow = true;
//moon.rotation.z+=70;


//make ring
const ring_geometry = new THREE.RingGeometry( 16.65, 34.8, 90 );
var pos = ring_geometry.attributes.position;
var v3 = new THREE.Vector3();
for (let i = 0; i < pos.count; i++){
    v3.fromBufferAttribute(pos, i);
    ring_geometry.attributes.uv.setXY(i, v3.length() < 17 ? 0 : 1, 1);
}
const ring_material = new THREE.MeshStandardMaterial( {
  side: THREE.DoubleSide, 
  map: new THREE.TextureLoader().load('Images/8k_saturn_ring_alpha.png')});
const ring = new THREE.Mesh( ring_geometry, ring_material );
ring.rotateX(Math.PI/2);
ring.castShadow = true;
ring.receiveShadow = true;
ring.material.transparent = true;



//lighting
const pointLight = new THREE.PointLight(0xffffff);
pointLight.position.set(40, 17.392, 0);
pointLight.intensity = 1.5;
const ambientLight = new THREE.AmbientLight(0xffffff);
ambientLight.intensity = 0.05;
scene.add(pointLight);


//helper functions 
/*
const lightHelper = new THREE.PointLightHelper(pointLight)
//150 units across, 50 divisions, each square is 3 units
const gridHelper = new THREE.GridHelper(150, 50)
scene.add(lightHelper, gridHelper)
*/


//controls
const controls = new OrbitControls(camera, renderer.domElement);


//background galaxy
const loader = new THREE.TextureLoader();
var texture = loader.load(
  'Images/8k_stars_milky_way.jpg',
  () => {
    const rt = new THREE.WebGLCubeRenderTarget(texture.image.height);
    rt.fromEquirectangularTexture(renderer, texture);
    scene.background = rt.texture;
  });


//gui
gui.add(options, 'planet', { 
  Sun: 'Images/8k_sun.jpg',
  Mercury: 'Images/8k_mercury.jpg', 
  Venus_Surface: 'Images/8k_venus_surface.jpg', 
  Venus_Atmosphere: 'Images/4k_venus_atmosphere.jpg',
  Earth_good: 'Images/Alt Earth.jpg', 
  Earth_bad: 'Images/8k_earth_daymap.jpg', 
  Earth_diff: 'Images/Alt Alt Earth.jpg', 
  Mars: 'Images/8k_mars.jpg', 
  Jupiter: 'Images/8k_jupiter.jpg', 
  Saturn: 'Images/8k_saturn.jpg', 
  Uranus: 'Images/2k_uranus.jpg', 
  Neptune: 'Images/2k_neptune.jpg', 
  Makemake_Fictional: 'Images/4k_makemake_fictional.jpg',
  Haumea_Fictional: 'Images/4k_haumea_fictional.jpg',
  Ceres_Fictional: 'Images/4k_ceres_fictional.jpg',
  Eris_Fictional:  'Images/4k_eris_fictional.jpg',
  Pluto:  'Images/pluto_color_mapmosaic.jpg',
  Pluto_Fictional:  'Images/pluto_fictional.jpg'
});
gui.add(options, 'back', { 
  Stars: 'Images/8k_stars.jpg',
  Galaxy: 'Images/8k_stars_milky_way.jpg'
});

const sphereManip = gui.addFolder("Manipulate");
sphereManip.add(planet.rotation,'x',0,Math.PI*2).name('Rotate X Axis');
sphereManip.add(planet.rotation,'y',0,Math.PI*2).name('Rotate Y Axis');
sphereManip.add(planet.rotation,'z',0,Math.PI*2).name('Rotate Z Axis');
sphereManip.add(options, 'time',0,0.4).name('Time');
sphereManip.add(options, "ring");
sphereManip.add(options, "moon");
//sphereManip.add(options, "planetTF");
sphereManip.add(options, "ambient");
sphereManip.add(options, "realistic_scale");
//update the following to be a distance from the surface of the planet rathrer than some radius
sphereManip.add(options,'orbitRad',18,50).name('Moon orbit from surface');


//gui options for fun
sphereManip.add(options, "rotate");
sphereManip.add(options, 'moonTrack');
sphereManip.add(options, 'puke');


//animation
function animate(){
  requestAnimationFrame(animate);

  //planet rotation
  if (options["rotate"]){
    planet.rotation.y +=2*options['time'];
  };

  //planet texture swapping
  if (options["planet"] != options['currentP']){
    planet.material.map = new THREE.TextureLoader().load( options['planet'] );
    options["currentP"] = options["planet"];
  }

  //background texture swapping
  if (options["back"] != options['currentB']){
    texture = loader.load(
      options['back'],
      () => {
        const rt = new THREE.WebGLCubeRenderTarget(texture.image.height);
        rt.fromEquirectangularTexture(renderer, texture);
        scene.background = rt.texture;
      });
    options["currentB"] = options["back"];
  }

  if (!options['ring']){ scene.remove(ring);}
  else{ scene.add(ring); }
  if (!options['moon']){ scene.remove(moon); }
  else{scene.add(moon);}
  if (!options['planetTF']){ scene.remove(planet);}
  else{scene.add(planet);}
  if (!options['ambient']){scene.remove(ambientLight);}
  else{scene.add(ambientLight);}
  if (options['currentP'].includes('sun') && options['ambient']==false){ scene.remove(planet);}
  else{scene.add(planet);}

  //moon motion
  if (options['realistic_scale']==true){
    options['orbitRad']=(options['planet_rad']+904);
  }
  else if (options['orbitRad']>50) {
    options['orbitRad']=30;
  }
  moon.position.set(
    -Math.cos(options['t']) * (options['orbitRad']),
    10,
    Math.sin(options['t']) * (options['orbitRad'])
  );
  //moon.rotation.y+=options['time']/2;
  moon.lookAt(0,0,0);
  //moon.rotation.z+=70;


  //ring motion
  // the time scale really affects the wobble. I don't love this, but i dont
  // know what to do other than accept it or make it static
  if (options['rotate']){
    ring.rotateX(Math.cos(options['t'])/1000);
    //ring.rotateZ(options['time']*0.01);
  }
  
  //options['ring']=true;
  
  planet.material.needsUpdate = true;
  //planet.geometry.needsUpdate = true;
  

  // scaling stuff
  planet.scale.set(1,1,1);
  ring.scale.set(1,1,1);
  options['planet_rad'] = 15;
  pointLight.position.set(40, 17.392, 0);
  if (options['currentP'].includes('sun')){
    ambientLight.intensity = 1;
    pointLight.intensity = 0;
  }
  else{
    ambientLight.intensity = 0.05;
    pointLight.intensity = 1.5;
  }

  if ((!options['currentP'].includes('Earth') || !options['currentP'].includes('earth')) && (options['realistic_scale'])){
    if (options['currentP'].includes('sun')){
      planet.scale.set(108.97,108.97,108.97);
      options['planet_rad'] = 108.97*15;
      ring.scale.set(108.97,108.97,108.97);
      options['ambient'] = true;
    }
    else if (options['currentP'].includes('mercury')){
      planet.scale.set(0.38,0.38,0.38);
      options['planet_rad'] = 0.38*15;
      ring.scale.set(0.38,0.38,0.38);
      pointLight.position.set(40*0.38, 17.392*0.38, 0);
    }
    else if (options['currentP'].includes('venus')){
      planet.scale.set(0.95,0.95,0.95);
      options['planet_rad'] = 0.95*15;
      ring.scale.set(0.95,0.95,0.95);
      pointLight.position.set(40*0.95, 17.392*0.95, 0);
    }
    else if (options['currentP'].includes('mars')){
      planet.scale.set(0.53,0.53,0.53);
      options['planet_rad'] = 0.53*15;
      ring.scale.set(0.53,0.53,0.53);
      pointLight.position.set(40*0.53, 17.392*0.53, 0);
    }
    else if (options['currentP'].includes('jupiter')){
      planet.scale.set(11.21,11.21,11.21);
      options['planet_rad'] = 11.21*15;
      ring.scale.set(11.21,11.21,11.21);
      pointLight.position.set(40*11.21, 17.392*11.21, 0);
    }
    else if (options['currentP'].includes('saturn')){
      planet.scale.set(9.45,9.45,9.45);
      options['planet_rad'] = 9.45*15;
      ring.scale.set(9.45,9.45,9.45);
      pointLight.position.set(40*9.45, 17.392*9.45, 0);
      options['ring'] = true;
    }
    else if (options['currentP'].includes('uranus')){
      planet.scale.set(4.01,4.01,4.01);
      options['planet_rad'] = 4.01*15;
      ring.scale.set(4.01,4.01,4.01);
      pointLight.position.set(40*4.01, 17.392*4.01, 0);
    }
    else if (options['currentP'].includes('neptune')){
      planet.scale.set(3.88,3.88,3.88);
      options['planet_rad'] = 3.88*15;
      ring.scale.set(3.88,3.88,3.88);
      pointLight.position.set(40*3.88, 17.392*3.88, 0);
    }
    else if (options['currentP'].includes('ceres')){
      planet.scale.set(0.07,0.07,0.07);
      options['planet_rad'] = 0.07*15;
      ring.scale.set(0.07,0.07,0.07);
      pointLight.position.set(40*0.07, 17.392*0.07, 0);
    }
    else if (options['currentP'].includes('pluto')){
      planet.scale.set(0.18,0.18,0.18);
      options['planet_rad'] = 0.18*15;
      ring.scale.set(0.18,0.18,0.18);
      pointLight.position.set(40*0.18, 17.392*0.18, 0);
    }
    else if (options['currentP'].includes('haumea')){
      planet.scale.set(0.083,0.078,0.119);
      options['planet_rad'] = 0.119*15;
      ring.scale.set(0.119,0.119,0.119);
      pointLight.position.set(40*0.119, 17.392*0.119, 0);
    }
    else if (options['currentP'].includes('makemake')){
      planet.scale.set(0.11,0.11,0.11);
      options['planet_rad'] = 0.11*15;
      ring.scale.set(0.11,0.11,0.11);
      pointLight.position.set(40*0.11, 17.392*0.11, 0);
    }
    else if (options['currentP'].includes('eris')){
      planet.scale.set(0.38,0.38,0.38);
      options['planet_rad'] = 0.38*15;
      ring.scale.set(0.38,0.38,0.38);
      pointLight.position.set(40*0.38, 17.392*0.38, 0);
    }
  }

  texture.needsUpdate = true;

  controls.update();

  renderer.render(scene, camera);

  if (options['moonTrack']){
    camera.position.set(
      -Math.cos(options['t']) * ((options['orbitRad'])+20),
      15,
      Math.sin(options['t']) * ((options['orbitRad'])+20)
    );
    camera.lookAt(0,0,0);
  }
  else if (options['puke']){
    camera.position.setX(moon.position.x + 15);
    camera.position.setY(moon.position.y + 15);
    camera.position.setZ(moon.position.z + 15);
    camera.lookAt(0,0,0);
    options['time']=0.1;
  }

  if (options['rotate']){
    options['t']+=options['time'];
  }
}
animate()
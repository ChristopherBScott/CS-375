
    var time = 0.0;

function init(){
	
	var canvas = document.getElementById("webgl-canvas");
	gl = canvas.getContext("webgl2");

	// set background color (grey)
	gl.clearColor(0.5,0.5,0.5,1.0);

	// depth buffering
	gl.enable(gl.DEPTH_TEST);

	cube = new Cube(gl);

	// I dont feel I have a total grasp on the perspective and
	// viewing transformations. I thought I did, but my attempts to implement 
	// them was mostly met with some insane visuals more than something 
	// identifiable as a cube. In any case, the following are a couple of my 
	// futile attempts.


	cube.P = mat4();
	//cube.P = ortho(-1,1,-1,1,0.001,10);
	//cube.P = mult(perspective( 200, 1, 0.1, 10 ),lookAt([0,0,0],[0,0,0],[0,0,1]));
	//cube.P = lookAt([0,0,0],[0,0,0],[0,0,1]);

	render();
}


function render(){

	gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);

	//increment time
	time += 1.0;
	
	// rotate cube as desired. I just messed around with the rotations until I
	// found something asthetically pleasing
	cube.MV = mult(mult(rotateX(2*time),rotateY(time)),rotateZ(time));

	cube.render();

	this.requestAnimationFrame(render);

}

window.onload=init;
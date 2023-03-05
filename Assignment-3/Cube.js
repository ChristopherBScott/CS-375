
const DefaultNumSides = 8;

function Cube( gl, vertexShaderId, fragmentShaderId ) {

    const vertShdr = vertexShaderId || "Cube-vertex-shader";
    const fragShdr = fragmentShaderId || "Cube-fragment-shader";

    const shaderProgram = initShaders( gl, vertShdr, fragShdr );
    if ( shaderProgram < 0 ) {
        alert( "Error: Cube shader pipeline failed to compile.\n\n" +
            "\tvertex shader id:  \t" + vertShdr + "\n" +
            "\tfragment shader id:\t" + fragShdr + "\n" );
        return; 
    }
    

    // I decided to make my cube in two halves, as two triangle fans
    // this could certainly be optimized as we discussed in class
    // with a triangle strip, but this was the first solution that
    // occurred to me, and I wanted to try implementing it
    positions = [ 0.5, 0.5, 0.5, //0
            0.5, 0.5, -0.5,     //1
            0.5, -0.5, -0.5,    //2
            0.5, -0.5, 0.5,     //3
            -0.5, -0.5, 0.5,    //4
            -0.5, 0.5, 0.5,     //5
            -0.5, 0.5, -0.5,    //6

            -0.5, -0.5, -0.5];  //7
    indices = [ 0,1,2,3,4,5,6,1,7,6,5,4,3,2,1,6 ];

    // Also, I could totally do what you showed us and implement the
    // positions as 0 and 1 and just subtract 0.5 from the points later,
    // but again, this was the way that first occurred to me, so i wanted
    // to try it. Ultimately, the only effect this has is that the colors
    // on my cube would be less vibrant as their values are half of their 
    // maximum, but I compensated for this by sort of doing the reverse of
    // what we did in class and adding 0.5 to the vColor value



    aPosition = new Attribute(gl, shaderProgram, positions,
        "aPosition", 3, gl.FLOAT );
    indices = new Element(gl, indices);
        
    let MV = new Uniform(gl, shaderProgram, "MV");
    let P  = new Uniform(gl, shaderProgram, "P");
   
    this.render = function () {
       
        gl.useProgram( shaderProgram );
        
        aPosition.enable();
        
        indices.enable();
        
        MV.update(this.MV);
        P.update(this.P);

        // the following lines are easily be changed to render the cube
        // using a more efficient method than two triangle fans

        let count = indices.count / 2;
        
        // higher (colorful) half of cube
        gl.drawElements( gl.TRIANGLE_FAN, count, indices.type, 0 );
       
        //lower (dark) half of cube
        var offset = count;
        gl.drawElements( gl.TRIANGLE_FAN, count, indices.type, offset );
        
        aPosition.disable();
        indices.disable();
    }
};

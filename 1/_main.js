/* eslint no-console:0 consistent-return:0 */
"use strict";

function createShader(gl, type, source) {
  var shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  var success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
  if (success) {
    return shader;
  }

  console.log(gl.getShaderInfoLog(shader));
  gl.deleteShader(shader);
}

function createProgram(gl, vertexShader, fragmentShader) {
  var program = gl.createProgram();
  console.log(vertexShader);
  console.log(fragmentShader);
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  var success = gl.getProgramParameter(program, gl.LINK_STATUS);
  if (success) {
    return program;
  }

  console.log(gl.getProgramInfoLog(program));
  gl.deleteProgram(program);
}

function get_file(path) {
  return fetch(path)
    .then((response) => response.text())
    .then((data) => {
      return data;
    });
}

async function load_shaders(){
    var vertexShaderSource = await get_file("./vert-shader-2d.glsl");
    var fragmentShaderSource = await get_file("./frag-shader-2d.glsl");
    //var fragmentShaderSource = await get_file("./frag-shader-sea.glsl");
    main(vertexShaderSource, fragmentShaderSource);
}

load_shaders();

function main(vertexShaderSource, fragmentShaderSource) {
  var canvas = document.querySelector("#c");
  var gl = canvas.getContext("webgl");
  if (!gl) {
    return;
  }
  var vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
  var fragmentShader = createShader(
    gl,
    gl.FRAGMENT_SHADER,
    fragmentShaderSource
  );
  var program = createProgram(gl, vertexShader, fragmentShader);
  webglUtils.resizeCanvasToDisplaySize(gl.canvas);
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
  gl.useProgram(program);

////////////////////////////////////////////////
////    END BOILERPLATE LAND                ////
////////////////////////////////////////////////

//  var positions = [
//    0, 0, 
//    0, 0.5, 
//    0.7, 0
//];


    var positions = [];
    //let NUM_TRIS = 100;
    //for(let t=0; t < NUM_TRIS; t++){
    //    for(let v=0; v < 3; v++){
    //        let x = Math.random();
    //        let y = Math.random();
    //        let z = Math.random();
    //        positions.push(x);
    //        positions.push(y);
    //        positions.push(z);
    //    }
    //}

    var cube = [
        0.0,  0.0,  0.0
        ,0.0,  0.0,  1.0
        ,0.0,  1.0,  0.0
        ,0.0,  1.0,  1.0
        ,1.0,  0.0,  0.0
        ,1.0,  0.0,  1.0
        ,1.0,  1.0,  0.0
        ,1.0,  1.0,  1.0
    ]
    positions = cube
    let NUM_TRIS = cube.length / 3;
  
  var positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

  var positionAttributeLocation = gl.getAttribLocation(program, "a_position");
  gl.enableVertexAttribArray(positionAttributeLocation);
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

  // Tell the attribute how to get data out of positionBuffer (ARRAY_BUFFER)
  var size = 3; // 2 components per iteration
  var type = gl.FLOAT; // the data is 32bit floats
  var normalize = false; // don't normalize the data
  var stride = 0; // 0 = move forward size * sizeof(type) each iteration to get the next position
  var offset = 0; // start at the beginning of the buffer
  gl.vertexAttribPointer(
    positionAttributeLocation,
    size,
    type,
    normalize,
    stride,
    offset
  );

    ////////////////////////////////////////////////
    ////    END BOILERPLATE LAND  2             ////
    ////////////////////////////////////////////////
    function draw(){
        let time = (new Date()).valueOf();
        var freq = time/1000;
        var angle = [
            freq % 360
            , 0];
        //var angle = [50.0, 0];
        var rotationLocation = gl.getUniformLocation(program, "angle");
        gl.uniform2fv(rotationLocation, angle);
        
        let pos = [
            Math.sin(freq) * 0.5,
            Math.cos(freq) * 0.5
        ]
        var posLoc = gl.getUniformLocation(program, "pos");
        gl.uniform2fv(posLoc, pos);

        // draw
        var primitiveType = gl.TRIANGLES;
        var offset = 0;
        var count = 3 * NUM_TRIS;
            
        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.drawArrays(primitiveType, offset, count)
    }
    setInterval(draw, 1);
}







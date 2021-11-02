function main(vertexShaderSource, fragmentShaderSource)
{
    let CANVAS_WIDTH = 160;
    let CANVAS_HEIGHT = 144;
    var canvas = document.querySelector("#c");
    canvas.width = CANVAS_WIDTH;
    canvas.height = CANVAS_HEIGHT;

    var gl = canvas.getContext("webgl");
    //function setpixelated(context){
    //    context['imageSmoothingEnabled'] = false;       /* standard */
    //    context['mozImageSmoothingEnabled'] = false;    /* Firefox */
    //    context['oImageSmoothingEnabled'] = false;      /* Opera */
    //    context['webkitImageSmoothingEnabled'] = false; /* Safari */
    //    context['msImageSmoothingEnabled'] = false;     /* IE */
    //}
    //setpixelated(gl);
    if (!gl){return;}
    var vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    var fragmentShader = createShader(gl,gl.FRAGMENT_SHADER,fragmentShaderSource);
    var program = createProgram(gl, vertexShader, fragmentShader);
    //webglUtils.resizeCanvasToDisplaySize(gl.canvas);

    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    gl.useProgram(program);

    ////////////////////////////////////////////////
    ////    END BOILERPLATE LAND                ////
    ////////////////////////////////////////////////

    //  draw rect
    var verts = [0, 0, 0, 1.0, 1.0, 0, 1.0, 0.0, 0.0, 1.0, 1.0, 1.0];
    let num_tris = verts.length / (2 * 3);

    // creating and filling a buffer with the verticies
    var pos = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, pos);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verts), gl.STATIC_DRAW);

    // exposing the verticies to the shader
    var pos_attrloc = gl.getAttribLocation(program, "a_pos");
    gl.enableVertexAttribArray(pos_attrloc);
    gl.bindBuffer(gl.ARRAY_BUFFER, pos);
    gl.vertexAttribPointer(pos_attrloc,
        size=2,// 2 components per iteration
        type=gl.FLOAT,
        normalize=false,
        stride=0,// 0 = move forward size * sizeof(type) each iteration to get the next position
        offset=0// start at the beginning of the buffer
    );

    ////////////////////////////////////////////////
    ////    END BOILERPLATE LAND  2             ////
    ////////////////////////////////////////////////
    function draw()
    {
        let dims = [CANVAS_WIDTH, CANVAS_HEIGHT];
        var dims_loc = gl.getUniformLocation(program, "dims");
        gl.uniform2fv(dims_loc, dims);

        let time = new Date().valueOf();
        var sec_freq = time / 1000.0;
        let freq = sec_freq * 6.0;
        var angle = freq % 360;
        var angle = 0;
        var angle_loc = gl.getUniformLocation(program, "angle");
        gl.uniform1f(angle_loc, angle);

        var scale = 0.1 + (Math.cos(sec_freq*6)/2.0+0.5)*0.3;
        //var scale = 5.0;
        var scale_loc = gl.getUniformLocation(program, "scale");
        gl.uniform1f(scale_loc, scale);

        var pos = [
            0.5 + Math.sin(sec_freq) / 2.0, 
            0.5 + Math.cos(sec_freq) / 2.0
        ]
        var pos_loc = gl.getUniformLocation(program, "pos");
        gl.uniform2fv(pos_loc, pos);

        //gl.clearColor(0, 0, 0, 0);
        //gl.clear(gl.COLOR_BUFFER_BIT);

        var num_verts = 3 * num_tris;
        gl.drawArrays(gl.TRIANGLES, offset=0, count=num_verts);
    }
    setInterval(draw, 1);
}

async function load_shaders()
{
    var vertexShaderSource = await get_file("../src/_vert-shader-2d.glsl");
    var fragmentShaderSource = await get_file("../src/_frag-shader-2d.glsl");
    //var fragmentShaderSource = await get_file("./frag-shader-sea.glsl");
    main(vertexShaderSource, fragmentShaderSource);
}

load_shaders();
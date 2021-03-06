var TWO_PI = Math.PI * 2;

function main(vertexShaderSource, fragmentShaderSource)
{
    let [CANVAS_WIDTH, CANVAS_HEIGHT] = [160, 144];
    let RES_SCALE = 8;
    CANVAS_WIDTH *= RES_SCALE;
    CANVAS_HEIGHT *= RES_SCALE;

    
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
    var fragmentShader = createShader(gl,gl.FRAGMENT_SHADER,fragmentShaderSource);
    console.log("fragment shader succesfully created");
    var vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    console.log("vertex shader succesfully created");
    var program = createProgram(gl, vertexShader, fragmentShader);
    //webglUtils.resizeCanvasToDisplaySize(gl.canvas);

    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    gl.useProgram(program);

    ////////////////////////////////////////////////
    ////    END BOILERPLATE LAND                ////
    ////////////////////////////////////////////////

    //  make it a grid of tris
    var verts = [];
    let density = 100;
    density = ground.length;
    for(let yii = 0; yii < density; yii++)
    {
        for(let xii = 0; xii < density; xii++)
        {
            let x = xii / density - 0.5;
            let y = yii / density - 0.5;
            //let x = xii - density / 2;
            //let y = yii - density / 2;
            // z is random
            //let z = x * x + y * y;
            //let z = ground[yii][xii];
            let z = 0.0;
            z = ground[yii][xii];
            verts = verts.concat([x, y, z]);
        }
    }

    var vertex_colors = [];
    for(let ii=0; ii < (verts.length/3); ii++)
    {
        // random color
        vertex_colors.push(
            Math.random(),
            Math.random(),
            Math.random(),
        );
    }

    // populate your buffers
    var pos = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, pos);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verts), gl.STATIC_DRAW);

    var cols = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cols);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertex_colors), gl.STATIC_DRAW);

    attr_locs = {
        "pos": gl.getAttribLocation(program, "a_pos"),
    }

    gl.enableVertexAttribArray(attr_locs.pos);
    gl.bindBuffer(gl.ARRAY_BUFFER, pos);
    gl.vertexAttribPointer(
        attr_locs.pos,
        size=3,// 2 components per iteration
        type=gl.FLOAT,
        normalize=false,
        stride=0,// 0 = move forward size * sizeof(type) each iteration to get the next position
        offset=0// start at the beginning of the buffer
    );

    ////////////////////////////////////////////////
    ////    END BOILERPLATE LAND  2             ////
    ////////////////////////////////////////////////
    // get mouse position from canvas using callback
    var mouse_pos = [0, 0];
    canvas.addEventListener("mousemove", function(event) {
        mouse_pos = [event.clientX, event.clientY];
    });

    function draw()
    {
        let m = {
            x: mouse_pos[0] / CANVAS_WIDTH,
            y: mouse_pos[1] / CANVAS_HEIGHT,
        };

        let dims = [CANVAS_WIDTH, CANVAS_HEIGHT];
        var dims_loc = gl.getUniformLocation(program, "dims");
        gl.uniform2fv(dims_loc, dims);

        let time = (new Date()).valueOf();
        var sec_freq = time / 1000.0;
        gl.uniform1f(gl.getUniformLocation(program, "t"), sec_freq % 1000.0);

        let freq = sec_freq * 0.3;

        var scale = 0.1 + (Math.cos(sec_freq*6)/2.0+0.5)*0.3;
        var scale = 1.2;
        scale = [scale, scale, scale];
        var scale_loc = gl.getUniformLocation(program, "sca");
        gl.uniform3fv(scale_loc, scale);

        var angle = freq % 1.0;
        angle = [0.35, 0.0, 0.0];
        //console.log(m);
        //var angle = 0;
        var angle_loc = gl.getUniformLocation(program, "rot");
        gl.uniform3fv(angle_loc, angle);

        var pos = [Math.sin(sec_freq*6), Math.cos(sec_freq*6), 1.0];
        pos = [0.0, 0.0, 0.0];
        var pos_loc = gl.getUniformLocation(program, "pos");
        gl.uniform3fv(pos_loc, pos);

        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT);

        // try to fix the OoR bug
        let num_points = verts.length / 3;
        //let index = time % num_points;
        //let num = 20;
        //if( (index + num) >= num_points)
        //{
        //    num = 0;
        //}
        
        //console.log(index);
        //gl.drawArrays(gl.LINE_STRIP, offset=time%num_points - (3*50), count=time%num_points);
        gl.drawArrays(gl.LINE_STRIP, offset=0, count=num_points);
        //gl.drawArrays(gl.POINTS, offset=0, count=num_points);
        //gl.drawArrays(gl.POINTS, offset=index, count=num);
    }
    setInterval(draw, 1);
}

async function load_shaders()
{
    var vertexShaderSource = await get_file("../src/_vert-shader.glsl");
    var fragmentShaderSource = await get_file("../src/_frag-shader.glsl");
    //var fragmentShaderSource = await get_file("./frag-shader-sea.glsl");
    main(vertexShaderSource, fragmentShaderSource);
}

load_shaders();
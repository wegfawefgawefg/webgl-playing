function main(vertexShaderSource, fragmentShaderSource)
{
    let [CANVAS_WIDTH, CANVAS_HEIGHT] = [160, 144];
    let RES_SCALE = 4;
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
    var verts_2d = [];
    let density = 10;
    for(let yii = 0; yii < density; yii++)
    {
        let row = [];
        for(let xii = 0; xii < density; xii++)
        {
            let x = xii / density - 0.5;
            let y = yii / density - 0.5;
            let z = 0.0;
            row.push([x,y,z]);
        }
        verts_2d.push(row);
    }

    console.log(verts_2d);

    
    var verts = [];
    for(let yii = 0; yii < density; yii++)
    {
        for(let xii = 0; xii < density; xii++)
        {
            let x = verts_2d[yii][xii][0];
            let y = verts_2d[yii][xii][1];
            let z = verts_2d[yii][xii][2];
            verts.push(x,y,z);
        }
    }
    console.log(verts);

    var mesh = [];
    for(let yii = 0; yii < density-1; yii++)
    {
        for(let xii = 0; xii < density-1; xii++)
        {
            // first triangle of quad
            mesh.push(verts_2d[yii][xii][0], verts_2d[yii][xii][1], verts_2d[yii][xii][2]);
            mesh.push(verts_2d[yii][xii+1][0], verts_2d[yii][xii+1][1], verts_2d[yii][xii+1][2]);
            mesh.push(verts_2d[yii+1][xii][0], verts_2d[yii+1][xii][1], verts_2d[yii+1][xii][2]);
            // second triangle of quad
            mesh.push(verts_2d[yii][xii+1][0], verts_2d[yii][xii+1][1], verts_2d[yii][xii+1][2]);
            mesh.push(verts_2d[yii+1][xii+1][0], verts_2d[yii+1][xii+1][1], verts_2d[yii+1][xii+1][2]);
            mesh.push(verts_2d[yii+1][xii][0], verts_2d[yii+1][xii][1], verts_2d[yii+1][xii][2]);
        }
    }

    var pos = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, pos);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(mesh), gl.STATIC_DRAW);

    
    var pos_attrloc = gl.getAttribLocation(program, "a_pos");
    gl.enableVertexAttribArray(pos_attrloc);
    gl.bindBuffer(gl.ARRAY_BUFFER, pos);
    gl.vertexAttribPointer(pos_attrloc,
        size=3,// 2 components per iteration
        type=gl.FLOAT,
        normalize=false,
        stride=0,// 0 = move forward size * sizeof(type) each iteration to get the next position
        offset=0// start at the beginning of the buffer
        );
        
    ////////////////////////////////////////////////
    ////    END BOILERPLATE LAND  2             ////
    ////////////////////////////////////////////////
    var dims_loc = gl.getUniformLocation(program, "dims");
    var scale_loc = gl.getUniformLocation(program, "sca");
    var pos_loc = gl.getUniformLocation(program, "pos");
    var angle_loc = gl.getUniformLocation(program, "rot");
    
    function draw()
    {
        let dims = [CANVAS_WIDTH, CANVAS_HEIGHT];
        gl.uniform2fv(dims_loc, dims);

        let time = (new Date()).valueOf();
        var sec_freq = time / 1000.0;
        let freq = sec_freq * 0.3;

        var scale = 0.1 + (Math.cos(sec_freq*6)/2.0+0.5)*0.3;
        var scale = 0.7;
        scale = [scale, scale, scale];
        gl.uniform3fv(scale_loc, scale);

        var angle = freq % 1.0;
        angle = [angle, angle, 0];
        //var angle = 0;
        gl.uniform3fv(angle_loc, angle);

        var pos = [0.0, 0.0, 0.1 + (Math.cos(sec_freq*6)/2.0+0.5)*0.9];
        gl.uniform3fv(pos_loc, pos);

        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT);

        //let num_points = verts.length / 3;
        //gl.drawArrays(gl.POINTS, offset=0, count=num_points);

        let num_verts = mesh.length / 3;
        gl.drawArrays(gl.TRIANGLES, offset=0, count=num_verts);
        //gl.drawArrays(gl.LINE_STRIP, offset=0, count=num_points);
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
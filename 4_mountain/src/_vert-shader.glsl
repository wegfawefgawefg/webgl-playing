precision mediump float;

attribute vec4 a_pos;

varying vec4 v_col;

uniform float t;
uniform vec3 sca;
uniform vec3 rot;
uniform vec3 pos;

const float PI = 3.1415926535897932384626433832795;
const float TWO_PI = PI * 2.0;

const mat4 projection = mat4(
    vec4(3.0/4.0, 0.0, 0.0, 0.0),
    vec4(    0.0, 1.0, 0.0, 0.0),
    vec4(    0.0, 0.0, 0.5, 0.5),
    vec4(    0.0, 0.0, 0.0, 1.0)
);

mat4 Scale(float x, float y, float z){
    return mat4(
        vec4(x,   0.0, 0.0, 0.0),
        vec4(0.0, y,   0.0, 0.0),
        vec4(0.0, 0.0, z,   0.0),
        vec4(0.0, 0.0, 0.0, 1.0)
    );
}

mat4 Translate(float x, float y, float z){
    return mat4(
        vec4(1.0, 0.0, 0.0, 0.0),
        vec4(0.0, 1.0, 0.0, 0.0),
        vec4(0.0, 0.0, 1.0, 0.0),
        vec4(x,   y,   z,   1.0)
    );
}

mat4 RotateX(float phi){
    return mat4(
        vec4(1.,0.,0.,0),
        vec4(0.,cos(phi),-sin(phi),0.),
        vec4(0.,sin(phi),cos(phi),0.),
        vec4(0.,0.,0.,1.));
}

mat4 RotateY(float theta){
    return mat4(
        vec4(cos(theta),0.,-sin(theta),0),
        vec4(0.,1.,0.,0.),
        vec4(sin(theta),0.,cos(theta),0.),
        vec4(0.,0.,0.,1.));
}

mat4 RotateZ(float psi){
    return mat4(
        vec4(cos(psi),-sin(psi),0.,0),
        vec4(sin(psi),cos(psi),0.,0.),
        vec4(0.,0.,1.,0.),
        vec4(0.,0.,0.,1.));
}

void main() {
    vec4 p = a_pos;
    p.z *= 0.02;

    float shore_h = 0.1;
    float sea_h = shore_h - 0.015;

    const float SHORE_FREQ = 100.0;
    const float SHORE_MAG = 0.05;
    const float SHORE_TIME = 20.0;
    float shore_surface = 
        sin((p.x*SHORE_FREQ + t*SHORE_TIME)) * SHORE_MAG *
        cos((p.y*SHORE_FREQ + t*SHORE_TIME)) * SHORE_MAG;

    const float SEA_FREQ = 20.0;
    const float SEA_MAG = 0.1;
    const float SEA_TIME = 0.5;
    float sea_surface = 
        sin((p.x*SEA_FREQ + t*SEA_TIME)) * SEA_MAG *
        cos((p.y*SEA_FREQ + t*SEA_TIME)) * SEA_MAG;

    float is_shore  = float(p.z < shore_h);
    float is_sea    = float(p.z < sea_h);

    p.z = mix(p.z, shore_h + shore_surface, is_shore);
    p.z = mix(p.z, shore_h + sea_surface, is_sea);

    //const vec4 grass_col = vec4(0.6,0.851,0.549, 1.0);
    const vec4 grass_col = vec4(0.463,0.784,0.576, 1.0);
    const vec4 shore_col = vec4(0.086,0.541,0.678, 1.0);
    const vec4 sea_col = vec4(0.094,0.306,0.467, 1.0);

    vec4 col = grass_col;
    col = mix(col, shore_col, is_shore);
    col = mix(col, sea_col, is_sea);
    v_col = col;

    gl_Position = 
        projection * 
        Translate(pos.x, pos.y, pos.z) * 
        //Translate(0.0, 0.0, 0.0) * 
        RotateZ(rot.z * TWO_PI) * 
        RotateX(rot.x * TWO_PI) * 
        RotateY(rot.y * TWO_PI) * 
        RotateZ(1.5+t*0.05) *
        Scale(sca.x, sca.y, sca.z) * 
        p *
        vec4(1.0, 1.0, 1.0, 1.0);
        ;

    //gl_Position *= vec4(1.0, -1.0, 1.0, 1.0);
    //gl_Position += vec4(-1.0, 1.0, 0.0, 0.0);
    //gl_Position += vec4(0.5, -0.5, 0, 0);
    //gl_Position += vec4(pos, 0, 0);

    gl_PointSize = 2.0;
    

}

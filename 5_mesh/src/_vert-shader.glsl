precision mediump float;

attribute vec4 a_pos;

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
    p.z = p.x * p.x + p.y * p.y - 0.5;
    gl_Position = projection * 
        Translate(pos.x, pos.y, 0.0) * 
        //Translate(0.0, 0.0, 0.0) * 
        RotateZ(rot.z * TWO_PI) * 
        RotateX(rot.x * TWO_PI) * 
        RotateY(rot.y * TWO_PI) * 
        Scale(sca.x, sca.y, sca.z) * 
        p * 
        vec4(1.0, 1.0, 1.0, 1.0);
        ;

    //gl_Position *= vec4(1.0, -1.0, 1.0, 1.0);
    //gl_Position += vec4(-1.0, 1.0, 0.0, 0.0);
    //gl_Position += vec4(0.5, -0.5, 0, 0);
    //gl_Position += vec4(pos, 0, 0);

    //gl_PointSize = 2.0;
}

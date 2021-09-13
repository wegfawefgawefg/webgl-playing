precision mediump float;
attribute vec4 a_pos;
uniform float angle;
uniform float scale;
uniform vec2 pos;

mat2 rotate2d(float _angle){
    return mat2(cos(_angle),-sin(_angle),
                sin(_angle),cos(_angle));
}

mat4 rotationMatrix(vec3 axis, float angle)
{
    axis = normalize(axis);
    float s = sin(angle);
    float c = cos(angle);
    float oc = 1.0 - c;
    
    return mat4(oc * axis.x * axis.x + c,           oc * axis.x * axis.y - axis.z * s,  oc * axis.z * axis.x + axis.y * s,  0.0,
                oc * axis.x * axis.y + axis.z * s,  oc * axis.y * axis.y + c,           oc * axis.y * axis.z - axis.x * s,  0.0,
                oc * axis.z * axis.x - axis.y * s,  oc * axis.y * axis.z + axis.x * s,  oc * axis.z * axis.z + c,           0.0,
                0.0,                                0.0,                                0.0,                                1.0);
}
mat4 rot(float angle)
{
    return rotationMatrix(vec3(0, 0, 1), angle);
}

mat4 scaleMatrix(float scale){
    return mat4(
        scale,  0.0,    0.0,    0.0,
        0.0,    scale,  0.0,    0.0,
        0.0,    0.0,    scale,  0.0,
        0.0,    0.0,    0.0,    1.0
    );
}

void main() {
    gl_Position = a_pos * scaleMatrix(scale);
    gl_Position -= vec4(scale/2.0, scale/2.0, 0.0, 0.0);

    gl_Position *= rot(angle);
    gl_Position += vec4(pos, 0.0, 0.0);

    //  set view to (0.0, 0.0) to (1.0, 1.0)
    gl_Position *= scaleMatrix(2.0);
    gl_Position *= vec4(1.0, -1.0, 1.0, 1.0);
    gl_Position += vec4(-1.0, 1.0, 0.0, 0.0);
}

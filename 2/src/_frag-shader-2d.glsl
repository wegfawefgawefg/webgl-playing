precision mediump float;
uniform float angle;
uniform vec2 dims;

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

void main() {
    //gl_FragColor = vec4(1, 0, 0.5, 1.0); // return reddish-purple
    vec2 coord = gl_FragCoord.xy / dims;

    vec2 center = vec2(0.5, 0.5);
    vec3 col = vec3(distance(center, coord)*1.5);

    gl_FragColor = vec4(col, 1.0);
}

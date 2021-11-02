precision mediump float;
uniform vec2 dims;

void main() {
    //vec2 coord = gl_FragCoord.xy / dims;
    
    vec3 col = vec3(0, 0, 0);
    gl_FragColor = vec4(col, 1.0);
}

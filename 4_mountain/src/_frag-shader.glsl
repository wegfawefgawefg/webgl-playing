precision mediump float;

uniform vec2 dims;

varying vec4 v_col;

void main() {
    //vec2 coord = gl_FragCoord.xy / dims;
    //gl_FragColor = vec4(col, 1.0);
    //gl_FragColor = vec4(0, 0, 0, 1.0);
    gl_FragColor = v_col;
}

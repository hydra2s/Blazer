/**
 * Creates and compiles a shader.
 *
 * @param {!WebGLRenderingContext} gl The WebGL Context.
 * @param {string} shaderSource The GLSL source code for the shader.
 * @param {number} shaderType The type of shader, VERTEX_SHADER or
 *     FRAGMENT_SHADER.
 * @return {!WebGLShader} The shader.
 */
function compileShader(gl, shaderSource, shaderType) {
    // Create the shader object
    var shader = gl.createShader(shaderType);
   
    // Set the shader source code.
    gl.shaderSource(shader, shaderSource);
   
    // Compile the shader
    gl.compileShader(shader);
   
    // Check if it compiled
    var success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if (!success) {
      // Something went wrong during compilation; get the error
      throw ("could not compile shader:" + gl.getShaderInfoLog(shader));
    }
   
    return shader;
  }

  /**
 * Creates a program from 2 shaders.
 *
 * @param {!WebGLRenderingContext) gl The WebGL context.
 * @param {!WebGLShader} vertexShader A vertex shader.
  * @param {!WebGLShader} fragmentShader A fragment shader.
  * @return {!WebGLProgram} A program.
  */
 function createProgram(gl, vertexShader, fragmentShader) {
   // create a program.
   var program = gl.createProgram();
  
   // attach the shaders.
   gl.attachShader(program, vertexShader);
   gl.attachShader(program, fragmentShader);
  
   // link the program.
   gl.linkProgram(program);
  
   // Check if it linked.
   var success = gl.getProgramParameter(program, gl.LINK_STATUS);
   if (!success) {
       // something went wrong with the link; get the error
       throw ("program failed to link:" + gl.getProgramInfoLog(program));
   }
  
   return program;
 };

export class GDI {
    constructor() {
        this.canvas = new OffscreenCanvas(2, 2);
        this.gl = this.canvas.getContext("webgl2", {
            //premultipliedAlpha: false,
            preserveDrawingBuffer: true,
            alpha: true,
            depth: false,
            precision: "highp",
            antialias: false,
            powerPreference: "high-performance",
            desynchronized: true, 
            willReadFrequently: true,
            colorSpace: "srgb",
            colorType: "float16",
            storageFormat: "float16",
            pixelFormat: "float16"
        });
        this.gl.colorSpace = "srgb";
        this.gl.drawingBufferColorSpace = "srgb";
        this.gl.unpackColorSpace = "srgb";

        //
        if (this.gl.drawingBufferStorage) {
            try {
                this.gl.drawingBufferStorage(this.gl.RGBA16F, this.canvas.width, this.canvas.height);
            } catch(e) {
                this.gl.drawingBufferStorage(this.gl.SRGB8_ALPHA8, this.canvas.width, this.canvas.height);
            }
        }

        //
        this.gl.clearColor(0, 0, 0, 0);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
        
        //this.gl.pixelStorei(this.gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);
        //this.gl.colorMask(true, true, true, true);
        this.gl.disable(this.gl.BLEND);
        this.gl.disable(this.gl.CULL_FACE);
        this.gl.disable(this.gl.DEPTH_TEST);
        this.gl.bindVertexArray(this.gl.createVertexArray());
    }

    image(image) {
        this.resize(image.width, image.height);
        this.gl.viewport(0, 0, image.width, image.height);

        // Now that the image has loaded make copy it to the texture.
        let texture = this.gl.createTexture();
        this.gl.activeTexture(this.gl.TEXTURE0 + 0);
        this.gl.bindTexture(this.gl.TEXTURE_2D, texture);

        // Set the parameters so we can render any size image.
        this.u16 = this.gl.getExtension("EXT_texture_norm16");
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.NEAREST);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.NEAREST);
        this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.u16 ? this.u16.R16_EXT : this.gl.R32F, this.gl.RED, this.u16 ? this.gl.UNSIGNED_SHORT : this.gl.FLOAT, image);
        console.log("Using an WebGL fallback...");

        //return texture;
        return this;
    }

    gen(func) {
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
        this.gl.useProgram(func);
        this.gl.drawArrays(this.gl.TRIANGLE_FAN, 0, 4);
        return createImageBitmap(this.canvas, {
            colorSpaceConversion: "none",
            resizeQuality: "pixelated"
        });
    }

    resize(width, height) {
        this.canvas.width = width;
        this.canvas.height = height;
    }

    func($math) {
        return createProgram(this.gl, 
            compileShader(this.gl, `#version 300 es
            precision highp float;
 
            void main() {
                const vec2 _vertex_[4] = vec2[4](
                    vec2(-1.f, -1.f),
                    vec2( 1.f, -1.f),
                    vec2( 1.f,  1.f),
                    vec2(-1.f,  1.f)
                );

               gl_Position = vec4(_vertex_[gl_VertexID], 0.f, 1.f);
            }
        `, this.gl.VERTEX_SHADER), 
            compileShader(this.gl, `#version 300 es
            precision highp float;

            uniform sampler2D _image_;
            out vec4 fragColor;

            void main() {
                 vec4 _color_ = texelFetch(_image_, ivec2(gl_FragCoord.x, textureSize(_image_, 0).y - int(gl_FragCoord.y) - 1), 0);
                 float R = _color_.r, G = _color_.g, B = _color_.b, A = _color_.a;
                fragColor = vec4(${$math[0]}, ${$math[1]}, ${$math[2]}, ${$math[3]});
            }
        
        `, this.gl.FRAGMENT_SHADER));
    }
}

GDI.const = (C)=> `${C}`;
GDI.div = (a,b)=> `(${a}/${b})`;
GDI.add = (a,b)=> `(${a}+${b})`;
GDI.sub = (a,b)=> `(${a}-${b})`;
GDI.mul = (a,b)=> `(${a}*${b})`;
GDI.R = ()=> `R`;
GDI.G = ()=> `G`;
GDI.B = ()=> `B`;
GDI.A = ()=> `A`;

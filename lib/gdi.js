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
            premultipliedAlpha: false,
            preserveDrawingBuffer: true,
            alpha: true,
            depth: false,
            precision: "highp",
            antialias: false,
            powerPreference: "high-performance",
            desynchronized: true, 
            willReadFrequently: true,
            colorSpace: "srgb",

            //
            colorEncoding: "float16",
            colorType: "float16",
            storageFormat: "float16",
            pixelFormat: "float16",
            dataType: "float16"
        });

        // 
        this.gl.colorSpace = "srgb";
        this.gl.drawingBufferColorSpace = "srgb";
        this.gl.unpackColorSpace = "srgb";

        // not working...
        this.u16 = this.gl.getExtension("EXT_texture_norm16");
        
        //
        this.f32 = this.gl.getExtension("EXT_color_buffer_float");
        this.f16 = this.gl.getExtension("EXT_color_buffer_half_float");

        //
        //if (this.gl.drawingBufferStorage)
        if (this.gl.drawingBufferStorage) {
            this.gl.drawingBufferStorage(this.gl.RGBA16F, this.canvas.width, this.canvas.height);
            //this.gl.drawingBufferStorage(this.gl.RGBA16UI, this.canvas.width, this.canvas.height);
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

        //
        this.is16bitRGB = false;
        this.is16bitA = false;
    }

    image(image, index = 0, is16bit = false) {
        if (index == 0) {
            this.resize(image.width, image.height);
            this.gl.viewport(0, 0, image.width, image.height);
        }

        // Now that the image has loaded make copy it to the texture.
        let texture = this.gl.createTexture();
        this.gl.activeTexture(this.gl.TEXTURE0 + index);
        this.gl.bindTexture(this.gl.TEXTURE_2D, texture);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.NEAREST);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.NEAREST);

        // TODO: better integer support!
        const u16 = is16bit;
        if (index == 0) {
            this.is16bitRGB = is16bit;
            this.gl.texImage2D(this.gl.TEXTURE_2D, 0, u16 ? this.gl.RGB16UI : this.gl.RGB8UI, this.gl.RGB_INTEGER, u16 ? this.gl.UNSIGNED_SHORT : this.gl.UNSIGNED_BYTE, image);
        } else {
            this.is16bitA = is16bit;
            this.gl.texImage2D(this.gl.TEXTURE_2D, 0, u16 ? this.gl.R16UI : this.gl.R8UI, this.gl.RED_INTEGER, u16 ? this.gl.UNSIGNED_SHORT : this.gl.UNSIGNED_BYTE, image);
        }

        //return texture;
        return this;
    }

    gen(func) {
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
        this.gl.disable(this.gl.BLEND);
        this.gl.useProgram(func["_program_"]);
        this.gl.uniform1i(this.gl.getUniformLocation(func["_program_"], `_image0_`), 0);
        this.gl.uniform1i(this.gl.getUniformLocation(func["_program_"], `_image1_`), 1);
        this.gl.uniform1f(this.gl.getUniformLocation(func["_program_"], `_div0_`), this.is16bitRGB?(1.0/65535.0):(1.0/255.0));
        this.gl.uniform1f(this.gl.getUniformLocation(func["_program_"], `_div1_`), this.is16bitA?(1.0/65535.0):(1.0/255.0));
        this.gl.drawArrays(this.gl.TRIANGLE_FAN, 0, 4);
        /*return createImageBitmap(this.canvas, {
            colorSpaceConversion: "none",
            resizeQuality: "pixelated"
        });*/
        return this;
    }

    resize(width, height) {
        this.canvas.width = width;
        this.canvas.height = height;
    }

    func($math) {
        const _vertex_ = ()=>`#version 300 es
precision highp float;
precision highp int;

out vec2 texcoord;

void main() {
    const vec2 _vertex_[4] = vec2[4](
        vec2(-1.f, -1.f),
        vec2( 1.f, -1.f),
        vec2( 1.f,  1.f),
        vec2(-1.f,  1.f)
    );
    
    texcoord = vec2(_vertex_[gl_VertexID].x * 0.5 + 0.5, -_vertex_[gl_VertexID].y * 0.5f + 0.5f);
    gl_Position = vec4(_vertex_[gl_VertexID], 0.f, 1.f);
}
`;

        const _fragment_ = ()=>`#version 300 es
precision highp float;
precision highp int;
precision highp sampler2D;
precision highp usampler2D;

in vec2 texcoord;

uniform usampler2D _image0_;
uniform usampler2D _image1_;
out vec4 fragColor;

// Converts a color from linear light gamma to sRGB gamma
vec4 fromLinear(in vec4 linearRGB) {
    bvec4 cutoff = lessThan(linearRGB, vec4(0.0031308));
    vec4 higher = vec4(1.055)*pow(linearRGB, vec4(1.0/2.4)) - vec4(0.055);
    vec4 lower = linearRGB * vec4(12.92);
    return vec4(mix(higher, lower, cutoff).xyz, linearRGB.w);
}

// Converts a color from sRGB gamma to linear light gamma
vec4 toLinear(in vec4 sRGB) {
    bvec4 cutoff = lessThan(sRGB, vec4(0.04045));
    vec4 higher = pow((sRGB + vec4(0.055))/vec4(1.055), vec4(2.4));
    vec4 lower = sRGB/vec4(12.92);
    return vec4(mix(higher, lower, cutoff).xyz, sRGB.w);
}

//
uniform float _div0_;
uniform float _div1_;

//
void main() {
    uvec4 _color0_ = texture(_image0_, texcoord);
    uvec4 _color1_ = texture(_image1_, texcoord);
        float R0 = float(_color0_.r)*_div0_, G0 = float(_color0_.g)*_div0_, B0 = float(_color0_.b)*_div0_, A0 = float(_color0_.a)*_div0_;
        float R1 = float(_color1_.r)*_div1_, G1 = float(_color1_.g)*_div1_, B1 = float(_color1_.b)*_div1_, A1 = float(_color1_.a)*_div1_;

    //
    fragColor = vec4(${$math[0]}, ${$math[1]}, ${$math[2]}, ${$math[3]});
}

`

        return {
            ["_program_"] : createProgram(this.gl, compileShader(this.gl, _vertex_(), this.gl.VERTEX_SHADER), compileShader(this.gl, _fragment_(), this.gl.FRAGMENT_SHADER)),
        };
    }

    // TODO: using pngjs3 for 16-bit colors
    getImageData(x, y, width, height, options = {}) {
        const pixels = options.storage || new Uint16Array(this.canvas.width * this.canvas.height);
        this.gl.readPixels(x, y, width, height, this.gl.RGBA, this.gl.UNSIGNED_SHORT, pixels, 0);
        return pixels;
    }
}

GDI.const = (C)=> `${C}`;
GDI.div = (a,b)=> `(${a}/${b})`;
GDI.add = (a,b)=> `(${a}+${b})`;
GDI.sub = (a,b)=> `(${a}-${b})`;
GDI.mul = (a,b)=> `(${a}*${b})`;
GDI.R0 = ()=> `R0`;
GDI.G0 = ()=> `G0`;
GDI.B0 = ()=> `B0`;
GDI.A0 = ()=> `A0`;
GDI.R1 = ()=> `R1`;
GDI.G1 = ()=> `G1`;
GDI.B1 = ()=> `B1`;
GDI.A1 = ()=> `A1`;
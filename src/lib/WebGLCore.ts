/* eslint-disable require-jsdoc */
import TextureLoader from './TextureLoader'

export default class WebGLCore {
    private program: WebGLProgram

    private positionLocation: number
    private texcoordLocation: number

    protected gl: WebGL2RenderingContext

    protected matrixLocation: WebGLUniformLocation | null
    protected textureLocation: WebGLUniformLocation | null

    protected positionBuffer: WebGLBuffer | null
    protected texcoordBuffer: WebGLBuffer | null

    constructor(gl: WebGL2RenderingContext) {
        this.gl = gl

        const vsSource = `
        attribute vec4 a_position;
        attribute vec2 a_texcoord;
        uniform mat4 u_matrix;
        varying vec2 v_texcoord;
    
        void main() {
            gl_Position = u_matrix * a_position;
            v_texcoord = a_texcoord;
        }
        `
    
        const fsSource = `
        precision mediump float;
        varying vec2 v_texcoord;
        uniform sampler2D u_texture;
        
        void main() {
            gl_FragColor = texture2D(u_texture, v_texcoord);
        }
        `

        TextureLoader.loadTextures(this.gl)

        this.program = this.initShaderProgram(vsSource, fsSource)!

        this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height)
        this.gl.useProgram(this.program)

        this.gl.enable(this.gl.DEPTH_TEST)
        this.gl.enable(this.gl.SCISSOR_TEST)
        // this.gl.enable(this.gl.RASTERIZER_DISCARD)

        this.positionLocation = this.gl.getAttribLocation(
            this.program, 'a_position'
        )
        this.texcoordLocation = this.gl.getAttribLocation(
            this.program, 'a_texcoord'
        )
        this.matrixLocation = this.gl.getUniformLocation(
            this.program, 'u_matrix'
        )
        this.textureLocation = this.gl.getUniformLocation(
            this.program, 'u_texture'
        )

        this.positionBuffer = this.gl.createBuffer()
        this.texcoordBuffer = this.gl.createBuffer()
        
        TextureLoader.loadTextures(this.gl)
    }

    protected updateWebGL(): void {
        let size, type, normalize, stride, offset

        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT)
        this.gl.enableVertexAttribArray(this.positionLocation)
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.positionBuffer)  

        size = 3
        type = this.gl.FLOAT
        normalize = false
        stride = 0
        offset = 0

        this.gl.vertexAttribPointer(
            this.positionLocation, size, type, normalize, stride, offset
        )

        this.gl.enableVertexAttribArray(this.texcoordLocation)
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.texcoordBuffer)

        size = 2
        type = this.gl.FLOAT
        normalize = false
        stride = 0
        offset = 0

        this.gl.vertexAttribPointer(
            this.texcoordLocation,
            size,
            type,
            normalize,
            stride,
            offset
        )
    }

    public setGeometry(
        positions: Float32Array
    ): void {
        this.gl.bufferData(
            this.gl.ARRAY_BUFFER, positions, this.gl.STATIC_DRAW
        )
    }

    protected setTexcoords(count: number): void {
        const texturePositions = [
            0, 0,
            0, 1,
            1, 0,
            0, 1,
            1, 1,
            1, 0,
        ]

        const positionsArray = new Float32Array(Array.from(
            { length: count },
            () => texturePositions
        ).flat())

        this.gl.bufferData(
            this.gl.ARRAY_BUFFER,
            positionsArray,
            this.gl.STATIC_DRAW
        )
    }

    private loadShader(type: number, source: string): WebGLShader | null {
        const shader = this.gl.createShader(type)!

        this.gl.shaderSource(shader, source)
        this.gl.compileShader(shader)

        if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
            this.gl.deleteShader(shader)
            return null
        }

        return shader
    }

    private initShaderProgram(
        vsSource: string, fsSource: string
    ): WebGLProgram | null {
        const vertexShader = this.loadShader(
            this.gl.VERTEX_SHADER, vsSource
        )!
        const fragmentShader = this.loadShader(
            this.gl.FRAGMENT_SHADER, fsSource
        )!
        const shaderProgram = this.gl.createProgram()!
        
        this.gl.attachShader(shaderProgram, vertexShader)
        this.gl.attachShader(shaderProgram, fragmentShader)
        this.gl.linkProgram(shaderProgram)

        if (!this.gl.getProgramParameter(shaderProgram, this.gl.LINK_STATUS)) {
            return null
        }

        return shaderProgram
    }
}

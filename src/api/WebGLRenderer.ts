/* eslint-disable require-jsdoc */
import Config from '../components/Config'
import Cube from './Cube'
import { mat4GL } from './mat4GL'

import wall1 from '../img/textures/wall1.png'

export default class WebGLRenderer {
    private cube: Cube

    private program: WebGLProgram
    private gl: WebGLRenderingContext

    private cameraMatrix = mat4GL.translation(
        [1, -Config.engine.playerHeight, 4.4]
    )

    private positionLocation: number
    private texcoordLocation: number

    private matrixLocation: WebGLUniformLocation | null
    private textureLocation: WebGLUniformLocation | null

    private positionBuffer: WebGLBuffer | null
    private texcoordBuffer: WebGLBuffer | null

    public cameraTranslateX = 0
    public cameraTranslateZ = 0
    public cameraRotationY = 0

    public fov = Math.PI / 3
    public aspect: number
    public zNear = 1
    public zFar = 100

    constructor(gl: WebGLRenderingContext) {
        this.gl = gl
        this.aspect = gl.canvas.width / gl.canvas.height

        this.cube = new Cube(2)

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
    
        this.program = this.initShaderProgram(vsSource, fsSource)!

        this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height)
        this.gl.enable(this.gl.DEPTH_TEST)
        this.gl.useProgram(this.program)

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
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.positionBuffer)
        this.setGeometry(this.cube.positions)

        this.texcoordBuffer = this.gl.createBuffer()
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.texcoordBuffer)
        this.setTexcoords()

        this.loadTextures()
    }

    private loadTextures() {
        const texture = this.gl.createTexture()
        this.gl.bindTexture(this.gl.TEXTURE_2D, texture)

        this.gl.texImage2D(
            this.gl.TEXTURE_2D,
            0,
            this.gl.RGBA,
            1, 1,
            0,
            this.gl.RGBA,
            this.gl.UNSIGNED_BYTE,
            new Uint8Array([0, 0, 0, 255])
        )

        const img = new Image()
        img.crossOrigin = ''
        img.src = wall1
        img.width = 64
        img.height = 64
        img.onload = () => {
            this.gl.bindTexture(this.gl.TEXTURE_2D, texture)
            this.gl.texImage2D(
                this.gl.TEXTURE_2D,
                0,
                this.gl.RGBA,
                this.gl.RGBA,
                this.gl.UNSIGNED_BYTE,
                img
            )
            this.gl.generateMipmap(this.gl.TEXTURE_2D)
        }
    }

    // public render(): void { }

    public update(): void {
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

        const numFs = 8
        const radius = 3

        const projectionMatrix = mat4GL.perspective(
            this.fov, this.aspect, this.zNear, this.zFar
        )

        const xTranslation = 
            Config.game.strafeLeft || Config.game.strafeRight
                ? (
                    + Config.game.strafeRight -
                    + Config.game.strafeLeft
                ) * (0.1 + (+ Config.game.isRunning) * 0.2)
                : 0

        const zTranslation = 
            Config.game.moveForward || Config.game.moveBackward
                ? (
                    + Config.game.moveBackward -
                    + Config.game.moveForward
                ) * (0.1 + (+ Config.game.isRunning) * 0.2)
                : 0

        const yRotation = 
            Config.game.rotateLeft || Config.game.rotateRight
                ? (
                    + Config.game.rotateLeft -
                    + Config.game.rotateRight
                ) * Math.PI / 72 * (1 + +Config.game.isRunning)
                : 0

        this.cameraMatrix = mat4GL.translate(
            this.cameraMatrix,
            [xTranslation, 0, zTranslation]
        )

        this.cameraMatrix = mat4GL.yRotate(
            this.cameraMatrix,
            yRotation
        )

        this.cameraTranslateX += xTranslation
        this.cameraTranslateZ += zTranslation
        this.cameraRotationY += yRotation

        const viewMatrix = mat4GL.inverse(this.cameraMatrix)

        const viewProjectionMatrix = mat4GL.multiply(
            projectionMatrix, viewMatrix
        )

        for (let ii = 0; ii < numFs; ++ii) {
            const angle = ii * Math.PI * 2 / numFs
            const x = Math.cos(angle) * radius
            const z = Math.sin(angle) * radius

            const matrix = mat4GL.translate(viewProjectionMatrix, [x, 0, z])

            this.gl.uniformMatrix4fv(this.matrixLocation, false, matrix)

            const offset = 0
            const count = 36
            this.gl.uniform1i(this.textureLocation, 0)
            this.gl.drawArrays(this.gl.TRIANGLES, offset, count)
        }
    }

    private setGeometry(positions: Float32Array): void {
        const matrix = mat4GL.xRotation(Math.PI)
    
        for (let ii = 0; ii < positions.length; ii += 3) {
            const vector = mat4GL.vectorMultiply(
                [
                    positions[ii + 0],
                    positions[ii + 1],
                    positions[ii + 2],
                    1
                ],
                matrix
            )
            positions[ii + 0] = vector[0]
            positions[ii + 1] = vector[1]
            positions[ii + 2] = vector[2]
        }

        this.gl.bufferData(
            this.gl.ARRAY_BUFFER, positions, this.gl.STATIC_DRAW
        )
    }

    private setTexcoords(): void {
        this.gl.bufferData(
            this.gl.ARRAY_BUFFER,
            new Float32Array([
                0, 0,
                0, 1,
                1, 0,
                0, 1,
                1, 1,
                1, 0,
    
                0, 0,
                0, 1,
                1, 0,
                0, 1,
                1, 1,
                1, 0,
    
                0, 0,
                0, 1,
                1, 0,
                0, 1,
                1, 1,
                1, 0,
    
                0, 0,
                0, 1,
                1, 0,
                0, 1,
                1, 1,
                1, 0,
    
                0, 0,
                0, 1,
                1, 0,
                0, 1,
                1, 1,
                1, 0,
    
                0, 0,
                0, 1,
                1, 0,
                0, 1,
                1, 1,
                1, 0,
            ]),
            this.gl.STATIC_DRAW)
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

/* eslint-disable require-jsdoc */
import Config from '../Config'
import {
    inverse,
    multiply,
    translation,
    translate
} from './mat4GL'

import { createProjectionMatrix } from './WebGLHelpers'
import WebGlColliders from './WebGLColliders'

import wall1 from '../img/textures/gray/01.png'
import wall2 from '../img/textures/gray/02.png'
import { mat4 } from '../@types/mat4GL'

export default class WebGLCore {
    private program: WebGLProgram
    private gl: WebGLRenderingContext

    private positionLocation: number
    private texcoordLocation: number

    private matrixLocation: WebGLUniformLocation | null
    private textureLocation: WebGLUniformLocation | null

    private positionBuffer: WebGLBuffer | null
    private texcoordBuffer: WebGLBuffer | null

    private cameraMatrix = translation(
        [1, -Config.engine.playerHeight, 4.4]
    )

    public cameraTranslateX = 0
    public cameraTranslateZ = 0
    public cameraRotationY = 0

    private webGLColliders = new WebGlColliders()

    constructor(gl: WebGLRenderingContext) {
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

        this.texcoordBuffer = this.gl.createBuffer()

        this.loadTextures()
    }

    public render(viewProjectionMatrix: mat4): void {
        for (const i in this.webGLColliders.colliders) {
            const points =
                this.webGLColliders.colliders[i].getConstructionPoints
            const offset = 0
            const count = points.length / 3

            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.positionBuffer)
            this.setGeometry(
                this.webGLColliders.colliders[i].getConstructionPoints
            )

            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.texcoordBuffer)
            this.setTexcoords(count / 6)

            const x = parseInt(i) * 2
            const z = 0

            const matrix = translate(viewProjectionMatrix, [x, 0, z])
            this.webGLColliders.colliders[i].pos = [x, 0, z]

            this.gl.uniformMatrix4fv(this.matrixLocation, false, matrix)
            this.gl.uniform1i(this.textureLocation, 0)
            this.gl.drawArrays(this.gl.TRIANGLES, offset, count)
        }
    }

    public update(): void {
        this.updateWebGL()

        const projectionMatrix = createProjectionMatrix()
        const viewMatrix = inverse(this.cameraMatrix)

        const viewProjectionMatrix = multiply(
            projectionMatrix, viewMatrix
        )

        this.render(viewProjectionMatrix)

        this.cameraMatrix = this.webGLColliders.movePlayer(
            this.cameraMatrix,
            this.cameraRotationY
        )

        const temp = this.webGLColliders.rotatePlayer(
            this.cameraMatrix, this.cameraRotationY
        )

        this.cameraMatrix = temp[0]
        this.cameraRotationY = temp[1]
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

    private setTexcoords(count: number): void {
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
        
        img.crossOrigin = ''
        img.src = wall2
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

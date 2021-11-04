/* eslint-disable require-jsdoc */
import Config from '../Config'
import Cube from './Cube'
import { mat4GL } from '../../api/mat4GL'

import { mat4, vec3 } from '../../@types/mat4GL'

import wall1 from '../../img/textures/wall1.png'

export default class WebGLRenderer {
    private colliders: Cube[] = []

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

        this.colliders.push(new Cube(2))
        this.colliders.push(new Cube(2))

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
        this.setGeometry(this.colliders[0].getConstructionPoints)

        this.texcoordBuffer = this.gl.createBuffer()
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.texcoordBuffer)
        this.setTexcoords()

        this.loadTextures()
    }

    private renderWalls(viewProjectionMatrix: mat4): void {
        for (const i in this.colliders) {
            const x = parseInt(i) * 2
            const z = 0

            const matrix = mat4GL.translate(viewProjectionMatrix, [x, 0, z])
            this.colliders[i].setPos = [x, 0, z]

            this.gl.uniformMatrix4fv(this.matrixLocation, false, matrix)

            const offset = 0
            const count = 36
            this.gl.uniform1i(this.textureLocation, 0)
            this.gl.drawArrays(this.gl.TRIANGLES, offset, count)
        }
    }

    // TODO: coś się popsuło przy kolizjach przy tylnej ścianie
    public update(): void {
        this.updateWebGL()

        const projectionMatrix = mat4GL.perspective(
            this.fov, this.aspect, this.zNear, this.zFar
        )

        const viewMatrix = mat4GL.inverse(this.cameraMatrix)

        const viewProjectionMatrix = mat4GL.multiply(
            projectionMatrix, viewMatrix
        )

        this.renderWalls(viewProjectionMatrix)

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


        if (this.cameraRotationY > 2 * Math.PI) {
            this.cameraRotationY -= 2 * Math.PI
        } else if (this.cameraRotationY < 0) {
            this.cameraRotationY += 2 * Math.PI
        }

        const translation: vec3 = [xTranslation, 0, zTranslation]
        const pos = mat4GL.getMatrixPos(this.cameraMatrix)
        let rot = this.cameraRotationY
        let toRotate = false

        for (const i in this.colliders) {
            const obj = [
                this.colliders[i].getPos[0], 0, this.colliders[i].getPos[2]
            ]

            const case1 = (
                ((pos[0] <= obj[0] + 3.5 && pos[0] >= obj[0] + 2) ||
                (pos[0] >= obj[0] - 1.5 && pos[0] <= obj[0])) &&
                ((pos[2] <= obj[2]) && (pos[2] >= obj[2] - 2))
            )

            const case2 = (
                ((pos[2] <= obj[2] + 1.5 && pos[2] >= obj[2]) ||
                (pos[2] >= obj[2] - 3.5) && pos[2] <= obj[2] - 2) &&
                ((pos[0] >= obj[0]) && (pos[0] <= obj[0] + 2))
            )

            if (rot > 0 && rot < Math.PI / 2) {
                rot = (case2 ? Math.PI / 2 : 0) - rot
            } else if (rot > Math.PI / 2 && rot < Math.PI) {
                rot = (case2 ? Math.PI / 2 : Math.PI) - rot
            } else if (rot > Math.PI && rot < 3 / 2 * Math.PI) {
                rot = (case2 ? Math.PI / 2 : 0) + Math.PI - rot
            } else if (rot > 3 / 2 * Math.PI && rot < 2 * Math.PI) {
                rot = (case2 ? 3 * Math.PI / 2 : 0) - rot
            }

            if (case1) {
                if ((pos[0] <= obj[0] + 2) && (pos[0] >= obj[0] - 1.5)) {
                    this.cameraMatrix = mat4GL.translation([
                        obj[0] - 1.5,
                        -Config.engine.playerHeight,
                        pos[2]
                    ])
                } else if (
                    (pos[0] <= obj[0] + 3.5) && (pos[0] >= obj[0] + 2)
                ) {
                    this.cameraMatrix = mat4GL.translation([
                        obj[0] + 3.5,
                        -Config.engine.playerHeight,
                        pos[2]
                    ])
                }

                if ((pos[0] >= obj[0] - 1.5) && (pos[0] <= obj[0] + 3.5)) {
                    this.cameraMatrix = mat4GL.yRotate(
                        this.cameraMatrix, this.cameraRotationY
                    )
                }
    
                if ((pos[0] === obj[0] + 3.5) || (pos[2] === obj[0] - 1.5)) {
                    this.cameraMatrix = mat4GL.yRotate(
                        this.cameraMatrix,
                        rot
                    )

                    toRotate = true
                }
                break
            } else if (case2) {
                if ((pos[2] >= obj[2] - 2) && (pos[2] <= obj[2] + 1.5)) {
                    this.cameraMatrix = mat4GL.translation([
                        pos[0],
                        -Config.engine.playerHeight,
                        obj[2] + 1.5
                    ])
    
                    this.cameraMatrix = mat4GL.yRotate(
                        this.cameraMatrix, this.cameraRotationY
                    )
                } else if (
                    (pos[0] >= obj[0] - 3.5) && (pos[0] <= obj[0] - 2)
                ) {
                    this.cameraMatrix = mat4GL.translation([
                        pos[0],
                        -Config.engine.playerHeight,
                        obj[2] - 3.5,
                    ])
    
                    this.cameraMatrix = mat4GL.yRotate(
                        this.cameraMatrix, this.cameraRotationY
                    )
                }
    
                if ((pos[0] >= obj[0] - 1.5) && (pos[0] <= obj[0] + 3.5)) {
                    this.cameraMatrix = mat4GL.yRotate(
                        this.cameraMatrix, this.cameraRotationY
                    )
                }

                if ((pos[2] === obj[2] + 1.5) || (pos[2] === obj[2] - 3.5)) {
                    this.cameraMatrix = mat4GL.yRotate(
                        this.cameraMatrix,
                        rot
                    )

                    toRotate = true
                }
                break
            } 
        }

        this.cameraMatrix = mat4GL.translate(
            this.cameraMatrix,
            translation
        )

        if (toRotate) {
            this.cameraMatrix = mat4GL.yRotate(
                this.cameraMatrix,
                -rot
            )
        }

        this.cameraRotationY += yRotation

        this.cameraMatrix = mat4GL.yRotate(
            this.cameraMatrix,
            yRotation
        )
    }

    private updateWebGL(): void {
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

/* eslint-disable require-jsdoc */
import Config from '../Config'
import {
    inverse,
    multiply,
    translation,
    translate,
    yRotate,
    getMatrixPos
} from '../lib/mat4GL'

import { createProjectionMatrix } from '../lib/WebGLHelpers'
import WebGlColliders from './WebGLColliders'
import TextureLoader from './TextureLoader'

import Plane from './primitives/Plane'
import Gate from './objects/Gate'

import MapLoader from './MapLoader'

import { mat4 } from '../@types/mat4GL'
export default class WebGLCore {
    private program: WebGLProgram
    private gl: WebGL2RenderingContext

    private positionLocation: number
    private texcoordLocation: number

    private matrixLocation: WebGLUniformLocation | null
    private textureLocation: WebGLUniformLocation | null

    private positionBuffer: WebGLBuffer | null
    private texcoordBuffer: WebGLBuffer | null

    private mapLoader = new MapLoader(Config.game.map)
    private webGLColliders = new WebGlColliders(this.mapLoader.map)
    private textureLoader: TextureLoader

    public cameraRotationY = this.mapLoader.playerStartingRot

    private cameraMatrix = yRotate(
        translation(this.mapLoader.playerStartingPos),
        this.cameraRotationY
    )

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
        
        this.textureLoader = new TextureLoader(this.gl)

        this.textureLoader.loadTextures()
    }

    public render(viewProjectionMatrix: mat4): void {
        const playerPos = getMatrixPos(this.cameraMatrix)

        for (const i in this.mapLoader.map) {
            if (
                Math.sqrt(
                    (playerPos[0] - this.mapLoader.map[i].pos[0]) ** 2 +
                    (playerPos[2] - this.mapLoader.map[i].pos[2]) ** 2
                ) <= Config.engine.viewRange * Config.engine.tileSize
            ) {
                const points =
                this.mapLoader.map[i].getConstructionPoints
                const offset = 0
                const count = points.length / 3

                this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.positionBuffer)
                this.setGeometry(
                    this.mapLoader.map[i].getConstructionPoints
                )

                this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.texcoordBuffer)
                this.setTexcoords(count / 6)

                let matrix = translate(
                    viewProjectionMatrix,
                    this.mapLoader.map[i].pos
                )

                // TODO: fujka! trzeba to uporządkować
                if (
                    this.mapLoader.map[i] instanceof Plane &&
                    !(this.mapLoader.map[i] instanceof Gate)
                ) {
                    if ((<Plane>this.mapLoader.map[i]).rotate) {
                        matrix = translate(
                            matrix,
                            [1, 0, 0]
                        )

                        matrix = yRotate(
                            matrix, Math.PI / 2
                        )
                    } else {
                        matrix = translate(
                            matrix,
                            [0, 0, -1]
                        )
                    }
                } else if (
                    (this.mapLoader.map[i] instanceof Gate)
                ) {
                    if ((<Gate>this.mapLoader.map[i]).mode === 0) {
                        if ((<Plane>this.mapLoader.map[i]).rotate) {
                            matrix = translate(
                                matrix,
                                [1, 0, 0]
                            )
        
                            matrix = yRotate(
                                matrix, Math.PI / 2
                            )
                        } else {
                            matrix = translate(
                                matrix,
                                [0, 0, -1]
                            )
                        }
                    } else {
                        if ((<Plane>this.mapLoader.map[i]).rotate) {
                            matrix = translate(
                                matrix,
                                [(
                                    (<Gate>this.mapLoader.map[i]).mode === 1
                                        ? 2
                                        : 0
                                ),
                                0,
                                0
                                ]
                            )
        
                            matrix = yRotate(
                                matrix, Math.PI / 2
                            )
                        } else {
                            matrix = translate(
                                matrix,
                                [
                                    0,
                                    0,
                                    ((<Gate>this.mapLoader.map[i]).mode === 1
                                        ? -2
                                        : 0
                                    )
                                ]
                            )
                        }
                    } 
                }

                this.gl.uniformMatrix4fv(this.matrixLocation, false, matrix)
                this.gl.uniform1i(this.textureLocation, 0)
                this.gl.drawArrays(this.gl.TRIANGLES, offset, count)
            }
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

        this.cameraMatrix = this.webGLColliders.collidePlayer(
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

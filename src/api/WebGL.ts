/* eslint-disable require-jsdoc */
import { mat4 } from 'gl-matrix'
import Cube from './Cube'

export default class WebGL {
    object: Cube
    gl: WebGLRenderingContext
    buffers: {
        position: WebGLBuffer | null;
        color: WebGLBuffer | null;
        indices: WebGLBuffer | null
    }[] = []
    programInfo: {
        program: WebGLProgram;
        attribLocations: {
            vertexPosition: number;
            vertexColor: number
        };
        uniformLocations: {
            projectionMatrix: WebGLUniformLocation;
            modelViewMatrix: WebGLUniformLocation
        }
    }

    constructor(gl: WebGLRenderingContext) {
        this.object = new Cube(2)

        this.gl = gl

        const vsSource = `
        attribute vec4 aVertexPosition;
        attribute vec4 aVertexColor;

        uniform mat4 uModelViewMatrix;
        uniform mat4 uProjectionMatrix;

        varying lowp vec4 vColor;

        void main(void) {
            gl_Position =
                uProjectionMatrix * uModelViewMatrix * aVertexPosition;
            vColor = aVertexColor;
        }
        `

        const fsSource = `
        varying lowp vec4 vColor;

        void main(void) {
            gl_FragColor = vColor;
        }
        `

        const shaderProgram = this.initShaderProgram(
            vsSource, fsSource
        )!

        this.programInfo = {
            program: shaderProgram,
            attribLocations: {
                vertexPosition: this.gl.getAttribLocation(
                    shaderProgram, 'aVertexPosition'
                ),
                vertexColor: this.gl.getAttribLocation (
                    shaderProgram, 'aVertexColor'
                ),
            },
            uniformLocations: {
                projectionMatrix: this.gl.getUniformLocation(
                    shaderProgram, 'uProjectionMatrix'
                )!,
                modelViewMatrix: this.gl.getUniformLocation(
                    shaderProgram, 'uModelViewMatrix'
                )!,
            }
        }

        this.buffers.push(this.initBuffers())
    }

    public render(): void {
        // this.object.setTranslation(0, 0, -6)
    }

    public update(): void {
        this.drawScene(this.programInfo, this.buffers[0])
    }

    private initBuffers() {
        let colors: number[] = []

        const positionBuffer = this.gl.createBuffer()

        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, positionBuffer)

        this.gl.bufferData(
            this.gl.ARRAY_BUFFER,
            new Float32Array(this.object.positions),
            this.gl.STATIC_DRAW
        )

        for (let j = 0; j < this.object.faceColors.length; ++j) {
            const c = this.object.faceColors[j]

            colors = colors.concat(c, c, c, c)
        }

        const colorBuffer = this.gl.createBuffer()
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, colorBuffer)
        this.gl.bufferData(
            this.gl.ARRAY_BUFFER, new Float32Array(colors), this.gl.STATIC_DRAW
        )

        const indexBuffer = this.gl.createBuffer()
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, indexBuffer)

        const indices = [
            0,  1,  2,      0,  2,  3,
            4,  5,  6,      4,  6,  7,
            8,  9,  10,     8,  10, 11,
            12, 13, 14,     12, 14, 15,
            16, 17, 18,     16, 18, 19,
            20, 21, 22,     20, 22, 23,
        ]

        this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER,
            new Uint16Array(indices), this.gl.STATIC_DRAW)

        return {
            position: positionBuffer,
            color: colorBuffer,
            indices: indexBuffer,
        }
    }

    private drawScene(
        programInfo: {
            attribLocations: { 
                vertexPosition: number;
                vertexColor: number
            };
            program: WebGLProgram | null;
            uniformLocations: {
                projectionMatrix: WebGLUniformLocation | null;
                modelViewMatrix: WebGLUniformLocation | null
            }
        },
        buffers: {
            position: WebGLBuffer | null;
            color: WebGLBuffer | null;
            indices: WebGLBuffer | null
        }
    ) {
        this.gl.clearColor(0.0, 0.0, 0.0, 1.0)
        this.gl.clearDepth(1.0)
        this.gl.enable(this.gl.DEPTH_TEST)
        this.gl.depthFunc(this.gl.LEQUAL)

        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT)

        const fieldOfView = 45 * Math.PI / 180
        const aspect = this.gl.canvas.clientWidth / this.gl.canvas.clientHeight
        const zNear = 0.1
        const zFar = 100.0
        const projectionMatrix = mat4.create()
        const modelViewMatrix = mat4.create()
    
        mat4.translate(
            modelViewMatrix,
            modelViewMatrix,
            [-0.0, 0.0, -6.0]
        )

        mat4.perspective(
            projectionMatrix,
            fieldOfView,
            aspect,
            zNear,
            zFar
        )

        {
            const numComponents = 3
            const type = this.gl.FLOAT
            const normalize = false
            const stride = 0
            const offset = 0
            this.gl.vertexAttribPointer(
                programInfo.attribLocations.vertexPosition,
                numComponents,
                type,
                normalize,
                stride,
                offset)
            this.gl.enableVertexAttribArray(
                programInfo.attribLocations.vertexPosition)
        }

        {
            const numComponents = 4
            const type = this.gl.FLOAT
            const normalize = false
            const stride = 0
            const offset = 0
            this.gl.vertexAttribPointer(
                programInfo.attribLocations.vertexColor,
                numComponents,
                type,
                normalize,
                stride,
                offset)
            this.gl.enableVertexAttribArray(
                programInfo.attribLocations.vertexColor)
        }

        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffers.position)
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffers.color)
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, buffers.indices)

        this.gl.useProgram(programInfo.program)

        this.gl.uniformMatrix4fv(
            programInfo.uniformLocations.projectionMatrix,
            false,
            projectionMatrix)
        this.gl.uniformMatrix4fv(
            programInfo.uniformLocations.modelViewMatrix,
            false,
            modelViewMatrix)

        {
            const vertexCount = 36
            const type = this.gl.UNSIGNED_SHORT
            const offset = 0
            this.gl.drawElements(this.gl.TRIANGLES, vertexCount, type, offset)
        }
    }

    private loadShader(
        type: number,
        source: string
    ) {
        const shader = this.gl.createShader(type)!

        this.gl.shaderSource(shader, source)

        this.gl.compileShader(shader)

        if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
            alert(
                'An error occurred compiling the shaders: ' +
                this.gl.getShaderInfoLog(shader)
            )
            this.gl.deleteShader(shader)
            return null
        }

        return shader
    }

    private initShaderProgram(
        vsSource: string,
        fsSource: string
    ): WebGLProgram | null {
        const vertexShader = this.loadShader(this.gl.VERTEX_SHADER, vsSource)!
        const fragmentShader = this.loadShader(
            this.gl.FRAGMENT_SHADER, fsSource
        )!

        const shaderProgram = this.gl.createProgram()!
        this.gl.attachShader(shaderProgram, vertexShader)
        this.gl.attachShader(shaderProgram, fragmentShader)
        this.gl.linkProgram(shaderProgram)

        if (!this.gl.getProgramParameter(shaderProgram, this.gl.LINK_STATUS)) {
            alert(
                'Unable to initialize the shader program: ' +
                this.gl.getProgramInfoLog(shaderProgram)
            )
            return null
        }

        return shaderProgram
    }
}

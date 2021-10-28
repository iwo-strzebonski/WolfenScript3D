/* eslint-disable require-jsdoc */
import { mat4 } from 'gl-matrix'

export default class Cube {
    private rotation: number
    private offset = {
        x: 0,
        y: 0,
        z: 0
    }

    public matrix = mat4.create() // modelViewMatrix
    public posList: number[]
    public faceColors: Array<number[]>

    constructor() {
        this.posList = [
            // Front face
            -1.0, -1.0,  1.0,
            1.0, -1.0,  1.0,
            1.0,  1.0,  1.0,
            -1.0,  1.0,  1.0,
    
            // Back face
            -1.0, -1.0, -1.0,
            -1.0,  1.0, -1.0,
            1.0,  1.0, -1.0,
            1.0, -1.0, -1.0,
    
            // Top face
            -1.0,  1.0, -1.0,
            -1.0,  1.0,  1.0,
            1.0,  1.0,  1.0,
            1.0,  1.0, -1.0,
    
            // Bottom face
            -1.0, -1.0, -1.0,
            1.0, -1.0, -1.0,
            1.0, -1.0,  1.0,
            -1.0, -1.0,  1.0,
    
            // Right face
            1.0, -1.0, -1.0,
            1.0,  1.0, -1.0,
            1.0,  1.0,  1.0,
            1.0, -1.0,  1.0,
    
            // Left face
            -1.0, -1.0, -1.0,
            -1.0, -1.0,  1.0,
            -1.0,  1.0,  1.0,
            -1.0,  1.0, -1.0,
        ]

        this.faceColors = [
            [1.0,  1.0,  1.0,  1.0],
            [1.0,  0.0,  0.0,  1.0],
            [0.0,  1.0,  0.0,  1.0],
            [0.0,  0.0,  1.0,  1.0],
            [1.0,  1.0,  0.0,  1.0],
            [1.0,  0.0,  1.0,  1.0],
        ]

        this.rotation = 0.0
    }

    public rotate(
        rotation: number, xAxis = 0, yAxis = 0, zAxis = 0
    ): void {
        this.rotation += rotation

        mat4.rotate(
            this.matrix,
            this.matrix,
            this.rotation,
            [xAxis, yAxis, zAxis]
        )
    }

    public setRotation(
        rotation = 0, xAxis = 0, yAxis = 0, zAxis = 0
    ): void {
        mat4.rotate(
            this.matrix,
            this.matrix,
            rotation - this.rotation,
            [xAxis, yAxis, zAxis]
        )

        this.rotation = rotation
    }
    

    public translate(offsetX = 0, offsetY = 0, offsetZ = 0): void {
        this.offset.x += offsetX
        this.offset.y += offsetY
        this.offset.z += offsetZ

        mat4.translate(
            this.matrix,
            this.matrix,
            [offsetX, offsetY, offsetZ]
        )
    }

    public setTranslation(offsetX = 0, offsetY = 0, offsetZ = 0): void {
        mat4.translate(
            this.matrix,
            this.matrix,
            [
                offsetX - this.offset.x,
                offsetY - this.offset.y,
                offsetZ - this.offset.z
            ]
        )

        this.offset.x = offsetX
        this.offset.y = offsetY
        this.offset.z = offsetZ
    }
}

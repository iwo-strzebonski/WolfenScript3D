/* eslint-disable require-jsdoc */

export default class Cube {
    public positions: number[]
    public faceColors: Array<number[]>
    public rotation: number

    constructor(size: number) {
        const k = size / 2

        this.positions = [
            // Front face
            -k, -k,  k,
            k, -k,  k,
            k,  k,  k,
            -k,  k,  k,
    
            // Back face
            -k, -k, -k,
            -k,  k, -k,
            k,  k, -k,
            k, -k, -k,
    
            // Top face
            -k,  k, -k,
            -k,  k,  k,
            k,  k,  k,
            k,  k, -k,
    
            // Bottom face
            -k, -k, -k,
            k, -k, -k,
            k, -k,  k,
            -k, -k,  k,
    
            // Right face
            k, -k, -k,
            k,  k, -k,
            k,  k,  k,
            k, -k,  k,
    
            // Left face
            -k, -k, -k,
            -k, -k,  k,
            -k,  k,  k,
            -k,  k, -k,
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
}

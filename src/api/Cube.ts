/* eslint-disable require-jsdoc */

export default class Cube {
    public positions: Float32Array

    constructor(size: number) {
        this.positions = new Float32Array([
            0, 0, 0,
            0, size, 0,
            size, 0, 0,
            0, size, 0,
            size, size, 0,
            size, 0, 0,
    
            0, 0, size,
            0, size, size,
            size, 0, size,
            0, size, size,
            size, size, size,
            size, 0, size,
    
            0, 0, 0,
            size, 0, 0,
            0, 0, size,
            size, 0, 0,
            size, 0, size,
            0, 0, size,
    
            0, size, 0,
            size, size, 0,
            0, size, size,
            size, size, 0,
            size, size, size,
            0, size, size,
    
            0, 0, 0,
            0, size, 0,
            0, 0, size,
            0, size, 0,
            0, size, size,
            0, 0, size,
    
            size, 0, 0,
            size, size, 0,
            size, 0, size,
            size, size, 0,
            size, size, size,
            size, 0, size
        ])
    }
}

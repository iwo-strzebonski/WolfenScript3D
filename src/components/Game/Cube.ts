/* eslint-disable require-jsdoc */
import { vec3 } from '../../@types/mat4GL'

export default class Cube {
    private positions: Float32Array
    private cubePos: vec3

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

        this.cubePos = [0, 0, 0]
    }

    public set setPos(pos: vec3) {
        this.cubePos = pos
    }

    public get getPos(): vec3 {
        return this.cubePos
    }

    public get getConstructionPoints(): Float32Array {
        return this.positions
    }
}

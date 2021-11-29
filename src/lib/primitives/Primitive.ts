/* eslint-disable require-jsdoc */
import {
    xRotation,
    vectorMultiply
} from '../mat4GL'
import { vec3 } from '../../@types/mat4GL'

export default class Primitive {
    protected readonly positions: Float32Array
    public pos: vec3 = [0, 0, 0]

    constructor(pos: Float32Array) {
        const positions = pos
        const matrix = xRotation(Math.PI)
    
        for (let ii = 0; ii < positions.length; ii += 3) {
            const vector = vectorMultiply(
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

        this.positions = positions
    }

    public get getConstructionPoints(): Float32Array {
        return this.positions
    }
}

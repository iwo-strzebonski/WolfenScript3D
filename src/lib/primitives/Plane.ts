/* eslint-disable require-jsdoc */
import Primitive from './Primitive'

export default class Plane extends Primitive {
    constructor(size: number) {
        const positions = new Float32Array([
            0, 0, 0,
            0, size, 0,
            size, 0, 0,
            0, size, 0,
            size, size, 0,
            size, 0, 0
        ])

        super(positions)
    }
}

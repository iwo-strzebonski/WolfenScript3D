/* eslint-disable require-jsdoc */
import Primitive from './Primitive'

export default class Plane extends Primitive {
    public readonly rotate: boolean
    public readonly color: string

    constructor(size: number, rotate: boolean, color: string) {
        const positions = new Float32Array([
            0, 0, 0,
            0, size, 0,
            size, 0, 0,
            0, size, 0,
            size, size, 0,
            size, 0, 0
        ])

        super(positions)

        this.rotate = rotate
        this.color = color
    }
}

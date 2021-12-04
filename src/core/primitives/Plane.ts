/* eslint-disable require-jsdoc */
import Primitive from './Primitive'

export default class Plane extends Primitive {
    public readonly rotate: boolean
    public openable: boolean

    constructor(size: number, rotate: boolean, openable?: boolean) {
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
        this.openable = openable || false
    }
}

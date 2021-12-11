/* eslint-disable require-jsdoc */
import Plane from '../primitives/Plane'

export default class Gate extends Plane {
    // mode == 0 -> gate
    // mode == 1 -> gate wall 1
    // mode == 2 -> gate wall 2
    public readonly mode: number
    public readonly openable: boolean
    public opened = false

    constructor(
        size: number, rotate: boolean, mode: number, color: string
    ) {
        super(size, mode ? rotate : !rotate, color)
        this.mode = mode
        this.openable = !mode
    }
}

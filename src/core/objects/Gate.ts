import Plane from '../primitives/Plane'

/* eslint-disable require-jsdoc */
export default class Gate extends Plane {
    // mode == 0 -> gate
    // mode == 1 -> gate wall 1
    // mode == 2 -> gate wall 2
    public readonly mode: number

    constructor(size: number, rotate: boolean, mode: number) {
        super(size, mode ? rotate : !rotate)
        this.mode = mode
    }
}

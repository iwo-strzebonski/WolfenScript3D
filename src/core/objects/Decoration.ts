/* eslint-disable require-jsdoc */
import Plane from '../primitives/Plane'

export default class Decoration extends Plane {
    constructor(size: number, color: string) {
        super(size, false, color)
    }
}

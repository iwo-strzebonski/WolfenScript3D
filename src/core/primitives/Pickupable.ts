/* eslint-disable require-jsdoc */
import Decoration from './Decoration'

export default class Pickupable extends Decoration {
    public readonly type: string

    constructor(size: number, type: string) {
        super(size, false)
        this.type = type
    }
}

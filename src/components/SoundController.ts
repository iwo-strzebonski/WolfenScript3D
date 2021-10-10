/* eslint-disable require-jsdoc */
import AudioController from './AudioController'

export default class SoundController extends AudioController {
    public path: string

    constructor() {
        super()
        this.path = 'sounds'
        this.tracks = this.getTracks()
    }
}

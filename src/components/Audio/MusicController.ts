/* eslint-disable require-jsdoc */
import AudioController from './AudioController'

export default class MusicController extends AudioController {
    public audio: HTMLAudioElement

    constructor() {
        super()
        this.path = 'music'
        this.loop = true
        this.audio = new Audio()
        this.tracks = this.getTracks()
    }

    public setTrack(audio: HTMLAudioElement): void {
        this.pause()
        this.audio = audio
    }

    public pause(): void {
        super.pause(this.audio)
    }
}

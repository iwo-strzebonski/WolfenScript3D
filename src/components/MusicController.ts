/* eslint-disable require-jsdoc */
import AudioController from './AudioController'

export default class MusicController extends AudioController {
    public music: HTMLAudioElement

    constructor() {
        super()
        this.path = 'music'
        this.loop = true
        this.music = new Audio()
        this.tracks = this.getTracks()
    }

    public setTrack(audio: HTMLAudioElement): void {
        this.pause()
        this.music = audio
    }

    public pause(): void {
        this.music.pause()
    }
}

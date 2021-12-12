/* eslint-disable require-jsdoc */
import Config from '../../Config'

export default class AudioController {
    protected tracks: string[]
    protected path: string
    public loop: boolean
    public volume: number

    constructor() {
        this.path = 'sounds'
        this.loop = false
        this.volume = Config.sound.soundVolume
        this.tracks = this.getTracks()
    }

    protected getTracks(): string[] {
        function importAll(r: __WebpackModuleApi.RequireContext): string[] {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            return r.keys().map(r).map((el: any) => el.default)
        }

        const context = 
            this.path === 'music'
                ? require.context('/public/music/', false, /\.(mp3)$/)
                : require.context('/public/sounds/', false, /\.(wav)$/)

        return <string[]> importAll(context)
    }

    public play(track: number): HTMLAudioElement {
        const trackToPlay = this.tracks[track - 1]

        const audio = new Audio()

        audio.src = trackToPlay
        audio.loop = this.loop
        audio.volume = this.volume
        audio.play().catch(e => {e})

        return audio
    }

    public pause(audio: HTMLAudioElement): void {
        audio.pause()
    }
}

/* eslint-disable require-jsdoc */
export default class AudioController {
    public tracks: string[]
    public path: string
    public loop: boolean
    public volume: number

    constructor() {
        this.tracks = []
        this.path = ''
        this.loop = false
        this.volume = 1
    }

    public getTracks(): string[] {
        function importAll(r: __WebpackModuleApi.RequireContext): string[] {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            return r.keys().map(r).map((el: any) => {return el.default})
        }

        const context = 
            this.path === 'music'
                ? require.context('../../music/', false, /\.(mp3)$/)
                : require.context('../../sounds/', false, /\.(wav)$/)

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

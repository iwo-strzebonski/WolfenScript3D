/* eslint-disable require-jsdoc */
import LoadingScreen from './LoadingScreen'
import Menu from './Menu'
import View from './View'
import Hand from './Hand'
import Hud from './Hud'
import MusicController from './MusicController'
import SoundController from './SoundController'

export default class Main {
    private readonly FPS: number = 70
    private readonly INTERVAL: number = 1000 / this.FPS

    private then: number

    private loadingScreen: LoadingScreen
    private menu: Menu
    private view: View
    private hand: Hand
    private hud: Hud

    private musicController: MusicController
    private soundController: SoundController
    
    constructor(container: HTMLDivElement) {
        this.loadingScreen = new LoadingScreen(container)
        this.menu = new Menu(container)
        this.view = new View(container)
        this.hand = new Hand(container)
        this.hud = new Hud(container)

        this.musicController = new MusicController()
        this.soundController = new SoundController()

        this.loadingScreen.render()
        this.menu.render()

        this.menu.hide()
        
        this.then = Date.now()

        console.log('ready')
        this.render()
    }

    render(): void {
        if (Date.now() - this.then > this.INTERVAL) {
            this.then = Date.now()

            if (this.loadingScreen.state! < 3) {
                this.loadingScreen.update()
                if (this.loadingScreen.state! === 0.5) {
                    this.musicController.setTrack(
                        this.musicController.play(1)
                    )
                }
            } else if (this.loadingScreen.state === 3) {
                this.musicController.pause()
                this.loadingScreen.state = 4
                this.loadingScreen.hide()
                this.menu.show()
                this.menu.state = 0
            }

            if (this.menu.state === 0) {
                this.musicController.setTrack(this.musicController.play(2))
                this.menu.state += 0.5
            } else if (this.menu.state > 0) {
                this.menu.update()
            }
        }

        requestAnimationFrame(this.render.bind(this))
    }
}

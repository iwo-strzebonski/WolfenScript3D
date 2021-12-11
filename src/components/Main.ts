/* eslint-disable require-jsdoc */
import LoadingScreen from './LoadingScreen'
import Menu from './Menu/Menu'
import View from './Game/View'
import MusicController from './Audio/MusicController'
import AudioController from './Audio/AudioController'
import Keyboard from './Keyboard'
import Config from '../Config'

export default class Main {
    private then: number

    private loadingScreen: LoadingScreen
    private menu: Menu
    private view: View
    private keyboard: Keyboard

    private musicController: MusicController
    private audioController: AudioController
    
    constructor(container: HTMLElement) {
        this.loadingScreen = new LoadingScreen(container)
        this.menu = new Menu(container)
        this.view = new View(container)
        this.keyboard = new Keyboard(container)

        this.musicController = new MusicController()
        this.audioController = new AudioController()

        this.loadingScreen.render()
        this.menu.render()
        this.view.render()

        this.menu.hide()
        this.view.hide()
        
        this.then = Date.now()
        this.render()
    }

    public render(): void {
        if (Date.now() - this.then > Config.engine.interval) {
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
                // this.menu.show()
                this.view.show()
                this.menu.state = 0
            }

            if (this.menu.state === 0) {
                this.musicController.setTrack(this.musicController.play(2))
                this.menu.state += 0.5
            } else if (Config.game.started && this.menu.state === 0.5) {
                this.musicController.setTrack(
                    this.musicController.play(Config.game.map + 3)
                )
                this.menu.state += 0.5
            } else if (this.menu.state === 1) {
                this.menu.update()
                this.view.update()
            }
        }

        requestAnimationFrame(this.render.bind(this))
    }
}

/* eslint-disable require-jsdoc */
import LoadingScreen from './LoadingScreen'
import Menu from './Menu/Menu'
import View from './Game/View'
import MusicController from './Audio/MusicController'
import SoundController from './Audio/SoundController'

export default class Main {
    private readonly FPS: number = 70
    private readonly INTERVAL: number = 1000 / this.FPS

    private then: number

    private loadingScreen: LoadingScreen
    private menu: Menu
    private view: View

    private musicController: MusicController
    private soundController: SoundController
    
    constructor(container: HTMLDivElement) {
        this.loadingScreen = new LoadingScreen(container)
        this.menu = new Menu(container)
        this.view = new View(container)

        this.musicController = new MusicController()
        this.soundController = new SoundController()

        this.loadingScreen.render()
        this.menu.render()
        this.view.render()

        this.menu.hide()
        this.view.hide()
        
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
                // this.view.show()
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

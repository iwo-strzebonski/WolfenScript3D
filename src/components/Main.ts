/* eslint-disable require-jsdoc */
import LoadingScreen from './LoadingScreen'
import Menu from './Menu'
import View from './View'
import Hand from './Hand'
import Hud from './Hud'

export default class Main {
    private readonly FPS: number = 70
    private readonly INTERVAL: number = 1000 / this.FPS

    private then: number

    private loadingScreen: LoadingScreen
    private menu: Menu
    private view: View
    private hand: Hand
    private hud: Hud
    
    constructor(container: HTMLDivElement) {
        this.loadingScreen = new LoadingScreen(container)
        this.menu = new Menu(container)
        this.view = new View(container)
        this.hand = new Hand(container)
        this.hud = new Hud(container)

        this.loadingScreen.render()
        
        this.then = Date.now()

        console.log('ready')
        this.render()
    }

    render(): void {
        if (Date.now() - this.then > this.INTERVAL) {
            this.then = Date.now()
            console.log('rendering')

            if (this.loadingScreen.pressedNo === 3) {
                this.menu.render()
                this.loadingScreen.pressedNo = 4
            } 
        }

        requestAnimationFrame(this.render.bind(this))
    }
}

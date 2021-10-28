/* eslint-disable require-jsdoc */
import Config from '../Config'
import HTMLItem from '../HTMLItem'
import Game from './Game'
import Hand from './Hand'
import Hud from './Hud'

export default class View extends HTMLItem {
    public game: Game
    public hand: Hand
    public hud: Hud

    constructor(container: HTMLDivElement) {
        super(container, 'div', null, 'view')
        this.game = new Game(<HTMLDivElement>this.dom)
        this.hand = new Hand(<HTMLDivElement>this.dom)
        this.hud = new Hud(<HTMLDivElement>this.dom)
    }

    public render(): void {
        super.render()
        this.game.render()
        this.hand.render()
        this.hud.render()
    }

    public show(): void {
        super.show()
        
        Config.game.started = true
    }

    public update(): void {
        super.update()

        this.game.update()
        this.hand.update()
        this.hud.update()
    }
}

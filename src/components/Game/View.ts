/* eslint-disable require-jsdoc */
import Config from '../../Config'
import HTMLItem from '../HTMLItem'
import Game from './Game'
import Hand from './Hand'
import Hud from './Hud'

import '/public/styles/view.css'

export default class View extends HTMLItem {
    public readonly game: Game
    public readonly hand: Hand
    public readonly hud: Hud

    constructor(container: HTMLElement) {
        super(container, 'div', 'view')
        this.game = new Game(this.dom)
        this.hand = new Hand(this.dom)
        this.hud = new Hud(this.dom)
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

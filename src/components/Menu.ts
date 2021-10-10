/* eslint-disable require-jsdoc */
import GameItem from './HTMLItem'
import MenuItem from './MenuItem'
import options from '../img/menu/options.png'
import stripes from '../img/menu/options-stripes.png'

export default class Menu extends GameItem {
    private title: MenuItem
    private stripes: MenuItem

    constructor(container: HTMLDivElement) {
        super(container, 'div')
        this.dom.id = 'menu'
        this.dom.ontransitionend = this.onTransitionEnd.bind(this)

        this.title = new MenuItem(<HTMLDivElement>this.dom, 'img', 'title')
        this.stripes = new MenuItem(<HTMLDivElement>this.dom, 'img', 'stripes')
        this.stripes.setSrc(stripes)
    }

    public render(): void {
        super.render()

        this.title.render()
        this.stripes.render()
    }

    public update(): void {
        if (this.state === 0.5) {
            this.title.setSrc(options)
        }
    }
}

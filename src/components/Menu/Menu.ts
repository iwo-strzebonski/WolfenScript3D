/* eslint-disable require-jsdoc */
import HTMLItem from '../HTMLItem'
import MenuItem from './MenuItem'
import options from '../../img/menu/options.png'
import stripes from '../../img/menu/options-stripes.png'

export default class Menu extends HTMLItem {
    private title: MenuItem
    private stripes: MenuItem
    private close: MenuItem

    constructor(container: HTMLDivElement) {
        super(container, 'div')
        this.dom.id = 'menu'
        this.dom.ontransitionend = this.onTransitionEnd.bind(this)

        const dom = <HTMLDivElement>this.dom

        this.title = new MenuItem(dom, 'img', 'title')
        this.stripes = new MenuItem(dom, 'img', 'stripes')
        this.stripes.setSrc(stripes)

        this.close = new MenuItem(dom, 'button', 'close')
    }

    public render(): void {
        super.render()

        this.title.render()
        this.stripes.render()
        this.close.render()
    }

    public update(): void {
        if (this.state === 0.5) {
            this.title.setSrc(options)
        }
    }
}

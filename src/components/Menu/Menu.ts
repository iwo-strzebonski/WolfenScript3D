/* eslint-disable require-jsdoc */
import HTMLItem from '../HTMLItem'
import MenuItem from './MenuItem'
import MenuOptions from './MenuOptions'

import options from '/public/img/menu/options.png'
import stripes from '/public/img/menu/options-stripes.png'

import '/public/styles/menu.css'

export default class Menu extends HTMLItem {
    private readonly title: MenuItem
    private readonly stripes: MenuItem
    private readonly options: MenuItem

    constructor(container: HTMLElement) {
        super(container, 'div', 'menu')
        this.dom.ontransitionend = this.onTransitionEnd.bind(this)

        const dom = <HTMLDivElement>this.dom

        this.title = new MenuItem(dom, 'img', 'title')
        this.stripes = new MenuItem(dom, 'img', 'stripes')
        this.stripes.src = stripes

        this.options = new MenuOptions(dom)
    }

    public render(): void {
        super.render()

        this.title.render()
        this.stripes.render()
        this.options.render()
    }

    public update(): void {
        super.update()
        this.options.update()

        if (this.state === 0.5) {
            this.title.src = options
        }
    }
}

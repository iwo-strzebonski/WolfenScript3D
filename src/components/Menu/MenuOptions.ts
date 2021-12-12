/* eslint-disable require-jsdoc */
import Config from '../../Config'
import MenuItem from './MenuItem'

export default class MenuOptions extends MenuItem {
    private readonly cursor: HTMLDivElement

    private elements: Record<string, MenuItem> = {}

    constructor(container: HTMLElement) {
        super(container, 'div', 'options')

        const dom = <HTMLDivElement>this.dom

        this.cursor = document.createElement('div')
        this.cursor.id = 'cursor'
        this.cursor.style.top = '260px'
        container.appendChild(this.cursor)

        this.elements.start =
            new MenuItem(dom, 'div', 'option', 'start', 'New Game')
        this.elements.options =
            new MenuItem(dom, 'div', 'option', 'options', 'Options')
        this.elements.load =
            new MenuItem(dom, 'div', 'option', 'load', 'Load Game')
        this.elements.save =
            new MenuItem(dom, 'div', 'option', 'save', 'Save Game')
        this.elements.readme =
            new MenuItem(dom, 'div', 'option', 'readme', 'Read This!')
        this.elements.scores =
            new MenuItem(dom, 'div', 'option', 'scores', 'View Scores')
        this.elements.demo =
            new MenuItem(dom, 'div', 'option', 'demo', 'Back to demo')
        this.elements.close =
            new MenuItem(dom, 'div', 'option', 'close', 'Quit')

        this.elements.start.select()

        this.elements.save.isSelectable = false
        this.elements.readme.isSelectable = false
        this.elements.demo.isSelectable = false
    }

    public render(): void {
        super.render()

        for (const i in this.elements) {
            this.elements[i].isSelectable = Config.menu.selectable[i]
            this.elements[i].render()
        }
    }

    public update(): void {
        super.update()

        const keys = Object.keys(this.elements)

        if (Config.game.started) {
            this.elements.save.isSelectable = true
        }

        for (const i in this.elements) {
            if (keys.indexOf(i) === Config.menu.selectedOption) {
                this.elements[i].select()
            } else {
                this.elements[i].removeSelection()
            }

            Config.menu.selectable[i] = this.elements[i].isSelectable
        }

        this.cursor.style.top = 260 + Config.menu.selectedOption * 40 + 'px'
    }
}

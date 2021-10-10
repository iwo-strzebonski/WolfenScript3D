/* eslint-disable require-jsdoc */
export default class Menu {
    private readonly container: HTMLDivElement
    protected dom: HTMLElement

    public state: number

    constructor(container: HTMLDivElement, tag: string) {
        this.state = -1
        this.container = container
        this.dom = document.createElement(tag)
    }

    public render(): void {
        this.container.appendChild(this.dom)
    }

    protected onTransitionEnd(): void {
        this.state += 0.5
    }

    public update(): void { null }

    public hide(): void {
        this.dom.style.opacity = '0'
        this.dom.style.zIndex = '-1'
    }

    public show(): void {
        this.dom.style.opacity = '1'
        this.dom.style.zIndex = '999'
    }
}

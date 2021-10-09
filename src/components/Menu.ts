/* eslint-disable require-jsdoc */
export default class Menu {
    private container: HTMLDivElement
    private dom: HTMLDivElement

    constructor(container: HTMLDivElement) {
        this.container = container
        this.dom = <HTMLDivElement> document.createElement('div')
        this.dom.id = 'menu'
    }

    render(): void {
        this.container.appendChild(this.dom)
    }
}

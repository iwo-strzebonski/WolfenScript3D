/* eslint-disable require-jsdoc */
export default class View {
    private container: HTMLDivElement
    private dom: HTMLCanvasElement

    constructor(container: HTMLDivElement) {
        this.container = container
        this.dom = <HTMLCanvasElement> document.createElement('canvas')
        this.dom.id = 'view'
    }

    render(): void {
        this.container.appendChild(this.dom)
    }
}

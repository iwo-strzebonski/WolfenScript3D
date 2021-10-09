/* eslint-disable require-jsdoc */
export default class Hand {
    private container: HTMLDivElement
    private dom: HTMLCanvasElement

    constructor(container: HTMLDivElement) {
        this.container = container
        this.dom = <HTMLCanvasElement> document.createElement('canvas')
        this.dom.id = 'hand'
    }

    render(): void {
        this.container.appendChild(this.dom)
    }
}

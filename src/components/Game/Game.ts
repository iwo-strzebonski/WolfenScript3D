/* eslint-disable require-jsdoc */
import HTMLItem from '../HTMLItem'

export default class Game extends HTMLItem {
    constructor(container: HTMLDivElement) {
        super(container, 'canvas', null, 'game')
    }

    public render(): void {
        super.render()
    }
}

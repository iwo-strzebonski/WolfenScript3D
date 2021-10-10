/* eslint-disable require-jsdoc */
import HTMLItem from '../HTMLItem'

export default class Game extends HTMLItem {
    constructor(container: HTMLDivElement) {
        super(container, 'canvas')
        this.dom.id = 'game'
    }
}

/* eslint-disable require-jsdoc */
import HTMLItem from './HTMLItem'

export default class MenuItem extends HTMLItem {
    public selectable: boolean
    
    constructor( container: HTMLDivElement, tag: string, id: string) {
        super(container, tag)
        this.selectable = true
        this.dom.id = id
    }

    public setSrc(src: string): void {
        (<HTMLImageElement>this.dom).src = src
    }
}

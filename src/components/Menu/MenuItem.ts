/* eslint-disable require-jsdoc */
import HTMLItem from '../HTMLItem'

export default class MenuItem extends HTMLItem {
    private selectable = true
    
    constructor(
        container: HTMLElement,
        tag: string,
        className: string,
        id?: string,
        innerText?: string
    ) {
        super(container, tag, className, id, innerText)
        if (tag === 'img') {
            (<HTMLImageElement>this.dom).alt = className
        }
    }

    public set src(src: string) {
        (<HTMLImageElement>this.dom).src = src
    }

    public get isSelectable(): boolean {
        return this.selectable
    }

    public set isSelectable(s: boolean) {
        this.selectable = s
        if (s) this.dom.classList.remove('disabled')
        else this.dom.classList.add('disabled')
    }

    public select(): void {
        this.dom.classList.add('selected')
    }

    public removeSelection(): void {
        this.dom.classList.remove('selected')
    }
}

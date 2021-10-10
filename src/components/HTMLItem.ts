/* eslint-disable require-jsdoc */
export default class HTMLItem {
    private readonly container: HTMLDivElement
    protected dom: HTMLElement

    public state: number

    constructor(
        container: HTMLDivElement,
        tag: string,
        innerText: 
            | string
            | null = null,
        id: 
            | string
            | null = null,
        className: 
            | string
            | null = null
    ) {
        this.state = -1
        this.container = container
        this.dom = document.createElement(tag)

        if (innerText !== null) {
            this.dom.innerText = innerText
        }

        if (id !== null) {
            this.dom.id = id
        }

        if (className !== null) {
            this.dom.className = className
        }
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

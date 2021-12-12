/* eslint-disable require-jsdoc */
import Main from './components/Main'

import '/public/styles/index.css'

window.onload = () => {
    const div = <HTMLDivElement> document.getElementById('main')!
    new Main(div)
}

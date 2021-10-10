/* eslint-disable require-jsdoc */
import './style.css'
import Main from './components/Main'

const div: HTMLDivElement = <HTMLDivElement> document.getElementById('main')!

new Main(div)

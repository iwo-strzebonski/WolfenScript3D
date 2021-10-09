import './style.css'
import Main from './components/Main'
// import img from './img/background.png'

const div: HTMLDivElement = <HTMLDivElement> document.getElementById('main')!

new Main(div)

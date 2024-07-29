import './style.css'
import { setupWebcam } from './webcam.js'

document.querySelector('#app').innerHTML = `
  <h1>JS video streaming from webcam</h1>
  <div>
  <select id="audioSource"></select>
  <select id="videoSource"></select>
  </div>
  <video id="webcam" width="640" height="480" autoplay></video>    
`

setupWebcam(document.querySelector('#webcam'), document.querySelector('#videoSource'), document.querySelector('#audioSource'))

export function setupWebcam(videoElement, videoSelect, audioSelect) {
    audioSelect.onchange = getStream
    videoSelect.onchange = getStream

    getStream().then(getDevices).then(gotDevices)

    function getDevices() {
        // AFAICT in Safari this only gets default devices until gUM is called :/
        return navigator.mediaDevices.enumerateDevices()
    }

    function gotDevices(deviceInfos) {
        window.deviceInfos = deviceInfos // make available to console
        console.log('Available input and output devices:', deviceInfos)
        for (const deviceInfo of deviceInfos) {
            const option = document.createElement('option')
            option.value = deviceInfo.deviceId
            if (deviceInfo.kind === 'audioinput') {
                option.text = deviceInfo.label || `Microphone ${audioSelect.length + 1}`
                audioSelect.appendChild(option)
            } else if (deviceInfo.kind === 'videoinput') {
                option.text = deviceInfo.label || `Camera ${videoSelect.length + 1}`
                videoSelect.appendChild(option)
            }
        }
    }

    function getStream() {
        if (window.stream) {
            window.stream.getTracks().forEach(track => {
                track.stop()
            })
        }
        const audioSource = audioSelect.value
        const videoSource = videoSelect.value
        const constraints = {
            audio: { deviceId: audioSource ? { exact: audioSource } : undefined },
            video: { deviceId: videoSource ? { exact: videoSource } : undefined }
        }
        return navigator.mediaDevices.getUserMedia(constraints).
            then(gotStream).catch(handleError)
    }

    function gotStream(stream) {
        window.stream = stream // make stream available to console
        audioSelect.selectedIndex = [...audioSelect.options].
            findIndex(option => option.text === stream.getAudioTracks()[0].label)
        videoSelect.selectedIndex = [...videoSelect.options].
            findIndex(option => option.text === stream.getVideoTracks()[0].label)
        videoElement.srcObject = stream
    }

    function handleError(error) {
        console.error('Error: ', error)
    }
}

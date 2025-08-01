// This function creates a trivial audio fade in effect
// As a part of User Experience improvement
// It increases the volume of the audio using the linear formula

function fadeIn(audio : HTMLAudioElement) {
    const oldVolume = audio.volume;



    // Setting the volume to 0
    // After collecting the previous volume
    // To later get back to it

    audio.volume = 0;

    // This interval increases the volume of the audio
    
    const fadeInt = 2;
    const fadeStep = 0.005;

    let fadeInterval = setInterval(() => {
        if (audio.volume < oldVolume) {
            audio.volume += fadeStep;
        } else {
            clearInterval(fadeInterval);
        }
    }, fadeInt);
}



// A function to fetch the audio stream data
// It is really important to admit the fact 
// that the radio server may suffocate for a few seconds
// and audio stream may be interrupted
// therefore all modern audio players would disconnect
// from the stream for the reason of useless source
//
// The engine below uses the recursive approach: 
// every disconnect leads to the new attempt to establish 
// the comunication with the audio server again

async function seekAudioStream(streamUrl : string, sourceBuffer : SourceBuffer) {
    const response = await fetch(streamUrl);

    // In the case there is no information in the response
    // We should not proceed further

    if (!response.body) {
        return;
    }



    // Then, we are obtaining the valid reader
    // For the HTTP response body

    const reader = response.body.getReader();

    while (true) {
        const { done, value } = await reader.read();



        // In case the stream is finished 
        // Or to be precise when we have lost the connection
        // Because the server started to send silence temporarily
        // We should stop reading process and try to reconnect

        if (done) {
            seekAudioStream(streamUrl, sourceBuffer);
            return;
        }



        // In case the buffer is free
        // We can append the new data to it

        if (!sourceBuffer.updating) {
            sourceBuffer.appendBuffer(value);
        }

        // In case it is updating, we should wait 
        // until the buffer is ready to accept new data
        else {
            // Creating a new promise which would be 
            // resolved when the source buffer is ready

            await new Promise(resolve => {
                const afterUpd = () => {
                    sourceBuffer.removeEventListener('updateend', afterUpd);
                    resolve(null);
                }



                // When the update would end, 
                // the function which resolves the promise
                // would be called and we can continue reading
                // Therefore no processes would conflict between 
                // the SourceBuffer and the Reader

                sourceBuffer.addEventListener('updateend', afterUpd);
            });
        }
    }
}       



// Because of the specific nature of the radio server
// There is a need to implement a custom FFMPEG-alike 
// audio player to handle the audio stream in the right way
// The only technology in TS that can handle the audio stream
// with interruptions is the MediaSource API, which is 
// currently supported by all major browsers as well as 
// on the latest mobile devices

function initAudioPlayer() {
    const mediaSource = new MediaSource();
    const codec = 'audio/mpeg';
    const audio = new Audio(URL.createObjectURL(mediaSource));

    // Now we need to wait until the MediaSource is open

    mediaSource.addEventListener('sourceopen', () => {
        const sourceBuffer = mediaSource.addSourceBuffer(codec);



        // Start the audio fetching process
        // The source buffer would be filled with the audio stream
        // and audio "tag" would play everything that comes to the buffer

        seekAudioStream(streamUrl, sourceBuffer)
    });
}



// A function to get the latest song name 
// It is used inside of the home component
// To update the song name every reasonable interval

function getCurrentSong(ip_port : string) : Promise<string> {
  return fetch(ip_port + '/get_current_info')
        .then(response => response.json())
        .then(data => {
    console.log(data);
    return data.artist;
  })
        .catch(error => {
    console.error('Error fetching current song:', error);
    return '-';
  });
}
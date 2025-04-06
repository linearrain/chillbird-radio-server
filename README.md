# chillbird-radio-server
### Description
The small and simple, yet efficient protocol for internet radio streaming engines, no HLS or ICED used. A heart of Chillbird radio.

## Features

- Support of **MP3** format for the streaming, which is a decent balance of a file size and sound quality for ordinary users
- No **HLS** or **ICED** used, only custom HTTP streaming, meaning you can explore the protocol code to learn for your own streaming-related project
- The ability to load and broadcast any mp3 files as long their folder was specified
- Shuffled playback, meaning you will get an another song everytime you relaunching the server or the playlist ends, especially effective in a big pool of audio

## Technical Stack

The project was written fully in Golang with a custom idea for the simple, yet efficient enough radio broadcast protocol.

## Note

The project was written as a help core for my own small internet radio station, development of which is currently suspended as of the need to get license and rights 
from music authors who would like to play their music there. For testing purposes I have used my own music, which was written in the period of 2023 till the end of the 2024.
 
## Usage
1. Download the project
2. In the ```main.go``` consider configuring directory with your music (should be 320 kBps), either you can change the ip address to server if you have one 
3. Run it via ```go run .```
4. Server is running, use the link xxx.xxx.xxx.xxx:27016/stream to access to your audio stream

## Access

To access the server and listen to the music, consider streaming from ipaddress:27016/stream via seamless audio hadnling engines, such as ```ffmpeg```:

```ffplay xxx.xxx.xxx.xxx:27016/stream```

Now the audio plays seamlessly and without any interference, like in Chrome with native audio tag *(it closes the connection after the signal was not sent only for a little bit of a second, which always happens on the radio)*

To make the radio engine seamlessly working in browser, consider using WebAudioAPI for taking the control over an audio stream ffrom the client side.

- Sincerely, your linearrain

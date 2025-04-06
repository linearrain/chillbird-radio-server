# chillbird-radio-server
### Description
The small and simple, yet efficient protocol for internet radio streaming engines, no HLS or ICED used. A heart of Chillbird radio.

## How to use
1. Download the project
2. In the ```main.go``` consider configuring directory with your music (should be 320 kBps), either you can change the ip address to server if you have one 
3. Run it via ```go run .```
4. Server is running, use the link xxx.xxx.xxx.xxx:27016/stream to access to your audio stream

## Access

To access the server and listen to the music, consider streaming from ipaddress:27016/stream via seamless audio hadnling engines, such as ```ffmpeg```:

```ffplay xxx.xxx.xxx.xxx:27016/stream```

Now the audio plays seamlessly and without any interference, like in Chrome with native audio tag *(it closes the connection after the signal was not sent only for a little bit of a second, which always happens on the radio)*

To make the radio engine seamlessly working in browser, consider using WebAudioAPI for taking the audio stream.

- Sincerely, your linearrain

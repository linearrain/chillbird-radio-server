# chillbird-radio-server (STILL IN EARLY DEVELOPMENT STAGE)
### Alpha version
My simplified implementation of Broadcasting Server for mp3 audio via http by using Golang net/http package mainly. A heart of Chillbird radio.

## How to use
1. Download the project
2. In the ```main.go``` consider configuring directory with your music (should be 320 kBps), either you can change the ip address to server if you have one 
3. Run it via ```go run .```
4. Server is running, use the link xxx.xxx.xxx.xxx:27016/stream to access to your audio stream

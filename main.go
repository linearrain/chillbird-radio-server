package main

import (
    "net/http"
    "fmt"
)

// Constants there are used to define the config settings of the server
// The server is streaming the music from the directory directly to the clients

const (
    seconds = 1.0
    path = "./music/" // All the music should be 320 Kbps and in the mp3 format
    ip = "127.0.0.1"
    port = "27016"    // Chillbird port since high school protocol
)

// Main function will be used to start the server
// It consists of a few goroutines, each is responsible for their task

// Main goroutine handles the HTTP server and the routing
// DecideFragment goroutine is responsible for the decision of the next piece
//     of audio data to be sent to the clients
// Broadcast goroutine is responsible for sending the audio data to the clients
// The channel audioData is used to pass the audio data from the DecideFragment
//     goroutine to the Broadcast goroutine
// The clients slice is used to store the clients, which are currently connected
//     It will be used in the Broadcast goroutine to iterate over the list of 
//     the active connections

func main() {
    audioData           := make(chan []byte)
    var clients []Client = []Client {}

    go decideFragment(audioData, seconds, path)
    go Broadcast(audioData, &clients)

    // A loop indended for iterating over the routes and their handlers

    for k, v := range route(&clients) {
        http.HandleFunc(k, v)
    }

    err := http.ListenAndServe(ip + ":" + port, nil)

    if err != nil {
        fmt.Println(err)
    }
}

package main

import (
	"fmt"
	"net/http"
	"sync/atomic"
)

// Constants there are used to define the config settings of the server
// The server is streaming the music from the directory directly to the clients

const (
	seconds = 0.70       // The length of the audio data to be sent to the clients
	path    = "./music/" // All the music should be 320 Kbps and in the mp3 format
	ip      = "0.0.0.0"
	port    = "27016" // Chillbird port since high school protocol
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
	audioData := make(chan []byte)
	var clients []Client = []Client{}

	// Saving the current song name
	// It would be got inside of decideFragment
	// and sent to the clients via get_current_info route
	var currentSong atomic.Value

	currentSong.Store("No output")

	go decideFragment(audioData, &currentSong, seconds, path)
	go Broadcast(audioData, &clients)

	var mux = http.NewServeMux()

	// A loop indended for iterating over the routes and their handlers

	for k, v := range route(&clients, &currentSong) {
		mux.HandleFunc(k, v)
	}

	mux.Handle("/static/", http.StripPrefix("/static/", http.FileServer(http.Dir("pages/static/"))))

	err := http.ListenAndServe(ip+":"+port, mux)

	if err != nil {
		fmt.Println(err)
	}
}

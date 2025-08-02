package main

import (
	"fmt"
	"net/http"
	"sync/atomic"
)

// Structure to hold a client write port and a channel to interrupt the connection
// Interruption is used to terminate the getStream function in case of a client
// disconnect or lose the connection

type Client struct {
	writer          http.ResponseWriter
	interruptSignal chan []byte
}

// CORS-function to prevent issues from an React app

func disableCORS(w http.ResponseWriter) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
}

// Function, which returns a map of routes and their handlers
// Used for better scalability and readability in case of adding more routes

func route(clients *[]Client, currentSong *atomic.Value) map[string]func(w http.ResponseWriter,
	r *http.Request) {
	return map[string]func(w http.ResponseWriter, r *http.Request){
		"/get_current_info": func(w http.ResponseWriter, r *http.Request) {
			getCurrentInfo(w, r, currentSong)
		},

		"/stream": func(w http.ResponseWriter, r *http.Request) {
			getStream(w, r, clients)
		},
	}
}

// Function to handle the stream route and by that capture the user's connection
// It should not be terminated until the user disconnects or error occurs
// As consequence, the function will return the pointer, which will be nil
// This causes the function to be terminated by the channel in the Client struct

func getStream(w http.ResponseWriter, r *http.Request, clients *[]Client) {
	fmt.Println("Getting one user")

	w.Header().Set("Content-Type", "audio/mpeg")
	w.Header().Set("Transfer-Encoding", "chunked")
	w.Header().Set("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0")
	w.Header().Set("Pragma", "no-cache")
	w.Header().Set("Expires", "0")
	w.Header().Set("Connection", "keep-alive")

	disableCORS(w)

	interruptWaiter := make(chan []byte)
	defer close(interruptWaiter)

	client := Client{w, interruptWaiter}

	addClient(clients, client)

	select {
	case <-interruptWaiter:
		fmt.Println("Client disconnected, terminating the connection")
	}
}

// Function to get the current information about the song
// Includes songname and artist
// NOTE: CURRENTLY NOT USED IN THE PROJECT

func getCurrentInfo(w http.ResponseWriter, r *http.Request, currentSong *atomic.Value) {
	w.Header().Set("Content-Type", "application/json")

	fullname := currentSong.Load().(string)

	disableCORS(w)

	w.Write([]byte("{ \"artist\": \"" + fullname + "\", \"songname\": \"" +
		fullname + "\" }"))
}

// A function for flushing the data to the client

func FlushData(w http.ResponseWriter) {
	flusher, ok := w.(http.Flusher)

	if !ok {
		fmt.Println("Error while flushing the data")
	}

	flusher.Flush()
}

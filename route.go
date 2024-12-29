package main 

import (
    "net/http"
    "strings"
    "fmt"
)

// Structure to hold a client write port and a channel to interrupt the connection
// Interruption is used to terminate the getStream function in case of a client 
// disconnect or lose the connection

type Client struct {
    writer          http.ResponseWriter
    interruptSignal chan []byte
}


// Function, which returns a map of routes and their handlers
// Used for better scalability and readability in case of adding more routes

func route(clients *[]Client) map[string]func(w http.ResponseWriter, 
                                                           r *http.Request) {
    return map[string]func(w http.ResponseWriter, r *http.Request) {
        "/": getRoot,
        "/stream": func(w http.ResponseWriter, r *http.Request) {
            getStream(w, r, clients)
        },
    }
}

// Function to handle the root route and then redirect them to visible page

func getRoot(w http.ResponseWriter, r *http.Request) {
    http.ServeFile(w, r, "./pages/index.html")
}

// Function to handle the stream route and by that capture the user's connection
// It should not be terminated until the user disconnects or error occurs
// As consequence, the function will return the pointer, which will be nil
// This causes the function to be terminated by the channel in the Client struct

func getStream(w http.ResponseWriter, r *http.Request, clients *[]Client) {
    fmt.Println("Getting one user")

    w.Header().Set("Content-Type", "audio/mpeg")
    w.Header().Set("Transfer-Encoding", "chunked")
    w.Header().Set("Cache-Control", "no-cache")
    w.Header().Set("Connection", "keep-alive")

    interruptWaiter := make(chan []byte)

    client := Client {w, interruptWaiter}

    addClient(clients, client)

    select {
    case <-interruptWaiter:
        fmt.Println("Client disconnected, terminating the connection")
    }
}

// Function to get the current information about the song
// Includes songname and artist
// NOTE: CURRENTLY NOT USED IN THE PROJECT

func getCurrentInfo(w http.ResponseWriter, r *http.Request, currentSong <-chan string) {
    w.Header().Set("Content-Type", "application/json")

    fullname := <-currentSong

    artist := fullname[: strings.Index(fullname, "-")]
    songname := fullname[strings.Index(fullname, "-") + 1 : len(fullname) - 1]

    w.Write([]byte("{ \"artist\": \"" + artist + "\", \"songname\": \"" + 
                                                        songname + "\" }"))
}

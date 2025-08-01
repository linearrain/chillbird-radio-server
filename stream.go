package main

import (
	"fmt"
	transf "httptrying/transformations"
	"os"
	"sync"
	"sync/atomic"
	"time"
)

func addClient(clients *[]Client, c Client) {
	(*clients) = append((*clients), c)
}

// BROADCASTING THE DATA ITSELF TO THE CLIENTS
// Gets the current chunk of audio, which should be shared and the list of
// currently active clients. Iterates over all the clients and sends the same
// data to them to emulate the radio broadcasting

func Broadcast(audioData chan []byte, clients *[]Client) {
	// Making it infinite, as it is "radio" broadcasting and loops the tracklist

	for {

		var waitGroup sync.WaitGroup

		pendingDeletion := []int{}
		// Waiting if there is any data to receive from the channel
		select {

		// In case there is a new chunk of audio data, we send it to all the
		// clients by iterating the loop of them

		case currentChunk := <-audioData:
			fmt.Println("Broadcasting the data")
			waitGroup.Add(len(*clients))

			for index, client := range *clients {
				fmt.Println("Sending to the client", index)
				go func(index int, client Client) {
					_, err := client.writer.Write(currentChunk)

					FlushData(client.writer)

					// The error happens when the client refuses the connection
					// Deleting the inactive client accelerates the serving
					// of the active clients

					if err != nil {
						fmt.Println("Client refused the connection", "(", err, ")")
						(*clients)[index].interruptSignal <- []byte{0x00}
						(*clients) = append((*clients)[:index], (*clients)[index+1:]...)
						pendingDeletion = append(pendingDeletion, index)
					}
					waitGroup.Done()
				}(index, client)
			}
			waitGroup.Wait()
		}
	}
}

// PREPARING THE FRAGMENT OF AUDIO DATA NEEDED TO BE SENT TO THE CLIENTS LATER
// This one infinitely goes from file to file and in between splits them to the
// chunks of raw audio data would be sent to the clients after.

func decideFragment(audioData chan []byte, currentSong *atomic.Value, seconds float32, path string) {
	currentInd := -1
	emptyChunk := make([]byte, 80000)

	for {
		// Sending the silence to the clients to reduce the possibility of
		// the premature quitting
		transf.SendSilence(audioData, seconds)

		// Getting the list of songs in the directory
		files := transf.GetSongList(path)

		song := transf.NextSelect(&currentInd, files)
		fmt.Println("Song list: ", files)

		fmt.Println("Playing", song.Name())

		currentSong.Store(song.Name())

		// Opening the file to read the data from it
		// Making sure it is either closed or the error is printed

		file, err := os.Open(path + song.Name())
		defer file.Close()

		if err != nil {
			fmt.Println(err)
			continue
		}

		// The fact is all the songs I play on my stations are 320 kbps
		// So this fact maybe hardcoded there, not in the main.go
		// As the bitrate is constant and we cannot manipulate it
		bitsPerSec := 320000

		// We are using bytes for audio chunk transmission, so:
		bytesPerSec := bitsPerSec / 8

		// Creating the buffer to store the audio data
		// And go though it with each iteration of the loop below the buffer
		var buffer *[]byte = transf.CreateBuffer(bytesPerSec, seconds)

		err = nil
		var n int

		// Until the file is readable meaning either it is healthy
		// Or the "error" is EOF, we have to go though the file
		for err == nil {
			// Reading portion of the file
			// With later iteration, go further within the file
			n, err = file.Read(*buffer)

			// Passing the data to another channel with duty of broadcasting it
			audioData <- (*buffer)[:n]

			// Waiting the needed amount of the seconds to pass
			// To create the desired radio effect
			// NOTE: of course, if the formula for mp3 chunk uses bitrate,
			//       not the 144 * bitrate / sampleRate + padding then the song
			//       will be played more then n seconds or in the best case
			//       n seconds itself
			//       But the streaming in that case gives us maximal latency
			//       Between devices of 3 - 6 seconds which is acceptable, as
			//       the streaming remains uninterrupted

			time.Sleep(time.Duration(seconds*1000) * time.Millisecond)
		}
		file.Seek(0, 0)
		file.Close()

		audioData <- emptyChunk
	}
}

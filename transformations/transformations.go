package transformations

import (
    "os"
    "fmt"
    "time"
    "math/rand"
)

// The function is used to get the list of songs in the directory
// Returns a slice of os.DirEntry objects to later iterate over them in decideFragment thread

func GetSongList(path string) []os.DirEntry {
    files, err := os.ReadDir(path)

    if err != nil {
        fmt.Println(err)
    }

    return files
}

// Shuffle the list to make every single relaunch of the server unique

func ShuffleList(songs *[]os.DirEntry) {
    r := rand.New(rand.NewSource(time.Now().UnixNano()))

    r.Shuffle(len(*songs), func(i, j int) {
        (*songs)[i], (*songs)[j] = (*songs)[j], (*songs)[i]
    })
}

// The function is used to select the next song from the list
// Returns the next song from the list of songs

func NextSelect(currentInd *int, songs []os.DirEntry) os.DirEntry {
    (*currentInd)++
    *currentInd %= len(songs)

    return songs[*currentInd]
}

// The function is used to create a buffer of the given size in bytes
// For streaming 

func CreateBuffer(bytesPerSecond int, seconds float32) *[]byte {

    buf := make([]byte, bytesPerSecond * int(seconds)) 
    return &buf
}

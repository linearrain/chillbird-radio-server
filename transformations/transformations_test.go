package transformations

import (
    "testing"
    "fmt"
)

func TestGetSongList(t *testing.T) {
    path := "../music_aac/"
    files := GetSongList(path)

    if len(files) == 0 {
        t.Errorf("No files found in %s", path)
    }
}

func TestShuffleList(t *testing.T) {
    path := "../music/"
    files := GetSongList(path)
    ShuffleList(&files)

    fmt.Println(files)
}

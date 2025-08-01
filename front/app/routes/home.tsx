import type { Route } from "./+types/home";
import { useState } from 'react';
import Logo from "../components/Logo";
import Socials from "../components/Socials";
import Description from "../components/Description";
import Player from "../components/Player";

function getCurrentSong() : Promise<string> {
  // This function takes the current song
  // from the server


  return fetch('http://127.0.0.1:27016/get_current_info')
                   .then(response => response.json()).then(data => {
    console.log(data);
    return data.artist;
  }).catch(error => {
    console.error('Error fetching current song:', error);
    return '-';
  });
}

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to Radio, sorry to realize you see" + 
                                    "this text as it is not intended to show on WP!" },
  ];
}

export default function Home() {
  const [currentSong, setCurrentSong] = useState('-');

  // Player
  const [isPlaying, setIsPlaying] = useState(false);

  setInterval(async() => {
    const song = await getCurrentSong();
    setCurrentSong(song);
  }, 840);

  return (
    <div style={{
         width: '100%',
         display: 'flex',
         justifyContent: 'space-between',
         padding: '7.5%',
    }}>
      <div>
        <audio src="http://127.0.0.1:27016/stream" />
        <Logo />
        <Description />
        <Player songname={currentSong}  />
      </div>

        <Socials />
    </div>
  );
}
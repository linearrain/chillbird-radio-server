import type { Route } from "./+types/home";
import { useEffect, useState, useRef, useLayoutEffect } from 'react';
import Logo from "../components/Logo";
import Socials from "../components/Socials";
import Description from "../components/Description";
import Player from "../components/Player";

let audioVol = 0.0;



export default function Home() {
  const IP_DOMAIN = 'http://127.0.0.1:27016'

  const [currentSong, setCurrentSong] = useState('-');

  // Player states
  // Basically, they would go through 
  // the Player -> PlayerBtn cycle
  // To control and visualize the state

  const [isPlaying, setIsPlaying] = useState(false);



  // This function indicates which song is currently playing
  // The request is done to the server API
  // And Go server replies back with the current song name
  // The request is done every 840 milliseconds
  // To ensure up-to-date information without overloading the server

  setInterval(async() => {
    const song = await getCurrentSong(IP_DOMAIN);
    setCurrentSong(song);
  }, 840);





  // HTML LAYOUT

  // A block intended to get the width of the description
  // As CSS simply lacks the ability to do so

  const headerRef = useRef(null);
  const [descW, setDescW] = useState('auto');

  useLayoutEffect(() => {
    if (headerRef.current) {
      const headerWidth = (headerRef.current as HTMLDivElement).offsetWidth;
      setDescW(`calc(${headerWidth}px)`);
    }
  }, [headerRef]);

  return (
    <div style={{
      width: '100%',
      display: 'flex',
      justifyContent: 'space-between',
      }}>
      
      <div>
        <div ref={ headerRef } style={{ width: 'fit-content' }}>
          <Logo />
        </div>

        <div style={{ width: descW }}>
          <Description />
          <Player songname={currentSong}  setPlay={ setIsPlaying } 
                  isPlaying={ isPlaying } loudness={audioVol} />
        </div>
      </div>
      <Socials />
    </div>

  );
}
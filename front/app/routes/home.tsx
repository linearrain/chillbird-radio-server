import type { Route } from "./+types/home";
import { useEffect, useState, useRef, useLayoutEffect } from 'react';

import Logo from "../components/Logo";
import Description from "../components/Description";

import Player from "../components/Player";
import { getCurrentSong, initAudioPlayer } from "../components/player/Functions";

import Socials from "../components/Socials";

import Time from "../components/Time";



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



  // Initialize the audio player
  // It would start seeking the audio stream
  // Before that creating a media source buffer

  useEffect(() => {
    initAudioPlayer(IP_DOMAIN + '/stream', isPlaying);
  }, [isPlaying]);


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
          <br /><br />
          <Player songname={currentSong}  setPlay={ setIsPlaying } 
                  isPlaying={ isPlaying } loudness={0.99} />
            
          <div style={{
            marginTop: '48px',
            display: 'flex'
            , justifyContent: 'space-between',}}>
            <Time 
              url="https://timeapi.io/api/time/current/zone?timeZone=Europe%2FAmsterdam" 
              city="Amsterdam" />

            <Time
              url="https://timeapi.io/api/time/current/zone?timeZone=Europe%2FKyiv" 
              city="Kyiv" />

            <Time
              url="https://timeapi.io/api/time/current/zone?timeZone=Asia%2FSingapore"
              city="Singapore" />
            
            <Time
              url="https://timeapi.io/api/time/current/zone?timeZone=America%2FNew_York"
              city="New York" />
          </div>
        </div>
      </div>
      <Socials />
    </div>

  );
}
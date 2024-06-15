"use client";
import React, { useState, useEffect, useRef } from 'react';
import delay from '@/utils/delay';

interface WebPlaybackProps {
  token: string;
}

interface Artist {
  name: string;
}

interface Track {
  name: string;
  artists: Artist[];
}

declare global {
  interface Window {
    onSpotifyWebPlaybackSDKReady: () => void;
    Spotify: any;
  }
}

const WebPlayback: React.FC<WebPlaybackProps> = ({ token }) => {
  const playerRef = useRef<any>(null);
  const currentTrackPlaying = useRef<Track | null>(null);
  const [currentSong, setCurrentSong] = useState<Track | null>(null);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://sdk.scdn.co/spotify-player.js";
    script.async = true;

    document.body.appendChild(script);

    window.onSpotifyWebPlaybackSDKReady = () => {
      playerRef.current = new window.Spotify.Player({
        name: 'Web Playback SDK',
        getOAuthToken: (cb: (token: string) => void) => { cb(token); },
        volume: 0.2
      });

      const player = playerRef.current;

      player.addListener('ready', ({ device_id }: { device_id: string }) => {
        console.log('Ready with Device ID', device_id);
      });

      player.addListener('not_ready', ({ device_id }: { device_id: string }) => {
        console.log('Device ID has gone offline', device_id);
      });

      player.addListener('player_state_changed', (state: any) => {
        if (!state) {
          console.log("somehting else")
          return;
        }
        if (state.track_window.current_track === currentTrackPlaying) {
          return;
        }
        
        const newTrack = state.track_window.current_track;

        // Compare if the track has actually changed
        if (currentTrackPlaying.current?.name !== newTrack?.name) {
          currentTrackPlaying.current = newTrack;
          console.log(newTrack);
          
          setCurrentSong(newTrack);
        }
        
      });

      player.connect();

      
    };

    return () => {
      if (playerRef.current) {
        playerRef.current.disconnect();
      }
    };

    
  }, [token]);

  useEffect(() => {
    if (!currentSong) {
      console.log("sending no song request");
      return;
    }
    
    const trackName = currentSong?.name || 'No track playing';
    const artistName = currentSong?.artists[0]?.name || 'No artist';

    console.log(`Currently Playing: ${trackName} by ${artistName}`);
    async function handleOSCMessage(address: string, args: any[]) {
      try {
        const response = await fetch('/api/osc', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ address, args }),
        });
        
        const data = await response.json();
         
        if (response.ok) {
          console.log("Message:", data.data);
        } else {
          console.error('Error:', data.data);
        }
      } catch (error) {
        console.error('Error:', error);
      }
      
    }
    const handleOSCMessageSequence = async () => {
      // await handleOSCMessage('/chatbox/typing', [true]);
      // await delay(1000); // delay for 1 second
      await handleOSCMessage('/chatbox/input', [`Currently Playing: ${trackName} by ${artistName}`, true, true]);
      // await delay(1000); // delay for 1 second
      // await handleOSCMessage('/chatbox/typing', [false]);
      console.log("Sent OSC message sequence");
    };

    handleOSCMessageSequence();
    console.log("Im sending a fetch request");
  }, [currentSong])
    

  

   return (
      <>
        <div className="container">
           <div className="main-wrapper">
                <h1>Web Playback</h1>
            </div>
        </div>
      </>
    );
}

export default WebPlayback
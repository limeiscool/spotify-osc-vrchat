import React, { useState, useEffect } from 'react';

function WebPlayback(props: React.PropsWithChildren<{token: string}>) {

  useEffect(() => {
    function mimic() {
      setTimeout(() => {
        console.log("Device is transmitting...")
      }, 2000)
    }

    mimic()
  }, [])

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
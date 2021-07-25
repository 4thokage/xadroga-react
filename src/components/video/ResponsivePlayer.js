import React from 'react';
import ReactPlayer from "react-player/lazy";

import './responsive-player.css'

export default function ResponsivePlayer(props) {
  return (
    <>
      <div className='player-wrapper'>
        <ReactPlayer
          className='react-player'
          url={props.url}
          width='100%'
          height='100%'
        />
      </div>
    </>
  )
}


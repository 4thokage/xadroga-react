import React, {Suspense, useEffect, useRef, useState} from 'react';
import io from "socket.io-client";
import Peer from "simple-peer";
import {Howl} from 'howler'

import camera from '../../images/camera.svg'
import camerastop from '../../images/camera-stop.svg'
import microphone from '../../images/microphone.svg'
import microphonestop from '../../images/microphone-stop.svg'
import share from '../../images/share.svg'
import hangup from '../../images/hang-up.svg'
import fullscreen from '../../images/fullscreen.svg'
import minimize from '../../images/minimize.svg'
import ringtone from '../../images/ringtone.mp3'
import Modal from "react-bootstrap/Modal";

const ringtoneSound = new Howl({
  src: [ringtone],
  loop: true,
  preload: true
})

function VideoChat(receiverID) {
  const [yourID, setYourID] = useState("");
  const [users, setUsers] = useState({});
  const [stream, setStream] = useState();
  const [receivingCall, setReceivingCall] = useState(false);
  const [caller, setCaller] = useState("");
  const [callingFriend, setCallingFriend] = useState(false);
  const [callerSignal, setCallerSignal] = useState();
  const [callAccepted, setCallAccepted] = useState(false);
  const [callRejected, setCallRejected] = useState(false);
  const [modalVisible, setModalVisible] = useState(false)
  const [modalMessage, setModalMessage] = useState('')
  const [audioMuted, setAudioMuted] = useState(false)
  const [videoMuted, setVideoMuted] = useState(false)
  const [isfullscreen, setFullscreen] = useState(false)

  const userVideo = useRef();
  const partnerVideo = useRef();
  const socket = useRef();
  const myPeer = useRef();

  let landingHTML = <>
    <div className="u-margin-top-xxlarge u-margin-bottom-xxlarge">
      <div className="o-wrapper-l">
        <div className="hero flex flex-column">
          <div className="callBox flex">
            <button onClick={() => callPeer(receiverID.toLowerCase().trim())} className="primaryButton">Call</button>
          </div>
        </div>
      </div>
    </div>
  </>

  useEffect(() => {
    socket.current = io.connect("socket-chat");

    socket.current.on("server.chat.client.new", (id) => {
      setYourID(id);
    })

    socket.current.on("server.chat.client.list", (users) => {
      setUsers(users);
    })

    socket.current.on("server.call.hello", (data) => {
      setReceivingCall(true);
      ringtoneSound.play();
      setCaller(data.from);
      setCallerSignal(data.signal);
    })
  }, []);

  function callPeer(id) {
    if (id !== '' && users[id] && id !== yourID) {
      navigator.mediaDevices.getUserMedia({video: true, audio: true}).then(stream => {
        setStream(stream);
        setCallingFriend(true)
        setCaller(id)
        if (userVideo.current) {
          userVideo.current.srcObject = stream;
        }
        const peer = new Peer({
          initiator: true,
          trickle: false,
          config: {

            iceServers: [
              {url: 'stun:stun01.sipphone.com'},
              {url: 'stun:stun.ekiga.net'},
              {url: 'stun:stun.fwdnet.net'},
              {url: 'stun:stun.ideasip.com'},
              {url: 'stun:stun.iptel.org'},
              {url: 'stun:stun.rixtelecom.se'},
              {url: 'stun:stun.schlund.de'},
              {url: 'stun:stun.l.google.com:19302'},
              {url: 'stun:stun1.l.google.com:19302'},
              {url: 'stun:stun2.l.google.com:19302'},
              {url: 'stun:stun3.l.google.com:19302'},
              {url: 'stun:stun4.l.google.com:19302'},
              {url: 'stun:stunserver.org'},
              {url: 'stun:stun.softjoys.com'},
              {url: 'stun:stun.voiparound.com'},
              {url: 'stun:stun.voipbuster.com'},
              {url: 'stun:stun.voipstunt.com'},
              {url: 'stun:stun.voxgratia.org'},
              {url: 'stun:stun.xten.com'}
            ]
          },
          stream: stream,
        });

        myPeer.current = peer;

        peer.on("signal", data => {
          socket.current.emit("client.call.user", {userToCall: id, signalData: data, from: yourID})
        })

        peer.on("stream", streamSrc => {
          if (partnerVideo.current) {
            partnerVideo.current.srcObject = streamSrc;
          }
        });

        peer.on('error', (err) => {
          endCall()
        })

        socket.current.on("server.call.accepted", signal => {
          setCallAccepted(true);
          peer.signal(signal);
        })

        socket.current.on('server.call.close', () => {
          window.location.reload();
        })

        socket.current.on('server.call.rejected', () => {
          window.location.reload();
        })
      })
        .catch(() => {
          setModalMessage('You cannot place/ receive a call without granting video and audio permissions! Please change your settings to use Cuckoo.')
          setModalVisible(true)
        })
    }
  }

  function acceptCall() {
    ringtoneSound.unload();
    navigator.mediaDevices.getUserMedia({video: true, audio: true}).then(stream => {
      setStream(stream);
      if (userVideo.current) {
        userVideo.current.srcObject = stream;
      }
      setCallAccepted(true);
      const peer = new Peer({
        initiator: false,
        trickle: false,
        stream: stream,
      });

      myPeer.current = peer

      peer.on("signal", data => {
        socket.current.emit("client.call.accept", {signal: data, to: caller})
      })

      peer.on("stream", stream => {
        partnerVideo.current.srcObject = stream;
      });

      peer.on('error', (err) => {
        endCall()
      })

      peer.signal(callerSignal);

      socket.current.on('close', () => {
        window.location.reload()
      })
    })
      .catch(() => {
        setModalMessage('You cannot place/ receive a call without granting video and audio permissions! Please change your settings to use Cuckoo.')
        setModalVisible(true)
      })
  }

  function rejectCall() {
    ringtoneSound.unload();
    setCallRejected(true)
    socket.current.emit('rejected', {to: caller})
    window.location.reload()
  }

  function endCall() {
    myPeer.current.destroy()
    socket.current.emit('close', {to: caller})
    window.location.reload()
  }

  function shareScreen() {
    navigator.mediaDevices.getDisplayMedia({cursor: true})
      .then(screenStream => {
        myPeer.current.replaceTrack(stream.getVideoTracks()[0], screenStream.getVideoTracks()[0], stream)
        userVideo.current.srcObject = screenStream
        screenStream.getTracks()[0].onended = () => {
          myPeer.current.replaceTrack(screenStream.getVideoTracks()[0], stream.getVideoTracks()[0], stream)
          userVideo.current.srcObject = stream
        }
      })
  }

  function toggleMuteAudio() {
    if (stream) {
      setAudioMuted(!audioMuted)
      stream.getAudioTracks()[0].enabled = audioMuted
    }
  }

  function toggleMuteVideo() {
    if (stream) {
      setVideoMuted(!videoMuted)
      stream.getVideoTracks()[0].enabled = videoMuted
    }
  }

  function renderLanding() {
    if (!callRejected && !callAccepted && !callingFriend)
      return 'block'
    return 'none'
  }

  function renderCall() {
    if (!callRejected && !callAccepted && !callingFriend)
      return 'none'
    return 'block'
  }

  function isMobileDevice() {
    return (/Mobi|Android/i.test(navigator.userAgent));
  }

  let UserVideo;
  if (stream) {
    UserVideo = (
      <video className="userVideo" playsInline muted ref={userVideo} autoPlay/>
    );
  }

  let PartnerVideo;
  if (callAccepted && isfullscreen) {
    PartnerVideo = (
      <video className="partnerVideo cover" playsInline ref={partnerVideo} autoPlay/>
    );
  } else if (callAccepted && !isfullscreen) {
    PartnerVideo = (
      <video className="partnerVideo" playsInline ref={partnerVideo} autoPlay/>
    );
  }

  let incomingCall;
  if (receivingCall && !callAccepted && !callRejected) {
    incomingCall = (
      <div className="incomingCallContainer">
        <div className="incomingCall flex flex-column">
          <div><span className="callerID">{caller}</span> is calling you!</div>
          <div className="incomingCallButtons flex">
            <button name="accept" className="alertButtonPrimary" onClick={() => acceptCall()}>Accept</button>
            <button name="reject" className="alertButtonSecondary" onClick={() => rejectCall()}>Reject</button>
          </div>
        </div>
      </div>
    )
  }

  let audioControl;
  if (audioMuted) {
    audioControl = <span className="iconContainer" onClick={() => toggleMuteAudio()}>
      <img src={microphonestop} alt="Unmute audio"/>
    </span>
  } else {
    audioControl = <span className="iconContainer" onClick={() => toggleMuteAudio()}>
      <img src={microphone} alt="Mute audio"/>
    </span>
  }

  let videoControl;
  if (videoMuted) {
    videoControl = <span className="iconContainer" onClick={() => toggleMuteVideo()}>
      <img src={camerastop} alt="Resume video"/>
    </span>
  } else {
    videoControl = <span className="iconContainer" onClick={() => toggleMuteVideo()}>
      <img src={camera} alt="Stop audio"/>
    </span>
  }

  let screenShare = <span className="iconContainer" onClick={() => shareScreen()}>
    <img src={share} alt="Share screen"/>
  </span>
  if (isMobileDevice()) {
    screenShare = <></>
  }

  let hangUp = <span className="iconContainer" onClick={() => endCall()}>
    <img src={hangup} alt="End call"/>
  </span>

  let fullscreenButton;
  if (isfullscreen) {
    fullscreenButton = <span className="iconContainer" onClick={() => {
      setFullscreen(false)
    }}>
      <img src={minimize} alt="fullscreen"/>
    </span>
  } else {
    fullscreenButton = <span className="iconContainer" onClick={() => {
      setFullscreen(true)
    }}>
      <img src={fullscreen} alt="fullscreen"/>
    </span>
  }

  return (
    <>
      <div style={{display: renderLanding()}}>
        {landingHTML}
        <Modal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          width={20}
          height={5}
          measure={'em'}
          closeOnEsc={true}
        >
          <div>{modalMessage}</div>
        </Modal>
        {incomingCall}
      </div>
      <div className="callContainer" style={{display: renderCall()}}>
        <Suspense fallback={<div>Loading...</div>}>
        </Suspense>
        <div className="partnerVideoContainer">
          {PartnerVideo}
        </div>
        <div className="userVideoContainer">
          {UserVideo}
        </div>
        <div className="controlsContainer flex">
          {audioControl}
          {videoControl}
          {screenShare}
          {fullscreenButton}
          {hangUp}
        </div>
      </div>
    </>
  )
}

export default VideoChat;

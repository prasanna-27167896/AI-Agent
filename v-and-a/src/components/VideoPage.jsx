import React, { useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt';
import { APP_ID, SERVER_SECRET } from './constant';

const VideoPage = () => {
  const { id } = useParams();
  const roomID = id;
  const containerRef = useRef(null);

  useEffect(() => {
    const initMeeting = async () => {
      const appID = APP_ID;
      const serverSecret = SERVER_SECRET;
      const userID = Date.now().toString();
      const userName = "User_" + userID;

      const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
        appID,
        serverSecret,
        roomID,
        userID,
        userName
      );

      const zp = ZegoUIKitPrebuilt.create(kitToken);

      zp.joinRoom({
        container: containerRef.current,
        sharedLinks: [
          {
            name: 'Copy link',
            url: `${window.location.origin}/room/${roomID}`,
          },
        ],
        scenario: {
          mode: ZegoUIKitPrebuilt.OneONoneCall,
        },
      });
    };

    initMeeting();
  }, [roomID]);

  return (
    <div 
      ref={containerRef} 
      className="w-full h-screen bg-gray-900 flex items-center justify-center"
    />
  );
};

export default VideoPage;

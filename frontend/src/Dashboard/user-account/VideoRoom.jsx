import { useEffect, useState } from "react";
import { VideoPlayer } from "./VideoPlayer";
import styles from "./VideoRoom.module.css";
import AgoraRTC from "agora-rtc-sdk-ng";
import { FcEndCall } from "react-icons/fc";
import { useNavigate } from "react-router-dom";
import { LiaMicrophoneSolid, LiaMicrophoneSlashSolid } from "react-icons/lia";
import {
  PiVideoCameraDuotone,
  PiVideoCameraSlashDuotone,
} from "react-icons/pi";

const APP_ID = "36a49587457343adad206a66d0fb91fe";
const TOKEN =
  "007eJxTYDhSwORw6uwNpaRwd+6F39mUGs/+til2n9obUhBRuzxWIlaBwdgs0cTS1MLcxNTc2MQ4MSUxxcjALNHMLMUgLcnSMC01OicwrSGQkeH3ZntGRgYIBPE5GHJTUzKTE4tSGRgATdUfcQ==";
const CHANNEL = "medicare";

const client = AgoraRTC.createClient({
  mode: "rtc",
  codec: "vp8",
});

export const VideoRoom = ({ join }) => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [localTracks, setLocalTracks] = useState([]);
  const [localUser, setLocalUser] = useState(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);

  const handleUserJoined = async (user, mediaType) => {
    await client.subscribe(user, mediaType);

    if (mediaType === "video") {
      setUsers((previousUsers) => [...previousUsers, user]);
    }

    if (mediaType === "audio") {
      user.audioTrack.play();
    }
  };

  const handleUserLeft = (user) => {
    setUsers((previousUsers) =>
      previousUsers.filter((u) => u.uid !== user.uid)
    );
  };

  useEffect(() => {
    client.on("user-published", handleUserJoined);
    client.on("user-left", handleUserLeft);

    client
      .join(APP_ID, CHANNEL, TOKEN, null)
      .then((uid) =>
        Promise.all([AgoraRTC.createMicrophoneAndCameraTracks(), uid])
      )
      .then(([tracks, uid]) => {
        const [audioTrack, videoTrack] = tracks;
        setLocalTracks(tracks);
        setUsers((previousUsers) => [
          ...previousUsers,
          {
            uid,
            videoTrack,
            audioTrack,
          },
        ]);
        client.publish(tracks);
      });

    return () => {
      for (let localTrack of localTracks) {
        localTrack.stop();
        localTrack.close();
      }
      client.off("user-published", handleUserJoined);
      client.off("user-left", handleUserLeft);
      //   client.unpublish(tracks).then(() => client.leave());
    };
  }, []);

  const handleLeave = async () => {
    if (localTracks.length > 0) {
      for (let localTrack of localTracks) {
        localTrack.stop();
        localTrack.close();
      }

      await client.unpublish(localTracks);
      await client.leave();

      setLocalTracks([]);
      setLocalUser(null);
      setUsers((previousUsers) =>
        previousUsers.filter((user) => user.uid !== localUser.uid)
      );
      navigate("/");
    }
  };

  const handleMute = () => {
    if (localUser && localUser.audioTrack) {
      if (isMuted) {
        localUser.audioTrack.setEnabled(false);
        setIsMuted(false);
      } else {
        localUser.audioTrack.setEnabled(true);
        setIsMuted(true);
      }
    }
  };

  const handleCamera = () => {
    if (localUser && localUser.videoTrack) {
      if (isCameraOff) {
        localUser.videoTrack
          .setEnabled(true)
          .then(() => {
            setIsCameraOff(false);
          })
          .catch((error) => {
            console.error("Failed to enable camera:", error);
          });
      } else {
        localUser.videoTrack
          .setEnabled(false)
          .then(() => {
            setIsCameraOff(true);
          })
          .catch((error) => {
            console.error("Failed to disable camera:", error);
          });
      }
    }
  };
  return (
    <div className={styles.videoRoom_cont}>
      <div className={styles.videoPlayer_cont}>
        {users.map((user) => (
          <VideoPlayer key={user.uid} user={user} />
        ))}
      </div>
      {!join && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "40px",
          }}
        >
          <div className={styles.end_call} onClick={handleMute}>
            {isMuted ? (
              <LiaMicrophoneSlashSolid
                style={{
                  width: "50px",
                  height: "40px",
                  cursor: "pointer",
                  color: "white",
                }}
              />
            ) : (
              <LiaMicrophoneSolid
                style={{
                  width: "50px",
                  height: "40px",
                  cursor: "pointer",
                  color: "white",
                }}
              />
            )}
          </div>
          <div className={styles.end_call} onClick={handleCamera}>
            {isCameraOff ? (
              <PiVideoCameraSlashDuotone
                style={{
                  width: "50px",
                  height: "40px",
                  cursor: "pointer",
                  color: "white",
                }}
              />
            ) : (
              <PiVideoCameraDuotone
                style={{
                  width: "50px",
                  height: "40px",
                  cursor: "pointer",
                  color: "white",
                }}
              />
            )}
          </div>
          <div className={styles.end_call} onClick={handleLeave}>
            <FcEndCall
              style={{ width: "50px", height: "40px", cursor: "pointer" }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

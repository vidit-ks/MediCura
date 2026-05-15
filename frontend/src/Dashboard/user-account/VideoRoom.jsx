import { useEffect, useRef, useState } from "react";
import { VideoPlayer } from "./VideoPlayer";
import styles from "./VideoRoom.module.css";
import playerStyles from "./VideoPlayer.module.css";
import AgoraRTC from "agora-rtc-sdk-ng";
import { FcEndCall } from "react-icons/fc";
import { useNavigate } from "react-router-dom";
import { LiaMicrophoneSolid, LiaMicrophoneSlashSolid } from "react-icons/lia";
import {
  PiVideoCameraDuotone,
  PiVideoCameraSlashDuotone,
} from "react-icons/pi";
import { BASE_URL } from "../../config";

const CHANNEL = "medicare";

export const VideoRoom = () => {
  const navigate = useNavigate();
  const clientRef = useRef(null);
  const localTracksRef = useRef([]);
  const joinedRef = useRef(false); // guard against StrictMode double-invoke

  const [remoteUsers, setRemoteUsers] = useState([]); // only remote users
  const [localVideoTrack, setLocalVideoTrack] = useState(null); // local video separately
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);
  const [status, setStatus] = useState("Connecting...");
  const [error, setError] = useState(null);

  useEffect(() => {
    // Prevent StrictMode double-invocation
    if (joinedRef.current) return;
    joinedRef.current = true;

    const client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });
    clientRef.current = client;

    // Remote user published — deduplicate by uid
    const handleUserJoined = async (user, mediaType) => {
      await client.subscribe(user, mediaType);

      if (mediaType === "video") {
        // Add remote user only once (deduplication)
        setRemoteUsers((prev) =>
          prev.find((u) => u.uid === user.uid) ? prev : [...prev, user]
        );
      }
      if (mediaType === "audio") {
        user.audioTrack.play();
      }
    };

    const handleUserLeft = (user) => {
      setRemoteUsers((prev) => prev.filter((u) => u.uid !== user.uid));
    };

    const joinRoom = async () => {
      try {
        setStatus("Getting token...");
        const res = await fetch(`${BASE_URL}/agora/token?channel=${CHANNEL}`);
        if (!res.ok) throw new Error("Failed to fetch Agora token");
        const { token, appId } = await res.json();

        client.on("user-published", handleUserJoined);
        client.on("user-left", handleUserLeft);

        setStatus("Joining channel...");
        await client.join(appId, CHANNEL, token, null);

        setStatus("Starting camera & mic...");
        const tracks = await AgoraRTC.createMicrophoneAndCameraTracks();
        const [, videoTrack] = tracks;

        localTracksRef.current = tracks;
        setLocalVideoTrack(videoTrack); // show local video separately

        await client.publish(tracks);
        setStatus("Connected");
      } catch (err) {
        console.error("VideoRoom error:", err);
        setError(err.message || "Failed to join room");
        setStatus("Error");
      }
    };

    joinRoom();

    return () => {
      client.off("user-published", handleUserJoined);
      client.off("user-left", handleUserLeft);
      for (const track of localTracksRef.current) {
        track.stop();
        track.close();
      }
      client.leave().catch(() => {});
    };
  }, []);

  const handleLeave = async () => {
    const client = clientRef.current;
    try {
      for (const track of localTracksRef.current) {
        track.stop();
        track.close();
      }
      if (localTracksRef.current.length > 0 && client) {
        await client.unpublish(localTracksRef.current);
      }
      if (client) await client.leave();
    } catch (err) {
      console.error("Leave error:", err);
    } finally {
      localTracksRef.current = [];
      joinedRef.current = false;
      setLocalVideoTrack(null);
      setRemoteUsers([]);
      navigate("/users/profile/me");
    }
  };

  const handleMute = () => {
    const audioTrack = localTracksRef.current[0];
    if (audioTrack) {
      const newMuted = !isMuted;
      audioTrack.setEnabled(!newMuted);
      setIsMuted(newMuted);
    }
  };

  const handleCamera = () => {
    const videoTrack = localTracksRef.current[1];
    if (videoTrack) {
      const newCameraOff = !isCameraOff;
      videoTrack.setEnabled(!newCameraOff);
      setIsCameraOff(newCameraOff);
    }
  };

  if (error) {
    return (
      <div
        className={styles.videoRoom_cont}
        style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "16px" }}
      >
        <p style={{ color: "red", fontSize: "16px" }}>⚠️ {error}</p>
        <button className="btn" onClick={() => navigate("/users/profile/me")}>
          Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className={styles.videoRoom_cont}>
      {status !== "Connected" && (
        <p style={{ textAlign: "center", color: "#aaa", padding: "10px" }}>
          🔄 {status}
        </p>
      )}

      <div className={styles.videoPlayer_cont}>
        {/* Local video tile */}
        {localVideoTrack && (
          <LocalVideoPlayer videoTrack={localVideoTrack} label="You" />
        )}
        {/* Remote users */}
        {remoteUsers.map((user) => (
          <VideoPlayer key={user.uid} user={user} />
        ))}
      </div>

      {/* Controls */}
      <div
        style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "40px", marginTop: "16px" }}
      >
        <div className={styles.end_call} onClick={handleMute} title={isMuted ? "Unmute" : "Mute"}>
          {isMuted ? (
            <LiaMicrophoneSlashSolid style={{ width: "50px", height: "40px", cursor: "pointer", color: "white" }} />
          ) : (
            <LiaMicrophoneSolid style={{ width: "50px", height: "40px", cursor: "pointer", color: "white" }} />
          )}
        </div>

        <div className={styles.end_call} onClick={handleCamera} title={isCameraOff ? "Turn on camera" : "Turn off camera"}>
          {isCameraOff ? (
            <PiVideoCameraSlashDuotone style={{ width: "50px", height: "40px", cursor: "pointer", color: "white" }} />
          ) : (
            <PiVideoCameraDuotone style={{ width: "50px", height: "40px", cursor: "pointer", color: "white" }} />
          )}
        </div>

        <div className={styles.end_call} onClick={handleLeave} title="End call">
          <FcEndCall style={{ width: "50px", height: "40px", cursor: "pointer" }} />
        </div>
      </div>
    </div>
  );
};

// Separate component for local video — plays the local track directly into a div
const LocalVideoPlayer = ({ videoTrack, label }) => {
  const ref = useRef();
  useEffect(() => {
    if (videoTrack && ref.current) {
      videoTrack.play(ref.current);
    }
    return () => {
      videoTrack?.stop();
    };
  }, [videoTrack]);

  return (
    <div style={{ position: "relative" }}>
      <div ref={ref} className={playerStyles.vidPlayer} />
      <span style={{
        position: "absolute", bottom: "8px", left: "8px",
        background: "rgba(0,0,0,0.5)", color: "white",
        padding: "2px 8px", borderRadius: "4px", fontSize: "12px"
      }}>
        {label}
      </span>
    </div>
  );
};

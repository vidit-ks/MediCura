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
import { BASE_URL } from "../../config";

const CHANNEL = "medicare";

const client = AgoraRTC.createClient({
  mode: "rtc",
  codec: "vp8",
});

export const VideoRoom = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [localTracks, setLocalTracks] = useState([]);
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);
  const [status, setStatus] = useState("Connecting...");
  const [error, setError] = useState(null);

  const handleUserJoined = async (user, mediaType) => {
    await client.subscribe(user, mediaType);
    if (mediaType === "video") {
      setUsers((prev) => [...prev, user]);
    }
    if (mediaType === "audio") {
      user.audioTrack.play();
    }
  };

  const handleUserLeft = (user) => {
    setUsers((prev) => prev.filter((u) => u.uid !== user.uid));
  };

  useEffect(() => {
    let tracks = [];

    const joinRoom = async () => {
      try {
        // 1. Fetch a fresh token from backend
        setStatus("Getting token...");
        const res = await fetch(`${BASE_URL}/agora/token?channel=${CHANNEL}`);
        if (!res.ok) throw new Error("Failed to fetch Agora token");
        const { token, appId } = await res.json();

        // 2. Set up event listeners
        client.on("user-published", handleUserJoined);
        client.on("user-left", handleUserLeft);

        // 3. Join the channel
        setStatus("Joining channel...");
        const uid = await client.join(appId, CHANNEL, token, null);

        // 4. Create mic + camera tracks
        setStatus("Starting camera & mic...");
        tracks = await AgoraRTC.createMicrophoneAndCameraTracks();
        const [audioTrack, videoTrack] = tracks;

        // 5. Add local user to the video grid
        setLocalTracks(tracks);
        setUsers((prev) => [...prev, { uid, videoTrack, audioTrack }]);

        // 6. Publish to the channel
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
      // Cleanup on unmount
      for (let track of tracks) {
        track.stop();
        track.close();
      }
      client.off("user-published", handleUserJoined);
      client.off("user-left", handleUserLeft);
      client.leave().catch(() => {});
    };
  }, []);

  const handleLeave = async () => {
    try {
      for (let track of localTracks) {
        track.stop();
        track.close();
      }
      if (localTracks.length > 0) {
        await client.unpublish(localTracks);
      }
      await client.leave();
    } catch (err) {
      console.error("Leave error:", err);
    } finally {
      setLocalTracks([]);
      setUsers([]);
      navigate("/users/profile/me");
    }
  };

  const handleMute = () => {
    const audioTrack = localTracks[0];
    if (audioTrack) {
      const newMuted = !isMuted;
      audioTrack.setEnabled(!newMuted);
      setIsMuted(newMuted);
    }
  };

  const handleCamera = () => {
    const videoTrack = localTracks[1];
    if (videoTrack) {
      const newCameraOff = !isCameraOff;
      videoTrack.setEnabled(!newCameraOff);
      setIsCameraOff(newCameraOff);
    }
  };

  if (error) {
    return (
      <div className={styles.videoRoom_cont} style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "16px" }}>
        <p style={{ color: "red", fontSize: "16px" }}>⚠️ {error}</p>
        <button className="btn" onClick={() => navigate("/users/profile/me")}>Back to Dashboard</button>
      </div>
    );
  }

  return (
    <div className={styles.videoRoom_cont}>
      {/* Status bar while connecting */}
      {status !== "Connected" && (
        <p style={{ textAlign: "center", color: "#aaa", padding: "10px" }}>
          🔄 {status}
        </p>
      )}

      {/* Video grid */}
      <div className={styles.videoPlayer_cont}>
        {users.map((user) => (
          <VideoPlayer key={user.uid} user={user} />
        ))}
      </div>

      {/* Controls — always visible */}
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "40px", marginTop: "16px" }}>
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

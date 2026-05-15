import { useEffect, useRef } from 'react';
import styles from "./VideoPlayer.module.css"

export const VideoPlayer = ({ user }) => {
  const ref = useRef();
  useEffect(() => {
    user.videoTrack.play(ref.current);
  }, []);
  return (
    <div >
      <div
        ref={ref}
        className={styles.vidPlayer}
      ></div>
    </div>
  );
};
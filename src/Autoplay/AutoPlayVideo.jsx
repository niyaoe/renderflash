import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { API_URL } from "../utils/api";

export default function AutoPlayVideo({ src, postId }) {
  const videoRef = useRef(null);
  const viewedRef = useRef(false);

  const [muted, setMuted] = useState(true);

  useEffect(() => {
    const video = videoRef.current;

    const observer = new IntersectionObserver(
      async ([entry]) => {
        if (entry.isIntersecting) {
          video.play().catch(() => {});

          // Count only one view
          if (!viewedRef.current) {
            viewedRef.current = true;

            try {
              const token = localStorage.getItem("token");

              await axios.post(
                `${API_URL}/api/posts/${postId}/view`,
                {},
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                }
              );
            } catch (err) {
              console.log(err);
            }
          }
        } else {
          video.pause();
        }
      },
      {
        threshold: 0.7,
      }
    );

    if (video) observer.observe(video);

    return () => {
      if (video) observer.unobserve(video);
    };
  }, [postId]);

  return (
    <video
      ref={videoRef}
      src={src}
      className="rf-video-player"
      muted={muted}
      loop
      playsInline
      onClick={() => setMuted(!muted)}
    />
  );
}
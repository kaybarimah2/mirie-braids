import { useEffect, useRef, useState } from "react";
import { api, assetUrl } from "../api";
import "./VideoTestimonials.css";

export default function VideoTestimonials() {
  const [videos, setVideos] = useState([]);
  const [index, setIndex] = useState(0);
  const [muted, setMuted] = useState(true);
  const videoRef = useRef(null);

  useEffect(() => {
    api
      .getVideoTestimonials()
      .then(setVideos)
      .catch(() => setVideos([]));
  }, []);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
  }, [index, videos.length]);

  if (videos.length === 0) return null;

  const current = videos[index];

  function goNext() {
    setIndex((i) => (i + 1) % videos.length);
  }

  function goPrev() {
    setIndex((i) => (i - 1 + videos.length) % videos.length);
  }

  return (
    <div className="video-testimonials">
      <div className="video-testimonials__stage">
        <button
          className="video-testimonials__arrow video-testimonials__arrow--prev"
          onClick={goPrev}
          aria-label="Previous video"
        >
          ‹
        </button>

        <div className="video-testimonials__frame">
          <video
            key={current.id}
            ref={videoRef}
            src={assetUrl(current.video_path)}
            autoPlay
            muted={muted}
            playsInline
            onEnded={goNext}
            className="video-testimonials__video"
          />

          <button
            className="video-testimonials__mute"
            onClick={() => setMuted((m) => !m)}
            aria-label={muted ? "Unmute video" : "Mute video"}
          >
            {muted ? "🔇" : "🔊"}
          </button>

          {current.caption && <p className="video-testimonials__caption">{current.caption}</p>}
        </div>

        <button
          className="video-testimonials__arrow video-testimonials__arrow--next"
          onClick={goNext}
          aria-label="Next video"
        >
          ›
        </button>
      </div>

      <div className="video-testimonials__dots">
        {videos.map((v, i) => (
          <button
            key={v.id}
            className={i === index ? "active" : ""}
            onClick={() => setIndex(i)}
            aria-label={`Show video ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

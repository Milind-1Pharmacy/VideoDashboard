// src/components/JumpToActionButton.tsx
import * as React from "react";
import Button from "@mui/material/Button";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import { JumpToActionButtonProps } from "../utils";
// interface JumpToActionButtonProps {
//   videoRef: React.RefObject<HTMLVideoElement | null>;
//   timestamp: string;
//   videoStartTime: string;
// }

const JumpToActionButton: React.FC<JumpToActionButtonProps> = ({
  videoRef, // Now receives the ref object
  timestamp,
  videoStartTime,
}) => {
  const handleJumpTo = () => {
    try {
      if (!videoRef.current) {
        throw new Error("Video element not initialized");
      }

      const startDate = new Date(videoStartTime);
      const eventDate = new Date(timestamp);

      if (isNaN(startDate.getTime()) || isNaN(eventDate.getTime())) {
        throw new Error("Invalid date format");
      }

      const seconds = (eventDate.getTime() - startDate.getTime()) / 1000;

      // console.log(`Jumping to: ${seconds}s`, {
      //   start: videoStartTime,
      //   event: timestamp,
      //   calculated: seconds,
      // });

      videoRef.current.currentTime = Math.max(0, seconds);
      videoRef.current.play().catch((e) => console.error("Play failed:", e));
    } catch (error) {
      console.error("Jump failed:", error);
    }
  };
  // console.log("Time Calculation:", {
  //   videoStart: new Date(videoStartTime).toISOString(),
  //   eventTime: new Date(timestamp).toISOString(),
  //   offsetSeconds: (new Date(timestamp).getTime() - new Date(videoStartTime).getTime()) / 1000,
  // });

  return (
    <Button
      variant="outlined"
      size="small"
      startIcon={<PlayArrowIcon />}
      onClick={handleJumpTo}
      sx={{ minWidth: "100px" }}
    >
      Jump to
    </Button>
  );
};

export default JumpToActionButton;

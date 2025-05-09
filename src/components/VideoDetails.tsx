import * as React from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  Paper,
  CardMedia,
  CircularProgress,
  Grid,
  useTheme,
  Collapse,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import QuestionAnswerIcon from "@mui/icons-material/QuestionAnswer";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import DescriptionIcon from "@mui/icons-material/Description";
import {
  ExpandLess,
  ExpandMore,
  Man2Rounded,
  TimelapseSharp,
  Woman2Rounded,
} from "@mui/icons-material";
import PeopleIcon from "@mui/icons-material/People";
import { formatTime } from "../utils/dateUtils";
import EventsTable from "./commanComponents/EventsTable";
import { StatusCard } from "./houseOfCards";
import { VideoDataInterface } from "../utils";

// type Gender = "M" | "F";
// type Age = number;

// interface VideoEvent {
//   timestamp: string;
//   billNumber: string | null;
//   enquiries: string[];
//   demographics?: [Gender, Age][];
//   orderImgUrl?: string;
// }

// interface VideoDataInterface {
//   id: string;
//   name: string;
//   signedUrl: string;
//   startTimestamp: string;
//   endTimestamp: string;
//   numberOfEnquiries: number;
//   numberOfSales: number;
//   transcript: string;
//   events: VideoEvent[];
// }

// API function to fetch video details
const fetchVideoDetails = async (
  videoId: string
): Promise<VideoDataInterface> => {
  const USE_MOCK_DATA = true; 
  const API_BASE_URL = "https://api.yourservice.com/videos"; 

  if (USE_MOCK_DATA) {

    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          id: videoId,
          name: "Store Recording - 22/04/2025",
          signedUrl:
            "https://1pharmacy.blob.core.windows.net/store-recordings/5000000122/event_videos/2025-04-22/20250422_185240.mp4?sp=r&st=2025-04-21T04:54:48Z&se=2025-05-30T12:54:48Z&spr=https&sv=2024-11-04&sr=c&sig=3G8E%2F8eqqbv%2F8GIIs7A%2Fo4SP4TFxEfTmOkXk6C2cn%2Bg%3D",
          startTimestamp: "2025-04-22T19:36:00Z",
          endTimestamp: "2025-04-22T19:39:04Z",
          numberOfEnquiries: 4,
          numberOfSales: 2,
          transcript:
            "00:00 - Camera activates\n" +
            "00:15 - Customer enters store\n" +
            "00:30 - Staff greets customer\n" +
            "01:05 - Product discussion begins\n" +
            "01:45 - Bill generated for first sale\n" +
            "02:30 - Second customer approaches counter\n" +
            "03:04 - Video ends",

            // bill
            // enq
            // demo
          events: [
            {
              timestamp: "2025-04-22T19:36:15Z", // 00:15
              billNumber: null,
              enquiries: ["ENQ001"],
              demographics: [["M", 32]],
            },
            {
              timestamp: "2025-04-22T19:37:45Z", // 01:45
              billNumber: "BILL220422001",
              enquiries: ["ENQ002"],
              demographics: [["F", 28]],
              orderImgUrl:
                "https://5.imimg.com/data5/SELLER/Default/2023/12/369519654/JE/LO/KB/844696/a5-size-bill-book.jpg",
            },
            {
              timestamp: "2025-04-22T19:38:10Z", // 02:10
              billNumber: null,
              enquiries: ["ENQ003"],
              demographics: [["M", 45]],
            },
            {
              timestamp: "2025-04-22T19:38:55Z", // 02:55
              billNumber: "BILL220422002",
              enquiries: ["ENQ004", "ENQ005", "ENQ005", "ENQ005"],
              orderImgUrl:
                "https://5.imimg.com/data5/SELLER/Default/2023/12/369519654/JE/LO/KB/844696/a5-size-bill-book.jpg",
              demographics: [
                ["F", 22],
                ["M", 30],
                ["F", 40],
                ["M", 50],
              ],
            },
          ],
        });
      }, 500);
    });
  } else {
    // Using actual API
    try {
      const response = await fetch(`${API_BASE_URL}/${videoId}`);

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching video details:", error);
      throw error;
    }
  }
};
const VideoDetails: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const [searchParams] = useSearchParams();
  const videoId = searchParams.get("id");
  const videoRef = React.useRef<HTMLVideoElement>(null);

  const [video, setVideo] = React.useState<VideoDataInterface | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [showTranscript, setShowTranscript] = React.useState(false);
  const [, setCurrentTime] = React.useState(0);

  React.useEffect(() => {
    if (!videoId) {
      setError("No video ID provided");
      setLoading(false);
      return;
    }

    const loadVideoDetails = async () => {
      try {
        const data = await fetchVideoDetails(videoId);
        setVideo(data);
      } catch (err) {
        setError("Failed to load video details");
      } finally {
        setLoading(false);
      }
    };

    loadVideoDetails();
  }, [videoId]);

  const durationInMinutes = () => {
    if (!video) return 0;
    const start = new Date(video.startTimestamp);
    const end = new Date(video.endTimestamp);
    const diff = (end.getTime() - start.getTime()) / (1000 * 60);
    return Math.round(diff);
  };

  const calculateTimeInVideo = (
    isoTimestamp: string,
    videoStartTime: string
  ): number => {
    const eventTime = new Date(isoTimestamp).getTime();
    const startTime = new Date(videoStartTime).getTime();
    return (eventTime - startTime) / 1000; // Convert to seconds
  };

  const jumpToTimestamp = (timestamp: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = timestamp;
      videoRef.current.play();
    }
  };

  const toggleTranscript = () => {
    setShowTranscript(!showTranscript);
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const videoStats = [
    // {
    //   title: "Date",
    //   value: video ? new Date(video.startTimestamp).toLocaleDateString() : "-",
    //   icon: <CalendarTodayIcon color="primary" />,
    //   bgColor: "rgba(76, 110, 245, 0.1)",
    //   iconColor: theme.palette.primary.main,
    // },
    {
      title: "Timing",
      value: `${
        video?.startTimestamp
          ? new Date(video.startTimestamp).toLocaleTimeString()
          : "-"
      } - ${
        video?.endTimestamp
          ? new Date(video.endTimestamp).toLocaleTimeString()
          : "-"
      }`,
      icon: <TimelapseSharp color="info" />,
      bgColor: "rgba(56, 178, 172, 0.1)",
      iconColor: theme.palette.info.main,
    },
    {
      title: "Duration",
      value: `${durationInMinutes()} mins`,
      icon: <TimelapseSharp color="info" />,
      bgColor: "rgba(56, 178, 172, 0.1)",
      iconColor: theme.palette.info.main,
    },
  ];

  const salesStats = [
    {
      title: "Enquiries ",
      value: video?.numberOfEnquiries || 0,
      icon: <QuestionAnswerIcon color="warning" />,
      bgColor: "rgba(246, 173, 85, 0.1)",
      iconColor: theme.palette.warning.main,
      variant: "h5",
    },
    {
      title: "Sales ",
      value: video?.numberOfSales || 0,
      icon: <ShoppingCartIcon color="success" />,
      bgColor: "rgba(72, 187, 120, 0.1)",
      iconColor: theme.palette.success.main,
      variant: "h5",
    },
  ];

  if (loading) {
    return (
      <Box
        sx={{
          p: 3,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "80vh",
        }}
      >
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (error || !video) {
    return (
      <Box sx={{ p: 3, textAlign: "center" }}>
        <Typography variant="h6" color="error">
          {error || "Video not found"}
        </Typography>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/")}
          sx={{ mt: 2 }}
          variant="contained"
        >
          Back to Dashboard
        </Button>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        p: { xs: 1, sm: 2, md: 3 },
        bgcolor: theme.palette.background.default,
        minHeight: "100vh",
      }}
    >
      {/* Header with back button, title and actions */}
      <Paper
        elevation={1}
        sx={{
          p: 2,
          mb: 2,
          borderRadius: 2,
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: 2,
          bgcolor: "#2e6acf",
        }}
      >
        <Button
          onClick={() => navigate(-1)}
          variant="contained"
          sx={{
            zIndex: 1000,
            color: "white",
            height: "100%",
            bgcolor: "transparent",
            transition: "border 0.3s ease",
            "&:hover": {
              border: "1px solid white",
              borderRadius: "10%",
            },
            boxShadow: "none",
          }}
        >
          <ArrowBackIcon
            sx={{ color: "white", height: "48px", width: "28px" }}
          />
        </Button>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Box>
            <Typography
              variant={"h4"}
              sx={{
                fontWeight: "bold",
                color: "white",
              }}
            >
              {video.name}
            </Typography>
            <Typography variant="body2" color="white">
              {new Date(video.startTimestamp).toLocaleDateString()} •{" "}
              {formatTime(video.startTimestamp)} -{" "}
              {formatTime(video.endTimestamp)}
            </Typography>
          </Box>
        </Box>
      </Paper>

      {/* Main content */}
      <Grid
        container
        spacing={0}
        sx={{
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        {/* Video and events column */}
        <Grid sx={{ width: "100%" }}>
          <Grid container spacing={2} height={"100%"}>
            {/* Video player */}
            <Grid sx={{ width: { sm: "100%", md: "100%", lg: "66%" } }}>
              <Paper
                elevation={3}
                sx={{
                  borderRadius: 2,
                  overflow: "hidden",
                  background: "#000",
                  width: "100%",
                }}
              >
                {/* <Button
                  onClick={() => navigate(-1)}
                  variant="contained"
                  sx={{
                    position: "absolute",
                    bgcolor: "#000",
                    zIndex: 1000,
                    color: "white",
                    height: "40px",
                    width: "20px",
                    borderRadius: "10%",
                    border: "1px solid gray",
                  }}
                >
                  <ArrowBackIcon
                    sx={{ color: "white", height: "48px", width: "28px" }}
                  />
                </Button> */}

                <CardMedia
                  component="video"
                  controls
                  src={video.signedUrl}
                  poster="/video-placeholder.jpg"
                  ref={videoRef}
                  onTimeUpdate={handleTimeUpdate}
                  sx={{
                    width: "100%",
                    objectFit: "contain",
                    height: "540px",
                    boxShadow: "none",
                  }}
                />
              </Paper>
            </Grid>
            <Grid
              sx={{
                width: { lg: "32%", md: "100%", sm: "100%" },
                display: "flex",
                alignItems: "flex-start",
                height: "100%",

                maxHeight: "560px",
              }}
            >
              <EventsTable
                events={(video?.events || []).map((event) => ({
                  ...event,
                  billNumber: event.billNumber ?? undefined,
                  timestamp: calculateTimeInVideo(
                    event.timestamp,
                    video.startTimestamp
                  ),
                  demographics: event.demographics?.map(([gender, age]) => [
                    gender as string,
                    age,
                  ]),
                }))}
                jumpToTimestamp={jumpToTimestamp}
              />
            </Grid>
          </Grid>
        </Grid>

        {/* Stats and demographics column */}
        <Grid sx={{ width: "100%", display: "flex", boxShadow: "none" }}>
          <Paper
            sx={{
              p: 2,
              borderRadius: 2,
              height: "100%",
              background: "white",
              border: `1px solid ${theme.palette.divider}`,
              width: { lg: "100%", md: "100%" },
              maxHeight: "560px",
              display: "flex",
              justifyContent: "space-between",
              boxShadow: "none",
            }}
          >
            {/* Stats section */}
            <Box width={"32%"}>
              <Typography
                variant="h6"
                sx={{
                  mb: 2,
                  fontWeight: "bold",
                  color: theme.palette.text.primary,
                  borderBottom: `2px solid ${theme.palette.primary.main}`,
                  pb: 1,
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <DescriptionIcon sx={{ mr: 1 }} /> Recording Summary
              </Typography>

              <Grid container spacing={2}>
                {videoStats.map((stat, index) => (
                  <Grid key={index}>
                    <StatusCard
                      title={stat.title}
                      value={stat.value}
                      icon={stat.icon}
                      bgColor={stat.bgColor}
                      iconColor={stat.iconColor}
                    />
                  </Grid>
                ))}
              </Grid>
            </Box>
            <Box width={"30%"}>
              <Typography
                variant="h6"
                sx={{
                  mb: 2,
                  fontWeight: "bold",
                  color: theme.palette.text.primary,
                  borderBottom: `2px solid ${theme.palette.info.main}`,
                  pb: 1,
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <PeopleIcon sx={{ mr: 1 }} /> Recorded Sales
              </Typography>
              <Grid container spacing={2}>
                {salesStats.map((stat, index) => (
                  <Grid key={index}>
                    <StatusCard
                      title={stat.title}
                      value={stat.value}
                      icon={stat.icon}
                      bgColor={stat.bgColor}
                      iconColor={stat.iconColor}
                      variant={stat.variant}
                    />
                  </Grid>
                ))}
              </Grid>
            </Box>
            {/* Demographics section */}
            <Box width={"32%"}>
              <Typography
                variant="h6"
                sx={{
                  mb: 2,
                  fontWeight: "bold",
                  color: theme.palette.text.primary,
                  borderBottom: `2px solid ${theme.palette.secondary.main}`,
                  pb: 1,
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <PeopleIcon sx={{ mr: 1 }} /> Customer Demographics
              </Typography>

              {/* Demographic stats */}
              <Grid container spacing={2}>
                <Grid>
                  {/* <StatusCard
                    title={stat.title}
                    value={stat.value}
                    icon={stat.icon}
                    bgColor={stat.bgColor}
                    iconColor={stat.iconColor}
                    variant={stat.variant}
                  /> */}
                  <StatusCard
                    title="Male Count"
                    value={
                      (video.events ?? [])
                        .flatMap((e) => e.demographics || [])
                        .filter((d) => d[0] === "M").length
                    }
                    icon={<Man2Rounded color="primary" />}
                    bgColor="rgba(133, 89, 255, 0.1)"
                    iconColor={theme.palette.primary.main}
                    variant="h5"
                  />
                </Grid>
                <Grid>
                  <StatusCard
                    title="Female Count"
                    value={
                      (video.events ?? [])
                        .flatMap((e) => e.demographics || [])
                        .filter((d) => d[0] === "F").length
                    }
                    icon={
                      <Woman2Rounded
                        color="secondary"
                        fontSize={"medium"}
                        sx={{
                          height: "24px",
                          width: "24px",
                        }}
                      />
                    }
                    bgColor="rgba(255, 99, 132, 0.1)"
                    iconColor={theme.palette.secondary.main}
                    variant="h5"
                  />
                </Grid>
              </Grid>
            </Box>
            {/* <Button
              startIcon={<DownloadIcon />}
              onClick={() => window.open(video.signedUrl, "_blank")}
              variant="contained"
              size={"medium"}
              sx={{
                borderRadius: 2,
                alignSelf: "center",
                background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                mt: 2,
                width: "100%",
              }}
            >
              Download Recording
            </Button> */}
          </Paper>
        </Grid>
        {/* Transcript Section */}
        <Grid
          sx={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
            boxShadow: "none",
          }}
        >
          <Paper
            elevation={2}
            sx={{
              borderRadius: 2,
              overflow: "hidden",

              width: { lg: "100%", md: "100%" },
              marginTop: 2,
              boxShadow: "none",
              border: `1px solid ${theme.palette.divider}`,
            }}
          >
            <Box
              sx={{
                p: 2,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                borderBottom: showTranscript ? 1 : 0,
                borderColor: "divider",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <DescriptionIcon sx={{ mr: 1 }} />
                <Typography variant="h6">Transcript</Typography>
              </Box>
              <Button
                variant="outlined"
                endIcon={showTranscript ? <ExpandLess /> : <ExpandMore />}
                onClick={toggleTranscript}
              >
                {showTranscript ? "Hide" : "Show"}
              </Button>
            </Box>
            <Collapse in={showTranscript}>
              <Box
                sx={{
                  p: 2,
                  bgcolor: "background.paper",
                  maxHeight: "300px",
                  overflowY: "auto",
                }}
              >
                <Typography
                  variant="body2"
                  component="pre"
                  sx={{
                    whiteSpace: "pre-line",
                    fontFamily: "monospace",
                  }}
                >
                  {video.transcript}
                </Typography>
              </Box>
            </Collapse>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default VideoDetails;

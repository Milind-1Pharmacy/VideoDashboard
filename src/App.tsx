// src/App.tsx
import * as React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";
import VideoAnalyticsTable from "./components/ListView";
import {
  Snackbar,
  Alert,
  Box,
  Typography,
  Paper,
  Button,
  Stack,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { Header } from "./components";
import { mockData } from "./mockdata";
import RefreshIcon from "@mui/icons-material/Refresh";
import StorefrontIcon from "@mui/icons-material/Storefront";
import DonutLargeIcon from "@mui/icons-material/DonutLarge";
import {
  DateFilterButton,
  EmptyStateView,
} from "./components/commanComponents";
import VideoDetails from "./components/VideoDetails";
import { VideoDataInterface } from "./utils";

const AppContent: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();

  const [openSnackbar, setOpenSnackbar] = React.useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = React.useState<string>("");
  const [snackbarSeverity, setSnackbarSeverity] = React.useState<
    "success" | "info" | "warning" | "error"
  >("info");
  const [loading, setLoading] = React.useState<boolean>(true);
  const [allData, setAllData] = React.useState<VideoDataInterface[]>([]);
  const [filteredData, setFilteredData] = React.useState<VideoDataInterface[]>(
    []
  );
  const [refreshing, setRefreshing] = React.useState<boolean>(false);
  const [startDate, setStartDate] = React.useState<Date | null>(null);
  const [endDate, setEndDate] = React.useState<Date | null>(null);
  const [isFiltered, setIsFiltered] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string | null>(null);

  // Simulated API call using mock data
  const fetchVideos = async () => {
    setLoading(true);
    setError(null);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Simulate API response with mock data
      const response = {
        ok: true,
        json: async () => mockData,
      };

      if (!response.ok) {
        throw new Error("Failed to fetch videos");
      }

      const data = await response.json();
      setAllData(data);
      setFilteredData(data);
      setSnackbarMessage("Data loaded successfully");
      setSnackbarSeverity("success");
      setOpenSnackbar(true);
    } catch (err) {
      console.error("Error fetching videos:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch videos");
      setSnackbarMessage("Failed to load data");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  React.useEffect(() => {
    fetchVideos();
  }, []);

  React.useEffect(() => {
    if (!loading && allData.length > 0) {
      filterDataByDateRange();
    }
  }, [startDate, endDate, allData, loading]);

  const filterDataByDateRange = () => {
    if (!startDate && !endDate) {
      setFilteredData(allData);
      setIsFiltered(false);
      return;
    }

    setIsFiltered(true);

    const filtered = allData.filter((video) => {
      const videoStartDate = new Date(video.startTimestamp);

      if (startDate && !endDate) {
        return videoStartDate >= startDate;
      }

      if (!startDate && endDate) {
        return videoStartDate <= endDate;
      }

      if (startDate && endDate) {
        return videoStartDate >= startDate && videoStartDate <= endDate;
      }

      return true;
    });

    setFilteredData(filtered);

    if (startDate || endDate) {
      setSnackbarMessage(`Filter applied: ${filtered.length} videos found`);
      setSnackbarSeverity("info");
      setOpenSnackbar(true);
    }
  };

  const handleViewVideo = (video: VideoDataInterface) => {
    console.log("onView Clicked", video);

    navigate(`/video-details?id=${video.id}`, { state: { video } });
    setSnackbarMessage(`Viewing video: ${video.name}`);
    setSnackbarSeverity("info");
    setOpenSnackbar(true);
  };

  const handleSaveVideo = (video: VideoDataInterface) => {
    const link = document.createElement("a");
    if (video.downloadUrl) {
      link.href = video.downloadUrl;
    } else {
      console.error("Download URL is undefined");
      return;
    }
    link.download = `${video.name}.mp4`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setSnackbarMessage(`Saved video: ${video.name}`);
    setSnackbarSeverity("success");
    setOpenSnackbar(true);
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const handleRefresh = () => {
    setRefreshing(true);
    setStartDate(null);
    setEndDate(null);
    setIsFiltered(false);
    fetchVideos();
  };

  const handleDateChange = (start: Date | null, end: Date | null) => {
    if (start) {
      const newStart = new Date(start);
      newStart.setHours(0, 0, 0, 0);
      setStartDate(newStart);
    } else {
      setStartDate(null);
    }

    if (end) {
      const newEnd = new Date(end);
      newEnd.setHours(23, 59, 59, 999);
      setEndDate(newEnd);
    } else {
      setEndDate(null);
    }
  };

  const clearFilters = () => {
    setStartDate(null);
    setEndDate(null);
    setIsFiltered(false);
    setFilteredData(allData);
    setSnackbarMessage("Filters cleared");
    setSnackbarSeverity("info");
    setOpenSnackbar(true);
  };

  return (
    <Box
      sx={{
        backgroundColor: "#f8fafc",
        minHeight: "100vh",
      }}
    >
      <Box sx={{ width: "100%", padding: "16px " }}>
        <Paper
          elevation={0}
          sx={{
            mb: 2.6,
            p: 3,
            borderRadius: 3,
            backgroundColor: "#2e6acf",
            color: "white",
            border: "1px solid rgba(0,0,0,0.1)",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >
            <Box>
              <Stack direction="row" spacing={2} alignItems="center">
                <StorefrontIcon sx={{ fontSize: 32 }} />
                <Typography
                  variant="h4"
                  component="h1"
                  sx={{ fontWeight: 600 }}
                >
                  Retail Intelligence Hub
                </Typography>
              </Stack>
              <Typography variant="body1" sx={{ maxWidth: 900, opacity: 0.9 }}>
                Advanced customer behavior analytics & business performance
                metrics
              </Typography>
            </Box>
            <Box
              sx={{
                mt: isMobile ? 2 : 0,
                display: "flex",
                gap: 2,
              }}
            >
              <DateFilterButton
                startDate={startDate}
                endDate={endDate}
                onDateChange={handleDateChange}
                isFiltered={isFiltered}
                onClearFilters={clearFilters}
              />

              <Button
                variant="contained"
                onClick={handleRefresh}
                disabled={refreshing}
                sx={{
                  bgcolor: "rgba(255,255,255,0.2)",
                  backdropFilter: "blur(10px)",
                  color: "white",
                  "&:hover": {
                    bgcolor: "rgba(255,255,255,0.3)",
                  },
                  height: 40,
                  width: 30,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {refreshing ? <DonutLargeIcon /> : <RefreshIcon />}
              </Button>
            </Box>
          </Box>
        </Paper>

        {error ? (
          <Box
            sx={{
              textAlign: "center",
              py: 6,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              height: 300,
              backgroundColor: "#f5f7fa",
              borderRadius: 3,
            }}
          >
            <Typography variant="h6" color="error" gutterBottom>
              Error loading data
            </Typography>
            <Typography color="text.secondary" sx={{ mb: 2 }}>
              {error}
            </Typography>
            <Button
              variant="outlined"
              onClick={fetchVideos}
              sx={{ mt: 2 }}
              startIcon={<RefreshIcon />}
            >
              Retry
            </Button>
          </Box>
        ) : loading ? (
          <EmptyStateView loading={loading} isFiltered={isFiltered} />
        ) : filteredData.length === 0 && isFiltered ? (
          <EmptyStateView loading={false} isFiltered={true} />
        ) : (
          <VideoAnalyticsTable
            data={filteredData}
            onView={handleViewVideo}
            onSave={handleSaveVideo}
          />
        )}

        <Snackbar
          open={openSnackbar}
          autoHideDuration={1800}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
        >
          <Alert
            onClose={handleCloseSnackbar}
            severity={snackbarSeverity}
            sx={{ width: "100%" }}
            variant="filled"
          >
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </Box>
    </Box>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<AppContent />} />
        <Route path="/video-details" element={<VideoDetails />} />
      </Routes>
    </Router>
  );
};

export default App;

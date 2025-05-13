import React, { useRef, useState, useCallback, memo, useEffect } from "react";
import {
  Box,
  Button,
  ButtonGroup,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  Collapse,
  IconButton,
  Grid,
  darken,
  Snackbar,
  Alert,
  CircularProgress,
  Skeleton,
  Backdrop,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import HomeIcon from "@mui/icons-material/Home";
import ApartmentIcon from "@mui/icons-material/Apartment";
import EqualizerIcon from "@mui/icons-material/Equalizer";
import PeopleIcon from "@mui/icons-material/People";
import { heatMapData as defaultMapData } from "../HeatMap";
import { StatCard } from "./houseOfCards";
import { useNavigate } from "react-router-dom";
import { HomeFilled } from "@mui/icons-material";

// Define interfaces for our data structure
interface Flat {
  title: string;
  conversion: number;
}

interface Floor {
  title: string;
  conversion: number;
  flats: Flat[];
}

interface Block {
  title: string;
  conversion: number;
  floors: Floor[];
}

interface HeatMapDataType {
  data: {
    totalApartment: number;
    activeApartment: number;
    percentGrowth: number;
    blocks: Block[];
  };
}

// Get color based on conversion rate - memoized with useCallback
const getConversionColor = (percentage: number): string => {
  if (percentage >= 60) {
    return "#4CAF50"; // Green
  } else if (percentage >= 40) {
    return "#FFC107"; // Amber
  } else if (percentage >= 20) {
    return "#FF9800"; // Orange
  } else {
    return "#F44336"; // Red
  }
};

// Background gradient based on conversion rate
const getGradientBackground = (percentage: number): string => {
  if (percentage >= 70) {
    return "linear-gradient(to bottom, rgba(76, 175, 80, 0.1), rgba(76, 175, 80, 0.05))";
  } else if (percentage >= 50) {
    return "linear-gradient(to bottom, rgba(255, 193, 7, 0.1), rgba(255, 193, 7, 0.05))";
  } else if (percentage >= 30) {
    return "linear-gradient(to bottom, rgba(255, 152, 0, 0.1), rgba(255, 152, 0, 0.05))";
  } else {
    return "linear-gradient(to bottom, rgba(244, 67, 54, 0.1), rgba(244, 67, 54, 0.05))";
  }
};

// Memoized Flat component to prevent unnecessary re-renders
const FlatItem = memo(
  ({
    flat,
    onFlatClick,
  }: {
    flat: Flat;
    onFlatClick: (flat: Flat) => void;
  }) => {
    return (
      <Box
        sx={{
          width: "calc(20% - 8px)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          p: 1,
          borderRadius: "8px",
          transition: "all 0.2s",
          backgroundColor: "#fff",
          boxShadow: "0 2px 5px rgba(0,0,0,0.05)",
          border: `1px solid ${getConversionColor(flat.conversion)}30`,
          "&:hover": {
            transform: "translateY(-2px)",
            boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
            cursor: "pointer",
          },
        }}
        onClick={() => onFlatClick(flat)}
      >
        <HomeIcon
          sx={{
            color: getConversionColor(flat.conversion),
            fontSize: "1.6rem",
            mb: 0.5,
          }}
        />
        <Typography
          variant="caption"
          sx={{
            fontWeight: 600,
            color: "#455a64",
            mb: 0.5,
          }}
        >
          {flat.title}
        </Typography>
      </Box>
    );
  }
);

// Memoized Floor component
const FloorItem = memo(
  ({
    floor,
    floorIndex,
    totalFloors,
    isExpanded,
    toggleFloor,
    onFlatClick,
  }: {
    floor: Floor;
    floorIndex: number;
    totalFloors: number;
    blockTitle: string;
    isExpanded: boolean;
    toggleFloor: () => void;
    onFlatClick: (flat: Flat) => void;
  }) => {
    return (
      <React.Fragment>
        <ListItem
          sx={{
            backgroundColor: getConversionColor(floor.conversion),
            borderBottom: "1px solid rgba(0,0,0,0.06)",
            padding: "12px 16px",
            cursor: "pointer",
            transition: "background-color 0.2s",
            "&:hover": {
              backgroundColor: darken(
                getConversionColor(floor.conversion),
                0.2
              ),
            },
          }}
          onClick={toggleFloor}
          secondaryAction={
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Typography
                variant="body2"
                sx={{
                  mr: 1,
                  fontWeight: 600,
                  color: "#FFFF",
                }}
              >
                {floor.conversion}%
              </Typography>
              <IconButton
                edge="end"
                sx={{
                  color: "#78909c",
                }}
              >
                {isExpanded ? (
                  <ExpandLessIcon sx={{ color: "#FFF" }} />
                ) : (
                  <ExpandMoreIcon sx={{ color: "#FFF" }} />
                )}
              </IconButton>
            </Box>
          }
        >
          <ListItemText
            primary={
              <Typography
                sx={{
                  color: "#FFF",
                  fontWeight: 500,
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <Box
                  component="span"
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "28px",
                    height: "28px",
                    borderRadius: "50%",
                    bgcolor: "#eceff1",
                    mr: 1.5,
                    fontSize: "0.85rem",
                    fontWeight: 600,
                    color: "#455a64",
                  }}
                >
                  {totalFloors - floorIndex}
                </Box>
                {floor.title}
              </Typography>
            }
          />
        </ListItem>

        <Collapse in={isExpanded} timeout="auto" unmountOnExit>
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: "10px",
              p: 2,
              bgcolor: "#f5f7fa",
              borderBottom: "1px solid #e0e0e0",
            }}
          >
            {floor.flats.map((flat) => (
              <FlatItem
                key={flat.title}
                flat={flat}
                onFlatClick={onFlatClick}
              />
            ))}
          </Box>
        </Collapse>
      </React.Fragment>
    );
  }
);

// Memoized Block component
const BlockComponent = memo(
  ({
    block,
    blockRef,
    expandedFloors,
    toggleFloor,
    handleFlatClick,
  }: {
    block: Block;
    isActive: boolean;
    blockRef: (element: HTMLDivElement | null) => void;
    expandedFloors: Record<string, boolean>;
    toggleFloor: (blockTitle: string, floorTitle: string) => void;
    handleFlatClick: (flat: Flat, block: Block, floor: Floor) => void;
  }) => {
    const reversedFloors = [...block.floors].reverse();

    const floorsContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      if (floorsContainerRef.current) {
        floorsContainerRef.current.scrollTop =
          floorsContainerRef.current.scrollHeight;
      }
    }, []);

    return (
      <Paper
        ref={blockRef}
        elevation={0}
        sx={{
          width: "380px",
          flexShrink: 0,
          borderRadius: 2,
          boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
          transition: "transform 0.3s, box-shadow 0.3s",
          border: `1px solid ${getConversionColor(block.conversion)}20`,
          position: "relative",
          "&:hover": {
            transform: "translateY(-5px)",
            boxShadow: "0 8px 25px rgba(0,0,0,0.15)",
          },
          "&:before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "4px",
            backgroundColor: getConversionColor(block.conversion),
          },
        }}
      >
        {/* Block title with conversion rate */}
        <Box
          sx={{
            p: 2,
            textAlign: "center",
            background: getGradientBackground(block.conversion),
            borderBottom: "1px solid rgba(0,0,0,0.04)",
            position: "sticky",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mb: 1,
            }}
          >
            <ApartmentIcon
              sx={{
                color: getConversionColor(block.conversion),
                fontSize: "1.8rem",
                mr: 1,
              }}
            />
            <Typography
              variant="h6"
              sx={{
                fontWeight: 600,
                color: "#455a64",
              }}
            >
              {block.title}
            </Typography>
          </Box>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mt: 1,
            }}
          >
            <Box
              sx={{
                width: "100%",
                backgroundColor: "#e0e0e0",
                height: "8px",
                borderRadius: "4px",
                overflow: "hidden",
              }}
            >
              <Box
                sx={{
                  width: `${block.conversion}%`,
                  height: "100%",
                  backgroundColor: getConversionColor(block.conversion),
                }}
              />
            </Box>
            <Typography
              variant="body2"
              sx={{
                ml: 1.5,
                fontWeight: 600,
                color: getConversionColor(block.conversion),
                minWidth: "40px",
              }}
            >
              {block.conversion}%
            </Typography>
          </Box>
        </Box>

        {/* Floors */}
        <Box
          ref={floorsContainerRef}
          sx={{
            maxHeight: "400px",
            overflowY: "auto",
          }}
        >
          <List>
            {reversedFloors.map((floor, ind) => (
              <FloorItem
                key={floor.title}
                floor={floor}
                floorIndex={ind}
                totalFloors={block.floors.length}
                blockTitle={block.title}
                isExpanded={!!expandedFloors[`${block.title}-${floor.title}`]}
                toggleFloor={() => toggleFloor(block.title, floor.title)}
                onFlatClick={(flat) => handleFlatClick(flat, block, floor)}
              />
            ))}
          </List>
        </Box>

        {/* Building base */}
        <Box
          sx={{
            height: "15px",
            backgroundColor: "#455a64",
            borderTop: "1px solid rgba(0,0,0,0.1)",
          }}
        />
      </Paper>
    );
  }
);

// Main component
const ApartmentHeatmap: React.FC = () => {
  // Data loading state
  const [loading, setLoading] = useState<boolean>(true);
  const [heatMapData, setHeatMapData] = useState<HeatMapDataType | null>(null);
  const [loadingProgress, setLoadingProgress] = useState<number>(0);
  const [blockLoadingStates, setBlockLoadingStates] = useState<
    Record<string, boolean>
  >({});

  const [activeBlock, setActiveBlock] = useState<string | null>(null);
  const [expandedFloors, setExpandedFloors] = useState<Record<string, boolean>>(
    {}
  );
  const blockRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  // Snackbar state
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<
    "success" | "error" | "warning" | "info"
  >("success");

  const navigate = useNavigate();

  // Simulate API call to fetch data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setLoadingProgress(0);

      // Simulate initial data loading
      await new Promise((resolve) => setTimeout(resolve, 800));
      setLoadingProgress(30);

      // Simulate processing data
      await new Promise((resolve) => setTimeout(resolve, 800));
      setLoadingProgress(60);

      // Simulate final data preparation
      await new Promise((resolve) => setTimeout(resolve, 800));
      setLoadingProgress(100);

      // Set the data
      setHeatMapData(defaultMapData);

      // Simulate block loading when data is received
      if (defaultMapData?.data?.blocks) {
        const initialBlockStates: Record<string, boolean> = {};
        defaultMapData.data.blocks.forEach((block) => {
          initialBlockStates[block.title] = true;
        });
        setBlockLoadingStates(initialBlockStates);

        // Simulate each block loading with a slight delay between them
        for (const block of defaultMapData.data.blocks) {
          await new Promise((resolve) => setTimeout(resolve, 300));
          setBlockLoadingStates((prev) => ({
            ...prev,
            [block.title]: false,
          }));
        }
      }

      setLoading(false);
    };

    fetchData();
  }, []);

  // Function to show snackbar with custom message and severity
  const showSnackbar = useCallback(
    (
      message: string,
      severity: "success" | "error" | "warning" | "info" = "info"
    ) => {
      setSnackbarMessage(message);
      setSnackbarSeverity(severity);
      setSnackbarOpen(true);
    },
    []
  );

  const registerBlockRef = useCallback(
    (blockTitle: string, element: HTMLDivElement | null) => {
      if (element) {
        blockRefs.current[blockTitle] = element;
      }
    },
    []
  );
  // Scroll to block - memoized
  const scrollToBlock = useCallback(
    (blockTitle: string) => {
      const blockElement = blockRefs.current[blockTitle];
      const container = scrollContainerRef.current;

      if (blockElement && container) {
        // Calculate the position to scroll to
        const containerWidth = container.offsetWidth;
        const blockLeft = blockElement.offsetLeft;
        const blockWidth = blockElement.offsetWidth;

        // Calculate the scroll position to center the block
        const scrollTo = blockLeft - containerWidth / 2 + blockWidth / 2;

        // Smooth scroll to the calculated position
        container.scrollTo({
          left: scrollTo,
          behavior: "smooth",
        });

        setActiveBlock(blockTitle);
        showSnackbar(`Viewing ${blockTitle}`, "success");
      }
    },
    [showSnackbar]
  );

  // Toggle floor - memoized
  const toggleFloor = useCallback((blockTitle: string, floorTitle: string) => {
    const key = `${blockTitle}-${floorTitle}`;
    setExpandedFloors((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  }, []);

  // Handle flat click based on conversion rate - memoized
  const handleFlatClick = useCallback(
    (flat: Flat, block: Block, floor: Floor) => {
      if (flat.conversion > 0) {
        console.log(
          flat.title,
          block.title.split(" ")[1],
          floor.title.split(" ")[1]
        );

        const BlockId = block.title.split(" ")[1];
        const FloorId = floor.title.split(" ")[1];

        navigate(
          `/bill-details?blockId=${BlockId}&floorId=${FloorId}&flatId=${flat.title}`
        );
        showSnackbar(`Navigating to details for ${flat.title}`, "success");
      } else {
        showSnackbar(`No customers from ${flat.title}`, "warning");
      }
    },
    [navigate, showSnackbar]
  );

  // If still loading the initial data, show loading screen
  if (loading && !heatMapData) {
    return (
      <Box
        sx={{
          width: "100%",
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          bgcolor: "#f8f9fa",
        }}
      >
        <CircularProgress
          variant="determinate"
          value={loadingProgress}
          size={80}
          thickness={4}
          sx={{ mb: 3 }}
        />
        <Typography variant="h6" sx={{ mb: 1 }}>
          Loading Apartment Data
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {loadingProgress < 30
            ? "Connecting to server..."
            : loadingProgress < 60
            ? "Processing apartment data..."
            : loadingProgress < 100
            ? "Preparing visualization..."
            : "Almost ready..."}
        </Typography>
      </Box>
    );
  }

  // Data is null protection
  if (!heatMapData) {
    return (
      <Box sx={{ p: 3, textAlign: "center" }}>
        <Typography variant="h5" color="error">
          Error loading data. Please try again later.
        </Typography>
      </Box>
    );
  }

  const conversionRatio = (
    (heatMapData.data.activeApartment / heatMapData.data.totalApartment) *
    100
  ).toFixed(1);

  function handleCloseSnackbar(reason?: string): void {
    if (reason === "clickaway") {
      return;
    }
    setSnackbarOpen(false);
  }
  return (
    <Box sx={{ width: "100%", p: 3, bgcolor: "#f8f9fa" }}>
      {/* Title */}
      <Typography
        variant="h4"
        sx={{
          fontWeight: 600,
          mb: 6,
          textAlign: "center",
          color: "#37474f",
        }}
      >
        Apartment Conversion Heatmap
      </Typography>

      {/* Header Stats */}
      <Grid
        container
        spacing={2}
        sx={{ mb: 4, display: "flex", justifyContent: "flex-start" }}
      >
        <Grid sx={{ minWidth: "20%" }}>
          <StatCard
            icon={<ApartmentIcon />}
            title="Total Households"
            value={heatMapData.data.totalApartment}
            label="Number of apartments"
            mainColor="#3366CC"
            lightColor="#E6EEF9"
          />
        </Grid>
        <Grid sx={{ minWidth: "20%" }}>
          <StatCard
            icon={<HomeFilled />}
            title="Active Households"
            value={heatMapData.data.activeApartment}
            label="Currently active"
            mainColor="#8B5CF6"
            lightColor="#F3EAFF"
          />
        </Grid>
        <Grid sx={{ minWidth: "20%" }}>
          <StatCard
            icon={<EqualizerIcon />}
            title="Conversion Ratio"
            value={`${conversionRatio}%`}
            label="Active / Total"
            mainColor="#0EA5E9"
            lightColor="#E0F7FF"
          />
        </Grid>
        <Grid sx={{ minWidth: "20%" }}>
          <StatCard
            icon={<PeopleIcon />}
            title="Total Customer"
            value={`517`}
            label="Presently Active"
            mainColor="#16A34A"
            lightColor="#DCFCE7"
          />
        </Grid>
      </Grid>

      {/* Block Navigation */}
      <Box
        sx={{ display: "flex", justifyContent: "center", mb: 3, width: "100%" }}
      >
        <ButtonGroup
          variant="outlined"
          sx={{
            overflowX: "auto",
            boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
            bgcolor: "white",
            borderRadius: 2,
            p: 1,
            width: "100%",
            "& .MuiButton-root": {
              borderRadius: 1,
              mx: 0.5,
              fontWeight: 500,
              minWidth: "110px",
            },
            justifyContent: "space-evenly",
          }}
        >
          {heatMapData.data.blocks.map((block) => (
            <Button
              key={block.title}
              onClick={() => scrollToBlock(block.title)}
              variant={activeBlock === block.title ? "contained" : "text"}
              disabled={blockLoadingStates[block.title]}
              sx={{
                color:
                  activeBlock === block.title
                    ? "#fff"
                    : getConversionColor(block.conversion),
                borderColor:
                  activeBlock === block.title
                    ? "primary.main"
                    : getConversionColor(block.conversion),
                backgroundColor:
                  activeBlock === block.title
                    ? getConversionColor(block.conversion)
                    : "transparent",
                "&:hover": {
                  backgroundColor:
                    activeBlock === block.title
                      ? getConversionColor(block.conversion)
                      : `${getConversionColor(block.conversion)}55`,
                },
                borderWidth: 1.5,
              }}
            >
              {blockLoadingStates[block.title] ? (
                <CircularProgress size={20} sx={{ mr: 1 }} />
              ) : null}
              {block.title}
            </Button>
          ))}
        </ButtonGroup>
      </Box>

      {/* Buildings container */}
      <Box
        ref={scrollContainerRef}
        sx={{
          display: "flex",
          gap: 2,
          overflowX: "auto",
          py: 2,
          px: 1,
          scrollBehavior: "smooth",
          "&::-webkit-scrollbar": {
            height: "6px",
          },
          "&::-webkit-scrollbar-track": {
            backgroundColor: "#f1f1f1",
            borderRadius: "10px",
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "#bdbdbd",
            borderRadius: "10px",
          },
          maxHeight: "800px",
          overflowY: "auto",
        }}
      >
        {heatMapData.data.blocks.map((block) => {
          const isLoading = blockLoadingStates[block.title];

          if (isLoading) {
            // Show skeleton while loading
            return (
              <Paper
                key={block.title}
                elevation={0}
                sx={{
                  width: "380px",
                  flexShrink: 0,
                  borderRadius: 2,
                  boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
                  overflow: "hidden",
                }}
              >
                <Box sx={{ p: 2 }}>
                  <Skeleton
                    variant="rectangular"
                    height={60}
                    sx={{ mb: 2, borderRadius: 1 }}
                  />
                  <Skeleton
                    variant="rectangular"
                    height={40}
                    sx={{ mb: 2, borderRadius: 1 }}
                  />
                  <Skeleton
                    variant="rectangular"
                    height={100}
                    sx={{ mb: 2, borderRadius: 1 }}
                  />
                  <Skeleton
                    variant="rectangular"
                    height={100}
                    sx={{ mb: 2, borderRadius: 1 }}
                  />
                  <Skeleton
                    variant="rectangular"
                    height={100}
                    sx={{ borderRadius: 1 }}
                  />
                </Box>
              </Paper>
            );
          }

          return (
            <BlockComponent
              key={block.title}
              block={block}
              isActive={activeBlock === block.title}
              blockRef={(el: any) => registerBlockRef(block.title, el)}
              expandedFloors={expandedFloors}
              toggleFloor={toggleFloor}
              handleFlatClick={(flat: Flat, block: Block, floor: Floor) =>
                handleFlatClick(flat, block, floor)
              }
            />
          );
        })}
      </Box>

      {/* Snackbar component with Alert for better styling */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={2000}
        onClose={(_, reason) => handleCloseSnackbar(reason)}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
          elevation={6}
          variant="filled"
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>

      {/* Fullscreen loading indicator for API actions */}
      <Backdrop
        sx={{
          color: "#fff",
          zIndex: (theme) => theme.zIndex.drawer + 1,
          flexDirection: "column",
        }}
        open={loading && !!heatMapData}
      >
        <CircularProgress color="inherit" />
        <Typography sx={{ mt: 2 }}>Processing data...</Typography>
      </Backdrop>
    </Box>
  );
};

export default ApartmentHeatmap;

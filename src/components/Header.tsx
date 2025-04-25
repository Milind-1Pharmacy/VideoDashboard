import * as React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
  Avatar,
  Badge,
  Tooltip,
} from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import VideocamIcon from "@mui/icons-material/Videocam";

// Define the primary color
const PRIMARY_COLOR = "#2e6acf";

export const Header = () => {
  return (
    <AppBar
      position="sticky"
      color="default"
      elevation={0}
      sx={{
        backgroundColor: "white",
        borderBottom: "1px solid #e0e0e0",
        display: "flex",
        justifyContent: "space-between",
        maxHeight: 48,
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          height: 48,
          maxHeight: 48,
          padding: "0 32px",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <VideocamIcon
            sx={{
              color: PRIMARY_COLOR,
              fontSize: 28,
              mr: 1.5,
            }}
          />
          <Typography
            variant="h6"
            component="div"
            sx={{
              fontWeight: 600,
              color: PRIMARY_COLOR,
              fontSize: 16,
            }}
          >
            Video Analytics
          </Typography>
        </Box>
      </Box>
    </AppBar>
  );
};

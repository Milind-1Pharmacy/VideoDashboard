import { Box, Button, Typography } from "@mui/material";
import TruckLoader from "./LoadingOverlay";
import FilterListIcon from "@mui/icons-material/FilterList";
import VideocamOffIcon from "@mui/icons-material/VideocamOff";
import RefreshIcon from "@mui/icons-material/Refresh";

const EmptyStateView: React.FC<{ loading: boolean; isFiltered: boolean }> = ({
  loading,
  isFiltered,
}) => (
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
    {loading ? (
      <>
        <TruckLoader />
      </>
    ) : isFiltered ? (
      <>
        <FilterListIcon sx={{ fontSize: 60, color: "#9e9e9e", mb: 2 }} />
        <Typography variant="h6" color="text.secondary" gutterBottom>
          No data available for the selected date range
        </Typography>
        <Button
          variant="outlined"
          sx={{ mt: 2 }}
          onClick={() => window.location.reload()}
        >
          Clear Filters
        </Button>
      </>
    ) : (
      <>
        <VideocamOffIcon sx={{ fontSize: 60, color: "#9e9e9e", mb: 2 }} />
        <Typography variant="h6" color="text.secondary" gutterBottom>
          No data available
        </Typography>
        <Button variant="outlined" sx={{ mt: 2 }}>
          <RefreshIcon />
        </Button>
      </>
    )}
  </Box>
);

export default EmptyStateView;
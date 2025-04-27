import { useTheme, Theme } from "@mui/material/styles";
import { Box, Typography } from "@mui/material";

const StatusCard: React.FC<{
  icon: React.ReactNode;
  title: string;
  value: React.ReactNode;
  bgColor: string;
  iconColor?: string;
  variant?: string;
}> = ({ icon, title, value, bgColor, iconColor, variant }) => {
  const theme = useTheme() as Theme;
  return (
    <Box
      sx={{
        p: 2,
        borderRadius: 2,
        bgcolor: bgColor,
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
        {icon}
        <Typography
          variant="body1"
          color="text.secondary"
          sx={{ ml: "8px", textAlign: "center" }}
        >
          {title}
        </Typography>
      </Box>
      <Typography
        variant={(variant || "subtitle1") as "inherit" | any}
        sx={{
          color: iconColor || theme.palette.text.secondary,
          textAlign: "center",
          fontWeight: "bold",
        }}
      >
        {value}
      </Typography>
    </Box>
  );
};

export default StatusCard;

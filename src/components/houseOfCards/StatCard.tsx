import React from "react";
import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  useTheme,
  alpha,
  keyframes,
  Skeleton,
} from "@mui/material";

// Define keyframes for animations
const pulse = keyframes`
  0% {
    box-shadow: 0 0 0 0 rgba(0, 0, 0, 0.1);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(0, 0, 0, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(0, 0, 0, 0);
  }
`;

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

interface StatCardProps {
  icon: React.ReactElement;
  title: string;
  value: number | string;
  label?: string;
  mainColor: string;
  lightColor: string;
  loading?: boolean;
  changePercentage?: number;
  animateValue?: boolean;
}

const StatCard: React.FC<StatCardProps> = ({
  icon,
  title,
  value,
  label,
  mainColor,
  lightColor,
  loading = false,
  changePercentage,
  animateValue = false,
}) => {
  const theme = useTheme();
  const [animatedValue, setAnimatedValue] = React.useState(0);
  const valueRef = React.useRef<HTMLDivElement>(null);

  // Handle value counter animation
  React.useEffect(() => {
    if (!animateValue || loading || typeof value !== "number") return;

    const finalValue = typeof value === "number" ? value : 0;
    const duration = 1500; // animation duration in ms
    const frameDuration = 1000 / 60; // 60fps
    const totalFrames = Math.round(duration / frameDuration);

    let frame = 0;
    const counter = setInterval(() => {
      frame++;
      const progress = frame / totalFrames;
      const currentCount = Math.round(progress * finalValue);

      if (frame === totalFrames) {
        clearInterval(counter);
        setAnimatedValue(finalValue);
      } else {
        setAnimatedValue(currentCount);
      }
    }, frameDuration);

    return () => clearInterval(counter);
  }, [value, animateValue, loading]);

  // Handle intersection observer for animation on scroll
  React.useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && valueRef.current) {
          valueRef.current.style.opacity = "1";
          valueRef.current.style.transform = "translateY(0)";
        }
      },
      { threshold: 0.1 }
    );

    if (valueRef.current) {
      observer.observe(valueRef.current);
    }

    return () => {
      if (valueRef.current) {
        observer.unobserve(valueRef.current);
      }
    };
  }, []);

  // Format the value with commas
  const displayValue = () => {
    if (typeof value === "number") {
      return animateValue
        ? animatedValue.toLocaleString()
        : value.toLocaleString();
    }
    return value;
  };

  // Format change percentage
  const getChangeColor = () => {
    if (!changePercentage) return mainColor;
    return changePercentage > 0
      ? theme.palette.success.main
      : changePercentage < 0
      ? theme.palette.error.main
      : mainColor;
  };

  return (
    <Card
      elevation={0}
      sx={{
        borderRadius: 4,
        background: `linear-gradient(145deg, ${lightColor}, ${alpha(
          lightColor,
          0.7
        )})`,
        border: `1px solid ${alpha(mainColor, 0.2)}`,
        height: "100%",
        width: "100%",
        position: "relative",
        overflow: "visible",
        transition: "all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)",
        "&:hover": {
          transform: "translateY(-5px)",
          boxShadow: `0 12px 20px -10px ${alpha(mainColor, 0.3)}`,
          "& .icon-container": {
            transform: "scale(1.1) translateY(-2px)",
            boxShadow: `0 8px 16px -4px ${alpha(mainColor, 0.4)}`,
          },
        },
        // "&::before": {
        //   content: '""',
        //   position: "absolute",
        //   top: 0,
        //   left: 0,
        //   right: 0,
        //   height: "6px",
        //   background: `linear-gradient(to right, ${mainColor}, ${alpha(
        //     mainColor,
        //     0.7
        //   )})`,
        //   borderRadius: "4px 4px 0 0",
        // },
        // outlineTopColor: `${mainColor}`,
        // outlineTopWidth: 8,
      }}
    >
      <CardContent
        sx={{
          p: { xs: 2, sm: 2.5, md: 3 },
          "&:last-child": { pb: { xs: 2, sm: 2.5, md: 3 } },
        }}
      >
        <Grid
          container
          spacing={2}
          alignItems="center"
          justifyContent="space-between"
        >
          <Grid>
            <Typography
              variant="subtitle1"
              sx={{
                mb: 1,
                fontWeight: 600,
                fontSize: { xs: "0.8rem", sm: "0.95rem", md: "1.1rem" },
                color: alpha(theme.palette.text.primary, 0.85),
                animation: `${fadeIn} 0.5s ease-out`,
              }}
              noWrap
            >
              {title}
            </Typography>

            <Box
              ref={valueRef}
              sx={{
                opacity: 0,
                transform: "translateY(10px)",
                transition: "opacity 0.5s ease-out, transform 0.5s ease-out",
                display: "flex",
                alignItems: "flex-end",
                gap: 1,
              }}
            >
              {loading ? (
                <Skeleton
                  variant="text"
                  width={120}
                  height={60}
                  animation="wave"
                  sx={{ bgcolor: alpha(mainColor, 0.1) }}
                />
              ) : (
                <>
                  <Typography
                    variant="h3"
                    fontWeight="bold"
                    sx={{
                      color: mainColor,
                      fontSize: { xs: "1.4rem", sm: "1.9rem", md: "2.4rem" },
                      lineHeight: 1.2,
                      letterSpacing: "-0.5px",
                      fontFamily: theme.typography.fontFamily,
                    }}
                  >
                    {displayValue()}
                  </Typography>

                  {changePercentage !== undefined && (
                    <Typography
                      variant="body2"
                      sx={{
                        ml: 1,
                        mb: 1,
                        color: getChangeColor(),
                        fontWeight: 600,
                        display: "flex",
                        alignItems: "center",
                        fontSize: { xs: "0.7rem", sm: "0.8rem" },
                        whiteSpace: "nowrap",
                      }}
                    >
                      {changePercentage > 0
                        ? "↑"
                        : changePercentage < 0
                        ? "↓"
                        : "•"}{" "}
                      {Math.abs(changePercentage)}%
                    </Typography>
                  )}
                </>
              )}
            </Box>

            {label && (
              <Typography
                variant="body2"
                sx={{
                  fontSize: { xs: "0.65rem", sm: "0.75rem", md: "0.85rem" },
                  color: alpha(theme.palette.text.secondary, 0.9),
                  mt: 0.5,
                  animation: `${fadeIn} 0.7s ease-out`,
                }}
              >
                {label}
              </Typography>
            )}
          </Grid>

          <Grid sx={{ display: "flex", justifyContent: "flex-end" }}>
            <Box
              className="icon-container"
              sx={{
                p: { xs: 1.5, sm: 2, md: 2.5 },
                borderRadius: "50%",
                backgroundColor: mainColor,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.3s ease",
                boxShadow: `0 4px 12px -2px ${alpha(mainColor, 0.3)}`,
                animation: `${pulse} 2s infinite`,
              }}
            >
              <Box
                sx={{
                  fontSize: { xs: 22, sm: 28, md: 32 },
                  color: "white",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {icon}
              </Box>
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default StatCard;

// DateFilterButton.tsx

import React from "react";
import { Box, Button, Typography, Stack, Popover } from "@mui/material";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider, StaticDatePicker } from "@mui/x-date-pickers";

const CARD_COLORS = {
  videos: {
    main: "#1976d2", // Replace with your theme or color constant
  },
};

interface DateFilterButtonProps {
  startDate: Date | null;
  endDate: Date | null;
  onDateChange: (start: Date | null, end: Date | null) => void;
  isFiltered: boolean;
  onClearFilters: () => void;
}

const DateFilterButton: React.FC<DateFilterButtonProps> = ({
  startDate,
  endDate,
  onDateChange,
  isFiltered,
  onClearFilters,
}) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const [localStartDate, setLocalStartDate] = React.useState<Date | null>(
    startDate
  );
  const [localEndDate, setLocalEndDate] = React.useState<Date | null>(endDate);
  const [viewDate, setViewDate] = React.useState<Date | null>(
    startDate || new Date()
  );
  const [selectionMode, setSelectionMode] = React.useState<"start" | "end">(
    "start"
  );

  React.useEffect(() => {
    setLocalStartDate(startDate);
    setLocalEndDate(endDate);
    if (startDate) setViewDate(startDate);
  }, [startDate, endDate]);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => setAnchorEl(null);

  const formatDateForDisplay = (date: Date | null) =>
    date?.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
    }) ?? "";

  const getDisplayLabel = () => {
    if (startDate && endDate) {
      return startDate.getTime() === endDate.getTime()
        ? formatDateForDisplay(startDate)
        : `${formatDateForDisplay(startDate)} - ${formatDateForDisplay(
            endDate
          )}`;
    } else if (startDate) {
      return `From ${formatDateForDisplay(startDate)}`;
    } else if (endDate) {
      return `Until ${formatDateForDisplay(endDate)}`;
    }
    return "Select date range";
  };

  const applyPresetRange = (days: number) => {
    const end = new Date();
    const start = new Date();
    start.setDate(end.getDate() - days + 1);
    start.setHours(0, 0, 0, 0);
    end.setHours(23, 59, 59, 999);
    onDateChange(start, end);
    handleClose();
  };

  const handleApplyRange = () => {
    onDateChange(localStartDate, localEndDate);
    handleClose();
  };

  const handleDateClick = (date: Date | null) => {
    if (selectionMode === "start") {
      if (localEndDate && date && date > localEndDate) {
        setLocalStartDate(date);
        setLocalEndDate(null);
      } else {
        setLocalStartDate(date);
      }
      setSelectionMode("end");
    } else {
      if (localStartDate && date && date < localStartDate) {
        setLocalEndDate(localStartDate);
        setLocalStartDate(date);
      } else {
        setLocalEndDate(date);
      }
      setSelectionMode("start");
    }
  };

  return (
    <>
      <Button
        variant="outlined"
        onClick={handleClick}
        startIcon={<CalendarTodayIcon />}
        endIcon={<ExpandMoreIcon />}
        sx={{
          color: "white",
          borderColor: "rgba(255,255,255,0.5)",
          "&:hover": {
            borderColor: "white",
            backgroundColor: "rgba(255,255,255,0.1)",
          },
          textTransform: "none",
          minWidth: 180,
          justifyContent: "space-between",
        }}
      >
        {getDisplayLabel()}
      </Button>

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        transformOrigin={{ vertical: "top", horizontal: "left" }}
        PaperProps={{
          sx: {
            mt: 1,
            width: 550,
            borderRadius: 2,
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.15)",
          },
        }}
      >
        <Box sx={{ display: "flex", width: "100%" }}>
          {/* Presets */}
          <Box
            sx={{
              p: 2,
              borderRight: "1px solid rgba(0,0,0,0.1)",
              width: "35%",
              backgroundColor: "#f7f9fc",
            }}
          >
            <Typography
              variant="subtitle2"
              sx={{ mb: 2, fontWeight: 600, color: "text.secondary" }}
            >
              Preset Ranges
            </Typography>
            <Stack spacing={1}>
              {[1, 7, 30, 90].map((days) => (
                <Button
                  key={days}
                  fullWidth
                  variant="text"
                  sx={{ justifyContent: "flex-start", textTransform: "none" }}
                  onClick={() => applyPresetRange(days)}
                >
                  {days === 1 ? "Today" : `Last ${days} days`}
                </Button>
              ))}
              {isFiltered && (
                <Button
                  fullWidth
                  variant="text"
                  color="error"
                  sx={{
                    justifyContent: "flex-start",
                    textTransform: "none",
                    mt: 2,
                  }}
                  onClick={() => {
                    onClearFilters();
                    handleClose();
                  }}
                >
                  Clear filter
                </Button>
              )}
            </Stack>
          </Box>

          {/* Calendar */}
          <Box sx={{ p: 2, width: "65%" }}>
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" sx={{ mb: 1 }}>
                {selectionMode === "start"
                  ? "Select start date:"
                  : "Select end date:"}
              </Typography>
              <Box sx={{ display: "flex", gap: 2 }}>
                {["start", "end"].map((mode) => (
                  <Box
                    key={mode}
                    sx={{
                      p: 1,
                      border: "1px solid",
                      borderColor:
                        selectionMode === mode ? "primary.main" : "divider",
                      borderRadius: 1,
                      cursor: "pointer",
                      bgcolor:
                        selectionMode === mode ? "action.hover" : "transparent",
                    }}
                    onClick={() => setSelectionMode(mode as "start" | "end")}
                  >
                    <Typography variant="body2" fontWeight={500}>
                      {mode === "start" ? "Start" : "End"}:{" "}
                      {mode === "start"
                        ? formatDateForDisplay(localStartDate)
                        : formatDateForDisplay(localEndDate) || "Not set"}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Box>

            <LocalizationProvider
              dateAdapter={AdapterDateFns}
              localeText={{
                clearButtonLabel: "Empty",
                todayButtonLabel: "Now",
              }}
            >
              <StaticDatePicker
                displayStaticWrapperAs="desktop"
                value={
                  selectionMode === "start" ? localStartDate : localEndDate
                }
                onChange={(newDate) => handleDateClick(newDate)}
                dayOfWeekFormatter={(date) =>
                  date
                    .toLocaleDateString(undefined, { weekday: "short" })
                    .charAt(0)
                    .toUpperCase()
                }
                slots={{ actionBar: () => null }}
              />
            </LocalizationProvider>

            <Box
              sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}
            >
              <Button
                variant="text"
                onClick={() => {
                  setLocalStartDate(null);
                  setLocalEndDate(null);
                }}
              >
                Clear
              </Button>
              <Button
                variant="contained"
                sx={{
                  backgroundColor: CARD_COLORS.videos.main,
                  "&:hover": {
                    backgroundColor: CARD_COLORS.videos.main,
                    opacity: 0.9,
                  },
                }}
                onClick={handleApplyRange}
                disabled={!localStartDate && !localEndDate}
              >
                Apply
              </Button>
            </Box>
          </Box>
        </Box>
      </Popover>
    </>
  );
};

export default DateFilterButton;

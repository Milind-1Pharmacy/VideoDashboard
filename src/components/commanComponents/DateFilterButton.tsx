// DateFilterButton.tsx

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Box, Button, Typography, Stack, Popover, alpha } from "@mui/material";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import {
  LocalizationProvider,
  StaticDatePicker,
  PickersDay,
} from "@mui/x-date-pickers";
import {
  addDays,
  isSameDay,
  isAfter,
  isBefore,
  startOfDay,
  endOfDay,
} from "date-fns";

// Theme constants
const CARD_COLORS = {
  videos: {
    main: "#1976d2",
    light: "#42a5f5",
  },
};

// Preset options for date ranges
const PRESET_OPTIONS = [
  { label: "Today", days: 1 },
  { label: "Last 7 days", days: 7 },
  { label: "Last 30 days", days: 30 },
  { label: "Last 90 days", days: 90 },
];

interface DateFilterButtonProps {
  startDate: Date | null;
  endDate: Date | null;
  onDateChange: (start: Date | null, end: Date | null) => void;
  isFiltered: boolean;
  onClearFilters: () => void;
}

// Helper function for date interval checking
function isWithinInterval(
  day: Date,
  interval: { start: Date; end: Date }
): boolean {
  return day >= interval.start && day <= interval.end;
}

const DateFilterButton: React.FC<DateFilterButtonProps> = ({
  startDate,
  endDate,
  onDateChange,
  isFiltered,
  onClearFilters,
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const [localStartDate, setLocalStartDate] = useState<Date | null>(startDate);
  const [localEndDate, setLocalEndDate] = useState<Date | null>(endDate);
  const [selectionMode, setSelectionMode] = useState<"start" | "end">("start");

  // Sync local state with props when they change
  useEffect(() => {
    setLocalStartDate(startDate);
    setLocalEndDate(endDate);
  }, [startDate, endDate]);

  // Memoized formatter for better performance
  const formatDateForDisplay = useCallback((date: Date | null) => {
    if (!date) return "";
    return date.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }, []);

  // Memoized display label
  const displayLabel = useMemo(() => {
    if (startDate && endDate) {
      return isSameDay(startDate, endDate)
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
  }, [startDate, endDate, formatDateForDisplay]);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => setAnchorEl(null);

  const applyPresetRange = useCallback(
    (days: number) => {
      const end = endOfDay(new Date());
      const start = startOfDay(addDays(end, -days + 1));
      onDateChange(start, end);
      handleClose();
    },
    [onDateChange]
  );

  const handleApplyRange = useCallback(() => {
    onDateChange(localStartDate, localEndDate);
    handleClose();
  }, [localStartDate, localEndDate, onDateChange]);

  const handleClear = useCallback(() => {
    setLocalStartDate(null);
    setLocalEndDate(null);
  }, []);

  const handleDateClick = useCallback(
    (date: Date | null) => {
      if (!date) return;

      if (selectionMode === "start") {
        if (localEndDate && isAfter(date, localEndDate)) {
          setLocalStartDate(date);
          setLocalEndDate(null);
        } else {
          setLocalStartDate(date);
        }
        setSelectionMode("end");
      } else {
        if (localStartDate && isBefore(date, localStartDate)) {
          setLocalEndDate(localStartDate);
          setLocalStartDate(date);
        } else {
          setLocalEndDate(date);
        }
        setSelectionMode("start");
      }
    },
    [localStartDate, localEndDate, selectionMode]
  );

  // Create a custom day component instead of a render function
  const CustomDay = React.useMemo(() => {
    return function Day(props: any) {
      const { day, ...other } = props;

      const isSelected = Boolean(
        (localStartDate && isSameDay(day, localStartDate)) ||
          (localEndDate && isSameDay(day, localEndDate))
      );

      const isInRange = Boolean(
        localStartDate &&
          localEndDate &&
          isWithinInterval(day, {
            start: localStartDate,
            end: localEndDate,
          })
      );

      const isStart = localStartDate && isSameDay(day, localStartDate);
      const isEnd = localEndDate && isSameDay(day, localEndDate);

      return (
        <Box
          sx={{
            position: "relative",
            "&::before": isInRange
              ? {
                  content: '""',
                  position: "absolute",
                  top: 0,
                  left: isStart ? "50%" : 0,
                  right: isEnd ? "50%" : 0,
                  bottom: 0,
                  background: `linear-gradient(to right, ${alpha(
                    CARD_COLORS.videos.light,
                    0.2
                  )}, ${alpha(CARD_COLORS.videos.main, 0.3)})`,
                  zIndex: 0,
                }
              : {},
          }}
        >
          <PickersDay
            {...other}
            day={day}
            selected={isSelected}
            sx={{
              borderRadius: "50%",
              position: "relative",
              zIndex: 1,
              backgroundColor: isSelected
                ? CARD_COLORS.videos.main
                : "transparent",
              color: isSelected
                ? "white"
                : isInRange
                ? CARD_COLORS.videos.main
                : undefined,
              fontWeight: isInRange ? 600 : undefined,
              "&:hover": {
                backgroundColor: isSelected
                  ? CARD_COLORS.videos.main
                  : alpha(CARD_COLORS.videos.light, 0.2),
              },
            }}
          />
        </Box>
      );
    };
  }, [localStartDate, localEndDate]);

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
        {displayLabel}
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
              {PRESET_OPTIONS.map((option) => (
                <Button
                  key={option.days}
                  fullWidth
                  variant="text"
                  sx={{
                    justifyContent: "flex-start",
                    textTransform: "none",
                    py: 1,
                  }}
                  onClick={() => applyPresetRange(option.days)}
                >
                  {option.label}
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
                {[
                  { mode: "start", value: localStartDate },
                  { mode: "end", value: localEndDate },
                ].map((item) => (
                  <Box
                    key={item.mode}
                    sx={{
                      p: 1,
                      border: "1px solid",
                      borderColor:
                        selectionMode === item.mode
                          ? CARD_COLORS.videos.main
                          : "divider",
                      borderRadius: 1,
                      cursor: "pointer",
                      bgcolor:
                        selectionMode === item.mode
                          ? alpha(CARD_COLORS.videos.light, 0.1)
                          : "transparent",
                      transition: "all 0.2s ease",
                      flex: 1,
                    }}
                    onClick={() =>
                      setSelectionMode(item.mode as "start" | "end")
                    }
                  >
                    <Typography variant="body2" fontWeight={500}>
                      {item.mode === "start" ? "Start" : "End"}:{" "}
                      {formatDateForDisplay(item.value) || "Not set"}
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
                onChange={handleDateClick}
                dayOfWeekFormatter={(date) =>
                  date
                    .toLocaleDateString(undefined, { weekday: "short" })
                    .charAt(0)
                    .toUpperCase()
                }
                slots={{
                  actionBar: () => null,
                  day: CustomDay, // Use the custom component here
                }}
              />
            </LocalizationProvider>

            <Box
              sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}
            >
              <Button variant="text" onClick={handleClear}>
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
                  transition: "opacity 0.2s ease",
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

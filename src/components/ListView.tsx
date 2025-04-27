import * as React from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";
import VisibilityIcon from "@mui/icons-material/Visibility";
import SaveIcon from "@mui/icons-material/Save";
import { format } from "date-fns";
import SmartDisplayIcon from "@mui/icons-material/SmartDisplay";
import { Box, Fade, Grid, Skeleton } from "@mui/material";
import { styled } from "@mui/material/styles";
import DirectionsWalkIcon from "@mui/icons-material/DirectionsWalk";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import QuestionAnswerIcon from "@mui/icons-material/QuestionAnswer";
import { TimelapseTwoTone } from "@mui/icons-material";
import { StatCard } from "./houseOfCards";
import {
  VideoDataInterface,
  ColumnInterface,
  VideoAnalyticsTableProps,
} from "../utils";
// Define the primary color
const PRIMARY_COLOR = "#2e6acf";
// interface VideoDataInterface {
//   id: string;
//   name: string;
//   startTimestamp: string;
//   endTimestamp: string;
//   numberOfEnquiries: number;
//   numberOfSales: number;
//   numberOfFootFallCount: number;
//   downloadUrl: string;
//   thumbnailUrl?: string;
// }

// Define theme colors for cards
const CARD_COLORS = {
  videos: {
    main: "#4361ee",
    light: "#eef1fe",
  },
  footTraffic: {
    main: "#3a0ca3",
    light: "#ece6f8",
  },
  sales: {
    main: "#f72585",
    light: "#feeaf2",
  },
  enquiries: {
    main: "#4cc9f0",
    light: "#e6f9fe",
  },
};

const DashboardHeader: React.FC<{
  data: VideoDataInterface[];
  loading: boolean;
}> = ({ data, loading }) => {
  // Calculate totals
  //     const startTime = new Date(VideoDataInterface.startTimestamp).getTime();
  //     const endTime = new Date(VideoDataInterface.endTimestamp).getTime();
  //     const durationMinutes = Math.round((endTime - startTime) / (1000 * 60));
  // const totalVideosLength = data.reduce((acc,video)=> acc + video);
  let totalVideosLength = 0;
  data.forEach((video) => {
    const startTime = new Date(video.startTimestamp).getTime();
    const endTime = new Date(video.endTimestamp).getTime();
    const durationMinutes = Math.round((endTime - startTime) / (1000 * 60));
    totalVideosLength += durationMinutes;
  });

  // console.log(data, totalVideosLength);

  const totalFootfall = data.reduce(
    (acc, video) => acc + (video.numberOfFootFallCount ?? 0),
    0
  );
  const totalSales = data.reduce((acc, video) => acc + video.numberOfSales, 0);
  const totalEnquiries = data.reduce(
    (acc, video) => acc + video.numberOfEnquiries,
    0
  );

  return (
    <Grid
      container
      spacing={1}
      sx={{ mb: 2.6, flexWrap: "nowrap", overflowX: "auto" }}
    >
      <Grid sx={{ flex: "1 0 auto", minWidth: "200px" }}>
        <StatCard
          icon={<TimelapseTwoTone />}
          title="Hours Recorded"
          value={parseFloat((totalVideosLength / 60).toFixed(2))}
          label="Total recorded sessions hours"
          mainColor={CARD_COLORS.videos.main}
          lightColor={CARD_COLORS.videos.light}
          loading={loading}
        />
      </Grid>

      <Grid sx={{ flex: "1 0 auto", minWidth: "200px" }}>
        <StatCard
          icon={<DirectionsWalkIcon />}
          title="Customer Foot Traffic"
          value={totalFootfall}
          label="Total visitor count"
          mainColor={CARD_COLORS.footTraffic.main}
          lightColor={CARD_COLORS.footTraffic.light}
          loading={loading}
        />
      </Grid>

      <Grid sx={{ flex: "1 0 auto", minWidth: "200px" }}>
        <StatCard
          icon={<ShoppingCartIcon />}
          title="Sales Count"
          value={totalSales}
          label="Total transactions completed"
          mainColor={CARD_COLORS.sales.main}
          lightColor={CARD_COLORS.sales.light}
          loading={loading}
        />
      </Grid>

      <Grid sx={{ flex: "1 0 auto", minWidth: "200px" }}>
        <StatCard
          icon={<QuestionAnswerIcon />}
          title="Customer Enquiries"
          value={totalEnquiries}
          label="Total customer interactions"
          mainColor={CARD_COLORS.enquiries.main}
          lightColor={CARD_COLORS.enquiries.light}
          loading={loading}
        />
      </Grid>
    </Grid>
  );
};

// interface Column {
//   id:
//     | "name"
//     | "startTimestamp"
//     | "endTimestamp"
//     | "duration"
//     | "numberOfEnquiries"
//     | "numberOfSales"
//     | "conversionRate"
//     | "numberOfFootFallCount"
//     | "actions";
//   label: string;
//   minWidth?: number;
//   maxWidth?: number;
//   align?: "right" | "left" | "center";
//   format?: (value: any) => string;
// }

// interface VideoDataInterface {
//   id: string;
//   name: string;
//   startTimestamp: string;
//   endTimestamp: string;
//   numberOfEnquiries: number;
//   numberOfSales: number;
//   numberOfFootFallCount: number;
//   downloadUrl: string;
//   thumbnailUrl?: string;
//   conversionRate?: number;
// }

const columns: readonly ColumnInterface[] = [
  { id: "name", label: "Video Name", minWidth: 170, maxWidth: 200 },
  {
    id: "startTimestamp",
    label: "Start Time",
    minWidth: 130,
    format: (value: string) => format(new Date(value), "MMM d, yyyy h:mm a"),
  },
  {
    id: "endTimestamp",
    label: "End Time",
    minWidth: 130,
    format: (value: string) => format(new Date(value), "MMM d, yyyy h:mm a"),
  },
  {
    id: "duration",
    label: "Duration ",
    minWidth: 60,
    align: "center",
    format: (value: any) => {
      const startTime = new Date(value.startTimestamp).getTime();
      const endTime = new Date(value.endTimestamp).getTime();
      const durationMinutes = Math.round((endTime - startTime) / (1000 * 60));
      return durationMinutes.toString();
    },
  },
  {
    id: "numberOfEnquiries",
    label: "Enquiries",
    minWidth: 64,
    align: "center",
    format: (value: number) => value.toLocaleString("en-US"),
  },
  {
    id: "numberOfSales",
    label: "Sales",
    minWidth: 64,
    align: "center",
    format: (value: number) => value.toLocaleString("en-US"),
  },
  {
    id: "conversionRate",
    label: "Conversion Rate (%)",
    minWidth: 64,
    align: "center",
    format: (value: any) => {
      return value !== undefined ? value.toFixed(2) : "0.00";
    },
  },
  {
    id: "numberOfFootFallCount",
    label: "Foot Fall Count",
    minWidth: 64,
    align: "center",
    format: (value: number) => value.toLocaleString("en-US"),
  },
  {
    id: "actions",
    label: "Actions",
    minWidth: 140,
    align: "center",
  },
];

const StyledTableRow = styled(TableRow)({
  "&:nth-of-type(odd)": {
    backgroundColor: "#f7f9fc",
  },
  "&:hover": {
    backgroundColor: "#eef2f8",
  },
});

const StyledTableCell = styled(TableCell)({
  padding: "12px 16px",
});

const HeaderTableCell = styled(TableCell)({
  backgroundColor: "#f0f4fa",
  fontWeight: 600,
  color: "#333",
  padding: "14px 16px",
  borderBottom: `2px solid ${PRIMARY_COLOR}`,
});

const ThumbnailImage = styled("img")({
  width: 40,
  height: 40,
  borderRadius: 4,
  objectFit: "cover",
});

// interface VideoAnalyticsTableProps {
//   data: VideoDataInterface[];
//   onView?: (video: VideoDataInterface) => void;
//   onSave?: (video: VideoDataInterface) => void;
//   loading?: boolean;
// }

export default function VideoAnalyticsTable({
  data,
  onView,
  onSave,
  loading,
}: VideoAnalyticsTableProps) {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(8);
  const [loadingRows, setLoadingRows] = React.useState(false);

  // Preprocess data to add conversion rate
  const processedData = React.useMemo(() => {
    return data.map((row) => {
      const conversionRate =
        (row?.numberOfFootFallCount ?? 0) > 0
          ? (row.numberOfSales / row.numberOfEnquiries) * 100
          : 0;

      const thumbnailUrl = row.thumbnailUrl;

      return {
        ...row,
        conversionRate,
        thumbnailUrl,
      };
    });
  }, [data]);

  const handleChangePage = (_event: unknown, newPage: number) => {
    setLoadingRows(true);
    setPage(newPage);

    // Simulate loading when changing pages
    setTimeout(() => {
      setLoadingRows(false);
    }, 300);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setLoadingRows(true);
    setRowsPerPage(+event.target.value);
    setPage(0);

    // Simulate loading when changing rows per page
    setTimeout(() => {
      setLoadingRows(false);
    }, 300);
  };

  return (
    <>
      <DashboardHeader loading={loading || false} data={data} />

      <Paper
        sx={{
          width: "100%",
          height: "100%",
          overflow: "hidden",
          borderRadius: 1,
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
        }}
      >
        <TableContainer sx={{ maxHeight: 600 }}>
          <Table stickyHeader aria-label="video analytics table">
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <HeaderTableCell
                    key={column.id}
                    align={column.align || "left"}
                    style={{
                      minWidth: column.minWidth,
                      maxWidth: column.maxWidth,
                      cursor: onView ? "pointer" : "default",
                    }}
                  >
                    {column.label}
                  </HeaderTableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {loadingRows
                ? // Loading skeleton rows
                  Array.from(new Array(rowsPerPage)).map((_, index) => (
                    <TableRow key={`skeleton-${index}`}>
                      {columns.map((_, colIndex) => (
                        <TableCell key={`skeleton-cell-${colIndex}`}>
                          <Skeleton
                            animation="wave"
                            height={24}
                            width={colIndex === 0 ? 150 : 80}
                          />
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                : processedData
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row) => {
                      // console.log("row", row);

                      return (
                        <Fade in={!loadingRows} timeout={300}>
                          <StyledTableRow
                            hover
                            tabIndex={-1}
                            key={row.id}
                            onClick={() => {
                              onView && onView(row);
                            }}
                            style={{
                              cursor: onView ? "pointer" : "default",
                            }}
                          >
                            {columns.map((column) => {
                              // Thumbnail column
                              if (column.id === "name") {
                                return (
                                  <StyledTableCell
                                    key={column.id}
                                    align={column.align}
                                  >
                                    <Stack
                                      direction="row"
                                      spacing={2}
                                      alignItems="center"
                                      maxWidth={column.maxWidth}
                                      sx={{
                                        overflow: "hidden",
                                      }}
                                    >
                                      {row.thumbnailUrl ? (
                                        <ThumbnailImage
                                          src={row.thumbnailUrl}
                                          alt={row.name}
                                        />
                                      ) : (
                                        <Box
                                          sx={{
                                            width: 40,
                                            height: 40,
                                            borderRadius: 1,
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            backgroundColor: "#eef2f8",
                                          }}
                                        >
                                          <SmartDisplayIcon
                                            sx={{
                                              fontSize: 24,
                                              color: PRIMARY_COLOR,
                                            }}
                                          />
                                        </Box>
                                      )}

                                      <Box
                                        component="span"
                                        sx={{
                                          whiteSpace: "nowrap",
                                          overflow: "hidden",
                                          textOverflow: "ellipsis",
                                          maxWidth: "100%",
                                        }}
                                      >
                                        {row.name}
                                      </Box>
                                    </Stack>
                                  </StyledTableCell>
                                );
                              }

                              // Actions column with eye and save icons
                              if (column.id === "actions") {
                                return (
                                  <StyledTableCell
                                    key={column.id}
                                    align={column.align}
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    <Stack
                                      direction="row"
                                      spacing={1}
                                      justifyContent="center"
                                    >
                                      <Tooltip title="View Video">
                                        <IconButton
                                          size="small"
                                          sx={{
                                            color: PRIMARY_COLOR,
                                          }}
                                          onClick={(e) => {
                                            console.log("tootTip clicked");

                                            e.stopPropagation();
                                            onView?.(row);
                                          }}
                                        >
                                          <VisibilityIcon />
                                        </IconButton>
                                      </Tooltip>

                                      <Tooltip title="Save Video">
                                        <IconButton
                                          size="small"
                                          sx={{
                                            color: PRIMARY_COLOR,
                                          }}
                                          onClick={() => onSave && onSave(row)}
                                        >
                                          <SaveIcon />
                                        </IconButton>
                                      </Tooltip>
                                    </Stack>
                                  </StyledTableCell>
                                );
                              }

                              if (column.id === "duration") {
                                return (
                                  <StyledTableCell
                                    key={column.id}
                                    align={column.align}
                                  >
                                    {column.format ? column.format(row) : "-"}
                                  </StyledTableCell>
                                );
                              }

                              if (
                                column.id === "conversionRate" &&
                                row.conversionRate !== undefined
                              ) {
                                return (
                                  <StyledTableCell
                                    key={column.id}
                                    align={column.align}
                                  >
                                    {row.conversionRate.toFixed(2)}%
                                  </StyledTableCell>
                                );
                              }

                              const value =
                                row[column.id as keyof VideoDataInterface];
                              return (
                                <StyledTableCell
                                  key={column.id}
                                  align={column.align}
                                >
                                  {Array.isArray(value)
                                    ? JSON.stringify(value)
                                    : column.format && value !== undefined
                                    ? column.format(value)
                                    : value}
                                </StyledTableCell>
                              );
                            })}
                          </StyledTableRow>
                        </Fade>
                      );
                    })}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[8, 10, 20]}
          component="div"
          count={processedData.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          sx={{
            borderTop: "1px solid #e0e0e0",
          }}
        />
      </Paper>
    </>
  );
}

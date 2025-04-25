import * as React from "react";
import {
  Box,
  Typography,
  Tooltip,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Avatar,
  Tabs,
  Tab,
  useTheme,
  CardMedia,
  Card,
  DialogContent,
  Dialog,
} from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { Close } from "@mui/icons-material";

// Component for demographic pill display
interface DemographicPillProps {
  gender: string;
  age: number;
}

const DemographicPill = ({ gender, age }: DemographicPillProps) => {
  const theme = useTheme();
  const bgColor =
    gender === "M"
      ? theme.palette.primary.light
      : theme.palette.secondary.light;
  const textColor =
    gender === "M"
      ? theme.palette.primary.contrastText
      : theme.palette.secondary.contrastText;

  return (
    <Chip
      avatar={<Avatar>{gender}</Avatar>}
      label={`${age} yrs`}
      sx={{
        backgroundColor: bgColor,
        color: textColor,
        fontWeight: "bold",
        m: 0.5,
      }}
      size="small"
    />
  );
};

// Tab interface
interface TabPanelProps {
  children?: React.ReactNode;
  value: number;
  index: number;
  [key: string]: any;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`events-tabpanel-${index}`}
      aria-labelledby={`events-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 2 }}>{children}</Box>}
    </div>
  );
}

interface EventsTableProps {
  events: Array<{
    timestamp: number;
    billNumber?: string;
    enquiries?: string[];
    demographics?: [string, number][];
    orderImgUrl?: string;
  }>;
  jumpToTimestamp: (timestamp: number) => void;
}

const EventsTable = ({ events, jumpToTimestamp }: EventsTableProps) => {
  const theme = useTheme();
  const [activeTab, setActiveTab] = React.useState(0);
  const [selectedBill, setSelectedBill] = React.useState<{
    billNumber: string;
    imageUrl: string;
  } | null>(null);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number): void => {
    setActiveTab(newValue);
  };

  const formatDisplayTime = (timestampInSeconds: number): string => {
    const date = new Date(0);
    date.setSeconds(timestampInSeconds);
    return date.toISOString().substr(11, 8);
  };

  const onViewBill = (billNumber: string, imageUrl?: string): void => {
    if (imageUrl) {
      setSelectedBill({ billNumber, imageUrl });
    } else {
      console.log(`No image available for bill: ${billNumber}`);
      // You might want to show a snackbar/toast here
    }
  };
  return (
    <Paper
      elevation={2}
      sx={{
        borderRadius: 2,
        overflow: "hidden", // Changed from "scroll" to "hidden" to prevent double scrollbars
        mb: 3,
        background: theme.palette.background.paper,
        width: "100%",
        display: "flex",
        flexDirection: "column",
        // height: "100%",
        // maxHeight: "70vh", // Set a max height for the table
        height: "540px",
        boxShadow: "none",
        border: `1px solid ${theme.palette.divider}`,
      }}
    >
      {/* Sticky header section */}
      <Box
        sx={{
          position: "sticky",
          top: 0,
          zIndex: 10,
          backgroundColor: theme.palette.background.paper,
        }}
      >
        <Typography
          variant="h6"
          sx={{
            fontWeight: "bold",
            p: 2,
            borderBottom: `2px solid ${theme.palette.primary.main}`,
          }}
        >
          Key Events
        </Typography>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          variant="standard"
          indicatorColor="primary"
          textColor="primary"
          sx={{
            "& .MuiTab-root": {
              // py: 1,
              fontWeight: "400",
            },
            borderBottom: 1,
            borderColor: "divider",
          }}
        >
          <Tab label="Bills" />
          <Tab label="Enquiries" />
          <Tab label="Demographics" />
        </Tabs>
      </Box>

      {/* Scrollable content area */}
      <Box sx={{ flexGrow: 1, overflow: "auto" }}>
        {/* Bills Tab */}
        <Dialog
          open={!!selectedBill}
          onClose={() => setSelectedBill(null)}
          maxWidth="md"
          fullWidth
        >
          <DialogContent>
            <IconButton
              aria-label="close"
              onClick={() => setSelectedBill(null)}
              sx={{
                position: "absolute",
                right: 8,
                top: 8,
                color: (theme) => theme.palette.grey[500],
              }}
            >
              <Close />
            </IconButton>
            {selectedBill && (
              <Card>
                <CardMedia
                  component="img"
                  image={selectedBill.imageUrl}
                  alt={`Bill ${selectedBill.billNumber}`}
                  sx={{
                    maxHeight: "80vh",
                    objectFit: "contain",
                  }}
                />
              </Card>
            )}
          </DialogContent>
        </Dialog>
        <TabPanel value={activeTab} index={0}>
          <TableContainer component={Box}>
            <Table stickyHeader aria-label="bills table">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: "bold", width: "30%" }}>
                    Timestamp
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold", width: "40%" }}>
                    Bill Number
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold", width: "30%" }}>
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {events
                  .filter((event) => event.billNumber)
                  .map((event, index) => (
                    <TableRow
                      key={`bill-${index}`}
                      sx={{
                        "&:last-child td, &:last-child th": { border: 0 },
                        "&:hover": { backgroundColor: "rgba(0, 0, 0, 0.04)" },
                        transition: "background-color 0.2s",
                      }}
                    >
                      <TableCell>
                        {formatDisplayTime(event.timestamp)}
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" fontWeight="medium">
                          {event.billNumber}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: "flex", gap: 1 }}>
                          <Tooltip title="View Bill Details">
                            <IconButton
                              size="small"
                              color="primary"
                              onClick={() =>
                                onViewBill(event.billNumber!, event.orderImgUrl)
                              }
                              sx={{
                                bgcolor: "rgba(25, 118, 210, 0.08)",
                                "&:hover": {
                                  bgcolor: "rgba(25, 118, 210, 0.15)",
                                },
                                borderRadius: "4px",
                              }}
                            >
                              <Typography variant="body2" mr={0.8}>
                                View
                              </Typography>
                              <VisibilityIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Jump to this moment">
                            <IconButton
                              size="small"
                              color="secondary"
                              onClick={() => jumpToTimestamp(event.timestamp)}
                              sx={{
                                bgcolor: "rgba(156, 39, 176, 0.08)",
                                "&:hover": {
                                  bgcolor: "rgba(156, 39, 176, 0.15)",
                                },
                                borderRadius: "4px",
                              }}
                            >
                              <Typography variant="body2">Jump</Typography>{" "}
                              <PlayArrowIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                {events.filter((event) => event.billNumber).length === 0 && (
                  <TableRow>
                    <TableCell colSpan={3} align="center" sx={{ py: 3 }}>
                      <Typography variant="body2" color="text.secondary">
                        No bills recorded in this video
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>

        {/* Enquiries Tab */}
        <TabPanel value={activeTab} index={1}>
          <TableContainer component={Box}>
            <Table stickyHeader aria-label="enquiries table">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: "bold", width: "30%" }}>
                    Timestamp
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold", width: "50%" }}>
                    Enquiries
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold", width: "20%" }}>
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {events
                  .filter(
                    (event) => event.enquiries && event.enquiries.length > 0
                  )
                  .map((event, index) => (
                    <TableRow
                      key={`enquiry-${index}`}
                      sx={{
                        "&:last-child td, &:last-child th": { border: 0 },
                        "&:hover": { backgroundColor: "rgba(0, 0, 0, 0.04)" },
                        transition: "background-color 0.2s",
                      }}
                    >
                      <TableCell>
                        {formatDisplayTime(event.timestamp)}
                      </TableCell>
                      <TableCell>
                        <Box
                          sx={{ display: "flex", flexWrap: "wrap", gap: 0.8 }}
                        >
                          {(event.enquiries ?? []).map((enquiry, i) => (
                            <Chip
                              key={`${enquiry}-${i}`}
                              label={enquiry}
                              size="small"
                              color="info"
                              sx={{ fontWeight: "medium" }}
                            />
                          ))}
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Tooltip title="Jump to this moment">
                          <IconButton
                            size="small"
                            color="secondary"
                            onClick={() => jumpToTimestamp(event.timestamp)}
                            sx={{
                              bgcolor: "rgba(156, 39, 176, 0.08)",
                              "&:hover": {
                                bgcolor: "rgba(156, 39, 176, 0.15)",
                              },
                              borderRadius: "4px",
                            }}
                          >
                            <Typography variant="body2">Jump</Typography>{" "}
                            <PlayArrowIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
                {events.filter(
                  (event) => event.enquiries && event.enquiries.length > 0
                ).length === 0 && (
                  <TableRow>
                    <TableCell colSpan={3} align="center" sx={{ py: 3 }}>
                      <Typography variant="body2" color="text.secondary">
                        No enquiries recorded in this video
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>

        {/* Demographics Tab */}
        <TabPanel value={activeTab} index={2}>
          <TableContainer component={Box}>
            <Table stickyHeader aria-label="demographics table">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: "bold", width: "20%" }}>
                    Timestamp
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold", width: "56%" }}>
                    Demographics
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold", width: "30%" }}>
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {events
                  .filter(
                    (event) =>
                      event.demographics && event.demographics.length > 0
                  )
                  .map((event, index) => (
                    <TableRow
                      key={`demo-${index}`}
                      sx={{
                        "&:last-child td, &:last-child th": { border: 0 },
                        "&:hover": { backgroundColor: "rgba(0, 0, 0, 0.04)" },
                        transition: "background-color 0.2s",
                      }}
                    >
                      <TableCell
                        sx={{
                          position: "relative",
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "start",
                            position: "absolute",
                            top: 20,
                          }}
                        >
                          {formatDisplayTime(event.timestamp)}
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box
                          sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}
                        >
                          {(event.demographics ?? []).map(
                            ([gender, age], i) => (
                              <DemographicPill
                                key={`${gender}-${age}-${i}`}
                                gender={gender}
                                age={age}
                              />
                            )
                          )}
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Tooltip title="Jump to this moment">
                          <IconButton
                            size="small"
                            color="secondary"
                            onClick={() => jumpToTimestamp(event.timestamp)}
                            sx={{
                              bgcolor: "rgba(156, 39, 176, 0.08)",
                              "&:hover": {
                                bgcolor: "rgba(156, 39, 176, 0.15)",
                              },
                              borderRadius: "4px",
                            }}
                          >
                            <Typography variant="body2">Jump</Typography>{" "}
                            <PlayArrowIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
                {events.filter(
                  (event) => event.demographics && event.demographics.length > 0
                ).length === 0 && (
                  <TableRow>
                    <TableCell colSpan={3} align="center" sx={{ py: 3 }}>
                      <Typography variant="body2" color="text.secondary">
                        No demographic data recorded in this video
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>
      </Box>
    </Paper>
  );
};

export default EventsTable;

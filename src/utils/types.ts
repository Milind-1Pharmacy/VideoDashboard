export interface VideoDataInterface {
  id: string;
  name: string;
  startTimestamp: string;
  endTimestamp: string;
  numberOfEnquiries: number;
  numberOfSales: number;
  numberOfFootFallCount?: number;
  downloadUrl?: string;
  thumbnailUrl?: string;
  conversionRate?: number;
  signedUrl?: string;
  transcript?: string;
  events?: VideoEventInterface[];
}
export interface ColumnInterface {
  id:
    | "name"
    | "startTimestamp"
    | "endTimestamp"
    | "duration"
    | "numberOfEnquiries"
    | "numberOfSales"
    | "conversionRate"
    | "numberOfFootFallCount"
    | "actions";
  label: string;
  minWidth?: number;
  maxWidth?: number;
  align?: "right" | "left" | "center";
  format?: (value: any) => string;
}

export interface VideoAnalyticsTableProps {
  data: VideoDataInterface[];
  onView?: (video: VideoDataInterface) => void;
  onSave?: (video: VideoDataInterface) => void;
  loading?: boolean;
}

export interface JumpToActionButtonProps {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  timestamp: string;
  videoStartTime: string;
}

export interface StatCardProps {
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

export type Gender = "M" | "F" | "O";
export type Age = number; // Define Age as a number type

export interface VideoEventInterface {
  timestamp: string;
  billNumber: string | null;
  enquiries: string[];
  demographics?: [Gender, Age][];
  orderImgUrl?: string;
}

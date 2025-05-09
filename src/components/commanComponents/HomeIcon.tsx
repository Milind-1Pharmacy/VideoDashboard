import React from "react";

interface HomeIconProps {
  icon: string;
  className?: string;
  size?: string;
  color?: string;
}



const HomeIcon: React.FC<HomeIconProps> = (props) => (
  <i
    className={`${props.icon} ${props.className || ""}`}
    style={{
      padding: "0 4px",
      fontSize: props.size || "1rem",
      color: props.color,
    }}
  />
);

export default HomeIcon;

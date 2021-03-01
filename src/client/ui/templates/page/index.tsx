import * as React from "react";

export const Page: React.FC = ({ children }) => {
  return (
    <div style={{ height: "100%" }}>{children}</div>
  );
};

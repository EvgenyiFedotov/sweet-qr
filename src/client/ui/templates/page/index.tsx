import * as React from "react";
import "./index.css";

export const Page: React.FC = ({ children }) => {
  return (
    <div className="ui-template__page">{children}</div>
  );
};

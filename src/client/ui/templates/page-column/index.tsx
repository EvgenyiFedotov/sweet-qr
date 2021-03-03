import * as React from "react";
import "./index.css";

export const PageColumn: React.FC<{ className?: string }> = ({ className = "", children }) => {
  return (
    <div className={`ui-templates__page-column ${className}`}>
      {children}
    </div>
  );
};

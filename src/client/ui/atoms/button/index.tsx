import * as React from 'react';
import ClipLoader from "react-spinners/ClipLoader";
import "./index.css";

export const Button: React.FC<{
  onClick: React.EventHandler<React.MouseEvent<HTMLButtonElement>>;
  loading?: boolean;
}> = ({ children, onClick, loading }) => {
  return (
    <button
      className="ui-atoms__button"
      onClick={onClick}
    >
      {loading && <ClipLoader size={16} color="black" />}
      {!loading && children}
    </button>
  );
}

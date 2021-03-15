import React from "react";
import "./styles/LoadingSpinner.scss";
interface LoadingSpinnerProps {}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = () => {
  return (
    <div className="LoadingSpinner-container">
      <div className="LoadingSpinner-spinner" />
    </div>
  );
};

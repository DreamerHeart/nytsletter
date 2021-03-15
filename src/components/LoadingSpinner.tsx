import React from "react";
import styles from "./styles/LoadingSpinner.module.scss";

interface LoadingSpinnerProps {}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = () => {
  return (
    <div className={styles["LoadingSpinner-container"]}>
      <div className={styles["LoadingSpinner-spinner"]} />
    </div>
  );
};

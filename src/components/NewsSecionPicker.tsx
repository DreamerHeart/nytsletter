import clsx from "clsx";
import React from "react";
import styles from "./styles/NewsSectionPicker.module.scss";

interface Section {
  section: string;
  display_name: string;
}

interface NewsSecionPickerProps {
  mode: "small" | "large";
  sections: Section[];
  selectedSection: string;
  setSelectedSection: React.Dispatch<React.SetStateAction<string>>;
}

export const NewsSecionPicker: React.FC<NewsSecionPickerProps> = ({
  mode,
  sections,
  selectedSection,
  setSelectedSection,
}) => {
  const handleChangeSelectedSecton = (
    evt: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setSelectedSection(evt.target.value);
  };

  return (
    <nav className={styles["NewsSectionPicker-container"]}>
      {mode === "large" && (
        <ul className={styles["NewsSectionPicker-large"]}>
          {sections.map((s) => (
            <li
              className={clsx(
                styles["NewsSectionPicker-section"],
                selectedSection === s.section &&
                  styles["NewsSectionPicker-section-selected"]
              )}
              key={s.section}
              onClick={() => {
                setSelectedSection(s.section);
              }}
            >
              {s.display_name}
            </li>
          ))}
        </ul>
      )}
      {mode === "large" && (
        <div className={styles["NewsSectionPicker-small"]}>
          <div className="select">
            <select
              onChange={handleChangeSelectedSecton}
              value={selectedSection}
            >
              {sections.map((s) => (
                <option
                  className={styles["NewsSectionPicker-section"]}
                  key={s.section}
                  value={s.section}
                >
                  {s.display_name}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}
    </nav>
  );
};

import React, { useEffect, useState } from "react";
import { NewsFeed } from "./components/NewsFeed";

import "./App.scss";
import { NewsSecionPicker } from "./components/NewsSecionPicker";
import { useVerticalScrollListener } from "./hooks/useVerticalScrollListener";
import axios from "axios";
import ScrollToTop from "react-scroll-up";

const API_ENDPOINT_URL = process.env.REACT_APP_NYT_API_ENDPOINT_URL || "";
const API_KEY = process.env.REACT_APP_NYT_API_KEY || "";
const SOURCE = "nyt";

function App() {
  const [newsSectionPickerMode, setNewsSectionPickerMode] = useState<
    "small" | "large"
  >("large");
  useVerticalScrollListener(
    document,
    100,
    (n) => setNewsSectionPickerMode("small" as const),
    (n) => setNewsSectionPickerMode("large" as const)
  );

  const [sections, setSections] = useState<
    { section: string; display_name: string }[]
  >([]);
  const [selectedSection, setSelectedSection] = useState("all");

  useEffect(() => {
    axios
      .get(`${API_ENDPOINT_URL}/section-list.json?api-key=${API_KEY}`)
      .then(({ data }) => {
        let results: { section: string; display_name: string }[] = data.results;
        results = results.map((s) => {
          return {
            section: encodeURIComponent(s.section),
            display_name: s.display_name,
          };
        });
        setSections([
          { section: "all", display_name: "All" },
          ...Array.from(results).filter((s) => s.section !== "admin"),
        ]);
      });
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <h1 className="App-title">Nytsletter</h1>
        <NewsSecionPicker
          mode={newsSectionPickerMode}
          sections={sections}
          setSelectedSection={setSelectedSection}
        ></NewsSecionPicker>
      </header>
      <main className="App-main">
        <NewsFeed
          apiEndpointUrl={API_ENDPOINT_URL}
          apiKey={API_KEY}
          source={SOURCE}
          section={selectedSection}
          topMargin={newsSectionPickerMode}
        ></NewsFeed>
      </main>
      <footer className="App-footer">
        <ScrollToTop showUnder={160}>
          <img
            className="App-scroll-up-icon"
            src={process.env.PUBLIC_URL + "/img/scroll-up-icon.png"}
            alt="Scroll up"
          ></img>
        </ScrollToTop>
        <img
          src={process.env.PUBLIC_URL + "/img/poweredby_nytimes_150a.png"}
          alt="Data provided by The New York Times"
        ></img>
      </footer>
    </div>
  );
}

export default App;

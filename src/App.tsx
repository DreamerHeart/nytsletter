import React, { useEffect, useState } from "react";
import axios from "axios";
import ScrollToTop from "react-scroll-up";

import { NewsFeed } from "./components/NewsFeed";
import { NewsSecionPicker } from "./components/NewsSecionPicker";
import { useVerticalScrollListener } from "./hooks/useVerticalScrollListener";

import "./styles/App.scss";

const API_ENDPOINT_URL = process.env.REACT_APP_NYT_API_ENDPOINT_URL || "";
const API_KEY = process.env.REACT_APP_NYT_API_KEY || "";
const SOURCE = "nyt";
const DEFAULT_SECTION = "all";

function App() {
  const [newsSectionPickerMode, setNewsSectionPickerMode] = useState<
    "small" | "large"
  >("large");
  useVerticalScrollListener(
    document,
    100,
    (_) => setNewsSectionPickerMode("small" as const),
    (_) => setNewsSectionPickerMode("large" as const)
  );

  const [sections, setSections] = useState<
    { section: string; display_name: string }[]
  >([]);

  const [selectedSection, setSelectedSection] = useState(DEFAULT_SECTION);

  // On app initial load, get the section list.
  useEffect(() => {
    axios
      .get(`${API_ENDPOINT_URL}/section-list.json?api-key=${API_KEY}`)
      .then(({ data }) => {
        let results: { section: string; display_name: string }[] = data.results;
        results = results.map((s) => {
          // Section names, received from the API can contain whitespaces and special characters (like '&')
          // => escaping them with a built-in encodeURIComponent() method
          return {
            section: encodeURIComponent(s.section),
            display_name: s.display_name,
          };
        });
        // Add the missing "all" section to the resulting array and strip out the "admin" section
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
          selectedSection={selectedSection}
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

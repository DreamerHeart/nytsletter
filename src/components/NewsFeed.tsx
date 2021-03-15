import React, { useCallback, useEffect, useRef, useState } from "react";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import NewsItem from "./NewsItem";
import useSingleIntersectionObserver from "../hooks/useObserveSingleIntersection";
import { LoadingSpinner } from "./LoadingSpinner";
import clsx from "clsx";

import "./styles/NewsFeed.scss";

interface NewsFeedProps {
  apiEndpointUrl: string;
  apiKey: string;
  source: string;
  section: string;
  topMargin: "large" | "small";
}

interface NewsItemRaw {
  title: string;
  url: string;
  thumbnail_standard: string;
  published_date: string;
}

const batchSize = 20;
const maxBatchOffset = 500;

export const NewsFeed: React.FC<NewsFeedProps> = ({
  apiEndpointUrl,
  apiKey,
  source,
  section,
  topMargin,
}) => {
  const [news, setNews] = useState<NewsItemRaw[]>([]);
  const batchOffset = useRef<number>(0);

  // The ref is used to prevent loading an extra batch of data,
  // when the component is re-rendered after the LoadingSpinner gets unmounted
  const [isLoading, setIsLoading] = useState(false);
  const isLoadingRef = useRef(false);

  const [setObservedElementRef] = useSingleIntersectionObserver(
    undefined,
    () => {
      loadBatch.current();
    }
  );

  const loadBatch = useRef(() => {});

  // Update the observed node on ref change
  const onRefChange: (node?: Element | null) => void = useCallback(
    (node?: Element | null) => {
      setObservedElementRef(node);
    },
    [setObservedElementRef]
  );

  // Update the observed node after every render
  // useEffect(() => {
  //   refToLastNewsItem.current = document.querySelector(".NewsItem-container:last-child");
  //   setObservedElementRef.current(refToLastNewsItem.current);
  // }

  // When either of these deps [apiEndpointUrl, apiKey, source, section] is changed:
  // - clear the NewsFeed and reset the offset to 0
  // - recreate loadBatch() function and store its ref
  // - call loadBatch() function
  // loadBatch function:
  // - returns immideately, if isLoadingRef is already true or if batchOffset.current >= maxBatchOffset
  // - sets isLoading state and isLoadingRef to true
  // - fetches a batch of rawNewsItems
  // - adds the fetched data to the existing news[]
  // - in case of HTTP error, calls loadBatch again in 10 seconds
  // - sets isLoading state and isLoadingRef back to false
  useEffect(() => {
    setNews([]);
    batchOffset.current = 0;

    loadBatch.current = () => {
      if (isLoadingRef.current || batchOffset.current >= maxBatchOffset) return;
      isLoadingRef.current = true;
      setIsLoading(true);
      axios
        .get(
          `${apiEndpointUrl}/${source}/${section}.json?limit=${batchSize}&offset=${batchOffset.current}&api-key=${apiKey}`
        )
        .then(({ data }) => {
          if (data.results) {
            setNews((rawNewsItems) => [...rawNewsItems, ...data.results]);
            batchOffset.current += 20;
          }
        })
        .catch((err) => {
          if (axios.isAxiosError(err)) {
            console.log(
              "The API server responed with an error, retrying in 10 sec."
            );
            setTimeout(loadBatch.current, 10000);
          }
          console.log(err);
        })
        .finally(() => {
          setIsLoading(false);
          isLoadingRef.current = false;
        });
    };

    loadBatch.current();
  }, [apiEndpointUrl, apiKey, source, section]);

  return (
    <section
      className={clsx("NewsFeed", topMargin === "large" && "NewsFeed-shift")}
    >
      {news.map(
        (
          item: {
            title: string;
            url: string;
            thumbnail_standard: string;
            published_date: string;
          },
          index
        ) => (
          <NewsItem
            aRef={index === news.length - 1 ? onRefChange : undefined}
            key={uuidv4()}
            title={item.title}
            url={item.url}
            thumbnailStandard={item.thumbnail_standard}
            publishedDate={new Date(item.published_date)}
          />
        )
      )}

      {isLoading && <LoadingSpinner />}
    </section>
  );
};

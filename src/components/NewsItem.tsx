import React from "react";
import styles from "./styles/NewsItem.module.scss";

interface NewsItemProps {
  aRef: ((node?: Element | null | undefined) => void) | undefined;
  title: string;
  url: string;
  thumbnailStandard: string;
  publishedDate: Date;
}

// The use of PureComponent reduces the number or unnecessary rerenders
class NewsItem extends React.PureComponent<NewsItemProps> {
  render() {
    return (
      <article ref={this.props.aRef} className={styles["NewsItem-container"]}>
        <a className={styles["NewsItem-clickable"]} href={this.props.url}>
          <img
            className={styles["NewsItem-image"]}
            src={this.props.thumbnailStandard}
            alt=""
          ></img>
          <div className={styles["NewsItem-text"]}>
            <span className={styles["NewsItem-publication-datetime"]}>
              {this.props.publishedDate.toLocaleString("ru-RU")}
            </span>{" "}
            - {this.props.title}
          </div>
        </a>
      </article>
    );
  }
}

export default NewsItem;

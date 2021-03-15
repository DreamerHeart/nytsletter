import React from "react";
import "./styles/NewsItem.scss";

interface NewsItemProps {
  aRef: ((node?: Element | null | undefined) => void) | undefined;
  title: string;
  url: string;
  thumbnailStandard: string;
  publishedDate: Date;
}

class NewsItem extends React.Component<NewsItemProps> {
  render() {
    return (
      <article ref={this.props.aRef} className={"NewsItem-container"}>
        <a className="NewsItem-clickable" href={this.props.url}>
          <img
            className="NewsItem-image"
            src={this.props.thumbnailStandard}
            alt=""
          ></img>
          <div className="NewsItem-text">
            <span className="NewsItem-publication-datetime">
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

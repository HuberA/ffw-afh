import React from "react";
import { GatsbyImage } from "gatsby-plugin-image";
import * as styles from "./thumbnail_slideshow.module.css";
import Hammer from "react-hammerjs";
import { feuerwehrRot } from "./layout";
/** @jsx jsx */
import { jsx, css } from "@emotion/react";

const slideshowStyles = css`
  body {
    font-family: Arial;
    margin: 0;
  }

  * {
    box-sizing: border-box;
  }

  img {
    vertical-align: middle;
  }

  /* Position the image container (needed to position the left and right arrows) */
  .container {
    position: relative;
    max-width: 100%; /* Ensure the container is responsive */
  }

  /* Hide the images by default */
  .mySlides {
    display: none;
  }

  /* Add a pointer when hovering over the thumbnail images */
  .cursor {
    cursor: pointer;
  }

  /* Next & previous buttons */
  .prev,
  .next {
    cursor: pointer;
    position: absolute;
    top: 40%;
    width: auto;
    padding: 16px;
    margin-top: -50px;
    color: ${feuerwehrRot};
    font-weight: bold;
    font-size: 20px;
    border-radius: 0 3px 3px 0;
    user-select: none;
    -webkit-user-select: none;
  }

  /* Position the "next button" to the right */
  .next {
    right: 0;
    border-radius: 3px 0 0 3px;
  }

  /* On hover, add a black background color with a little bit see-through */
  .prev:hover,
  .next:hover {
    background-color: rgba(0, 0, 0, 0.8);
  }

  /* Number text (1/3 etc) */
  .numbertext {
    color: white;
    background-color: rgba(34, 34, 34, 0.5);
    font-size: 12px;
    padding: 8px 12px;
    position: absolute;
    top: 0;
  }

  /* Container for image text */
  .captioncontainer {
    text-align: center;
    background-color: #222;
    padding: 2px 16px;
    color: white;
  }

  .row:after {
    content: "";
    display: table;
    clear: both;
  }

  /* Six columns side by side */
  .column {
    float: left;
    width: 16.66%;
  }

  /* Add a transparency effect for thumbnail images */
  .demo {
    opacity: 0.6;
  }

  .active,
  .demo:hover {
    opacity: 1;
  }
`;

class Slideshow extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      slideIndex: 0,
    };
  }

  plusSlides(n) {
    const l = this.props.images.length;
    this.setState((state) => ({
      slideIndex: (this.state.slideIndex + n + l) % l,
    }));
  }

  currentSlide(n) {
    this.setState({ slideIndex: n });
  }

  handleSwipe(a) {
    this.plusSlides(-Math.sign(a.deltaX));
  }

  render() {
    const images = this.props.images.filter((i) => i !== null);
    if (images.length === 1)
      return (
        <GatsbyImage
          image={images[0].gatsbyImageData}
          backgroundColor={feuerwehrRot}
          alt={images[0].gatsbyImageData}
          style={{
            width: "100%", // Ensure it takes full width of its container
            height: "auto", // Maintain aspect ratio
            objectFit: "contain", // Prevent stretching or cropping
          }}
        />
      );
    else if (images.length > 0)
      return (
        <div className={styles.container}>
          {images.map((image, index) => {
            return (
              <div
                className={styles.mySlides}
                style={{
                  display: index === this.state.slideIndex ? "block" : "none",
                }}
                key={index}
              >
                <div className={styles.numbertext}>
                  {index + 1} / {images.length}
                </div>
                <Hammer onSwipe={(a) => this.handleSwipe(a)}>
                  <div>
                    <GatsbyImage
                      image={image.gatsbyImageData}
                      backgroundColor={feuerwehrRot}
                      alt={image.title}
                      style={{
                        display: "block",
                        marginLeft: "auto",
                        marginRight: "auto",
                        width: "100%", // Make the image responsive
                        height: "auto", // Maintain aspect ratio
                        objectFit: "contain", // Ensure no cropping or distortion
                      }}
                    />
                  </div>
                </Hammer>
              </div>
            );
          })}

          <div className={styles.prev} onClick={(e) => this.plusSlides(-1)}>
            ❮
          </div>
          <div className={styles.next} onClick={(e) => this.plusSlides(1)}>
            ❯
          </div>

          {images[this.state.slideIndex].title && (
            <div className={styles.captioncontainer}>
              <p id="caption">{images[this.state.slideIndex].title}</p>
            </div>
          )}

          <div className={styles.row}>
            {images.map((img, index) => {
              return (
                <div
                  className={styles.column}
                  key={index}
                  onClick={(e) => this.currentSlide(index)}
                >
                  <GatsbyImage
                    className={`${styles.demo} ${styles.cursor} ${this.state.slideIndex === index ? styles.active : ""
                      }`}
                    image={img.thumb}
                    alt={img.title}
                  />
                </div>
              );
            })}
          </div>
        </div>
      );
  }
}

export default Slideshow;

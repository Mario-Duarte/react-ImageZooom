import React, { useState, useEffect } from "react";
import styled, { keyframes } from "styled-components";

const rotate = keyframes`
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
`;

const Figure = styled.figure`
  position: relative;
  display: inline-block;
  width: auto;
  min-height: 25vh;
  background-position: 50% 50%;
  background-color: #eee;
  margin: 0;
  overflow: hidden;
  cursor: zoom-in;
  &:before {
    content: "";
    background-color: transparent;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    width: 100%;
    height: 100%;
    opacity: 1;
    transition: opacity 0.2s ease-in-out;
    z-index: 1;
  }
  &:after {
    content: "";
    position: absolute;
    top: calc(50% - 25px);
    left: calc(50% - 25px);
    width: 50px;
    height: 50px;
    border-radius: 50%;
    border: 5px solid transparent;
    border-top-color: #333;
    border-right-color: #333;
    border-bottom-color: #333;
    animation: ${rotate} 2s linear infinite;
    opacity: 1;
    transition: opacity 0.2s ease-in-out;
    z-index: 2;
  }
  &.loaded {
    min-height: auto;
    &:before {
      opacity: 0;
    }
    &:after {
      opacity: 0;
    }
  }
`;

const Img = styled.img`
  transition: opacity 0.8s;
  display: block;
`;

function ImageZoom(props) {
  // define and set default values to the states of the component
  const [zoomed, setZoomed] = useState("1");
  const [position, setPosition] = useState("50% 50%");
  const [imgData, setImgData] = useState(null);
  // convert state data into strings to be used as helper classes
  let figureClass = imgData ? "loaded" : "loading";
  let figureZoomed = zoomed === "0" ? "zoomed" : "fullView";

  function zoomInPosition(e) {
    // this will handle the calculations of the area where the image needs to zoom in depending on the user interaction
    const zoomer = e.currentTarget.getBoundingClientRect();
    let x = ((e.clientX - zoomer.x) / zoomer.width) * 100;
    let y = ((e.clientY - zoomer.y) / zoomer.height) * 100;
    setPosition(`${x}% ${y}%`);
  }

  function toggleZoomImage(e) {
    if (zoomed === "0") {
      // zoom out
      setZoomed("1");
    } else {
      //zoom in and set the background position correctly
      setZoomed("0");
      zoomInPosition(e);
    }
  }

  function handleClick(e) {
    // Handle the click events
    toggleZoomImage(e);
  }

  function handleMove(e) {
    // Handle the mouse move events
    if (zoomed === "0") {
      zoomInPosition(e);
    }
  }

  function handleLeave() {
    // Resets the state of the component on mouse leave
    setZoomed("1");
    setPosition("50% 50%");
  }

  useEffect(() => {
    // This checks if the prop src was passed when the component was called and throw an error if this is null or set to empty
    if (props.src === "" || props.src == null) {
      throw new Error(
        "Prop src must be defined when using ImageZoom component!"
      );
    }

    // Set initial state on component mount
    setZoomed("0");
    let img = new Image();
    img.src = props.src;
    img.addEventListener("load", () => {
      // gracefully disable the loading animation
      setTimeout(() => {
        setZoomed("1");
        setImgData(img.src);
      }, 200);
    });
  }, []);

  return (
    <Figure
      id={props.id}
      className={[figureClass, figureZoomed, props.className].join(" ")}
      style={{
        backgroundImage: `url( ${zoomed === '0' ? imgData : ''} )`,
        backgroundSize: props.zoom + "%",
        backgroundPosition: position,
      }}
      onClick={(e) => handleClick(e)}
      onMouseMove={(e) => handleMove(e)}
      onMouseLeave={() => handleLeave()}
    >
      <Img
        id="imageZoom"
        src={imgData}
        alt={props.alt}
        style={{ opacity: zoomed }}
        width={props.width}
        height={props.height}
      />
    </Figure>
  );
}

ImageZoom.defaultProps = {
  zoom: "200",
  alt: "This is an imageZoom image",
  width: "100%",
  height: "auto",
};

export default ImageZoom;

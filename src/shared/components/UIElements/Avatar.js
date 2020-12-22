import React from "react";

import "./Avatar.css";

const Avatar = (props) => {
  let imageUrl;

  if (props.image === "") {
    imageUrl =
      process.env.REACT_APP_CLOUDINARY_URL +
      "/w_128,h_128,c_limit/" +
      process.env.REACT_APP_TEMP_IMAGE;
  } else {
    imageUrl =
      process.env.REACT_APP_CLOUDINARY_URL +
      "/w_128,h_128,c_limit/" +
      props.image;
  }

  return (
    <div className={`avatar ${props.className}`} style={props.style}>
      <img
        src={imageUrl}
        alt={props.alt}
        style={{ width: props.width, height: props.width }}
      />
    </div>
  );
};

export default Avatar;

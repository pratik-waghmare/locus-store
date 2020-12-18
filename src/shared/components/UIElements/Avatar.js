import React from "react";

import "./Avatar.css";

const Avatar = (props) => {
  return (
    <div className={`avatar ${props.className}`} style={props.style}>
      <img
        src={
          process.env.REACT_APP_CLOUDINARY_URL +
          "/w_128,h_128,c_limit/" +
          props.image
        }
        alt={props.alt}
        style={{ width: props.width, height: props.width }}
      />
    </div>
  );
};

export default Avatar;

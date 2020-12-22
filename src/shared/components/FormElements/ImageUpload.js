import React, { useRef, useState, useEffect } from "react";
import Button from "./Button";

import "./ImageUpload.css";

const ImageUpload = (props) => {
  const [file, setFile] = useState();
  const [isValid, setIsValid] = useState(false);
  const [previewUrl, setPreviewUrl] = useState();
  let initialImage =
    props.initialImage === ""
      ? process.env.REACT_APP_TEMP_IMAGE
      : props.initialImage;

  const imageRef = useRef();

  useEffect(() => {
    if (!file) return;

    const fileReader = new FileReader();

    fileReader.onload = () => {
      setPreviewUrl(fileReader.result);
    };

    fileReader.readAsDataURL(file);
  }, [file]);

  const pickedHandler = (event) => {
    let pickedFile;
    let isValid;

    if (event.target.files && event.target.files.length === 1) {
      pickedFile = event.target.files[0];
      isValid = true;

      setFile(pickedFile);
      setIsValid(isValid);
    } else {
      isValid = false;
      setIsValid(isValid);
    }

    props.onInput(props.id, pickedFile, isValid);
  };

  const pickImageHandler = () => {
    imageRef.current.click();
  };

  return (
    <div>
      <input
        id="props.id"
        type="file"
        style={{ display: "none" }}
        ref={imageRef}
        onChange={pickedHandler}
      />
      <div
        className="d-flex-column center mb-3"
        style={{ width: `${props.width}` }}
      >
        <div
          className="image-upload__preview"
          style={{ width: `${props.width}`, height: `${props.height}` }}
        >
          {previewUrl && <img src={previewUrl} alt="Preview" />}
          {!previewUrl && initialImage && (
            <img
              src={`${process.env.REACT_APP_CLOUDINARY_URL}/w_160,h_160,c_limit/${initialImage}`}
              alt="Preview"
            />
          )}
        </div>
        <div>
          <Button type="button" onClick={pickImageHandler} width={props.width}>
            {props.placeholder}
          </Button>
        </div>
      </div>
      {!isValid && <p>{props.errorText}</p>}
    </div>
  );
};

export default ImageUpload;

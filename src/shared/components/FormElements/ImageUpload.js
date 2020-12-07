import React, { useRef, useState, useEffect } from "react";
import Button from "./Button";

import "./ImageUpload.css";

const ImageUpload = (props) => {
  const [file, setFile] = useState();
  const [isValid, setIsValid] = useState(false);
  const [previewUrl, setPreviewUrl] = useState();

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
    <div className="form-control">
      <input
        id="props.id"
        type="file"
        style={{ display: "none" }}
        ref={imageRef}
        onChange={pickedHandler}
      />
      <div className={`image-upload ${props.center && "center"}`}>
        <div className="image-upload__preview">
          {previewUrl && <img src={previewUrl} alt="Preview" />}
          {!previewUrl && <p>Please pick an image</p>}
        </div>
        <Button type="button" onClick={pickImageHandler}>
          Pick Image
        </Button>
      </div>
      {!isValid && <p>{props.errorText}</p>}
    </div>
  );
};

export default ImageUpload;

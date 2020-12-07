import React, { useContext } from "react";
import { useHistory } from "react-router-dom";
import { useForm } from "../../shared/hooks/form-hook";

import {
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE,
} from "../../shared/components/util/validators";
import Input from "../../shared/components/FormElements/Input";
import Button from "../../shared/components/FormElements/Button";
import ImageUpload from "../../shared/components/FormElements/ImageUpload";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";

import "./PlaceForm.css";
import { useHttpClient } from "../../shared/hooks/http-hook";
import { AuthContext } from "../../shared/context/auth-context";

const NewPlace = (props) => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const auth = useContext(AuthContext);
  const history = useHistory();

  const [formState, inputHandler] = useForm(
    {
      title: {
        value: "",
        isValid: false,
      },
      image: {
        value: null,
        isValid: false,
      },
      description: {
        value: "",
        isValid: false,
      },
      address: {
        value: "",
        isValid: false,
      },
    },
    false
  );

  const placeSubmitHandler = async (event) => {
    event.preventDefault();

    try {
      const formData = new FormData();
      formData.append("title", formState.inputs.title.value);
      formData.append("description", formState.inputs.description.value);
      formData.append("address", formState.inputs.address.value);
      formData.append("creator", auth.userId);
      formData.append("image", formState.inputs.image.value);

      await sendRequest(
        process.env.REACT_APP_BACKEND_URL + "/places",
        "POST",
        formData,
        {
          Authorization: "Bearer " + auth.token,
        }
      );

      history.push("/");
    } catch (err) {}

    // console.log(formState.inputs); // send to DB
  };

  return (
    <div>
      {<ErrorModal error={error} onClear={clearError}></ErrorModal>}
      <form className="place-form" onSubmit={placeSubmitHandler}>
        {isLoading && <LoadingSpinner asOverlay />}
        <Input
          id="title"
          element="input"
          type="text"
          label="Title"
          errorText="Title should not be empty"
          validators={[VALIDATOR_REQUIRE()]}
          onInput={inputHandler}
        />
        <Input
          id="description"
          element="textarea"
          type="text"
          label="Description"
          errorText="Description should not be empty"
          validators={[VALIDATOR_MINLENGTH(6)]}
          onInput={inputHandler}
        />
        <ImageUpload
          id="image"
          onInput={inputHandler}
          // errorText="Please provide image"
        />
        <Input
          id="address"
          element="input"
          type="text"
          label="Address"
          errorText="Address should not be empty"
          validators={[VALIDATOR_REQUIRE()]}
          onInput={inputHandler}
        />
        <Button type="submit" disabled={!formState.isValid}>
          ADD PLACE
        </Button>
      </form>
    </div>
  );
};

export default NewPlace;

import React, { useContext, useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";

import { useForm } from "../../shared/hooks/form-hook";
import Input from "../../shared/components/FormElements/Input";
import Button from "../../shared/components/FormElements/Button";
import { VALIDATOR_REQUIRE } from "../../shared/components/util/validators";

import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import { useHttpClient } from "../../shared/hooks/http-hook";
import "./PlaceForm.css";
import { AuthContext } from "../../shared/context/auth-context";

const UpdatePlace = (props) => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  const [loadedPlace, setLoadedPlace] = useState(null);

  const placeId = useParams().placeId;

  const history = useHistory();

  const auth = useContext(AuthContext);

  const [formState, inputHandler, setFormData] = useForm(
    {
      title: {
        value: "",
        isValid: false,
      },
      description: {
        value: "",
        isValid: false,
      },
    },
    false
  );

  useEffect(() => {
    const fetchPlace = async () => {
      const responseData = await sendRequest(
        `${process.env.REACT_APP_BACKEND_URL}/places/${placeId}`
      );

      setLoadedPlace(responseData.place);

      setFormData(
        {
          title: {
            value: responseData.place.title,
            isValid: true,
          },
          description: {
            value: responseData.place.description,
            isValid: true,
          },
        },
        true
      );
    };

    fetchPlace();
  }, [setFormData, sendRequest, placeId]);

  const placeUpdateSubmitHandler = async (event) => {
    event.preventDefault();

    try {
      await sendRequest(
        `${process.env.REACT_APP_BACKEND_URL}/places/${placeId}`,
        "PATCH",
        JSON.stringify({
          title: formState.inputs.title.value,
          description: formState.inputs.description.value,
        }),
        {
          "Content-Type": "application/json",
          Authorization: "Bearer " + auth.token,
        }
      );
    } catch (err) {}

    history.push("/" + auth.userId + "/places");
  };

  if (isLoading) {
    return (
      <center>
        <LoadingSpinner />
      </center>
    );
  }

  return (
    <>
      {<ErrorModal error={error} onClear={clearError}></ErrorModal>}
      {!isLoading && loadedPlace && (
        <form className="place-form" onSubmit={placeUpdateSubmitHandler}>
          <Input
            id="title"
            element="input"
            type="text"
            label="Title"
            errorText="Title should not be empty"
            validators={[VALIDATOR_REQUIRE()]}
            valid={true}
            value={loadedPlace.title}
            onInput={inputHandler}
          />
          <Input
            id="description"
            element="textarea"
            type="text"
            label="Description"
            errorText="Description should not be empty"
            validators={[VALIDATOR_REQUIRE()]}
            valid={true}
            value={loadedPlace.description}
            onInput={inputHandler}
          />
          <Button type="submit" disabled={!formState.isValid}>
            UPDATE PLACE
          </Button>
        </form>
      )}
    </>
  );
};

export default UpdatePlace;

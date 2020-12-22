import React, { useState, useEffect, useContext } from "react";

import ImageUpload from "../../shared/components/FormElements/ImageUpload";
import {
  VALIDATOR_FILE,
  VALIDATOR_REQUIRE,
  VALIDATOR_EMAIL,
} from "../../shared/components/util/validators";
import Button from "../../shared/components/FormElements/Button";
import Input from "../../shared/components/FormElements/Input";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import Card from "../../shared/components/UIElements/Card";

import { useForm } from "../../shared/hooks/form-hook";
import { useHttpClient } from "../../shared/hooks/http-hook";
import { AuthContext } from "../../shared/context/auth-context";

import "./Dashboard.scss";

const Dashboard = (props) => {
  const auth = useContext(AuthContext);

  const [loadedUser, setLoadedUser] = useState(null);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  const [formState, inputHandler, setFormData] = useForm(
    {
      name: {
        value: "",
        isValid: false,
      },
      email: {
        value: "",
        isValid: false,
      },
      image: {
        value: "",
        isValid: false,
      },
    },
    false
  );

  const [updateDone, setUpdateDone] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      const responseData = await sendRequest(
        `${process.env.REACT_APP_BACKEND_URL}/users/${auth.userId}`
      );

      setLoadedUser(responseData.user);

      setFormData(
        {
          name: {
            value: responseData.user.name,
            isValid: true,
          },
          email: {
            value: responseData.user.name,
            isValid: true,
          },
          image: {
            value: responseData.user.image,
            isValid: true,
          },
        },
        true
      );
    };

    fetchUser();
  }, [sendRequest, setFormData, auth.userId]);

  const userUpdateSubmitHandler = async (event) => {
    event.preventDefault();
    setUpdateDone(false);

    if (!(typeof formState.inputs.image.value === typeof "")) {
      const formData = new FormData();

      formData.append("image", formState.inputs.image.value);

      try {
        await sendRequest(
          `${process.env.REACT_APP_BACKEND_URL}/users/${auth.userId}`,
          "POST",
          formData,
          {
            Authorization: "Bearer" + auth.token,
          }
        );
      } catch {}
    }

    try {
      const responseData = await sendRequest(
        `${process.env.REACT_APP_BACKEND_URL}/users/${auth.userId}`,
        "PATCH",
        JSON.stringify({
          name: formState.inputs.name.value,
          email: formState.inputs.email.value,
        }),
        { "Content-Type": "application/json" }
      );

      setUpdateDone(responseData.message);
    } catch {}
  };

  return (
    <div className="container" style={{ maxWidth: "600px", width: "80%" }}>
      {error && <ErrorModal error={error} onClear={clearError} />}
      {loadedUser && (
        <form onSubmit={userUpdateSubmitHandler}>
          <Card>
            {isLoading && <LoadingSpinner asOverlay />}
            <div
              className="mb-3"
              style={{
                width: "100%",
              }}
            >
              <ImageUpload
                id="image"
                onInput={inputHandler}
                validators={[VALIDATOR_FILE()]}
                width="8rem"
                height="8rem"
                placeholder="EDIT"
                initialImage={loadedUser.image}
                center
              />
            </div>
            <div className="mb-2">
              <Input
                type="name"
                id="name"
                element="input"
                placeholder="Name"
                valid={true}
                validators={[VALIDATOR_REQUIRE()]}
                value={loadedUser.name}
                onInput={inputHandler}
              />
            </div>
            <div className="mb-3">
              <Input
                type="email"
                element="input"
                valid={true}
                validators={[VALIDATOR_EMAIL()]}
                id="email"
                placeholder="Email"
                value={loadedUser.email}
                onInput={inputHandler}
              />
            </div>
            <Button type="submit" disabled={!formState.isValid}>
              UPDATE
            </Button>
            {updateDone && (
              <div
                className="alert alert-success mt-3 pl-5 pr-5 center"
                role="alert"
                style={{ transitionDelay: "0.5s" }}
              >
                {updateDone}
              </div>
            )}
          </Card>
        </form>
      )}
    </div>
  );
};

export default Dashboard;

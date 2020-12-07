import React, { useState, useContext } from "react";

import Input from "../../shared/components/FormElements/Input";
import Button from "../../shared/components/FormElements/Button";
import ImageUpload from "../../shared/components/FormElements/ImageUpload";
import Card from "../../shared/components/UIElements/Card";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";

import { useHttpClient } from "../../shared/hooks/http-hook";
import { useForm } from "../../shared/hooks/form-hook";
import {
  VALIDATOR_EMAIL,
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE,
  VALIDATOR_FILE,
} from "../../shared/components/util/validators";
import { AuthContext } from "../../shared/context/auth-context";
import "./Auth.css";

const Auth = (props) => {
  const auth = useContext(AuthContext);

  const [isLogin, setIsLogin] = useState(true);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  const [formState, inputHandler, setFormData] = useForm(
    {
      email: {
        value: "",
        isValid: false,
      },
      password: {
        value: "",
        isValid: false,
      },
    },
    false
  );

  const toggleHandler = () => {
    if (!isLogin) {
      setFormData(
        {
          ...formState.inputs,
          name: undefined,
          image: undefined,
        },
        formState.inputs.email.isValid && formState.inputs.password.isValid
      );
    } else {
      setFormData(
        {
          ...formState.inputs,
          name: {
            value: "",
            isValid: false,
          },
          image: {
            value: null,
            isValid: false,
          },
        },
        false
      );
    }

    setIsLogin((prevLogin) => !prevLogin);
  };

  const authHandler = async (event) => {
    event.preventDefault();

    if (isLogin) {
      try {
        const responseData = await sendRequest(
          process.env.REACT_APP_BACKEND_URL + "/users/login",
          "POST",
          JSON.stringify({
            email: formState.inputs.email.value,
            password: formState.inputs.password.value,
          }),
          { "Content-Type": "application/json" }
        );

        auth.login(responseData.userId, responseData.token);
      } catch (err) {}
    } else {
      try {
        const formData = new FormData();
        formData.append("email", formState.inputs.email.value);
        formData.append("name", formState.inputs.name.value);
        formData.append("password", formState.inputs.password.value);
        formData.append("image", formState.inputs.image.value);

        const responseData = await sendRequest(
          process.env.REACT_APP_BACKEND_URL + "/users/signup",
          "POST",
          formData
        );

        auth.login(responseData.userId, responseData.token);
      } catch (err) {}
    }
  };

  return (
    <>
      {<ErrorModal error={error} onClear={clearError}></ErrorModal>}
      <Card className="authentication">
        {isLoading && <LoadingSpinner asOverlay />}
        <h1 className="subHeading">{isLogin ? "Login" : "Register"}</h1>
        <hr />
        <form onSubmit={authHandler}>
          {!isLogin && (
            <Input
              id="name"
              element="input"
              type="text"
              label="Name"
              errorText="Name should not be empty"
              validators={[VALIDATOR_REQUIRE()]}
              onInput={inputHandler}
            />
          )}
          {!isLogin && (
            <ImageUpload
              id="image"
              onInput={inputHandler}
              validators={[VALIDATOR_FILE()]}
              // errorText="Please provide image"
              center
            />
          )}
          <Input
            id="email"
            element="input"
            type="text"
            label="Email"
            errorText="Email should not be empty"
            validators={[VALIDATOR_EMAIL()]}
            onInput={inputHandler}
          />
          <Input
            id="password"
            element="input"
            type="password"
            label="Password"
            errorText="Password should of minimum 6 letters"
            validators={[VALIDATOR_MINLENGTH(5)]}
            onInput={inputHandler}
          />
          <Button type="submit" disabled={!formState.isValid}>
            {isLogin ? "LOGIN" : "SIGN UP"}
          </Button>
        </form>
        <Button inverse onClick={toggleHandler}>
          {!isLogin ? "LOGIN" : "SIGN UP"}
        </Button>
      </Card>
    </>
  );
};

export default Auth;

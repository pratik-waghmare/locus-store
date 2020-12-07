import { useReducer, useCallback } from "react";

const formReducer = (state, action) => {
  switch (action.type) {
    case "INPUT_CHANGE":
      let formIsValid = true;

      for (const inputId in state.inputs) {
        if (!state.inputs[inputId]) {
          continue;
        }

        if (inputId === action.inputId) {
          formIsValid = formIsValid && action.isValid;
        } else {
          formIsValid = formIsValid && state.inputs[inputId].isValid;
        }
      }

      return {
        ...state,
        inputs: {
          ...state.inputs,
          [action.id]: {
            value: action.value,
            isValid: action.isValid,
          },
        },
        isValid: formIsValid,
      };
    case "SET_DATA":
      return {
        ...state,
        inputs: action.inputs,
        isValid: action.formIsValid,
      };

    default:
      return state;
  }
};

export const useForm = (initialInputs, initialValidity) => {
  const [formState, dispatch] = useReducer(formReducer, {
    inputs: initialInputs,
    isValid: initialValidity,
  });

  const inputHandler = useCallback((id, value, isValid) => {
    dispatch({ type: "INPUT_CHANGE", id: id, value: value, isValid: isValid });
  }, []);

  const setFormData = useCallback((inputs, formValidity) => {
    dispatch({ type: "SET_DATA", inputs: inputs, isValid: formValidity });
  }, []);

  return [formState, inputHandler, setFormData];
};

// export default useForm;

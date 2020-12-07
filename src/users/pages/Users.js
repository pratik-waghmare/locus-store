import React, { useState, useEffect } from "react";
// import classes from "./Users.module.css";

import UsersList from "../components/UsersList";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";

import { useHttpClient } from "../../shared/hooks/http-hook";

const Users = (props) => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [loadedUsers, setLoadedUsers] = useState();

  useEffect(() => {
    const fetchUsers = async () => {
      const responseData = await sendRequest(
        process.env.REACT_APP_BACKEND_URL + "/users/"
      );

      setLoadedUsers(responseData.users);
    };

    fetchUsers();
  }, [sendRequest]);

  return (
    <div>
      {<ErrorModal error={error} onClear={clearError}></ErrorModal>}
      {isLoading && <LoadingSpinner asOverlay />}
      {!isLoading && loadedUsers && <UsersList items={loadedUsers} />}
    </div>
  );
};

export default Users;

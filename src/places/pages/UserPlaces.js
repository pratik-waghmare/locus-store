import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import PlaceList from "../components/PlaceList";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import { useHttpClient } from "../../shared/hooks/http-hook";

const UserPlaces = () => {
  const userId = useParams().userId;
  const [loadedPlaces, setLoadedPlaces] = useState([]);

  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  useEffect(() => {
    const fetchPlaces = async () => {
      const responseData = await sendRequest(
        `${process.env.REACT_APP_BACKEND_URL}/places/user/${userId}`
      );

      setLoadedPlaces(responseData.places);
    };

    fetchPlaces();
  }, [sendRequest, userId]);

  const onDeleteHandler = (deletedPlaceId) => {
    setLoadedPlaces((prevPlaces) =>
      prevPlaces.filter((place) => place.id !== deletedPlaceId)
    );
  };

  return (
    <>
      {<ErrorModal error={error} onClear={clearError}></ErrorModal>}
      {isLoading && <LoadingSpinner asOverlay />}
      <PlaceList items={loadedPlaces} onDelete={onDeleteHandler} />
    </>
  );
};

export default UserPlaces;

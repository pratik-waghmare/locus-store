import React from "react";

import classes from "./UsersList.module.scss";
import UserItem from "./UserItem";

const UsersList = (props) => {
  if (props.items.length === 0) {
    return (
      <div style={{ textAlign: "center" }}>
        <h1>Items no found !</h1>
      </div>
    );
  }
  return (
    <ul className={classes.users__list}>
      {props.items.map((user) => (
        <UserItem
          key={user.id}
          id={user.id}
          name={user.name}
          image={user.image}
          placeCount={user.places.length}
        />
      ))}
    </ul>
  );
};

export default UsersList;

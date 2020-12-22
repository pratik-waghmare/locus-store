import React from "react";

import classes from "./UsersList.module.scss";
import UserItem from "./UserItem";

const UsersList = (props) => {
  if (props.items.length === 0) {
    return (
      <div className="d-flex justify-content-center">
        <div className="card center mt-3 p-5" style={{ width: "60vw" }}>
          <h2 style={{ fontSize: "1.5em", fontWeight: 700 }}>
            No items found !
          </h2>
        </div>
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

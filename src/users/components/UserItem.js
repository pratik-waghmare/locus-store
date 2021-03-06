import React from "react";
import { Link } from "react-router-dom";

import Avatar from "../../shared/components/UIElements/Avatar";
import Card from "../../shared/components/UIElements/Card";
import classes from "./UserItem.module.scss";

const userItem = (props) => {
  return (
    <li className={classes.user__item}>
      <Card className={classes.user__item__content}>
        <Link to={`/${props.id}/places`}>
          <div className={classes.user__item__image}>
            <Avatar image={props.image} alt={props.name} />
          </div>
          <div className={classes.user__item__info}>
            <h1 className="subHeading">{props.name}</h1>
            <p>
              <span className="label">
                Place
                {props.placeCount > 1 ? "s" : null} :{" "}
              </span>
              {props.placeCount}
            </p>
          </div>
        </Link>
      </Card>
    </li>
  );
};

export default userItem;

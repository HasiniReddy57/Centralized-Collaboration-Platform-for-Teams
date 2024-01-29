import React from "react";
import { useState } from "react";
import styles from "../styles/teampage.module.css";
import Activities from "./mainBox/Activities";
import Discussion from "./mainBox/Discussion";
import Ideas from "./mainBox/Ideas";
import Issues from "./mainBox/Issues";

function MainBox({ data, loginName, loginAttuid, isLogin }) {
  const [onActivity, setOnActivity] = useState(true);
  const [onIssue, setOnIssue] = useState(false);
  const [onIdeas, setOnIdeas] = useState(false);
  const [onDiscussion, setOnDiscussion] = useState(false);
  const [selected, showSelected] = useState("Activities");
  const arr = [setOnActivity, setOnIssue, setOnIdeas, setOnDiscussion];
  const clickHandler = (e) => {
    showSelected(e);
    setMenuDisplay(false);
  };
  const handleClickButton = (et) => {
    arr.filter((e, i) => {
      if (i == et) {
        e(true);
        return true;
      } else {
        e(false);
        return false;
      }
    });
  };

  const getComponent = () => {
    if (onActivity)
      return (
        <Activities
          initialData={data}
          loginName={loginName}
          loginAttuid={loginAttuid}
          isLogin={isLogin}
        />
      );
    if (onIdeas)
      return (
        <Ideas
          initialData={data}
          loginName={loginName}
          loginAttuid={loginAttuid}
          isLogin={isLogin}
        />
      );
    if (onIssue)
      return (
        <Issues
          initialData={data}
          loginName={loginName}
          loginAttuid={loginAttuid}
          isLogin={isLogin}
        />
      );
    if (onDiscussion)
      return (
        <Discussion
          initialData={data}
          loginName={loginName}
          loginAttuid={loginAttuid}
          isLogin={isLogin}
        />
      );
  };

  return (
    <div className={styles.activityContent}>
      <div className={styles.buttonClass}>
        <button
          className={
            styles.button +
            " " +
            (onActivity ? styles.buttonBlue : styles.buttonBlack)
          }
          onClick={() => handleClickButton(0)}
        >
          Activities
        </button>
        <button
          className={
            styles.button +
            " " +
            (onIdeas ? styles.buttonBlue : styles.buttonBlack)
          }
          onClick={() => handleClickButton(2)}
        >
          Ideas
        </button>
        <button
          className={
            styles.button +
            " " +
            (onIssue ? styles.buttonBlue : styles.buttonBlack)
          }
          onClick={() => handleClickButton(1)}
        >
          Issues
        </button>

        <button
          className={
            styles.button +
            " " +
            (onDiscussion ? styles.buttonBlue : styles.buttonBlack)
          }
          onClick={() => handleClickButton(3)}
        >
          Discussion
        </button>
      </div>
      {getComponent()}
    </div>
  );
}

export default MainBox;

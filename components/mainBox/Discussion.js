import { useRouter } from "next/router";
import React, { useRef, useState } from "react";
import { useEffect } from "react";
import styles from "../../styles/Activities.module.css";
import ActivityItem from "./activityItem";
import add from "@/public/images/add.svg";
import Image from "next/image";
import Modal from "../Modal";

function Activities({ initialData, loginName, loginAttuid, isLogin }) {
  const detailsRef = useRef();
  const redFlag2 = useRef();
  const router = useRouter();
  const [data, setData] = useState(initialData);
  const updateData = async (id) => {
    const responseInfo = await fetch(`http://localhost:4000/team/${id}`);
    let temp = await responseInfo.json();
    setData(temp);
    setActivities(temp.discussions);
  };

  const [showModal, setShowModal] = useState(false);
  const [modalText, setModalText] = useState("");
  const [newId, setNewId] = useState(new Date());
  const [singleActivity, setSingleActivity] = useState("");
  const [activities, setActivities] = useState(initialData.discussions);
  useEffect(() => {
    updateData(router.query.id);
  }, []);

  const addHandler = () => {
    detailsRef.current.style.display = "flex";
  };
  const otherHandler = async () => {
    setNewId(new Date());
    const newActivity = {
      id: newId,
      ownerName: loginName,
      ownerAttuid: loginAttuid,
      text: singleActivity,
      comments: [],
    };
    if (singleActivity === "") {
      redFlag2.current.style.display = "block";
      return;
    }

    detailsRef.current.style.display = "none";
    await fetch(`http://localhost:4000/team/${data.id}`, {
      method: "PATCH",
      body: JSON.stringify({ discussions: [newActivity, ...activities] }),
      headers: { "Content-Type": "application/json" },
    });
    setModalText("Discussion added successfully !");
    setShowModal(true);
    setActivities([newActivity, ...activities]);
    setSingleActivity("");
  };

  const cancelHandler = () => {
    detailsRef.current.style.display = "none";
  };

  const removeHandler = async (id) => {
    let text = "Are you sure you want to delete?";
    if (confirm(text) == true) {
      const modified = activities.filter((activity) => {
        return activity.id != id;
      });
      setActivities(modified);
      await fetch(`http://localhost:4000/team/${data.id}`, {
        method: "PATCH",
        body: JSON.stringify({ discussions: modified }),
        headers: { "Content-Type": "application/json" },
      });
    }
  };

  return (
    <>
      <div className={styles.ContentDiv}>
        {activities.map((elem, index) => {
          return (
            <React.Fragment key={index}>
              <ActivityItem
                elem={elem}
                activities={activities}
                setActivities={setActivities}
                newId={newId}
                removeHandler={removeHandler}
                index={index}
                data={data}
                toDo="discussions"
                loginName={loginName}
                loginAttuid={loginAttuid}
                isLogin={isLogin}
              />
            </React.Fragment>
          );
        })}

        <div
          className={styles.NewActivityDiv}
          id="NewActivity"
          ref={detailsRef}
        >
          <div className={styles.ownerIcon}>
            <div className={styles.teamMemberIcon}>
              <p>{loginName[0].toUpperCase()}</p>
            </div>
          </div>
          <div className={styles.ActivityContent}>
            <div className={styles.OwnerInfo}>
              <span className={styles.OwnerName}>{loginName}</span>
              <span className={styles.activityOwner}>{"@" + loginAttuid}</span>
            </div>
            <textarea
              rows={10}
              cols={100}
              className={styles.inputActivity}
              placeholder="Start a new discussion..."
              value={singleActivity}
              onChange={(e) => setSingleActivity(e.target.value)}
            />
            <span ref={redFlag2} className={styles.redFlag2}>
              Field cannot be empty
            </span>
            <br />
            <button className={styles.cancelButton} onClick={cancelHandler}>
              Cancel
            </button>
            <a href={"#Activity" + (newId - 1)}>
              <button className={styles.otherButton} onClick={otherHandler}>
                Add
              </button>
            </a>
          </div>
        </div>

        {isLogin && (
          <div className={styles.addActivityDiv}>
            <button
              id="addbuttonstyle"
              onClick={addHandler}
              className={styles.addActivity}
              title="add discussion"
            >
              <a href="#NewActivity">
                <Image src={add} height={40} width={40} alt="img" />
              </a>
            </button>
            <br />
          </div>
        )}
      </div>
      <Modal
        show={showModal}
        onClose={() => {
          setShowModal(false);
        }}
        text={modalText}
      ></Modal>
    </>
  );
}

export default Activities;

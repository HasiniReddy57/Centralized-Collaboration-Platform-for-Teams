import { useRef, useState } from "react";
import styles from "../../styles/Activities.module.css";
import Image from "next/image";
import Delete from "../../public/images/delete.svg";
import { useRouter } from "next/router";
import { useEffect } from "react";
import add from "@/public/images/add.svg";

function Activities({ initialData, loginName, loginAttuid, isLogin }) {
  let loginRole = null;
  const firstLetter = loginName.charAt(0).toUpperCase();
  const detailsRef = useRef();
  const redFlag2 = useRef();

  const router = useRouter();
  const [data, setData] = useState(initialData);
  const updateData = async (id) => {
    const responseInfo = await fetch(`http://localhost:4000/team/${id}`);
    let temp = await responseInfo.json();
    setData(temp);
    setActivities(temp.activities);
  };

  if (isLogin) {
    let loginMemData = data.members.filter((member) => {
      return member.attuid === loginAttuid;
    });
    if (loginMemData.length !== 0) loginRole = loginMemData[0].role;
  }

  const [newId, setNewId] = useState(1);
  const [singleActivity, setSingleActivity] = useState("");
  const [activities, setActivities] = useState(initialData.activities);

  useEffect(() => {
    updateData(router.query.id);
  }, []);

  const addHandler = () => {
    detailsRef.current.style.display = "flex";
  };

  const otherHandler = async () => {
    if (singleActivity === "") {
      redFlag2.current.style.display = "block";
      return;
    }
    const newActivity = {
      id: new Date(),
      activityOwnerName: loginName,
      activityOwner: loginAttuid,
      activity: singleActivity,
    };
    setActivities([newActivity, ...activities]);
    setNewId(newId + 1);
    setSingleActivity("");
    detailsRef.current.style.display = "none";
    await fetch(`http://localhost:4000/team/${data.id}`, {
      method: "PATCH",
      body: JSON.stringify({ activities: [newActivity, ...activities] }),
      headers: { "Content-Type": "application/json" },
    });
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
        body: JSON.stringify({ activities: modified }),
        headers: { "Content-Type": "application/json" },
      });
    }
  };

  return (
    <>
      <div className={styles.ContentDiv}>
        {activities.length != 0 &&
          activities.map((elem) => {
            return (
              <div
                id={"Activity" + elem.id}
                className={styles.activityDiv}
                key={elem.id}
              >
                <div className={styles.activityInnerDiv}>
                  <div className={styles.ownerIcon}>
                    <div className={styles.teamMemberIcon}>
                      <p>{elem.activityOwnerName[0].toUpperCase()}</p>
                    </div>
                  </div>
                  <div className={styles.ActivityContent}>
                    <div className={styles.OwnerInfo}>
                      <span className={styles.OwnerName}>
                        {elem.activityOwnerName}
                      </span>
                      <span className={styles.activityOwner}>
                        {"@" + elem.activityOwner}
                      </span>
                    </div>
                    <div className={styles.ActivityText}>
                      <span className={styles.activity}>{elem.activity}</span>
                    </div>
                  </div>
                </div>
                {loginRole === "POC" && (
                  <div
                    className={styles.removeActivity}
                    onClick={() => {
                      removeHandler(elem.id);
                    }}
                  >
                    <Image
                      className={styles.removeActivityImg}
                      src={Delete}
                      alt="image"
                    />
                  </div>
                )}
              </div>
            );
          })}

        <div
          className={styles.NewActivityDiv}
          id="NewActivity"
          ref={detailsRef}
        >
          <div className={styles.ownerIcon}>
            <div className={styles.teamMemberIcon}>
              <p>{firstLetter}</p>
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
              placeholder="Enter new activity..."
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

        {loginRole === "POC" && (
          <div className={styles.addActivityDiv}>
            <button
              id="addbuttonstyle"
              onClick={addHandler}
              className={styles.addActivity}
              title="add activity"
            >
              <a href="#NewActivity">
                <Image src={add} height={40} width={40} alt="img" />
              </a>
            </button>
            <br />
          </div>
        )}
      </div>
    </>
  );
}

export default Activities;

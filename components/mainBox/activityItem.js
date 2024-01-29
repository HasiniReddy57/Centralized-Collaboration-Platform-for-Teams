import { useRef, useState } from "react";
import styles from "../../styles/Activities.module.css";
import Image from "next/image";
import Delete from "../../public/images/delete.svg";
import Edit from "../../public/images/editt.svg";
import Comment from "../../public/images/comment.svg";
import Modal from "../Modal";

function ActivityItem({
  newId,
  elem,
  activities,
  setActivities,
  removeHandler,
  index,
  data,
  toDo,
  loginName,
  loginAttuid,
  isLogin,
}) {
  let pocData = data.members.filter((value) => {
    return value.role == "POC";
  });
  const pocAttuid = pocData[0].attuid;
  const newCommentRef = useRef();
  const editTextRef = useRef();

  const commentRedFlag = useRef();
  const commentHover = useRef();
  const [commentText, setCommentText] = useState("");
  const [tempCommentIndex, setTempCommentIndex] = useState(null);
  const [tempCommentId, setTempCommentId] = useState(null);
  const [editText, setEditText] = useState(elem.text);
  const [editCommentText, setEditCommentText] = useState();
  const [showConfirm, setShowConfirm] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalText, setModalText] = useState("");
  const [isElem, setIsElem] = useState(false);
  const displayAddNewComment = () => {
    newCommentRef.current.style.display = "flex";
  };

  const removeAddNewComment = () => {
    newCommentRef.current.style.display = "none";
    commentRedFlag.current.style.display = "none";
  };
  const removeEditText = () => {
    editTextRef.current.style.display = "none";
  };

  const submitCommentHandle = async () => {
    if (commentText === "") {
      commentRedFlag.current.style.display = "block";
      return;
    }

    let newList = [...activities];
    newList[index].comments.push({
      commentId: new Date(),
      commentOwnerName: loginName,
      commentOwnerAttuid: loginAttuid,
      comment: commentText,
    });
    if (toDo === "issues") {
      await fetch(`http://localhost:4000/team/${data.id}`, {
        method: "PATCH",
        body: JSON.stringify({ issues: newList }),
        headers: { "Content-Type": "application/json" },
      });
    } else if (toDo === "ideas") {
      await fetch(`http://localhost:4000/team/${data.id}`, {
        method: "PATCH",
        body: JSON.stringify({ ideas: newList }),
        headers: { "Content-Type": "application/json" },
      });
    } else if (toDo === "discussions") {
      await fetch(`http://localhost:4000/team/${data.id}`, {
        method: "PATCH",
        body: JSON.stringify({ discussions: newList }),
        headers: { "Content-Type": "application/json" },
      });
    }
    setCommentText("");
    setActivities(newList);
    newCommentRef.current.style.display = "none";
    setModalText("Comment added successfully !");
    setShowConfirm(null);
    setShowModal(true);
  };

  const editHandler = (id) => {
    editTextRef.current.style.display = "flex";
    for (let elem of activities) {
      if (elem.id === id) {
        setEditText(elem.text);
      }
    }

    for (let elem of activities) {
      for (let cmt of elem.comments) {
        document.getElementById(`edit${cmt.commentId}`).style.display = "none";
      }
    }
  };

  const submitEditText = async () => {
    let modified = activities.map((activity) => {
      if (activity.id == elem.id) {
        activity.text = editText;
        return activity;
      }
      return activity;
    });
    if (toDo === "issues") {
      await fetch(`http://localhost:4000/team/${data.id}`, {
        method: "PATCH",
        body: JSON.stringify({ issues: modified }),
        headers: { "Content-Type": "application/json" },
      });

      setModalText("Issue is edited !");
      setShowConfirm(false);
      setShowModal(true);
    } else if (toDo === "ideas") {
      await fetch(`http://localhost:4000/team/${data.id}`, {
        method: "PATCH",
        body: JSON.stringify({ ideas: modified }),
        headers: { "Content-Type": "application/json" },
      });
      setModalText("Idea is edited !");
      setShowConfirm(false);
      setShowModal(true);
    } else if (toDo === "discussions") {
      await fetch(`http://localhost:4000/team/${data.id}`, {
        method: "PATCH",
        body: JSON.stringify({ discussions: modified }),
        headers: { "Content-Type": "application/json" },
      });

      setModalText("Discussion is edited !");
      setShowConfirm(false);
      setShowModal(true);
    }

    setActivities(modified);
    editTextRef.current.style.display = "none";
  };

  const confirmationModalElem = (id) => {
    setShowConfirm(id);
    setIsElem(true);

    setModalText("Please confirm Deletion.");
    setShowModal(true);
  };

  const removeCommentHandler = async (id) => {
    let newList = [...activities];
    const modified = newList[index].comments.filter((comment) => {
      return comment.commentId != id;
    });
    newList[index].comments = modified;
    setActivities(newList);

    if (toDo === "ideas") {
      await fetch(`http://localhost:4000/team/${data.id}`, {
        method: "PATCH",
        body: JSON.stringify({ ideas: newList }),
        headers: { "Content-Type": "application/json" },
      });
    } else if (toDo === "issues") {
      await fetch(`http://localhost:4000/team/${data.id}`, {
        method: "PATCH",
        body: JSON.stringify({ issues: newList }),
        headers: { "Content-Type": "application/json" },
      });
    } else if (toDo === "ideas") {
      await fetch(`http://localhost:4000/team/${data.id}`, {
        method: "PATCH",
        body: JSON.stringify({ discussions: newList }),
        headers: { "Content-Type": "application/json" },
      });
    }

    // editCommentRef.current = null;
  };

  const confirmationModalComment = (id) => {
    setShowConfirm(id);
    setIsElem(false);
    setModalText("Please confirm Deletion.");
    setShowModal(true);
  };

  const editCommentHandler = (id, c_index) => {
    editTextRef.current.style.display = "none";

    for (let elem of activities) {
      for (let cmt of elem.comments) {
        document.getElementById(`edit${cmt.commentId}`).style.display = "none";
      }
    }
    setTempCommentIndex(c_index);
    setTempCommentId(id);
    let comment_text = elem.comments[c_index].comment;
    setEditCommentText(comment_text);
    console.log("text is set in the function");
  };

  const submitEditComment = async () => {
    let commentsList = elem.comments;
    for (let i = 0; i < commentsList.length; i++) {
      if (commentsList[i].commentId === tempCommentId) {
        console.log("done");
        commentsList[i].comment = editCommentText;
        break;
      }
    }

    activities[index].comments = commentsList;

    if (toDo === "issues") {
      await fetch(`http://localhost:4000/team/${data.id}`, {
        method: "PATCH",
        body: JSON.stringify({ issues: activities }),
        headers: { "Content-Type": "application/json" },
      });
    } else if (toDo === "ideas") {
      await fetch(`http://localhost:4000/team/${data.id}`, {
        method: "PATCH",
        body: JSON.stringify({ ideas: activities }),
        headers: { "Content-Type": "application/json" },
      });
    } else if (toDo === "discussions") {
      await fetch(`http://localhost:4000/team/${data.id}`, {
        method: "PATCH",
        body: JSON.stringify({ discussions: activities }),
        headers: { "Content-Type": "application/json" },
      });
    }
    setShowConfirm(null);
    setModalText("Comment is edited !");
    setShowModal(true);
    setActivities(activities);
    setTempCommentIndex(null);
    setTempCommentId(null);
  };
  const commentEnable = () => {};
  const commentHoverHandler = () => {
    commentHover.current.style.display = "block";
  };
  const commentHoverLeave = () => {
    commentHover.current.style.display = "none";
  };
  return (
    <div className={styles.ActivityOuterDiv}>
      <div
        id={"Activity" + elem.activityId}
        className={styles.activityDiv}
        key={elem.id}
      >
        <div className={styles.activityInnerDiv}>
          <div className={styles.ownerIcon}>
            <div className={styles.teamMemberIcon}>
              <p>{elem.ownerName[0].toUpperCase()}</p>
            </div>
          </div>
          <div className={styles.ActivityContent}>
            <div className={styles.OwnerInfo}>
              <span className={styles.OwnerName}>{elem.ownerName}</span>
              <span className={styles.activityOwner}>
                {"@" + elem.ownerAttuid}
              </span>
            </div>
            <div className={styles.ActivityText}>
              <span className={styles.activity}>{elem.text}</span>
            </div>
          </div>
        </div>
        <div className={styles.ImagesDiv}>
          {(elem.ownerAttuid === loginAttuid || loginAttuid === pocAttuid) && (
            <>
              <div
                className={styles.removeActivity}
                onClick={() => {
                  confirmationModalElem(elem.id);
                }}
              >
                <Image
                  className={styles.removeActivityImg}
                  src={Delete}
                  alt="image"
                />
              </div>

              <div
                className={styles.editActivity}
                onClick={() => {
                  editHandler(elem.id);
                }}
              >
                <Image
                  className={styles.editActivityImg}
                  src={Edit}
                  alt="image"
                />
              </div>
            </>
          )}

          <Image
            className={styles.CommentImg}
            src={Comment}
            onMouseOver={
              isLogin
                ? () => {
                    return;
                  }
                : commentHoverHandler
            }
            onMouseLeave={commentHoverLeave}
            onClick={isLogin ? displayAddNewComment : commentHoverHandler}
            alt="image"
          />

          <span className={styles.comment} ref={commentHover}>
            Login to comment
          </span>
        </div>
        <Modal
          show={showModal}
          onClose={() => setShowModal(false)}
          text={modalText}
          showConfirm={showConfirm}
          isElem={isElem}
          removeHandler={removeHandler}
          removeCommentHandler={removeCommentHandler}
        />
      </div>
      <div className={styles.editTextDiv} ref={editTextRef}>
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
            rows={6}
            cols={90}
            className={styles.inputActivity}
            value={editText}
            onChange={(e) => {
              setEditText(e.target.value);
            }}
          />
          <br />
          <button className={styles.cancelButton} onClick={removeEditText}>
            Cancel
          </button>

          <button className={styles.otherButton} onClick={submitEditText}>
            Edit
          </button>
        </div>
      </div>
      {elem.comments.map((comment, c_index) => {
        return (
          <>
            <div className={styles.commentDivOuter}>
              <div className={styles.commentdiv} key={comment.commentId}>
                <div className={styles.ownerIcon}>
                  <div className={styles.teamMemberIcon}>
                    <p>{comment.commentOwnerName[0].toUpperCase()}</p>
                  </div>
                </div>
                <div className={styles.commentInner}>
                  <div className={styles.OwnerInfo}>
                    <span className={styles.OwnerName}>
                      {comment.commentOwnerName}
                    </span>
                    <span className={styles.activityOwner}>
                      {"@" + comment.commentOwnerAttuid}
                    </span>
                  </div>
                  <div className={styles.ActivityText}>
                    <span className={styles.activity}>{comment.comment}</span>
                  </div>
                </div>
              </div>
              {(comment.commentOwnerAttuid === loginAttuid ||
                loginAttuid === pocAttuid) && (
                <div className={styles.ImagesDiv}>
                  <div
                    className={styles.removeActivity}
                    onClick={() => {
                      confirmationModalComment(comment.commentId);
                    }}
                  >
                    <Image
                      className={styles.removeActivityImg}
                      src={Delete}
                      alt="image"
                    />
                  </div>
                  <div
                    className={styles.removeActivity}
                    onClick={() => {
                      editCommentHandler(comment.commentId, c_index);
                      document.getElementById(
                        `edit${comment.commentId}`
                      ).style.display = "block";
                    }}
                  >
                    <Image
                      className={styles.editCommentImg}
                      src={Edit}
                      alt="image"
                    />
                  </div>
                </div>
              )}
            </div>
            <div
              className={styles.editCommentTextDiv}
              id={`edit${comment.commentId}`}
            >
              <div className={styles.ownerIcon}>
                <div className={styles.editDiv}>
                  <div className={styles.teamMemberIcon}>
                    <p>{loginName[0].toUpperCase()}</p>
                  </div>
                  <div className={styles.OwnerInfo}>
                    <span className={styles.OwnerName}>{loginName}</span>
                    <span className={styles.activityOwner}>
                      {"@" + loginAttuid}
                    </span>
                  </div>
                </div>
                <textarea
                  rows={6}
                  cols={90}
                  className={styles.inputActivity}
                  value={editCommentText}
                  onChange={(e) => {
                    setEditCommentText(e.target.value);
                  }}
                />
                <br />
                <button
                  className={styles.cancelButton}
                  onClick={() => {
                    document.getElementById(
                      `edit${comment.commentId}`
                    ).style.display = "none";
                  }}
                >
                  Cancel
                </button>

                <button
                  className={styles.otherButton}
                  onClick={() => {
                    submitEditComment();
                    document.getElementById(
                      `edit${comment.commentId}`
                    ).style.display = "none";
                  }}
                >
                  Edit comment
                </button>
              </div>
            </div>
          </>
        );
      })}

      <div className={styles.NewCommentDiv} ref={newCommentRef}>
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
            rows={6}
            cols={90}
            className={styles.inputActivity}
            placeholder="Enter new comment..."
            value={commentText}
            onChange={(e) => {
              setCommentText(e.target.value);
            }}
          />
          <span ref={commentRedFlag} className={styles.redFlag2}>
            Field cannot be empty
          </span>
          <br />
          <button className={styles.cancelButton} onClick={removeAddNewComment}>
            Cancel
          </button>
          <a href={"#Activity" + (newId - 1)}>
            <button
              className={styles.otherButton}
              onClick={submitCommentHandle}
            >
              Comment
            </button>
          </a>
        </div>
      </div>
    </div>
  );
}

export default ActivityItem;

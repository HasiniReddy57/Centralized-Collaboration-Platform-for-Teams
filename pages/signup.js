// Static Site Generation

import Link from "next/link";
import Image from "next/image";
import SignupImg from "../public/images/signup.svg";
import InfoIcon from "../public/images/info.svg";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";

function Signup({ isLogin }) {
  const router = useRouter();
  const inputElement = useRef();
  const signupFlag = useRef(null);
  const passwardInfoFlag = useRef(null);
  const [flagMessage, setFlagMessage] = useState("");

  useEffect(() => {
    if (isLogin) router.push("/");
  });
  const [attuid, setAttuid] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const handleSubmit = async () => {
    const regEx = /^[a-z][a-z0-9]{5}$/;
    const regEx2 =
      /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;
    if (
      attuid.length == 0 ||
      name.length == 0 ||
      password.length == 0 ||
      confirmPassword.length == 0
    ) {
      setFlagMessage("Enter all the Fields.");
      signupFlag.current.style.display = "block";
    } else if (!regEx.test(attuid)) {
      setFlagMessage("Enter valid Attuid.");
      signupFlag.current.style.display = "block";
    } else if (password.length < 8) {
      setFlagMessage("Minimum password length is 8.");
      signupFlag.current.style.display = "block";
    } else if (!regEx2.test(password)) {
      setFlagMessage("Enter a valid Password");
      passwardInfoFlag.current.style.display = "block";
      signupFlag.current.style.display = "block";
    } else if (password !== confirmPassword) {
      setFlagMessage("Password doesn't match !!");
      signupFlag.current.style.display = "block";
      inputElement.current.focus();
    } else {
      passwardInfoFlag.current.style.display = "none";
      const user = {
        attuid: attuid,
        name: name,
        password: password,
        available: true,
      };
      const response = await fetch("http://localhost:3000/api/teams/signup", {
        method: "POST",
        body: JSON.stringify({ user }),
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
      });

      if (response.status === 201) {
        router.push("/");
      } else {
        setFlagMessage("User already exists");
        signupFlag.current.style.display = "block";
      }

      if (response.status === 400) {
        {
          setFlagMessage("User already exists");
          signupFlag.current.style.display = "block";
        }
      }
    }
  };
  return (
    <div className="mainBox">
      <div>
        <Image
          className={"loginImage " + " signupImage"}
          src={SignupImg}
          alt="image"
        />
      </div>
      <div className="SignBox">
        <h1 className="loghead">Sign Up</h1>
        <p className="loginFlag" ref={signupFlag}>
          {flagMessage}
        </p>
        <div className="formtype">
          <div className="attuid signupForm">
            <div className="attdiv">
              <input
                className="incHeight"
                type="text"
                value={attuid}
                name="attuid"
                placeholder="attuid"
                onChange={(e) => {
                  setAttuid(e.target.value);
                }}
              />
            </div>
          </div>
          <div className="nameclass signupForm">
            <input
              class="incHeight"
              type="text"
              name="name"
              value={name}
              placeholder="Full Name"
              onChange={(e) => {
                setName(e.target.value);
              }}
            ></input>
          </div>

          <div className="password signupForm">
            <div className="pwdiv">
              <input
                className="incHeight"
                type="password"
                name="password"
                value={password}
                placeholder=" New Password"
                ref={inputElement}
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
              />
              <Image
                src={InfoIcon}
                alt="img"
                className="infoIcon"
                ref={passwardInfoFlag}
                title="Password must contain at least 8 characters, one digit, one upper case alphabet, one lower case alphabet, one special character."
              />
            </div>
          </div>
          <div className="password signupForm">
            <div className="pwdiv">
              <input
                className="incHeight"
                type="password"
                name="password"
                value={confirmPassword}
                placeholder="Confirm Password"
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                }}
                onKeyUp={(e) => {
                  if (e.key === "Enter") handleSubmit();
                }}
              />
            </div>
          </div>
          <button className="signsubmit" onClick={handleSubmit}>
            Sign Up
          </button>
          <h5 id="signupheading">
            Have an account? &nbsp;
            <Link href="/login">
              <u className="underLine">Login</u>
            </Link>
          </h5>
        </div>
      </div>
    </div>
  );
}

export default Signup;

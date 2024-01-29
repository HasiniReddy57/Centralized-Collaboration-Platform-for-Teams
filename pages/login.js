// Static Site Generation

import Link from "next/link";
import Image from "next/image";
import Key from "../public/images/key.svg";
import PersonImg from "../public/images/person.svg";
import LoginImg from "../public/images/login.svg";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";

function Login({ isLogin }) {
  const router = useRouter();
  const [attuid, setAttuid] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const loginFlag = useRef(null);

  useEffect(() => {
    if (isLogin) router.push("/");
  });

  async function loginHandler(e) {
    const response = await fetch("http://localhost:3000/api/teams/login", {
      method: "POST",
      body: JSON.stringify({ attuid, password }),
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    if (data.isValid) {
      router.push("/");
    } else {
      loginFlag.current.style.display = "block";
    }
  }

  return (
    <div className="mainBox">
      <div className="loginBox">
        <h1 className="loghead">LOGIN</h1>
        <p className="loginFlag" ref={loginFlag}>
          Enter valid details
        </p>
        <div className="formtype">
          <div className="attuid">
            <div className="imgdiv">
              <Image className="personImage" src={PersonImg} alt="image" />
            </div>
            <div className="attdiv">
              <input
                value={attuid}
                className="incHeight2"
                type="text"
                name="attuid"
                placeholder="attuid"
                onChange={(e) => setAttuid(e.target.value)}
              />
            </div>
          </div>
          <div className="password">
            <div className="img1div">
              <Image className="pwImage" src={Key} alt="image" />
            </div>
            <div className="pwdiv">
              <input
                value={password}
                className="incHeight2"
                type="password"
                name="password"
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
                onKeyUp={(e) => {
                  if (e.key === "Enter") loginHandler();
                }}
              />
            </div>
          </div>
          <button className="loginsubmit" onClick={loginHandler}>
            Login
          </button>
          {error && <h4>{error}</h4>}
          <h5 id="loginheading">
            New User? &nbsp;
            <Link href="/signup">
              <u className="underLine">SignUp</u>
            </Link>
          </h5>
        </div>
      </div>
      <div>
        <Image className="loginImage" src={LoginImg} alt="image" />
      </div>
    </div>
  );
}

export default Login;

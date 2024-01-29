import React, { useState } from "react";
import styles from "../styles/NavBar.module.css";
import Image from "next/image";
import img from "../public/images/Logo.svg";
import Menu from "../public/images/Menu.svg";
import person from "../public/images/personP.png";
import { useRouter } from "next/router.js";
import Link from "next/link";

function NavBar({
  loginName,
  isLogin,
  setLogin,
  setLoginName,
  setLoginAttuid,
}) {
  const [isLoginPage, setIsLoginPage] = useState(false);
  let [menuDisplay, setMenuDisplay] = useState(null);
  const router = useRouter();

  const clickHandler = (e) => {
    setMenuDisplay(false);
    router.replace(e);
    if (e === "./login") setIsLoginPage(true);
    else setIsLoginPage(false);
  };

  async function signOutHandler() {
    const res = await fetch("http://localhost:3000/api/teams/logout", {
      credentials: "same-origin",
    });

    setLogin(false);
    setLoginName(" ");
    setLoginAttuid(" ");
    router.push("/login");
  }
  return (
    <>
      <div className={styles.container}>
        <Link
          href="/"
          onClick={() => {
            if (menuDisplay === true) setMenuDisplay(false);
          }}
        >
          <div className={styles.containerLogo}>
            <Image
              src={img}
              height={40}
              width={40}
              alt="Follow us on Twitter"
            />
            <h2>InfoBuzz</h2>
          </div>
        </Link>

        {isLogin ? (
          <div className={styles.containerButton}>
            <div className={styles.loginProfile}>
              <Image
                src={person}
                className={styles.personImg}
                height={40}
                width={40}
                alt="img"
              />
              <span>{loginName}</span>
            </div>
            <button
              className={styles.button + " " + styles.buttonBlack}
              onClick={() => signOutHandler()}
            >
              Signout
            </button>
          </div>
        ) : (
          router.pathname !== "/login" &&
          router.pathname !== "/signup" && (
            <div className={styles.containerButton}>
              {/* <button
                className={
                  styles.button +
                  " " +
                  (isLoginPage ? styles.buttonBlue : styles.buttonBlack)
                }
                onClick={() => clickHandler("./login")}
              >
                Login
              </button> */}
              <button
                className={
                  styles.button +
                  " " +
                  (!isLoginPage ? styles.buttonBlue : styles.buttonBlack)
                }
                onClick={() => clickHandler("/login")}
              >
                Login
              </button>
            </div>
          )
        )}

        <div className={styles.MenuDiv}>
          {isLogin ? (
            <button
              className={styles.button + " " + styles.buttonBlack}
              onClick={() => signOutHandler()}
            >
              Sign Out
            </button>
          ) : (
            router.pathname !== "/login" &&
            router.pathname !== "/signup" && (
              <button
                className={
                  styles.button +
                  " " +
                  (!isLoginPage ? styles.buttonBlue : styles.buttonBlack)
                }
                onClick={() => clickHandler("/login")}
              >
                Login
              </button>
            )
          )}
        </div>
      </div>

      {/* <div
        className={
          styles.MenuBox +
          " " +
          (menuDisplay === true ? styles.MenuOpen : styles.MenuClose) +
          " " +
          (menuDisplay === null && styles.MenuBoxIntial)
        }
      >
        <p
          className={styles.LoginMenu + " " + styles.MenuItem}
          onClick={() => clickHandler("./login")}
        >
          Login
        </p>
        <p
          className={styles.SignupMenu + " " + styles.MenuItem}
          onClick={() => clickHandler("/signup")}
        >
          Signup
        </p>
      </div> */}
    </>
  );
}

export default NavBar;

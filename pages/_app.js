import "@/styles/globals.css";
import NavBar from "@/components/NavBar";
import Head from "next/head";
import { useEffect, useState } from "react";

export default function App({ Component, pageProps }) {
  const [isLogin, setLogin] = useState(false);
  let [loginName, setLoginName] = useState(" ");
  let [loginAttuid, setLoginAttuid] = useState(" ");
  async function apiHandler() {
    const res = await fetch("http://localhost:3000/api/teams/isAuthenticate");
    const resp = await res.json();
    if (res.status === 201) {
      setLogin(false);
      setLoginName(" ");
      setLoginAttuid(" ");
    } else {
      setLogin(true);
      setLoginName(resp.name);
      setLoginAttuid(resp.attuid);
    }
  }
  useEffect(() => {
    apiHandler();
  });
  return (
    <>
      <Head>
        <title>InfoBuzz</title>
      </Head>
      <NavBar
        loginName={loginName}
        isLogin={isLogin}
        loginAttuid={loginAttuid}
        setLogin={setLogin}
        setLoginAttuid={setLoginAttuid}
        setLoginName={setLoginName}
      />
      <Component
        {...pageProps}
        loginName={loginName}
        isLogin={isLogin}
        loginAttuid={loginAttuid}
      />
    </>
  );
}

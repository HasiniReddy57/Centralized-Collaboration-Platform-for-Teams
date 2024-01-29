// Server Side Rendering

import style from "../styles/EachTeam.module.css";
import TeamMembers from "@/components/TeamMembers";
import MainBox from "@/components/MainBox";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function TeamID({
  initialData,
  loginName,
  loginAttuid,
  isLogin,
}) {
  const router = useRouter();
  const [data, setData] = useState(initialData);

  const [changePage, setChangePage] = useState(true);

  return (
    <div>
      <div className={style.TeamDetailsBox}>
        <div className={style.MainDiv}>
          <div className={style.IntroDiv}>
            <div className={style.TeamName}>
              <p
                className={
                  style.para + " " + style.teamName + " " + style.overviewBox
                }
              >
                {data.teamName}
              </p>
            </div>
            <div className={style.Department}>
              <p className={style.para + " " + style.overviewText}>
                Department &nbsp;:
              </p>
              <p className={style.para1}>{data?.department}</p>
            </div>
          </div>
          <div className={style.OverViewDiv}>
            <p className={style.para + " " + style.overviewText}>
              Overview &nbsp;:
            </p>
            <p className={style.para1 + " " + style.overviewBox}>
              {data?.overview}
            </p>
          </div>
        </div>
        <hr className={style.border} />
      </div>
      <div className={style.BottomBox}>
        <div className={style.ActivityBox}>
          <MainBox
            data={data}
            loginName={loginName}
            loginAttuid={loginAttuid}
            isLogin={isLogin}
          />
        </div>
        <div className={style.HorizontalDivider} />
        <div className={style.AddTeamMembers}>
          <TeamMembers teamData={data?.members} />
        </div>
      </div>
      <div className={style.teamIdMobileView}>
        <div className={style.buttonClassMobile}>
          <button
            className={
              (changePage ? style.buttonActive : style.buttonNotActive) +
              " " +
              style.button
            }
            onClick={() => setChangePage(true)}
          >
            Info
          </button>
          <button
            className={
              (changePage ? style.buttonNotActive : style.buttonActive) +
              " " +
              style.button
            }
            onClick={() => setChangePage(false)}
          >
            TeamMembers
          </button>
        </div>
        <hr className={style.border} />
        {changePage ? (
          <MainBox
            data={data}
            loginName={loginName}
            loginAttuid={loginAttuid}
            isLogin={isLogin}
          />
        ) : (
          <TeamMembers teamData={data.members} />
        )}
      </div>
    </div>
  );
}

export async function getServerSideProps(context) {
  const { params } = context;
  let { id } = params;

  const responseInfo = await fetch(`http://localhost:4000/team/${id}`);
  let temp = await responseInfo.json();

  let initialData = temp;
  return {
    props: {
      initialData,
    },
  };
}

// Incremental SSG

import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import Style from "../styles/Teams.module.css";
import AddTeamImg from "../public/images/AddTeam.svg";
import TeamCount from "../public/images/TeamCount.svg";
import Image from "next/image";
import Delete from "../public/images/delete.svg";

export default function Teams({ initialTeams, loginName, loginAttuid }) {
  const router = useRouter();

  let [filteredData, setFilteredData] = useState(initialTeams);
  let [teams, setTeams] = useState(initialTeams);

  let handleSearch = (e) => {
    let searchWord = e.target.value;
    let newData = teams.filter((team) => {
      return team.teamName.toLowerCase().includes(searchWord.toLowerCase());
    });
    setFilteredData(newData);
  };

  async function deleteTeam(id) {
    let text = "Are you sure you want to delete?";
    if (confirm(text) == true) {
      const teamData = await fetch(`http://localhost:4000/team/${id}`);
      let { members } = await teamData.json();

      const response = await fetch("http://localhost:3000/api/teams");
      const users = await response.json();

      let attuidList = members.map((member) => {
        return member.attuid;
      });

      let updatedUsers = users.filter((user) => {
        if (attuidList.includes(user.attuid)) {
          return true;
        }
        return false;
      });

      const res = await fetch(`http://localhost:4000/team/${id}`, {
        method: "DELETE",
        body: JSON.stringify(),
        headers: { "Content-Type": "application/json" },
      });

      const te = await fetch("http://localhost:4000/users", {
        method: "PUT",
        body: JSON.stringify({ users: updatedUsers }),
        headers: { "Content-Type": "application/json" },
      });

      for (let i = 0; i < updatedUsers.length; i++) {
        let uuser = updatedUsers[i];
        let userId = uuser.id;
        console.log(userId);
        const te = await fetch(`http://localhost:4000/users/${userId}`, {
          method: "PATCH",
          body: JSON.stringify({ available: true }),
          headers: { "Content-Type": "application/json" },
        });
      }

      console.log(await te.json());
      const responseInfo = await fetch("http://localhost:3000/api/teams/info");
      let Data = await responseInfo.json();
      setTeams(Data);
      setFilteredData(Data);
    }
  }

  return (
    <div className={Style.MainDiv}>
      <div className={Style.SearchDiv}>
        <input
          type="text"
          placeholder="&#128270;Search.."
          onChange={handleSearch}
          className={Style.SearchInput}
        />
      </div>
      <div className={Style.TeamsDiv}>
        {filteredData.map((team) => {
          return (
            <div key={team.id} className={Style.FullTeamDiv}>
              <Link href={"/" + team.id} key={team.id}>
                <div key={team.id} className={Style.Team}>
                  <div className={Style.TopDiv}>
                    <div className={Style.teamName}>{team.teamName}</div>
                    <div className={Style.teamCount}>
                      <Image
                        className={Style.teamCountImg}
                        src={TeamCount}
                        alt="img"
                      />
                      <span>{team.members.length}</span>
                    </div>
                  </div>
                  <div className={Style.MidDiv}>
                    <span>
                      {" "}
                      Department: &nbsp;<b>{team.department}</b>
                    </span>
                  </div>
                  {loginAttuid !== "admin" ? (
                    <div className={Style.BottomDiv}>
                      {team.overview.length > 120
                        ? team.overview.substring(0, 120) + "..."
                        : team.overview}
                    </div>
                  ) : (
                    <div className={Style.BottomDivAdmin}>
                      {team.overview.length > 120
                        ? team.overview.substring(0, 120) + "..."
                        : team.overview}
                    </div>
                  )}
                </div>
              </Link>
              {loginAttuid === "admin" && (
                <div className={Style.DeleteButtonDiv}>
                  <button
                    onClick={() => deleteTeam(team.id)}
                    className={Style.DeleteButtonTeam}
                  >
                    <Image
                      className={Style.removeActivityImg}
                      src={Delete}
                      alt="image"
                    />
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
      {loginAttuid === "admin" && (
        <div
          className={Style.AddTeamDiv + " " + Style.AddTeamButton}
          onClick={(e) => {
            router.replace("/createteam");
          }}
          title="Add Team"
        >
          <Image className={Style.AddTeamImage} src={AddTeamImg} alt="image" />
        </div>
      )}
    </div>
  );
}

export async function getStaticProps(context) {
  const responseInfo = await fetch("http://localhost:3000/api/teams/info");
  let initialTeams = await responseInfo.json();
  return {
    props: {
      initialTeams,
    },
    revalidate: 10,
  };
}

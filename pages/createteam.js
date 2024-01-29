// Incremental SSG

import style from "../styles/AddEachTeam.module.css";
import AddTeamMembers from "@/components/AddTeamMembers";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
export default function TeamID({ users, loginAttuid }) {
  const router = useRouter();
  const [teamName, setTeamName] = useState("");
  const [teamDept, setTeamDept] = useState("");
  const [teamOverview, setTeamOverview] = useState("");
  const [members, setMembers] = useState([]);

  let handleMembers = (newMember) => {
    let temp = [...members];
    if (newMember.role === "POC") {
      temp.unshift(newMember);
    } else {
      temp.push(newMember);
    }
    setMembers(temp);
  };

  const dltMember = (id) => {
    let list = members.filter((member) => {
      return member.id !== id;
    });
    setMembers(list);
  };

  useEffect(() => {
    if (loginAttuid !== "admin") router.push("/");
  }, []);

  const handleSubmit = async () => {
    if (
      teamName.length == 0 ||
      teamDept.length == 0 ||
      teamOverview.length == 0 ||
      members.length == 0
    ) {
      alert("Please enter all the details");
    } else {
      const response = await fetch("http://localhost:3000/api/teams/info", {
        method: "POST",
        body: JSON.stringify({ teamName, teamDept, teamOverview, members }),
        headers: { "Content-Type": "application/json" },
      });
      router.push("/");
    }
  };

  return (
    <div>
      <div className={style.TeamDetailsBox}>
        <div className={style.MainDiv}>
          <div className={style.IntroDiv}>
            <div className={style.TeamName}>
              <p className={style.para}>Team Name : </p>
              <p className={style.para}>
                <input
                  className={style.InputTeamName}
                  type="text"
                  placeholder="Enter your team name"
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  required
                />
              </p>
            </div>
            <div className={style.Department}>
              <p className={style.para}>Department: </p>
              <p className={style.para}>
                <input
                  className={style.InputTeamDept}
                  type="text"
                  placeholder="Enter your team department"
                  value={teamDept}
                  onChange={(e) => setTeamDept(e.target.value)}
                  required
                />
              </p>
            </div>
          </div>
          <div className={style.OverViewDiv}>
            <p className={style.para}>Overview:</p>
            <textarea
              rows={4}
              cols={130}
              placeholder="Enter the overview of your team"
              className={style.InputTeamOverview}
              type="text"
              value={teamOverview}
              onChange={(e) => setTeamOverview(e.target.value)}
              required
            />
          </div>
        </div>

        <hr className={style.border} />
      </div>
      <div className={style.AddBottomBox}>
        <div className={style.AddTeamMembers}>
          <AddTeamMembers
            initialUsers={users}
            handleMembers={handleMembers}
            dltMember={dltMember}
          />
        </div>
        {/* <div className={style.HorizontalDivider1} /> */}
        <div className={style.submitDataDiv}>
          <button onClick={handleSubmit} className={style.submitDataButton}>
            Create Team
          </button>
        </div>
      </div>
    </div>
  );
}

export async function getStaticProps() {
  const response = await fetch("http://localhost:3000/api/teams");
  const users = await response.json();

  return {
    props: {
      users,
    },
    revalidate: 10,
  };
}

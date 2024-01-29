import { useRef, useState } from "react";
import Styles from "../styles/TeamMembers.module.css";

export default function TeamMembers({
  initialUsers,
  handleMembers,
  // dltMember,
}) {
  // let placeholder = "&#128270; Search..";
  //let role = "";
  const [role, setRole] = useState("");

  const [users, setUsers] = useState(initialUsers);
  const [searchText, setSearchText] = useState("");

  const [filteredData, setFilteredData] = useState([]);
  const [teamData, setTeamData] = useState([]);
  const teamref = useRef(null);
  // teamref.current.style.display="none"
  const noteamref = useRef();
  const [val, setval] = useState({});

  const handleFilter = (event) => {
    // teamref.current.style.display="none"
    if (event.target.value.length !== 0) {
      teamref.current.style.display = "none";
    }
    setSearchText(event.target.value);
    const searchWord = event.target.value;
    if (searchWord.length >= 2) {
      const newFilter = users.filter((value) => {
        return (
          value.attuid.toLowerCase().includes(searchWord.toLowerCase()) &&
          value.available &&
          !teamData.includes(value)
        );
      });
      setFilteredData(newFilter);
    } else {
      setFilteredData([]);
    }
  };
  // teamref.current.style.display="block"
  const handleteamref = ({ value }) => {
    // teamref.current.style.display = "block";
    teamref.current.style.display = "flex";
    noteamref.current.style.display = "none";
    setval(value);
    setSearchText("");
  };
  async function updateAvailable(id) {
    const response = await fetch(`http://localhost:3000/api/teams`, {
      method: "PATCH",
      body: JSON.stringify({ id }),
      headers: { "Content-Type": "application/json" },
    });
    let newData = users.map((user) => {
      if (user.id === id) {
        user.available = false;
      }
      return user;
    });
    setUsers(newData);
  }
  const addMember = (id, newmem) => {
    if (role.length != 0) {
      teamref.current.style.display = "none";
      if (newmem.role === "POC") {
        setTeamData((team) => {
          return [newmem, ...team];
        });
      } else {
        setTeamData((team) => {
          return [...team, newmem];
        });
      }
      setRole("");

      updateAvailable(id);
      setSearchText("");
      setFilteredData([]);
    } else {
      alert("select role");
    }

    // teamref.current.style.display="none"
  };
  // const DeleteMember = async (id) => {
  //   let list = teamData.filter((team) => {
  //     return team.id !== id;
  //   });
  //   setTeamData(list);
  //   dltMember(id);
  //   updateAvailable(id, true);
  // };

  return (
    <div className={Styles.AddSearch}>
      <div className={Styles.header1}>
        <h3>Add Team Member(s)</h3>
      </div>
      <div className={Styles.searchInput}>
        <input
          className={Styles.searchInputField}
          type="text"
          //   value={searchData}
          value={searchText}
          placeholder="&#128270; Search.."
          onChange={handleFilter}
        />
      </div>

      {filteredData.length != 0 && (
        <div ref={noteamref} className={Styles.dataResult}>
          {filteredData.map((value, index) => {
            return (
              <div className={Styles.outerUserDetail} key={value.attuid}>
                <div
                  className={Styles.userDetail}
                  onClick={() => handleteamref({ value })}
                >
                  <span>{value.attuid}</span>
                </div>
                {filteredData.length - 1 > index && <hr />}
              </div>
            );
          })}
        </div>
      )}
      <div ref={teamref} className={Styles.MemberRoleClass}>
        <div className={Styles.roleclass1}>{val.attuid}</div>
        <div className={Styles.roleclass2}>
          <select
            className={Styles.incHeight1}
            name="role"
            placeholder="Role"
            value={role}
            onChange={(e) => {
              setRole(e.target.value);
            }}
          >
            <option value="" disabled selected>
              Role..
            </option>
            <option value="POC">POC</option>
            <option value="Developer">Developer</option>
            <option value="QA">QA</option>
            <option value="UX">UX</option>
            <option value="Scrum Master">Scrum Master</option>
          </select>
        </div>
        <button
          className={Styles.addBtn}
          onClick={(e) => {
            let newmem = {
              // id: val.id,
              attuid: val.attuid,
              name: val.name,
              role: role,
            };
            handleMembers(newmem);
            addMember(val.id, newmem);
          }}
        >
          Add
        </button>
      </div>

      <div className={Styles.displayTeam}>
        {teamData.map((data, index) => {
          return (
            <div key={index}>
              <div className={Styles.teamMember1}>
                <div className={Styles.teamMemberIcon}>
                  <p>{data.name[0].toUpperCase()}</p>
                </div>
                <div className={Styles.teamMemberDetails}>
                  <span className={Styles.teamMemberName}>{data.name}</span>
                  <br />
                  <span className={Styles.teamMemberAttuid}>
                    <b>Attuid: &nbsp;</b>
                    {data.attuid}
                  </span>
                </div>

                <div className={Styles.teamMemberRole}>
                  {data.role === "POC" ? (
                    <div className={Styles.teamPOCRoleIcon}></div>
                  ) : (
                    <div className={Styles.teamMemberRoleIcon}></div>
                  )}
                  <div className={Styles.teamMemberRoleDetail}>
                    &nbsp;{data.role}
                  </div>
                </div>
                {/* <div className={Styles.addBtn} onClick={DeleteMember(data.id)}>
                  Remove
                </div> */}
              </div>
              <div className={Styles.horizontalLine}></div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

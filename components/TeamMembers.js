import React from "react";
import Styles from "../styles/TeamMembers.module.css";

export default function TeamMembers({ teamData }) {
  return (
    <div className={Styles.search}>
      <div className={Styles.header}>
        <h2>Team ({teamData.length})</h2>
      </div>

      {teamData.length !== 0 && (
        <div className={Styles.displayTeam}>
          {teamData.map((data, index) => {
            return (
              <React.Fragment key={data.attuid}>
                <div className={Styles.teamMember}>
                  <div className={Styles.teamMemberIcon1}>
                    <p>{data.name[0].toUpperCase()}</p>
                  </div>
                  <div className={Styles.teamMemberDetails1}>
                    <span className={Styles.teamMemberName}>{data.name}</span>
                    <br />
                    <span className={Styles.teamMemberAttuid}>
                      <span className={Styles.attuidText}>Attuid: &nbsp;</span>
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
                </div>
                {index < teamData.length - 1 && (
                  <div className={Styles.horizontalLine}></div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      )}
    </div>
  );
}

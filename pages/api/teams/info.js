export default async function handler(req, res) {
  if (req.method === "GET") {
    const response = await fetch("http://localhost:4000/team");
    const data = await response.json();
    res.status(200).json(data);
  } else if (req.method === "POST") {
    const { teamName, teamDept, teamOverview, members } = req.body;
    const user = {
      teamName: teamName,
      department: teamDept,
      overview: teamOverview,
      members: members,
      activities: [],
      ideas: [],
      issues: [],
      discussions: [],
    };
    const response = await fetch("http://localhost:4000/team", {
      method: "POST",
      body: JSON.stringify(user),
      headers: req.headers,
    });
    res.status(201).json(newComment);
  }
}

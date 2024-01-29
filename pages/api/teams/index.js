export default async function handler(req, res) {
  if (req.method === "GET") {
    const responseInfo = await fetch("http://localhost:4000/users");
    const dataInfo = await responseInfo.json();
    res.status(200).json(dataInfo);
  } else if (req.method === "POST") {
    const { user } = req.body;
    const response = await fetch("http://localhost:4000/users", {
      method: "POST",
      body: JSON.stringify(user),
      headers: req.headers,
    });
    res.status(201).json(response);
  } else if (req.method === "PATCH") {
    const { id } = req.body;
    const response = await fetch(`http://localhost:4000/users/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ available: false }),
      headers: req.headers,
    });
    res.status(201).json(response);
  }
}

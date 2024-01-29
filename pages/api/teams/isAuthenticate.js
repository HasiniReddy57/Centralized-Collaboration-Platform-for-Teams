import jwt from "jsonwebtoken";
import cookie from "cookie";

export default async function handler(req, res) {
  const { cookies } = req;
  const token = cookies.jwt;
  if (!token) {
    res.status(201).json({ isAuthenticate: false });
    return;
  }
  const { attuid } = jwt.decode(token);

  const response = await fetch(`http://localhost:4000/users?attuid=${attuid}`);

  const user = await response.json();
  if (user.length == 0) {
    res.status(201).json({ isAuthenticate: false });
  } else {
    res.status(200).json({ attuid: attuid, name: user[0].name });
  }
}

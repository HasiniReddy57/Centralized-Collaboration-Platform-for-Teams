import jwt from "jsonwebtoken";
import cookie from "cookie";
export default async function handler(req, res) {
  if (req.method === "POST") {
    const { attuid, password } = req.body;
    const response = await fetch(
      `http://localhost:4000/users?attuid=${attuid}`
    );

    const user = await response.json();
    if (user.length == 0) {
      res.status(201).json({ isValid: false });
    }
    const token = jwt.sign({ attuid: attuid }, "yashwanth", {
      expiresIn: 1 * 24 * 60 * 60,
    });
    const cook = cookie.serialize("jwt", token, {
      httpOnly: true,
      secure: "development",
      sameSite: "strict",
      maxAge: 1 * 24 * 60 * 60,
    });
    res.setHeader("Set-Cookie", cook);
    res.status(201).json({ isValid: user[0].password === password });
  }
}

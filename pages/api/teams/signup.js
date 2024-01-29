import jwt from "jsonwebtoken";
import cookie from "cookie";

const data = require("db.json");
const fs = require("fs");

const { users } = data;
export default async function handler(req, res) {
  if (req.method === "POST") {
    const { user } = req.body;
    const resp = await fetch(
      `http://localhost:4000/users?attuid=${user.attuid}`
    );

    const us = await resp.json();
    if (us.length == 0) {
      const response = await fetch("http://localhost:4000/users", {
        method: "POST",
        body: JSON.stringify(user),
        headers: { "Content-Type": "application/json" },
      });
      const token = jwt.sign({ attuid: user.attuid }, "yashwanth", {
        expiresIn: 1 * 24 * 60 * 60,
      });
      const cook = cookie.serialize("jwt", token, {
        httpOnly: true,
        secure: "development",
        sameSite: "strict",
        maxAge: 1 * 24 * 60 * 60,
      });
      res.setHeader("Set-Cookie", cook);
      res.status(201).json(response);
    } else {
      res.status(200).json({ message: "user exists" });
    }
  }
}

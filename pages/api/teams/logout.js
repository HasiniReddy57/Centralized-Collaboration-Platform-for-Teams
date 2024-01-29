import cookie from "cookie";
export default async function handler(req, res) {
  if (req.method === "GET") {
    const cook = cookie.serialize("jwt", "del", {
      httpOnly: true,
      secure: "development",
      sameSite: "strict",
      maxAge: -1,
    });
    res.setHeader("Set-Cookie", cook);
    res.status(201).json({ message: "logout" });
  }
}

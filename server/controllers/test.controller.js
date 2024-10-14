import jwt from "jsonwebtoken";

export const shouldBeLoggedIn = async (req, res) => {
  console.log(req.userId);
  res.status(200).json({ message: "You are Authenticated!!" });
};

export const shouldBeAdmin = async () => {
  const token = req.cookie.token;

  if (!token) return res.status(401).json({ message: "Not AUthenticated!" });

  jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, payload) => {
    if (err) return res.status(403).json({ message: "Not a valid token!" });

    if (!payload.isAdmin) {
      return res.status(403).json({ message: "Not Authorized!" });
    }
  });

  res.status(200).json({ message: "You are Authenticated!!" });
};

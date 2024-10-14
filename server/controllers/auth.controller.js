import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../lib/prisma.js";

const register = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // hashing password
    const hashedpassword = await bcrypt.hash(password, 10);

    // new user creation
    const newUser = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedpassword,
      },
    });

    // console.log(newUser);

    res.status(201).json({ message: "User created Successfully!!" });
  } catch (err) {
    res.status(500).json({ message: "Failed to create user!!" });
  }
};

const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    // check whether user exists or not
    const user = await prisma.user.findUnique({
      where: { username },
    });

    if (!user) return res.status(401).json({ message: "Invalid credentials!" });

    // verifying password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid)
      return res.status(401).json({ message: "Invalid credentials!" });

    // generating jwt cookie token
    const age = 1000 * 60 * 60 * 24 * 7; // 7 days

    const token = jwt.sign(
      {
        id: user.id,
        // isAdmin: false
      },
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: age,
      }
    );

    const { password: userPassword, ...userInfo } = user;

    res
      .cookie("token", token, {
        httpOnly: true,
        // secure: true,
        maxAge: age,
      })
      .status(200)
      .json(userInfo);
  } catch (err) {
    res.status(500).json({ message: "Failed to login!!" });
  }
};

const logout = (req, res) => {
  res.clearCookie("token").status(200).json({ message: "Logout Successful!!" });
};

export { register, login, logout };

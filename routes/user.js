const userRouter = require("express").Router();

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

require("dotenv").config();
const bcrypt = require("bcryptjs");
const jwt = require("../utils/jwt");

userRouter.post("/auth/register", async (req, res) => {
  const { email } = req.body;
  req.body.password = bcrypt.hashSync(req.body.password, 8);

  let user = prisma.user.create({
    data: { ...req.body },
  });
  req.body.accessToken = await jwt.signAccessToken(user);

  user.then(() => {
    res.send(req.body);
  });

  return req.body;
});

userRouter.post("/session", async (req, res) => {
  const { email, password } = req.body;
  const user = await prisma.user.findUnique({
    where: {
      email: email,
    },
  });
  if (!user) {
    res.json("User not registered");
  } else {
    const checkPassword = bcrypt.compareSync(password, user.password);

    if (!checkPassword) {
      console.log("Email address or password not valid");
    }
    const accessToken = await jwt.signAccessToken(user);
    res.json({ ...user, accessToken });
  }
});

userRouter.get("/session/user", async (req, res, next) => {
  console.log("eeehhhhhhhhhhhhhhhhhhhhhhhhh");
  if (!req.headers.authorization) {
    return next(console.log("Access token is required"));
  }
  const token = req.headers.authorization;
  if (!token) {
    return next(console.log("token unauthorized"));
  }
  await jwt
    .verifyAccessToken(token)
    .then((user) => {
      prisma.user.findMany();
      res.json(user);
      next();
    })
    .catch((e) => {
      next(console.log(e.message));
    });
});

module.exports = userRouter;
const projectsRouter = require("./project");
const technologiesRouter = require("./technology");
const userRouter = require("./user");

const setupRoutes = (app) => {
  app.use("/", projectsRouter);
  app.use("/", technologiesRouter);
  app.use("/", userRouter);
};

module.exports = {
  setupRoutes,
};

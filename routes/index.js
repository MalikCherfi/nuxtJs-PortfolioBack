const projectsRouter = require("./project");
const technologiesRouter = require("./technology");

const setupRoutes = (app) => {
  app.use("/", projectsRouter);
  app.use("/", technologiesRouter);
};

module.exports = {
  setupRoutes,
};

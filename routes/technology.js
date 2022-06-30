const technologiesRouter = require("express").Router();

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Create Technology
technologiesRouter.post("/technology", (req, res) => {
  const description = req.body;
  const { id, name } = description;
  if (typeof id == "number") {
    prisma.technology
      .create({
        data: {
          name: name,
          posts: {
            create: [
              {
                post: {
                  connect: {
                    id: id,
                  },
                },
              },
            ],
          },
        },
      })
      .then((createdTechnology) => {
        res.status(201).json(createdTechnology);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error saving technology");
      });
  } else {
    prisma.technology
      .create({
        data: {
          name: name,
        },
      })
      .then((createdTechnology) => {
        res.status(201).json(createdTechnology);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error saving technology");
      });
  }
});

//Get All technologies
technologiesRouter.get("/technology", (_, res) => {
  prisma.technology
    .findMany()
    .then((project) => {
      res.status(201).send(project);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error retrieving technology from database");
    });
});

// Delete One Technology
technologiesRouter.delete("/technology/:id", (req, res) => {
  const { id } = req.params;
  prisma.technology
    .delete({ where: { id: parseInt(id, 10) } })
    .then(() => {
      res.status(201).send("Technology deleted with success");
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send("Error deleting the technology");
    });
});

module.exports = technologiesRouter;

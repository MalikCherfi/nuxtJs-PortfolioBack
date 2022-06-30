const projectsRouter = require("express").Router();

const multer = require("multer");

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "../nuxtTestBack/public/images");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

// Post Project
const cpUpload = upload.fields([
  { name: "image.principal", maxCount: 1 },
  { name: "image.secondary", maxCount: 10 },
]);

projectsRouter.post("/upload", cpUpload, (req, res) => {
  res.send([
    { principal: req.files["image.principal"][0].filename },
    { secondary: req.files["image.secondary"].map((e) => e.filename) },
  ]);
});

projectsRouter.post("/post", (req, res) => {
  const description = req.body;
  prisma.post
    .create({
      data: {
        ...description,
      },
    })
    .then((createdProject) => {
      res.status(201).json(createdProject);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error saving project");
    });
});

// Get All Projects
projectsRouter.get("/post", (_, res) => {
  prisma.post
    .findMany()
    .then((project) => {
      res.status(201).send(project);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error retrieving project from database");
    });
});

// Get One Project
projectsRouter.get("/post/:id", (req, res) => {
  const { id } = req.params;
  prisma.post
    .findUnique({
      where: { id: parseInt(id, 10) },
      include: {
        technologies: {
          select: {
            technology: true,
          },
        },
      },
    })
    .then((project) => {
      res.status(200).send(project);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send("Error retrieving project from database");
    });
});

// Delete One Project
projectsRouter.delete("/post/:id", (req, res) => {
  const { id } = req.params;
  prisma.post
    .delete({ where: { id: parseInt(id, 10) } })
    .then(() => {
      res.status(201).send("Project deleted with success");
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send("Error deleting the project");
    });
});

// Update One Project
projectsRouter.put("/post/:id", async (req, res) => {
  const { id } = req.params;
  const newAttribute = req.body;

  prisma.post
    .findUnique({ where: { id: parseInt(id, 10) } })
    .then((project) => {
      if (project) {
        prisma.post
          .update({
            data: { ...newAttribute },
            where: { id: parseInt(id, 10) },
          })
          .then(() => {
            res.status(201).json({ ...newAttribute });
          })
          .catch((err) => {
            console.log(err);
            res.status(501).send("Error updating the project");
          });
      } else {
        res.status(404).send("Error retrieving project from database");
      }
    });
});

module.exports = projectsRouter;

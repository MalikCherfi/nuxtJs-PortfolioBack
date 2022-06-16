const express = require("express");
const app = express();

app.use(express.json({ limit: "25mb" }));
app.use(express.urlencoded({ extended: true, limit: "25mb" }));

const port = 8000;

const cors = require("cors");

app.use(express.static("public"));

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

const multer = require("multer");

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "../nuxtTestBack/public/images");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

app.get("/users", async (req, res) => {
  const users = await prisma.user.findMany();
  res.json(users);
});

const cpUpload = upload.fields([
  { name: "image.principal", maxCount: 1 },
  { name: "image.secondary", maxCount: 10 },
]);

app.post("/upload", cpUpload, (req, res) => {
  console.log(req.files);

  res.send([
    { principal: req.files["image.principal"][0].filename },
    { secondary: req.files["image.secondary"].map((e) => e.filename) },
  ]);
});

app.post("/post", (req, res) => {
  const description = req.body;
  console.log(description);
  prisma.post
    .create({ data: { ...description } })
    .then((createdProject) => {
      res.status(201).json(createdProject);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error saving project");
    });
});

app.get("/post", (req, res) => {
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

app.get("/post/:id", (req, res) => {
  const { id } = req.params;
  prisma.post
    .findUnique({ where: { id: parseInt(id, 10) } })
    .then((project) => {
      console.log(project);
      res.status(200).send(project);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send("Error retrieving project from database");
    });
});

app.delete("/post/:id", (req, res) => {
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

app.put("/post/:id", async (req, res) => {
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

app.listen(port, (err) => {
  if (err) {
    console.error("Something bad happened");
  } else {
    console.log(`Server is listening on ${port}`);
  }
});

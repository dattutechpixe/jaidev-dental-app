const express = require("express");
const app = express();

require("dotenv").config();
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const path = require("path");
const { dbConnnection } = require("./src/config/dbConnection");
const swaggerUI = require("swagger-ui-express");

const YAML = require("yamljs");
const UserDocument = YAML.load("./api.Yaml");
const AdminDocument = YAML.load("./admin.Yaml");
const adminRoutes = require("./src/routes/adminRoutes.js");
const userRoutes = require("./src/routes/userRoutes.js");


const equipmentsRoutes = require("./src/routes/equipmentRoutes.js")

const blogroutes = require("./src/routes/blogRoutes.js")

const bannerRoutes = require("./src/routes/bannerRoutes.js");


const sitename = process.env.SITE_NAME;



app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "Accept", "X-Requested-With"],
}));


app.use(bodyParser.json());
app.use(cookieParser());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/storage", express.static(path.join(__dirname, "storage")));




// Routes
app.use(`/${sitename}/admin`, adminRoutes);

app.use(`/${sitename}/users`, userRoutes);

app.use(`/${sitename}/blog`, blogroutes);


app.use(`/${sitename}/products`, equipmentsRoutes);

app.use(`/${sitename}/banners`, bannerRoutes);

app.get("/", (req, res) => {
  res.send("Server is running successfully 🚀");
});
app.use(
  "/user-docs",
  swaggerUI.serveFiles(UserDocument),
  swaggerUI.setup(UserDocument)
);
app.use(
  "/admin-docs",
  swaggerUI.serveFiles(AdminDocument),
  swaggerUI.setup(AdminDocument)
);


app.use((err, req, res, next) => {
  res.status(500).json({
    success: false,
    message: "Something went wrong",
    error: process.env.NODE_ENV === 'development' ? err.message : undefined, err
  });
});


app.use((req, res) => {
  res.status(404).send({
    status: 0,
    message: "Invalid link",
    link: req.url,
    method: req.method
  });
});

// Connect to MongoDB
dbConnnection();

const PORT = process.env.PORT || 5006;
app.listen(PORT, () => {
  console.log(`✅ Server started on port ${PORT}`);
  console.log(
    `Swagger - Docs are running on Local server: http://localhost:${PORT}/user-docs `
  );
  console.log(
    `Admin - Docs are running on Local server: http://localhost:${PORT}/admin-docs`
  );
});

const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const http = require("http");
const { Server } = require("socket.io");
const connectDB = require("./config/db");
const initSocketHandler = require("./socket/socketHandler");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");

dotenv.config();

connectDB();

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true
  }
});

initSocketHandler(io);
app.set("io", io);

app.use(cors({
  origin: "http://localhost:3000",
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  credentials: true
}));

app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "BloodLink Emergency Coordination API is running",
    version: "1.0.0",
    timestamp: new Date()
  });
});

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    status: "HEALTHY",
    uptime: process.uptime(),
    timestamp: new Date()
  });
});

const authRoutes = require("./routes/authRoutes");
const donorRoutes = require("./routes/donorRoutes");
const hospitalRoutes = require("./routes/hospitalRoutes");
const bloodBankRoutes = require("./routes/bloodBankRoutes");
const requestRoutes = require("./routes/requestRoutes");

app.use("/api/auth", authRoutes);
app.use("/api/donors", donorRoutes);
app.use("/api/hospitals", hospitalRoutes);
app.use("/api/blood-banks", bloodBankRoutes);
app.use("/api/requests", requestRoutes);

const inventoryRouter = express.Router();
const bloodBankController = require("./controllers/bloodBankController");

inventoryRouter.get("/", bloodBankController.getInventory);

inventoryRouter.get("/:id", (req, res, next) => {
  req.query.bloodBankId = req.params.id;
  return bloodBankController.getInventory(req, res, next);
});

inventoryRouter.put("/:id", bloodBankController.updateInventory);

app.use("/api/inventory", inventoryRouter);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

if (require.main === module) {
  server.listen(PORT, () => {
    console.log(`[BloodLink] Server running on port ${PORT}`);
  });
}

module.exports = { app, server };
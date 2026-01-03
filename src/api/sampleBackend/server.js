const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const examRoutes = require("./routes/examRoutes");
<<<<<<< HEAD
=======
const examController = require("./controllers/examController");
>>>>>>> 6522c29d8e296c7698ca89ccf29079ac3c4a38bf

const { authMiddleware } = require("./middleware/auth");

const app = express();

app.use(cors());
app.use(express.json());

<<<<<<< HEAD
mongoose
  .connect(process.env.MONGODB_URI, {
=======
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/exam-predictor";

mongoose
  .connect(MONGODB_URI, {
>>>>>>> 6522c29d8e296c7698ca89ccf29079ac3c4a38bf
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

app.use("/api/auth", authRoutes);
app.use("/api/user", authMiddleware, userRoutes);
<<<<<<< HEAD
=======

// Public test endpoint for AI question generation (no auth required)
app.post("/api/exam/test-ai", examController.testAIQuestions);

// Protected exam routes
>>>>>>> 6522c29d8e296c7698ca89ccf29079ac3c4a38bf
app.use("/api/exam", authMiddleware, examRoutes);

app.get("/", (req, res) => {
  res.send("Exam Prediction API is running");
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: "Server Error",
    error: process.env.NODE_ENV === "development" ? err.message : {},
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

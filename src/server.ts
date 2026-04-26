import express from "express";
import path from "path";
import dotenv from "dotenv";
import cors from "cors";
import addressRoutes from "./routes/address.routes";
import personalRoutes from "./routes/personal.routes";
import parentRoutes from "./routes/parent.routes";
import studentRoutes from "./routes/student.routes";
import academicRoutes from "./routes/academic.routes";
import authRoutes from "./routes/auth.routes";
import documentsRoutes from "./routes/documents.routes";
import branchRoutes from "./routes/branch.routes";
import adminRoutes from "./routes/admin.routes";
import applicationRoutes from "./routes/application.routes";


dotenv.config();

const app = express();

// Prevent caching for all API responses
app.use((req, res, next) => {
  res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0");
  res.setHeader("Surrogate-Control", "no-store");
  next();
});

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));
app.use("/api/auth", authRoutes);
app.use("/api/student", studentRoutes);
app.use("/api/personal", personalRoutes);
app.use("/api/parent", parentRoutes);
app.use("/api/address", addressRoutes);
app.use("/api/academic", academicRoutes);
app.use("/api/documents", documentsRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/application", applicationRoutes);





app.get("/", (req, res) => {
  res.send("ERP Backend Running 🚀");
});

app.use("/api/branches", branchRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
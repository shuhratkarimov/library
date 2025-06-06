const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const PORT = process.env.PORT || 5000;
const connectDB = require("./config/DB_config");
const express = require("express");
const booksRouter = require("./Router/books.routes");
const error_middleware = require("./Middlewares/error_middleware");
const authorsRouter = require("./Router/author.routes");
const AuthRouter = require("./Router/auth.routes");
const fileUploadRouter = require("./Router/file.upload.routes");
const path = require("path");
const cookie_parser = require("cookie-parser");
const CommentsRouter = require("./Router/comments.routes");
const membersRouter = require("./Router/members.routes");
const LogsRouter = require("./Router/logs.routes");
const ShelfRouter = require("./Router/shelf.routes")
const logger = require("./service/logger");
// const { stringify } = require("querystring");
const app = express();
connectDB();
// const helmet = require("helmet");
// const rateLimit = require("express-rate-limit");
// app.use((req, res, next) => {
//   const start = Date.now();
//   res.on("finish", () => {
//     try {
//       const duration = Date.now() - start;
//       const logData = {
//         method: req.method,
//         url: req.url,
//         status: res.statusCode,
//         duration: `${duration}ms`,
//         requestBody: req.body,
//         responseHeaders: res.getHeaders(),
//       };
//       // logger.info(JSON.stringify(logData, null, 4));
//     } catch (error) {
//       console.error("Log yozishda xatolik:", error);
//     }
//   });
//   next();
// });
// app.use(helmet());
// app.use(rateLimit({ windowMs: 10 * 1000, max: 4 }));
// const corsOptions = {
//   origin: [
//     `http://localhost:${PORT}`,
//     `http://172.30.64.1:${PORT}`,
//     `http://192.168.100.18:${PORT}`,
//     `http://51.159.225.188:${PORT}`,
//   ],
//   credentials: true,
// };
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(express.urlencoded({ extended: true }));
const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");

const swaggerDocument = YAML.load("./docs/swagger.yaml");
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.get("/", (req, res) => {
  res.send("Server ishlayapti!");
});
const serverUrl = "https://library-1dmu.onrender.com";
swaggerDocument.servers = [{ url: serverUrl, description: "Current Server" }];
app.use(cookie_parser());
app.use(booksRouter);
app.use(authorsRouter);
app.use(AuthRouter);
app.use(LogsRouter);
app.use(fileUploadRouter);
app.use(CommentsRouter);
app.use(membersRouter);
app.use(ShelfRouter)
app.use(error_middleware);
app.listen(PORT, () => {
  console.log("server is running on the port: " + PORT);
})
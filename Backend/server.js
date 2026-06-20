import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { initDb } from "./database/db.js";

// Routes imports
import productsRouter from "./routes/products.js";
import ordersRouter from "./routes/orders.js";
import couponsRouter from "./routes/coupons.js";
import dealersRouter from "./routes/dealers.js";
import settingsRouter from "./routes/settings.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const CORS_ORIGIN = process.env.CORS_ORIGIN || "http://localhost:3000";

// Configure cross origin headers
app.use(cors({
  origin: CORS_ORIGIN,
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

// Body parser
app.use(express.json());

// Main entry bootstrapping
async function bootstrap() {
  try {
    const db = await initDb();

    // Health check endpoint
    app.get("/api/health", (req, res) => {
      res.json({ status: "healthy", database: "connected", timestamp: new Date() });
    });

    // Mount API Routes
    app.use("/api/products", productsRouter(db));
    app.use("/api/orders", ordersRouter(db));
    app.use("/api/coupons", couponsRouter(db));
    app.use("/api/dealers", dealersRouter(db));
    app.use("/api/settings", settingsRouter(db));

    // Global error handler
    app.use((err, req, res, next) => {
      console.error("Unhandled Server Error:", err);
      res.status(500).json({ error: "Internal Server Error occurred" });
    });

    app.listen(PORT, () => {
      console.log(`=========================================`);
      console.log(`🔥 Vaka Crackers B2B API Server Live!`);
      console.log(`🔗 Listening at: http://localhost:${PORT}`);
      console.log(`=========================================`);
    });

  } catch (error) {
    console.error("Fatal: Failed to bootstrap Express B2B Server:", error);
    process.exit(1);
  }
}

bootstrap();

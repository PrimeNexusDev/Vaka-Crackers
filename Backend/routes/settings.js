import express from "express";

const router = express.Router();

export default function settingsRouter(db) {
  // GET: Retrieve setting by key
  router.get("/:key", async (req, res) => {
    try {
      const { key } = req.params;
      const setting = await db.get("SELECT value FROM settings WHERE key = ?", [key]);
      
      if (!setting) {
        return res.status(404).json({ error: `Setting ${key} not found` });
      }
      res.json({ key, value: setting.value });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to fetch setting configuration" });
    }
  });

  // POST: Update or create setting configuration
  router.post("/", async (req, res) => {
    try {
      const { key, value } = req.body;
      
      if (!key || value === undefined) {
        return res.status(400).json({ error: "Missing setting key or value parameters" });
      }

      await db.run(
        `INSERT INTO settings (key, value) VALUES (?, ?)
         ON CONFLICT(key) DO UPDATE SET value = excluded.value`,
        [key, String(value)]
      );

      res.json({ success: true, key, value });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to save configuration settings" });
    }
  });

  return router;
}

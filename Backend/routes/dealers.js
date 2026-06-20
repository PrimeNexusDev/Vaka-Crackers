import express from "express";

const router = express.Router();

export default function dealersRouter(db) {
  // GET: List all B2B requests (Admin)
  router.get("/", async (req, res) => {
    try {
      const dealers = await db.all("SELECT * FROM dealers ORDER BY id DESC");
      res.json(dealers);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to fetch B2B records" });
    }
  });

  // POST: B2B partnership registration request
  router.post("/register", async (req, res) => {
    try {
      const { businessName, gstin, ownerName, phone, address, expectedVolume } = req.body;

      if (!businessName || !gstin || !ownerName || !phone || !address || !expectedVolume) {
        return res.status(400).json({ error: "Missing required registration parameters" });
      }

      const result = await db.run(
        `INSERT INTO dealers (businessName, gstin, ownerName, phone, address, expectedVolume, status)
         VALUES (?, ?, ?, ?, ?, ?, 'pending')`,
        [businessName, gstin, ownerName, phone, address, expectedVolume]
      );

      const newDealer = await db.get("SELECT * FROM dealers WHERE id = ?", [result.lastID]);
      res.status(201).json(newDealer);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to submit B2B partnership request" });
    }
  });

  // PUT: Approve/Deny Dealer Partner request (Admin)
  router.put("/:id/approve", async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body; // 'approved' or 'pending'

      if (!status || (status !== "approved" && status !== "pending")) {
        return res.status(400).json({ error: "Invalid status value" });
      }

      const dealer = await db.get("SELECT id FROM dealers WHERE id = ?", [id]);
      if (!dealer) {
        return res.status(404).json({ error: "B2B partnership request not found" });
      }

      await db.run("UPDATE dealers SET status = ? WHERE id = ?", [status, id]);
      
      const updatedDealer = await db.get("SELECT * FROM dealers WHERE id = ?", [id]);
      res.json(updatedDealer);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to update B2B partnership status" });
    }
  });

  return router;
}

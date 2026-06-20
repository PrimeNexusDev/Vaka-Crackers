import express from "express";

const router = express.Router();

export default function couponsRouter(db) {
  // GET: List active coupons
  router.get("/", async (req, res) => {
    try {
      const coupons = await db.all("SELECT * FROM coupons");
      res.json(coupons);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to fetch coupon promotions" });
    }
  });

  // POST: Create coupon (Admin)
  router.post("/", async (req, res) => {
    try {
      const { code, discountPercent, description } = req.body;

      if (!code || discountPercent === undefined) {
        return res.status(400).json({ error: "Missing coupon parameters" });
      }

      const formattedCode = code.trim().toUpperCase();

      // Check if exists
      const existing = await db.get("SELECT code FROM coupons WHERE code = ?", [formattedCode]);
      if (existing) {
        return res.status(400).json({ error: "Coupon code already exists" });
      }

      await db.run(
        `INSERT INTO coupons (code, discountPercent, description)
         VALUES (?, ?, ?)`,
        [formattedCode, Number(discountPercent), description || ""]
      );

      const newCoupon = await db.get("SELECT * FROM coupons WHERE code = ?", [formattedCode]);
      res.status(201).json(newCoupon);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to create coupon code" });
    }
  });

  // DELETE: Delete coupon (Admin)
  router.delete("/:code", async (req, res) => {
    try {
      const { code } = req.params;
      const formattedCode = code.toUpperCase();

      const coupon = await db.get("SELECT code FROM coupons WHERE code = ?", [formattedCode]);
      if (!coupon) {
        return res.status(404).json({ error: "Coupon not found" });
      }

      await db.run("DELETE FROM coupons WHERE code = ?", [formattedCode]);
      res.json({ success: true, message: `Coupon ${formattedCode} deleted successfully` });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to delete coupon" });
    }
  });

  return router;
}

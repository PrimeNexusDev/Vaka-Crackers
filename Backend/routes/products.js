import express from "express";

const router = express.Router();

export default function productsRouter(db) {
  // GET: List all products (with optional database filters)
  router.get("/", async (req, res) => {
    try {
      const { category, search, soundLevel, ageGroup, maxPrice, onlyInStock } = req.query;
      
      let query = "SELECT * FROM products WHERE 1=1";
      const params = [];

      if (category && category !== "All") {
        query += " AND category = ?";
        params.push(category);
      }
      if (search) {
        query += " AND name LIKE ?";
        params.push(`%${search}%`);
      }
      if (soundLevel && soundLevel !== "All") {
        query += " AND soundLevel = ?";
        params.push(soundLevel);
      }
      if (ageGroup && ageGroup !== "All") {
        query += " AND ageGroup = ?";
        params.push(ageGroup);
      }
      if (maxPrice) {
        query += " AND price <= ?";
        params.push(Number(maxPrice));
      }
      if (onlyInStock === "true") {
        query += " AND stock > 0";
      }

      // Order by ID or name
      query += " ORDER BY isBestSeller DESC, id ASC";

      const rows = await db.all(query, params);
      
      // Convert SQLite 0/1 back to boolean for Frontend compatibility
      const products = rows.map(row => ({
        ...row,
        isBestSeller: !!row.isBestSeller,
        isTrending: !!row.isTrending,
        isFavorite: !!row.isFavorite
      }));

      res.json(products);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to fetch products" });
    }
  });

  // POST: Create product (Admin)
  router.post("/", async (req, res) => {
    try {
      const { id, name, category, price, mrp, image, stock, soundLevel, description, ageGroup } = req.body;
      
      if (!name || !category || price === undefined || mrp === undefined || stock === undefined || !soundLevel || !ageGroup) {
        return res.status(400).json({ error: "Missing required product fields" });
      }

      const generatedId = id || `p-${Math.floor(1000 + Math.random() * 9000)}`;

      await db.run(
        `INSERT INTO products (id, name, category, price, mrp, image, stock, soundLevel, description, ageGroup, isBestSeller, isTrending, isFavorite)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, 0, 0)`,
        [generatedId, name, category, Number(price), Number(mrp), image || "🎆", Number(stock), soundLevel, description || "", ageGroup]
      );

      const newProduct = await db.get("SELECT * FROM products WHERE id = ?", [generatedId]);
      res.status(201).json({
        ...newProduct,
        isBestSeller: !!newProduct.isBestSeller,
        isTrending: !!newProduct.isTrending,
        isFavorite: !!newProduct.isFavorite
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to create product" });
    }
  });

  // PUT: Update product details (Admin)
  router.put("/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const { name, category, price, mrp, image, stock, soundLevel, description, ageGroup } = req.body;

      const product = await db.get("SELECT id FROM products WHERE id = ?", [id]);
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }

      await db.run(
        `UPDATE products SET name = ?, category = ?, price = ?, mrp = ?, image = ?, stock = ?, soundLevel = ?, description = ?, ageGroup = ?
         WHERE id = ?`,
        [name, category, Number(price), Number(mrp), image, Number(stock), soundLevel, description, ageGroup, id]
      );

      const updatedProduct = await db.get("SELECT * FROM products WHERE id = ?", [id]);
      res.json({
        ...updatedProduct,
        isBestSeller: !!updatedProduct.isBestSeller,
        isTrending: !!updatedProduct.isTrending,
        isFavorite: !!updatedProduct.isFavorite
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to update product settings" });
    }
  });

  // DELETE: Delete product (Admin)
  router.delete("/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const product = await db.get("SELECT id FROM products WHERE id = ?", [id]);
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }

      await db.run("DELETE FROM products WHERE id = ?", [id]);
      res.json({ success: true, message: `Product ${id} deleted successfully` });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to delete product" });
    }
  });

  return router;
}

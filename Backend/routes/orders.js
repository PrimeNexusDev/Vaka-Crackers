import express from "express";

const router = express.Router();

export default function ordersRouter(db) {
  // GET: List all orders (Admin)
  router.get("/", async (req, res) => {
    try {
      const ordersRows = await db.all("SELECT * FROM orders ORDER BY createdAt DESC");
      
      const orders = [];
      for (const order of ordersRows) {
        // Fetch order items
        const items = await db.all(
          "SELECT productName, quantity, price FROM order_items WHERE orderId = ?",
          [order.id]
        );
        orders.push({
          ...order,
          items
        });
      }
      res.json(orders);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to fetch orders log" });
    }
  });

  // GET: Get specific order by ID (for visual tracking status)
  router.get("/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const order = await db.get("SELECT * FROM orders WHERE id = ?", [id.toUpperCase()]);
      
      if (!order) {
        return res.status(404).json({ error: "Order tracking ID not found" });
      }

      const items = await db.all(
        "SELECT productName, quantity, price FROM order_items WHERE orderId = ?",
        [order.id]
      );

      res.json({
        ...order,
        items
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to search tracking ID" });
    }
  });

  // POST: Create checkout order (transaction-safe)
  router.post("/", async (req, res) => {
    try {
      const { customerName, phone, address, items, total } = req.body;

      if (!customerName || !phone || !address || !items || !Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ error: "Missing checkout parameters" });
      }

      const orderId = `VC-${Math.floor(100000 + Math.random() * 900000)}`;
      const createdAt = new Date().toISOString();

      // Run as transaction
      await db.run("BEGIN TRANSACTION");
      try {
        await db.run(
          `INSERT INTO orders (id, customerName, phone, address, total, status, createdAt)
           VALUES (?, ?, ?, ?, ?, 'Placed', ?)`,
          [orderId, customerName, phone, address, Number(total), createdAt]
        );

        for (const item of items) {
          await db.run(
            `INSERT INTO order_items (orderId, productName, quantity, price)
             VALUES (?, ?, ?, ?)`,
            [orderId, item.productName, Number(item.quantity), Number(item.price)]
          );

          // Optionally reduce inventory stock (simulate real business logic!)
          await db.run(
            `UPDATE products SET stock = MAX(0, stock - ?) WHERE name = ?`,
            [Number(item.quantity), item.productName]
          );
        }

        await db.run("COMMIT");
      } catch (txnError) {
        await db.run("ROLLBACK");
        throw txnError;
      }

      const newOrder = await db.get("SELECT * FROM orders WHERE id = ?", [orderId]);
      const orderItems = await db.all(
        "SELECT productName, quantity, price FROM order_items WHERE orderId = ?",
        [orderId]
      );

      res.status(201).json({
        ...newOrder,
        items: orderItems
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to place checkout order" });
    }
  });

  // PUT: Update order status (Admin)
  router.put("/:id/status", async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;

      const validStatuses = ["Placed", "Confirmed", "Packed", "Shipped", "Delivered"];
      if (!status || !validStatuses.includes(status)) {
        return res.status(400).json({ error: "Invalid status value" });
      }

      const order = await db.get("SELECT id FROM orders WHERE id = ?", [id]);
      if (!order) {
        return res.status(404).json({ error: "Order not found" });
      }

      await db.run("UPDATE orders SET status = ? WHERE id = ?", [status, id]);
      
      const updatedOrder = await db.get("SELECT * FROM orders WHERE id = ?", [id]);
      res.json(updatedOrder);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to update order tracking status" });
    }
  });

  return router;
}

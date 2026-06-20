import sqlite3 from "sqlite3";
import { open } from "sqlite";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Resolve DB path
const dbPath = process.env.DATABASE_PATH 
  ? path.resolve(__dirname, "..", process.env.DATABASE_PATH)
  : path.resolve(__dirname, "..", "..", "Database", "vaka_crackers.db");

// Default seeding data
const defaultProducts = [
  { id: "p1", name: "100 Wala Classic Spark", category: "One Sound Crackers", price: 120, mrp: 600, image: "💣", stock: 75, rating: 4.6, soundLevel: "Loud", description: "Classic red cracker string of 100 crackers that burst continuously, lighting up your courtyard.", ageGroup: "Adults", isBestSeller: 1, isTrending: 0, isFavorite: 0 },
  { id: "p2", name: "1000 Wala Grand Celebration", category: "One Sound Crackers", price: 490, mrp: 2450, image: "💥", stock: 40, rating: 4.9, soundLevel: "Loud", description: "Gigantic string of 1000 premium red crackers. Brings a spectacular rhythmic audio show directly from Sivakasi factory.", ageGroup: "Adults", isBestSeller: 0, isTrending: 1, isFavorite: 0 },
  { id: "p3", name: "15cm Crackling Sparklers", category: "Sparklers", price: 45, mrp: 225, image: "✨", stock: 120, rating: 4.8, soundLevel: "Eco-Friendly", description: "Sparkling silver sparkles with crackling sound effect. High performance, low smoke.", ageGroup: "Kids", isBestSeller: 0, isTrending: 0, isFavorite: 1 },
  { id: "p4", name: "30cm Golden Ray Sparklers", category: "Sparklers", price: 85, mrp: 425, image: "🌟", stock: 90, rating: 4.7, soundLevel: "Eco-Friendly", description: "Long-lasting premium golden sparklers. Ideal for children to hold safely and capture beautiful photos.", ageGroup: "Kids", isBestSeller: 1, isTrending: 0, isFavorite: 0 },
  { id: "p5", name: "Golden Willow Fountain", category: "Fancy Crackers", price: 190, mrp: 950, image: "🌈", stock: 50, rating: 4.9, soundLevel: "Musical", description: "Shoots an extremely high fountain of golden sparks that cascade down like a weeping willow tree.", ageGroup: "Family", isBestSeller: 0, isTrending: 1, isFavorite: 0 },
  { id: "p6", name: "Tri-Color Star Rain", category: "Fancy Crackers", price: 240, mrp: 1200, image: "🎨", stock: 35, rating: 4.5, soundLevel: "Silent", description: "Silent aerial fancy fireworks emitting beautiful red, green, and gold sparks that light up the night sky.", ageGroup: "Family", isBestSeller: 0, isTrending: 0, isFavorite: 0 },
  { id: "p7", name: "Lunik Whistling Rocket", category: "Rockets", price: 150, mrp: 750, image: "🚀", stock: 65, rating: 4.6, soundLevel: "Musical", description: "Zoom upward into the sky with a sharp whistling sound before bursting into beautiful gold sparks.", ageGroup: "Adults", isBestSeller: 1, isTrending: 0, isFavorite: 0 },
  { id: "p8", name: "Parachute Flares Rocket", category: "Rockets", price: 280, mrp: 1400, image: "🪂", stock: 30, rating: 4.8, soundLevel: "Silent", description: "Ascends extremely high and deploys a parachute with a bright red burning flare that floats down slowly.", ageGroup: "Family", isBestSeller: 0, isTrending: 0, isFavorite: 0 },
  { id: "p9", name: "Flower Pot Giant Gold", category: "Flower Pots", price: 90, mrp: 450, image: "🎇", stock: 150, rating: 4.8, soundLevel: "Eco-Friendly", description: "Large traditional earthen style flower pot emitting giant showers of golden sparks up to 8 feet high.", ageGroup: "Kids", isBestSeller: 1, isTrending: 0, isFavorite: 0 },
  { id: "p10", name: "Multi-Color Magic Pots", category: "Flower Pots", price: 130, mrp: 650, image: "🏺", stock: 80, rating: 4.7, soundLevel: "Eco-Friendly", description: "Dazzling flower pots that transition colors from sparkling red to emerald green and then silver crackles.", ageGroup: "Kids", isBestSeller: 0, isTrending: 1, isFavorite: 0 },
  { id: "p11", name: "Hydro Bomb (Heavy Blast)", category: "Atom Bombs", price: 80, mrp: 400, image: "⚡", stock: 110, rating: 4.4, soundLevel: "Loud", description: "High decibel traditional green bomb with maximum sound intensity. Strictly for open outdoor areas.", ageGroup: "Adults", isBestSeller: 0, isTrending: 0, isFavorite: 0 },
  { id: "p12", name: "Bullet Bomb Gold", category: "Atom Bombs", price: 60, mrp: 300, image: "🔥", stock: 140, rating: 4.5, soundLevel: "Loud", description: "Compact bullet shape, intense instantaneous explosion with minimal smoke. Best value pack of 10.", ageGroup: "Adults", isBestSeller: 0, isTrending: 0, isFavorite: 1 },
  { id: "p13", name: "Royal Diwali Treasure Box", category: "Gift Boxes", price: 1200, mrp: 6000, image: "🎁", stock: 25, rating: 4.9, soundLevel: "Eco-Friendly", description: "Premium assortment of 35 diverse items including sparklers, chakkars, pots, rockets, and fancy novelties.", ageGroup: "Family", isBestSeller: 1, isTrending: 0, isFavorite: 0 },
  { id: "p14", name: "Kids Joy Package (Eco)", category: "Gift Boxes", price: 650, mrp: 3250, image: "🧸", stock: 45, rating: 4.8, soundLevel: "Silent", description: "Safe, low-noise selection of sparklers, magic pops, spinners, and snake eggs perfect for young children.", ageGroup: "Kids", isBestSeller: 0, isTrending: 1, isFavorite: 0 },
  { id: "p15", name: "Premium Ground Chakkars (Spinners)", category: "Kids Special", price: 90, mrp: 450, image: "🌀", stock: 130, rating: 4.7, soundLevel: "Eco-Friendly", description: "Spins rapidly on the ground producing a glowing ring of red, green, and golden fire. Pack of 10.", ageGroup: "Kids", isBestSeller: 1, isTrending: 0, isFavorite: 0 },
  { id: "p16", name: "Magic Pop Snap Crackers", category: "Kids Special", price: 25, mrp: 125, image: "🍿", stock: 200, rating: 4.6, soundLevel: "Silent", description: "Safe throwing pops that crackle when they hit the floor. No fire required, entirely chemical-safe fun.", ageGroup: "Kids", isBestSeller: 0, isTrending: 0, isFavorite: 0 },
  { id: "p17", name: "30 Shots Multi Color Aerial", category: "Multi Shots", price: 750, mrp: 3750, image: "🎊", stock: 20, rating: 4.9, soundLevel: "Loud", description: "Shoots 30 individual shells rapidly into the air, bursting into magnificent chrysanthemums of light and sound.", ageGroup: "Family", isBestSeller: 0, isTrending: 1, isFavorite: 0 },
  { id: "p18", name: "120 Shots Grand Celebration", category: "Multi Shots", price: 2200, mrp: 11000, image: "🏰", stock: 10, rating: 5.0, soundLevel: "Loud", description: "Ultimate showstopper: 120 consecutive shell blasts creating a sky-filling finale of colors, crackles, and whistling tails.", ageGroup: "Family", isBestSeller: 1, isTrending: 0, isFavorite: 0 },
  { id: "p19", name: "Peacock Dance Deluxe Fountain", category: "Premium Collection", price: 350, mrp: 1750, image: "🦚", stock: 15, rating: 4.9, soundLevel: "Musical", description: "Luxury fountain that shoots sparkles spreading out in the shape of a peacock tail, shifting through 5 distinct colors.", ageGroup: "Family", isBestSeller: 0, isTrending: 1, isFavorite: 0 },
  { id: "p20", name: "VIP Golden Rain Box", category: "Premium Collection", price: 1500, mrp: 7500, image: "👑", stock: 8, rating: 5.0, soundLevel: "Eco-Friendly", description: "Exclusive collector box containing large-bore fireworks that shower gold leaves and crackling palms over a wide area.", ageGroup: "Family", isBestSeller: 0, isTrending: 0, isFavorite: 1 }
];

const defaultCoupons = [
  { code: "DIWALI90", discountPercent: 90, description: "Mega Diwali Festival Special discount of 90%!" },
  { code: "WELCOME10", discountPercent: 10, description: "Additional 10% discount on your first order." },
  { code: "FACTORYDIRECT", discountPercent: 15, description: "15% off for direct bulk orders from Sivakasi." }
];

export async function initDb() {
  const db = await open({
    filename: dbPath,
    driver: sqlite3.Database
  });

  // Create products table
  await db.exec(`
    CREATE TABLE IF NOT EXISTS products (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      category TEXT NOT NULL,
      price REAL NOT NULL,
      mrp REAL NOT NULL,
      image TEXT NOT NULL,
      stock INTEGER NOT NULL,
      rating REAL DEFAULT 4.5,
      soundLevel TEXT NOT NULL,
      description TEXT,
      ageGroup TEXT NOT NULL,
      isBestSeller INTEGER DEFAULT 0,
      isTrending INTEGER DEFAULT 0,
      isFavorite INTEGER DEFAULT 0
    )
  `);

  // Create orders table
  await db.exec(`
    CREATE TABLE IF NOT EXISTS orders (
      id TEXT PRIMARY KEY,
      customerName TEXT NOT NULL,
      phone TEXT NOT NULL,
      address TEXT NOT NULL,
      total REAL NOT NULL,
      status TEXT DEFAULT 'Placed',
      createdAt TEXT NOT NULL
    )
  `);

  // Create order items table
  await db.exec(`
    CREATE TABLE IF NOT EXISTS order_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      orderId TEXT NOT NULL,
      productName TEXT NOT NULL,
      quantity INTEGER NOT NULL,
      price REAL NOT NULL,
      FOREIGN KEY (orderId) REFERENCES orders(id) ON DELETE CASCADE
    )
  `);

  // Create coupons table
  await db.exec(`
    CREATE TABLE IF NOT EXISTS coupons (
      code TEXT PRIMARY KEY,
      discountPercent INTEGER NOT NULL,
      description TEXT
    )
  `);

  // Create dealers table
  await db.exec(`
    CREATE TABLE IF NOT EXISTS dealers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      businessName TEXT NOT NULL,
      gstin TEXT NOT NULL,
      ownerName TEXT NOT NULL,
      phone TEXT NOT NULL,
      address TEXT NOT NULL,
      expectedVolume TEXT NOT NULL,
      status TEXT DEFAULT 'pending'
    )
  `);

  // Create settings table
  await db.exec(`
    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    )
  `);

  // Seed default products if empty
  const productsCount = await db.get("SELECT COUNT(*) as count FROM products");
  if (productsCount.count === 0) {
    console.log("Seeding default products catalog...");
    for (const prod of defaultProducts) {
      await db.run(
        `INSERT INTO products (id, name, category, price, mrp, image, stock, rating, soundLevel, description, ageGroup, isBestSeller, isTrending, isFavorite)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [prod.id, prod.name, prod.category, prod.price, prod.mrp, prod.image, prod.stock, prod.rating, prod.soundLevel, prod.description, prod.ageGroup, prod.isBestSeller, prod.isTrending, prod.isFavorite]
      );
    }
  }

  // Seed default coupons if empty
  const couponsCount = await db.get("SELECT COUNT(*) as count FROM coupons");
  if (couponsCount.count === 0) {
    console.log("Seeding default coupon promotions...");
    for (const coupon of defaultCoupons) {
      await db.run(
        `INSERT INTO coupons (code, discountPercent, description) VALUES (?, ?, ?)`,
        [coupon.code, coupon.discountPercent, coupon.description]
      );
    }
  }

  // Seed default timer configuration settings if empty
  const timerCheck = await db.get("SELECT COUNT(*) as count FROM settings WHERE key = 'timer_enabled'");
  if (timerCheck.count === 0) {
    await db.run("INSERT INTO settings (key, value) VALUES ('timer_enabled', 'true')");
    const d = new Date();
    d.setDate(d.getDate() + 10);
    const defaultTimerDate = d.toISOString().split("T")[0] + "T00:00:00";
    await db.run("INSERT INTO settings (key, value) VALUES ('timer_target_date', ?)", [defaultTimerDate]);
  }

  console.log(`Database connected & initialized at: ${dbPath}`);
  return db;
}

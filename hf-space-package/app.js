process.env.NODE_ENV = process.env.NODE_ENV || "production";
import("./server.mjs").catch((error) => {
  console.error("Failed to start VinzaTools:", error);
  process.exit(1);
});

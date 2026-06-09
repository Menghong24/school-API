const { Router } = require("express");
const { 
  saveScore, 
  getScoresByClass, 
  deleteScore 
} = require("./scores.controller"); // Adjusted path to standard structure

const router = Router();

// --- Read ---
// GET /api/scores?classId=...&month=...&academicYear=...
router.get("/scores", getScoresByClass); 

// --- Create & Update (Upsert) ---
// POST /api/scores
// The controller checks if the score exists (by student+subject+date).
// If it exists, it updates. If not, it creates.
router.post("/scores", saveScore); 
router.put("/scores", saveScore); // Alias for flexibility

// --- Delete ---
// DELETE /api/scores/:id
// Requires the actual Score ID (the Mongo _id)
router.delete("/scores/:id", deleteScore);

module.exports = router;
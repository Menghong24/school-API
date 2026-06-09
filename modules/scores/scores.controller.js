const ScoresModel = require("./scores.model");

// Create or Update a Single Subject Score
exports.saveScore = async (req, res) => {
  try {
    // 1. Extract fields matching the new Schema
    // Note: Ensure your frontend sends 'studentId', 'subjectId', etc.
    const { 
      studentId, 
      subjectId, 
      classId, 
      score, 
      month, 
      semester, 
      academicYear, 
      type,        // e.g. 'monthly' or 'midterm'
      gradedBy,    // The teacher's ID
      remark 
    } = req.body;

    // 2. Validation
    if (!studentId || !subjectId || !classId || !academicYear || score === undefined) {
      return res.status(400).send({ 
        error: "Student, Subject, Class, Academic Year, and Score are required." 
      });
    }

    // 3. Define the filter to find an existing score
    // We look for a score matching the Student + Subject + Time Period
    const filter = { 
      studentId, 
      subjectId, 
      month, 
      semester,
      academicYear,
      type: type || 'monthly' // Default to monthly if not specified
    };

    // 4. Check if exists
    let existingScore = await ScoresModel.findOne(filter);

    if (existingScore) {
      // --- UPDATE EXISTING ---
      existingScore.score = score;
      existingScore.gradedBy = gradedBy;
      existingScore.remark = remark;
      
      // Save changes
      await existingScore.save();
      return res.send(existingScore);

    } else {
      // --- CREATE NEW ---
      const newScore = await ScoresModel.create({
        studentId,
        classId,
        subjectId,
        score,
        month,
        semester,
        academicYear,
        type: type || 'monthly',
        gradedBy,
        remark
      });
      return res.status(201).send(newScore);
    }

  } catch (err) {
    // Handle Duplicate Key Error (Unique Compound Index)
    if (err.code === 11000) {
      return res.status(400).send({ error: "Score already exists for this subject and time period." });
    }
    console.error("Save Score Error:", err);
    res.status(500).send({ error: err.message });
  }
};

// Get Scores based on filters
exports.getScoresByClass = async (req, res) => {
  try {
    // Frontend should send: /scores?classId=...&month=...&academicYear=...
    const { classId, month, semester, academicYear, subjectId } = req.query;

    if (!classId) {
      return res.status(400).send({ error: "Class ID is required" });
    }

    // Build the query object dynamically
    let query = { classId };

    if (month) query.month = month;
    if (semester) query.semester = semester;
    if (academicYear) query.academicYear = academicYear;
    if (subjectId) query.subjectId = subjectId;

    // 1. Find scores
    const scores = await ScoresModel.find(query)
      // 2. Populate Data
      // Note: 'englishName' and 'khmerName' must exist in your Student/Teacher models
      .populate("studentId", "englishName khmerName gender idCode") 
      .populate("subjectId", "subjectName type") // Fetch subjectName from Subject Model
      .populate("gradedBy", "englishName"); 

    res.send(scores);

  } catch (err) {
    res.status(500).send({ error: err.message });
  }
};

exports.deleteScore = async (req, res) => {
  try {
    await ScoresModel.findByIdAndDelete(req.params.id);
    res.send({ message: "Score deleted" });
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
};
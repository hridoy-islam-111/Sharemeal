const express = require("express");
const cors = require("cors");
const path = require("path");
const db = require("./config/db");
const foodPostRoutes = require("./routes/foodPostRoutes");
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static("public"));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
// Food Post routes
app.use("/api/food-posts", foodPostRoutes);

app.use((error, req, res, next) => {
    if (error) {
        return res.status(400).json({ message: error.message || "Image upload failed" });
    }
    next();
});

// Home route
app.get("/", (req, res) => {
    res.send("ShareMeal Backend is running!");
});

app.get("/test-db", async (req,res) => {
    try {
        const result = await db.query("SELECT NOW()");
        res.json({
            message: "Database is connected!",
            time: result.rows[0]
        });
    }
    catch (error){
        console.error(error);
        res.status(500).json({
            message: "Database connection failed"
        });
    }
});

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
})

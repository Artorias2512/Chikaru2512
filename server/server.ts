import express from "express";
import cors from "cors";

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

let currentStatus = {
    app: "Waiting...",
    title: "No active application"
};

app.get("/api/status", (_req, res) => {
    res.json(currentStatus);
});

app.post("/api/status", (req, res) => {
    const { app: appName, title } = req.body;

    if (!appName) {
        return res.status(400).json({
            error: "Application name is required."
        });
    }

    currentStatus = {
        app: appName,
        title: title || ""
    };

    res.json(currentStatus);
});

app.listen(PORT, () => {
    console.log(`Status API running at http://localhost:${PORT}`);
});
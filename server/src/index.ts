import express from "express";
import cors from "cors";
import { timeStamp } from "console";

const app = express();
const PORT = process.env.PORT || 9000;

// Middleware
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
}));
app.use(express.json());

app.get("/api/test", (req, res) => {
    res.json({ message: "Backend connected successfully!", timestamp: new Date() });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is listening on PORT ${PORT}...`);
});
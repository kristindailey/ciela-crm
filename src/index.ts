import express from "express";

const app = express();

app.listen(process.env.PORT, () => {
    console.log("Server is listening on PORT 8000...");
});
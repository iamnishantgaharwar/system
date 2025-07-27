import express from "express";
import authRoute from "./routes/authRoute";
import { config } from "dotenv";

config();


const app = express();


// Middleware
app.use(express.json());

// Routes
app.use("/api/auth", authRoute);


app.listen(3000, () => {
    console.log("Server is running on port 3000");
});

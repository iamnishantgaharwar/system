import express from "express";
import authRoute from "./routes/authRoute";
import helloRoute from "./routes/helloRoute";
import { config } from "dotenv";
import cors from "cors";
import cookieParser  from 'cookie-parser'
config();


const app = express();

app.use(cookieParser());
// cors
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));


// Middleware
app.use(express.json());

// Routes
app.use("/api/auth", authRoute);
app.use("/api", helloRoute);


app.listen(3000, () => {
    console.log("Server is running on port 3000");
});

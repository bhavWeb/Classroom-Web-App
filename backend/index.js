import express from "express"
import authRoute from './routes/auth.route.js'
import userRoute from './routes/user.route.js'
import { SeedPrincipal } from "./middlewares/seedPrincipal.js";
import cors from "cors";

const app = express();


const corsOrigin = process.env.VITE_FRONTEND_API_URL;
app.use(cors({
    origin: corsOrigin || "http://localhost:5173",
    methods: ['GET', 'POST' , 'PUT' ,'DELETE'],
    allowedHeaders: ['Authorization', 'Content-Type'],
    credentials : true,
  }))
app.use(express.json())

const PORT = process.env.PORT;

app.use('/api/auth',authRoute)
app.use('/api/classroom',userRoute)

SeedPrincipal();

app.listen(PORT , ()=>{
    console.log(`Server Running on Port ${PORT}`);
})


import express from "express"
import cookieParser from "cookie-parser"
import dotenv from "dotenv"
dotenv.config()
import cors from "cors"
import UserRoute from "./routes/user.route.js"
import ProductRoute from "./routes/product.route.js"
import CartRoute from "./routes/cart.route.js"
import OrderRoute from "./routes/order.route.js"

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(cors(
    {
        origin:"http://localhost:3000",
        credentials:true,
    }
))

app.get("/", (req, res) => {
    res.send("Backend started working!!!")
})



app.use("/users", UserRoute)
app.use("/products",ProductRoute)
app.use("/cart", CartRoute)
app.use("/orders", OrderRoute)

export default app;
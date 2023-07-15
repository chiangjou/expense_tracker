const express = require("express")
const mongoose = require("mongoose")
const exphbs = require("express-handlebars")

// 僅在非正式環境時, 使用 dotenv
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config()
}

const app = express()
const PORT = process.env.PORT

mongoose.connect(process.env.MONGODB_URI, { 
  useNewUrlParser: true, 
  useUnifiedTopology: true })

// 取得資料庫連線狀態
const db = mongoose.connection
db.on("error", () => {
  console.log("mongodb error!")
})
db.once("open", () => {
  console.log("mongodb connected!")
})

app.engine("hbs", exphbs({ defaultLayout: "main", extname: ".hbs" }))
app.set("view engine", "hbs")

app.get("/", (req,res) => {
  res.render("index")
})

app.listen(PORT, () => {
  console.log(`Express is listening on http://localhost:${PORT}`)
})

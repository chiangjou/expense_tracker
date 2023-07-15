const express = require("express")
const mongoose = require("mongoose")
const exphbs = require("express-handlebars")
const bodyParser = require("body-parser")

const Record = require("./models/record")

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

app.use(bodyParser.urlencoded({ extended: true }))

// Home
app.get("/", (req,res) => {
  Record.find()
    .lean()
    .then(records => res.render("index", { records }))
    .catch(error => console.error(error))
})

// Create
app.get("/records/new", (req, res) => {
  return res.render("new")
})

app.post("/records", (req, res) => {
  const name = req.body.name
  return Record.create({ name })
    .then(() => res.redirect("/"))
    .catch(error => console.log(error))
})

app.listen(PORT, () => {
  console.log(`Express is listening on http://localhost:${PORT}`)
})

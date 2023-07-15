const express = require("express")
const mongoose = require("mongoose")
const exphbs = require("express-handlebars")
const bodyParser = require("body-parser")

const Record = require("./models/record")
const record = require("./models/record")

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
    .sort({ _id: "asc" })   // 根據 _id 升冪排序
    .then(records => res.render("index", { records }))
    .catch(error => console.error(error))
})

// Create
app.post("/records", (req, res) => {
  const name = req.body.name
  return Record.create({ name })
    .then(() => res.redirect("/"))
    .catch(error => console.log(error))
})

// Read
app.get("/records/:id", (req, res) => {
  const id = req.params.id
  return Record.findById(id)
    .lean()
    .then((record) => res.render("detail", { record }))
    .catch(error => console.log(error))
})

// Update
app.get("/records/:id/edit", (req, res) => {
  const id = req.params.id
  return Record.findById(id)
    .lean()
    .then((record) => res.render("edit", { record }))
    .catch(error => console.log(error))
})

app.post("/records/:id/edit", (req, res) => {
  const id = req.params.id
  const name = req.body.name
  return Record.findById(id)
    .then(record => {
      record.name = name
      return record.save()
    })
    .then(() => res.redirect(`/records/${id}`))
    .catch(error => console.log(error))
})

// Delete
app.post("/records/:id/delete", (req, res) => {
  const id = req.params.id
  return Record.findById(id)
    .then(record => record.remove())
    .then(() => res.redirect("/"))
    .catch(error => console.log(error))
})

app.listen(PORT, () => {
  console.log(`Express is listening on http://localhost:${PORT}`)
})

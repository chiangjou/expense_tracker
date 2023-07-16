const express = require("express")
const exphbs = require("express-handlebars")
const bodyParser = require("body-parser")
const methodOverride = require("method-override") 
const session = require("express-session")
const flash = require("connect-flash")
const bcrypt = require("bcryptjs") 

// 僅在非正式環境時, 使用 dotenv
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config()
}

// 引用routes
const routes = require("./routes")
// 連線 Mongoose 
require("./config/mongoose")
// Passport: Authentication Middleware
const usePassport = require("./config/passport")

const app = express()
const PORT = process.env.PORT

// Express-Handlebars
app.engine("hbs", exphbs({ defaultLayout: "main", extname: ".hbs" }))
app.set("view engine", "hbs")
// app.use(express.static("public"))

// Body-Parser: 取得 POST 的資料(req.body)
app.use(bodyParser.urlencoded({ extended: true }))

// Method-Override: RESTful API
app.use(methodOverride("_method"))

// Express-Session: 產生 Session
app.use(session({
  secret: "ThisIsMySecret",
  resave: false,
  saveUninitialized: true
}))

// 呼叫 usePassport
usePassport(app)

// Connect-Flash: 產生 Flash message
app.use(flash())
app.use((req, res, next) => {
  res.locals.isAuthenticated = req.isAuthenticated()
  res.locals.user = req.user
  res.locals.success_msg = req.flash("success_msg")
  res.locals.warning_msg = req.flash("warning_msg")
  next()
})

// 使用 routes
app.use(routes)

app.listen(PORT, () => {
  console.log(`Express is listening on http://localhost:${PORT}`)
})

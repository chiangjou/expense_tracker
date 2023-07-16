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

// 引用路由器
const routes = require("./routes")

const usePassport = require("./config/passport")

// 連線 mongoose 
require("./config/mongoose")
const app = express()
const PORT = process.env.PORT

// express-handlebars
app.engine("hbs", exphbs({ defaultLayout: "main", extname: ".hbs" }))
app.set("view engine", "hbs")

// express-session
app.use(session({
  secret: "ThisIsMySecret",
  resave: false,
  saveUninitialized: true
}))

// body-parser
app.use(bodyParser.urlencoded({ extended: true }))

app.use(express.static("public"))
app.use(methodOverride("_method"))

usePassport(app)

app.use(flash())
app.use((req, res, next) => {
  res.locals.isAuthenticated = req.isAuthenticated()
  res.locals.user = req.user
  res.locals.success_msg = req.flash("success_msg")
  res.locals.warning_msg = req.flash("warning_msg")
  next()
})

app.use(routes)

app.listen(PORT, () => {
  console.log(`Express is listening on http://localhost:${PORT}`)
})

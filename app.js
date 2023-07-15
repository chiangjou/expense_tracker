const express = require("express")
const app = express()

app.get("/", (req,res) => {
  res.send('hi')
})

app.listen(3000, () => {
  console.log("Express is listening on http://localhost:3000")
})

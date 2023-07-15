const express = require("express")
const router = express.Router()
const Record = require("../../models/record")

// Create
router.get("/new", (req, res) => {
  return res.render("new")
})

router.post("/", (req, res) => {
  const name = req.body.name
  return Record.create({ name })
    .then(() => res.redirect("/"))
    .catch(error => console.log(error))
})

// Read
router.get("/:id", (req, res) => {
  const id = req.params.id
  return Record.findById(id)
    .lean()
    .then((record) => res.render("detail", { record }))
    .catch(error => console.log(error))
})

// Update
router.get("/:id/edit", (req, res) => {
  const id = req.params.id
  return Record.findById(id)
    .lean()
    .then((record) => res.render("edit", { record }))
    .catch(error => console.log(error))
})

router.put("/:id", (req, res) => {
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
router.delete("/:id", (req, res) => {
  const id = req.params.id
  return Record.findById(id)
    .then(record => record.remove())
    .then(() => res.redirect("/"))
    .catch(error => console.log(error))
})

module.exports = router
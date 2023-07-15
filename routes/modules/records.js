const express = require("express")
const router = express.Router()
const Record = require("../../models/record")

// Create
router.get("/new", (req, res) => {
  return res.render("new")
})

router.post("/", (req, res) => {
  const userId = req.user._id
  const name = req.body.name

  return Record.create({ name, userId })
    .then(() => res.redirect("/"))
    .catch(error => console.log(error))
})

// Read
router.get("/:id", (req, res) => {
  const userId = req.user._id
  const _id = req.params.id

  return Record.findOne({ _id, userId })
    .lean()
    .then((record) => res.render("detail", { record }))
    .catch(error => console.log(error))
})

// Update
router.get("/:id/edit", (req, res) => {
  const userId = req.user._id
  const _id = req.params.id

  return Record.findOne({ _id, userId })
    .lean()
    .then((record) => res.render("edit", { record }))
    .catch(error => console.log(error))
})

router.put("/:id", (req, res) => {
  const userId = req.user._id
  const _id = req.params.id

  return Record.findByIdAndUpdate({ _id, userId }, req.body)
    .then(() => res.redirect(`/records/${_id}`))
    .catch(error => console.log(error))
})

// Delete
router.delete("/:id", (req, res) => {
  const userId = req.user._id
  const _id = req.params.id

  return Record.findByIdAndDelete({ _id, userId })
    .then(() => res.redirect("/"))
    .catch(error => console.log(error))
})

module.exports = router
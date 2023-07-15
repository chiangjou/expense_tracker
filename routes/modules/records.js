const express = require("express")
const router = express.Router()
const Record = require("../../models/record")
const Category = require("../../models/category")
const moment = require("moment")
const { SEED_CATEGORY } = require("../../models/seedsData")

// Sort
router.get("/sort", async (req, res) => {
  const userId = req.user._id
  try {
    const sort = req.query.sort

    const categoryDate = await Category.findOne({ name: sort }).lean()
    const records = await Record.find({ userId, categoryId: categoryDate._id }).populate("categoryId").lean()
    const data = records.map(record => {
      const { _id, name, date, amount } = record
      const formatDate = moment.utc(date).format("YYYY/MM/DD")
      return {
        _id,
        name,
        date: formatDate,
        amount,
        icon: record.categoryId.icon
      }
    })
    const totalAmount = data.reduce(((accumulator, item) => {
      return accumulator + item.amount
    }), 0)
    res.render("sort", { records: data, sort, totalAmount })
  } catch (err) {
    console.log(err)
  }
})

// Create
router.get("/new", async (req, res) => {

  try {
    const Category = await Category.find().lean()
    if (Category.length === 0) {
      await Category.create(SEED_CATEGORY)
      console.log("所有類別已創建完成。")
    }
  } catch (error) {
    console.log(error)
  }
  res.render("new")
})

router.post("/new", async (req, res) => {
  const userId = req.user._id
  console.log(req.user)
  const { name, date, category, amount } = req.body

  const categoryData = await Category.findOne({ name: category }).lean()
  try {
    await Record.create({
      name,
      date,
      amount,
      userId,
      categoryId: categoryData._id
    })
    res.redirect("/")
  } catch (error) {
    console.log(error)
  }
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
router.get("/:id/edit", async (req, res) => {
  const userId = req.user._id
  const _id = req.params._id

  try {
    const record = await Record.findOne({ _id, userId }).populate("categoryId").lean()
    const formatDate = moment.utc(record.date).format("YYYY-MM-DD")

    res.render("edit", { record, formatDate })
  } catch (error) {
    console.log(error)
  }
})

router.put("/:id/edit", async (req, res) => {
  const userId = req.user._id
  const _id = req.params._id
  const { name, date, category, amount } = req.body
  
  try {
    const categoryData = await Category.findOne({ name: category }).lean()
    const record = {
      name,
      date,
      amount,
      userId,
      categoryId: categoryData._id
    }

    await Record.updateOne({ _id, userId }, { $set: record })
    res.redirect("/")
  } catch (error) {
    console.log(error)
  }
})

// Delete
router.delete("/:id", async (req, res) => {
  const userId = req.user._id
  const _id = req.params._id

  try {
    await Record.findByIdAndDelete({ _id, userId })
    res.redirect("/")
  } catch (error) {
    console.log(error)
  }
})

module.exports = router
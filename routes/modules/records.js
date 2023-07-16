const express = require("express")
const router = express.Router()
const Record = require("../../models/record")
const Category = require("../../models/category")

// Filter
router.get("/filter", async (req, res) => {
  const categories = await Category.find().lean()

  const inputCategory = req.query.category ? req.query.category : { $ne: '' }
  const inputDate = req.query.month ? req.query.month : { $ne: '' }
  const categoryData = {}
  const userId = req.user._id
  const filteredData = await Record.aggregate([
    { $project: { userId: 1, name: 1, amount: 1, category: 1, date: { $substr: ["$date", 0, 7] }, day: { $substr: ["$date", 7, 9] } } },
    { $match: { 'category': inputCategory, 'date': inputDate, userId } }
  ])
  categories.forEach(category => categoryData[category.name] = category.icon)

  async function getFilterData() {
    try {
      if (!filteredData) return res.redirect('/')
      const records = filteredData // home.js使用records
      const date = []
      const rawRecords = await Record.find().lean()
      let totalAmount = 0
      // 在篩選欄顯示 db 中有的月份
      for (let i = 0; i < rawRecords.length; i++) {
        if (!date.includes(rawRecords[i].date.slice(0, 7))) {
          date.push(rawRecords[i].date.slice(0, 7))
        }
      }
      for (let i = 0; i < records.length; i++) {
        records[i].category = categoryData[records[i].category]
        totalAmount = totalAmount + records[i].amount
      }

      res.render('index', { records, categories, inputCategory, totalAmount, date, inputDate })
    } catch (error) {
      console.error(error)
    }
  }
  getFilterData()
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
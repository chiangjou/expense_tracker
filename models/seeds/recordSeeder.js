// 僅在非正式環境時, 使用 dotenv
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config()
}

const bcrypt = require("bcryptjs")
const Record = require("../record")
const User = require("../user")
const Category = require("../category")
const db = require("../../config/mongoose")
const seedRecord = require("./record.json")

const seedUser = {
  name: "廣志",
  email: "user1@example.com",
  password: "12345678"
}

// 建立使用者資料
db.once("open", () => {
  // 從 Category 找測試資料的 category
  seedRecord.map((item, index) => {
    Category.findOne({ name: item.category })
      .then(categories => {
        seedRecord[index].category = categories._id
      })
  })

  // 新增測試帳號到 User
  bcrypt
    .genSalt(10)
    .then(salt => bcrypt.hash(seedUser.password, salt))
    .then(hash => User.create({
      name: seedUser.name,
      email: seedUser.email,
      password: hash
    })

      // 將搭配的 category 和 userId 的資料新增到 Record
      .then(user => {
        Promise.all(
          seedRecord.map(record => {
            return Record.create({
              name: record.name,
              date: record.date,
              amount: record.amount,
              userId: user._id,
              categoryId: record.category
            })
          })
        )
          .then(() => {
            console.log("Record Seeder is executed.")
            process.exit()
          })
      })
    )
})
// 僅在非正式環境時, 使用 dotenv
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config()
}

const bcrypt = require("bcryptjs")
const Record = require("../record")
const User = require("../user")
const db = require("../../config/mongoose")
const seedRecord = require("./record.json")

const seedUser = {
  name: "廣志",
  email: "user1@example.com",
  password: "12345678"
}

// 建立使用者資料
db.once("open", () => {
  bcrypt
    .genSalt(10)
    .then(salt => bcrypt.hash(seedUser.password, salt))
    .then(hash => User.create({
      name: seedUser.name,
      email: seedUser.email,
      password: hash
    }))
    .then(user => {
      const userId = user._id
      return Promise.all(
        Array.from({ length: seedRecord.length }, (_, i) =>
          Record.create({
            name: seedRecord[i].name,
            category: seedRecord[i].category,
            date: seedRecord[i].date,
            amount: seedRecord[i].amount,
            userId
          })
        )
      )
    })
    .then(() => {
      console.log("Record seeder is done!")
      process.exit()
    })
    .catch((error) => console.error(error))
})
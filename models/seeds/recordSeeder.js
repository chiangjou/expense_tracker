const bcrypt = require("bcryptjs")

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config()
}

const Record = require("../record")
const User = require("../user")
const Category = require("../category")
const { SEED_USER, SEED_RECORD } = require("../seedsData")
const db = require("../../config/mongoose")

db.once("open", async () => {
  try {
    // 建立使用者資料
    await Promise.all(
      SEED_USER.map(async (seedUser, seedUser_index) => {
        const salt = await bcrypt.genSalt(10)
        const hash = await bcrypt.hash(seedUser.password, salt)
        const user = await User.create({
          name: seedUser.name,
          email: seedUser.email,
          password: hash
        })
        console("User created")

        const category = await Category.find().lean()
        // 建立 Records 資料
        await Promise.all(
          SEED_RECORD.slice(4 * seedUser_index, 4 + seedUser_index).map(async (seedRecord) => {
            const { name, date, amount } = seedRecord
            // 建立種子資料類別與使用者關聯
            const referenceCategory = 
            await Category.find(data => data.name === seedRecord.category)
            seedRecord.userId = user._id;
            seedRecord.categoryId = referenceCategory._id;
            await Record.create({
              name,
              date,
              amount,
              userId: seedRecord.userId,
              categoryId: seedRecord.categoryId
            });
          })
        )
        console.log("所有使用者與記帳資料已創建完成。");
        process.exit();
      })
    )
  } catch (error) {
    console.log(error);
  }
})
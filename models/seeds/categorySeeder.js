const Category = require("../category")
const { SEED_CATEGORY } = require("../seedsData")
const db = require("../../config/mongoose")

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config()
}

db.once("open", async () => {
  try {
    const Category = await Category.find().lean()

    if (Category.length === 0) {
      await Category.create(SEED_CATEGORY);
      console.log("所有類別已創建完成。");
    }
    process.exit();
  } catch (error) {
    console.log(error);
  }
});




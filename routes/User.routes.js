const express = require("express")
const { registerUser, loginUser, deleteUser, updateUser, verifyUser, getAllUsers } = require("../controllers/User.controller")
const router = express.Router()


router.post("/register", registerUser)
router.post("/login", loginUser)
router.get("/users",verifyUser ,getAllUsers)
router.delete("/deleteUser/:id",  verifyUser,deleteUser)
router.patch("/updateUser/:id",verifyUser, updateUser)

module.exports = router
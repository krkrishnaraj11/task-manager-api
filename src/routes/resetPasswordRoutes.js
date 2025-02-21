const express = require("express");
const resetPasswordController = require("../controllers/resetPasswordController");

const router = express.Router();

router.post("/request-reset", resetPasswordController.requestPasswordReset);
router.post("/reset", resetPasswordController.resetPassword);

module.exports = router;
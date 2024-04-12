const express = require("express");
const router = express.Router();
const loanController = require("../controllers/loanController");

router.post("/check-eligibility", loanController.checkEligibility);
router.post("/create-loan", loanController.createLoan);
router.post("/make-payment/:customer_id/:loan_id", loanController.makePayment);
router.get("/view-loan/:loan_id", loanController.viewLoanDetails);
router.get(
  "/view-statement/:customer_id/:loan_id",
  loanController.viewStatement
);

module.exports = router;

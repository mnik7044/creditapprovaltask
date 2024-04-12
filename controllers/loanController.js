const loanService = require("../services/loanServices");
const loanUtils = require("../utils/loanUtils");

exports.checkEligibility = (req, res) => {
  const { customer_id } = req.body;
  loanService.checkCustomerEligibility(customer_id, (error, result) => {
    if (error) return res.status(500).send(error);
    res.send(result);
  });
};

exports.createLoan = (req, res) => {
  const { customer_id, loan_amount, interest_rate, tenure } = req.body;
  loanService.createLoan(
    customer_id,
    loan_amount,
    interest_rate,
    tenure,
    (error, result) => {
      if (error) return res.status(500).send(error);
      res.send(result);
    }
  );
};

exports.makePayment = (req, res) => {
  const { customer_id, loan_id } = req.params;
  const { payment_amount } = req.body;
  loanService.processPayment(
    customer_id,
    loan_id,
    payment_amount,
    (error, result) => {
      if (error) return res.status(500).send(error);
      res.send(result);
    }
  );
};

exports.viewLoanDetails = (req, res) => {
  const { loan_id } = req.params;
  loanService.getLoanDetails(loan_id, (error, result) => {
    if (error) return res.status(500).send(error);
    res.send(result);
  });
};

exports.viewStatement = (req, res) => {
  const { customer_id, loan_id } = req.params;
  loanService.getLoanStatement(customer_id, loan_id, (error, result) => {
    if (error) return res.status(500).send(error);
    res.send(result);
  });
};

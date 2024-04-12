const db = require("../config/db");
const loanUtils = require("../utils/loanUtils");

function checkCustomerEligibility(customer_id, callback) {
  db.query(
    "SELECT * FROM customer_data WHERE customer_id = ?",
    [customer_id],
    (err, customerResults) => {
      if (err) {
        return callback({
          error: "Database error fetching customer data",
          details: err.message,
        });
      }

      db.query(
        "SELECT * FROM loan_data WHERE customer_id = ?",
        [customer_id],
        (err, loanResults) => {
          if (err) {
            return callback({
              error: "Database error fetching loan data",
              details: err.message,
            });
          }

          if (loanResults.length === 0) {
            return callback(null, {
              message: "No loans found for this customer",
            });
          }

          let creditScore = loanUtils.calculateCreditScore(loanResults);
          let approval = false,
            interestRate = null;
          if (creditScore > 50) {
            approval = true;
            interestRate = customerResults[0].interest_rate;
          } else if (creditScore > 30 && creditScore <= 50) {
            approval = true;
            interestRate = Math.max(12, customerResults[0].interest_rate);
          } else if (creditScore > 10 && creditScore <= 30) {
            approval = true;
            interestRate = Math.max(16, customerResults[0].interest_rate);
          }

          callback(null, {
            customer_id,
            credit_score: creditScore,
            approval,
            interest_rate: interestRate,
          });
        }
      );
    }
  );
}

function createLoan(customer_id, loan_amount, interest_rate, tenure, callback) {
  const loanId = loanUtils.generateRandomLoanId();
  const monthlyInstallment = loanUtils.calculateEMI(
    loan_amount,
    interest_rate,
    tenure
  );

  const query =
    "INSERT INTO loan_data (loan_id, customer_id, loan_amount, interest_rate, tenure, monthly_payment) VALUES (?, ?, ?, ?, ?, ?)";
  const values = [
    loanId,
    customer_id,
    loan_amount,
    interest_rate,
    tenure,
    monthlyInstallment,
  ];

  db.query(query, values, (error, results) => {
    if (error) {
      return callback({
        message: "Error processing loan",
        loan_approved: false,
      });
    }
    callback(null, {
      loan_id: loanId,
      customer_id,
      loan_approved: true,
      message: "Loan successfully approved",
      monthly_installment: monthlyInstallment,
      interest_rate: interest_rate,
      tenure,
    });
  });
}

function processPayment(customer_id, loan_id, payment_amount, callback) {
  const query =
    "SELECT loan_amount, monthly_payment, interest_rate, tenure FROM loan_data WHERE loan_id = ? AND customer_id = ?";
  db.query(query, [loan_id, customer_id], (err, results) => {
    if (err) {
      return callback({
        message: "Database error retrieving loan information",
        error: err,
      });
    }
    if (results.length === 0) {
      return callback({ message: "Loan not found" });
    }

    const loan = results[0];
    if (payment_amount !== loan.monthly_payment) {
      // Recalculate EMI if the payment amount is different
      const newEMI = loanUtils.calculateEMI(
        loan.loan_amount,
        loan.interest_rate,
        loan.tenure
      );
      const updateQuery =
        "UPDATE loan_data SET monthly_payment = ? WHERE loan_id = ?";
      db.query(updateQuery, [newEMI, loan_id], (error, updateResults) => {
        if (error) {
          return callback({
            message: "Error updating loan details",
            error,
          });
        }
        callback(null, {
          message: "Payment processed and EMI recalculated successfully",
          loan_id: loan_id,
          customer_id: customer_id,
          old_monthly_installment: loan.monthly_payment,
          new_monthly_installment: newEMI,
        });
      });
    } else {
      // Handle payment processing without changing the EMI
      callback(null, {
        message: "Payment processed successfully, no changes to EMI",
        loan_id: loan_id,
        customer_id: customer_id,
        monthly_payment: loan.monthly_payment,
      });
    }
  });
}

function getLoanDetails(loan_id, callback) {
  const query = `
        SELECT l.loan_id, l.customer_id, l.loan_amount, l.tenure, l.interest_rate, l.monthly_payment, 
               c.first_name, c.last_name, c.phone_number
        FROM loan_data l
        INNER JOIN customer_data c ON l.customer_id = c.customer_id
        WHERE l.loan_id = ?;
    `;
  db.query(query, [loan_id], (err, results) => {
    if (err) {
      return callback({
        message: "Database error retrieving loan information",
        error: err,
      });
    }
    if (results.length === 0) {
      return callback({ message: "Loan not found" });
    }

    callback(null, results[0]);
  });
}

function getLoanStatement(customer_id, loan_id, callback) {
  const sqlQuery = `
        SELECT 
            ld.loan_id,
            ld.customer_id,
            ld.loan_amount AS principal,
            ld.interest_rate,
            ld.monthly_payment,
            ld.tenure,
            ld.start_date,
            ld.end_date
        FROM loan_data ld
        WHERE ld.customer_id = ? AND ld.loan_id = ?;
    `;

  db.query(sqlQuery, [customer_id, loan_id], (err, result) => {
    if (err) {
      return callback({
        message: "Error retrieving loan statement",
        error: err,
      });
    }
    if (result.length === 0) {
      return callback({ message: "Loan not found for this customer" });
    }
    const loan = result[0];

    // Calculate repayments left based on the tenure and time elapsed
    const start = new Date(loan.start_date);
    const end = new Date(loan.end_date);
    const today = new Date();
    const monthsElapsed =
      (today.getFullYear() - start.getFullYear()) * 12 +
      today.getMonth() -
      start.getMonth();
    let repaymentsLeft = Math.max(0, loan.tenure - monthsElapsed);
    if (today > end) {
      repaymentsLeft = 0;
    }

    callback(null, {
      loan_id: loan.loan_id,
      customer_id: loan.customer_id,
      principal: loan.principal,
      interest_rate: loan.interest_rate,
      monthly_installment: loan.monthly_payment,
      repayments_left: repaymentsLeft,
    });
  });
}

module.exports = {
  checkCustomerEligibility,
  createLoan,
  processPayment,
  getLoanDetails,
  getLoanStatement,
};

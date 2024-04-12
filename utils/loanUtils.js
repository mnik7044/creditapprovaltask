function calculateCreditScore(loans) {
  let score = 100; // Starting score
  loans.forEach((loan) => {
    if (!loan.paid_on_time) score -= 5; // Deduct 5 points for each late payment
  });
  return score;
}

function calculateEMI(principal, annualRate, tenureMonths) {
  const monthlyRate = annualRate / 12 / 100;
  const emi =
    (principal * monthlyRate * Math.pow(1 + monthlyRate, tenureMonths)) /
    (Math.pow(1 + monthlyRate, tenureMonths) - 1);
  return Math.round(emi);
}

function generateRandomLoanId() {
  const maxIntValue = 2147483647; // Maximum value for MySQL INT
  return Math.floor(Math.random() * maxIntValue);
}

module.exports = {
  calculateCreditScore,
  calculateEMI,
  generateRandomLoanId,
};

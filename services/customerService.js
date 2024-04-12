const db = require("../config/db");

function registerCustomer(
  first_name,
  last_name,
  age,
  monthly_income,
  phone_number,
  callback
) {
  // Calculate the approved limit (rounded to the nearest lakh)
  const approved_limit = Math.round((monthly_income * 36) / 100000) * 100000;

  const query = `
      INSERT INTO customer_data (first_name, last_name, age, monthly_salary, phone_number, approved_limit)
      VALUES (?, ?, ?, ?, ?, ?)
    `;

  db.query(
    query,
    [first_name, last_name, age, monthly_income, phone_number, approved_limit],
    (err, results) => {
      if (err) {
        return callback(err);
      }

      const customer_id = results.insertId;
      callback(null, {
        customer_id,
        approved_limit,
      });
    }
  );
}

module.exports = {
  registerCustomer,
};

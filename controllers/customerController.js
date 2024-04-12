const customerService = require("../services/customerService");

exports.registerCustomer = (req, res) => {
  const { first_name, last_name, age, monthly_income, phone_number } = req.body;

  customerService.registerCustomer(
    first_name,
    last_name,
    age,
    monthly_income,
    phone_number,
    (error, result) => {
      if (error) {
        console.error("Failed to register customer:", error);
        return res.status(500).send({ error: "Database operation failed" });
      }

      res.status(201).send({
        customer_id: result.customer_id,
        name: `${first_name} ${last_name}`,
        age,
        monthly_income,
        approved_limit: result.approved_limit,
        phone_number,
      });
    }
  );
};

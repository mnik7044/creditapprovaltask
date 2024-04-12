# Credit Approval System

## Description

This project is a backend service designed for a credit approval system. It allows users to register, check loan eligibility, apply for new loans, view loan details, make payments, and view loan statements. The system uses NodeJS with the Express framework and data management via SQL databases.

## Features

- **User Registration:** Add new customers to the system with an automatically calculated credit limit.
- **Loan Eligibility Check:** Assess if users are eligible for loans based on their credit scores and other factors.
- **Loan Application:** Process new loan applications based on user eligibility.
- **Loan Management:** Users can view details of their loans and make payments.
- **Loan Statements:** Users can view detailed statements of their loans.

## Endpoints

### `/register`

- **POST** `/register`
  - **Description:** Register a new customer.
  - **Request Body:**
    ```json
    {
      "first_name": "string",
      "last_name": "string",
      "age": "int",
      "monthly_income": "int",
      "phone_number": "int"
    }
    ```
  - **Response:**
    ```json
    {
      "customer_id": "int",
      "name": "string",
      "age": "int",
      "monthly_income": "int",
      "approved_limit": "int",
      "phone_number": "int"
    }
    ```

### `/check-eligibility`

- **POST** `/check-eligibility`
  - **Description:** Check loan eligibility for a registered customer.
  - **Request Body:**
    ```json
    {
      "customer_id": "int",
      "loan_amount": "float",
      "interest_rate": "float",
      "tenure": "int"
    }
    ```
  - **Response:**
    ```json
    {
      "customer_id": "int",
      "approval": "bool",
      "interest_rate": "float",
      "corrected_interest_rate": "float",
      "tenure": "int",
      "monthly_installment": "float"
    }
    ```

### `/create-loan`

- **POST** `/create-loan`
  - **Description:** Process a new loan application based on eligibility.
  - **Request Body:**
    ```json
    {
      "customer_id": "int",
      "loan_amount": "float",
      "interest_rate": "float",
      "tenure": "int"
    }
    ```
  - **Response:**
    ```json
    {
      "loan_id": "int",
      "customer_id": "int",
      "loan_approved": "bool",
      "message": "string",
      "monthly_installment": "float"
    }
    ```

### `/view-loan/{loan_id}`

- **GET** `/view-loan/{loan_id}`
  - **Description:** View details of a specific loan.
  - **Response:**
    ```json
    {
      "loan_id": "int",
      "customer": "JSON",
      "loan_amount": "bool",
      "interest_rate": "float",
      "monthly_installment": "float",
      "tenure": "int"
    }
    ```

### `/make-payment/{customer_id}/{loan_id}`

- **POST** `/make-payment/{customer_id}/{loan_id}`
  - **Description:** Make a payment towards an EMI for a specific loan.
  - **Response:**
    ```json
    {
      "message": "string"
    }
    ```

### `/view-statement/{customer_id}/{loan_id}`

- **GET** `/view-statement/{customer_id}/{loan_id}`
  - **Description:** View the loan statement for a specific loan.
  - **Response:**
    ```json
    {
      "loan_items": [
        {
          "customer_id": "int",
          "loan_id": "int",
          "principal": "float",
          "interest_rate": "float",
          "amount_paid": "float",
          "monthly_installment": "float",
          "repayments_left": "int"
        }
      ]
    }
    ```

## Installation

1. Clone the repository.
2. Ensure Docker is installed.
3. Run `docker-compose up` to start the application and database.

## Usage

Use an API client like Postman or Insomnia to interact with the API by sending requests to the endpoints defined above.

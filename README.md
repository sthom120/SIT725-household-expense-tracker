# SIT725-household-expense-tracker
# Household Expense Tracker

## Project Overview

The Household Expense Tracker is a web application developed as part of SIT725 Applied Software Engineering.

The application helps household members manage shared household expenses and understand how much each member has paid and how much they owe or are owed.

## Team Members
- Teena Peddi (s225447481)
- Sarah Thomson (s900115501)
- Ali Mohammed J Qaysi (s221016928)
- Md Nafiqur Rahman Abir (s226452465)
- Sami Abdul (s225638628)
- Yug dilipku Patel (s225752756)

## Technology Stack

- **Frontend:** HTML, JavaScript, Materialize CSS
- **Backend:** Node.js, Express.js
- **Database:** MongoDB with Mongoose
- **Version Control:** Git and GitHub
- **Development Environment:** Visual Studio Code

## Current Functionality

The current application includes:

- User registration
- Household creation
- Connecting users to households
- Household dashboard
- Household member display
- Expense categories
- Expense management foundation
- Member payment calculations
- Member expense-share calculations
- Household balance calculations
- Balance summary interface
- Shared household expense testing

## Household Balance Calculation

The application calculates each household member's balance based on:

- The total amount they have paid
- Their equal share of the household expenses
- The difference between the amount paid and their share

A positive balance means the member has paid more than their calculated share, while a negative balance means they have paid less than their calculated share.

## Project Setup

### Prerequisites

Make sure the following are installed:

- Node.js
- npm
- MongoDB Atlas account or MongoDB database
- Git

### Install Dependencies

Clone the repository and navigate to the project folder:

```bash
git clone https://github.com/sthom120/SIT725-household-expense-tracker.git
cd SIT725-household-expense-tracker
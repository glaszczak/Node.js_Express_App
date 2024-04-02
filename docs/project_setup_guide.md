# Project Setup Guide

This guide covers the initial setup required to start development on the application.

## Prerequisites

- **Node.js**: Version 20.10 or later
- **Express**
- **MySQL**
- **RabbitMQ**
- **TypeDI**
- **TypeORM**

## Setup Steps

1. Clone the repository using `git clone <repository-url>`.
2. Navigate into the project directory.
3. Install the dependencies by running `npm install`.
4. Copy the `.env.example` file to a new file named `.env` and fill in the required environment variables.
5. Initialize the database schema by running the SQL scripts provided in the `docs/database_sample_data.sql` directory.

## Code Linting and Formatting

To ensure that your code follows our coding standards and is free from common errors, you can use our linting script. Run the following command to check your code for any linting errors:

```bash
npm run linter
```

If you encounter any linting errors, you can automatically fix many of them by running:

```bash
npm run linter:fix
```

This command will attempt to automatically fix any linting errors found within your code. Note that some errors may require manual intervention to resolve.
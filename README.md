# CAREER CODE API

Welcome to the CAREER CODE API! This API is designed to manage job postings and job applications. It provides endpoints to fetch job listings, retrieve specific job details, submit job applications, and manage job applications.

## Table of Contents
- [Getting Started](#getting-started)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Contributing](#contributing)
- [License](#license)

## Getting Started

Follow these instructions to set up and run the CAREER CODE API locally on your machine.

### Prerequisites

Ensure you have the following installed on your system:
- [Node.js](https://nodejs.org/) (v14 or higher)
- [npm](https://www.npmjs.com/)
- [MongoDB](https://www.mongodb.com/)

### Installation

1. **Clone the repository:**
    ```sh
    git clone https://github.com/your-username/career-code-api.git
    cd career-code-api
    ```

2. **Install the dependencies:**
    ```sh
    npm install
    ```

### Configuration

1. **Environment Variables:**
    Create a `.env` file in the root directory and add the following environment variables:
    ```env
    PORT=5000
    DB_USER=your_mongodb_username
    DB_PASS=your_mongodb_password
    ```

### Usage

1. **Start the server:**
    ```sh
    npm start
    ```

2. **Server will run on:**
    ```
    http://localhost:5000
    ```

## API Endpoints

### Jobs Endpoints

- **Get all jobs:**
    ```http
    GET /jobs
    ```
    Returns a list of all job postings.

- **Get job by ID:**
    ```http
    GET /jobs/:id
    ```
    Returns the details of a specific job.

### Job Application Endpoints

- **Submit a job application:**
    ```http
    POST /job-applications
    ```
    Body:
    ```json
    {
      "job_id": "job_id",
      "applicant_email": "applicant_email",
      "name": "name",
      "phone": "phone",
      "linkedin": "linkedin",
      "github": "github",
      "resumeUrl": "resumeUrl",
      "coverLetter": "coverLetter"
    }
    ```

- **Get applications by applicant email:**
    ```http
    GET /job-application?email=applicant_email
    ```
    Returns the list of applications submitted by the applicant.

- **Delete a job application:**
    ```http
    DELETE /job-application/:id
    ```
    Deletes a specific job application by its ID.

## Contributing

Contributions are welcome! Please follow these steps to contribute:

1. **Fork the repository.**
2. **Create a new branch:**
    ```sh
    git checkout -b feature/your-feature-name
    ```
3. **Commit your changes:**
    ```sh
    git commit -m 'Add some feature'
    ```
4. **Push to the branch:**
    ```sh
    git push origin feature/your-feature-name
    ```
5. **Open a pull request.**

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more information.

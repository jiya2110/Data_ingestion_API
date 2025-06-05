# Data Ingestion API

A simple Node.js Express API to ingest batches of IDs with priorities, process them asynchronously in batches of 3 every 5 seconds, and track the processing status.

---

## Features

- RESTful API endpoints:
  - `POST /ingest` — Submit a list of IDs with an optional priority.
  - `GET /status/:ingestion_id` — Retrieve the status of a specific ingestion.
- Batching of IDs (3 per batch).
- Priority queues (HIGH, MEDIUM, LOW).
- Asynchronous processing with 5-second intervals.
- Status tracking for batches and overall ingestion.

---

## Prerequisites

- Node.js v14+ (tested on Node 21)
- npm (comes with Node.js)

---

## Installation & Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/data-ingestion-api.git
   cd data-ingestion-api

Install dependencies:

bash
Copy
Edit
npm install
Start the server:

bash
Copy
Edit
node index.js
The server will start on port 5000 by default:

arduino
Copy
Edit
Server running on port 5000
API Usage
1. Ingest IDs
Request:

bash
Copy
Edit
POST /ingest
Content-Type: application/json
Body:

json
Copy
Edit
{
  "ids": [1, 2, 3, 4, 5],
  "priority": "HIGH"  // Optional; defaults to LOW if omitted
}
Response:

json
Copy
Edit
{
  "ingestion_id": "uuid-generated-id"
}
2. Check Status
Request:

bash
Copy
Edit
GET /status/<ingestion_id>
Response:

json
Copy
Edit
{
  "ingestion_id": "uuid-generated-id",
  "status": "triggered",
  "batches": [
    {
      "batch_id": "uuid-batch-1",
      "ids": [1, 2, 3],
      "status": "completed"
    },
    {
      "batch_id": "uuid-batch-2",
      "ids": [4, 5],
      "status": "yet_to_start"
    }
  ]
}
Testing
Test the API with tools like Postman, curl, or PowerShell.

Example curl command:

bash
Copy
Edit
curl -X POST http://localhost:5000/ingest \
  -H "Content-Type: application/json" \
  -d '{"ids": [1, 2, 3, 4, 5], "priority": "HIGH"}'


Folder Structure
bash
Copy
Edit
.
├── index.js               # Main app entry point
├── store.js               # Ingestion store and batching logic
├── worker.js              # Batch processing worker
├── test                    # Tests folder (if any)
├── package.json
├── package-lock.json
├── README.md
└── .gitignore

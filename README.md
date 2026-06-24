# Hacker News API Scraper Task

A lightweight, production-ready Node.js data pipeline designed to fetch, clean, filter, and structure real-time data from the official Hacker News API.

## Features
* **Asynchronous Concurrency:** Utilizes `Promise.all` to fetch detailed item data concurrently, maximizing network efficiency.
* **Data Sanitization:** Trims down bulky API payloads into clean, essential JSON schemas.
* **Business Logic Sorting:** Automatically processes data streams to sort entries dynamically by highest engagement (`score`).
* **Persistent Local Storage:** Outputs fully structured JSON datasets directly to local storage (`stories.json`).

## Tech Stack
* **Runtime:** Node.js (v24+)
* **HTTP Client:** Axios

## Installation & Setup

1. Clone or navigate to the directory:
```bash
   cd hn-scraper-task
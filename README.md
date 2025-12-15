# 🎧 CIS 3110: Music Store Analytics Dashboard

This project is a single-page web dashboard designed to visualize key business performance indicators for a digital music store. It demonstrates client-side data loading, processing, and visualization.

## ✨ Live Demo

The dashboard is hosted live via GitHub Pages.

**[View Live Dashboard Here](https://sghernandez527.github.io/CIS3110-Fall25-Deliverable-2/)**

### Project Demo Video

Watch a quick demonstration of the dashboard's features:

[![Demo Video Thumbnail](https://img.youtube.com/vi/J0n0mh1IWPs/maxresdefault.jpg)](https://youtu.be/J0n0mh1IWPs)

---

## 🛠️ Technology Stack

This dashboard is built entirely using front-end technologies:

* **HTML & CSS (Bootstrap):** Used for structure and a responsive, clean layout.
* **JavaScript (Vanilla JS):** Handles all application logic, data fetching, and manipulation.
* **Chart.js:** The core library used to render all five dynamic charts.
* **Papa Parse:** Used to reliably fetch and parse the five local CSV data files.

## 📊 Data & Visualizations

The dashboard successfully loads and analyzes five separate CSV files concurrently, showcasing:

1.  **Sales Trend Over Time** (Line Chart)
2.  **Engagement Share by Genre** (Doughnut Chart)
3.  **Top 10 Most Purchased Tracks** (Horizontal Bar Chart)
4.  **Current Inventory Status** (Polar Area Chart)
5.  **Age Group Purchases** (Scatter Chart)

---

## 🏃 Local Setup Instructions

To run this project on your computer (required to avoid local security errors):

1.  Clone the repository.
2.  Navigate to the project directory in your terminal.
3.  Start a local web server (e.g., using Python):
    ```bash
    python3 -m http.server 8000
    ```
4.  Open your browser and navigate to `http://localhost:8000/`.

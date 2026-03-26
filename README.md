# 🚂 Coal Quality Analysis System 💎

A premium, modern, and high-performance system designed to predict coal quality and provide deep industry insights using AI and interactive visualizations.

[![GitHub license](https://img.shields.io/github/license/jeebanjyoti1101/coal-quality-analysis?style=flat-square&color=3498db)](https://github.com/jeebanjyoti1101/coal-quality-analysis/blob/main/LICENSE)
[![GitHub stars](https://img.shields.io/github/stars/jeebanjyoti1101/coal-quality-analysis?style=flat-square&color=f1c40f)](https://github.com/jeebanjyoti1101/coal-quality-analysis/stargazers)
[![GitHub issues](https://img.shields.io/github/issues/jeebanjyoti1101/coal-quality-analysis?style=flat-square&color=e74c3c)](https://github.com/jeebanjyoti1101/coal-quality-analysis/issues)

---

## 🌟 Overview

The **Coal Quality Analysis System** is an end-to-end solution that combines a powerful machine learning backend with an immersive, animation-rich frontend. It allows users to input coal parameters (like Moisture, Ash, and Calorific Value) to predict the grade of coal (Peat, Lignite, Bituminous, or Anthracite) through a sleek, professional interface.

## 🚀 Key Features

### 💻 Frontend (React + Vite)
- **🔥 Animated Hero Section**: Stunning industrial-themed entry with smooth transitions.
- **✨ Interactive Coal Gallery**: Explore different coal types with hover effects and detailed cards.
- **📊 Live Insights**: Real-time data visualization of coal features and their impact.
- **🗺️ India Coal Map**: Interactive map showing major coal production regions in India.
- **🌓 Dark/Premium UI**: A sophisticated look built with Tailwind CSS and Framer Motion.

### 🧠 Backend (Python + ML)
- **⚡ Fast Prediction**: A robust machine learning model (Random Forest / XGBoost) trained on quality data.
- **📈 Comprehensive EDA**: Detailed Exploratory Data Analysis with visual reports in `reports/`.
- **🏗️ Structured Pipeline**: Clean preprocessing, training, and deployment scripts in `src/`.

---

## 📂 Project Structure

```bash
coal-quality-project-structure/
├── app/                  # Prediction API implementation
├── data/                 # Raw and processed datasets
├── frontend/             # ⚛️ React (Vite) project
│   └── coal-react-app/   # Main frontend codebase
├── models/               # 💾 Saved ML models (.pkl)
├── reports/              # 📊 Performance graphs & project reports
├── src/                  # 🐍 Python source code (EDA, training, preprocessing)
├── README.md             # 📝 Documentation
├── requirements.txt      # 📦 Python dependencies
└── .gitignore            # 🙈 Git ignore rules
```

---

## 🛠️ Getting Started

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/jeebanjyoti1101/coal-quality-analysis.git
cd coal-quality-analysis
```

### 2️⃣ Setting Up the Backend (Python)
Ensure you have Python 3.9+ installed.
```bash
# Create a virtual environment
python -m venv venv
# Activate it
# On Windows:
venv\Scripts\activate
# On Linux/macOS:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

### 3️⃣ Setting Up the Frontend (React)
```bash
cd frontend/coal-react-app
# Install dependencies
npm install
# Start dev server
npm run dev
```

---

## 🧪 Technologies Used

- **Frontend**: React.js, Vite, Tailwind CSS, Framer Motion, Lucide Icons.
- **Backend / ML**: Python, Scikit-learn, Pandas, NumPy, Matplotlib, Seaborn.
- **Dev Tools**: ESLint, PostCSS, Vite Config.

---

## 🚧 Roadmap

- [ ] Integrate real-time API connection between React and Python backend.
- [ ] Add PDF report generation for predicted coal quality.
- [ ] Implement user authentication for saved predictions.

## 👤 Author

**Jeeban Jyoti Pradhan**
- GitHub: [@jeebanjyoti1101](https://github.com/jeebanjyoti1101)
- Project Link: [Coal Quality Analysis](https://github.com/jeebanjyoti1101/coal-quality-analysis)

---

⭐ **Give this project a star if you find it helpful!**

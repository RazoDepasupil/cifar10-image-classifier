# CIFAR-10 Image Classifier

A web-based image classification app using a custom CNN trained on the CIFAR-10 dataset.

## Tech Stack

- **Frontend** — HTML, CSS, JavaScript
- **Backend** — Node.js, Express
- **ML Server** — Python, FastAPI, TensorFlow
- **Model** — Custom CNN trained on CIFAR-10

## Classes

airplane · automobile · bird · cat · deer · dog · frog · horse · ship · truck

## Project Structure
├── cifar10-prediction/        # Python ML server
│   ├── model/
│   │   └── cifar10_model.keras
│   ├── app.py
│   └── requirement.txt
│
└── cifar10-prediction-webapp/ # Node.js web server + frontend
├── public/
│   ├── index.html
│   ├── script.js
│   └── style.css
└── src/
├── index.js
└── routes/predict.js

## Getting Started

### ML Server (FastAPI)
```bash
cd cifar10-prediction
python -m venv .venv
source .venv/Scripts/activate  # Windows
pip install -r requirement.txt
uvicorn app:app --host 0.0.0.0 --port 8000 --reload
```

### Web Server (Express)
```bash
cd cifar10-prediction-webapp
npm install
npm run dev
```

Open `http://localhost:3000`

## Model Performance

- **Architecture** — Custom CNN with Batch Normalization and Dropout
- **Test Accuracy** — 80%+
- **Dataset** — CIFAR-10 (60,000 images, 10 classes)

## Author

**Razo B. Depasupit** — BSCS 3-B


from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import tensorflow as tf
import numpy as np
from PIL import Image
from model.model import cifar10_cnn_model as model
import io

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Express origin
    allow_methods=["*"],
    allow_headers=["*"],
)



CLASS_NAMES = [
    "airplane",
    "automobile",
    "bird",
    "cat",
    "deer",
    "dog",
    "frog",
    "horse",
    "ship",
    "truck"
]

 

def preprocess(image_bytes: bytes):
    img = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    img = img.resize((32,32))
    arr = np.array(img) / 255.0
    return np.expand_dims(arr, axis=0).astype("float32")

@app.get(f"/health")
def health():
    return {"status": "ok", "model_loaded": model is not None}


@app.post(f"/api/predict")
async def predict(file: UploadFile = File(...)):
    if model is None:
        raise HTTPException(status_code=503, detail="Model not loaded")
 
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File must be an image")
 
    contents = await file.read()
 
    try:
        tensor = preprocess(contents)
    except Exception:
        raise HTTPException(status_code=400, detail="Could not process image")
 
    preds = model.predict(tensor, verbose=0)[0]
    class_idx = int(np.argmax(preds))
 
    return {
        "class": CLASS_NAMES[class_idx],
        "confidence": round(float(np.max(preds)), 4),
        "scores": {
            CLASS_NAMES[i]: round(float(preds[i]), 4)
            for i in range(len(CLASS_NAMES))
        }
    }
 
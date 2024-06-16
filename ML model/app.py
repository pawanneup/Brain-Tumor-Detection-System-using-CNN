from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.responses import JSONResponse
from io import BytesIO
from PIL import Image, ImageOps
import numpy as np
from tensorflow.keras.models import load_model
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def predict(img):
    img = np.array(img) / 255.0
    img = np.expand_dims(img, axis=0)
    model = load_model('model.h5')
    pred = model.predict(img)
    if np.argmax(pred, axis=1)[0] == 0:
        out_pred = "Brain Tumor: Common symptoms of brain tumours include headaches, feeling or being sick and seizures (fits).Long Term Symptoms can be unexpected weight loss, increased pressure felt in the back of the head, dizziness and a loss of balance, sudden inability to speak, hearing loss, weakness or numbness that gradually worsens on one side of the body.(Suggesting to make an Appointment and consult a Doctor ASAP)"
    else:
        out_pred = "Normal"
    return out_pred, float(np.max(pred))

@app.post("/upload")
async def upload_file(imagefile: UploadFile = File(...)):
    print(f"Received file: {imagefile.filename}")
    print(f"File content type: {imagefile.content_type}")

    try:
        img = Image.open(BytesIO(await imagefile.read())).convert('RGB')
        img = ImageOps.fit(img, (224, 224), Image.LANCZOS)
    except Exception as e:
        print(f"Error processing image: {e}")
        raise HTTPException(status_code=400, detail="Please choose a valid image file!")

    out_pred, out_prob = predict(img)
    out_prob = out_prob * 100

    danger = "danger"
    if out_pred == "Normal":
        danger = "Safe"

    response = {
        "prediction": out_pred,
        "status": danger
    }

    return JSONResponse(content=response)

if __name__ == '__main__':
    uvicorn.run(app, host='0.0.0.0', port=8000)

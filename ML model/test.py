from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.responses import HTMLResponse
from io import BytesIO
from PIL import Image, ImageOps
import base64
import urllib
import numpy as np
from tensorflow.keras.models import load_model
import uvicorn

app = FastAPI()

def predict(img):
    img = np.array(img) / 255.0
    img = np.expand_dims(img, axis=0)
    model = load_model('save.h5')
    pred = model.predict(img)
    if np.argmax(pred, axis=1)[0] == 0:
        out_pred = "Brain Tumor  Symptoms: unexplained weight loss, double vision or a loss of vision, increased pressure felt in the back of the head, dizziness and a loss of balance, sudden inability to speak, hearing loss, weakness or numbness that gradually worsens on one side of the body."
    else:
        out_pred = "Normal"
    return out_pred, float(np.max(pred))

@app.get("/")
async def main():
    html_content = """
    <html>
        <head>
            <title>Image Upload</title>
        </head>
        <body>
            <h1>Upload an Image</h1>
            <form action="/upload" method="post" enctype="multipart/form-data">
                <input type="file" name="imagefile" accept="image/*" required>
                <button type="submit">Upload Image</button>
            </form>
        </body>
    </html>
    """
    return HTMLResponse(content=html_content)

@app.post("/upload")
async def upload_file(imagefile: UploadFile = File(...)):
    # Log the uploaded file information
    print(f"Received file: {imagefile.filename}")
    print(f"File content type: {imagefile.content_type}")

    try:
        # Read and convert the image
        img = Image.open(BytesIO(await imagefile.read())).convert('RGB')
        img = ImageOps.fit(img, (224, 224), Image.LANCZOS)  # Updated to LANCZOS
    except Exception as e:
        print(f"Error processing image: {e}")
        raise HTTPException(status_code=400, detail="Please choose a valid image file!")

    # Call the prediction function
    out_pred, out_prob = predict(img)
    out_prob = out_prob * 100

    danger = "danger"
    if out_pred == "Normal":
        danger = "Safe"

    # Convert the image to base64 for HTML rendering
    img_io = BytesIO()
    img.save(img_io, 'PNG')
    png_output = base64.b64encode(img_io.getvalue())
    processed_file = urllib.parse.quote(png_output)

    result_html = f"""
    <html>
        <body>
            <h2>Prediction: {out_pred}</h2>
            <h3>Probability: {out_prob:.2f}%</h3>
            <p>Status: {danger}</p>
            <img src="data:image/png;base64,{png_output.decode()}" />
        </body>
    </html>
    """

    return HTMLResponse(content=result_html)

if __name__ == '__main__':
    uvicorn.run(app, host='0.0.0.0', port=8000)

from fastapi import FastAPI
from mangum import Mangum

app = FastAPI()

@app.get("/api/health")
def health_check():
    return {"status": "ok", "message": "Backend is healthy"}

handler = Mangum(app)

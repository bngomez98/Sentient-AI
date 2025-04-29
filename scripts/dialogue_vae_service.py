import torch
import torch.nn as nn
import torch.nn.functional as F
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from transformers import AutoTokenizer
import uvicorn
import os
import numpy as np

# Define the model architecture
class DialogueVAE_LSTM(nn.Module):
    def __init__(self, config):
        super().__init__()
        self.config = config
        self.embedding = nn.Embedding(config["vocab_size"], config["latent_dim"])
        self.encoder = nn.LSTM(config["latent_dim"], config["latent_dim"], batch_first=True)
        self.fc_mu = nn.Linear(config["latent_dim"], config["latent_dim"])
        self.fc_logvar = nn.Linear(config["latent_dim"], config["latent_dim"])
        self.decoder = nn.LSTM(config["latent_dim"], config["latent_dim"], batch_first=True)
        self.fc_out = nn.Linear(config["latent_dim"], config["vocab_size"])
        self.vocab_size = config["vocab_size"]

    def reparameterize(self, mu, logvar):
        std = torch.exp(0.5*logvar)
        eps = torch.randn_like(std)
        return mu + eps*std

    def forward(self, encoded_turns):
        embedded = self.embedding(encoded_turns['input_ids'])
        _, (hidden, cell) = self.encoder(embedded)
        mu = self.fc_mu(hidden[-1])
        logvar = self.fc_logvar(hidden[-1])
        z = self.reparameterize(mu, logvar)
        return None, mu, logvar, z  # We only need z for inference

# FastAPI app
app = FastAPI(title="Dialogue VAE Service")

# Model configuration
config = {
    "latent_dim": 128,
    "max_seq_length": 128,
    "vocab_size": 30522,  # bert-base-uncased vocab size
}

# Initialize model and tokenizer
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
print(f"Using device: {device}")
tokenizer = AutoTokenizer.from_pretrained("bert-base-uncased")
model = DialogueVAE_LSTM(config).to(device)

# Try to load pretrained weights if available
model_path = os.path.join(os.path.dirname(__file__), "vae_model.pth")
if os.path.exists(model_path):
    try:
        model.load_state_dict(torch.load(model_path, map_location=device))
        print(f"Loaded model from {model_path}")
    except Exception as e:
        print(f"Error loading model: {e}")
        print("Using untrained model")
else:
    print(f"Model file not found at {model_path}, using untrained model")

model.eval()

# Request and response models
class DialogueRequest(BaseModel):
    text: str

class DialogueResponse(BaseModel):
    contextual_signal: list
    shape: list

@app.post("/extract-context", response_model=DialogueResponse)
async def extract_context(request: DialogueRequest):
    try:
        # Encode the input text
        encoded_turn = tokenizer(
            request.text, 
            padding='max_length', 
            truncation=True, 
            max_length=config["max_seq_length"], 
            return_tensors='pt'
        ).to(device)
        
        # Extract the latent representation
        with torch.no_grad():
            _, _, _, latent_z = model(encoded_turn)
        
        # Convert to numpy and then to list for JSON serialization
        latent_np = latent_z.cpu().numpy()
        
        return {
            "contextual_signal": latent_np.flatten().tolist(),
            "shape": list(latent_np.shape)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing input: {str(e)}")

@app.get("/health")
async def health_check():
    return {
        "status": "healthy", 
        "model": "dialogue-vae-lstm",
        "device": str(device),
        "torch_version": torch.__version__
    }

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)

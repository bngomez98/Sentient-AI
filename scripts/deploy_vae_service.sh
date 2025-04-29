#!/bin/bash

# Install required packages
pip install torch transformers fastapi uvicorn pydantic numpy

# Copy the VAE model if it exists
if [ -f "vae_model.pth" ]; then
  cp vae_model.pth scripts/vae_model.pth
fi

# Start the VAE service
cd scripts
python dialogue_vae_service.py

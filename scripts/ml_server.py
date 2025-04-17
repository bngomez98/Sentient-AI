from flask import Flask, request, jsonify
import tensorflow as tf
import torch
import numpy as np
import json
import time
import os
from transformers import AutoTokenizer, AutoModel

app = Flask(__name__)

# Load models
tf_models = {}
torch_models = {}

# Configuration
MODEL_DIR = os.environ.get('MODEL_DIR', './models')
MAX_SEQUENCE_LENGTH = 512
DEVICE = torch.device('cuda' if torch.cuda.is_available() else 'cpu')

def load_tensorflow_model(model_name):
    """Load a TensorFlow model from disk"""
    try:
        model_path = os.path.join(MODEL_DIR, 'tensorflow', model_name)
        model = tf.keras.models.load_model(model_path)
        print(f"Loaded TensorFlow model: {model_name}")
        return model
    except Exception as e:
        print(f"Error loading TensorFlow model {model_name}: {str(e)}")
        return None

def load_pytorch_model(model_name):
    """Load a PyTorch model from disk"""
    try:
        model_path = os.path.join(MODEL_DIR, 'pytorch', model_name)
        model = torch.load(model_path, map_location=DEVICE)
        model.eval()
        print(f"Loaded PyTorch model: {model_name}")
        return model
    except Exception as e:
        print(f"Error loading PyTorch model {model_name}: {str(e)}")
        return None

def preprocess_text(text, tokenizer, max_length=MAX_SEQUENCE_LENGTH):
    """Preprocess text for model input"""
    tokens = tokenizer(
        text,
        padding='max_length',
        truncation=True,
        max_length=max_length,
        return_tensors='pt'
    )
    return {k: v.to(DEVICE) for k, v in tokens.items()}

@app.route('/tensorflow/predict', methods=['POST'])
def tensorflow_predict():
    """Endpoint for TensorFlow model predictions"""
    start_time = time.time()
    data = request.json
    
    model_name = data.get('model')
    input_data = data.get('input')
    
    if not model_name or not input_data:
        return jsonify({'error': 'Missing model name or input data'}), 400
    
    # Load model if not already loaded
    if model_name not in tf_models:
        tf_models[model_name] = load_tensorflow_model(model_name)
    
    model = tf_models[model_name]
    if model is None:
        return jsonify({'error': f'Model {model_name} not found'}), 404
    
    try:
        # Convert input to numpy array
        input_array = np.array(input_data)
        
        # Make prediction
        prediction = model.predict(input_array)
        
        # Process result
        result = prediction.tolist()
        confidence = float(np.max(prediction))
        
        processing_time = time.time() - start_time
        
        return jsonify({
            'result': result,
            'confidence': confidence,
            'processing_time': processing_time
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/pytorch/predict', methods=['POST'])
def pytorch_predict():
    """Endpoint for PyTorch model predictions"""
    start_time = time.time()
    data = request.json
    
    model_name = data.get('model')
    input_text = data.get('input')
    
    if not model_name or not input_text:
        return jsonify({'error': 'Missing model name or input data'}), 400
    
    # Load model if not already loaded
    if model_name not in torch_models:
        torch_models[model_name] = load_pytorch_model(model_name)
    
    model = torch_models[model_name]
    if model is None:
        return jsonify({'error': f'Model {model_name} not found'}), 404
    
    try:
        # Load tokenizer
        tokenizer = AutoTokenizer.from_pretrained('bert-base-uncased')
        
        # Preprocess input
        inputs = preprocess_text(input_text, tokenizer)
        
        # Make prediction
        with torch.no_grad():
            outputs = model(**inputs)
        
        # Process result
        logits = outputs.logits
        probabilities = torch.nn.functional.softmax(logits, dim=-1)
        confidence, predicted_class = torch.max(probabilities, dim=-1)
        
        processing_time = time.time() - start_time
        
        return jsonify({
            'result': predicted_class.item(),
            'confidence': confidence.item(),
            'processing_time': processing_time
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/tensorflow/train', methods=['POST'])
def tensorflow_train():
    """Endpoint for training TensorFlow models"""
    data = request.json
    
    model_name = data.get('model')
    training_data = data.get('trainingData')
    validation_data = data.get('validationData')
    hyperparams = data.get('hyperparams', {})
    
    if not model_name or not training_data:
        return jsonify({'error': 'Missing model name or training data'}), 400
    
    # Load model if not already loaded
    if model_name not in tf_models:
        tf_models[model_name] = load_tensorflow_model(model_name)
    
    model = tf_models[model_name]
    if model is None:
        return jsonify({'error': f'Model {model_name} not found'}), 404
    
    try:
        # Prepare training data
        x_train = np.array([item['input'] for item in training_data])
        y_train = np.array([item['output'] for item in training_data])
        
        # Prepare validation data
        x_val = np.array([item['input'] for item in validation_data]) if validation_data else None
        y_val = np.array([item['output'] for item in validation_data]) if validation_data else None
        
        # Set up training parameters
        epochs = hyperparams.get('epochs', 10)
        batch_size = hyperparams.get('batch_size', 32)
        learning_rate = hyperparams.get('learning_rate', 0.001)
        
        # Compile model
        model.compile(
            optimizer=tf.keras.optimizers.Adam(learning_rate=learning_rate),
            loss='categorical_crossentropy',
            metrics=['accuracy']
        )
        
        # Train model
        start_time = time.time()
        history = model.fit(
            x_train, y_train,
            epochs=epochs,
            batch_size=batch_size,
            validation_data=(x_val, y_val) if x_val is not None and y_val is not None else None,
            verbose=1
        )
        
        # Save model
        model.save(os.path.join(MODEL_DIR, 'tensorflow', model_name))
        
        # Get training results
        training_time = time.time() - start_time
        accuracy = float(history.history['accuracy'][-1])
        loss = float(history.history['loss'][-1])
        
        return jsonify({
            'success': True,
            'accuracy': accuracy,
            'loss': loss,
            'epochs': epochs,
            'trainingTime': training_time
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/pytorch/train', methods=['POST'])
def pytorch_train():
    """Endpoint for training PyTorch models"""
    data = request.json
    
    model_name = data.get('model')
    training_data = data.get('trainingData')
    validation_data = data.get('validationData')
    hyperparams = data.get('hyperparams', {})
    
    if not model_name or not training_data:
        return jsonify({'error': 'Missing model name or training data'}), 400
    
    # Load model if not already loaded
    if model_name not in torch_models:
        torch_models[model_name] = load_pytorch_model(model_name)
    
    model = torch_models[model_name]
    if model is None:
        return jsonify({'error': f'Model {model_name} not found'}), 404
    
    try:
        # Set up training parameters
        epochs = hyperparams.get('epochs', 10)
        batch_size = hyperparams.get('batch_size', 32)
        learning_rate = hyperparams.get('learning_rate', 0.001)
        
        # Prepare optimizer
        optimizer = torch.optim.Adam(model.parameters(), lr=learning_rate)
        
        # Prepare loss function
        loss_fn = torch.nn.CrossEntropyLoss()
        
        # Train model
        start_time = time.time()
        model.train()
        
        # Simple training loop (in a real implementation, you'd use DataLoader)
        total_loss = 0
        correct = 0
        total = 0
        
        for epoch in range(epochs):
            epoch_loss = 0
            epoch_correct = 0
            epoch_total = 0
            
            # Process in batches
            for i in range(0, len(training_data), batch_size):
                batch = training_data[i:i+batch_size]
                
                # Prepare batch data
                texts = [item['input'] for item in batch]
                labels = torch.tensor([item['output'] for item in batch]).to(DEVICE)
                
                # Tokenize
                tokenizer = AutoTokenizer.from_pretrained('bert-base-uncased')
                inputs = preprocess_text(texts, tokenizer)
                
                # Forward pass
                outputs = model(**inputs)
                logits = outputs.logits
                
                # Calculate loss
                loss = loss_fn(logits, labels)
                
                # Backward pass
                optimizer.zero_grad()
                loss.backward()
                optimizer.step()
                
                # Calculate accuracy
                _, predicted = torch.max(logits, 1)
                batch_correct = (predicted == labels).sum().item()
                
                epoch_loss += loss.item()
                epoch_correct += batch_correct
                epoch_total += len(batch)
            
            # Epoch statistics
            print(f"Epoch {epoch+1}/{epochs}, Loss: {epoch_loss/len(training_data):.4f}, Accuracy: {epoch_correct/epoch_total:.4f}")
            
            total_loss = epoch_loss
            correct = epoch_correct
            total = epoch_total
        
        # Save model
        torch.save(model, os.path.join(MODEL_DIR, 'pytorch', model_name))
        
        # Get training results
        training_time = time.time() - start_time
        accuracy = correct / total
        loss = total_loss / total
        
        return jsonify({
            'success': True,
            'accuracy': accuracy,
            'loss': loss,
            'epochs': epochs,
            'trainingTime': training_time
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/info/<model_type>/<model_name>', methods=['GET'])
def get_model_info(model_type, model_name):
    """Get information about a model"""
    if model_type not in ['tensorflow', 'pytorch']:
        return jsonify({'error': 'Invalid model type'}), 400
    
    models_dict = tf_models if model_type == 'tensorflow' else torch_models
    
    if model_name not in models_dict:
        # Try to load the model
        if model_type == 'tensorflow':
            models_dict[model_name] = load_tensorflow_model(model_name)
        else:
            models_dict[model_name] = load_pytorch_model(model_name)
    
    model = models_dict[model_name]
    if model is None:
        return jsonify({'error': f'Model {model_name} not found'}), 404
    
    try:
        # Get model information
        if model_type == 'tensorflow':
            info = {
                'name': model_name,
                'type': 'tensorflow',
                'layers': len(model.layers),
                'input_shape': model.input_shape[1:] if hasattr(model, 'input_shape') else None,
                'output_shape': model.output_shape[1:] if hasattr(model, 'output_shape') else None,
            }
        else:
            info = {
                'name': model_name,
                'type': 'pytorch',
                'parameters': sum(p.numel() for p in model.parameters()),
                'trainable_parameters': sum(p.numel() for p in model.parameters() if p.requires_grad),
            }
        
        return jsonify(info)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'tensorflow_models': list(tf_models.keys()),
        'pytorch_models': list(torch_models.keys()),
        'device': str(DEVICE)
    })

if __name__ == '__main__':
    # Load some models on startup
    try:
        # Load TensorFlow models
        for model_name in os.listdir(os.path.join(MODEL_DIR, 'tensorflow')):
            tf_models[model_name] = load_tensorflow_model(model_name)
        
        # Load PyTorch models
        for model_name in os.listdir(os.path.join(MODEL_DIR, 'pytorch')):
            torch_models[model_name] = load_pytorch_model(model_name)
    except Exception as e:
        print(f"Error loading models: {str(e)}")
    
    # Start server
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port)


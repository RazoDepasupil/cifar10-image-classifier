import os
import tensorflow as tf

os.environ["TF_ENABLE_ONEDNN_OPTS"] = "0"


BASE_DIR = os.path.dirname(os.path.abspath(__file__))


try:
    cifar10_cnn_model = tf.keras.models.load_model(os.path.join(BASE_DIR, 'cifar10_model.keras'))
    print("✅ Model loaded successfully")
except Exception as e:
    print(f"❌ Model load failed: {e}")
    cifar10_cnn_model = None
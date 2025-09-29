from flask import Flask, request, jsonify
import os
import axios
from utils.logging_js import log_to_disk

app = Flask(__name__)
PORT = int(os.environ.get('PORT', 3000))
LOG_PATH = os.path.join(os.path.dirname(__file__), '../logs/log.jsonl')
OLLAMA_URL = os.environ.get('OLLAMA_URL', 'http://192.168.1.2:11434/api/generate')
OLLAMA_MODEL = os.environ.get('OLLAMA_MODEL', 'qwen2.5')

@app.route('/generate', methods=['POST'])
def generate():
    data = request.get_json()
    prompt = data.get('prompt')
    if not prompt or not isinstance(prompt, str):
        return jsonify({'error': 'Missing or invalid prompt'}), 400
    try:
        # using Ollama local API
        ollama_res = axios.post(OLLAMA_URL, {
            'model': OLLAMA_MODEL,
            'prompt': prompt,
            'stream': False
        })
        response = ollama_res.data.get('response', '')
        log_entry = {'timestamp': datetime.datetime.now().isoformat(), 'prompt': prompt, 'response': response}
        log_to_disk(log_entry)
        return jsonify({'response': response})
    except Exception as err:
        error_msg = str(err)
        log_to_disk({'timestamp': datetime.datetime.now().isoformat(), 'prompt': prompt, 'error': error_msg})
        return jsonify({'error': 'Failed to generate response', 'details': error_msg}), 500

@app.route('/status', methods=['GET'])
def status():
    memory = dict(psutil.virtual_memory()._asdict())
    uptime = time.time() - psutil.boot_time()
    return jsonify({
        'memory': {
            'rss': memory['used'],
            'heapTotal': memory['total'],
            'heapUsed': memory['available'],
            'external': memory['total'] - memory['available']
        },
        'uptime': uptime,
        'platform': os.uname().sysname,
        'arch': os.uname().machine,
        'cpus': os.cpu_count()
    })

if __name__ == '__main__':
    app.run(port=PORT)

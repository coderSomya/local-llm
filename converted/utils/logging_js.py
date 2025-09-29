import os
import json

def log_to_disk(entry):
    line = json.dumps(entry) + '\n'
    try:
        with open(os.path.join(os.path.dirname(__file__), '../logs/log.jsonl'), 'a') as log_file:
            log_file.write(line)
    except Exception as err:
        print('Failed to log:', err)
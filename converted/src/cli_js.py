import os
import sys
import requests

API_URL = os.environ.get('API_URL', 'http://localhost:3000/generate')

def main():
    prompt = ' '.join(sys.argv[1:])
    if not prompt:
        print('npm run cli <your prompt>', file=sys.stderr)
        sys.exit(1)
    try:
        response = requests.post(API_URL, json={'prompt': prompt})
        print(response.json()['response'])
    except Exception as err:
        print('Error:', err.response.json() if hasattr(err, 'response') else str(err), file=sys.stderr)
        sys.exit(1)

if __name__ == '__main__':
    main()
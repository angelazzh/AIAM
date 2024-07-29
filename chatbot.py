from flask import Flask, request, jsonify
from openai import AzureOpenAI
import os
from dotenv import load_dotenv
from flask_cors import CORS

load_dotenv()

app = Flask(__name__)   
CORS(app)

client = AzureOpenAI(
    azure_endpoint = os.getenv("AZURE_OPENAI_ENDPOINT"),
    api_key=os.getenv("AZURE_OPENAI_API_KEY"),  
    api_version=os.getenv("AZURE_OPENAI_VERSION")
)

conversations = {}

@app.route('/api/chat', methods=['POST'])
def chat():
    data = request.json
    message = data.get('message')
    session_id = data.get('session_id', 'default_session')
    if not message:
        return jsonify({'error': 'No message provided'}), 400
    history = conversations.get(session_id, [
        {"role": "system", "content": "你是一个智慧的银行客户经理机器人。"}
    ])    
    history.append({"role": "user", "content": message})
    try:
        response = client.chat.completions.create(
            model="gpt-4o",
             messages=history,
            max_tokens=1024,
            n=1,
            temperature=0.5,
        )
        bot_response = response.choices[0].message.content
        history.append({"role": "assistant", "content": bot_response})
        conversations[session_id] = history
        return jsonify({'response': bot_response})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(port=5000, debug=True)
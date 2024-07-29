function getSessionId() {
    let sessionId = localStorage.getItem('session_id');
    if (!sessionId) {
        sessionId = generateSessionId();
        localStorage.setItem('session_id', sessionId);
    }
    return sessionId;
}

function generateSessionId() {
    return 'sess-' + Math.random().toString(36).substring(2, 9);
}

document.getElementById('chatButton').addEventListener('click', function() {
    var chatBox = document.getElementById('chatBox');
    if (chatBox.style.display === 'none') {
      chatBox.style.display = 'block';
    } else {
      chatBox.style.display = 'none';
    }
  });
  
  document.getElementById('sendButton').addEventListener('click', async function() {
    var userInput = document.getElementById('userInput').value;
    var messages = document.getElementById('messages');
    if (userInput.trim() !== '') {
        var userMessageElement = document.createElement('div');
        userMessageElement.textContent = userInput;
        userMessageElement.className = 'message user-message';
        messages.appendChild(userMessageElement);
        document.getElementById('userInput').value = '';
    
        const sessionId = getSessionId();
  
      try {
        const response = await fetch('http://localhost:5000/api/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ session_id: sessionId, message: userInput })
        });
        const data = await response.json();
        if (data.error) {
          throw new Error(data.error);
        }
        var botMessageElement = document.createElement('div');
        botMessageElement.textContent = data.response;
        botMessageElement.className = 'message bot-message';
        messages.appendChild(botMessageElement);
        messages.scrollTop = messages.scrollHeight; 
      } catch (error) {
        console.error('Error:', error);
        var errorMessage = document.createElement('div');
        errorMessage.textContent = 'Bot: Sorry, something went wrong.';
        errorMessage.className = 'message bot-message';
        messages.appendChild(errorMessage);
      }
    }
  });
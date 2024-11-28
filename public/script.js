document.getElementById('send-button').addEventListener('click', sendMessage);
document.getElementById('user-input').addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        sendMessage(); // Call sendMessage function on Enter key press
    }
});

async function sendMessage() {
    const userInput = document.getElementById('user-input').value.trim(); // Trim whitespace
    if (!userInput) return; // Prevent sending empty messages

    // Create user message element
    const userMessageElement = document.createElement('div');
    userMessageElement.className = 'message user-message'; // Apply user message class
    userMessageElement.textContent = userInput;
    document.getElementById('messages').appendChild(userMessageElement);

    // Clear the input field
    document.getElementById('user-input').value = '';

    // Fetch response from the server
    try {
        const response = await fetch('/api/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ message: userInput })
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();

        // Create bot message element
        const botMessageElement = document.createElement('div');
        botMessageElement.className = 'message bot-message'; // Apply bot message class
        botMessageElement.textContent = data.reply;
        document.getElementById('messages').appendChild(botMessageElement);
    } catch (error) {
        console.error('Error fetching response:', error);
    }

    // Scroll to the bottom of the messages
    document.getElementById('messages').scrollTop = document.getElementById('messages').scrollHeight;
}

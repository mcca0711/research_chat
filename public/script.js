console.log("script.js is loaded and running!");

// Variable to store extracted text
let extractedText = "";

// Utility function to sanitize text inputs
function sanitizeInput(input) {
  const div = document.createElement("div");
  div.appendChild(document.createTextNode(input));
  return div.innerHTML.trim();
}

// Validate file type (client-side)
function validateFile(file) {
  const allowedTypes = ["application/pdf", "text/plain", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
  return allowedTypes.includes(file.type);
}

// Event listener for sending messages
document.getElementById("send-button").addEventListener("click", sendMessage);
document
  .getElementById("user-input")
  .addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
      sendMessage();
    }
  });

async function sendMessage() {
  const userInput = sanitizeInput(document.getElementById("user-input").value.trim());
  if (!userInput) {
    alert("Please enter a valid message.");
    return;
  }

  const userMessageElement = document.createElement("div");
  userMessageElement.className = "message user-message";
  userMessageElement.textContent = userInput;
  document.getElementById("messages").appendChild(userMessageElement);

  document.getElementById("user-input").value = "";

  const asdSelect = document.getElementById("asd-select");
  const asdType = sanitizeInput(asdSelect.value);

  if (!asdType) {
    alert("Please select your ASD diagnosis.");
    return;
  }

  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: userInput, asdType }),
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();

    const botMessageElement = document.createElement("div");
    botMessageElement.className = "message bot-message";
    botMessageElement.textContent = data.reply;
    document.getElementById("messages").appendChild(botMessageElement);
  } catch (error) {
    console.error("Error fetching response:", error);
    const errorMessageElement = document.createElement("div");
    errorMessageElement.className = "message bot-message error";
    errorMessageElement.textContent =
      "Sorry, something went wrong with the chat.";
    document.getElementById("messages").appendChild(errorMessageElement);
  }

  document.getElementById("messages").scrollTop =
    document.getElementById("messages").scrollHeight;
}

/*****************************************************
 * Upload Document Event Listener
 *****************************************************/
document
  .getElementById("upload-form")
  .addEventListener("submit", async (e) => {
    e.preventDefault();

    const fileInput = document.getElementById("file-input");
    const file = fileInput.files[0];

    if (!file) {
      alert("Please select a file.");
      return;
    }

    if (!validateFile(file)) {
      alert("Invalid file type. Please upload a valid file.");
      return;
    }

    const formData = new FormData();
    formData.append("file-input", file);

    try {
      console.log("Sending file upload request to /api/upload");
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("File upload failed");
      }

      const data = await response.json();

      if (!data.extractedText) {
        throw new Error("Server did not return extracted text.");
      }

      extractedText = sanitizeInput(data.extractedText); // Store sanitized text
      console.log("Extracted Text:", extractedText); // Debugging
      alert("File uploaded successfully!");
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("Error uploading file: " + error.message);
    }
  });

/*****************************************************
 * Generate Learning Path Event Listener
 *****************************************************/
document
  .getElementById("generate-learning-path-button")
  .addEventListener("click", async () => {
    console.log("Generate Learning Path button clicked");

    const asdSelect = document.getElementById("asd-select");
    const asdType = sanitizeInput(asdSelect.value);

    if (!asdType) {
      alert("Please select your ASD diagnosis.");
      return;
    }

    if (!extractedText || extractedText.trim() === "") {
      alert("Please upload a valid file first.");
      return;
    }

    try {
      console.log("Sending request to /api/create-learning-path");
      const response = await fetch("/api/create-learning-path", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ asdType, storyText: extractedText }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate learning path");
      }

      const data = await response.json();

      const learningPathElement = document.createElement("div");
      learningPathElement.className = "message bot-message";
      learningPathElement.innerHTML = `
        <strong>Learning Path for ${asdType}:</strong><br>${data.learningPath.replace(
        /\n/g,
        "<br>"
      )}`;
      document.getElementById("messages").appendChild(learningPathElement);

      document.getElementById("messages").scrollTop =
        document.getElementById("messages").scrollHeight;
    } catch (error) {
      console.error("Error generating learning path:", error);
      alert("Error generating learning path: " + error.message);
    }
  });

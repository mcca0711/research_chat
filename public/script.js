console.log("script.js is loaded and running!");

const profileDetailsElement = document.getElementById("profile-details");
const learnerProfiles = {
  john: {
    name: "John",
    age: 21,
    gender: "Male",
    traits: "Autism Spectrum, Sensory Sensitivities",
    learningStyle: "Visual",
    strengths: "Analytical Thinking",
    interests: "Science, Coding",
    challenges: "Group Work",
  },
  emma: {
    name: "Emma",
    age: 24,
    gender: "Female",
    traits: "Autism Spectrum, High Masking Skills",
    learningStyle: "Multimodal",
    strengths: "Creativity",
    interests: "Music, Design",
    challenges: "Deadlines",
  },
  liam: {
    name: "Liam",
    age: 19,
    gender: "Male",
    traits: "Autism Spectrum, Focus Challenges",
    learningStyle: "Kinesthetic",
    strengths: "Practical Problem-Solving",
    interests: "Mechanics, Outdoors",
    challenges: "Abstract Topics",
  },
  sophie: {
    name: "Sophie",
    age: 23,
    gender: "Female",
    traits: "Autism Spectrum, Hyperfocus Abilities",
    learningStyle: "Auditory",
    strengths: "Memorization",
    interests: "History, Literature",
    challenges: "Inconsistent Feedback",
  },
  alex: {
    name: "Alex",
    age: 28,
    gender: "Male",
    traits: "Autism Spectrum, Sensory Seeking",
    learningStyle: "Exploratory",
    strengths: "Logical Reasoning",
    interests: "Math, Philosophy",
    challenges: "Fast-Paced Learning",
  },
};

document.getElementById("profile-select").addEventListener("change", (event) => {
  const profileName = event.target.value;
  if (profileName && learnerProfiles[profileName]) {
    const profile = learnerProfiles[profileName];
    profileDetailsElement.innerHTML = `
      <strong>Profile Details:</strong>
      <ul>
        <li><strong>Name:</strong> ${profile.name}</li>
        <li><strong>Age:</strong> ${profile.age}</li>
        <li><strong>Gender:</strong> ${profile.gender}</li>
        <li><strong>Traits:</strong> ${profile.traits}</li>
        <li><strong>Learning Style:</strong> ${profile.learningStyle}</li>
        <li><strong>Strengths:</strong> ${profile.strengths}</li>
        <li><strong>Interests:</strong> ${profile.interests}</li>
        <li><strong>Challenges:</strong> ${profile.challenges}</li>
      </ul>
    `;
  } else {
    profileDetailsElement.innerHTML = "<strong>Please select a valid profile.</strong>";
  }
});

document.getElementById("generate-learning-path-button").addEventListener("click", async () => {
  const profileSelect = document.getElementById("profile-select");
  const profileName = profileSelect.value;

  if (!profileName) {
    alert("Please select a profile.");
    return;
  }

  try {
    const response = await fetch("/api/create-learning-path", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ profileName }),
    });

    if (!response.ok) {
      throw new Error("Failed to generate learning path");
    }

    const data = await response.json();

    const learningPathElement = document.createElement("div");
    learningPathElement.className = "message bot-message";
    learningPathElement.innerHTML = `
      <strong>Learning Path for ${profileName}:</strong><br>${data.learningPath.replace(
        /\n/g,
        "<br>"
      )}
    `;
    document.getElementById("messages").appendChild(learningPathElement);

    document.getElementById("messages").scrollTop =
      document.getElementById("messages").scrollHeight;
  } catch (error) {
    console.error("Error generating learning path:", error);
    alert("Error generating learning path: " + error.message);
  }
});

async function sendMessage() {
  const userInput = document.getElementById("user-input").value.trim();
  const profileSelect = document.getElementById("profile-select");
  const profileName = profileSelect.value;

  if (!userInput) {
    alert("Please enter a message.");
    return;
  }

  if (!profileName) {
    alert("Please select a profile.");
    return;
  }

  // Create and display the user's message
  const userMessageElement = document.createElement("div");
  userMessageElement.className = "message user-message";
  userMessageElement.textContent = userInput;
  document.getElementById("messages").appendChild(userMessageElement);

  document.getElementById("user-input").value = "";

  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: userInput,
        asdType: "General",
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to send message");
    }

    const data = await response.json();

    // Create and display the bot's response
    const botMessageElement = document.createElement("div");
    botMessageElement.className = "message bot-message";
    botMessageElement.textContent = data.reply;
    document.getElementById("messages").appendChild(botMessageElement);

    document.getElementById("messages").scrollTop =
      document.getElementById("messages").scrollHeight;
  } catch (error) {
    console.error("Error sending message:", error);
    const errorMessageElement = document.createElement("div");
    errorMessageElement.className = "message bot-message error";
    errorMessageElement.textContent =
      "Sorry, something went wrong with the chat.";
    document.getElementById("messages").appendChild(errorMessageElement);
  }
}
document
  .getElementById("send-button")
  .addEventListener("click", sendMessage);
document
  .getElementById("user-input")
  .addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
      sendMessage();
    }
  });

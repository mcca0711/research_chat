Dynamic Learning Path Application
This application dynamically generates personalized learning paths tailored to predefined learner profiles. It focuses on using the book Moby Dick as the learning content and is currently implemented with hardcoded learner profiles.


Repository
Clone the repository from GitHub: https://github.com/mcca0711/research_chat


Features
- Generate personalized learning paths for predefined learner profiles.
- Intuitive user interface with dynamic profile selection and real-time interactions.
- Deployed on Vercel for quick access and scalability.


Installation
Prerequisites
Ensure you have the following installed:

- Node.js (version 16 or above)
- Vercel CLI
- An OpenAI API Key

Steps to Set Up Locally
1. Clone the Repository:
   git clone https://github.com/mcca0711/research_chat.git
   cd research_chat

2. Install Dependencies:
   npm install

3. Install Vercel CLI (Optional for Deployment)
   If you plan to deploy or run the application using Vercel locally:
   npm install -g vercel

4. Set Up Environment Variables: Create a .env file in the root directory and add:
   OPENAI_API_KEY=your_openai_api_key

5. Start the Development Server:
   vercel dev

6. Access the Application: Open your browser and navigate to http://localhost:3000.


Deployment
Deploying to Vercel via command line
1. Log In to Vercel:
   vercel login
   
2. Deploy the Application:
   vercel --prod
   
3. Access the Live Application: Vercel will provide a live URL after deployment.
   *Note: You must add api key to environment variables

Deploying to vercel via git
1. Set up github repository

2. Push changes to github

3. setup project in vercel by visiting https://vercel.com/

4. Choose to connect project to github repository

5. Deploy project
   *Note: You must add api key to environment variables


Usage
Hardcoded Profiles Version
1. Select a learner profile from the dropdown menu (e.g., John, Emma, Liam).
2. View the profile details dynamically displayed below the dropdown.
3. Click Generate Learning Path to create a personalized learning plan for Moby Dick.


Folder Structure
research_chat/
├── .vercel/                  # Vercel deployment settings
├── api/                      # Backend API endpoints
│   ├── chat.ts               # Handles chat-based interactions
│   ├── create-learning-path.ts # Generates learning paths
│   └── upload.ts             # Handles file uploads
├── dist/                     # Compiled output (ignored in Git)
├── node_modules/             # Dependencies
├── public/                   # Frontend files
│   ├── index.html            # Main UI
│   ├── script.js             # Frontend logic
│   ├── style.css             # Styling
├── types/                    # TypeScript type declarations
│   ├── mammoth.d.ts          # Custom type for mammoth
│   ├── pdf-parse.d.ts        # Custom type for pdf-parse
│   └── sanitize-html.d.ts    # Custom type for sanitize-html
├── uploads/                  # Temporary uploads directory
├── utils/                    # Utility functions
│   └── security.ts           # Sanitization and validation logic
├── .env                      # Environment variables
├── .gitignore                # Git ignore rules for excluding files from version control
├── package.json              # Project metadata
├── server.js                 # Express server (if needed for local development)
├── tsconfig.json             # TypeScript configuration
└── vercel.json               # Vercel configuration

.gitignore
This file typically includes:
node_modules/
dist/
uploads/
.env
.vscode/
.DS_Store


Key Technologies
Frontend: HTML, CSS, JavaScript (with TypeScript for typing).
Backend: Node.js with API endpoints.
Deployment: Vercel.
External API: OpenAI API for generating learning paths.


Contributions
Contributions are welcome! Please fork the repository, make changes, and submit a pull request.


License
This project is licensed under the MIT License. See the LICENSE file for details.


Support
For any questions or issues, please contact orbit9112@gmail.com or open an issue on GitHub.

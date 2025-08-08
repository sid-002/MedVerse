Structure of the documents:



project-root/

├── app.py                      # Flask backend server

├── models/

│   └── model.p                 # Pickled trained sign language model

├── static/                     # Static files served by Flask (e.g., audio mp3)

├── src/

│   ├── pages/

│   │   ├── SignLanguagePage.tsx  # React sign language interpreter page

│   │   └── ConsultationPage.tsx   # React consultation booking + Azure model page

└   └	 └── ...

│   └── ...                     # Other React components and assets

├── venv/                       # Python virtual environment (optional)

├── package.json                # React project config and deps

└── structured-styles.css       # CSS with hover \& animation styles (optional)








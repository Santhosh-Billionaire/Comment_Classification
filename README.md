
# 💬 Comment Classification App

An AI-powered comment moderation system that detects toxic, neutral, and positive comments in real-time using NLP models. Built with a modern stack of **React + Vite + Tailwind CSS + TypeScript**, this app helps protect online communities from harmful interactions.

---

## 🌟 Features

- 🧠 **AI Classification**: Detects **Toxic**, **Neutral**, and **Positive** comments
- 🟥 **Toxic comments** are flagged in red, showing reason and keywords
- 🟩 **Positive comments** are highlighted in green
- ⬛ **Neutral comments** stay in the default dark style
- 🗑️ **Remove button** appears for toxic comments
- 🛡️ **Run Purge Protocol** for bulk moderation
- ⚡ Built for performance using **Vite**
- 🎨 Fully responsive and beautifully styled with **Tailwind CSS**

---

## 🖼️ Demo Screenshot

![image](https://github.com/user-attachments/assets/7258ba91-0e51-4ca0-8cd8-6e4d1b886da7)


---

## 📂 Folder Structure

```bash
Comment_Classification/
├── backend/               # API for comment classification (Python or Node.js)
├── public/                # Static assets
├── src/                   # Frontend source code
│   ├── components/        # UI components (CommentBox, ClassifierCard, etc.)
│   ├── pages/             # Main pages (Home, Feed, etc.)
│   ├── styles/            # Global or component styles
│   └── main.tsx          # React app entry point
├── index.html             # Base HTML file
├── tailwind.config.js     # Tailwind CSS setup
├── postcss.config.js      # PostCSS for Tailwind
├── vite.config.ts         # Vite build configuration
├── tsconfig.json          # TypeScript setup
├── package.json           # NPM dependencies and scripts
└── README.md              # This file
````

---

## ⚙️ Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/Santhosh-Billionaire/Comment_Classification.git
cd Comment_Classification
```

### 2. Install Frontend Dependencies

```bash
npm install
```

### 3. Start the Development Server

```bash
npm run dev
```

### 4. Start Backend (Example for Python)

```bash
cd backend
pip install -r requirements.txt
python app.py
```

---

## 🧠 Tech Stack

| Layer       | Technology                                            |
| ----------- | ----------------------------------------------------- |
| Frontend    | React, TypeScript, Vite                               |
| Styling     | Tailwind CSS                                          |
| Backend     | Python (FastAPI) or Node.js                           |
| AI/ML Model | Toxic comment classifier (e.g., BERT or custom model) |

---

## 🔍 How It Works

1. Users type a comment.
2. The AI model analyzes it:

   * If toxic → shown in **red**, flagged with a warning and `Remove` button
   * If neutral → shown in **gray**
   * If positive → shown in **green**
3. Admins can click "Run Purge Protocol" to clean up all toxic comments at once.

---

## ✨ Example Classifications

| Comment                                     | Classification | Style    |
| ------------------------------------------- | -------------- | -------- |
| "kill you man I will destroy you"           | Toxic          | 🔴 Red   |
| "hey you"                                  | Neutral        | ⚫ Gray   |
| "This is stunning! The colors are amazing." | Positive       | 🟢 Green |

---

## 🤝 Contributing

1. Fork the repo
2. Create a feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -m "Add feature"`
4. Push to your branch: `git push origin feature-name`
5. Submit a pull request

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

## 🧑‍💻 Author

Santhosh – [GitHub Profile](https://github.com/Santhosh-Billionaire)

---

```

---

### 📌 Notes:
- Rename your image to `screenshot.png` and place it in the root folder so it shows up in GitHub's README preview.
- You can add a badge header section too (for License, Build passing, etc.), let me know if you want that added.

Would you like me to generate a markdown preview image or update the actual repo for you (if you give access)?
```

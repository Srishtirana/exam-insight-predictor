# Exam Insight Predictor

An AI-powered exam preparation platform that generates real-time questions and provides detailed performance analysis for competitive exams like JEE, NEET, GATE, CAT, and UPSC.

## 🚀 Features

- **AI-Powered Question Generation**: Real-time question generation based on exam type, subject, and difficulty
- **Multiple Exam Types**: Support for JEE, NEET, GATE, CAT, and UPSC
- **Comprehensive Subjects**: Physics, Chemistry, Biology, Mathematics, Verbal, Quant, Polity, History
- **Performance Analytics**: Detailed feedback and performance tracking
- **User Authentication**: Secure login and registration system
- **Responsive Design**: Modern UI with Tailwind CSS and Shadcn components

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Backend**: Node.js, Express.js, MongoDB
- **UI Components**: Shadcn/ui, Tailwind CSS
- **State Management**: React Query, Context API
- **Authentication**: JWT tokens
- **AI Integration**: OpenAI API (with fallback questions)

## 📦 Installation

1. Clone the repository:
```bash
git clone https://github.com/Srishtirana/exam-insight-predictor.git
cd exam-insight-predictor
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
# Create .env file in src/api/sampleBackend/
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/exam-prediction
JWT_SECRET=your-jwt-secret
OPENAI_API_KEY=your-openai-api-key (optional)
FRONTEND_URL=http://localhost:8080
```

4. Start the development servers:
```bash
# Terminal 1 - Backend
cd src/api/sampleBackend
npm run dev

# Terminal 2 - Frontend
npm run dev
```

## 🌐 Deployment

### GitHub Pages (Current Setup)

The project is configured for automatic deployment to GitHub Pages using GitHub Actions.

1. **Enable GitHub Pages**:
   - Go to your repository settings
   - Navigate to "Pages" section
   - Set source to "GitHub Actions"

2. **Deploy manually** (if needed):
```bash
npm run deploy
```

### Live Demo

Visit the live application: [https://srishtirana.github.io/exam-insight-predictor](https://srishtirana.github.io/exam-insight-predictor)

## 🎯 Usage

1. **Register/Login**: Create an account or login to access the platform
2. **Select Exam**: Choose from JEE, NEET, GATE, CAT, or UPSC
3. **Choose Subject**: Pick your subject and difficulty level
4. **Take Exam**: Answer AI-generated questions in real-time
5. **View Results**: Get detailed performance analysis and feedback
6. **Track Progress**: Monitor your improvement over time

## 🔧 Configuration

### AI Integration

The system works with or without an OpenAI API key:
- **With API Key**: Generates fresh questions using OpenAI
- **Without API Key**: Uses comprehensive fallback question database

### Database

The application includes a seeded database with 89+ questions across all exam types and subjects.

## 📱 Screenshots

- Modern, responsive design
- Clean exam interface
- Detailed performance analytics
- AI-powered feedback system

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

If you encounter any issues:
1. Check the browser console for errors
2. Ensure both frontend and backend servers are running
3. Verify your environment variables are set correctly
4. Check the GitHub Actions logs for deployment issues

## 🔗 Links

- **Repository**: [https://github.com/Srishtirana/exam-insight-predictor](https://github.com/Srishtirana/exam-insight-predictor)
- **Live Demo**: [https://srishtirana.github.io/exam-insight-predictor](https://srishtirana.github.io/exam-insight-predictor)

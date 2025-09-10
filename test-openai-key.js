import axios from 'axios';

async function testOpenAIKey() {
  console.log('🔑 Testing OpenAI API Key Integration...\n');

  try {
    // Test the AI question generation endpoint
    const testData = {
      examType: 'JEE',
      subject: 'physics',
      difficulty: 'easy',
      numberOfQuestions: 2
    };

    console.log('📝 Testing with:', testData);
    console.log('⏳ Sending request to AI service...\n');

    const response = await axios.post('http://localhost:5000/api/exam/test-ai', testData);
    
    console.log('✅ SUCCESS! AI Integration is working!');
    console.log('📊 Response:');
    console.log('   - Status:', response.status);
    console.log('   - AI Generated:', response.data.aiGenerated);
    console.log('   - Questions Generated:', response.data.questions.length);
    console.log('   - Message:', response.data.message);
    
    if (response.data.questions.length > 0) {
      console.log('\n📚 Sample AI-Generated Question:');
      const question = response.data.questions[0];
      console.log('   Question:', question.questionText);
      console.log('   Options:');
      question.options.forEach((option, index) => {
        console.log(`     ${index}: ${option.text}`);
      });
      console.log('   Correct Answer:', question.correctAnswerIndex);
      if (question.explanation) {
        console.log('   Explanation:', question.explanation);
      }
    }

    console.log('\n🎉 Your AI-powered exam system is ready!');
    console.log('💡 You can now:');
    console.log('   1. Go to http://localhost:8080');
    console.log('   2. Sign up/Login to your account');
    console.log('   3. Start an exam with any subject');
    console.log('   4. See AI-generated questions in action!');

  } catch (error) {
    if (error.response?.status === 500) {
      console.log('❌ Error: OpenAI API Key not configured or invalid');
      console.log('\n🔧 To fix this:');
      console.log('   1. Get your API key from: https://platform.openai.com/api-keys');
      console.log('   2. Update src/api/sampleBackend/.env file');
      console.log('   3. Replace "your-openai-api-key-here" with your actual key');
      console.log('   4. Restart the backend server');
      console.log('\n📝 Example:');
      console.log('   OPENAI_API_KEY=sk-your-actual-api-key-here');
    } else {
      console.log('❌ Error:', error.message);
      console.log('🔧 Make sure the backend server is running on port 5000');
    }
  }
}

testOpenAIKey();

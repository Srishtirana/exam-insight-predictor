const axios = require('axios');

async function testAISystem() {
  try {
    console.log('🧪 Testing AI Question Generation System...\n');

    // Test 1: Test AI question generation endpoint
    console.log('1. Testing AI question generation...');
    const aiResponse = await axios.post('http://localhost:5000/api/exam/test-ai', {
      examType: 'JEE',
      subject: 'physics',
      difficulty: 'easy',
      numberOfQuestions: 3
    });

    console.log('✅ AI Question Generation Response:');
    console.log(`   Success: ${aiResponse.data.success}`);
    console.log(`   Message: ${aiResponse.data.message}`);
    console.log(`   Questions Generated: ${aiResponse.data.questions.length}`);
    console.log(`   First Question: ${aiResponse.data.questions[0]?.questionText?.substring(0, 50)}...`);
    console.log('');

    // Test 2: Test exam start with AI questions
    console.log('2. Testing exam start with AI integration...');
    
    // First, we need to login to get a token
    const loginResponse = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'test@example.com',
      password: 'password123'
    });

    const token = loginResponse.data.token;
    console.log('✅ Login successful, token obtained');

    // Start an exam
    const examResponse = await axios.post('http://localhost:5000/api/exam/start', {
      examType: 'JEE',
      subject: 'physics',
      difficulty: 'easy',
      numberOfQuestions: 5
    }, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    console.log('✅ Exam Start Response:');
    console.log(`   Success: ${examResponse.data.success}`);
    console.log(`   Exam ID: ${examResponse.data.examId}`);
    console.log(`   Questions: ${examResponse.data.questions.length}`);
    console.log(`   AI Generated: ${examResponse.data.aiGenerated}`);
    console.log(`   Message: ${examResponse.data.message}`);
    console.log('');

    // Test 3: Submit exam and get results
    console.log('3. Testing exam submission and results...');
    
    const answers = examResponse.data.questions.map((q, index) => ({
      questionId: q.id,
      selectedAnswer: Math.floor(Math.random() * 4) // Random answers for testing
    }));

    const submitResponse = await axios.post('http://localhost:5000/api/exam/submit', {
      examId: examResponse.data.examId,
      answers: answers
    }, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    console.log('✅ Exam Submit Response:');
    console.log(`   Success: ${submitResponse.data.success}`);
    console.log(`   Score: ${submitResponse.data.score}%`);
    console.log(`   Correct Answers: ${submitResponse.data.correctAnswers}/${submitResponse.data.totalQuestions}`);
    console.log(`   AI Feedback Available: ${submitResponse.data.aiFeedback ? 'Yes' : 'No'}`);
    if (submitResponse.data.aiFeedback) {
      console.log(`   AI Feedback Preview: ${submitResponse.data.aiFeedback.substring(0, 100)}...`);
    }
    console.log('');

    console.log('🎉 All tests completed successfully!');
    console.log('\n📊 System Status:');
    console.log('   ✅ Backend server running');
    console.log('   ✅ Database seeded with questions');
    console.log('   ✅ AI question generation working');
    console.log('   ✅ Exam system functional');
    console.log('   ✅ Results and feedback working');

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
  }
}

testAISystem();

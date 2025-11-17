// Test script for Career API endpoints
const API_BASE_URL = 'http://localhost:5000/api/v1';

async function testCareerAPI() {
  console.log('🧪 Testing Career API endpoints...\n');

  // Test 1: Check if API is reachable
  try {
    console.log('1. Testing API connectivity...');
    const testResponse = await fetch(`${API_BASE_URL}/career/test`);
    const testData = await testResponse.json();
    console.log('✅ API is reachable:', testData.message);
  } catch (error) {
    console.log('❌ API connectivity failed:', error.message);
    console.log('💡 Make sure the backend server is running on port 5000');
    return;
  }

  // Test 2: Test career insights endpoint
  try {
    console.log('\n2. Testing career insights endpoint...');
    const insightsResponse = await fetch(`${API_BASE_URL}/career/insights`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        field: 'Artificial Intelligence & Machine Learning'
      })
    });

    const insightsData = await insightsResponse.json();
    
    if (insightsData.success) {
      console.log('✅ Career insights endpoint working');
      console.log('📝 Response preview:', insightsData.data.insights.substring(0, 100) + '...');
    } else {
      console.log('❌ Career insights failed:', insightsData.message);
    }
  } catch (error) {
    console.log('❌ Career insights test failed:', error.message);
  }

  // Test 3: Test career chat endpoint
  try {
    console.log('\n3. Testing career chat endpoint...');
    const chatResponse = await fetch(`${API_BASE_URL}/career/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: 'What are the best career options in technology?'
      })
    });

    const chatData = await chatResponse.json();
    
    if (chatData.success) {
      console.log('✅ Career chat endpoint working');
      console.log('📝 Response preview:', chatData.data.response.substring(0, 100) + '...');
    } else {
      console.log('❌ Career chat failed:', chatData.message);
    }
  } catch (error) {
    console.log('❌ Career chat test failed:', error.message);
  }

  console.log('\n🎉 API testing completed!');
}

// Run the test
testCareerAPI().catch(console.error);

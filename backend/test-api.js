import { connectDB, disconnectDB } from './src/config/database.js';
import { University } from './src/models/index.js';

const testUniversityService = async () => {
  try {
    console.log('🔍 Testing University Service...');
    
    // Connect to database
    await connectDB();
    console.log('✅ Connected to MongoDB');
    
    // Test the same query that the service uses
    const query = { isActive: true };
    console.log('🔍 Query:', JSON.stringify(query));
    
    const universities = await University.find(query).limit(100);
    console.log(`📊 Found ${universities.length} universities`);
    
    if (universities.length > 0) {
      console.log('📋 First university:');
      console.log(JSON.stringify(universities[0], null, 2));
    } else {
      console.log('❌ No universities found with isActive: true');
      
      // Check if there are any universities at all
      const allUniversities = await University.find({});
      console.log(`📊 Total universities in database: ${allUniversities.length}`);
      
      if (allUniversities.length > 0) {
        console.log('📋 First university (any):');
        console.log(JSON.stringify(allUniversities[0], null, 2));
      }
    }
    
    await disconnectDB();
    console.log('✅ Disconnected from MongoDB');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
};

testUniversityService();

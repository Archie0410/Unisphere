#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🎓 UniSphere - Environment Setup');
console.log('================================\n');

// Check if .env already exists
const envPath = path.join(__dirname, '.env');
const envExamplePath = path.join(__dirname, 'env.example');

if (fs.existsSync(envPath)) {
  console.log('⚠️  .env file already exists!');
  console.log('Setup cancelled. Please delete .env file manually if you want to regenerate it.');
  process.exit(0);
} else {
  setupEnvironment();
}

function setupEnvironment() {
  try {
    // Read the example file
    const envExample = fs.readFileSync(envExamplePath, 'utf8');
    
    // Generate secure secrets
    const jwtSecret = crypto.randomBytes(32).toString('hex');
    const refreshSecret = crypto.randomBytes(32).toString('hex');
    const sessionSecret = crypto.randomBytes(32).toString('hex');
    
    // Replace placeholder values
    let envContent = envExample
      .replace(/your_super_secret_jwt_key_here_make_it_long_and_random_at_least_32_characters/g, jwtSecret)
      .replace(/your_refresh_token_secret_make_it_different_from_jwt_secret/g, refreshSecret)
      .replace(/your_session_secret_here_make_it_random/g, sessionSecret);
    
    // Write the .env file
    fs.writeFileSync(envPath, envContent);
    
    console.log('✅ Environment file created successfully!');
    console.log('\n📋 Next steps:');
    console.log('1. Edit .env file and configure your API keys:');
    console.log('   - GEMINI_API_KEY (get from https://makersuite.google.com/app/apikey)');
    console.log('   - Database credentials (optional for demo mode)');
    console.log('   - Email settings (optional)');
    console.log('\n2. Install dependencies: npm install');
    console.log('3. Start the server: npm run dev');
    console.log('\n🔐 Generated secure secrets:');
    console.log(`   JWT_SECRET: ${jwtSecret.substring(0, 16)}...`);
    console.log(`   JWT_REFRESH_SECRET: ${refreshSecret.substring(0, 16)}...`);
    console.log(`   SESSION_SECRET: ${sessionSecret.substring(0, 16)}...`);
    
  } catch (error) {
    console.error('❌ Error creating environment file:', error.message);
    process.exit(1);
  }
}

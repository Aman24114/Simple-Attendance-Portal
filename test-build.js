// Simple test script to verify the build
console.log('Testing build configuration...');

// Test imports
try {
  const mongoose = require('mongoose');
  console.log('✅ Mongoose import successful');
} catch (error) {
  console.log('❌ Mongoose import failed:', error.message);
}

try {
  const bcrypt = require('bcryptjs');
  console.log('✅ bcryptjs import successful');
} catch (error) {
  console.log('❌ bcryptjs import failed:', error.message);
}

try {
  const jwt = require('jsonwebtoken');
  console.log('✅ jsonwebtoken import successful');
} catch (error) {
  console.log('❌ jsonwebtoken import failed:', error.message);
}

console.log('Build test completed!');

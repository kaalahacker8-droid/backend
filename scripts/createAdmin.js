// Run once to verify admin credentials work:
// node scripts/createAdmin.js

require('dotenv').config({ path: '../.env' });
const jwt = require('jsonwebtoken');

const email = process.env.ADMIN_EMAIL;
const password = process.env.ADMIN_PASSWORD;
const secret = process.env.JWT_SECRET;

console.log('Admin credentials from .env:');
console.log('Email:', email);
console.log('Password:', password ? '*** (set)' : 'NOT SET - check .env');
console.log('JWT Secret:', secret ? '*** (set)' : 'NOT SET - check .env');

const token = jwt.sign({ id: 'admin', role: 'admin', email }, secret, { expiresIn: '1d' });
console.log('\nTest admin token (valid 1 day):');
console.log(token);
console.log('\nUse this token in Authorization: Bearer [token] header for admin routes');

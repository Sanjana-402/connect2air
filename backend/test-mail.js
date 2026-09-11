import 'dotenv/config';
import { sendEnquiryEmail } from './src/utils/mailer.js';

console.log('Testing sendEnquiryEmail with current backend/.env configuration...');
console.log('EMAIL_USER:', process.env.EMAIL_USER);
console.log('EMAIL_PASS:', process.env.EMAIL_PASS ? '***' + process.env.EMAIL_PASS.slice(-3) : 'MISSING');

const testPayload = {
  name: 'Test Client',
  email: 'test@connect2future.com',
  phone: '+919035999272',
  company: 'Connect2Future Test',
  message: 'This is a live test enquiry to verify Hostinger SMTP mail delivery.',
  source: 'Mail Delivery Test Script'
};

sendEnquiryEmail(testPayload).then((result) => {
  console.log('TEST RESULT:', JSON.stringify(result, null, 2));
  process.exit(0);
}).catch((err) => {
  console.error('TEST ERROR:', err);
  process.exit(1);
});

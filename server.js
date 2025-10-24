// backend.js - Node.js with Express
require('dotenv').config();

const express = require('express');
const axios = require('axios');
const app = express();

app.use(express.json());
app.use(express.static('public')); // Serve your HTML file

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

// Daraja API Credentials (get these from daraja.safaricom.co.ke)
const CONSUMER_KEY = 'Ym3gOGfWwbXsDCmwaNDU9qZ46svkbOn6EbM4kAgHQvgYiEC9';
const CONSUMER_SECRET = 'DJyxs4WGiYJyAK4iD6TM4X7AZ8cP0bbW4GfazOaJXP6aNOaO2mC16NXFAW1qn3BL';
const BUSINESS_SHORT_CODE = '174379';
const PASSKEY = 'bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919';
const CALLBACK_URL = 'https://lifelessly-nonconsumptive-ricardo.ngrok-free.dev/callback.php';

// Generate access token
async function getAccessToken() {
    const auth = Buffer.from(`${CONSUMER_KEY}:${CONSUMER_SECRET}`).toString('base64');
    
    try {
        const response = await axios.get(
            'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials',
            {
                headers: {
                    Authorization: `Basic ${auth}`
                }
            }
        );
        return response.data.access_token;
    } catch (error) {
        throw new Error('Failed to get access token');
    }
}

// STK Push endpoint
app.post('/api/stk-push', async (req, res) => {
    const { phone, amount } = req.body;
    
    try {
        const token = await getAccessToken();
        const timestamp = new Date().toISOString().replace(/[^0-9]/g, '').slice(0, -3);
        const password = Buffer.from(`${BUSINESS_SHORT_CODE}${PASSKEY}${timestamp}`).toString('base64');
        
        const stkPushResponse = await axios.post(
            'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest',
            {
                BusinessShortCode: BUSINESS_SHORT_CODE,
                Password: password,
                Timestamp: timestamp,
                TransactionType: 'CustomerPayBillOnline',
                Amount: amount,
                PartyA: phone,
                PartyB: BUSINESS_SHORT_CODE,
                PhoneNumber: phone,
                CallBackURL: CALLBACK_URL,
                AccountReference: 'Payment',
                TransactionDesc: 'Payment for services'
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );
        
        res.json(stkPushResponse.data);
    } catch (error) {
        res.status(500).json({
            errorMessage: error.response?.data?.errorMessage || 'STK push failed'
        });
    }
});

// Callback endpoint (M-Pesa will send results here)
app.post('/api/callback', (req, res) => {
    console.log('STK Push Callback:', JSON.stringify(req.body, null, 2));
    // Process the callback data here
    res.json({ ResultCode: 0, ResultDesc: 'Success' });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
# M-Pesa STK Push Integration with node.js(express)

A simple web application that integrates with Safaricom's Daraja API to initiate M-Pesa STK Push payments.

## Features

- Clean, user-friendly payment interface
- Secure M-Pesa STK Push integration
- Real-time payment processing
- Phone number and amount validation
- Loading states and error handling

## Prerequisites

Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v14 or higher)
- [npm](https://www.npmjs.com/) (comes with Node.js)
- A [Safaricom Daraja API](https://developer.safaricom.co.ke/) account

## Project Structure

```
darajaV3/
├── server.js           # Backend server with Daraja API integration
├── package.json        # Project dependencies
├── .env                # Environment variables (credentials)
├── .env.example        # Template for environment variables
├── .gitignore          # Git ignore file
└── public/
    └── index.html      # Frontend payment form
```

## Installation

### 1. Clone or Download the Project

```bash
cd D:\darajaV2
```

### 2. Install Dependencies

```bash
npm install
```

This will install:
- `express` - Web server framework
- `axios` - HTTP client for API requests
- `dotenv` - Environment variable management

### 3. Set Up Daraja API Credentials

1. Visit [Safaricom Daraja Portal](https://developer.safaricom.co.ke/)
2. Sign up or log in
3. Create a new app (or use existing)
4. Copy your **Consumer Key** and **Consumer Secret**

### 4. Configure Environment Variables

Create a `.env` file in the project root:

```bash
# Copy the example file
copy .env.example .env
```

Edit `.env` and add your credentials:

```env
CONSUMER_KEY=your_actual_consumer_key_here
CONSUMER_SECRET=your_actual_consumer_secret_here
BUSINESS_SHORT_CODE=174379
PASSKEY=bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919
CALLBACK_URL=https://your-ngrok-url.ngrok.io/api/callback
```

**For Sandbox Testing:**
- Business Short Code: `174379`
- Passkey: `bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919`
- Test Phone: `254708374149`

## Running the Application

### 1. Start the Server

```bash
npm start
```

You should see:
```
Server running on port 3001
```

### 2. Access the Application

Open your browser and navigate to:
```
http://localhost:3001
```

### 3. Set Up Ngrok (for Callbacks)

M-Pesa needs a public URL to send payment confirmations. Install and run ngrok:

```bash
# Install ngrok from https://ngrok.com/download

# In a new terminal, run:
ngrok http 3001
```

Copy the ngrok URL (e.g., `https://abc123.ngrok.io`) and update your `.env`:

```env
CALLBACK_URL=https://abc123.ngrok.io/api/callback
```

Restart your server after updating the callback URL.

## Usage

1. Enter a valid phone number (format: `254712345678`)
2. Enter the amount to pay (in KES)
3. Click **Pay Now**
4. Check your phone for the M-Pesa STK push prompt
5. Enter your M-Pesa PIN to complete payment

## Testing

### Sandbox Testing

Use these test credentials:
- **Phone Number:** `254708374149`
- **Amount:** Any amount between 1-70000
- **API URL:** `https://sandbox.safaricom.co.ke`

### Production

To go live:
1. Contact Safaricom through the Daraja portal
2. Request production access
3. Get your live credentials:
   - Production Short Code
   - Production Passkey
4. Update `.env` with production credentials
5. Change API URLs from `sandbox.safaricom.co.ke` to `api.safaricom.co.ke`

## API Endpoints

### POST `/api/stk-push`

Initiates an STK push to the customer's phone.

**Request Body:**
```json
{
  "phone": "254712345678",
  "amount": "100"
}
```

**Response:**
```json
{
  "MerchantRequestID": "29115-34620561-1",
  "CheckoutRequestID": "ws_CO_191220191020363925",
  "ResponseCode": "0",
  "ResponseDescription": "Success. Request accepted for processing",
  "CustomerMessage": "Success. Request accepted for processing"
}
```

### POST `/api/callback`

Receives payment confirmation from M-Pesa.

## Troubleshooting

### Port Already in Use

If port 3001 is busy:

```bash
# Windows
netstat -ano | findstr :3001
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:3001 | xargs kill -9
```

Or change the port in `server.js`:
```javascript
app.listen(3002, () => {
    console.log('Server running on port 3002');
});
```

### "Wrong Credentials" Error

- Verify your Consumer Key and Consumer Secret in `.env`
- Ensure you're using sandbox credentials for testing
- Check that `.env` file is in the project root
- Restart the server after changing `.env`

### STK Push Not Received

- Verify phone number format (254XXXXXXXXX)
- Check if ngrok is running
- Ensure CALLBACK_URL in `.env` is correct
- Use the sandbox test phone: `254708374149`

### Blank Page

- Verify `public/index.html` exists and has content
- Check browser console (F12) for errors
- Ensure `app.use(express.static('public'))` is in `server.js`

## Security Best Practices

⚠️ **Important Security Notes:**

- **Never commit `.env` to Git** - it contains sensitive credentials
- Always use `.gitignore` to exclude `.env`
- Use different credentials for development and production
- Rotate credentials regularly
- Use HTTPS in production (required by Safaricom)
- Validate and sanitize all user inputs
- Implement rate limiting to prevent abuse

## Project Dependencies

```json
{
  "express": "^4.18.2",
  "axios": "^1.6.0",
  "dotenv": "^16.3.1"
}
```

## Resources

- [Daraja API Documentation](https://developer.safaricom.co.ke/Documentation)
- [M-Pesa API Reference](https://developer.safaricom.co.ke/APIs/MpesaExpressSimulate)
- [Ngrok Documentation](https://ngrok.com/docs)

## License

This project is open source and available for personal and commercial use.

## Support

For issues with:
- **This code:** Check the troubleshooting section above
- **Daraja API:** Contact Safaricom support via the developer portal
- **M-Pesa payments:** Contact Safaricom customer care

## Contributing

Feel free to submit issues and enhancement requests!

---

**Happy Coding! 🚀**
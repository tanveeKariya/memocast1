# Longenomics Website

A modern, responsive website for Longenomics built with React, TypeScript, and Tailwind CSS.

## Features

- **Responsive Design**: Optimized for all device sizes
- **Modern UI**: Clean, professional design with smooth animations
- **Contact Form**: Integrated email functionality using EmailJS
- **Navigation**: Smooth scrolling and routing between sections
- **Coming Soon Pages**: Placeholder pages for future features

## Email Configuration

The contact form is configured to send emails to `mission@longenomics.com` using EmailJS. To set up email functionality:

### 1. Create EmailJS Account
1. Go to [EmailJS](https://www.emailjs.com/)
2. Create a free account
3. Create a new service (Gmail, Outlook, etc.)
4. Create an email template

### 2. Configure EmailJS Template
Create a template with the following variables:
- `{{from_name}}` - Sender's name
- `{{from_email}}` - Sender's email
- `{{to_email}}` - Recipient email (mission@longenomics.com)
- `{{subject}}` - Message subject
- `{{message}}` - Message content
- `{{reply_to}}` - Reply-to email
- `{{timestamp}}` - When the message was sent
- `{{website}}` - Source website

### 3. Update Configuration
Update the following values in `src/utils/emailService.ts`:
```typescript
const EMAILJS_SERVICE_ID = 'your_service_id';
const EMAILJS_TEMPLATE_ID = 'your_template_id';
const EMAILJS_PUBLIC_KEY = 'your_public_key';
```

### 4. Example Email Template
```
Subject: New Contact Form Submission - {{subject}}

Hello,

You have received a new message from the Longenomics website:

Name: {{from_name}}
Email: {{from_email}}
Subject: {{subject}}
Timestamp: {{timestamp}}

Message:
{{message}}

---
This message was sent from: {{website}}
Reply to: {{reply_to}}
```

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Contact Form Features

- **Form Validation**: Required fields and email validation
- **Loading States**: Shows "Sending..." while submitting
- **Success/Error Messages**: User feedback for form submission
- **Responsive Design**: Works on all device sizes
- **Accessibility**: Proper labels and keyboard navigation

## Email Service Features

- **Direct Email Sending**: Messages sent directly to mission@longenomics.com
- **Form Data Capture**: All form fields included in email
- **Error Handling**: Graceful error handling with user feedback
- **Template Support**: Customizable email templates
- **Spam Protection**: EmailJS provides built-in spam protection
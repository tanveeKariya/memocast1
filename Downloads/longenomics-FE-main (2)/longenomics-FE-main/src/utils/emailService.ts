import emailjs from '@emailjs/browser';

// EmailJS configuration
const EMAILJS_SERVICE_ID = 'service_5rljbmt';
const EMAILJS_TEMPLATE_ID = 'template_huybkxd';
const EMAILJS_PUBLIC_KEY = 'TpBs8l4FrY-U0Lryf';

export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export const sendContactEmail = async (formData: ContactFormData): Promise<void> => {
  try {
    const templateParams = {
      from_name: formData.name,
      from_email: formData.email,
      to_email: 'mission@longenomics.com',
      subject: formData.subject,
      message: formData.message,
      reply_to: formData.email,
      // Additional template variables
      timestamp: new Date().toLocaleString(),
      website: 'Longenomics Website'
    };

    // Initialize EmailJS (only needs to be done once)
    emailjs.init(EMAILJS_PUBLIC_KEY);

    // Send the email
    const response = await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID,
      templateParams
    );

    if (response.status !== 200) {
      throw new Error('Failed to send email');
    }

    console.log('Email sent successfully:', response);
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};

// Alternative method using EmailJS sendForm for form elements
export const sendContactEmailFromForm = async (formElement: HTMLFormElement): Promise<void> => {
  try {
    emailjs.init(EMAILJS_PUBLIC_KEY);
    
    const response = await emailjs.sendForm(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID,
      formElement
    );

    if (response.status !== 200) {
      throw new Error('Failed to send email');
    }

    console.log('Email sent successfully:', response);
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};
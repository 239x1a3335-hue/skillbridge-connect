import emailjs from '@emailjs/browser';

const SERVICE_ID = 'service_qvr20bd';
const PUBLIC_KEY = 'aSiKP7rbqoKlXXhUC';

// Template IDs
const WELCOME_TEMPLATE = 'template_pt4yib6';
const STATUS_TEMPLATE = 'template_8mextx5';

// Initialize EmailJS
emailjs.init(PUBLIC_KEY);

export const sendWelcomeEmail = async (params: {
  to_email: string;
  user_name: string;
  user_email: string;
  platform_name: string;
  dashboard_link: string;
}) => {
  try {
    const response = await emailjs.send(SERVICE_ID, WELCOME_TEMPLATE, {
      to_email: params.to_email,
      user_name: params.user_name,
      user_email: params.user_email,
      platform_name: params.platform_name,
      dashboard_link: params.dashboard_link,
      year: new Date().getFullYear().toString(),
    });
    console.log('Welcome email sent successfully:', response);
    return response;
  } catch (error) {
    console.error('Failed to send welcome email:', error);
    throw error;
  }
};

export const sendStatusEmail = async (params: {
  to_email: string;
  user_name: string;
  user_email: string;
  platform_name: string;
  company_name: string;
  internship_role: string;
  application_id: string;
  application_status: 'Selected' | 'Rejected';
  status_message: string;
  dashboard_link: string;
}) => {
  try {
    const response = await emailjs.send(SERVICE_ID, STATUS_TEMPLATE, {
      to_email: params.to_email,
      user_name: params.user_name,
      user_email: params.user_email,
      platform_name: params.platform_name,
      company_name: params.company_name,
      internship_role: params.internship_role,
      application_id: params.application_id,
      application_status: params.application_status,
      status_message: params.status_message,
      status_class: params.application_status === 'Selected' ? 'status-selected' : 'status-rejected',
      dashboard_link: params.dashboard_link,
      year: new Date().getFullYear().toString(),
    });
    console.log('Status email sent successfully:', response);
    return response;
  } catch (error) {
    console.error('Failed to send status email:', error);
    throw error;
  }
};

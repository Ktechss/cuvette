// services/templateService.js
const EmailTemplate = require('../models/EmailTemplate');  // EmailTemplate model

/**
 * Fetches an email template by name and replaces placeholders with dynamic data
 * @param {string} templateName - The name of the email template to fetch
 * @param {Object} placeholders - An object containing placeholder values to replace (e.g., { name: 'John', otp: '123456' })
 * @returns {Object} - An object containing the email subject and rendered body
 */
const getTemplate = async (templateName, placeholders) => {
  try {
    // Fetch the email template by name from the database
    const template = await EmailTemplate.findOne({ templateName });

    if (!template) {
      throw new Error(`Template "${templateName}" not found`);
    }

    // Replace placeholders in the subject and body
    let subject = template.subject;
    let body = template.body;

    // Replace each placeholder (e.g., {{name}}, {{otp}})
    for (const [key, value] of Object.entries(placeholders)) {
      const regex = new RegExp(`{{${key}}}`, 'g');
      subject = subject.replace(regex, value);
      body = body.replace(regex, value);
    }

    return { subject, body };
  } catch (error) {
    console.error('Error fetching or rendering email template:', error);
    throw new Error('Failed to fetch or render email template');
  }
};

module.exports = { getTemplate };

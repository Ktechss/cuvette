const JobPost = require('../models/JobPost');
const { sendEmail } = require('../services/mailService');

exports.createJobPost = async (req, res) => {
  const { title, description, experienceLevel, endDate, candidates } = req.body;  // Include candidates in the request body

  try {
    // Create a new job post
    const newJobPost = new JobPost({
      companyId: req.companyId,  // Extracted from JWT token
      title,
      description,
      experienceLevel,
      endDate,
      candidates  // Include candidates from the request body
    });

    const jobPost = await newJobPost.save();

    // Send email to each candidate (if there are any candidates)
    if (candidates && candidates.length > 0) {
      candidates.forEach(async (candidateEmail) => {
        try {
          // Prepare the email content
          const subject = `New Job Posting: ${title}`;
          const emailContent = `
            <h1>A new job titled "${title}" has been posted!</h1>
            <p><strong>Description:</strong> ${description}</p>
            <p><strong>Experience Level:</strong> ${experienceLevel}</p>
            <p><strong>Apply before:</strong> ${endDate}</p>
          `;

          // Send email using the sendEmail function
          await sendEmail(candidateEmail, subject, emailContent);
        } catch (emailError) {
          console.error(`Error sending email to ${candidateEmail}:`, emailError);
        }
      });
    }

    // Respond with a success message
    res.status(201).json({
      message: 'Job post created successfully, emails sent to candidates',
      jobPost
    });
  } catch (error) {
    console.error('Error creating job post:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

/**
 * Get all job posts for a company (companyId is auto-extracted from JWT token)
 */
exports.getCompanyJobPosts = async (req, res) => {
  try {
    const companyId = req.companyId; // Extracted from the JWT token
    const jobPosts = await JobPost.find({ companyId });

    if (!jobPosts.length) {
      return res.status(404).json({ message: 'No job posts found' });
    }

    res.status(200).json({ jobPosts });
  } catch (error) {
    console.error('Error fetching job posts:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

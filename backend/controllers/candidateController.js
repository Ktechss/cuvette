const Candidate = require('../models/Candidate');
const JobPost = require('../models/JobPost');

/**
 * Apply to a job post
 */
exports.applyToJob = async (req, res) => {
  const { jobId, candidateEmail, name } = req.body;

  try {
    // Find the job post by ID
    const jobPost = await JobPost.findById(jobId);
    if (!jobPost) {
      return res.status(404).json({ error: 'Job post not found' });
    }

    // Check if candidate already exists, if not create one
    let candidate = await Candidate.findOne({ email: candidateEmail });
    if (!candidate) {
      candidate = new Candidate({ email: candidateEmail, name, jobsApplied: [jobId] });
    } else {
      candidate.jobsApplied.push(jobId);  // Add the job ID to applied jobs
    }
    await candidate.save();

    // Add candidate to job post's candidates array
    jobPost.candidates.push(candidate._id);
    await jobPost.save();

    res.status(201).json({ message: 'Applied to job successfully', candidate });
  } catch (error) {
    console.error('Error applying to job:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

/**
 * Get candidates for a specific job post
 */
exports.getCandidatesForJob = async (req, res) => {
  const { jobId } = req.params;

  try {
    const jobPost = await JobPost.findById(jobId).populate('candidates');
    if (!jobPost) {
      return res.status(404).json({ error: 'Job post not found' });
    }

    res.status(200).json(jobPost.candidates);
  } catch (error) {
    console.error('Error fetching candidates:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

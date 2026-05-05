export const notFound = (req, res) => res.status(404).json({ message: 'Not found' });

export const errorHandler = (err, req, res, _next) => {
  console.error(err);
  if (err.name === 'ZodError') {
    return res.status(400).json({ message: 'Validation failed', issues: err.issues });
  }
  if (err.code === 11000) {
    return res.status(409).json({ message: 'Duplicate value' });
  }
  res.status(err.status || 500).json({ message: err.message || 'Server error' });
};

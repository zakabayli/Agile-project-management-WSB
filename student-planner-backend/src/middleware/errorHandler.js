module.exports = (err, req, res, next) => {
  console.error('[ERROR]', err);

  // Sequelize validation
  if (err.name === 'SequelizeValidationError') {
    return res.status(422).json({
      message: 'Validation error',
      errors: err.errors.map(e => ({ field: e.path, message: e.message })),
    });
  }

  // Sequelize unique constraint
  if (err.name === 'SequelizeUniqueConstraintError') {
    return res.status(409).json({ message: 'A record with this value already exists' });
  }

  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    message: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

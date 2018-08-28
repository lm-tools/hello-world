module.exports = (req, res, next) => {
  res.setHeader('cache-control', 'public, max-age=3153600');
  next();
};

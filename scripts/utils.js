const availableEnvVars = Object.keys(process.env);

function checkEnvVars(requiredEnvVars) {
  requiredEnvVars.forEach(envVar => {
    if (availableEnvVars.includes(envVar)) return;
    console.error(`No ${envVar} environment variable found. Please checkout our README.md`);
  });
}

function secureApi(req, res, next) {
  if (req.isAuthenticated()) return next();
  const err = new Error('Unauthorized');
  err.status = 401;
  err.type = 'AuthenticationError';
  return next(err);
}

function secureDocument(req, res, next) {
  if (req.isAuthenticated()) return next();
  return res.redirect('/login');
}

module.exports = { checkEnvVars, secureApi, secureDocument };

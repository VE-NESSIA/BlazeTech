const requireVerifiedClient = (req, res, next)=> {
const user = req.apiUser;

if (!user) {
    return res.status(401).json({ error: 'Not authenticated' });
}

  // Block all API access until email is verified
if (!user.is_verified) {
    return res.status(403).json({
    error: 'Email not verified',
    message: 'Please verify your email with the OTP sent to your work email'
    });
}

next();
}

export {requireVerifiedClient};
const emailValidator = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      return 'Invalid email format.';
    }
    return null;
};
  
module.exports = emailValidator;  
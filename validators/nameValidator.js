const nameValidator = (name) => {
    if (!name || name.length < 3) {
      return 'Name must be at least 3 characters long.';
    }
    return null;
};
  
module.exports = nameValidator;  
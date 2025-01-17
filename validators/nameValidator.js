const nameValidator = (name) => {
    const nameRegex = /^[a-zA-Z\s]+$/;
    if (!name || name.length < 3) {
      return 'Name must be at least 3 characters long.';
    }
    if (!nameRegex.test(name)){
        return 'Name must only contain letters and spaces.';
    }
    return null;
};
  
module.exports = nameValidator;  
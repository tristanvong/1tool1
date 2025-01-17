const chatValidator = (message) => {
    console.log(message)
    const specialCharRegex = /[<>]/;
    if (specialCharRegex.test(sanitizedMessage)) {
        return 'Message contains invalid characters.';
    }
    if (!message || message.trim().length === 0) {
        return 'Message must not be empty.';
    }
    if (message.trim().length > 500) {
        return 'Message must not exceed 500 characters.';
    }
    const forbiddenWords = ['fuck', 'bitch', 'moron'];
    for (let word of forbiddenWords) {
        if (message.includes(word)) {
            return 'Message contains inappropriate content.';
        }
    }
    return null;
};

module.exports = chatValidator;
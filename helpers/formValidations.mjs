import validator from 'validator';



function sanitizeCreateRepository(name, description) {
    // Sanitize and validate the title
    const sanitizedTitle = validator.escape(name.trim());
    const isValidName = /^[a-zA-Z0-9-_]+$/.test(sanitizedTitle) && sanitizedTitle.length > 0;

    if (!isValidName) {
        throw new Error('Invalid repository name');
    }

    // Sanitize the description
    const sanitizedDescription = validator.escape(validator.stripLow(description.trim(), true));

    return {
        sanitizedTitle,
        sanitizedDescription
    };
}

export { sanitizeCreateRepository };

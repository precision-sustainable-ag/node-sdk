class MultiMessageError extends Error {
    constructor(...messages) {

        let printMessage = `\n${messages.map(msg => `\t- ${msg}`).join('\n')}\n`;

        super(printMessage); // Pass the combined message to the Error class
        
        // Store the individual messages in a property
        this.messages = messages;

        // Set the name of the error
        this.name = this.constructor.name;

        // Ensure the stack trace is maintained for this error type
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}

module.exports = {
    MultiMessageError
}
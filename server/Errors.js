let errorCodes = [{
    code: 'NO_NAME',
    message: 'No name was given'
}, {
    code: 'NOT_REGISTERED',
    message: 'Client is not registered'
}];

let Errors = {};

for (let error of errorCodes) {
    Errors[error.code] = error;
}

export default Errors;

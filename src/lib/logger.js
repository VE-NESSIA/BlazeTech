export const log = (message, meta = {}) => {
    console.log(JSON.stringify({
    message,
    meta,
    timestamp: new Date().toISOString()
    }));
};

export const error = (message, meta = {}) => {
    console.error(JSON.stringify({
    level: 'error',
    message,
    meta,
    timestamp: new Date().toISOString()
    }));
};
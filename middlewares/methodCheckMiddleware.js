// middleware/methodCheckMiddleware.js
const methodCheck = (expectedMethod) => (req, res, next) => {
    if (req.method !== expectedMethod) {
        res.status(405).send(`Method ${req.method} not allowed on ${req.originalUrl}`);
    } else {
        next();
    }
};

module.exports = methodCheck;

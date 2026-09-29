export const showReqMethod = (req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
};
//# sourceMappingURL=logger.middleware.js.map
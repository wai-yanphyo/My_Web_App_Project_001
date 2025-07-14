
const authorize = (roles = []) => {

    if (typeof roles === 'string') {
        roles = [roles]; 
    }

    return (req, res, next) => {

        if (!req.user || !req.user.role) {
            return res.status(401).json({ message: 'Not authorized, user role not found.' });
        }

        if (roles.length && !roles.includes(req.user.role)) {

            return res.status(403).json({ message: `Access denied. Requires one of: ${roles.join(', ')} roles.` });
        }

        next();
    };
};

module.exports = { authorize };

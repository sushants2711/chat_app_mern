import joi from "joi";

// signup middleware
export const signupMiddleware = async (req, res, next) => {
    try {
        const schema = joi.object({
            name: joi.string().min(5).max(30).trim().pattern(/^(?=.*[A-Za-z])[A-Za-z0-9\s@#$.!_'-]+$/).required(),
            email: joi.string().email().min(10).max(50).trim().required(),
            phoneNumber: joi.string().min(10).max(10).trim().pattern(/^[6-9]\d{9}$/).required(),
            password: joi.string().min(8).max(100).required(),
            confirmPassword: joi.string().min(8).max(100).required()
        });

        const { error } = schema.validate(req.body);

        if (error) {
            return res
                .status(400)
                .json({
                    success: false,
                    message: error?.details?.[0]?.message
                });
        };

        next();

    } catch (error) {
        return res
            .status(500)
            .json({
                success: false,
                message: "Internal Server Error",
                error: error.message
            });
    };
};

// login middleware by email
export const loginMiddlewareByEmail = async (req, res, next) => {
    try {
        const schema = joi.object({
            email: joi.string().email().min(10).max(50).trim().required(),
            password: joi.string().min(8).max(100).required()
        });

        const { error } = schema.validate(req.body);

        if (error) {
            return res
                .status(400)
                .json({
                    success: false,
                    message: error?.details?.[0]?.message
                });
        };

        next();

    } catch (error) {
        return res
            .status(500)
            .json({
                success: false,
                message: "Internal Server Error",
                error: error.message
            });
    };
};

// login middleware by phone number
export const loginMiddlewareByPhoneNumber = async (req, res, next) => {
    try {
        const schema = joi.object({
            phoneNumber: joi.string().min(10).max(10).trim().pattern(/^[6-9]\d{9}$/).required(),
            password: joi.string().min(8).max(100).required()
        });

        const { error } = schema.validate(req.body);

        if (error) {
            return res
                .status(400)
                .json({
                    success: false,
                    message: error?.details?.[0]?.message
                });
        };

        next();

    } catch (error) {
        return res
            .status(500)
            .json({
                success: false,
                message: "Internal Server Error",
                error: error.message
            });
    };
};

// verify otp middleware
export const verifyOtpMiddleware = async (req, res, next) => {
    try {
        const schema = joi.object({
            code: joi.string().min(4).max(4).trim().required()
        });

        const { error } = schema.validate(req.body);

        if (error) {
            return res
                .status(400)
                .json({
                    success: false,
                    message: error?.details?.[0]?.message
                });
        };

        next();

    } catch (error) {
        return res
            .status(500)
            .json({
                success: false,
                message: "Internal Server Error",
                error: error.message
            });
    };
};

// forgot email middleware
export const forgotEmailMiddleware = async (req, res, next) => {
    try {
        const schema = joi.object({
            email: joi.string().email().min(10).max(50).trim().required()
        });

        const { error } = schema.validate(req.body);

        if (error) {
            return res
                .status(400)
                .json({
                    success: false,
                    message: error?.details?.[0]?.message
                });
        };

        next();

    } catch (error) {
        return res
            .status(500)
            .json({
                success: false,
                message: "Internal Server Error",
                error: error.message
            });
    };
};

// forgot phone middleware
export const forgotPhoneMiddlewarre = async (req, res, next) => {
    try {
        const schema = joi.object({
            phoneNumber: joi.string().min(10).max(10).trim().pattern(/^[6-9]\d{9}$/).required(),
        });

        const { error } = schema.validate(req.body);

        if (error) {
            return res
                .status(400)
                .json({
                    success: false,
                    message: error?.details?.[0]?.message
                });
        };

        next();

    } catch (error) {
        return res
            .status(500)
            .json({
                success: false,
                message: "Internal Server Error",
                error: error.message
            });
    };
};

// reset password middleware
export const resetPasswordMiddleware = async (req, res, next) => {
    try {
        const schema = joi.object({
            code: joi.string().min(4).max(4).trim().required(),
            password: joi.string().min(8).max(100).required()
        });

        const { error } = schema.validate(req.body);

        if (error) {
            return res
                .status(400)
                .json({
                    success: false,
                    message: error?.details?.[0]?.message
                });
        };

        next();

    } catch (error) {
        return res
            .status(500)
            .json({
                success: false,
                message: "Internal Server Error",
                error: error.message
            });
    };
};

// profile update middleware
export const profileUpdateMiddleware = async (req, res, next) => {
    try {
        const schema = joi.object({
            name: joi.string().min(5).max(30).trim().pattern(/^(?=.*[A-Za-z])[A-Za-z0-9\s@#$.!_'-]+$/).optional().empty(""),
            email: joi.string().email().min(10).max(50).trim().optional().empty(""),
            phoneNumber: joi.string().min(10).max(10).trim().pattern(/^[6-9]\d{9}$/).optional().empty("")
        });

        const { error } = schema.validate(req.body);

        if (error) {
            return res
                .status(400)
                .json({
                    success: false,
                    message: error?.details?.[0]?.message
                });
        };

        next();

    } catch (error) {
        return res
            .status(500)
            .json({
                success: false,
                message: "Internal Server Error",
                error: error.message
            });
    };
};

// update password middleware
export const updatePasswordMiddleware = async (req, res, next) => {
    try {
        const schema = joi.object({
            password: joi.string().min(8).max(100).required()
        });

        const { error } = schema.validate(req.body);

        if (error) {
            return res
                .status(400)
                .json({
                    success: false,
                    message: error?.details?.[0]?.message
                });
        };

        next();

    } catch (error) {
        return res
            .status(500)
            .json({
                success: false,
                message: "Internal Server Error",
                error: error.message
            });
    };
};
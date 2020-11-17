const { body, validationResult } = require('express-validator')
const findTreasureBoxesValidationRules = () => {
    return [
        body('latitude', "[Required-Value] Should be decimal value").isDecimal(),
        body('longitude', "[Required-Value] Should be decimal value").isDecimal(),
        body('distance', "[Required-Value] Should be whole number 1 or 10").isIn([1, 10]),
        body('prize').optional()
        .isInt().withMessage(
            "[Optional-Value] Should be whole number")
        .isFloat({ min: 10, max: 30 }).withMessage(
            "[Optional-Value] Should be whole number between 10 and 30")
    ]
}

const validate = (req, res, next) => {
    const errors = validationResult(req)
    if (errors.isEmpty()) {
        return next()
    }

    let extractedErrors = [];
    errors.array().map(err => extractedErrors.push({
        [err.param]: err.msg
    }))

    return res.status(422).json({
        errors: extractedErrors,
    })
}

module.exports = {
    findTreasureBoxesValidationRules,
    validate,
}
const asyncHandler = (requestHandler) => {
    // higher order function always return a function
    return (req, res, next) => {
        Promise
        .resolve(requestHandler(req, res, next))
        .catch((err) => next(err))
    }
}

export {asyncHandler}
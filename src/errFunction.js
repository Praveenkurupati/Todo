    exports.errFunction = (error, res) => {
        if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
        // Handle validation errors
        const errors = error.errors.map(err => ({
            field: err.path,
            message: err.message,
        }));
        // console.log(errors)
        res.status(400).json({ errors });
        } else {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
        }
    };
  
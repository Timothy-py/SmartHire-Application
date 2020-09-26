// GET HOME PAGE
exports.getIndex = (req, res, next)=>{
    res.status(200).send({message: "Welcome to SmartHire API"})
}

// GET ABOUT PAGE
// exports.getAbout
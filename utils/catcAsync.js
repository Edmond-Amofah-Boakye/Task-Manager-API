const catchAsync = (controller)=>{
    return (req, res, next)=>{
        return controller(req, res, next).catch(next())
    }
}

export default catchAsync;
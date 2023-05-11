import multer from "multer";

const storage = multer.diskStorage({
    destination: (req, file, cb) =>{
        cb(null, "uploads")
    },

    filename: (req, file, cb) =>{
       cb(null, Date.now()+file.originalname)
    }
})


// const fileFilter = (req, file, cb) =>{
//     if(!file.mimetype.endsWith(".pdf")){
//         cb("File must be a PDF")
//     }else{
        
//         cb(null, true)
//     }
// }

const upload = multer({storage: storage})

export default upload;
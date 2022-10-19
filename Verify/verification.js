const jwt=require('jsonwebtoken')
const verifyJwt=(req,res,next)=>{
const token=req.headers["auth-token"]
console.log(token)

if (!token){return res.json({data:'Please Login',auth:false})}
else{
    try{
    const verify=jwt.verify(token,process.env.TOKEN_SECRET)
        req.user=verify;
            next()}
     catch(err){
         res.json({data:'Please Login',auth:false})
     }
        }
    }

module.exports=verifyJwt
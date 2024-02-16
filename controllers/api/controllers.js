// imports
require("dotenv").config()
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken") 
const RegisterUser = require("../../DataModels/registration.model.js")
const LoginUser = require("../../DataModels/login.model.js")
const updateDetails = require("../../DataModels/updateDetails.model.js")
const addPersonalDetails = require("../../DataModels/personalDetail.model.js")
const nodemailer = require("nodemailer")


 
  




//REGISTER API
exports.register=  async(req , res)=>{
    data = new RegisterUser({
      username:req.body.username,
      email:req.body.email,
      password: bcrypt.hashSync(req.body.password)
    })
         try{
            const already_exist=  await RegisterUser.findOne({email:data.email}) || await RegisterUser.findOne({username:data.username})
            if(!already_exist){
                 
                await data.save()
                 
               
                const payload = {
                    username : data.username  , 
                    email: data.email, 
                     password: data.password
                  }
                
                  jwt.sign(payload , process.env.JWT_SECRET_KEY , (error , token)=>{
                      if(error){
                         
                          throw error
                      }
                       
                        res.cookie( "jwtToken" , token ,
                        { httpOnly: true, 
                            secure: false, 
                            expires:new Date(Date.now()+25892000000)
                        })
                      console.log("Cookies Set Sucessfully")
                      console.log(token)
                      res.send("Register Sucess !! ")
                                                  
                  } )

                   
                   
            }
            else{
                res.status(200).send("Email is already registered")
                console.log("Email is alreday registered")
            }
         }
    catch(err){

        console.log("Something went wrong")
        res.json(err)
    }
}  







//LOGIN API
exports.login= async (req , res)=>{
    const data = new LoginUser(
        {
            email: req.body.email,
            password: req.body.password
        }
    )
    try{
    
    const values = await RegisterUser.findOne({email:data.email})
   
    if(values){
         
       const hashPassword =  values.password
       console.log(hashPassword)
       console.log(data.password)
       const isMatch = await bcrypt.compare( hashPassword ,data.password)
       console.log(isMatch)
     
       //bcrypt.compare(req.body.password,RegisterUser.password)
      
        if(isMatch){
            
             
            console.log("Login Sucess")
          
             res.status(200).send("Login Sucess !!")
            
        }
        else{
            res.status(200).send("Email or Password is Incorresct")
            console.log("Email or Password is Incorrect")    
        }
    }
    else{
        res.status(500).send("Email or Password is Incorresct")
        console.log("Email or Password is Incorresct")
    }    
}
catch(error){
    console.log("Something went wrong" + error)
    res.status(400).send("Something Went Wrong")
}
}






//ADD DETAILS API
exports.addPersonalDetail=async(req , res)=>{
    try{
        const data = new addPersonalDetails(
            {
                firstName:req.body.firstName,
                lastName: req.body.lastName,
                dateOfBirth: req.body.dateOfBirth,
                age:req.body.age , 
                 
            }
        )

       await data.save()
       console.log("Personal Details saved sucessfull !!")
        res.status(200).send("Personal Details saved sucessfull !!")
         

    }
    catch(error){
        console.log("Error is Occured : " +error )
        res.status(500).send(error)

    }
     

         
 }






//ADD DETAILS API

exports.getDetails = async(req , res)=>{
    const data = new updateDetails(
        {
            email:req.body.email
        }
    )
    try{
        const dataPersonal =  await addPersonalDetails.findOne()
        const dataRegister = await RegisterUser.findOne()
        res.status(201).json(

            {
    
                firstName : dataPersonal.firstName,
                lastName :dataPersonal.lastName , 
                dateOfBirth : dataPersonal.dateOfBirth , 
                age:dataPersonal.age , 
                username: dataRegister.username , 
                email : dataRegister.email
            }
    
        )

    }
    catch(error){
        console.log("Error " + error)
        res.status(504).send(error)

    }
}







//UPDATE-username API
exports.updateUsername= async(req , res)=>{
     
    try{
        const data = new updateDetails(
            {
                oldUsername:req.body.oldUsername  , 
                newUsername:req.body.newUsername
            }
        )

       const isCheck = await RegisterUser.findOne({username:data.oldUsername})
       if(!isCheck){
          console.log("Old Username is not correct ! ! ")
          res.status(200).send("Old Username is not correct ! ! ")
       }
       else{
        await RegisterUser.updateOne({username:data.oldUsername} , {$set:{username:data.newUsername}})
        console.log("Username  Updated sucessfully !!!")
        res.status(201).send("Username  Updated sucessfully !!!")

       }
         
    }
    catch(error){
        console.log("Something Went Wrong Error is :  " + error)
         res.status(500).send("Something Went Wrong")

    }
}





//UPDATE-email API
exports.updateEmail=async(req , res)=>{

    
    try{
        const data = new updateDetails(
            {
                oldEmail:req.body.oldEmail  , 
                newEmail:req.body.newEmail
            }
        )

       const isCheck = await RegisterUser.findOne({email:data.oldEmail})
       if(!isCheck){
          console.log("Email is not correct ! ! ")
          res.status(200).send("Email is not correct ! ! ")
       }
         await RegisterUser.updateOne({email:data.oldEmail} , {$set:{email:data.newEmail}})
         console.log("Email   Updated sucessfully !!!")
         res.status(201).send("Email   Updated sucessfully !!!")
    }
    catch(error){
        console.log("Something Went Wrong Error is :  " + error)
        res.status(500).send("Something Went Wrong ")

    }

}






//UPDATE-password API
exports.updatePassword=async(req , res)=>{

    
    try{
      
        const data = new updateDetails(
            {
                _id : req.body._id , 
                oldPassword:req.body.oldPassword  , 
                newPassword:req.body.newPassword
            }
        )
         

       const prevData = await RegisterUser.findOne({_id:data._id})
        
       
       const isCheck = await bcrypt.compare(data.oldPassword,prevData.password )  
       
       if(!isCheck){
          console.log("Password is not correct ! ! ")
          res.status(200).send("Password is notcorrect ! ! ")
       }
       else{
        await RegisterUser.updateOne({_id:data._id} , {$set:{password: bcrypt.hashSync(data.newPassword)}})
         console.log("Password  Updated sucessfully !!!")
         res.status(201).send("Password  Updated sucessfully !!!")

       }
          
    }
    catch(error){
        console.log("Something Went Wrong Error is :  " + error)
        res.status(500).send(error)

    }


}





//DELETE-user API
exports.deletUser = async(req , res)=>{
  
    try{
        const data = new updateDetails(
            {
                email:req.body.email  , 
                password:req.body.password
            }
        )

       const isCheck = await RegisterUser.findOne({email:data.email})
       if(!isCheck){
          console.log(" Username or password is not correct ! ! ")
          res.status(200).send(" Username or password is not correct ! ! ")
       }
       else{
        await RegisterUser.deleteOne({email:data.email} )
        console.log("  Account delete Sucessfully ")
        res.status(201).send("Account delete Sucesfully")

       }
         
    }
    catch(error){
        console.log("Something Went Wrong Error is :  " + error)
        res.status(500).send("Something Went Wrong !! ")

    }

}





 //Send Mail :-  (NodeMailer , ethereal)

 exports.sendMail = async (req , res)=>{
    const transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        auth: {
            user: 'marge.runte13@ethereal.email',
            pass: 'GuHNbAbse16PwMphf8'
        }
    });

    async function main() {
        // send mail with defined transport object
        const info = await transporter.sendMail({
          from: '"Uvesh ahmed 👻" <foo@example.com>',  
          to: "uveshahmad30@gmail.com, uveshahmadk@gmail.com",  
          subject: "Hello Uvesh Bhai✔", 
          text: "Hello Welcome to the  world of Uvesh Ahmad?",  
          html: "<b>Hello Uvesh Bhai</b>",  
        });
      
        console.log("Message sent: %s", info.messageId);
        res.status(201).send(info.messageId)
 }
 main().catch( 
   
    res.status(500).send("Something went Wrong")

 );

}


exports.logout= async(req , res)=>{
    try {
        res.clearCookie("jwtToken")
        console.log("Logout Sucess!! ")
        res.send("You Have Logout Sucessfully !!")

        
    } catch (error) {
        console.log("Something Went Wrong")
        res.send(error)
        
    }

}













// Forget Password API

// exports.forgetPassword= async(req , res)={


// }





// Reset Password API (through mail link)

// exports.resetPassword= async(req , res)={
    

// }

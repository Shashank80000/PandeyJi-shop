import User from "../model/user.js";
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

export const signupUser = async (req, res)=>{
    try{
            const {name, email, password} = req.body

            if (!name || !email || !password) {
                return res.status(400).json({ message: "name, email and password are required" });
            }

            const normalizedEmail = email.trim().toLowerCase();

            const userExists = await User.findOne({ email: normalizedEmail });

                if(userExists){
                return res.status(409).json({message: "User already exists"})
         }
         
         const hashPassword = await bcrypt.hash(password, 10);
         
         await User.create({
            name,
            email: normalizedEmail,
            password : hashPassword
         })
            res.status(201).json({message: "User registered successfully"})


    }catch(error){
          if (error?.code === 11000) {
                return res.status(409).json({ message: "User already exists" });
          }

          res.status(500).json({message: "Server error"})
    }
}





/////////////////******************************8 */


export const loginUser = async (req, res)=>{
    try{
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        const normalizedEmail = email.trim().toLowerCase();
        const user = await User.findOne({ email: normalizedEmail });
        if (!user) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const match = await bcrypt.compare(password, user.password);
        if(!match){
            return res.status(401).json({message: "Invalid credentials"})
        }

        //generate token
        if (!process.env.JWT_SECRET) {
            console.error("JWT_SECRET is not configured");
            return res.status(500).json({ message: "Server configuration error" });
        }
        const token = jwt.sign({ userID : user._id }, process.env.JWT_SECRET, {expiresIn : "3d"});
        res.json({
            message : "Login successful",
            token,
            userId: user._id,
            user :{
                userId : user._id,
                userID : user._id,
                name : user.name,
                email : user.email
            }
        })



    }catch(error){
        return res.status(500).json({ message: "Server error" });

}
}
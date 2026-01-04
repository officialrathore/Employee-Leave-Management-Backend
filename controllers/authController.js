import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';
import bcrypt from 'bcryptjs';

export const googleAuthCallback = (req, res) => {
  try {
    const user = req.user;
    const token = generateToken(user);
    res.redirect(`${process.env.CLIENT_URL_LOCAL || process.env.CLIENT_URL}/login?token=${token}&user=${encodeURIComponent(JSON.stringify(user))}`);
  } catch (error) {
    res.redirect(`${process.env.CLIENT_URL_LOCAL || process.env.CLIENT_URL}/login?error=auth_failed`);
  }
};

export const signupUser = async (req,res)=>{
   try {
    const {name, email, password, role} = req.body;
    if(!name || !email || !password ){
        return res.status(400).json({message: "Please provide name, email and password"});
    }
    const existingUser = await User.findOne({email});
    if(existingUser){
        return  res.status(400).json({message: "User already exists"});
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({name,email,password: hashedPassword,role});
    await newUser.save();
    const user = await User.findById(newUser._id).select('-password');
    const token = generateToken(user);
    res.status(201).json({user, token});
   } catch (error) {
    res.status(500).json({message: "Server error"});
   }
}

export const loginUser = async (req,res)=>{
    try {
        const {email, password} = req.body;
        if(!email || !password){
            return res.status(400).json({message: "Please provide email or password"});
        }
        const existingUser = await User.findOne({email});
        if(!existingUser){
            return res.status(400).json({message: "Invalid credentials"});
        }
        const isMatch = await bcrypt.compare(password, existingUser.password);
        if(!isMatch){
            return res.status(400).json({message: "Invalid credentials"});
        }
        const user = await User.findById(existingUser._id).select('-password -leaveBalance -leaveBalances -createdAt -updatedAt -__v');
        const token = generateToken(user);
        res.status(200).json({user, token: token});
    } catch (error) {
        res.status(500).json({message: "Server error"});
    }
}

export const updatePassword = async (req,res)=>{
     const {email,password,confirmPassword} = req.body;
     try {
        if(!email || !password || !confirmPassword){
            return res.status(400).json({message: "Please provide email or password"});
        }
        if(password !== confirmPassword){
            return res.status(400).json({message:"Passwords do not match"});
        }
        const hashedpassword = await bcrypt.hash(password,10);
        await User.findOneAndUpdate({email},{password:hashedpassword},{new: true});
        return res.status(200).json({message: "Password updated successfully"});
     } catch (error) {
        res.status(500).json({message: "Server error"});
     }
}

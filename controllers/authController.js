import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';
import bcrypt from 'bcryptjs';

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

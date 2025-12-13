import jwt from 'jsonwebtoken';

const generateToken = (user) =>{
    const token = jwt.sign({id: user._id, role: user.role}, process.env.JWT_SECRET, {
        expiresIn: '24h',
    });
    return token;
};
export default generateToken;
import jwt from "jsonwebtoken"

export const generateToken = (user) =>{
    const age = 1000 * 60 * 60 * 24 * 7;
    const token = jwt.sign(
        {
            id: user.id,
            role : user.role,
        },
        process.env.JWT_SECRET_KEY,
        {expiresIn : age}
    )

    return token;
}

export const verifyToken =(token) =>{
    return jwt.verify(token, process.env.JWT_SECRET_KEY);
}


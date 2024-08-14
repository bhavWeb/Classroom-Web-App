import { verifyToken } from "../utils/jwtUtils.js";

const Protect = (role) =>{

    return (req,res,next)=>{
        
        const authHeader = req.headers.authorization;
        const token = authHeader.split(' ')[1];
        console.log('Token:', token);
        if(!token) return res.status(401).json({message : "Not Authenticated"})

        try {
            const decoded = verifyToken(token);
            if (role && decoded.role !== role) {
                  return res.status(403).json({ error: 'Forbidden' });
                }      

                req.user = decoded;
                next();
              } 
        catch (error) {
                console.log(error);
                res.status(401).json({ error: 'Not authorized' });
        }   
    }
}

export default Protect
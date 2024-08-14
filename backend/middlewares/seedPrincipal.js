import bcrypt from "bcrypt"
import Prisma from "../utils/prisma.js";

export const SeedPrincipal = async () =>{
    const existingPrincipal = await Prisma.user.findUnique({
        where : { email : 'principal@classroom.com'}
    });

    if(!existingPrincipal){
        const hashedPassword = await bcrypt.hash('Admin',10);

        await Prisma.user.create({
            data : {
                email: 'principal@classroom.com',
                password: hashedPassword,
                role: 'PRINCIPAL',
            }
        })
    }
}
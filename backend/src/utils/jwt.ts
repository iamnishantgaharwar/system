import { IJwtSign } from "../types/auth/auth";
import jwt from "jsonwebtoken";
import { randomBytes } from 'crypto'
import  { config } from 'dotenv'
config() 

if(!process.env.JWT_SECRET){
  throw new Error('JWT_SECRET is not defined in environment variables')
}

const JWT_SECRET = process.env.JWT_SECRET


export const generateAccessToken = ({userId, fullname, email, role}: IJwtSign) => {
  return jwt.sign({
    sub: userId,           
    email,  
    role,
    fullname              
  }, JWT_SECRET, {expiresIn: '10m'} )
}

export const generateRefreshToken = () => {
  return randomBytes(64).toString('hex')
}
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv'; 

const {JWT_SECRET} = process.env;
const JWT_EXPIRES_IN = '60m';

export function signToken(payload) {
return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

export function verifyToken(token) {
return jwt.verify(token, JWT_SECRET);
}
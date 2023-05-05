import { sign, verify, decode} from "jsonwebtoken";
import { UserData } from "../interfaces/User.interface";

const JWT_SECRET = process.env.JWT_SECRET || "string_secreto"


const generateToken = async (userData:UserData) => {
    const jwt = await sign({user:userData},JWT_SECRET);
    return jwt;
};

const verifyToken = async (token:string) => {
    const isValid = await verify(token, JWT_SECRET);
    return isValid;
};

const decodeToken = (token:string) =>{
    const decoded = decode(token);
    return decoded;
}

export {verifyToken, generateToken,decodeToken}

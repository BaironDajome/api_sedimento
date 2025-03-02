import { Request } from "express";

export interface RequestAuthUser extends Request{
    user:{
        email:string;
        role:string;
    }
}
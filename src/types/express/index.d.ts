import express from 'express'
import { IUser, UserModel } from '../../models/userModel'
declare global {
    namespace Express {
        interface Request {
            user?: any;
            token?: string;
        }
    }
}
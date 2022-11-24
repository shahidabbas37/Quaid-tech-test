import { NextFunction, Request, Response } from "express";
import { signupValidation, loginValidation } from '../utils/schema';
import { IUSER } from '../interfaces/user.interface';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';


const Users: IUSER[] = [];
class UserController {
    /***  
     * User Sign Up
     */

    public signup = async (req: Request, res: Response, next: NextFunction) => {
        try {

            // validation data before saving

            const { error } = await signupValidation(req.body);
            if (error) {
                console.log(error)
                if(error.details[0].type === 'string.pattern.base') {
                    return res.status(400).json({
                    message:"password does not match with pattern",
                    })
                }
                return res.status(400).json({
                    message: error?.message || "Bad Request",
                })
            }

            // check if user already exists 

            let existingUser = Users.find(user => user.email === req.body.email);
            if (existingUser) {
                return res.status(400).json({
                    message: "User Already Exists",
                })
            }

            // hash password before saving user  
            const salt = await bcrypt.genSalt(10);
            req.body.password = await bcrypt.hash(req.body.password, salt);

            let user = {
                id: uuidv4(),
                name: req.body.name,
                email: req.body.email,
                password: req.body.password
            }
            Users.push(user);
            console.log(Users)
            res.status(201).json({
                message: "user has been created successfully"
            })

        } catch (error) {

            return res.status(500).json({
                message: "something went wrong",
            })
        }
    }

    /***  
     * User Login
     */

    public login = async (req: Request, res: Response, next: NextFunction) => {
        try {
            // validation data before saving

            const { error } = await loginValidation(req.body);
            if (error) {
                return res.status(400).json({
                    message: error?.message || "Bad Request",
                })
            }

            // check if user exist with email
            let existingUser = Users.find(user => user.email === req.body.email);
            if (!existingUser) {
                return res.status(404).json({
                    message: "Not Found",
                })
            }

            // now conforming password 
            const confromPassword = await bcrypt.compare(
                req.body.password, existingUser.password
            )
            if (!confromPassword) {
                return res.status(401).json({
                    message: "Invalid Credientails",
                })
            }

            res.status(200).json({
                name: existingUser.name
            })
        } catch (error) {
            return res.status(500).json({
                message: "something went wrong",
            })
        }
    }
}

export default UserController;
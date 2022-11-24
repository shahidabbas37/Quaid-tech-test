import Joi from 'joi';


export const signupValidation = async (data: any) => {
    const userSchema = Joi.object().keys({
        name: Joi.string().min(3).max(40).required(),
        email: Joi.string().email().trim().required(),
        password: Joi.string().min(6).regex(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{6,}$/).required(),
    })

    return userSchema.validate(data)
}
export const loginValidation = async (data: any) => {
    const userSchema = Joi.object().keys({
        email: Joi.string().email().trim().required(),
        password: Joi.string().min(6).regex(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{6,}$/).required(),
    })
    return userSchema.validate(data)
}
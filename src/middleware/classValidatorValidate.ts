import {validate} from 'class-validator'
import { Response } from 'express'



const modelValidation = async(entity,res:Response)=>{
const errors = await validate(entity)

if (errors.length > 0)return res.status(400).json({errors})
}





export {modelValidation}
import {ValidationError} from 'express-validator';

export const validatorErrorFormater = (initialErrorFormat: ValidationError[]) =>
  initialErrorFormat.map(errorObj => errorObj.msg);

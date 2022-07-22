import { NextFunction, Request, Response } from 'express';
import HttpException from '../exceptions/HttpException';
import { logError, logInfo } from '../utils/util';

const errorMiddleware = (
  error: HttpException,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const status: number = error.status || 500;
    const message: string = error.message || 'Something went wrong';
    const errors: any = error.errors;

    // 500 errors are errors; 400 errors are infos
    // It is assumed that the production should have no 400 errors because
    // the frontend sanitizes all the inputs.
    if (status >= 500) {
      logError(`StatusCode : ${status}, Message : ${message}, error: ${error}`);
    } else {
      logInfo(`StatusCode: ${status}, message: ${message}, , error: ${error}`);
    }
    res.status(status).json({ message, errors });
  } catch (error) {
    next(error);
  }
};

export default errorMiddleware;

import { Request, Response, NextFunction } from 'express';
import { sendResponse } from './response';

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack);
    return sendResponse(res, 500, false, err.message || 'Internal Server Error');
};

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { ApiResponse } from '../utils/response';

declare global {
  namespace Express {
    interface Request {
      user?: any; // ideally replace 'any' with your payload interface
    }
  }
}

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies.accessToken;

  if (!token) {
    return res.status(401).json(ApiResponse.error("Access denied. No token provided."));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json(ApiResponse.error("Invalid or expired token."));
  }
};

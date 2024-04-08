import { ENV } from 'config/env';
import { NextFunction, Request, Response } from 'express';
import { verify } from 'jsonwebtoken';

const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) return res.sendStatus(401);

    verify(token, ENV.JWT.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);

        (req as any).user = user;
        next();
    });
};

export default authenticateToken;

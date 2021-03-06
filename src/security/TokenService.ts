import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import jwt from "jsonwebtoken";
import { responseMessage } from "../controller/DefaultResponseMessage";
import BadRequestError from "../utils/errors/BadRequestError";
import UnauthorizedError from "../utils/errors/UnauthorizedError";
import logger from "../utils/Logger";

export class TokenService {
    static instance: TokenService;

    static getInstance(): TokenService {
        if (!this.instance) {
            this.instance = new TokenService();
        }
        return this.instance;
    }

    generateToken = (credentials: Credentials) => {
        return jwt.sign({
                id: credentials.id,
                email: credentials.email,
                username: credentials.name
            },
            process.env.JWT_SECRET, { expiresIn: TOKEN_TIMEOUT })
    }

    authenticateToken = (req: Request, res: Response, next: NextFunction) => {
        const authHeader = req.headers['authorization']
        const token = authHeader && authHeader.split(' ')[1]

        if (token == null) {
            return res.status(StatusCodes.UNAUTHORIZED).send(new UnauthorizedError("Unauthorized access"));
        }

        jwt.verify(token, process.env.JWT_SECRET as string, async (err: any, user: any) => {
            if (err) {
                logger.error("Token verification error:", err);
                return res.status(StatusCodes.UNAUTHORIZED).send(new UnauthorizedError("Unauthorized access", err));
            }

            req["user"] = user;
            next()
        });
    }

    validateToken = async (token: string) => {
        if (!token) {
            return new BadRequestError("Invalid token provided");
        }

        try {
            const result = jwt.verify(token, process.env.JWT_SECRET as string);
            return responseMessage("Token is valid", StatusCodes.OK, { token: result });
        } catch (error) {
            logger.error("Token verification error:", error);
            return new UnauthorizedError("Unauthorized access", error);
        }

    }
}

export const TOKEN_TIMEOUT = "14400s";

export const tokenService = new TokenService();

export interface Credentials {
    id: number;
    email: string;
    name: string;
}
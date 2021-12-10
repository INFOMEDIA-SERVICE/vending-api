import jwt from "jsonwebtoken";
import moment from "moment";
import randToken from "rand-token";
import jwt_decode from "jwt-decode";
import { IUser } from "../modules/user/model";
import { NextFunction, Request, Response } from "express";
import { IToken } from "../interfaces/postgres_responses";
import { tokensRepository } from "../modules/token/repository";

class AuthController {
  public generateToken = async (user: IUser): Promise<IToken> => {
    const token = jwt.sign(
      {
        email: user.email,
        role: user.role,
        id: user.id,
      },
      process.env.TOKEN_KEY + "",
      {
        expiresIn: process.env.TOKEN_DURATION,
      }
    );

    const date = moment();
    const hours: number = +process.env.TOKEN_DURATION?.replace("h", "")!;
    const expireAt = moment(date).add(hours, "h").toDate();
    const refreshToken = randToken.uid(256);

    await tokensRepository.create(token, refreshToken);

    return {
      expireAt,
      refreshToken,
      token,
    };
  };

  public decodeToken = (token: string) => {
    return jwt_decode(token || "");
  };

  public validateUserToken = (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    // next();

    const token: string = req.headers.authorization + "";

    return jwt.verify(token, process.env.TOKEN_KEY + "", (err) => {
      if (err)
        return res.status(401).json({
          ok: false,
          message: err.message,
        });

      const user: IUser = jwt_decode(token);

      if (user.role !== 2)
        if (user.role !== 0)
          return res.status(401).json({
            ok: false,
            message: "insufficient privileges",
          });

      req.body.user = user;

      next();
    });
  };

  public validateAccess = (req: Request, res: Response, next: NextFunction) => {
    // next();

    const token: string = req.headers.authorization + "";

    return jwt.verify(token, process.env.TOKEN_KEY + "", (err) => {
      if (err)
        return res.status(401).json({
          ok: false,
          message: err.message,
        });

      const user: IUser = jwt_decode(token);

      req.body.user = user;

      next();
    });
  };

  public validateAdminToken = (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    // next();

    const token: string = req.headers.authorization + "";

    return jwt.verify(token, process.env.TOKEN_KEY + "", (err) => {
      if (err)
        return res.status(401).json({
          ok: false,
          message: err.message,
        });

      const user: IUser = jwt_decode(token);

      if (user.role !== 2)
        return res.status(401).json({
          ok: false,
          message: "insufficient privileges",
        });

      req.body.user = user;

      next();
    });
  };

  public validateSocketAccess = (token: string | undefined) => {
    return jwt.verify(token || "", process.env.TOKEN_KEY + "", (err) => {
      if (err)
        return {
          ok: false,
          message: err.message,
        };

      const user: IUser = jwt_decode(token || "");

      return {
        ok: true,
        user,
      };
    });
  };
}

export const authController: AuthController = new AuthController();

import { users } from "@prisma/client";
import passport, { PassportStatic } from "passport";
import passportLocal from "passport-local";
import bcrypt from "bcryptjs";
import passportJWT from "passport-jwt";
import { prisma } from "../models/prisma";

const jwtOptions = {
    jwtFromRequest: passportJWT.ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.SECRET,
};

async function passportService(passport: PassportStatic) {
    passport.use(
        new passportJWT.Strategy(jwtOptions, async (jwtPayload, done) => {
            try {
                const user: users | null = await prisma.users.findUnique({ where: { id: Number(jwtPayload.id) } });
                if (!user) {
                    return done(null, { message: "authentication not approved" });
                }
                return done(null, user, { message: "authenticated successfullly" });
            } catch (error) {
                return done(error, false, { message: "Error processing your info" });
            }
        }),
    );

    passport.use(
        new passportLocal.Strategy(async (username, password, done) => {
            try {
                const user: users | null = await prisma.users.findUnique({ where: { email: username } });
                if (!user) {
                    return done(null, false, { message: `${username} is not a registered account` });
                }
                const isMatch: boolean = await bcrypt.compare(password, user.password);
                if (isMatch) {
                    return done(null, user, { message: "authenticated successfullly" });
                }
                return done(null, false, { message: "Wrong Username/Password" });
            } catch (error) {
                return done(error, false, { message: "Error processing your info" });
            }
        }),
    );

    passport.serializeUser((user, done) => {
        const { id } = user as unknown as users;
        done(null, id);
    });

    passport.deserializeUser(async (id, done) => {
        try {
            const user = await prisma.users.findUnique({ where: { id: Number(id) } });
            return done(null, user);
        } catch (error) {
            return done(error, false);
        }
    });
}

export default passportService;

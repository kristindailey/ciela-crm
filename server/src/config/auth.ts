import passport from "passport";
import * as argon2 from "argon2";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy  as GitHubStrategy } from "passport-github2";
import { prisma } from "../lib/prisma.js";
import { User } from "@prisma/client";

passport.use(new GoogleStrategy({
	clientID: process.env.GOOGLE_CLIENT_ID!,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    callbackURL: process.env.GOOGLE_CALLBACK_URL!,
  },
  	async (_accessToken: string, _refreshToken: string, profile: any, done: any) => {
		try {
			let user: User | null = await prisma.user.findUnique({
				where: { googleId: profile.id },
			});

			if (!user) {
				const email = profile.emails?.[0]?.value || "";
				const existingUser = await prisma.user.findUnique({
					where: { email },
				});

				if (existingUser) {
					user = await prisma.user.update({
						where: { email }, 
						data: { googleId: profile.id },
					});
				} else {
					user = await prisma.user.create({
						data: {
							googleId: profile.id,
							email: email,
							name: profile.displayName || `${profile.name?.givenName || ""} ${profile.name?.familyName || ""}`.trim(),
							profilePicture: profile.photos?.[0]?.value || null,
						},
					});
				}
			}

			return done(null, user);
		} catch (error) {
			return done(error, null);
		}
  	}
));

passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID!,
    clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    callbackURL: process.env.GITHUB_CALLBACK_URL!,
  },
  	async (_accessToken: string, _refreshToken: string, profile: any, done: any) => {
		try {
			let user = await prisma.user.findUnique({
				where: { githubId: profile.id },
			});

			if (!user) {
				const email = profile.emails?.[0]?.value || "";
				const existingUser = await prisma.user.findUnique({
					where: { email },
				});

			if (existingUser) {
				user = await prisma.user.update({
					where: { email },
					data: { githubId: profile.id },
				});
			} else {
				user = await prisma.user.create({
					data: {
						githubId: profile.id,
						email: email, 
						name: profile.displayName || profile.username || "",
						profilePicture: profile.photos?.[0]?.value || null,
					},
				});
			}
		}

			return done(null, user);
		} catch (error) {
			return done(error, null);
		}
  	}
));

passport.use(new LocalStrategy({
    usernameField: "email",
  },
  	async (email: string, password: string, done: any) => {
		try {
			const user = await prisma.user.findUnique({
				where: { email: email.toLowerCase() }
			});

			if (!user) {
				return done(null, false, { message: "No account found with this email address." });
			}

			if (!user.password) {
				return done(null, false, { message: "Your account is registered using a sign-in provider. Please sign in using a provider." })
			}

			const isValidPassword = await argon2.verify(user.password, password);

			if (!isValidPassword) {
				return done(null, false, { message: "Invalid password." });
			}

			return done(null, user);
		} catch (error) {
			return done(error, null);
		}
  	}
));

passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id: string, done) => {
	try {
		const user = await prisma.user.findUnique({
			where: { id },
		});
		done(null, user);
	} catch (error) {
		done(error, null);
	}
});
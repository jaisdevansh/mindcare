import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as GitHubStrategy } from 'passport-github2';
import { User } from '../modules/users/user.model';
import { env } from './env';

passport.use(
    new GoogleStrategy(
        {
            clientID: env.googleClientId,
            clientSecret: env.googleClientSecret,
            callbackURL: `${env.apiUrl}/auth/google/callback`,
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                let user = await User.findOne({
                    $or: [{ googleId: profile.id }, { email: profile.emails?.[0].value }]
                });

                if (user) {
                    if (!user.googleId) {
                        user.googleId = profile.id;
                        user.isVerified = true; // OAuth emails are verified
                        await user.save();
                    }
                    return done(null, user);
                }

                user = await User.create({
                    name: profile.displayName,
                    email: profile.emails?.[0].value,
                    googleId: profile.id,
                    profileImage: profile.photos?.[0].value,
                    isVerified: true,
                });

                done(null, user);
            } catch (error) {
                done(error, undefined);
            }
        }
    )
);

passport.use(
    new GitHubStrategy(
        {
            clientID: env.githubClientId,
            clientSecret: env.githubClientSecret,
            callbackURL: `${env.apiUrl}/auth/github/callback`,
        },
        async (accessToken: string, refreshToken: string, profile: any, done: any) => {
            try {
                let user = await User.findOne({
                    $or: [{ githubId: profile.id }, { email: profile.emails?.[0].value }]
                });

                if (user) {
                    if (!user.githubId) {
                        user.githubId = profile.id;
                        user.isVerified = true;
                        await user.save();
                    }
                    return done(null, user);
                }

                user = await User.create({
                    name: profile.displayName || profile.username,
                    email: profile.emails?.[0].value,
                    githubId: profile.id,
                    profileImage: profile.photos?.[0].value,
                    isVerified: true,
                });

                done(null, user);
            } catch (error) {
                done(error, undefined);
            }
        }
    )
);

passport.serializeUser((user: any, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (error) {
        done(error, null);
    }
});

export default passport;

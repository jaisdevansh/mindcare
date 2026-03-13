import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as GitHubStrategy } from 'passport-github2';
import { User } from '../modules/users/user.model';
import { env } from './env';
import axios from 'axios';

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
            scope: ['user:email'], // Ensure we request email scope
        },
        async (accessToken: string, refreshToken: string, profile: any, done: any) => {
            try {
                let email = profile.emails?.[0]?.value;

                // Fallback: If email is not in profile, fetch it from GitHub API
                if (!email) {
                    try {
                        const emailResponse = await axios.get('https://api.github.com/user/emails', {
                            headers: { 
                                Authorization: `Bearer ${accessToken}`,
                                'User-Agent': 'MindCare-Backend'
                            },
                        });
                        const emails = emailResponse.data;
                        if (Array.isArray(emails)) {
                            const primaryEmail = emails.find((e: any) => e.primary) || emails[0];
                            email = primaryEmail?.email;
                        }
                    } catch (e) {
                        console.error('Failed to fetch emails from GitHub:', e);
                    }
                }

                if (!email) {
                    console.error('No email provided by GitHub for profile:', profile.id);
                    return done(null, false, { message: 'GitHub did not provide an email.' });
                }

                let user = await User.findOne({
                    $or: [{ githubId: profile.id }, { email }]
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
                    email: email,
                    githubId: profile.id,
                    profileImage: profile.photos?.[0]?.value || '',
                    role: 'user', // Enforce default role
                    isVerified: true,
                });

                done(null, user);
            } catch (error) {
                console.error('GitHub Auth Error:', error);
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

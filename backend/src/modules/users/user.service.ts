import { User } from './user.model';
import bcrypt from 'bcrypt';

export const getUserById = async (userId: string) => {
    return await User.findById(userId).select('-password');
};

export const updateProfile = async (userId: string, updateData: any) => {
    const allowedFields = [
        'name',
        'bio',
        'gender',
        'dateOfBirth',
        'location',
        'phoneNumber',
        'preferredLanguage',
        'anonymousMode'
    ];

    const filteredUpdate: any = {};
    Object.keys(updateData).forEach(key => {
        if (allowedFields.includes(key)) {
            filteredUpdate[key] = updateData[key];
        }
    });

    return await User.findByIdAndUpdate(
        userId,
        { $set: filteredUpdate },
        { new: true, runValidators: true }
    ).select('-password');
};

export const updateProfileImage = async (userId: string, imagePath: string) => {
    return await User.findByIdAndUpdate(
        userId,
        { $set: { profileImage: imagePath } },
        { new: true }
    ).select('-password');
};

export const changePassword = async (userId: string, oldPass: string, newPass: string) => {
    const user = await User.findById(userId);
    if (!user || !user.password) {
        throw new Error('User not found or password not set');
    }

    const isMatch = await bcrypt.compare(oldPass, user.password);
    if (!isMatch) {
        throw new Error('Invalid old password');
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPass, salt);
    await user.save();
    return true;
};

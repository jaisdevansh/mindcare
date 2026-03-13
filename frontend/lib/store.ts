import { create } from 'zustand';

export type Role = 'user' | 'helper' | 'admin';

interface AppState {
    user: {
        id?: string;
        name: string;
        email: string;
        role: Role;
        avatar: string;
        profileImage?: string;
        bio?: string;
        gender?: string;
        dateOfBirth?: string | Date;
        location?: string;
        phoneNumber?: string;
        preferredLanguage?: string;
        anonymousMode?: boolean;
        createdAt?: string | Date;
        updatedAt?: string | Date;
        helperStats?: { sessions: number; rating: number; hours: number; earnings: number };
    };
    viewingRole: Role;
    setRole: (role: Role) => void;
    setViewingRole: (role: Role) => void;
    setUser: (user: any) => void;
    logout: () => void;
    // Generic dashboard mock stats
    riskScore: number;
    setRiskScore: (score: number) => void;
}

const DEFAULT_USER = {
    name: 'Guest',
    email: 'guest@example.com',
    role: 'user' as Role,
    avatar: '/images/avatar.png',
};

export const useAppStore = create<AppState>((set) => ({
    user: DEFAULT_USER,
    viewingRole: 'user',
    setRole: (role) => set((state) => ({ user: { ...state.user, role } })),
    setViewingRole: (role) => set({ viewingRole: role }),
    setUser: (user) => set({ user, viewingRole: user.role }),
    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        set({ user: DEFAULT_USER, viewingRole: 'user' });
    },
    riskScore: 24,
    setRiskScore: (score) => set({ riskScore: score }),
}));

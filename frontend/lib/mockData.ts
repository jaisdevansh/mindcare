export const mockHelpers = [
    {
        id: 'h1',
        name: 'Sarah Jenkins',
        verified: true,
        rating: 4.9,
        sessions: 142,
        available: true,
        avatar: 'https://i.pravatar.cc/150?u=sarah',
        bio: 'Experienced listener focused on career anxiety and relationship stress.',
    },
    {
        id: 'h2',
        name: 'David Chen',
        verified: true,
        rating: 4.8,
        sessions: 89,
        available: false,
        avatar: 'https://i.pravatar.cc/150?u=david',
        bio: 'Great at helping through grief and complex emotional situations.',
    },
    {
        id: 'h3',
        name: 'Elena Rodriguez',
        verified: true,
        rating: 5.0,
        sessions: 210,
        available: true,
        avatar: 'https://i.pravatar.cc/150?u=elena',
        bio: 'Specialized in student life, academic pressure, and burnout.',
    },
];

export const mockMoodHistory = [
    { day: 'Mon', score: 6 },
    { day: 'Tue', score: 7 },
    { day: 'Wed', score: 5 },
    { day: 'Thu', score: 8 },
    { day: 'Fri', score: 7 },
    { day: 'Sat', score: 9 },
    { day: 'Sun', score: 8 },
];

export const mockAssessments = [
    { id: 'a1', date: '2023-10-01', score: 12, risk: 'Low', notes: 'Feeling a bit tired but okay.' },
    { id: 'a2', date: '2023-10-05', score: 15, risk: 'Medium', notes: 'Work has been stressful lately.' },
    { id: 'a3', date: '2023-10-10', score: 8, risk: 'Low', notes: 'Much better after the weekend.' },
];

export const mockCommunityPosts = [
    {
        id: 'p1',
        anonymousId: 'Anon-12A',
        moodTag: 'Anxious',
        message: 'Does anyone else feel like they are constantly behind on everything in life?',
        likes: 24,
        replies: [
            { id: 'r1', anonymousId: 'Anon-84B', message: 'Yes! You are definitely not alone.' }
        ]
    },
    {
        id: 'p2',
        anonymousId: 'Anon-33C',
        moodTag: 'Hopeful',
        message: 'I finally managed to go for a run today after weeks of feeling stuck in bed. Small wins!',
        likes: 156,
        replies: [
            { id: 'r2', anonymousId: 'Anon-99D', message: 'So proud of you! Keep it up!' }
        ]
    },
];

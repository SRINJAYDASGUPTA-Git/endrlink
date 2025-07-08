export interface ShortUrlResponse {
    slug: string;
    originalUrl: string;
    createdAt: string;
    userId: string;
    id: string;
    clicks: number;
}

export interface UserResponse {
    id: string;
    name: string;
    email: string;
    imageUrl: string;
    accountLocked: boolean;
    enabled: boolean;
    roles: string[];
    shortUrls: ShortUrlResponse[];
}

export interface Session{
    user:{
        name: string;
        email: string;
        image: string
    };
    expires: string;
}
export interface CommentUser {
    id: number;
    name: string;
    avatar?: string;
}

export interface Comment {
    id: number;
    content: string;
    rating: number;
    service_id: number;
    user: CommentUser;
    created_at: string;
    created_at_ts: number;
    likes_count: number;
    is_liked: boolean;
}

export interface CommentsResponse {
    service_id: number;
    average_rating: number;
    total_reviews: number;
    stars: {
        '1': number;
        '2': number;
        '3': number;
        '4': number;
        '5': number;
    };
    items: Comment[];
}

export interface CreateCommentPayload {
    service_id: number;
    content: string;
    rating: number;
}

export interface LikeCommentResponse {
    message: string;
    likes_count: number;
}

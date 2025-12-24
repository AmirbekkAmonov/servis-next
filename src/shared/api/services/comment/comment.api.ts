import { API } from '@/shared/api';
import type { CommentsResponse, CreateCommentPayload } from './comment.types';

export const createComment = async (
    payload: CreateCommentPayload
): Promise<{ accept: boolean; message: string }> => {
    const response = await API.post<{ accept: boolean; message: string }>(
        '/comment/create',
        payload
    );
    return response.data;
};

export const getComments = async (
    serviceId: number
): Promise<{ accept: boolean; data: CommentsResponse }> => {
    const response = await API.get<{ accept: boolean; data: CommentsResponse }>(
        `/comment/view?service_id=${serviceId}`
    );
    return response.data;
};

export const likeComment = async (
    commentId: number
): Promise<{ message: string; likes_count: number }> => {
    const response = await API.post<{ message: string; likes_count: number }>(
        `/comment/${commentId}/like`
    );
    return response.data;
};

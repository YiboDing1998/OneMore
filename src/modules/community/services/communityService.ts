import { apiClient } from '@/src/data/api/client';
import { ApiResponse } from '@/src/core/types';

export interface SocialComment {
  id: string;
  userId: string;
  authorName: string;
  text: string;
  createdAt: string;
}

export interface SocialPost {
  id: string;
  userId: string;
  authorName: string;
  authorAvatar: string;
  content: string;
  image?: string | null;
  createdAt: string;
  comments: SocialComment[];
  commentsCount: number;
  likeCount: number;
  likedByMe: boolean;
}

export interface CommentsPage {
  comments: SocialComment[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    hasMore: boolean;
  };
}

export async function getPosts() {
  const response = await apiClient.get<ApiResponse<{ posts: SocialPost[] }>>(
    '/social/posts'
  );
  if (!response.success || !response.data) {
    throw new Error('Failed to load posts');
  }
  return response.data.posts;
}

export async function createPost(content: string, image?: string) {
  const response = await apiClient.post<ApiResponse<{ post: SocialPost }>>(
    '/social/posts',
    { content, image }
  );
  if (!response.success || !response.data) {
    throw new Error('Failed to create post');
  }
  return response.data.post;
}

export async function toggleLike(postId: string) {
  const response = await apiClient.post<ApiResponse<{ post: SocialPost }>>(
    `/social/posts/${postId}/like`,
    {}
  );
  if (!response.success || !response.data) {
    throw new Error('Failed to update like');
  }
  return response.data.post;
}

export async function getComments(postId: string, page = 1, pageSize = 5) {
  const response = await apiClient.get<ApiResponse<CommentsPage>>(
    `/social/posts/${postId}/comments`,
    { page, pageSize }
  );
  if (!response.success || !response.data) {
    throw new Error('Failed to load comments');
  }
  return response.data;
}

export async function addComment(postId: string, text: string) {
  const response = await apiClient.post<ApiResponse<{ post: SocialPost }>>(
    `/social/posts/${postId}/comments`,
    { text }
  );
  if (!response.success || !response.data) {
    throw new Error('Failed to add comment');
  }
  return response.data.post;
}

export async function deleteComment(postId: string, commentId: string) {
  const response = await apiClient.delete<ApiResponse<{ deleted: boolean; post: SocialPost }>>(
    `/social/posts/${postId}/comments/${commentId}`
  );
  if (!response.success || !response.data) {
    throw new Error('Failed to delete comment');
  }
  return response.data.post;
}

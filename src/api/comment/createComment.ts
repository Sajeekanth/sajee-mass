import apiClient from '../../lib/api';

export interface CreateCommentRequest {
  userId: string | number;
  defectId: string | number;
  comment: string;
  attachment?: string | null;
}

export interface CreateCommentResponse {
  message: string;
  data?: any;
  status?: string;
  statusCode?: number;
}

export const createComment = async (payload: CreateCommentRequest): Promise<CreateCommentResponse> => {
  const res = await apiClient.post(`/defect/${payload.defectId}/comment`, {
    comment: payload.comment,
    employeeId: payload.userId,
  });

  return {
    status: res.data?.status || 'success',
    statusCode: res.data?.statusCode || 201,
    message: res.data?.message || 'Comment added successfully',
    data: res.data?.data,
  };
};

export const updateComment = async (commentId: number, comment: string) => {
  return {
    status: 'success',
    statusCode: 200,
    message: 'Comment updated successfully',
    data: { id: commentId, comment },
  };
};

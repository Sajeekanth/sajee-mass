import apiClient from '../../lib/api';

interface Comment {
  id: number;
  comment: string;
  userId: number | string;
  defectId: number | string;
  attachment?: string | null;
  createdAt: string;
}

export interface GetCommentsResponse {
  message: string;
  data: Comment[];
  status?: string;
  statusCode?: number;
}

export const getCommentsByDefectId = async (defectId: number | string): Promise<GetCommentsResponse> => {
  const response = await apiClient.get(`/defect/${defectId}/comment`);
  const list = Array.isArray(response.data?.data) ? response.data.data : [];

  return {
    status: response.data?.status || 'success',
    statusCode: response.data?.statusCode || 200,
    message: response.data?.message || 'Comments fetched successfully',
    data: list.map((c: any) => ({
      id: c.id,
      comment: c.comment,
      userId: c.employeeId || c.userId || 0,
      defectId: c.defectId || defectId,
      attachment: null,
      createdAt: c.createdAt || new Date().toISOString(),
    })),
  };
};

import apiClient from "../../lib/api";

export const deleteDefectById = async (id: string | number) => {
  const response = await apiClient.delete(`/api/v1/defect/${id}`);
  return {
    status: response.data?.status || 'success',
    statusCode: response.data?.statusCode || 200,
    message: response.data?.message || 'Defect deleted successfully',
  };
};

export const deleteDefect = deleteDefectById;
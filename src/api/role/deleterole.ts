import apiClient from "../../lib/api";

export const deleterole = async (id: number) => {
  const response = await apiClient.delete(`/api/v1/role/${id}`);
  return response.data;
};

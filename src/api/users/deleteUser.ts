import apiClient from "../../lib/api";
import { ENDPOINTS } from "../../utils/apiendpoint";

export async function deleteUser(id: number | string) {
  const response = await apiClient.delete(ENDPOINTS.employeeById(Number(id)));
  const resData = response.data;
  return {
    status: resData?.status || "success",
    statusCode: resData?.statusCode || 200,
    message: resData?.message || "Employee deleted successfully",
    statusMessage: resData?.message || "Employee deleted successfully",
    data: resData?.data,
  };
}
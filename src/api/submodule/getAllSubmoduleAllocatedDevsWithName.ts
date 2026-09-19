import apiClient from "../../lib/api";
import { ENDPOINTS } from "../../utils/apiendpoint";

export interface SubDevWithName {
  id: number;
  employeeId: number;
  submoduleId: number;
  employeeName?: string;
}

export interface SubDevWithNameResponse {
  status: number;
  statusCode: string;
  statusMessage: string;
  data: SubDevWithName[];
}

export const getAllSubDevwithName = async (
  submoduleId: number
): Promise<SubDevWithNameResponse> => {
  const response = await apiClient.get(ENDPOINTS.subModuleDev(Number(submoduleId)));
  const list = Array.isArray(response.data?.data) ? response.data.data : [];
  return {
    status: 200,
    statusCode: '200',
    statusMessage: response.data?.message || 'Success',
    data: list.map((u: any) => ({
      id: u.allocationId || u.employeeId,
      employeeId: u.employeeId,
      submoduleId: Number(submoduleId),
      employeeName: u.employeeName,
    })),
  };
};

export default getAllSubDevwithName;
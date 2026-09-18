import apiClient from "../../lib/api";
import { ENDPOINTS } from "../../utils/apiendpoint";

export interface UpdateUserPayload {
  id?: number | string;
  userId?: number | string;
  firstName: string;
  lastName: string;
  email?: string;
  contactNo?: string;
  phone?: string;
  whatsappNumber?: string;
  joinDate?: string;
  joinedDate?: string;
  gender?: string;
  userGender?: string;
  designationId?: number | string;
  roleId?: number | string;
  isActive?: boolean | string | number;
  password?: string;
}

export async function updateUser(
  id: number | string,
  userData: UpdateUserPayload | any
) {
  const rawContact =
    userData.contactNo || userData.phone || userData.whatsappNumber || null;
  const rawGender = userData.gender || userData.userGender || null;
  const rawJoinDate = userData.joinDate || userData.joinedDate || null;

  let isActiveBool: boolean | undefined = undefined;
  if (userData.isActive !== undefined) {
    isActiveBool =
      userData.isActive === true ||
      userData.isActive === "active" ||
      userData.isActive === 1;
  }

  const payload = {
    firstName: userData.firstName?.trim() || "",
    lastName: userData.lastName?.trim() || "",
    email: userData.email?.trim() || null,
    contactNo: rawContact,
    phone: rawContact,
    whatsappNumber: rawContact,
    gender: rawGender,
    userGender: rawGender,
    designationId: userData.designationId ? Number(userData.designationId) : null,
    roleId: userData.roleId ? Number(userData.roleId) : null,
    joinDate: rawJoinDate ? rawJoinDate.split("T")[0] : null,
    isActive: isActiveBool,
    password: userData.password || null,
  };

  const response = await apiClient.put(
    ENDPOINTS.employeeById(Number(id)),
    payload
  );
  const resData = response.data;
  return {
    status: resData?.status || "success",
    statusCode: resData?.statusCode || 200,
    message: resData?.message || "Employee updated successfully",
    statusMessage: resData?.message || "Employee updated successfully",
    data: resData?.data,
  };
}

export async function updateUserStatus(
  id: number | string,
  status: boolean | number | string
) {
  const isActive =
    status === true || status === 1 || status === "active" || status === "ACTIVE";
  const payload = {
    isActive,
    status: isActive ? "ACTIVE" : "INACTIVE",
  };

  const response = await apiClient.put(
    ENDPOINTS.employeeStatus(Number(id)),
    payload
  );
  const resData = response.data;
  return {
    status: resData?.status || "success",
    statusCode: resData?.statusCode || 200,
    message: resData?.message || "Status updated successfully",
    statusMessage: resData?.message || "Status updated successfully",
    data: resData?.data,
  };
}

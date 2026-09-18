import apiClient from "../../lib/api";
import { ENDPOINTS } from "../../utils/apiendpoint";

export interface CreateUserPayload {
  firstName: string;
  lastName: string;
  email: string;
  contactNo?: string;
  phone?: string;
  whatsappNumber?: string;
  gender?: string;
  userGender?: string;
  designationId?: number | string;
  roleId?: number | string;
  joinDate?: string;
  joinedDate?: string;
  isActive?: boolean | string | number;
  password?: string;
  skills?: string[] | string;
  experience?: number;
  availability?: number;
}

export async function createUser(userData: CreateUserPayload | any) {
  const rawContact =
    userData.contactNo || userData.phone || userData.whatsappNumber || null;
  const rawGender = userData.gender || userData.userGender || null;
  const rawJoinDate = userData.joinDate || userData.joinedDate || null;

  let isActiveBool = true;
  if (userData.isActive !== undefined) {
    isActiveBool =
      userData.isActive === true ||
      userData.isActive === "active" ||
      userData.isActive === 1;
  }

  const payload = {
    firstName: userData.firstName?.trim() || "",
    lastName: userData.lastName?.trim() || "",
    email: userData.email?.trim() || "",
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
    skills: Array.isArray(userData.skills)
      ? userData.skills
      : typeof userData.skills === "string"
      ? userData.skills.split(",").map((s: string) => s.trim()).filter(Boolean)
      : [],
    experience:
      typeof userData.experience === "number" ? userData.experience : 0,
    availability:
      typeof userData.availability === "number" ? userData.availability : 100,
  };

  const response = await apiClient.post(ENDPOINTS.employee, payload);
  const resData = response.data;
  return {
    status: resData?.status || "success",
    statusCode: resData?.statusCode || 201,
    message: resData?.message || "Employee created successfully",
    statusMessage: resData?.message || "Employee created successfully",
    data: resData?.data,
  };
}
import apiClient from "../../lib/api";
import { ENDPOINTS } from "../../utils/apiendpoint";

export interface SimpleUser {
  id: number;
  userId: string;
  employeeCode?: string;
  firstName: string;
  lastName: string;
  email?: string;
  contactNo?: string;
  phone?: string;
  whatsappNumber?: string;
  gender?: string;
  userGender?: string;
  designationId?: number;
  designationName?: string;
  roleId?: number;
  roleName?: string;
  name?: string;
  joinDate?: string;
  joinedDate?: string;
  isActive?: boolean;
  userStatus?: string;
  skills?: string[];
  experience?: number;
  availability?: number;
  currentProjects?: string[];
}

export interface EmployeeQueryParams {
  page?: number;
  size?: number;
  sort?: string;
  direction?: string;
  search?: string;
  keyword?: string;
  gender?: string;
  status?: string;
  designationId?: number;
  designation?: string | number;
}

export interface PagedEmployeeResponse {
  status: string;
  statusCode: number;
  message?: string;
  data: {
    content: SimpleUser[];
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
    first?: boolean;
    last?: boolean;
    empty?: boolean;
  };
}

export function mapEmployeeToSimpleUser(u: any): SimpleUser {
  const contact = u.contactNo || u.phone || u.whatsappNumber || "";
  const join = u.joinDate || u.joinedDate || "";
  const gender = u.gender || u.userGender || "Male";
  const desName = u.designationName || u.name || "";
  const active =
    u.isActive !== undefined
      ? u.isActive === true || u.isActive === "active" || u.isActive === 1
      : u.userStatus === "ACTIVE";
  const fullName =
    u.firstName && u.lastName
      ? `${u.firstName} ${u.lastName}`.trim()
      : u.name || desName;

  return {
    id: u.id,
    userId: u.employeeCode || u.userId || String(u.id),
    employeeCode: u.employeeCode,
    firstName: u.firstName || "",
    lastName: u.lastName || "",
    email: u.email || "",
    contactNo: contact,
    phone: contact,
    whatsappNumber: contact,
    gender: gender,
    userGender: gender,
    designationId: u.designationId ? Number(u.designationId) : undefined,
    designationName: desName,
    roleId: u.roleId ? Number(u.roleId) : undefined,
    roleName: u.roleName || undefined,
    name: fullName,
    joinDate: join,
    joinedDate: join,
    isActive: active,
    userStatus: u.userStatus || (active ? "ACTIVE" : "INACTIVE"),
    skills: Array.isArray(u.skills) ? u.skills : [],
    experience: typeof u.experience === "number" ? u.experience : 0,
    availability: typeof u.availability === "number" ? u.availability : 100,
    currentProjects: Array.isArray(u.currentProjects) ? u.currentProjects : [],
  };
}

export async function getAllUsers(
  page: number = 0,
  size: number = 10,
  queryParams?: EmployeeQueryParams
): Promise<PagedEmployeeResponse> {
  const params: Record<string, any> = {
    page,
    size,
    sort: queryParams?.sort || "id",
    direction: queryParams?.direction || "ASC",
  };

  const searchVal = queryParams?.search || queryParams?.keyword;
  if (searchVal) params.search = searchVal;

  if (queryParams?.gender) params.gender = queryParams.gender;
  if (queryParams?.status) params.status = queryParams.status;

  const desId =
    queryParams?.designationId ||
    (typeof queryParams?.designation === "number"
      ? queryParams.designation
      : undefined);
  if (desId) params.designationId = desId;

  const response = await apiClient.get(ENDPOINTS.employee, { params });
  const envelope = response.data;
  const paged = envelope?.data || {};
  const content = Array.isArray(paged.content)
    ? paged.content.map(mapEmployeeToSimpleUser)
    : [];

  return {
    status: envelope?.status || "success",
    statusCode: envelope?.statusCode || 200,
    message: envelope?.message,
    data: {
      content,
      totalElements: paged.totalElements ?? content.length,
      totalPages: paged.totalPages ?? Math.ceil(content.length / size),
      size: paged.size ?? size,
      number: paged.number ?? page,
      first: paged.first,
      last: paged.last,
      empty: paged.empty,
    },
  };
}

export async function getAllUsersSimple(queryParams?: EmployeeQueryParams) {
  const paged = await getAllUsers(0, 1000, queryParams);
  return {
    status: paged.status,
    statusCode: paged.statusCode,
    message: paged.message,
    data: paged.data.content,
  };
}

export async function getEmployeeById(id: number | string) {
  const response = await apiClient.get(ENDPOINTS.employeeById(Number(id)));
  const envelope = response.data;
  return {
    status: envelope.status || "success",
    statusCode: envelope.statusCode || 200,
    message: envelope.message,
    data: mapEmployeeToSimpleUser(envelope.data),
  };
}

export async function getUsersByDesignationId(
  designationId: number
): Promise<{ status: string; data: SimpleUser[] }> {
  const paged = await getAllUsers(0, 1000, { designationId });
  return {
    status: paged.status,
    data: paged.data.content,
  };
}

export default getAllUsers;

import { getAllUsers, SimpleUser } from "./getallusers";

export interface UserFilter {
  id: number;
  userId?: string;
  firstName: string;
  lastName: string;
  email: string;
  userGender?: string;
  status?: string;
  designationId?: number;
  designationName?: string;
}

export async function getUsersByFilter(
  gender?: string,
  status?: string,
  designationId?: number,
  page: number = 1,
  size: number = 10
): Promise<SimpleUser[]> {
  const zeroIndexedPage = Math.max(0, page - 1);
  const result = await getAllUsers(zeroIndexedPage, size, {
    gender,
    status,
    designationId,
  });
  return result.data.content;
}

export const filterUsers = getUsersByFilter;

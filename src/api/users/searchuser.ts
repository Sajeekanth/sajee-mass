import { getAllUsers, SimpleUser } from "./getallusers";

export interface SearchUserData {
  id: number;
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  userStatus: string;
  userGender: string;
  designationName: string;
}

export async function searchUsers(searchTerm: string): Promise<SimpleUser[]> {
  const result = await getAllUsers(0, 100, { search: searchTerm });
  return result.data.content;
}

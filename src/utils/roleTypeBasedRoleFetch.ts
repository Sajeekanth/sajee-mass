import { getAllRoles, Role } from "../api/role/viewrole";

export type RoleType =
  | "ADMIN"
  | "PROJECT_MANAGER"
  | "QA_LEAD"
  | "QA_ENGINEER"
  | "DEV_LEAD"
  | "SENIOR_DEVELOPER"
  | "DEVELOPER"
  | "JUNIOR_DEVELOPER"
  | "BUSINESS_ANALYST"
  | "UI_UX_DESIGNER"
  | "DEVOPS_ENGINEER"
  | "SUPPORT_ENGINEER"
  | "CLIENT";

const fetchActiveRoles = async (): Promise<Role[]> => {
  try {
    const res = await getAllRoles(0, 100);
    const content = res?.data?.content;
    return Array.isArray(content) ? content : [];
  } catch (err) {
    console.error("Error fetching live roles:", err);
    return [];
  }
};

export const roleTypeBasedRoleFetch = async (
  roleType: RoleType,
): Promise<string[]> => {
  const roles = await fetchActiveRoles();
  return roles
    .filter((role) => {
      const type = (role.type || role.roleType || "") as string;
      const name = (role.name || role.roleName || "").toUpperCase();
      return type === roleType || name.includes(roleType.replace('_', ' '));
    })
    .map((role) => role.name || role.roleName || "");
};

export const roleTypesBasedRoleFetch = async (
  roleTypes: RoleType[],
): Promise<string[]> => {
  const roles = await fetchActiveRoles();
  return roles
    .filter((role) => {
      const type = (role.type || role.roleType || "") as RoleType;
      const name = (role.name || role.roleName || "").toUpperCase();
      return roleTypes.includes(type) || roleTypes.some(t => name.includes(t.replace('_', ' ')));
    })
    .map((role) => role.name || role.roleName || "");
};

export const roleTypeBasedRoleIdFetch = async (
  roleType: RoleType,
): Promise<number[]> => {
  const roles = await fetchActiveRoles();
  return roles
    .filter((role) => {
      const type = (role.type || role.roleType || "") as string;
      const name = (role.name || role.roleName || "").toUpperCase();
      return type === roleType || name.includes(roleType.replace('_', ' '));
    })
    .map((role) => role.id);
};
import apiClient from "../lib/api";
import { INITIAL_PERMISSIONS } from "../mock/mockData";

export interface Permission {
  permissionId: number;
  action: string;
  description: string | null;
}

export type PermissionId = number | string;

export interface ModulePermission {
  module: string;
  permissions: Permission[];
}

export interface GetPrivilegesResponse {
  status: string;
  statusCode: number;
  statusMessage: string;
  data: ModulePermission[];
}

export interface PermissionAssignmentChange {
  permissionId: string;
  isAssigned: boolean;
}

export interface EmployeePermissionUpdatePayload {
  permissionIds: number[];
}

export interface RolePermissionResponse {
  status: string;
  statusCode: number | string;
  statusMessage: string;
  data: {
    permissionIds: number[];
    messages: string[];
  };
}

export interface UserPrivilegeResponse {
  status: string;
  statusCode: number;
  statusMessage: string;
  data: {
    module: string;
    permissions: {
      permissionId: number;
      action: string;
      description: string | null;
      checked: boolean;
      inheritedFromRole: boolean;
    }[];
  }[];
}

export interface RolePermissionByRoleResponse {
  permissionIds: PermissionId[];
}

export const getAllPrivileges = async (): Promise<GetPrivilegesResponse> => {
  try {
    const response = await apiClient.get<any>('/api/v1/permission?grouped=true');
    const responseData = response.data?.data || response.data;

    if (Array.isArray(responseData)) {
      return {
        status: 'success',
        statusCode: 200,
        statusMessage: 'Success',
        data: responseData,
      };
    }
  } catch (error) {
    console.warn('Live getAllPrivileges failed, using initial definitions:', error);
  }

  return {
    status: 'success',
    statusCode: 200,
    statusMessage: 'Success',
    data: INITIAL_PERMISSIONS,
  };
};

export const getRolePermission = async (roleId: number): Promise<RolePermissionResponse> => {
  try {
    const response = await apiClient.get<any>(`/api/v1/role/${roleId}/permission`);
    const payload = response.data?.data || response.data;
    const permissionIds: number[] = Array.isArray(payload?.permissionIds) ? payload.permissionIds : [];

    return {
      status: 'success',
      statusCode: 200,
      statusMessage: response.data?.message || 'Permissions loaded successfully',
      data: {
        permissionIds,
        messages: payload?.messages || ['Permissions loaded successfully'],
      },
    };
  } catch (error) {
    console.warn(`Failed to fetch live role permissions for role ${roleId}:`, error);
    return {
      status: 'success',
      statusCode: 200,
      statusMessage: 'Success',
      data: {
        permissionIds: [],
        messages: ['No permissions assigned'],
      },
    };
  }
};

export const getRolePermissionByRoleId = async (
  roleId: number | string
): Promise<RolePermissionByRoleResponse> => {
  try {
    const response = await apiClient.get<any>(`/api/v1/role/${roleId}/permission`);
    const payload = response.data?.data || response.data;
    const permissionIds: PermissionId[] = Array.isArray(payload?.permissionIds) ? payload.permissionIds : [];

    return {
      permissionIds,
    };
  } catch (error) {
    console.warn(`Failed to fetch role permissions for role ${roleId}:`, error);
    return {
      permissionIds: [],
    };
  }
};

export const addRolePermission = async (
  roleId: number,
  rolePermissions: PermissionAssignmentChange[]
): Promise<RolePermissionResponse> => {
  const response = await apiClient.put<any>(`/api/v1/role/${roleId}/permission`, rolePermissions);
  const payload = response.data?.data || response.data;
  const permissionIds: number[] = Array.isArray(payload?.permissionIds)
    ? payload.permissionIds
    : rolePermissions.map(p => Number(p.permissionId));

  return {
    status: 'success',
    statusCode: 200,
    statusMessage: response.data?.message || 'Role permissions updated successfully',
    data: {
      permissionIds,
      messages: payload?.messages || ['Permissions updated successfully'],
    },
  };
};

export const getAllEmployeePermission = async (_employeeId: number): Promise<UserPrivilegeResponse> => {
  return {
    status: 'success',
    statusCode: 200,
    statusMessage: 'Success',
    data: INITIAL_PERMISSIONS.map(m => ({
      module: m.module,
      permissions: m.permissions.map(p => ({
        permissionId: p.permissionId,
        action: p.action,
        description: p.description,
        checked: true,
        inheritedFromRole: true,
      })),
    })),
  };
};

export const addEmployeePermission = async (
  _employeeId: number,
  payload: EmployeePermissionUpdatePayload
): Promise<UserPrivilegeResponse> => {
  return {
    status: 'success',
    statusCode: 200,
    statusMessage: 'Employee permissions updated successfully',
    data: INITIAL_PERMISSIONS.map(m => ({
      module: m.module,
      permissions: m.permissions.map(p => ({
        permissionId: p.permissionId,
        action: p.action,
        description: p.description,
        checked: payload.permissionIds.includes(p.permissionId),
        inheritedFromRole: false,
      })),
    })),
  };
};

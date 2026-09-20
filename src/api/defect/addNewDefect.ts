import apiClient from "../../lib/api";

export interface DefectCreate {
  description: string;
  steps: string;
  projectId: number;
  severityId: number;
  priorityId: number;
  defectStatusId: number;
  typeId: number;
  reOpenCount?: number;
  attachment?: string | null;
  assignbyId?: number | null;
  assigntoId?: number;
  modulesId: number;
  subModuleId?: number | null;
  releasesId?: number | null;
  testCaseRequired?: boolean;
}

export interface DefectCreateProps {
  message: string;
  data: any;
  status: string;
  statusCode: number;
}

export const addDefects = async (
  payload: DefectCreate | FormData
): Promise<DefectCreateProps> => {
  let defectData: any = {};
  if (payload instanceof FormData) {
    payload.forEach((val, key) => {
      defectData[key] = val;
    });
  } else {
    defectData = payload;
  }

  const body = {
    description: defectData.description || defectData.title || '',
    steps: defectData.steps || '',
    projectId: Number(defectData.projectId || 1),
    moduleId: Number(defectData.modulesId || defectData.moduleId || 1),
    subModuleId: defectData.subModuleId ? Number(defectData.subModuleId) : null,
    releaseId: defectData.releasesId || defectData.releaseId ? Number(defectData.releasesId || defectData.releaseId) : null,
    severityId: Number(defectData.severityId || 1),
    priorityId: Number(defectData.priorityId || 1),
    defectTypeId: Number(defectData.typeId || defectData.defectTypeId || 1),
    statusId: defectData.defectStatusId || defectData.statusId ? Number(defectData.defectStatusId || defectData.statusId) : null,
    assignedToId: defectData.assigntoId || defectData.assignedToId ? Number(defectData.assigntoId || defectData.assignedToId) : null,
    assignedById: defectData.assignbyId || defectData.assignedById ? Number(defectData.assignbyId || defectData.assignedById) : null,
    attachment: defectData.attachment || null,
  };

  const response = await apiClient.post("/api/v1/defect", body);
  const created = response.data?.data;

  return {
    status: response.data?.status || 'success',
    statusCode: response.data?.statusCode || 201,
    message: response.data?.message || 'Defect created successfully',
    data: [created],
  };
};

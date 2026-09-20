import apiClient from "../../lib/api";

export const updateDefectById = async (
  defectId: string | number,
  payload: FormData | any
) => {
  let defectData: any = {};
  if (payload instanceof FormData) {
    payload.forEach((val, key) => {
      defectData[key] = val;
    });
  } else {
    defectData = payload;
  }

  const body: Record<string, any> = {};
  if (defectData.description || defectData.title) {
    body.description = defectData.description || defectData.title;
  }
  if (defectData.steps) {
    body.steps = defectData.steps;
  }
  if (defectData.severityId) {
    body.severityId = Number(defectData.severityId);
  }
  if (defectData.priorityId) {
    body.priorityId = Number(defectData.priorityId);
  }
  if (defectData.typeId || defectData.defectTypeId) {
    body.defectTypeId = Number(defectData.typeId || defectData.defectTypeId);
  }
  if (defectData.status || defectData.defectStatusName) {
    body.status = defectData.status || defectData.defectStatusName;
  }
  if (defectData.assignedToId || defectData.assigntoId) {
    body.assignedToId = Number(defectData.assignedToId || defectData.assigntoId);
  }
  if (defectData.releaseId || defectData.releasesId) {
    body.releaseId = Number(defectData.releaseId || defectData.releasesId);
  }
  if (defectData.attachment) {
    body.attachment = defectData.attachment;
  }

  const response = await apiClient.put(`/api/v1/defect/${defectId}`, body);

  return {
    status: response.status || 200,
    data: {
      status: 'success',
      statusCode: 200,
      message: 'Defect updated successfully',
      data: response.data?.data,
    },
  };
};
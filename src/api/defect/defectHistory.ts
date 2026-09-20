import apiClient from "../../lib/api";

export interface DefectHistoryEntry {
  id: number;
  defectId: number;
  assignedByName: string;
  assignedToName: string;
  previousStatus: string;
  defectStatus: string;
  name: string;
  defectDate: string;
  defectTime: string;
  createdBy: string;
  updatedBy: string;
}

export async function getDefectHistoryByDefectId(
  defectId: string | number
): Promise<DefectHistoryEntry[]> {
  try {
    const res = await apiClient.get(`/defect/${defectId}/comment`);
    const comments = Array.isArray(res.data?.data) ? res.data.data : [];
    return comments.map((c: any, idx: number) => {
      const createdAt = c.createdAt || new Date().toISOString();
      return {
        id: c.id || idx + 1,
        defectId: Number(defectId),
        assignedByName: c.employeeName || 'System',
        assignedToName: c.employeeName || 'Assigned User',
        previousStatus: idx === 0 ? 'New' : 'Open',
        defectStatus: 'Updated',
        name: c.comment || 'Defect comment added',
        defectDate: createdAt.split('T')[0],
        defectTime: createdAt.split('T')[1]?.substring(0, 5) || '12:00',
        createdBy: c.employeeName || 'User',
        updatedBy: c.employeeName || 'User',
      };
    });
  } catch {
    return [];
  }
}

export const getDefectHistory = getDefectHistoryByDefectId;

import { Employee } from '../../types/index';
import { getBenchAvailability } from './bench';

export interface BenchSearchParams {
  startDate?: string;
  endDate?: string;
  designation?: string;
  firstName?: string;
  lastName?: string;
  availability?: number;
}

export const searchBenchEmployees = async (params: BenchSearchParams): Promise<Employee[]> => {
  const response = await getBenchAvailability(0, 1000, params);
  const benchData = Array.isArray(response.data?.content)
    ? response.data.content
    : Array.isArray(response.data)
    ? response.data
    : [];

  return benchData.map((u: any) => ({
    id: String(u.id || u.employeeId),
    firstName: u.firstName,
    lastName: u.lastName,
    gender: 'Male',
    email: u.email,
    phone: u.contactNo || u.phone || '',
    designation: u.designationName || u.designation || 'Software Engineer',
    experience: 2,
    joinedDate: '2023-01-01',
    skills: [],
    currentProjects: [],
    availability: u.availability ?? u.availabilityPercent ?? 100,
    status: 'active',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }));
};

export const searchByStartDate = async (startDate: string) => searchBenchEmployees({ startDate });
export const searchByDesignation = async (designation: string) => searchBenchEmployees({ designation });
export const searchByFirstName = async (firstName: string) => searchBenchEmployees({ firstName });
export const searchByAvailability = async (availability: number) => searchBenchEmployees({ availability });

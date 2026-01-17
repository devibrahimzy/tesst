import api from "@/lib/axios";
import { Project, ProjectMember, CreateProjectDTO, UpdateProjectDTO } from "./projects.types";

export const projectsService = {
    getAll: async (): Promise<Project[]> => {
        const response = await api.get<Project[]>("/projects");
        return response.data;
    },

    getMyProjects: async (): Promise<Project[]> => {
        const response = await api.get<Project[]>("/projects/my-projects");
        return response.data;
    },

    getById: async (id: string): Promise<Project> => {
        const response = await api.get<Project>(`/projects/${id}`);
        return response.data;
    },

    create: async (data: CreateProjectDTO): Promise<{ message: string; project: Project }> => {
        const response = await api.post<{ message: string; project: Project }>("/projects", data);
        return response.data;
    },

    update: async (id: string, data: UpdateProjectDTO): Promise<{ message: string; project: Project }> => {
        const response = await api.put<{ message: string; project: Project }>(`/projects/${id}`, data);
        return response.data;
    },

    delete: async (id: string): Promise<{ message: string }> => {
        const response = await api.delete<{ message: string }>(`/projects/${id}`);
        return response.data;
    },

    getMembers: async (id: string): Promise<ProjectMember[]> => {
        const response = await api.get<ProjectMember[]>(`/projects/${id}/members`);
        return response.data;
    },

    addMember: async (data: Omit<ProjectMember, 'id'>): Promise<ProjectMember> => {
        const response = await api.post<ProjectMember>("/projects/members", data);
        return response.data;
    },

    removeMember: async (projectId: string, userId: string): Promise<{ message: string }> => {
        const response = await api.delete<{ message: string }>(`/projects/${projectId}/members/${userId}`);
        return response.data;
    },
};

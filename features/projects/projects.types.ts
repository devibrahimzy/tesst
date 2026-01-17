export interface Project {
    id: string;
    name: string;
    description?: string;
    start_date?: string;
    end_date?: string;
    status: 'PLANNING' | 'ACTIVE' | 'COMPLETED';
    isActive: boolean;
    created_by: string;
}

export interface ProjectMember {
    id: string;
    project_id: string;
    user_id: string;
    role: 'SCRUM_MASTER' | 'TEAM_MEMBER';
}

export interface CreateProjectDTO {
    name: string;
    description?: string;
    start_date?: string;
    end_date?: string;
}

export interface UpdateProjectDTO {
    name?: string;
    description?: string;
    status?: string;
    isActive?: number;
}

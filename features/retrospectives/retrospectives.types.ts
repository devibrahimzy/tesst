export interface Retrospective {
    id: string;
    sprint_id: string;
    project_id: string;
    status: 'DRAFT' | 'PUBLISHED';
    created_at: string;
    items?: RetroItem[];
}

export interface RetroItem {
    id: string;
    retrospective_id: string;
    user_id: string;
    content: string;
    type: 'WELL' | 'BAD' | 'ACTION';
    votes: number;
    status: 'PENDING' | 'RESOLVED';
    created_at: string;
}

export interface CreateRetroDTO {
    sprint_id: string;
    project_id: string;
}

export interface CreateRetroItemDTO {
    retrospective_id: string;
    content: string;
    type: 'WELL' | 'BAD' | 'ACTION';
}

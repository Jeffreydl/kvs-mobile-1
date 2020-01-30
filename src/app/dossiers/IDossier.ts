export interface IDossier {
    assignedById: number;
    assigneeId: number;
    changeDate: string;
    closedById: number;
    comments: string[];
    messageCategoryId;
    typeId;
    createdBy: {
        blockedUntil: string;
        createdById: number;
        deletedAt: string;
        email: string;
        emailOptIn: boolean;
        employeeGroupId: number;
        id: number;
        invalidLoginAttempts: number;
        isExternal: boolean;
        isSystemUser: boolean;
        status: string;
        twoFactorEnabled: boolean;
        username: string;
    };
    createdById: boolean;
    customerExpectationDate: string;
    deletedAt: string;
    description: string;
    dossierCategory: {
        defaultAssigneeId: number;
        deletedAt: string;
        dueDate: string;
        id: number;
        isSystem: boolean
        name: string;
        sla: string;
    };
    dossierCategoryId: number;
    dossierType: {
        default: string;
        deletedAt: string;
        icon: string;
        id: number;
        name: string;
    };
    dossierTypeId: number;
    dueDate: string;
    emailSent: boolean;
    endDate: string;
    id: number;
    isDraft: boolean;
    relatieId: number;
    slaDate: string;
    startDate: string;
    state: string;
    subject: string;
}

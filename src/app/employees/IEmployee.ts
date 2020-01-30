export interface IEmployee {
    emailOptIn: boolean;
    status: string;
    isExternal: boolean;
    isSystemUser: boolean;
    twoFactorEnabled: boolean;
    twoFactorSecret?: null;
    invalidLoginAttempts: number;
    blockedUntil?: string;
    employeeGroupId: number;
    realm?: null;
    username: string;
    email: string;
    emailVerified?: boolean;
    id: number;
    deletedAt: string;
    createdById: number;
    profile: {
        firstname: string;
        lastname: string;
        middlename: string;
        position: string;
        employeeId: number;
        id: number;
        imageId?: number;
        deletedAt?: string;
        fullname: string;
    };
    roles: [
        {
            id: number;
            name: string;
            description: string;
            created: string;
            modified: string;
        }
    ];
    filterByNameAndEmail: string;
}

export interface IEmployeeCategory {
    showOnDashboard: boolean;
    canBeAssigned: boolean;
    id: number;
    employeeId: number;
    categoryId: number;
}

export interface IEmployeeByToken {
    user: IEmployee;
}

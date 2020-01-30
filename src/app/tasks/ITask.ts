export interface ITask {
    dossierId: number;
    inboundMessageId?: null;
    direction: string;
    state: string;
    subject: string;
    body: string;
    slaDateTime: string;
    customerExpectationDateTime: null;
    dueDate: string;
    createdDateTime: string;
    endDate: null;
    lockedById: number;
    lockedSince: string;
    messageChannelId: number;
    typeId: number;
    messageCategoryId: number;
    assigneeId: number;
    assignedById: number;
    createdById: number;
    closedById: number;
    kbaseAnsId: number;
    isDraft: boolean;
    isEmailSent: boolean;
    numberOfAttachments: number;
    externalMessageId: string;
    id: number;
    deletedAt: string;
    senderId: number;
    relatieId: number;
    messageDeleteReasonId: number;
    contactReasonId: number;
    type: {
        name: string;
        default: boolean;
        icon: null;
        id: number;
        deletedAt: string
    };
    messageCategory: {
        name: string;
        sla: string;
        dueDate: string;
        isSystem: boolean;
        id: number;
        deletedAt: string;
    };
    assignee: {
        emailOptIn: boolean;
        status: string;
        isExternal: boolean;
        isSystemUser: boolean;
        twoFactorEnabled: boolean;
        invalidLoginAttempts: number;
        blockedUntil: null;
        employeeGroupId: null;
        username: string;
        email: string;
        id: number;
        deletedAt: string;
        createdById: string;
        profile: {
            firstname: string;
            lastname: string;
            middlename: string;
            position: null
            employeeId: number;
            id: number;
            imageId: null;
            deletedAt: null;
        };
        roles: [
            {
                id: number;
                name: string;
                description: null;
                created: string;
                modified: string;
            }
            ];
    };
    relatie: {
        address: [
            {
                city: string
                country: string
                houseletter: string;
                housenumber: number;
                housenumberaddition: string;
                id: number;
                postalcode: string;
                relatieId: number;
                searchIndex: string;
                state: null;
                street: string;
                type: string;
            }
        ]
        createdAt: string;
        dateofbirth: string;
        deletedAt: string;
        emailaddress: [
            {
                address: string;
                id: number;
                relatieId: number;
                type: string;
            }
        ]
        externalRelationIdentifier: number;
        firstname: string;
        gender: string;
        id: number;
        initials: string;
        lastname: string;
        middlename: string;
        personsnumber: number;
        phonenumber: [
            {
                id: number;
                number: string;
                relatieId: number;
                type: string;
            }
        ]
        salutation: null;
        type: string;
        updatedAt: string;
    };
}

export interface IType {
    name: string;
    default?: null;
    icon?: null;
    id: number;
    deletedAt: string;
}

export interface ICategory {
    name: string;
    id: number;
    MessageCategoryId: number;
    dossierCategoryId: number;
    deletedAt: string;
    MessageCategory: {
        name: string;
        sla: string;
        dueDate: string;
        isSystem: boolean;
        id: number;
        deletedAt: string;
    };
    dossierCategory: {
        name: string;
        sla: string;
        defaultAssigneeId: number;
        dueDate: string;
        isSystem: boolean;
        id: number;
        deletedAt: string;
    };
}

export interface IContactReason {
    name: string;
    id: number;
    parentId: number;
    deletedAt: string;
}

export interface IMessageChannel {
    name: string;
    icon: string;
    permanentName: string;
    visibleForNewMessage: boolean;
    sendEmail: boolean;
    isSystem: boolean;
    id: number;
    deletedAt: string;
}

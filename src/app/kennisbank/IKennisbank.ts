export interface IKennisbankSearchItem {
            type: string;
            title: string;
            content: string;
            url: string;
            keywords: string;
            restricted: boolean;
            groups: string[];
            data: {
                rootline: string[];
            };
}

export interface IKennisbankItem {
    id: string;
    externalIdentifier: string;
    title: string;
    descriptionInternal: string;
    descriptionExternal: string;
    keywords: string;
    rootline: string;
    websiteLink?: string;
    createdDate?: null;
    updatedDate?: string;
    syncedDate?: string;
    isPublic: boolean;
    language: string;
    sorting: number;
    parentId: string;
    deletedAt?: null;
    children?: IKennisbankItemChildren[];
}

export interface IKennisbankItemChildren {
    id: string;
    externalIdentifier: string;
    title: string;
    descriptionInternal: string;
    descriptionExternal: string;
    keywords: string;
    rootline: string;
    websiteLink?: string;
    createdDate?: null;
    updatedDate?: string;
    syncedDate?: string;
    isPublic: boolean;
    language: string;
    sorting: number;
    parentId: string;
    deletedAt?: null;
}

export interface IKennisbankItemWrapper {
    items: IKennisbankItem[];
}

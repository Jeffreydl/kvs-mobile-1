export interface ICustomer {
    firstname: string;
    lastname: string;
    middlename: string;
    initials: string;
    salutation: null;
    dateofbirth: string;
    personsnumber: number;
    externalRelationIdentifier: number;
    gender: string;
    type: string;
    createdAt: string;
    updatedAt: string;
    id: number;
    deletedAt: string;
    score: number;
    address: IAddress[];
    emailaddress: IEmailAddress[];
    phoneNumber: IPhoneNumber[];
    relatiecluster: IRelatieCluster[];
}

export interface IAddress {
    relatieId: number;
    street: string;
    housenumber: number;
    houseletter: string;
    housenumberaddition: string;
    postalcode: string;
    city: string;
    state: string;
    country: string;
    type: string;
    id: number;
}

export interface IEmailAddress {
    relatieId: number;
    address: string;
    type: string;
    id: number;
}

export interface IPhoneNumber {
    relatieId: number;
    number: string;
    type: string;
    id: number;
}

export interface IRelatieCluster {
    name: string;
    isSystem: boolean;
    permanentName: string;
    id: number;
    deletedAt: string;
}

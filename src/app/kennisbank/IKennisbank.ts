export interface IKennisbankItem {
    KbaseItems: [
        {
            type: string;
            title: string;
            content: string;
            url: string;
            keywords: string;
            restricted: boolean;
            groups: string[];
            data: {
                rootline: string[];
            }
        }
    ];
}


export interface SidebarNode {
    id: string;
    label: string;
    type: 'provider' | 'group' | 'site';
    status?: 'Active' | 'Inactive';
    children?: SidebarNode[];
    isOpen?: boolean;
}

export const SIDEBAR_DATA: SidebarNode[] = [
    {
        id: '1',
        label: 'Schneider - Walmart Sites',
        type: 'provider',
        status: 'Active',
        isOpen: true,
        children: [
            {
                id: '1-1',
                label: 'Austin Walmarts',
                type: 'group',
                isOpen: true,
                children: [
                    { id: '1-1-1', label: 'Wallmart #2321', type: 'site' },
                    { id: '1-1-2', label: 'Wallmart #2322', type: 'site' },
                ],
            },
        ],
    },
    {
        id: '2',
        label: 'Schneider - Zara Sites',
        type: 'provider',
        status: 'Active',
        children: [],
    },
    {
        id: '3',
        label: 'Schneider - Mango Sites',
        type: 'provider',
        status: 'Active',
        children: [],
    },
];
export interface SidebarNode {
    id: string;
    label: string;
    type: 'provider' | 'group' | 'site' | 'building';
    status?: 'Active' | 'Inactive';
    children?: SidebarNode[];
    isOpen?: boolean;
    buildingId?: string;
    siteId?: string;
    tenantId?: string;
}
//TODO sidebar nodes are coupled with Schneider. How to decouple?
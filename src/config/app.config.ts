interface AppConfigInterface {
  ownerRoles: string[];
  customerRoles: string[];
  tenantRoles: string[];
  tenantName: string;
  applicationName: string;
  addOns: string[];
  ownerAbilities: string[];
  customerAbilities: string[];
  getQuoteUrl: string;
}
export const appConfig: AppConfigInterface = {
  ownerRoles: ['Owner'],
  customerRoles: ['Visitor'],
  tenantRoles: ['Owner', 'Curator'],
  tenantName: 'Museum',
  applicationName: 'After Museum',
  addOns: ['file upload', 'chat', 'notifications', 'file'],
  customerAbilities: [
    'View museum information',
    'View exhibit information',
    'Provide feedback on exhibits',
    'Rate exhibits',
  ],
  ownerAbilities: [
    'Manage users',
    'Manage museums',
    'Manage exhibits',
    'Manage visitors',
    'Manage curators',
    'Manage owners',
  ],
  getQuoteUrl: 'https://app.roq.ai/proposal/f4915f21-05d5-4cb0-b91c-27fdc743fc8d',
};

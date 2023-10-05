const mapping: Record<string, string> = {
  curators: 'curator',
  exhibits: 'exhibit',
  museums: 'museum',
  owners: 'owner',
  users: 'user',
  visitors: 'visitor',
};

export function convertRouteToEntityUtil(route: string) {
  return mapping[route] || route;
}

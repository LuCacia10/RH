export const TAB_PERMISSIONS: Record<string, string[]> = {
  dashboard: ["DASHBOARD_NATIONAL", "DASHBOARD_RH", "DASHBOARD_SERVICE", "DASHBOARD_PERSONAL"],
  agents: ["AGENT_MANAGE"],
  organisation: ["ORG_VIEW", "ORG_MANAGE"],
  conges: ["LEAVE_MANAGE", "LEAVE_APPROVE", "LEAVE_REQUEST", "LEAVE_VIEW_SELF"],
  presences: ["PRESENCE_VALIDATE", "PRESENCE_VIEW_SERVICE"],
  carrieres: ["CAREER_MANAGE", "CAREER_VIEW_SELF"],
  evaluations: ["EVALUATION_MANAGE", "EVALUATION_SERVICE"],
  formations: ["TRAINING_MANAGE"],
  paie: ["PAYROLL_VIEW", "PAYROLL_MANAGE"],
  rbac: ["USER_MANAGE", "ROLE_MANAGE", "PERMISSION_MANAGE"]
};

export const canAccessTab = (permissions: string[], tab: string) =>
  (TAB_PERMISSIONS[tab] || []).some(permission => permissions.includes(permission));

export const roleLabel = (roles: string[]) => {
  if (roles.includes("ADMIN_CENTRAL")) return "Administrateur Central RH";
  if (roles.includes("RESPONSABLE_RH")) return "Responsable RH";
  if (roles.includes("CHEF_SERVICE")) return "Chef de Service";
  if (roles.includes("AGENT_PUBLIC")) return "Agent Public";
  return "Utilisateur";
};

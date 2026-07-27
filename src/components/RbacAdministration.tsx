import { useEffect, useMemo, useState } from "react";
import type { FormEvent, ReactNode } from "react";
import { Check, KeyRound, Pencil, Plus, Save, Shield, Trash2, UserCog, UserX, X } from "lucide-react";
import { deleteData, fetchData, patchData, postData, putData } from "../services/api";

type Permission = { id_permission: number; code: string; nom: string };
type Role = { id_role: number; code: string; nom: string; permissions: Permission[] };
type User = { id: number; username: string; email: string; actif: boolean; roles: string[]; permissions: string[]; agentId: number | null; serviceId: number | null };

export default function RbacAdministration() {
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [activePanel, setActivePanel] = useState<"users" | "roles">("users");
  const [selectedRoleId, setSelectedRoleId] = useState<number | null>(null);
  const [selectedPermissionCodes, setSelectedPermissionCodes] = useState<string[]>([]);
  const [editingUserId, setEditingUserId] = useState<number | null>(null);
  const [form, setForm] = useState({ username: "", email: "", password: "", roleCode: "AGENT_PUBLIC", agentId: "", serviceId: "", actif: true });
  const [message, setMessage] = useState("");

  const load = async () => {
    const [userRows, roleRows, permissionRows] = await Promise.all([
      fetchData("/admin/rbac/users"), fetchData("/admin/rbac/roles"), fetchData("/admin/rbac/permissions")
    ]);
    setUsers(userRows || []); setRoles(roleRows || []); setPermissions(permissionRows || []);
  };
  useEffect(() => { load(); }, []);

  const selectedRole = useMemo(() => roles.find(role => role.id_role === selectedRoleId), [roles, selectedRoleId]);
  useEffect(() => { setSelectedPermissionCodes(selectedRole?.permissions.map(permission => permission.code) || []); }, [selectedRole]);

  const resetForm = () => { setEditingUserId(null); setForm({ username: "", email: "", password: "", roleCode: "AGENT_PUBLIC", agentId: "", serviceId: "", actif: true }); };
  const editUser = (user: User) => {
    setEditingUserId(user.id);
    setForm({ username: user.username, email: user.email || "", password: "", roleCode: user.roles[0] || "AGENT_PUBLIC", agentId: user.agentId?.toString() || "", serviceId: user.serviceId?.toString() || "", actif: user.actif });
    setMessage("");
  };
  const submitUser = async (event: FormEvent) => {
    event.preventDefault(); setMessage("");
    try {
      const payload = { username: form.username, email: form.email, ...(form.password ? { password: form.password } : {}), actif: form.actif, roleCodes: [form.roleCode], agentId: form.agentId ? Number(form.agentId) : null, serviceId: form.serviceId ? Number(form.serviceId) : null };
      if (editingUserId) await putData(`/admin/rbac/users/${editingUserId}`, payload);
      else await postData("/admin/rbac/users", payload);
      setMessage(editingUserId ? "Compte modifié avec succès." : "Compte créé avec succès."); resetForm(); await load();
    } catch { setMessage("Impossible d'enregistrer le compte. Vérifiez les champs, le mot de passe et l'unicité du nom."); }
  };
  const toggleActive = async (user: User) => { try { await patchData(`/admin/rbac/users/${user.id}/active?value=${!user.actif}`); await load(); } catch { setMessage("Cette opération d'activation est interdite."); } };
  const changeUserRole = async (user: User, roleCode: string) => { try { await putData(`/admin/rbac/users/${user.id}`, { username: user.username, email: user.email, actif: user.actif, roleCodes: [roleCode], agentId: user.agentId, serviceId: user.serviceId }); setMessage("Rôle du compte mis à jour."); await load(); } catch { setMessage("Impossible d'attribuer ce rôle."); } };
  const remove = async (user: User) => { if (!window.confirm(`Supprimer définitivement le compte ${user.username} ?`)) return; try { await deleteData(`/admin/rbac/users/${user.id}`); await load(); } catch { setMessage("Ce compte ne peut pas être supprimé."); } };
  const saveRole = async () => { if (!selectedRole) return; try { await putData(`/admin/rbac/roles/${selectedRole.id_role}`, { nom: selectedRole.nom, permissionCodes: selectedPermissionCodes }); setMessage("Permissions du rôle enregistrées."); await load(); } catch { setMessage("Impossible d'enregistrer les permissions."); } };

  return <div className="space-y-6 fade-in">
    <header className="rounded-xl border border-white/10 bg-[#111720] p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div><span className="text-[10px] font-bold tracking-widest text-indigo-400 uppercase">Administration de la sécurité</span><h2 className="text-xl font-bold text-white mt-1">Utilisateurs, rôles et permissions</h2><p className="text-xs text-slate-400 mt-1">Contrôle centralisé des accès selon le principe du moindre privilège.</p></div>
      <div className="flex gap-1 bg-[#0b0f16] border border-white/10 p-1 rounded-lg"><button onClick={() => setActivePanel("users")} className={`px-4 py-2 rounded-md text-xs font-semibold ${activePanel === "users" ? "bg-indigo-600 text-white" : "text-slate-400"}`}><UserCog className="inline w-4 h-4 mr-2"/>Utilisateurs</button><button onClick={() => setActivePanel("roles")} className={`px-4 py-2 rounded-md text-xs font-semibold ${activePanel === "roles" ? "bg-indigo-600 text-white" : "text-slate-400"}`}><Shield className="inline w-4 h-4 mr-2"/>Rôles</button></div>
    </header>
    {message && <div className="rounded-lg border border-indigo-500/20 bg-indigo-500/10 px-4 py-3 text-xs text-indigo-300">{message}</div>}

    {activePanel === "users" ? <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
      <form onSubmit={submitUser} className="rounded-xl border border-white/10 bg-[#111720] p-5 space-y-4">
        <div className="flex items-center justify-between"><h3 className="font-bold text-white flex items-center gap-2">{editingUserId ? <Pencil className="w-4 h-4 text-amber-400"/> : <Plus className="w-4 h-4 text-indigo-400"/>}{editingUserId ? "Modifier le compte" : "Créer un compte"}</h3>{editingUserId && <button type="button" onClick={resetForm} className="p-1.5 text-slate-500 hover:text-white" title="Annuler"><X className="w-4 h-4"/></button>}</div>
        <Field label="Nom d'utilisateur"><input required value={form.username} onChange={e => setForm({...form, username:e.target.value})} className="w-full rounded-lg border p-2 text-xs"/></Field>
        <Field label="Adresse électronique"><input type="email" required value={form.email} onChange={e => setForm({...form, email:e.target.value})} className="w-full rounded-lg border p-2 text-xs"/></Field>
        <Field label={editingUserId ? "Nouveau mot de passe (facultatif)" : "Mot de passe initial"}><input type="password" minLength={8} required={!editingUserId} value={form.password} onChange={e => setForm({...form, password:e.target.value})} className="w-full rounded-lg border p-2 text-xs" placeholder={editingUserId ? "Laisser vide pour conserver l'actuel" : "8 caractères minimum"}/></Field>
        <Field label="Rôle"><select value={form.roleCode} onChange={e => setForm({...form, roleCode:e.target.value})} className="w-full rounded-lg border p-2 text-xs">{roles.map(role => <option key={role.code} value={role.code}>{role.nom}</option>)}</select></Field>
        {form.roleCode === "AGENT_PUBLIC" && <Field label="Identifiant de l'agent"><input type="number" value={form.agentId} onChange={e => setForm({...form, agentId:e.target.value})} className="w-full rounded-lg border p-2 text-xs" placeholder="Ex. 12"/></Field>}
        {form.roleCode === "CHEF_SERVICE" && <Field label="Identifiant du service"><input type="number" value={form.serviceId} onChange={e => setForm({...form, serviceId:e.target.value})} className="w-full rounded-lg border p-2 text-xs" placeholder="Ex. 4"/></Field>}
        <label className="flex items-center justify-between rounded-lg border border-white/10 p-3"><span className="text-xs font-semibold text-slate-300">Compte actif</span><input type="checkbox" checked={form.actif} onChange={event => setForm({...form, actif:event.target.checked})} className="w-4 h-4"/></label>
        <button className={`w-full rounded-lg py-2.5 text-xs font-bold text-white ${editingUserId ? "bg-amber-600 hover:bg-amber-500" : "bg-indigo-600 hover:bg-indigo-500"}`}>{editingUserId ? "Enregistrer les modifications" : "Créer le compte"}</button>
      </form>
      <div className="xl:col-span-2 rounded-xl border border-white/10 bg-[#111720] overflow-hidden"><div className="p-5 border-b border-white/10"><h3 className="font-bold text-white">Comptes de la plateforme</h3><p className="text-xs text-slate-500 mt-1">{users.length} utilisateur(s) enregistré(s)</p></div><div className="divide-y divide-white/5">{users.map(user => <div key={user.id} className={`p-4 flex flex-wrap sm:flex-nowrap items-center gap-4 ${editingUserId === user.id ? "bg-amber-500/5" : ""}`}><div className={`w-10 h-10 rounded-xl grid place-items-center ${user.actif ? "bg-emerald-500/10 text-emerald-400" : "bg-rose-500/10 text-rose-400"}`}><UserCog className="w-4 h-4"/></div><div className="flex-1 min-w-0"><strong className="text-sm text-white block truncate">{user.username}</strong><span className="text-[10px] text-slate-500">{user.email}</span></div><select aria-label={`Rôle de ${user.username}`} value={user.roles[0] || ""} onChange={event => changeUserRole(user,event.target.value)} className="rounded-lg border border-white/10 px-2 py-1.5 text-[10px]">{roles.map(role => <option key={role.code} value={role.code}>{role.nom}</option>)}</select><span className={`text-[9px] font-bold px-2 py-1 rounded-full ${user.actif ? "bg-emerald-500/10 text-emerald-400" : "bg-rose-500/10 text-rose-400"}`}>{user.actif ? "ACTIF" : "INACTIF"}</span><button title="Modifier" onClick={() => editUser(user)} className="p-2 text-slate-400 hover:text-indigo-400"><Pencil className="w-4 h-4"/></button><button title={user.actif ? "Désactiver" : "Activer"} onClick={() => toggleActive(user)} className="p-2 text-slate-400 hover:text-amber-400"><UserX className="w-4 h-4"/></button><button title="Supprimer" onClick={() => remove(user)} className="p-2 text-slate-400 hover:text-rose-400"><Trash2 className="w-4 h-4"/></button></div>)}</div></div>
    </div> : <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="rounded-xl border border-white/10 bg-[#111720] p-3 space-y-2">{roles.map(role => <button key={role.id_role} onClick={() => setSelectedRoleId(role.id_role)} className={`w-full p-3 rounded-lg text-left border ${selectedRoleId === role.id_role ? "bg-indigo-500/10 border-indigo-500/30" : "border-transparent hover:bg-white/5"}`}><strong className="text-sm text-white block">{role.nom}</strong><span className="text-[10px] text-slate-500">{role.code} · {role.permissions.length} permission(s)</span></button>)}</div>
      <div className="lg:col-span-2 rounded-xl border border-white/10 bg-[#111720] p-5">{selectedRole ? <><div className="flex justify-between items-center mb-5"><div><h3 className="font-bold text-white">Permissions — {selectedRole.nom}</h3><p className="text-xs text-slate-500 mt-1">Activez uniquement les droits nécessaires à ce rôle.</p></div><button onClick={saveRole} className="rounded-lg bg-indigo-600 px-4 py-2 text-xs font-bold text-white flex gap-2"><Save className="w-4 h-4"/>Enregistrer</button></div><div className="grid sm:grid-cols-2 gap-2">{permissions.map(permission => { const checked=selectedPermissionCodes.includes(permission.code); return <button key={permission.code} onClick={() => setSelectedPermissionCodes(prev => checked ? prev.filter(code => code !== permission.code) : [...prev,permission.code])} className={`p-3 rounded-lg border text-left flex gap-3 ${checked ? "bg-emerald-500/10 border-emerald-500/25" : "border-white/10 hover:bg-white/5"}`}><span className={`w-5 h-5 rounded grid place-items-center shrink-0 ${checked ? "bg-emerald-500 text-white" : "border border-slate-600"}`}>{checked && <Check className="w-3 h-3"/>}</span><span><strong className="text-xs text-slate-200 block">{permission.nom}</strong><span className="text-[9px] font-mono text-slate-500">{permission.code}</span></span></button>})}</div></> : <div className="py-16 text-center"><KeyRound className="w-8 h-8 text-slate-600 mx-auto"/><p className="text-sm text-slate-400 mt-3">Sélectionnez un rôle pour gérer ses permissions.</p></div>}</div>
    </div>}
  </div>;
}

function Field({ label, children }: { label: string; children: ReactNode }) { return <label className="block"><span className="text-[10px] uppercase tracking-wider font-bold text-slate-500 block mb-1.5">{label}</span>{children}</label>; }

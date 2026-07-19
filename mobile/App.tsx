import { StatusBar } from 'expo-status-bar';
import { useEffect, useMemo, useState, type ReactNode } from 'react';
import {
  ActivityIndicator,
  Alert,
  Modal,
  Platform,
  Pressable,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { API_URL, AuthUser, get, login, logout, post, restoreUser } from './src/api';

type ModuleKey =
  | 'dashboard'
  | 'agents'
  | 'organisation'
  | 'conges'
  | 'presences'
  | 'carrieres'
  | 'evaluations'
  | 'formations'
  | 'paie';
type Data = {
  agents: any[];
  ministeres: any[];
  presences: any[];
  conges: any[];
  bulletins: any[];
  audits: any[];
};

const emptyData: Data = { agents: [], ministeres: [], presences: [], conges: [], bulletins: [], audits: [] };
const modules: { key: ModuleKey; label: string; icon: string; subtitle: string; accent: string }[] = [
  { key: 'dashboard', label: 'Tableau de bord', icon: '▦', subtitle: 'Vue globale RH', accent: '#818cf8' },
  { key: 'agents', label: 'Agents', icon: '●', subtitle: 'Dossiers du personnel', accent: '#38bdf8' },
  { key: 'organisation', label: 'Organisation', icon: '◆', subtitle: 'Ministères et services', accent: '#a78bfa' },
  { key: 'conges', label: 'Congés', icon: '◫', subtitle: 'Demandes et validation', accent: '#f59e0b' },
  { key: 'presences', label: 'Présences', icon: '✓', subtitle: 'Pointage quotidien', accent: '#34d399' },
  { key: 'carrieres', label: 'Carrières', icon: '↗', subtitle: 'Parcours et promotions', accent: '#fb7185' },
  { key: 'evaluations', label: 'Évaluations', icon: '★', subtitle: 'Campagnes annuelles', accent: '#fbbf24' },
  { key: 'formations', label: 'Formations', icon: '◇', subtitle: 'Sessions et compétences', accent: '#2dd4bf' },
  { key: 'paie', label: 'Paie', icon: 'Ar', subtitle: 'Bulletins et salaires', accent: '#60a5fa' },
];

export default function App() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [booting, setBooting] = useState(true);

  useEffect(() => {
    restoreUser().then(setUser).finally(() => setBooting(false));
  }, []);

  if (booting) return <View style={styles.appViewport}><View style={styles.appFrame}><LoadingScreen /></View></View>;
  return (
    <>
      <StatusBar style="light" />
      <View style={styles.appViewport}>
        <View style={styles.appFrame}>
          {user ? (
            <MainShell user={user} onLogout={async () => { await logout(); setUser(null); }} />
          ) : (
            <LoginScreen onLogin={setUser} />
          )}
        </View>
      </View>
    </>
  );
}

function LoginScreen({ onLogin }: { onLogin: (user: AuthUser) => void }) {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    if (!username.trim() || !password) return;
    setBusy(true);
    try {
      onLogin(await login(username.trim(), password));
    } catch {
      Alert.alert('Connexion refusée', 'Vérifiez vos identifiants et la connexion au serveur.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <SafeAreaView style={styles.page}>
      <View style={styles.loginGlow} />
      <ScrollView contentContainerStyle={styles.loginContent} keyboardShouldPersistTaps="handled">
        <HRLogo size={68} />
        <Text style={styles.brandOverline}>RÉPUBLIQUE DE MADAGASCAR</Text>
        <Text style={styles.loginTitle}>Bienvenue sur SGRH</Text>
        <Text style={styles.loginSubtitle}>Votre espace mobile de gestion des ressources humaines</Text>

        <View style={styles.loginCard}>
          <Text style={styles.formTitle}>Connexion</Text>
          <Text style={styles.label}>Nom d’utilisateur</Text>
          <TextInput
            style={styles.input}
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
            autoCorrect={false}
            placeholder="Votre identifiant"
            placeholderTextColor="#596477"
          />
          <Text style={styles.label}>Mot de passe</Text>
          <View style={styles.passwordRow}>
            <TextInput
              style={styles.passwordInput}
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              placeholder="Votre mot de passe"
              placeholderTextColor="#596477"
              onSubmitEditing={submit}
            />
            <Pressable onPress={() => setShowPassword(value => !value)} style={styles.showButton}>
              <Text style={styles.showText}>{showPassword ? 'Masquer' : 'Afficher'}</Text>
            </Pressable>
          </View>
          <PrimaryButton label="Se connecter" onPress={submit} busy={busy} />
        </View>
        <Text style={styles.serverText}>Serveur sécurisé · {API_URL}</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

function MainShell({ user, onLogout }: { user: AuthUser; onLogout: () => void }) {
  const [activeModule, setActiveModule] = useState<ModuleKey>('dashboard');
  const [menuVisible, setMenuVisible] = useState(false);
  const [data, setData] = useState<Data>(emptyData);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  const load = async () => {
    setRefreshing(true);
    setError('');
    try {
      const stats = await get('/dashboard/stats');
      setData({ ...emptyData, ...stats });
    } catch {
      setError('La synchronisation avec le serveur a échoué.');
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => { load(); }, []);

  const navigate = (next: ModuleKey) => {
    setActiveModule(next);
    setMenuVisible(false);
  };

  return (
    <SafeAreaView style={styles.page}>
      <AppHeader user={user} onOpenMenu={() => setMenuVisible(true)} />
      <View style={styles.screenBody}>
        {activeModule === 'dashboard' ? (
          <Dashboard data={data} refreshing={refreshing} error={error} refresh={load} openModule={navigate} user={user} />
        ) : activeModule === 'agents' ? (
          <AgentsScreen agents={data.agents} refreshing={refreshing} refresh={load} />
        ) : (
          <ModuleScreen moduleKey={activeModule} data={data} refresh={load} />
        )}
      </View>
      <HamburgerMenu visible={menuVisible} active={activeModule} user={user} onNavigate={navigate} onClose={() => setMenuVisible(false)} onLogout={onLogout} />
    </SafeAreaView>
  );
}

function AppHeader({ user, onOpenMenu }: { user: AuthUser; onOpenMenu: () => void }) {
  return (
    <View style={styles.appHeader}>
      <Pressable onPress={onOpenMenu} style={({ pressed }) => [styles.hamburgerButton, pressed && styles.headerButtonPressed]} accessibilityRole="button" accessibilityLabel="Ouvrir le menu principal">
        <View style={styles.hamburgerLine} /><View style={styles.hamburgerLine} /><View style={styles.hamburgerLine} />
      </Pressable>
      <View style={{ flex: 1 }}>
        <Text style={styles.headerOverline}>SGRH MOBILE</Text>
        <Text style={styles.headerTitle}>Administration publique</Text>
      </View>
      <View style={styles.userAvatar}><Text style={styles.userAvatarText}>{user.username.slice(0, 2).toUpperCase()}</Text></View>
    </View>
  );
}

function HamburgerMenu({ visible, active, user, onNavigate, onClose, onLogout }: {
  visible: boolean; active: ModuleKey; user: AuthUser;
  onNavigate: (key: ModuleKey) => void; onClose: () => void; onLogout: () => void;
}) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose} statusBarTranslucent>
      <View style={styles.drawerOverlay}>
        <Pressable style={styles.drawerScrim} onPress={onClose} accessibilityLabel="Fermer le menu" />
        <View style={styles.drawerFrame}>
          <SafeAreaView style={styles.drawer}>
          <View style={styles.drawerHeader}>
            <HRLogo size={38} />
            <View style={{ flex: 1 }}>
              <Text style={styles.drawerOverline}>SGRH MOBILE</Text>
              <Text style={styles.drawerTitle}>Menu principal</Text>
            </View>
            <Pressable onPress={onClose} style={styles.closeButton} accessibilityRole="button" accessibilityLabel="Fermer le menu">
              <Text style={styles.closeButtonText}>×</Text>
            </Pressable>
          </View>

          <ScrollView contentContainerStyle={styles.drawerList} showsVerticalScrollIndicator={false}>
            {modules.map(item => {
              const selected = active === item.key;
              return (
                <Pressable
                  key={item.key}
                  onPress={() => onNavigate(item.key)}
                  style={({ pressed }) => [styles.drawerItem, selected && styles.drawerItemActive, pressed && styles.cardPressed]}
                  accessibilityRole="button"
                  accessibilityState={{ selected }}
                >
                  <View style={[styles.drawerItemIcon, { backgroundColor: `${item.accent}20` }]}>
                    <Text style={[styles.drawerItemIconText, { color: item.accent }]}>{item.icon}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.drawerItemTitle, selected && styles.drawerItemTitleActive]}>{item.label}</Text>
                    <Text style={styles.drawerItemSubtitle}>{item.subtitle}</Text>
                  </View>
                  {selected ? <View style={styles.activeDot} /> : null}
                </Pressable>
              );
            })}
          </ScrollView>

            <View style={styles.drawerProfile}>
              <View style={styles.profileAvatar}><Text style={styles.profileAvatarText}>{user.username.slice(0, 2).toUpperCase()}</Text></View>
              <View style={{ flex: 1 }}>
                <Text style={styles.profileName}>{user.username}</Text>
                <Text style={styles.profileRole} numberOfLines={1}>{user.roles.join(', ') || 'Utilisateur SGRH'}</Text>
              </View>
              <Pressable onPress={onLogout} style={styles.logoutButton} accessibilityRole="button">
                <Text style={styles.logoutText}>Quitter</Text>
              </Pressable>
            </View>
          </SafeAreaView>
        </View>
      </View>
    </Modal>
  );
}

function Dashboard({ data, refreshing, error, refresh, openModule, user }: {
  data: Data; refreshing: boolean; error: string; refresh: () => Promise<void>;
  openModule: (module: ModuleKey) => void; user: AuthUser;
}) {
  const pending = data.conges.filter(item => field(item, 'id_statut_conge') === 401).length;
  const today = new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' });
  return (
    <ScrollView contentContainerStyle={styles.content} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh} tintColor="#818cf8" />}>
      <Text style={styles.dateLabel}>{today}</Text>
      <Text style={styles.welcomeTitle}>Bonjour, {user.username}</Text>
      <Text style={styles.welcomeSubtitle}>Voici la situation de vos ressources humaines.</Text>
      {error ? <View style={styles.errorBox}><Text style={styles.errorText}>{error}</Text></View> : null}

      <View style={styles.featureCard}>
        <View style={styles.featureTop}><Text style={styles.featureLabel}>EFFECTIF TOTAL</Text><View style={styles.liveBadge}><Text style={styles.liveText}>EN DIRECT</Text></View></View>
        <Text style={styles.featureValue}>{data.agents.length}</Text>
        <Text style={styles.featureCaption}>agents enregistrés dans le système</Text>
        <View style={styles.featureDivider} />
        <View style={styles.featureFooter}><Text style={styles.featureSmall}>{data.ministeres.length} ministères</Text><Text style={styles.featureSmall}>{pending} congés en attente</Text></View>
      </View>

      <Text style={styles.sectionTitle}>Aperçu rapide</Text>
      <View style={styles.statsGrid}>
        <StatCard label="Présences" value={data.presences.length} icon="✓" color="#34d399" />
        <StatCard label="Congés" value={data.conges.length} icon="◫" color="#f59e0b" />
        <StatCard label="Bulletins" value={data.bulletins.length} icon="Ar" color="#60a5fa" />
        <StatCard label="Activités" value={data.audits.length} icon="↗" color="#a78bfa" />
      </View>

      <View style={styles.sectionHeading}><Text style={styles.sectionTitle}>Accès rapides</Text><Text style={styles.sectionHint}>Voir tout</Text></View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.quickRow}>
        {modules.filter(item => ['presences', 'organisation', 'paie', 'formations'].includes(item.key)).map(item => (
          <Pressable key={item.key} style={styles.quickCard} onPress={() => openModule(item.key)}>
            <View style={[styles.quickIcon, { backgroundColor: `${item.accent}20` }]}><Text style={[styles.quickIconText, { color: item.accent }]}>{item.icon}</Text></View>
            <Text style={styles.quickTitle}>{item.label}</Text>
          </Pressable>
        ))}
      </ScrollView>
    </ScrollView>
  );
}

function AgentsScreen({ agents, refreshing, refresh }: { agents: any[]; refreshing: boolean; refresh: () => Promise<void> }) {
  const [query, setQuery] = useState('');
  const visible = useMemo(() => agents.filter(agent => `${agent.nom} ${agent.prenom} ${agent.matricule}`.toLowerCase().includes(query.toLowerCase())), [agents, query]);
  return (
    <ScrollView contentContainerStyle={styles.content} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh} tintColor="#818cf8" />}>
      <ScreenTitle title="Agents" subtitle={`${agents.length} dossier(s) du personnel`} />
      <TextInput style={styles.searchInput} value={query} onChangeText={setQuery} placeholder="Rechercher un agent…" placeholderTextColor="#647084" />
      <EntityList rows={visible.map(agent => ({ title: `${agent.nom} ${agent.prenom || ''}`, subtitle: `${agent.matricule} · ${agent.email || 'Sans email'}`, badge: agent.nom?.slice(0, 1) || 'A' }))} />
    </ScrollView>
  );
}

function ModuleScreen({ moduleKey, data, refresh, onBack }: { moduleKey: ModuleKey; data: Data; refresh: () => Promise<void>; onBack?: () => void }) {
  const meta = modules.find(item => item.key === moduleKey)!;
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [busy, setBusy] = useState(false);
  const agentName = (id: number) => { const agent = data.agents.find(item => item.id_agent === id); return agent ? `${agent.nom} ${agent.prenom || ''}` : `Agent #${id}`; };

  const quickAction = async () => {
    if (!data.agents.length) return Alert.alert('Aucun agent', 'Ajoutez d’abord un agent depuis l’application web.');
    setBusy(true);
    try {
      const id = data.agents[0].id_agent;
      const today = new Date().toISOString().slice(0, 10);
      if (moduleKey === 'presences') await post('/presences', { id_agent: id, date_presence: today, heure_arrivee: new Date().toTimeString().slice(0, 8), heure_depart: null, id_statut_presence: 301 });
      if (moduleKey === 'conges') await post('/conges', { id_agent: id, id_type_conge: 1, date_debut: today, date_fin: today, id_statut_conge: 401 });
      await refresh(); setConfirmVisible(false); Alert.alert('Enregistré', 'La donnée a été synchronisée.');
    } catch { Alert.alert('Échec', 'Impossible d’enregistrer cette opération.'); }
    finally { setBusy(false); }
  };

  let content: ReactNode;
  if (moduleKey === 'organisation') content = <EntityList rows={data.ministeres.map(item => ({ title: item.nom, subtitle: item.code || 'Ministère', badge: 'M' }))} />;
  else if (moduleKey === 'presences') content = <><PrimaryButton label="Nouveau pointage" onPress={() => setConfirmVisible(true)} /><EntityList rows={data.presences.map(item => ({ title: agentName(field(item, 'id_agent')), subtitle: `${item.date_presence} · ${item.heure_arrivee || '--:--'}`, badge: '✓' }))} /></>;
  else if (moduleKey === 'conges') content = <><PrimaryButton label="Nouvelle demande" onPress={() => setConfirmVisible(true)} /><EntityList rows={data.conges.map(item => ({ title: agentName(field(item, 'id_agent')), subtitle: `Du ${item.date_debut} au ${item.date_fin}`, badge: 'C' }))} /></>;
  else if (moduleKey === 'paie') content = <EntityList rows={data.bulletins.map(item => ({ title: agentName(field(item, 'id_agent')), subtitle: `${item.mois}/${item.annee} · ${Number(item.salaire_net || 0).toLocaleString('fr-FR')} Ar`, badge: 'Ar' }))} />;
  else if (moduleKey === 'carrieres') content = <EntityList rows={data.agents.map(item => ({ title: `${item.nom} ${item.prenom || ''}`, subtitle: `Grade #${item.id_grade || '-'} · Service #${item.id_service || '-'}`, badge: '↗' }))} />;
  else content = <EmptyModule meta={meta} />;

  return (
    <>
      <ScrollView contentContainerStyle={styles.content}>
        {onBack ? <Pressable onPress={onBack} style={styles.backButton}><Text style={styles.backText}>‹ Tous les services</Text></Pressable> : null}
        <ScreenTitle title={meta.label} subtitle={meta.subtitle} icon={meta.icon} accent={meta.accent} />
        {content}
      </ScrollView>
      <Modal visible={confirmVisible} transparent animationType="fade" onRequestClose={() => setConfirmVisible(false)}>
        <View style={styles.overlay}><View style={styles.dialog}><View style={[styles.dialogIcon, { backgroundColor: `${meta.accent}20` }]}><Text style={{ color: meta.accent, fontSize: 22 }}>{meta.icon}</Text></View><Text style={styles.dialogTitle}>Confirmer l’opération</Text><Text style={styles.dialogText}>Cette donnée sera enregistrée dans le backend commun web et mobile.</Text><PrimaryButton label="Confirmer" onPress={quickAction} busy={busy} /><Pressable onPress={() => setConfirmVisible(false)}><Text style={styles.cancelText}>Annuler</Text></Pressable></View></View>
      </Modal>
    </>
  );
}

function StatCard({ label, value, icon, color }: { label: string; value: number; icon: string; color: string }) { return <View style={styles.statCard}><View style={[styles.statIcon, { backgroundColor: `${color}20` }]}><Text style={{ color, fontWeight: '900' }}>{icon}</Text></View><Text style={styles.statValue}>{value}</Text><Text style={styles.statLabel}>{label}</Text></View>; }
function HRLogo({ size }: { size: number }) {
  const unit = size / 64;
  return (
    <View style={[styles.hrLogo, { width: size, height: size, borderRadius: 18 * unit }]} accessibilityLabel="Logo de gestion des ressources humaines">
      <View style={[styles.logoSideHead, { left: 14 * unit, top: 22 * unit, width: 11 * unit, height: 11 * unit, borderRadius: 5.5 * unit }]} />
      <View style={[styles.logoSideHead, { right: 14 * unit, top: 22 * unit, width: 11 * unit, height: 11 * unit, borderRadius: 5.5 * unit }]} />
      <View style={[styles.logoSideBody, { left: 11 * unit, top: 35 * unit, width: 19 * unit, height: 15 * unit, borderTopLeftRadius: 10 * unit, borderTopRightRadius: 10 * unit }]} />
      <View style={[styles.logoSideBody, { right: 11 * unit, top: 35 * unit, width: 19 * unit, height: 15 * unit, borderTopLeftRadius: 10 * unit, borderTopRightRadius: 10 * unit }]} />
      <View style={[styles.logoMainHead, { left: 25 * unit, top: 13 * unit, width: 14 * unit, height: 14 * unit, borderRadius: 7 * unit }]} />
      <View style={[styles.logoMainBody, { left: 19 * unit, top: 33 * unit, width: 26 * unit, height: 18 * unit, borderTopLeftRadius: 14 * unit, borderTopRightRadius: 14 * unit }]} />
    </View>
  );
}
function ScreenTitle({ title, subtitle, icon, accent }: { title: string; subtitle: string; icon?: string; accent?: string }) { return <View style={styles.screenTitleRow}>{icon ? <View style={[styles.titleIcon, { backgroundColor: `${accent}20` }]}><Text style={{ color: accent, fontSize: 20, fontWeight: '900' }}>{icon}</Text></View> : null}<View><Text style={styles.screenTitle}>{title}</Text><Text style={styles.screenSubtitle}>{subtitle}</Text></View></View>; }
function EntityList({ rows }: { rows: { title: string; subtitle: string; badge: string }[] }) { if (!rows.length) return <View style={styles.emptyState}><Text style={styles.emptyIcon}>◇</Text><Text style={styles.emptyTitle}>Aucune donnée</Text><Text style={styles.emptyText}>Les informations apparaîtront ici après synchronisation.</Text></View>; return <View style={styles.entityList}>{rows.map((row, index) => <View key={`${row.title}-${index}`} style={styles.entityRow}><View style={styles.entityAvatar}><Text style={styles.entityAvatarText}>{row.badge}</Text></View><View style={{ flex: 1 }}><Text style={styles.entityTitle}>{row.title}</Text><Text style={styles.entitySubtitle}>{row.subtitle}</Text></View><Text style={styles.chevron}>›</Text></View>)}</View>; }
function EmptyModule({ meta }: { meta: typeof modules[number] }) { return <View style={styles.emptyState}><View style={[styles.largeModuleIcon, { backgroundColor: `${meta.accent}20` }]}><Text style={{ color: meta.accent, fontSize: 28 }}>{meta.icon}</Text></View><Text style={styles.emptyTitle}>Module {meta.label}</Text><Text style={styles.emptyText}>Les informations de ce module seront synchronisées avec le même référentiel SGRH.</Text></View>; }
function PrimaryButton({ label, onPress, busy }: { label: string; onPress: () => void; busy?: boolean }) { return <Pressable onPress={onPress} disabled={busy} style={({ pressed }) => [styles.primaryButton, pressed && { opacity: .85 }, busy && { opacity: .65 }]}>{busy ? <ActivityIndicator color="#fff" /> : <Text style={styles.primaryButtonText}>{label}</Text>}</Pressable>; }
function LoadingScreen() { return <SafeAreaView style={styles.page}><View style={styles.loadingWrap}><HRLogo size={68} /><ActivityIndicator color="#818cf8" /><Text style={styles.loadingText}>Chargement de votre espace…</Text></View></SafeAreaView>; }
const field = (item: any, name: string) => item?.[name] ?? item?.[name === 'id_agent' ? 'agent' : name === 'id_statut_conge' ? 'statutConge' : 'statutPresence']?.[name === 'id_agent' ? 'id_agent' : 'id_valeur_reference'];

const styles = StyleSheet.create({
  appViewport: { flex: 1, width: '100%', backgroundColor: '#03050a', alignItems: 'center', justifyContent: 'center', paddingVertical: Platform.OS === 'web' ? 20 : 12 },
  appFrame: { width: '100%', height: '92%', maxWidth: 480, maxHeight: 820, borderRadius: 24, backgroundColor: '#080B11', overflow: 'hidden', shadowColor: '#000', shadowOpacity: .45, shadowRadius: 24, elevation: 12 },
  page: { flex: 1, width: '100%', backgroundColor: '#080B11' }, screenBody: { flex: 1 }, content: { padding: 20, paddingBottom: 34 },
  loginGlow: { position: 'absolute', top: -120, alignSelf: 'center', width: 360, height: 360, borderRadius: 180, backgroundColor: '#312e8150' },
  loginContent: { flexGrow: 1, justifyContent: 'center', padding: 26 },
  hrLogo: { position: 'relative', alignSelf: 'center', overflow: 'hidden', backgroundColor: '#4f46e5', shadowColor: '#6366f1', shadowOpacity: .45, shadowRadius: 18, elevation: 8 }, logoSideHead: { position: 'absolute', backgroundColor: '#a5b4fc' }, logoSideBody: { position: 'absolute', backgroundColor: '#a5b4fc' }, logoMainHead: { position: 'absolute', backgroundColor: '#fff' }, logoMainBody: { position: 'absolute', backgroundColor: '#e0e7ff' },
  brandOverline: { color: '#a5b4fc', fontSize: 10, fontWeight: '900', letterSpacing: 2, textAlign: 'center', marginTop: 22 }, loginTitle: { color: '#fff', fontSize: 30, fontWeight: '900', textAlign: 'center', marginTop: 8 }, loginSubtitle: { color: '#8d98aa', fontSize: 14, lineHeight: 21, textAlign: 'center', marginTop: 8, paddingHorizontal: 20 },
  loginCard: { backgroundColor: '#121722', borderWidth: 1, borderColor: '#262f40', borderRadius: 24, padding: 20, marginTop: 30 }, formTitle: { color: '#fff', fontSize: 18, fontWeight: '800', marginBottom: 12 }, label: { color: '#aeb8c8', fontSize: 12, fontWeight: '700', marginTop: 12, marginBottom: 7 }, input: { color: '#fff', backgroundColor: '#0c111a', borderColor: '#293246', borderWidth: 1, borderRadius: 14, padding: 14 }, passwordRow: { backgroundColor: '#0c111a', borderColor: '#293246', borderWidth: 1, borderRadius: 14, flexDirection: 'row', alignItems: 'center' }, passwordInput: { flex: 1, color: '#fff', padding: 14 }, showButton: { paddingHorizontal: 14, paddingVertical: 13 }, showText: { color: '#a5b4fc', fontSize: 11, fontWeight: '800' }, serverText: { color: '#596477', fontSize: 10, textAlign: 'center', marginTop: 20 },
  appHeader: { height: 64, paddingHorizontal: 14, flexDirection: 'row', alignItems: 'center', gap: 12, borderBottomWidth: 1, borderBottomColor: '#1b2230', backgroundColor: '#0b0f16' }, headerOverline: { color: '#818cf8', fontSize: 9, fontWeight: '900', letterSpacing: 1.5 }, headerTitle: { color: '#e8edf5', fontSize: 14, fontWeight: '700', marginTop: 2 }, userAvatar: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#222a3a', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#35405a' }, userAvatarText: { color: '#c7d2fe', fontSize: 11, fontWeight: '900' },
  hamburgerButton: { width: 40, height: 40, borderRadius: 12, backgroundColor: '#151b26', borderWidth: 1, borderColor: '#293244', alignItems: 'center', justifyContent: 'center', gap: 4 }, headerButtonPressed: { opacity: .72 }, hamburgerLine: { width: 17, height: 2, borderRadius: 2, backgroundColor: '#c7d2fe' },
  drawerOverlay: { flex: 1, backgroundColor: '#0008', alignItems: 'center', justifyContent: 'center', paddingVertical: Platform.OS === 'web' ? 20 : 12 }, drawerScrim: { ...StyleSheet.absoluteFillObject }, drawerFrame: { width: '100%', height: '92%', maxWidth: 480, maxHeight: 820, borderRadius: 24, overflow: 'hidden' }, drawer: { width: '84%', maxWidth: 360, height: '100%', backgroundColor: '#0b0f16', borderRightWidth: 1, borderRightColor: '#293244' }, drawerHeader: { minHeight: 82, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', gap: 12, borderBottomWidth: 1, borderBottomColor: '#1b2230' }, drawerOverline: { color: '#818cf8', fontSize: 9, fontWeight: '900', letterSpacing: 1.4 }, drawerTitle: { color: '#fff', fontSize: 17, fontWeight: '900', marginTop: 2 }, closeButton: { width: 36, height: 36, borderRadius: 11, backgroundColor: '#151b26', alignItems: 'center', justifyContent: 'center' }, closeButtonText: { color: '#aeb8c8', fontSize: 24, lineHeight: 26 }, drawerList: { padding: 12, gap: 5 }, drawerItem: { minHeight: 58, paddingHorizontal: 10, paddingVertical: 8, borderRadius: 14, flexDirection: 'row', alignItems: 'center', gap: 11, borderWidth: 1, borderColor: 'transparent' }, drawerItemActive: { backgroundColor: '#181b36', borderColor: '#353b70' }, drawerItemIcon: { width: 38, height: 38, borderRadius: 12, alignItems: 'center', justifyContent: 'center' }, drawerItemIconText: { fontSize: 14, fontWeight: '900' }, drawerItemTitle: { color: '#d6dce7', fontSize: 13, fontWeight: '800' }, drawerItemTitleActive: { color: '#fff' }, drawerItemSubtitle: { color: '#687488', fontSize: 9, marginTop: 2 }, activeDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#818cf8' }, drawerProfile: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 14, borderTopWidth: 1, borderTopColor: '#1b2230' },
  dateLabel: { color: '#818cf8', fontSize: 11, fontWeight: '800', textTransform: 'uppercase' }, welcomeTitle: { color: '#fff', fontSize: 27, fontWeight: '900', marginTop: 6 }, welcomeSubtitle: { color: '#7f8a9d', fontSize: 13, marginTop: 4, marginBottom: 20 }, errorBox: { backgroundColor: '#35151e', borderColor: '#6b2537', borderWidth: 1, borderRadius: 12, padding: 12, marginBottom: 14 }, errorText: { color: '#fb7185', fontSize: 12 },
  featureCard: { backgroundColor: '#171c35', borderColor: '#333b70', borderWidth: 1, borderRadius: 22, padding: 20, marginBottom: 24 }, featureTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }, featureLabel: { color: '#a5b4fc', fontSize: 10, fontWeight: '900', letterSpacing: 1.4 }, liveBadge: { backgroundColor: '#34d3991b', borderRadius: 20, paddingHorizontal: 8, paddingVertical: 4 }, liveText: { color: '#34d399', fontSize: 8, fontWeight: '900' }, featureValue: { color: '#fff', fontSize: 46, fontWeight: '900', marginTop: 10 }, featureCaption: { color: '#9ca7c6', fontSize: 12 }, featureDivider: { height: 1, backgroundColor: '#32395f', marginVertical: 16 }, featureFooter: { flexDirection: 'row', justifyContent: 'space-between' }, featureSmall: { color: '#c2cae0', fontSize: 11, fontWeight: '700' },
  sectionHeading: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 24 }, sectionTitle: { color: '#f2f5fa', fontSize: 16, fontWeight: '900', marginBottom: 12 }, sectionHint: { color: '#818cf8', fontSize: 11, marginBottom: 12 }, statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 11 }, statCard: { width: '48%', backgroundColor: '#111720', borderRadius: 17, borderColor: '#222b3a', borderWidth: 1, padding: 15 }, statIcon: { width: 32, height: 32, borderRadius: 10, alignItems: 'center', justifyContent: 'center' }, statValue: { color: '#fff', fontSize: 24, fontWeight: '900', marginTop: 12 }, statLabel: { color: '#7f899a', fontSize: 11, marginTop: 2 },
  quickRow: { gap: 11, paddingRight: 20 }, quickCard: { width: 118, backgroundColor: '#111720', borderColor: '#222b3a', borderWidth: 1, borderRadius: 16, padding: 13 }, quickIcon: { width: 34, height: 34, borderRadius: 11, alignItems: 'center', justifyContent: 'center' }, quickIconText: { fontWeight: '900' }, quickTitle: { color: '#e9edf5', fontSize: 12, fontWeight: '800', marginTop: 12 },
  screenTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 13, marginBottom: 20 }, titleIcon: { width: 48, height: 48, borderRadius: 15, alignItems: 'center', justifyContent: 'center' }, screenTitle: { color: '#fff', fontSize: 25, fontWeight: '900' }, screenSubtitle: { color: '#7d899c', fontSize: 12, marginTop: 3 }, searchInput: { color: '#fff', backgroundColor: '#111720', borderColor: '#283142', borderWidth: 1, borderRadius: 14, padding: 14, marginBottom: 14 },
  cardPressed: { opacity: .75, transform: [{ scale: .98 }] },
  profileAvatar: { width: 40, height: 40, borderRadius: 13, backgroundColor: '#312e81', alignItems: 'center', justifyContent: 'center' }, profileAvatarText: { color: '#c7d2fe', fontWeight: '900' }, profileName: { color: '#fff', fontSize: 13, fontWeight: '800' }, profileRole: { color: '#758196', fontSize: 9, marginTop: 3 }, logoutButton: { backgroundColor: '#3b1720', borderRadius: 10, paddingHorizontal: 10, paddingVertical: 8 }, logoutText: { color: '#fb7185', fontSize: 10, fontWeight: '800' },
  primaryButton: { backgroundColor: '#4f46e5', borderRadius: 14, minHeight: 48, alignItems: 'center', justifyContent: 'center', marginTop: 16, marginBottom: 12, shadowColor: '#4f46e5', shadowOpacity: .25, shadowRadius: 8, elevation: 4 }, primaryButtonText: { color: '#fff', fontSize: 13, fontWeight: '900' }, entityList: { gap: 9, marginTop: 8 }, entityRow: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: '#111720', borderColor: '#222c3c', borderWidth: 1, borderRadius: 15, padding: 13 }, entityAvatar: { width: 42, height: 42, borderRadius: 13, backgroundColor: '#252b4b', alignItems: 'center', justifyContent: 'center' }, entityAvatarText: { color: '#c7d2fe', fontWeight: '900', fontSize: 11 }, entityTitle: { color: '#edf1f7', fontSize: 13, fontWeight: '800' }, entitySubtitle: { color: '#737f92', fontSize: 10, marginTop: 4 }, chevron: { color: '#556176', fontSize: 24 },
  emptyState: { alignItems: 'center', backgroundColor: '#10151e', borderWidth: 1, borderColor: '#222b38', borderRadius: 20, padding: 30, marginTop: 18 }, emptyIcon: { color: '#4f5b70', fontSize: 30 }, emptyTitle: { color: '#e5e9f1', fontSize: 15, fontWeight: '800', marginTop: 12 }, emptyText: { color: '#6f7a8c', fontSize: 11, lineHeight: 17, textAlign: 'center', marginTop: 6 }, largeModuleIcon: { width: 62, height: 62, borderRadius: 20, alignItems: 'center', justifyContent: 'center' }, backButton: { alignSelf: 'flex-start', marginBottom: 16 }, backText: { color: '#818cf8', fontSize: 12, fontWeight: '800' },
  overlay: { flex: 1, backgroundColor: '#000b', alignItems: 'center', justifyContent: 'center', padding: 24 }, dialog: { width: '100%', backgroundColor: '#131923', borderColor: '#303a4c', borderWidth: 1, borderRadius: 24, padding: 22, alignItems: 'center' }, dialogIcon: { width: 52, height: 52, borderRadius: 17, alignItems: 'center', justifyContent: 'center' }, dialogTitle: { color: '#fff', fontSize: 18, fontWeight: '900', marginTop: 16 }, dialogText: { color: '#8490a3', fontSize: 12, lineHeight: 18, textAlign: 'center', marginTop: 8 }, cancelText: { color: '#8994a7', padding: 12, fontSize: 12 }, loadingWrap: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 18 }, loadingText: { color: '#788397', fontSize: 12 },
});

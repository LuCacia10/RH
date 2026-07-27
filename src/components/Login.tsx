import {useState} from 'react';
import type React from 'react';
import {LockKeyhole,User,LoaderCircle,Eye,EyeOff,MailCheck} from 'lucide-react';
import {AuthUser,LoginChallenge,startLogin,verifyLogin} from '../services/api';
import rhLogo from '../assets/images/rh-logo.svg';

export default function Login({onAuthenticated}:{onAuthenticated:(user:AuthUser)=>void}){
 const [username,setUsername]=useState('admin');
 const [password,setPassword]=useState('');
 const [showPassword,setShowPassword]=useState(false);
 const [challenge,setChallenge]=useState<LoginChallenge|null>(null);
 const [code,setCode]=useState('');
 const [error,setError]=useState('');
 const [loading,setLoading]=useState(false);

 const submit=async(e:React.FormEvent)=>{
  e.preventDefault();setLoading(true);setError('');
  try{
   if(challenge) onAuthenticated(await verifyLogin(challenge.challengeId,code));
   else setChallenge(await startLogin(username.trim(),password));
  }catch{
   setError(challenge?'Code invalide ou expiré.':'Identifiant, mot de passe ou envoi de l’e-mail incorrect.');
  }finally{setLoading(false);}
 };
 const restart=()=>{setChallenge(null);setCode('');setError('');};

 return <main className="min-h-screen bg-[#0A0C10] text-slate-200 grid place-items-center p-6"><div className="w-full max-w-md">
  <div className="flex items-center gap-3 mb-8 justify-center"><img src={rhLogo} alt="Logo de gestion des ressources humaines" className="w-12 h-12 object-contain rounded-2xl shadow-lg shadow-indigo-500/20"/><div><p className="text-[10px] font-bold tracking-[.22em] text-indigo-400">ÉTAT MALAGASY</p><h1 className="text-xl font-bold text-white">Connexion SGRH</h1></div></div>
  <form onSubmit={submit} className="bg-[#161B22] border border-white/10 rounded-2xl p-7 shadow-2xl space-y-5">
   <div><h2 className="text-lg font-semibold text-white">{challenge?'Vérification en deux étapes':'Accès sécurisé'}</h2><p className="text-sm text-slate-500 mt-1">{challenge?`Saisissez le code envoyé à ${challenge.emailMasked}.`:'Utilisez votre compte professionnel.'}</p></div>
   {!challenge&&<><label className="block text-xs font-semibold text-slate-400">Identifiant ou e-mail<div className="relative mt-2"><User className="absolute left-3 top-3 text-slate-500" size={17}/><input className="w-full rounded-xl border px-10 py-2.5" value={username} onChange={e=>setUsername(e.target.value)} autoComplete="username" required/></div></label>
   <label className="block text-xs font-semibold text-slate-400">Mot de passe<div className="relative mt-2"><LockKeyhole className="absolute left-3 top-3 text-slate-500" size={17}/><input className="w-full rounded-xl border px-10 py-2.5" type={showPassword?'text':'password'} value={password} onChange={e=>setPassword(e.target.value)} autoComplete="current-password" required/><button type="button" onClick={()=>setShowPassword(value=>!value)} className="absolute right-3 top-2.5 p-1 text-slate-500 hover:text-white" aria-label={showPassword?'Masquer le mot de passe':'Afficher le mot de passe'}>{showPassword?<EyeOff size={17}/>:<Eye size={17}/>}</button></div></label></>}
   {challenge&&<label className="block text-xs font-semibold text-slate-400">Code à 6 chiffres<div className="relative mt-2"><MailCheck className="absolute left-3 top-3 text-slate-500" size={17}/><input className="w-full rounded-xl border px-10 py-2.5 tracking-[.35em] text-center" value={code} onChange={e=>setCode(e.target.value.replace(/\D/g,'').slice(0,6))} inputMode="numeric" autoComplete="one-time-code" pattern="\d{6}" maxLength={6} autoFocus required/></div></label>}
   {error&&<p className="text-sm text-rose-400 bg-rose-500/10 border border-rose-500/20 rounded-lg p-3">{error}</p>}
   <button disabled={loading||(!!challenge&&code.length!==6)} className="w-full rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 text-white font-semibold py-3 flex justify-center gap-2">{loading&&<LoaderCircle className="animate-spin" size={18}/>} {challenge?'Vérifier le code':'Continuer'}</button>
   {challenge&&<button type="button" onClick={restart} className="w-full text-xs text-slate-400 hover:text-white">Revenir à la connexion</button>}
  </form>
 </div></main>;
}

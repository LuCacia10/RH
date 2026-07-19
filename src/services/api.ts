const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3030/api';
const TOKEN_KEY = 'sgrh_auth_token';
export interface AuthUser { id:number; username:string; email:string; roles:string[]; }
interface AuthResponse extends AuthUser { token:string|null; }
export const getStoredToken=()=>localStorage.getItem(TOKEN_KEY);
export const clearSession=()=>localStorage.removeItem(TOKEN_KEY);
const request=async(endpoint:string,options:RequestInit={})=>{
 const token=getStoredToken();
 const response=await fetch(`${API_BASE_URL}${endpoint}`,{...options,headers:{...(options.body?{'Content-Type':'application/json'}:{}),...(token?{Authorization:`Bearer ${token}`}:{ }),...options.headers}});
 if(response.status===401&&endpoint!=='/auth/login'){clearSession();window.dispatchEvent(new Event('sgrh:unauthorized'));}
 if(!response.ok)throw new Error(`API ${response.status}: ${response.statusText}`);
 return response.status===204?null:response.json();
};
export const login=async(username:string,password:string):Promise<AuthUser>=>{
 const response=await request('/auth/login',{method:'POST',body:JSON.stringify({username,password})}) as AuthResponse;
 if(!response.token)throw new Error('Jeton absent'); localStorage.setItem(TOKEN_KEY,response.token);
 const {token:_token,...user}=response; return user;
};
export const getCurrentUser=async():Promise<AuthUser>=>{const {token:_token,...user}=await request('/auth/me') as AuthResponse;return user;};
export const fetchData=async(endpoint:string)=>{try{return await request(endpoint);}catch(error){console.error(error);return null;}};
export const postData=(endpoint:string,data:unknown)=>request(endpoint,{method:'POST',body:JSON.stringify(data)});
export const putData=(endpoint:string,data:unknown)=>request(endpoint,{method:'PUT',body:JSON.stringify(data)});
export const deleteData=async(endpoint:string)=>{await request(endpoint,{method:'DELETE'});return true;};

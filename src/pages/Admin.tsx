import React, { useEffect, useState } from 'react';
import { collection, query, orderBy, onSnapshot, updateDoc, doc, deleteDoc, getDoc, setDoc } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { Calendar, MapPin, Phone, Mail, User as UserIcon, LogOut, CheckCircle, Clock, Trash2, ArrowLeft, CreditCard, Lightbulb } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [checkingAuth, setCheckingAuth] = useState(true);

  // Email Configuration State Hooks
  const [adminEmail, setAdminEmail] = useState('');
  const [smtpUser, setSmtpUser] = useState('');
  const [smtpPass, setSmtpPass] = useState('');
  const [smtpHost, setSmtpHost] = useState('smtp.gmail.com');
  const [smtpPort, setSmtpPort] = useState(465);
  const [isSavingSettings, setIsSavingSettings] = useState(false);
  const [settingsSaved, setSettingsSaved] = useState(false);

  useEffect(() => {
    const isAuth = sessionStorage.getItem('admin_authenticated') === 'true';
    setIsAuthenticated(isAuth);
    setCheckingAuth(false);
  }, []);

  useEffect(() => {
    let unsubscribe: () => void = () => {};
    if (isAuthenticated) {
      unsubscribe = fetchRequests();
      fetchEmailSettings();
    }
    return () => {
      unsubscribe();
    };
  }, [isAuthenticated]);

  const fetchEmailSettings = async () => {
    try {
      const docRef = doc(db, 'settings', 'email');
      const settingsSnap = await getDoc(docRef);
      if (settingsSnap.exists()) {
        const data = settingsSnap.data();
        setAdminEmail(data.adminEmail || '');
        setSmtpUser(data.smtpUser || '');
        setSmtpPass(data.smtpPass || '');
        setSmtpHost(data.smtpHost || 'smtp.gmail.com');
        setSmtpPort(data.smtpPort || 465);
      }
    } catch (err) {
      console.error("Erro ao buscar configurações de email:", err);
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingSettings(true);
    setSettingsSaved(false);
    try {
      const docRef = doc(db, 'settings', 'email');
      await setDoc(docRef, {
        adminEmail,
        smtpUser,
        smtpPass,
        smtpHost,
        smtpPort
      });
      setSettingsSaved(true);
      setTimeout(() => setSettingsSaved(false), 3000);
    } catch (err) {
      console.error("Erro ao salvar configurações de email:", err);
      setError("Falha ao salvar configurações de email.");
    } finally {
      setIsSavingSettings(false);
    }
  };

  const fetchRequests = () => {
    setLoading(true);
    const q = query(collection(db, 'serviceRequests'), orderBy('createdAt', 'desc'));
    
    return onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setRequests(data);
      setLoading(false);
    }, (err : any) => {
      if (err && (err.code === 'permission-denied' || (err.message && err.message.includes('permission')))) {
        handleFirestoreError(err, OperationType.LIST, 'serviceRequests');
      }
      console.error(err);
      setError(`Erro ao carregar dados: ${err.message || 'Desconhecido'}`);
      setLoading(false);
    });
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!password) {
      setError('Por favor, digite a senha de acesso.');
      setLoading(false);
      return;
    }

    if (password === 'pateta14972021') {
      sessionStorage.setItem('admin_authenticated', 'true');
      setIsAuthenticated(true);
      setError('');
    } else {
      setError('Senha incorreta.');
    }
    setLoading(false);
  };

  const handleLogout = () => {
    sessionStorage.removeItem('admin_authenticated');
    setIsAuthenticated(false);
    setRequests([]);
  };

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      await updateDoc(doc(db, 'serviceRequests', id), { status: newStatus });
    } catch (err: any) {
      if (err && (err.code === 'permission-denied' || (err.message && err.message.includes('permission')))) {
        handleFirestoreError(err, OperationType.UPDATE, `serviceRequests/${id}`);
      }
      console.error("Failed to update status", err);
    }
  };

  const deleteRequest = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'serviceRequests', id));
    } catch (err: any) {
      if (err && (err.code === 'permission-denied' || (err.message && err.message.includes('permission')))) {
        handleFirestoreError(err, OperationType.DELETE, `serviceRequests/${id}`);
      }
      console.error("Failed to delete", err);
    }
  };

  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-[#05070d] flex items-center justify-center text-white font-sans">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-cyan-400 border-t-transparent animate-spin"></div>
          <p className="text-xs text-slate-400">Verificando sessão de segurança...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#05070d] flex flex-col items-center justify-center text-white p-6 relative overflow-hidden font-sans">
        {/* Ambient background mesh glows */}
        <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-cyan-500/5 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-purple-600/5 rounded-full blur-[100px] pointer-events-none" />

        <form onSubmit={handleLogin} className="max-w-md w-full border border-cyan-500/15 rounded-3xl p-8 bg-slate-950/60 backdrop-blur-md shadow-2xl relative z-10">
          <div className="relative w-16 h-16 rounded-full bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center mx-auto mb-6 shadow-[0_0_20px_rgba(6,182,212,0.15)]">
            <UserIcon className="w-8 h-8 text-cyan-400" />
          </div>
          <h1 className="text-2.5xl font-bold tracking-tight text-white mb-2 text-center bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-300">Painel do Integrador</h1>
          <p className="text-xs text-slate-400 mb-6 text-center">Digite sua senha de acesso para gerenciar os projetos SmartFlow.</p>
          
          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 text-left">Senha de Acesso</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-800 bg-slate-900/60 focus:border-cyan-400 focus:bg-slate-900 text-white placeholder-slate-600 text-sm focus:outline-none focus:ring-4 focus:ring-cyan-500/10 transition-all font-sans text-center tracking-widest"
                placeholder="••••••••"
                required
              />
            </div>
          </div>
          
          {error && <p className="text-red-400 text-xs mb-4 text-center">{error}</p>}

          <button 
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl font-bold text-center text-slate-950 bg-gradient-to-r from-cyan-400 to-teal-400 hover:from-cyan-300 hover:to-teal-300 shadow-[0_4px_25px_rgba(6,182,212,0.25)] transition-all duration-300 cursor-pointer disabled:opacity-50"
          >
            {loading ? 'Verificando...' : 'Entrar no Painel'}
          </button>
          
          <div className="mt-6 text-center">
            <Link to="/" className="text-xs text-slate-500 hover:text-cyan-400 transition-colors inline-flex items-center gap-1.5 font-medium">
              <ArrowLeft className="w-3.5 h-3.5" /> Voltar para o Site
            </Link>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#05070d] text-white font-sans selection:bg-cyan-500 selection:text-black relative overflow-x-hidden">
      {/* Background ambient mesh glows */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-cyan-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-[600px] h-[600px] bg-purple-600/5 rounded-full blur-[140px] pointer-events-none" />

      {/* Admin Header */}
      <header className="border-b border-cyan-500/10 bg-[#05070d]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-3 cursor-pointer select-none">
            <div className="relative w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-400 to-emerald-400 flex items-center justify-center p-[2px] shadow-[0_0_15px_rgba(6,182,212,0.4)]">
              <div className="w-full h-full rounded-full bg-[#05070d] flex items-center justify-center">
                <div className="w-2.5 h-2.5 rounded-full bg-gradient-to-tr from-cyan-400 to-emerald-400 animate-pulse" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-lg tracking-tight text-white flex items-center">
                SmartFlow <span className="text-[10px] font-semibold text-cyan-400 ml-1.5 px-1.5 py-0.5 rounded bg-cyan-950/50 border border-cyan-800/30 font-mono">Painel</span>
              </span>
            </div>
          </Link>
          
          <div className="flex items-center gap-4">
            {loading && <div className="w-4 h-4 rounded-full border-2 border-cyan-400 border-t-transparent animate-spin"></div>}
            <div className="text-xs font-mono text-slate-400 hidden sm:block bg-slate-900/40 px-2.5 py-1 rounded-md border border-slate-800">Acesso Administrativo</div>
            <button 
              onClick={handleLogout}
              className="text-xs border border-cyan-500/30 hover:bg-cyan-500/10 text-cyan-400 hover:text-white rounded-lg font-medium px-4 py-2 hover:border-cyan-400 transition-all flex items-center gap-2 cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              Sair
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12 relative z-10">
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl mb-8 flex items-center gap-3 text-sm">
            <span className="shrink-0">⚠️</span> {error}
          </div>
        )}

        {/* Configurações de E-mail Card */}
        <div className="mb-10 border border-cyan-500/15 rounded-3xl p-6 md:p-8 bg-slate-950/60 backdrop-blur-md shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-cyan-500 via-teal-400 to-purple-600 opacity-60" />
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-4 border-b border-cyan-500/10">
            <div>
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <span>⚙️</span> Configurações de E-mail & Registro
              </h3>
              <p className="text-slate-400 text-xs mt-1">
                Configure o e-mail do seu padrasto para guardar os detalhes e active o envio de recibos automáticos para os clientes.
              </p>
            </div>
          </div>

          <form onSubmit={handleSaveSettings} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                  E-mail Profissional do Seu Padrasto (Guarda info)
                </label>
                <input
                  type="email"
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-800 bg-slate-900/60 focus:border-cyan-400 focus:bg-slate-900 text-white placeholder-slate-600 text-sm focus:outline-none focus:ring-4 focus:ring-cyan-500/10 transition-all font-sans"
                  placeholder="Ex: padrastopro@empresa.com"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Seu E-mail Remetente SMTP (Servidor que envia)
                </label>
                <input
                  type="email"
                  value={smtpUser}
                  onChange={(e) => setSmtpUser(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-800 bg-slate-900/60 focus:border-cyan-400 focus:bg-slate-900 text-white placeholder-slate-600 text-sm focus:outline-none focus:ring-4 focus:ring-cyan-500/10 transition-all font-sans"
                  placeholder="Ex: patetadj_@gmail.com"
                />
              </div>
            </div>

            <div className="bg-slate-900/40 p-3.5 rounded-2xl border border-cyan-500/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest block">✈ Configuração Rápida do Servidor</span>
                <span className="text-[11px] text-slate-400 block mt-0.5">Preencha de forma automática os servidores padrão do Gmail ou do Outlook / Office365</span>
              </div>
              <div className="flex gap-2.5">
                <button
                  type="button"
                  onClick={() => {
                    setSmtpHost('smtp.gmail.com');
                    setSmtpPort(465);
                  }}
                  className="px-3.5 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-300 text-xs font-bold transition-all cursor-pointer border border-red-500/10"
                >
                  Gmail (Porta 465)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSmtpHost('smtp.office365.com');
                    setSmtpPort(587);
                  }}
                  className="px-3.5 py-2 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 text-blue-300 text-xs font-bold transition-all cursor-pointer border border-blue-500/10"
                >
                  Outlook / Hotmail
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Senha do SMTP (Senha de Aplicativo)
                </label>
                <input
                  type="password"
                  value={smtpPass}
                  onChange={(e) => setSmtpPass(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-800 bg-slate-900/60 focus:border-cyan-400 focus:bg-slate-900 text-white placeholder-slate-600 text-sm focus:outline-none focus:ring-4 focus:ring-cyan-500/10 transition-all font-sans"
                  placeholder="••••••••••••••••"
                />
              </div>
              
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Servidor Host SMTP
                </label>
                <input
                  type="text"
                  value={smtpHost}
                  onChange={(e) => setSmtpHost(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-800 bg-slate-900/60 focus:border-cyan-400 focus:bg-slate-900 text-white placeholder-slate-600 text-sm focus:outline-none focus:ring-4 focus:ring-cyan-500/10 transition-all font-sans"
                  placeholder="smtp.gmail.com"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Porta SMTP
                </label>
                <input
                  type="number"
                  value={smtpPort}
                  onChange={(e) => setSmtpPort(Number(e.target.value))}
                  className="w-full px-4 py-3 rounded-xl border border-slate-800 bg-slate-900/60 focus:border-cyan-400 focus:bg-slate-900 text-white placeholder-slate-600 text-sm focus:outline-none focus:ring-4 focus:ring-cyan-500/10 transition-all font-sans"
                  placeholder="465"
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
              <p className="text-[11px] text-slate-500 max-w-lg leading-relaxed">
                💡 <strong>Dica de Envio Real:</strong> Se usar Gmail como SMTP, crie uma <strong>"Senha de Aplicativo"</strong> da Conta Google em (Gerenciar Conta Google &gt; Segurança &gt; Senha de Aplicativo) para preencher a senha de SMTP com sucesso. Sem SMTP configurado, o sistema executa o modo simulador imprimindo nos logs.
              </p>
              
              <div className="flex items-center gap-4 self-end sm:self-auto">
                {settingsSaved && (
                  <span className="text-emerald-400 text-xs font-bold font-mono animate-pulse">
                    ✓ Salvo com Sucesso!
                  </span>
                )}
                <button
                  type="submit"
                  disabled={isSavingSettings}
                  className="px-6 py-3 rounded-xl font-bold text-xs text-slate-950 bg-gradient-to-r from-cyan-400 to-teal-400 hover:from-cyan-300 hover:to-teal-300 shadow-[0_4px_20px_rgba(6,182,212,0.25)] transition-all duration-300 cursor-pointer disabled:opacity-50"
                >
                  {isSavingSettings ? 'Salvando...' : 'Salvar Configurações'}
                </button>
              </div>
            </div>
          </form>
        </div>

        <div className="flex flex-col gap-8">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
              Solicitações Recebidas ({requests.length})
            </h2>
          </div>

          {requests.length === 0 && !loading && !error ? (
            <div className="text-center py-24 bg-slate-950/40 rounded-2xl border border-dashed border-cyan-500/10">
              <p className="text-slate-500">Nenhum pedido encontrado no momento.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {requests.map(req => (
                <div key={req.id} className="bg-slate-950/60 border border-cyan-500/15 rounded-2xl p-6 shadow-xl shadow-black/20 flex flex-col relative overflow-hidden transition-all duration-300 hover:border-cyan-500/25">
                  <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-cyan-500 to-teal-500 opacity-60" />
                  
                  {/* Card Header (Status + Actions) */}
                  <div className="flex justify-between items-start mb-4">
                    <div className={`px-2.5 py-1 text-[10px] font-bold rounded-full uppercase tracking-wider border ${
                      req.status === 'completed' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                      req.status === 'contacted' ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20' :
                      'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
                    }`}>
                      {req.status === 'pending' ? 'Pendente' : req.status === 'contacted' ? 'Contatado' : 'Concluído'}
                    </div>
                    
                    <button 
                      onClick={() => deleteRequest(req.id)}
                      className="text-slate-500 hover:text-red-400 p-1 transition-colors cursor-pointer"
                      title="Excluir pedido"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Client Info */}
                  <div className="mb-5 pb-5 border-b border-cyan-500/10">
                    <h3 className="text-lg font-bold text-white mb-2">{req.clientName}</h3>
                    <div className="space-y-2 text-sm text-slate-400">
                      <p className="flex items-center gap-2">
                        <Phone className="w-3.5 h-3.5 text-cyan-400" /> 
                        <a 
                          href={`https://wa.me/${req.clientPhone.replace(/\D/g,'')}`} 
                          target="_blank" 
                          rel="noreferrer" 
                          className="hover:text-cyan-400 hover:underline inline-flex items-center font-medium"
                        >
                          {req.clientPhone}
                        </a>
                      </p>
                      {req.clientEmail && (
                        <p className="flex items-center gap-2">
                          <Mail className="w-3.5 h-3.5 text-cyan-400" /> 
                          <span className="break-all">{req.clientEmail}</span>
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Event Info */}
                  <div className="flex-1 space-y-4 mb-6">
                    <div>
                      <p className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider mb-1">Tipo de Serviço</p>
                      <p className="text-sm font-semibold text-slate-200">{req.eventType}</p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider mb-1 flex items-center gap-1"><Calendar className="w-3 h-3" /> Data</p>
                        <p className="text-sm text-slate-200">{req.eventDate ? new Date(req.eventDate).toLocaleDateString('pt-BR', {timeZone: 'UTC'}) : 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider mb-1 flex items-center gap-1"><MapPin className="w-3 h-3" /> Local</p>
                        <p className="text-sm text-slate-200 truncate" title={req.eventLocation}>{req.eventLocation}</p>
                      </div>
                    </div>

                    {req.equipments && req.equipments.length > 0 && (
                      <div>
                        <p className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider mb-1 flex items-center gap-1"><Lightbulb className="w-3 h-3" /> Soluções / Dispositivos</p>
                        <div className="flex flex-wrap gap-1.5 mt-1.5">
                          {req.equipments.map((eq: string) => (
                            <span key={eq} className="px-2 py-0.5 bg-cyan-950/40 text-cyan-300 border border-cyan-500/10 rounded text-[10px] whitespace-nowrap">
                              {eq}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {req.details && (
                      <div>
                        <p className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider mb-1">Notas adicionais / Observações</p>
                        <p className="text-xs text-slate-400 bg-slate-900/40 p-3 rounded-lg border border-cyan-500/5 max-h-24 overflow-y-auto w-full custom-scrollbar leading-relaxed font-sans text-left">
                          {req.details}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Controls */}
                  <div className="flex gap-2.5 mt-auto pt-4 border-t border-cyan-500/10">
                    {req.status === 'pending' && (
                      <button onClick={() => updateStatus(req.id, 'contacted')} className="flex-1 py-2.5 text-xs bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 active:scale-95 duration-100 rounded-xl transition-all border border-cyan-500/25 font-bold cursor-pointer">
                        Marcar como Contatado
                      </button>
                    )}
                    {(req.status === 'pending' || req.status === 'contacted') && (
                      <button onClick={() => updateStatus(req.id, 'completed')} className="flex-1 py-2.5 text-xs bg-gradient-to-r from-cyan-400 to-teal-400 hover:from-cyan-300 hover:to-teal-300 text-slate-950 px-4 active:scale-95 duration-100 rounded-xl font-bold transition-all flex items-center justify-center gap-1 cursor-pointer shadow-lg shadow-cyan-500/10">
                        <CheckCircle className="w-3.5 h-3.5" /> Concluir
                      </button>
                    )}
                    {req.status === 'completed' && (
                      <button onClick={() => updateStatus(req.id, 'pending')} className="w-full py-2.5 text-xs bg-slate-900/60 hover:bg-slate-800 text-slate-300 hover:text-white rounded-xl transition-all flex items-center justify-center gap-1.5 border border-slate-800 cursor-pointer">
                        <Clock className="w-3.5 h-3.5" /> Voltar para Pendente
                      </button>
                    )}
                  </div>

                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

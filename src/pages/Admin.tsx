import React, { useEffect, useState } from 'react';
import { collection, query, orderBy, onSnapshot, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Calendar, MapPin, Phone, Mail, User as UserIcon, LogOut, CheckCircle, Clock, Trash2, ArrowLeft, CreditCard, Lightbulb } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let unsubscribe: () => void = () => {};
    if (isAuthenticated) {
      unsubscribe = fetchRequests();
    }
    return () => {
      unsubscribe();
    };
  }, [isAuthenticated]);

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
    }, (err) => {
      console.error(err);
      setError(`Erro ao carregar dados: ${err.message || 'Desconhecido'}`);
      setLoading(false);
    });
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'pateta14972021') {
      setIsAuthenticated(true);
      setError('');
    } else {
      setError('Senha incorreta.');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setPassword('');
    setRequests([]);
  };

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      await updateDoc(doc(db, 'serviceRequests', id), { status: newStatus });
    } catch (err) {
      console.error("Failed to update status", err);
      alert("Erro ao atualizar status");
    }
  };

  const deleteRequest = async (id: string) => {
    if (!window.confirm("Tem certeza que deseja excluir este pedido?")) return;
    try {
      await deleteDoc(doc(db, 'serviceRequests', id));
    } catch (err) {
      console.error("Failed to delete", err);
      alert("Erro ao excluir pedido");
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[var(--bg)] flex flex-col items-center justify-center text-white p-6">
        <form onSubmit={handleLogin} className="max-w-md w-full bg-[var(--bg-soft)] border border-white/10 rounded-3xl p-8 text-center shadow-xl">
          <div className="w-16 h-16 bg-black/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-white/5">
            <UserIcon className="w-8 h-8 text-amber-500" />
          </div>
          <h1 className="text-2xl font-semibold tracking-tight text-white mb-2">Painel do Técnico</h1>
          <p className="text-sm text-slate-400 mb-6">Digite sua senha de acesso para gerenciar os pedidos.</p>
          
          <input 
            type="password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-500/50 transition-colors mb-4 text-center tracking-widest"
            placeholder="••••••••"
            required
          />
          
          {error && <p className="text-red-400 text-xs mb-4">{error}</p>}

          <button 
            type="submit"
            className="w-full py-3 px-4 rounded-xl bg-amber-500 text-slate-900 font-medium flex items-center justify-center gap-3 hover:bg-amber-400 transition-colors"
          >
            Entrar no Painel
          </button>
          
          <div className="mt-8">
            <Link to="/" className="text-sm text-slate-500 hover:text-amber-500 transition-colors inline-flex items-center gap-1">
              <ArrowLeft className="w-3 h-3" /> Voltar para o Site
            </Link>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg)] text-white font-sans selection:bg-amber-500/30">
      {/* Admin Header */}
      <header className="border-b border-white/10 bg-[var(--bg-soft)] sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <h1 className="font-semibold text-lg tracking-tight text-white">Dashboard do Técnico</h1>
            {loading && <div className="w-4 h-4 rounded-full border-2 border-amber-500 border-t-transparent animate-spin"></div>}
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-sm text-slate-400 hidden sm:block">Acesso Administrativo</div>
            <button 
              onClick={handleLogout}
              className="px-4 py-2 text-sm rounded-lg border border-slate-700 hover:bg-slate-800 transition-colors flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              Sair
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12">
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl mb-8 flex items-center gap-3 text-sm">
            <span className="shrink-0">⚠️</span> {error}
          </div>
        )}

        <div className="flex flex-col gap-8">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold tracking-tight">Pedidos Recentes ({requests.length})</h2>
          </div>

          {requests.length === 0 && !loading && !error ? (
            <div className="text-center py-24 bg-[var(--bg-soft)] rounded-2xl border border-dashed border-white/10">
              <p className="text-[#8a8377]">Nenhum pedido encontrado no momento.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {requests.map(req => (
                <div key={req.id} className="bg-[var(--bg-soft)] border border-white/5 rounded-2xl p-6 shadow-lg shadow-black/20 flex flex-col">
                  
                  {/* Card Header (Status + Actions) */}
                  <div className="flex justify-between items-start mb-4">
                    <div className={`px-2.5 py-1 text-xs font-medium rounded-full uppercase tracking-wider ${
                      req.status === 'completed' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                      req.status === 'contacted' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                      'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                    }`}>
                      {req.status === 'pending' ? 'Pendente' : req.status === 'contacted' ? 'Contatado' : 'Concluído'}
                    </div>
                    
                    <button 
                      onClick={() => deleteRequest(req.id)}
                      className="text-slate-600 hover:text-red-400 p-1 transition-colors"
                      title="Excluir pedido"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Client Info */}
                  <div className="mb-5 pb-5 border-b border-white/5">
                    <h3 className="text-lg font-medium text-white mb-3">{req.clientName}</h3>
                    <div className="space-y-2 text-sm text-slate-400">
                      <p className="flex items-center gap-2"><Phone className="w-3.5 h-3.5" /> <a href={`https://wa.me/${req.clientPhone.replace(/\D/g,'')}`} target="_blank" rel="noreferrer" className="hover:text-amber-400 hover:underline">{req.clientPhone}</a></p>
                      <p className="flex items-center gap-2"><Mail className="w-3.5 h-3.5" /> {req.clientEmail}</p>
                    </div>
                  </div>

                  {/* Event Info */}
                  <div className="flex-1 space-y-4 mb-6">
                    <div>
                      <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">Evento</p>
                      <p className="text-sm text-slate-200">{req.eventType}</p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1 flex items-center gap-1"><Calendar className="w-3 h-3" /> Data</p>
                        <p className="text-sm text-slate-200">{req.eventDate ? new Date(req.eventDate).toLocaleDateString('pt-BR') : 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1 flex items-center gap-1"><MapPin className="w-3 h-3" /> Local</p>
                        <p className="text-sm text-slate-200 truncate" title={req.eventLocation}>{req.eventLocation}</p>
                      </div>
                    </div>

                    {req.equipments && req.equipments.length > 0 && (
                      <div>
                        <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1 flex items-center gap-1"><Lightbulb className="w-3 h-3" /> Equipamentos</p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {req.equipments.map((eq: string) => (
                            <span key={eq} className="px-2 py-0.5 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded text-[11px] whitespace-nowrap">
                              {eq}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {req.details && (
                      <div>
                        <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">Detalhes</p>
                        <p className="text-sm text-slate-400 bg-slate-950 p-3 rounded-lg border border-white/5 max-h-24 overflow-y-auto w-full custom-scrollbar leading-relaxed">
                          {req.details}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Controls */}
                  <div className="flex gap-2 mt-auto">
                    {req.status === 'pending' && (
                      <button onClick={() => updateStatus(req.id, 'contacted')} className="flex-1 py-2 text-sm bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 rounded-lg transition-colors border border-blue-500/20 font-medium">
                        Marcar como Contatado
                      </button>
                    )}
                    {(req.status === 'pending' || req.status === 'contacted') && (
                      <button onClick={() => updateStatus(req.id, 'completed')} className="flex-1 py-2 text-sm bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 rounded-lg transition-colors border border-emerald-500/20 font-medium flex items-center justify-center gap-1">
                        <CheckCircle className="w-4 h-4" /> Concluir
                      </button>
                    )}
                    {req.status === 'completed' && (
                      <button onClick={() => updateStatus(req.id, 'pending')} className="w-full py-2 text-sm bg-slate-800 text-slate-400 hover:bg-slate-700 rounded-lg transition-colors flex items-center justify-center gap-1 border border-white/5">
                        <Clock className="w-4 h-4" /> Voltar para Pendente
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

import React, { useState } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Check, 
  MapPin, 
  Phone, 
  User, 
  Calendar, 
  Home, 
  Layers, 
  MessageSquare, 
  CheckCircle, 
  AlertCircle 
} from 'lucide-react';

const TECHNICIAN_PHONE = "5512988212915"; 

export default function Orcamento() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [waLink, setWaLink] = useState('');
  const [isCepLoading, setIsCepLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    clientName: '',
    clientPhone: '',
    eventType: '',
    eventLocation: '',
    eventDate: '',
    equipments: [] as string[],
    details: '',
    cep: '',
    logradouro: '',
    numero: '',
    complemento: '',
    bairro: '',
    cidade: 'São José dos Campos'
  });

  const handleEquipmentChange = (value: string, checked: boolean) => {
    setFormData(prev => {
      if (checked) {
        return { ...prev, equipments: [...prev.equipments, value] };
      } else {
        return { ...prev, equipments: prev.equipments.filter(item => item !== value) };
      }
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleCepChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value;
    let raw = val.replace(/\D/g, '');
    
    if (raw.length > 8) {
      raw = raw.slice(0, 8);
    }
    
    let formatted = raw;
    if (raw.length > 5) {
      formatted = `${raw.slice(0, 5)}-${raw.slice(5)}`;
    }
    
    setFormData(prev => ({ ...prev, cep: formatted }));
    
    if (raw.length === 8) {
      setIsCepLoading(true);
      try {
        const response = await fetch(`https://viacep.com.br/ws/${raw}/json/`);
        const data = await response.json();
        if (!data.erro) {
          setFormData(prev => ({
            ...prev,
            logradouro: data.logradouro || '',
            bairro: data.bairro || '',
            cidade: data.localidade && data.localidade.toLowerCase().includes('jacareí') ? 'Jacareí' : 'São José dos Campos'
          }));
        } else {
          console.warn("CEP não encontrado");
        }
      } catch (err) {
        console.error("Erro ao buscar CEP:", err);
      } finally {
        setIsCepLoading(false);
      }
    }
  };

  const nextStep = () => {
    if (step === 1) {
      if (!formData.clientName || !formData.clientPhone) {
        alert("Por favor, preencha seus dados de contato.");
        return;
      }
      setStep(2);
    }
  };

  const prevStep = () => setStep(1);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.eventType || !formData.eventDate || !formData.logradouro || !formData.numero) {
      alert("Por favor, preencha o tipo de serviço, a data desejada e o endereço completo (Rua e Número).");
      return;
    }

    setIsSubmitting(true);
    
    try {
      const fullAddress = `${formData.logradouro}, ${formData.numero}${formData.complemento ? ' - ' + formData.complemento : ''}, ${formData.bairro}, ${formData.cidade} - CEP: ${formData.cep}`;
      const locationToSave = formData.eventLocation ? `${formData.eventLocation} (${fullAddress})` : fullAddress;

      // Grava no Firebase
      await addDoc(collection(db, 'serviceRequests'), {
        ...formData,
        eventLocation: locationToSave,
        paymentMethod: 'whatsapp_negotiate',
        status: 'pending',
        createdAt: serverTimestamp()
      });

      const eqs = formData.equipments.length > 0 ? formData.equipments.join(', ') : 'A combinar';

      const messageText = `Olá, meu nome é ${formData.clientName}. Acabei de gerar meu resumo SmartFlow!

🔧 Objetivo Smart de Automação:
${formData.eventType}

📅 Data desejada da visita:
${formData.eventDate}

🏡 Endereço do Projeto:
${locationToSave}

📲 Dispositivos Selecionados:
${eqs}

📝 Notas adicionais / Observações:
${formData.details || 'Nenhuma'}`;

      const waUrl = `https://wa.me/${TECHNICIAN_PHONE}?text=${encodeURIComponent(messageText)}`;
      
      setWaLink(waUrl);
      setStep(3);
      
      // Auto-abrir na nova aba comercial sem pop-ups agressivos
      window.open(waUrl, '_blank');
    } catch (err: any) {
      if (err && (err.code === 'permission-denied' || (err.message && err.message.includes('permission')))) {
        handleFirestoreError(err, OperationType.WRITE, 'serviceRequests');
      }
      console.error(err);
      alert("Houve um erro ao enviar a solicitação. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-[#05070d] text-white min-h-screen font-sans flex flex-col relative overflow-x-hidden selection:bg-cyan-500 selection:text-black">
      {/* Background ambient mesh glows */}
      <div className="absolute top-0 right-1/4 w-[400px] h-[400px] bg-cyan-500/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-[500px] h-[500px] bg-purple-600/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Top Navbar */}
      <nav className="border-b border-cyan-500/10 bg-[#05070d]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer select-none" onClick={() => navigate('/')}>
            <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-cyan-400 to-emerald-400 flex items-center justify-center p-[2px] shadow-[0_0_10px_rgba(6,182,212,0.5)]">
              <div className="w-full h-full rounded-full bg-[#05070d] flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-cyan-400" />
              </div>
            </div>
            <span className="font-bold text-lg text-white tracking-tight flex items-center">
              SmartFlow <span className="text-xs font-normal text-cyan-400 ml-1.5 px-1 bg-cyan-950/50 border border-cyan-800/30">Home</span>
            </span>
          </div>
          
          <button 
            onClick={() => navigate('/')} 
            className="text-xs sm:text-sm font-medium text-slate-400 hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar ao Início
          </button>
        </div>
      </nav>

      {/* Main Content Area */}
      <div className="flex-1 flex items-center justify-center py-16 px-6 relative z-10">
        <div className="w-full max-w-[680px]">
          
          <div className="border border-cyan-500/15 rounded-3xl bg-slate-950/60 backdrop-blur-md shadow-2xl overflow-hidden">
            {/* Form head badge & titles */}
            <div className="p-8 md:p-10 border-b border-cyan-500/10 bg-slate-950/40">
              <div className="inline-flex items-center gap-1 px-3 py-1 bg-cyan-950/50 border border-cyan-500/20 rounded-full text-[10px] text-cyan-400 font-bold uppercase tracking-wider mb-3">
                Painel do Cliente
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Planejar Automação Residencial</h2>
              <p className="text-slate-400 text-sm">Defina seus objetivos, rotinas domésticas e agende uma consultoria especializada.</p>
            </div>

            {/* Dynamic Step body content */}
            <div className="p-8 md:p-10">
              
              {/* Stepper indicator index */}
              <div className="flex items-center gap-4 mb-8">
                <div className={`flex-1 h-1.5 rounded-full transition-colors duration-300 ${step >= 1 ? 'bg-gradient-to-r from-cyan-500 to-teal-500' : 'bg-slate-800'}`} />
                <div className={`flex-1 h-1.5 rounded-full transition-colors duration-300 ${step >= 2 ? 'bg-gradient-to-r from-cyan-500 to-teal-500' : 'bg-slate-800'}`} />
                <div className={`flex-1 h-1.5 rounded-full transition-colors duration-300 ${step >= 3 ? 'bg-gradient-to-r from-cyan-500 to-teal-500' : 'bg-slate-800'}`} />
              </div>

              {step === 1 && (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-widest flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-cyan-400" /> Nome Completo
                    </label>
                    <input 
                      name="clientName" 
                      value={formData.clientName} 
                      onChange={handleChange} 
                      placeholder="Ex: Carlos Santos" 
                      type="text" 
                      className="w-full px-4 py-3.5 rounded-xl border border-slate-800 bg-slate-900/60 focus:border-cyan-400 focus:bg-slate-900 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-4 focus:ring-cyan-500/10 transition-all font-sans"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-widest flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-cyan-400" /> WhatsApp / Telegram
                    </label>
                    <input 
                      name="clientPhone" 
                      value={formData.clientPhone} 
                      onChange={handleChange} 
                      placeholder="(12) 99999-9999" 
                      type="tel" 
                      className="w-full px-4 py-3.5 rounded-xl border border-slate-800 bg-slate-900/60 focus:border-cyan-400 focus:bg-slate-900 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-4 focus:ring-cyan-500/10 transition-all font-sans"
                    />
                  </div>

                  <div className="pt-4">
                    <button 
                      onClick={nextStep} 
                      className="w-full py-3.5 rounded-xl font-bold text-center text-slate-950 bg-gradient-to-r from-cyan-400 to-teal-400 hover:from-cyan-300 hover:to-teal-300 shadow-[0_4px_20px_rgba(6,182,212,0.25)] transition-all duration-300 cursor-pointer text-xs sm:text-sm"
                    >
                      Avançar para o Projeto
                    </button>
                  </div>
                </div>
              )}

              {step === 2 && (
                <form onSubmit={handleSubmit} className="space-y-6">
                  
                  {/* Select focus option */}
                  <div className="space-y-2">
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-widest flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5 text-cyan-400" /> Foco do Projeto
                    </label>
                    <select 
                      name="eventType" 
                      value={formData.eventType} 
                      onChange={handleChange}
                      className="w-full px-4 py-3.5 rounded-xl border border-slate-800 bg-slate-900 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-400 focus:ring-4 focus:ring-cyan-500/10 transition-all font-sans"
                    >
                      <option value="">Selecione um foco principal...</option>
                      <option value="Configurar Alexa e Assistentes (Rotinas de voz)">Configurar Alexa e Assistentes (Rotinas de voz)</option>
                      <option value="Automação Completa de Iluminação (Spots, fitas LED)">Automação Completa de Iluminação (Spots, fitas LED)</option>
                      <option value="Instalação de Interruptores e Elétrica Smart">Instalação de Interruptores e Elétrica Smart</option>
                      <option value="Acessos e Segurança (Fechaduras, câmeras, sensores)">Acessos e Segurança (Fechaduras, câmeras, sensores)</option>
                      <option value="Configuração Geral de Rede Wi-Fi & Dispositivos">Configuração Geral de Rede Wi-Fi & Dispositivos</option>
                      <option value="Outro objetivo de automação">Outro objetivo de automação</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="block text-xs font-semibold text-slate-300 uppercase tracking-widest flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-cyan-400" /> Data sugerida para visita
                      </label>
                      <input 
                        name="eventDate" 
                        value={formData.eventDate} 
                        onChange={handleChange} 
                        type="date" 
                        className="w-full px-4 py-3.5 rounded-xl border border-slate-800 bg-slate-900/60 focus:border-cyan-400 text-white text-sm focus:outline-none focus:ring-4 focus:ring-cyan-500/10 transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-xs font-semibold text-slate-300 uppercase tracking-widest flex items-center gap-1.5">
                        <Home className="w-3.5 h-3.5 text-cyan-400" /> Tipo do Imóvel / Sobrado
                      </label>
                      <input 
                        name="eventLocation" 
                        value={formData.eventLocation} 
                        onChange={handleChange} 
                        placeholder="Ex: Apartamento, sobrado, casa térrea" 
                        type="text" 
                        className="w-full px-4 py-3.5 rounded-xl border border-slate-800 bg-slate-900/60 focus:border-cyan-400 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-4 focus:ring-cyan-500/10 transition-all"
                      />
                    </div>
                  </div>

                  {/* CEP Input */}
                  <div className="space-y-2">
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-widest flex items-center justify-between gap-1.5">
                      <span className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-cyan-400" /> CEP (Preenchimento Automático)
                      </span>
                      {isCepLoading && (
                        <span className="text-[10px] text-cyan-400 font-mono animate-pulse lowercase">
                          Buscando endereço...
                        </span>
                      )}
                    </label>
                    <div className="relative">
                      <input 
                        name="cep" 
                        value={formData.cep} 
                        onChange={handleCepChange} 
                        placeholder="12200-000" 
                        type="text" 
                        maxLength={9} 
                        className="w-full px-4 py-3.5 rounded-xl border border-slate-800 bg-slate-900/60 focus:border-cyan-400 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-4 focus:ring-cyan-500/10 transition-all font-sans"
                      />
                      {isCepLoading && (
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-2 border-cyan-400 border-t-transparent animate-spin" />
                      )}
                    </div>
                  </div>

                  {/* Address Section */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2 md:col-span-2">
                      <label className="block text-xs font-semibold text-slate-400">Rua / Logradouro</label>
                      <input 
                        name="logradouro" 
                        value={formData.logradouro} 
                        onChange={handleChange} 
                        placeholder="Nome da rua" 
                        type="text" 
                        className="w-full px-4 py-3 rounded-xl border border-slate-800 bg-slate-900/40 focus:border-cyan-400 text-white placeholder-slate-600 text-xs focus:outline-none focus:ring-4"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-xs font-semibold text-slate-400">Número</label>
                      <input 
                        name="numero" 
                        value={formData.numero} 
                        onChange={handleChange} 
                        placeholder="Ex: 110" 
                        type="text" 
                        className="w-full px-4 py-3 rounded-xl border border-slate-800 bg-slate-900/40 focus:border-cyan-400 text-white placeholder-slate-600 text-xs focus:outline-none focus:ring-4"
                      />
                    </div>
                  </div>

                  {/* Additional address line */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <label className="block text-xs font-semibold text-slate-400">Complemento</label>
                      <input 
                        name="complemento" 
                        value={formData.complemento} 
                        onChange={handleChange} 
                        placeholder="Bloco, apto..." 
                        type="text" 
                        className="w-full px-4 py-3 rounded-xl border border-slate-800 bg-slate-900/40 focus:border-cyan-400 text-white placeholder-slate-600 text-xs focus:outline-none"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-xs font-semibold text-slate-400">Bairro</label>
                      <input 
                        name="bairro" 
                        value={formData.bairro} 
                        onChange={handleChange} 
                        placeholder="Ex: Urbanova" 
                        type="text" 
                        className="w-full px-4 py-3 rounded-xl border border-slate-800 bg-slate-900/40 focus:border-cyan-400 text-white placeholder-slate-600 text-xs focus:outline-none"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-xs font-semibold text-slate-400">Cidade (Atendimento exclusivo)</label>
                      <select 
                        name="cidade" 
                        value={formData.cidade} 
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl border border-slate-800 bg-slate-900/40 text-white text-xs focus:outline-none focus:border-cyan-400"
                      >
                        <option value="São José dos Campos">São José dos Campos</option>
                        <option value="Jacareí">Jacareí</option>
                      </select>
                    </div>
                  </div>

                  {/* Beautiful Device Selection Checklist - Glossy container */}
                  <div className="space-y-3 pt-2">
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-widest">
                      Quais aparelhos você gostaria de programar?
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {[
                        "Dispositivos Alexa (Echo Dot, Show)",
                        "Assistentes Google Nest / Home",
                        "Interruptores de Toque (Wi-Fi/Zigbee)",
                        "Lâmpadas & Fitas de LED RGB",
                        "Fechaduras Eletrônicas",
                        "Câmeras de Segurança",
                        "Sensores de Presença / Portas"
                      ].map(eq => {
                        const isChecked = formData.equipments.includes(eq);
                        return (
                          <label 
                            key={eq} 
                            className={`flex items-center gap-3 p-3.5 rounded-xl border cursor-pointer transition-all duration-300 ${
                              isChecked 
                                ? 'bg-cyan-500/10 border-cyan-400 text-cyan-200 shadow-[0_0_12px_rgba(6,182,212,0.15)]' 
                                : 'bg-slate-900/40 border-slate-900 hover:border-slate-800 text-slate-300'
                            }`}
                          >
                            <input 
                              type="checkbox" 
                              value={eq} 
                              checked={isChecked} 
                              onChange={(e) => handleEquipmentChange(eq, e.target.checked)}
                              className="w-4.5 h-4.5 shrink-0 rounded border-slate-850 text-cyan-500 focus:ring-cyan-500/30"
                            />
                            <span className="text-xs sm:text-xs font-medium leading-none">{eq}</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>

                  {/* Details */}
                  <div className="space-y-2">
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-widest flex items-center gap-1.5">
                      <MessageSquare className="w-3.5 h-3.5 text-cyan-400" /> Notas adicionais ou Dúvidas
                    </label>
                    <textarea 
                      name="details" 
                      value={formData.details} 
                      onChange={handleChange} 
                      placeholder="Ex: Gostaria de criar uma rotina para simular presença na TV, configurar acendimento automático na cozinha..." 
                      className="w-full px-4 py-3 rounded-xl border border-slate-800 bg-slate-900/60 focus:border-cyan-400 text-white placeholder-slate-650 text-xs focus:outline-none focus:ring-4 focus:ring-cyan-500/10 min-h-[90px]"
                    />
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-4 pt-4">
                    <button 
                      type="button" 
                      onClick={prevStep} 
                      className="flex-shrink-0 px-4 py-3.5 sm:px-6 sm:py-4 rounded-xl border border-slate-800 text-xs sm:text-sm font-semibold hover:bg-white/5 transition-colors cursor-pointer"
                    >
                      Voltar
                    </button>
                    <button 
                      type="submit" 
                      disabled={isSubmitting} 
                      className="flex-grow py-3.5 sm:py-4 rounded-xl font-bold text-center text-slate-950 bg-gradient-to-r from-cyan-400 to-teal-400 hover:from-cyan-300 hover:to-teal-300 shadow-[0_4px_20px_rgba(6,182,212,0.3)] transition-all duration-300 cursor-pointer disabled:opacity-50 text-xs sm:text-sm"
                    >
                      {isSubmitting ? 'Gerando o seu Projeto...' : 'Finalizar & Ir para WhatsApp'}
                    </button>
                  </div>

                </form>
              )}

              {step === 3 && (
                <div className="text-center py-10 space-y-6">
                  <div className="w-20 h-20 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full flex items-center justify-center mx-auto shadow-[0_0_25px_rgba(16,185,129,0.25)] animate-bounce">
                    <CheckCircle className="w-10 h-10" />
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-2xl font-bold text-white">Projeto de Automação Mapeado!</h3>
                    <p className="text-slate-400 text-xs sm:text-sm max-w-sm mx-auto leading-relaxed">
                      Seu resumo técnico foi salvo com sucesso na nuvem. Vamos definir o melhor horário para sua visita via chat!
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-cyan-950/20 border border-cyan-500/10 flex items-center gap-3 max-w-md mx-auto text-left text-xs text-cyan-300 mb-6">
                    <AlertCircle className="w-5 h-5 shrink-0" />
                    <span>Se a nova aba comercial do WhatsApp não abriu automaticamente no seu navegador, clique no botão destacado abaixo para iniciar seu chat.</span>
                  </div>

                  <div className="pt-2">
                    <a 
                      href={waLink} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="inline-block px-6 py-3.5 sm:px-10 sm:py-4 bg-[#00b289] hover:bg-[#00ca9a] text-white rounded-xl font-bold shadow-xl shadow-emerald-500/20 hover:-translate-y-0.5 transition-transform cursor-pointer text-xs sm:text-sm"
                    >
                      Iniciar Conversa no WhatsApp
                    </a>
                  </div>
                </div>
              )}

            </div>
          </div>

          <p className="text-center text-[11px] text-slate-600 mt-6 font-mono">
            SmartFlow Home Automação Residencial SJC e Jacareí.
          </p>

        </div>
      </div>
    </div>
  );
}

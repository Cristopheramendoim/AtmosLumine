import React, { useState } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useNavigate } from 'react-router-dom';

const TECHNICIAN_PHONE = "5512988212915"; 

export default function Orcamento() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [waLink, setWaLink] = useState('');
  
  const [formData, setFormData] = useState({
    clientName: '',
    clientPhone: '',
    clientEmail: '',
    eventType: '',
    eventLocation: '',
    eventDate: '',
    equipments: [] as string[],
    paymentMethod: 'pix',
    details: '',
    cep: '',
    logradouro: '',
    numero: '',
    complemento: '',
    bairro: '',
    cidade: 'São José dos Campos'
  });

  const handleEquipmentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
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
    let cep = e.target.value.replace(/\D/g, '');
    setFormData(prev => ({ ...prev, cep: e.target.value }));
    
    if (cep.length === 8) {
      try {
        const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
        const data = await response.json();
        if (!data.erro) {
          setFormData(prev => ({
            ...prev,
            logradouro: data.logradouro || '',
            bairro: data.bairro || '',
            cidade: data.localidade === 'Jacareí' ? 'Jacareí' : 'São José dos Campos'
          }));
        }
      } catch (err) {
        console.error("Erro ao buscar CEP:", err);
      }
    }
  };

  const nextStep = () => {
    if (step === 1 && (!formData.clientName || !formData.clientPhone || !formData.clientEmail)) {
      alert("Por favor, preencha seus dados de contato.");
      return;
    }
    if (step === 2 && (!formData.eventType || !formData.eventDate || !formData.logradouro || !formData.numero)) {
      alert("Por favor, preencha os dados do evento e o endereço completo.");
      return;
    }
    setStep(s => Math.min(s + 1, 4));
  };
  const prevStep = () => setStep(s => Math.max(s - 1, 1));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const fullAddress = `${formData.logradouro}, ${formData.numero}${formData.complemento ? ' - ' + formData.complemento : ''}, ${formData.bairro}, ${formData.cidade} - CEP: ${formData.cep}`;
      const locationToSave = formData.eventLocation ? `${formData.eventLocation} (${fullAddress})` : fullAddress;

      await addDoc(collection(db, 'serviceRequests'), {
        ...formData,
        eventLocation: locationToSave,
        status: 'pending',
        createdAt: serverTimestamp()
      });

      await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          eventLocation: locationToSave
        })
      });

      const paymentDisplayMap: Record<string, string> = {
        pix: "Pix",
        credit_card: "Cartão de Crédito",
        ted: "TED / Transferência",
        negotiate: "A combinar"
      };
      const pMethod = paymentDisplayMap[formData.paymentMethod] || formData.paymentMethod;
      const eqs = formData.equipments.length > 0 ? `\nEquipamentos de interesse: ${formData.equipments.join(', ')}` : '';

      const text = `Olá, meu nome é ${formData.clientName}. Gostaria de solicitar um serviço de iluminação para um(a) ${formData.eventType} no dia ${formData.eventDate}.\n\nLocal: ${locationToSave}\nForma de Pagamento preferida: ${pMethod}${eqs}\n\nMais detalhes: ${formData.details}`;
      const waUrl = `https://wa.me/${TECHNICIAN_PHONE}?text=${encodeURIComponent(text)}`;
      
      setWaLink(waUrl);
      setStep(4);
      
      // Tenta abrir o WhatsApp automaticamente
      window.open(waUrl, '_blank');
      // Caso seja bloqueado por pop-up, o usuário ainda pode clicar no link do passo 4
    } catch (err) {
      console.error(err);
      alert("Houve um erro ao enviar a solicitação. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <nav className="lumina-nav border-b border-[var(--line)]">
        <div className="wrap w-full flex items-center justify-between">
          <div className="brand cursor-pointer" onClick={() => navigate('/')}>
            <div className="brand-mark"></div>
            Atmos
          </div>
          <button onClick={() => navigate('/')} className="text-sm font-medium text-[var(--ink-dim)] hover:text-white transition-colors">
            Voltar ao Início
          </button>
        </div>
      </nav>

      <div className="flex-1 flex items-center justify-center py-12 px-6">
        <div className="w-full max-w-[640px]">
          <div className="form-shell w-full shadow-2xl">
            <div className="form-head">
              <div className="eyebrow mb-2">Solicitação</div>
              <h2>Configure seu Projeto</h2>
              <p>Preencha os detalhes e vamos conectar você a um técnico.</p>
            </div>
            <div className="form-body">
              <div className="progress">
                <div className={`bar ${step >= 1 ? 'active' : ''}`}></div>
                <div className={`bar ${step >= 2 ? 'active' : ''}`}></div>
                <div className={`bar ${step >= 3 ? 'active' : ''}`}></div>
                <div className={`bar ${step >= 4 ? 'active' : ''}`}></div>
              </div>

              {step === 1 && (
                <div>
                  <div className="field">
                    <label>Nome Completo</label>
                    <input name="clientName" value={formData.clientName} onChange={handleChange} placeholder="Seu nome" type="text" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="field">
                      <label>WhatsApp</label>
                      <input name="clientPhone" value={formData.clientPhone} onChange={handleChange} placeholder="(11) 99999-9999" type="tel" />
                    </div>
                    <div className="field">
                      <label>E-mail</label>
                      <input name="clientEmail" value={formData.clientEmail} onChange={handleChange} placeholder="exemplo@email.com" type="email" />
                    </div>
                  </div>
                  <div className="step-actions mt-4">
                    <button onClick={nextStep} className="btn-next">Próximo Passo</button>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div>
                  <div className="field">
                    <label>Tipo de Evento</label>
                    <select name="eventType" value={formData.eventType} onChange={handleChange}>
                      <option value="">Selecione...</option>
                      <option value="Show de Banda / Artista">Show de Banda / Artista</option>
                      <option value="Teatro / Apresentação">Teatro / Apresentação</option>
                      <option value="Evento Corporativo">Evento Corporativo</option>
                      <option value="Casamento / Formatura">Casamento / Formatura</option>
                      <option value="Outro">Outro</option>
                    </select>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="field">
                      <label>Data do Evento</label>
                      <input name="eventDate" value={formData.eventDate} onChange={handleChange} type="date" />
                    </div>
                    <div className="field">
                      <label>Nome do Local (Opcional)</label>
                      <input name="eventLocation" value={formData.eventLocation} onChange={handleChange} placeholder="Ex: Espaço das Américas" type="text" />
                    </div>
                  </div>
                  
                  <div className="field">
                    <label>CEP</label>
                    <input name="cep" value={formData.cep} onChange={handleCepChange} placeholder="12345-678" type="text" maxLength={9} />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="field md:col-span-2">
                      <label>Endereço</label>
                      <input name="logradouro" value={formData.logradouro} onChange={handleChange} placeholder="Rua / Avenida" type="text" />
                    </div>
                    <div className="field">
                      <label>Número</label>
                      <input name="numero" value={formData.numero} onChange={handleChange} placeholder="123" type="text" />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="field">
                      <label>Complemento</label>
                      <input name="complemento" value={formData.complemento} onChange={handleChange} placeholder="Apto, Sala" type="text" />
                    </div>
                    <div className="field">
                      <label>Bairro</label>
                      <input name="bairro" value={formData.bairro} onChange={handleChange} placeholder="Centro" type="text" />
                    </div>
                    <div className="field">
                      <label>Cidade</label>
                      <select name="cidade" value={formData.cidade} onChange={handleChange}>
                        <option value="São José dos Campos">São José dos Campos</option>
                        <option value="Jacareí">Jacareí</option>
                      </select>
                    </div>
                  </div>
                  <div className="field">
                    <label>Equipamentos de Interesse (opcional)</label>
                    <div className="grid grid-cols-1 gap-2 mt-2">
                       {[
                         "Par LEDs / Refletores",
                         "Moving Heads",
                         "Máquinas de Fumaça ou Haze",
                         "Varal de Luzes / Cortinas de LED",
                         "Painel de LED"
                       ].map(eq => (
                         <label key={eq} className="flex items-center gap-3 p-3 rounded-xl border border-[rgba(20,18,15,0.14)] bg-white cursor-pointer hover:border-amber-500/50 transition-colors" style={{ display: 'flex', fontSize: '14px', fontWeight: 500, color: '#2a2620', margin: 0 }}>
                           <input 
                             type="checkbox" 
                             value={eq} 
                             checked={formData.equipments.includes(eq)} 
                             onChange={handleEquipmentChange}
                             className="w-4 h-4 text-amber-500 focus:ring-amber-500 border-gray-300 rounded" 
                             style={{ width: 'auto', padding: 0 }}
                           />
                           {eq}
                         </label>
                       ))}
                    </div>
                  </div>
                  <div className="field">
                    <label>Detalhes do Projeto</label>
                    <textarea name="details" value={formData.details} onChange={handleChange} placeholder="Descreva brevemente o que você precisa..."></textarea>
                  </div>
                  <div className="step-actions mt-4">
                    <button onClick={prevStep} className="btn-back">Voltar</button>
                    <button onClick={nextStep} className="btn-next">Próximo Passo</button>
                  </div>
                </div>
              )}

              {step === 3 && (
                <form onSubmit={handleSubmit}>
                  <div className="mb-6">
                    <label className="block text-[13px] font-semibold text-[#6b6458] mb-3 tracking-[0.01em]">Selecione a Forma de Pagamento Preferida</label>
                    <div className="pay-tabs">
                      <div className={`pay-tab ${formData.paymentMethod === 'pix' ? 'active' : ''}`} onClick={() => setFormData({...formData, paymentMethod: 'pix'})}>
                        Pix / TED
                      </div>
                      <div className={`pay-tab ${formData.paymentMethod === 'credit_card' ? 'active' : ''}`} onClick={() => setFormData({...formData, paymentMethod: 'credit_card'})}>
                        Cartão de Crédito
                      </div>
                      <div className={`pay-tab ${formData.paymentMethod === 'negotiate' ? 'active' : ''}`} onClick={() => setFormData({...formData, paymentMethod: 'negotiate'})}>
                        A Combinar
                      </div>
                    </div>
                    
                    {formData.paymentMethod === 'pix' && (
                      <div className="text-sm text-[#8a8377] p-4 bg-[#f3efe6] rounded-xl border border-[rgba(20,18,15,0.06)]">
                         Os dados bancários ou do Pix serão fornecidos pelo técnico no WhatsApp após a confirmação dos detalhes do evento.
                       </div>
                    )}
                    {formData.paymentMethod === 'credit_card' && (
                      <div className="text-sm text-[#8a8377] p-4 bg-[#f3efe6] rounded-xl border border-[rgba(20,18,15,0.06)]">
                         O pagamento via Cartão de Crédito será processado de forma segura através do link de cobrança que o técnico enviará.
                      </div>
                    )}
                    {formData.paymentMethod === 'negotiate' && (
                      <div className="text-sm text-[#8a8377] p-4 bg-[#f3efe6] rounded-xl border border-[rgba(20,18,15,0.06)]">
                         Escolha esta opção se preferir discutir as formas de pagamento durante a avaliação do que o seu evento necessita.
                      </div>
                    )}
                  </div>
                  <div className="step-actions mt-8">
                    <button type="button" onClick={prevStep} className="btn-back">Voltar</button>
                    <button type="submit" disabled={isSubmitting} className="btn-submit">
                      {isSubmitting ? 'Finalizando...' : 'Enviar Pedido para Técnico'}
                    </button>
                  </div>
                </form>
              )}

              {step === 4 && (
                <div className="text-center py-8">
                  <div className="w-20 h-20 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="font-serif text-2xl font-semibold mb-2">Pedido Enviado!</h3>
                  <p className="text-sm text-[#8a8377] mb-6 max-w-sm mx-auto">Deixamos uma aba pronta para você conversar com o técnico! Caso o WhatsApp não tenha aberto automaticamente, clique no botão abaixo.</p>
                  <a href={waLink} target="_top" rel="noreferrer" className="inline-block px-8 py-4 bg-[#e8a93a] text-[#1a1410] rounded-xl font-semibold text-[15px] shadow-lg shadow-amber-500/20 hover:-translate-y-1 transition-transform">
                    Ir para o WhatsApp
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Mic, 
  Lightbulb, 
  Shield, 
  Tv, 
  MessageSquare, 
  Check, 
  ChevronRight, 
  Star, 
  Play, 
  Eye, 
  Volume2, 
  Sparkles, 
  Phone, 
  ArrowRight,
  Tablet,
  Laptop,
  CheckCircle,
  HelpCircle
} from 'lucide-react';

const TECHNICIAN_PHONE = "5512988212915";

export default function Home() {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const openWhatsApp = (customText?: string) => {
    const text = customText || "Olá! Gostaria de conversar com um especialista da SmartFlow sobre automação inteligente para minha residência.";
    
    // Google Tag track click
    if (typeof (window as any).gtag === 'function') {
      (window as any).gtag('event', 'click_whatsapp', {
        'event_category': 'Contact',
        'event_label': 'Conversa com Especialista'
      });
    }

    window.open(`https://wa.me/${TECHNICIAN_PHONE}?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="bg-[#05070d] text-white min-h-screen font-sans selection:bg-cyan-500 selection:text-black overflow-x-hidden">
      {/* Dynamic ambient background mesh glows */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-cyan-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-[800px] right-1/4 w-[600px] h-[600px] bg-blue-600/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/3 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Header Sticky Navbar */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-[#05070d]/90 backdrop-blur-md py-4 border-b border-cyan-500/10' : 'bg-transparent py-6'
      }`}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          {/* Logo with clean glowing system ring */}
          <div className="flex items-center gap-3 cursor-pointer select-none" onClick={() => navigate('/')} onDoubleClick={() => navigate('/admin')}>
            <div className="relative w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-400 to-emerald-400 flex items-center justify-center p-[2px] shadow-[0_0_15px_rgba(6,182,212,0.5)]">
              <div className="w-full h-full rounded-full bg-[#05070d] flex items-center justify-center">
                <div className="w-2.5 h-2.5 rounded-full bg-gradient-to-tr from-cyan-400 to-emerald-400 animate-pulse" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-xl tracking-tight text-white flex items-center">
                SmartFlow <span className="text-xs font-normal text-cyan-400 ml-1.5 px-1.5 py-0.5 rounded bg-cyan-950/50 border border-cyan-800/30">Home</span>
              </span>
            </div>
          </div>

          {/* Navigation Links centered */}
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
            <a href="#inicio" className="hover:text-cyan-400 transition-colors">Início</a>
            <a href="#servicos" className="hover:text-cyan-400 transition-colors">Serviços</a>
            <a href="#como-funciona" className="hover:text-cyan-400 transition-colors">Como Funciona</a>
            <a href="#testemunhas" className="hover:text-cyan-400 transition-colors">Quem Somos</a>
            <a href="#contato" className="hover:text-cyan-400 transition-colors">Contato</a>
          </div>

          {/* Top CTA buttons */}
          <div className="flex items-center gap-2 sm:gap-4">
            <button 
              onClick={() => navigate('/orcamento')} 
              className="hidden sm:block bg-transparent hover:bg-white/5 text-xs sm:text-sm text-cyan-400 hover:text-white border border-cyan-500/30 hover:border-cyan-400 px-4 py-2 rounded-lg font-medium transition-all duration-300 cursor-pointer"
            >
              Agendar Visita
            </button>
            <button 
              onClick={() => navigate('/orcamento')} 
              className="bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-400 hover:to-teal-400 text-[10px] xs:text-xs sm:text-sm text-[#05070d] px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg font-semibold shadow-[0_0_13px_rgba(6,182,212,0.3)] transition-all duration-300 hover:scale-105 cursor-pointer whitespace-nowrap"
            >
              Criar Meu Projeto
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="inicio" className="pt-32 pb-24 px-6 max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Hero text credentials */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            <div className="inline-flex items-center gap-2 self-start px-3 py-1.5 rounded-full bg-cyan-950/40 border border-cyan-500/20 text-xs font-semibold tracking-wider text-cyan-300 uppercase mb-6 shadow-[0_0_15px_rgba(6,182,212,0.1)]">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              Atuação Exclusiva: SJC e Jacareí
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.1] mb-6">
              Sua Casa Inteligente <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400">
                do Seu Jeito
              </span>
            </h1>
            
            <p className="text-base sm:text-lg text-slate-300 max-w-xl mb-8 leading-relaxed">
              Configuração profissional de Alexa, iluminação inteligente e sistemas de segurança para o máximo conforto. Não vendemos aparelhos avulsos; entregamos a integração perfeita de rotinas inteligentes adaptadas ao seu cotidiano.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <button 
                onClick={() => openWhatsApp("Olá! Quero tirar uma dúvida com um especialista e saber mais sobre as soluções de casa inteligente da SmartFlow.")}
                className="w-full sm:w-auto px-5 py-3 sm:px-8 sm:py-4 rounded-xl font-bold text-white bg-[#00b289] hover:bg-[#00ca9a] flex items-center justify-center gap-3 transition-all duration-300 hover:-translate-y-0.5 shadow-[0_4px_20px_rgba(0,178,137,0.4)] cursor-pointer text-sm sm:text-base"
              >
                <Phone className="w-4 h-4 sm:w-5 sm:h-5 fill-current" />
                Falar com um Especialista
              </button>
              
              <button 
                onClick={() => navigate('/orcamento')}
                className="w-full sm:w-auto px-5 py-3 sm:px-8 sm:py-4 rounded-xl font-bold text-cyan-300 hover:text-white bg-slate-900/80 hover:bg-slate-800/80 border border-cyan-500/20 hover:border-cyan-400 flex items-center justify-center gap-2 transition-all duration-300 cursor-pointer text-sm sm:text-base"
              >
                Planejar Orçamento
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Hero Banner Image Box */}
          <div className="lg:col-span-5 relative">
            <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/10 to-teal-500/5 rounded-3xl blur-2xl -z-10" />
            <div className="relative border border-cyan-500/20 p-2.5 rounded-3xl bg-slate-950/60 backdrop-blur-sm shadow-2xl">
              <img 
                src="https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=700&q=80" 
                alt="Smart Home Cosy Living Room" 
                className="w-full h-[320px] sm:h-[400px] object-cover rounded-2xl"
                referrerPolicy="no-referrer"
              />
              <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-[#05070d]/80 border border-white/5 backdrop-blur-md flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-white text-sm">Residência Sintonizada</h4>
                  <p className="text-xs text-slate-400 font-mono">Controle de Iluminação e Voz</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 animate-spin-slow" />
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Circular Glowing Icon Highlights Section */}
      <section className="py-16 bg-[#03050a]/40 border-y border-slate-900 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-xl mx-auto mb-12">
            <h2 className="text-xs uppercase tracking-widest text-cyan-400 font-bold mb-2">Conceito Inteligente</h2>
            <p className="text-2xl font-semibold text-white">Nossos Serviços</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            
            {/* Feature 1 */}
            <div className="flex flex-col items-center p-6 bg-slate-950/30 rounded-2xl border border-slate-900">
              <div className="w-16 h-16 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 flex items-center justify-center shadow-[0_0_20px_rgba(6,182,212,0.1)] mb-4">
                <Mic className="w-8 h-8" />
              </div>
              <h3 className="font-semibold text-lg text-white mb-2">Configuração Alexa</h3>
              <p className="text-sm text-slate-400 leading-relaxed max-w-xs">
                Configurando profissionalmente sua Alexa, integração inteligente, configuração da sua rede de som e alarmes de voz.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="flex flex-col items-center p-6 bg-slate-950/30 rounded-2xl border border-slate-900">
              <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.1)] mb-4">
                <Lightbulb className="w-8 h-8" />
              </div>
              <h3 className="font-semibold text-lg text-white mb-2">Iluminação Inteligente</h3>
              <p className="text-sm text-slate-400 leading-relaxed max-w-xs">
                Iluminação inteligente e sutil. Desenho personalizado de luzes indiretas e fitas de LED para valorizar o melhor do seu lar.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="flex flex-col items-center p-6 bg-slate-950/30 rounded-2xl border border-slate-900">
              <div className="w-16 h-16 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center justify-center shadow-[0_0_20px_rgba(59,130,246,0.1)] mb-4">
                <Shield className="w-8 h-8" />
              </div>
              <h3 className="font-semibold text-lg text-white mb-2">Segurança Residencial</h3>
              <p className="text-sm text-slate-400 leading-relaxed max-w-xs">
                Segurança inteligente com câmeras remotas, notificações imediatas e monitoramento em tempo real para dar total conforto à sua família.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* 4 Glowing Cards Section (Nossos Serviços e Dispositivos) */}
      <section id="servicos" className="py-24 px-6 max-w-7xl mx-auto relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-cyan-950/50 border border-cyan-500/20 rounded-full text-xs text-cyan-400 font-semibold uppercase mb-4 tracking-wider">
            Sincronia Completa
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mb-4">
            Nossos Serviços e Dispositivos
          </h2>
          <p className="text-slate-400 text-lg">
            Transformamos sua casa em um lar inteligente com tecnologia integrada e fácil de usar.
          </p>
        </div>

        {/* 4 Cards Grid - Beautiful shadows */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          
          {/* Card 1 */}
          <div className="p-8 rounded-2xl border border-cyan-500/15 bg-slate-950/60 backdrop-blur-sm hover:border-cyan-400/40 transition-all duration-300 hover:shadow-[0_0_30px_rgba(6,182,212,0.15)] group relative flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center mb-6 border border-cyan-500/20">
                <Mic className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Configuração de Alexa/Echo Dot</h3>
              <p className="text-slate-300 text-sm leading-relaxed mb-6">
                Integração completa dos assistentes de voz, criação de rotinas personalizadas e controle total de casa por comando de voz. Deixe o sistema responder ao que você deseja ouvir.
              </p>
            </div>
            <button 
              onClick={() => navigate('/orcamento')}
              className="inline-flex items-center gap-2 self-start text-xs font-semibold uppercase tracking-wider text-cyan-400 group-hover:text-cyan-300 transition-colors bg-cyan-500/5 hover:bg-cyan-500/10 border border-cyan-500/20 px-5 py-2.5 rounded-lg w-full sm:w-auto text-center justify-center cursor-pointer"
            >
              Solicitar Orçamento
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Card 2 */}
          <div className="p-8 rounded-2xl border border-cyan-500/15 bg-slate-950/60 backdrop-blur-sm hover:border-cyan-400/40 transition-all duration-300 hover:shadow-[0_0_30px_rgba(6,182,212,0.15)] group relative flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center mb-6 border border-cyan-500/20">
                <Lightbulb className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Iluminação Inteligente</h3>
              <p className="text-slate-300 text-sm leading-relaxed mb-6">
                Controle a intensidade, cor e agendamento das luzes via app ou voz. Economia de energia garantida e cenários de iluminação ideais para cada momento (ex: modo leitura, jantar ou cinema).
              </p>
            </div>
            <button 
              onClick={() => navigate('/orcamento')}
              className="inline-flex items-center gap-2 self-start text-xs font-semibold uppercase tracking-wider text-cyan-400 group-hover:text-cyan-300 transition-colors bg-cyan-500/5 hover:bg-cyan-500/10 border border-cyan-500/20 px-5 py-2.5 rounded-lg w-full sm:w-auto text-center justify-center cursor-pointer"
            >
              Solicitar Orçamento
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Card 3 */}
          <div className="p-8 rounded-2xl border border-cyan-500/15 bg-slate-950/60 backdrop-blur-sm hover:border-cyan-400/40 transition-all duration-300 hover:shadow-[0_0_30px_rgba(6,182,212,0.15)] group relative flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center mb-6 border border-cyan-500/20">
                <Shield className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Segurança e Câmeras</h3>
              <p className="text-slate-300 text-sm leading-relaxed mb-6">
                Monitoramento remoto, sensores de movimento e fechaduras digitais. Mantenha sua família segura de onde estiver e destranque portas diretamente do smartphone para convidados autorizados.
              </p>
            </div>
            <button 
              onClick={() => navigate('/orcamento')}
              className="inline-flex items-center gap-2 self-start text-xs font-semibold uppercase tracking-wider text-cyan-400 group-hover:text-cyan-300 transition-colors bg-cyan-500/5 hover:bg-cyan-500/10 border border-cyan-500/20 px-5 py-2.5 rounded-lg w-full sm:w-auto text-center justify-center cursor-pointer"
            >
              Solicitar Orçamento
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Card 4 */}
          <div className="p-8 rounded-2xl border border-cyan-500/15 bg-slate-950/60 backdrop-blur-sm hover:border-cyan-400/40 transition-all duration-300 hover:shadow-[0_0_30px_rgba(6,182,212,0.15)] group relative flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center mb-6 border border-cyan-500/20">
                <Tv className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Entretenimento e Home Theater</h3>
              <p className="text-slate-300 text-sm leading-relaxed mb-6">
                Experiência de cinema em casa com áudio e vídeo integrados de altíssima fidelidade. Controle TVs, projetores, receivers e canais de streaming com um único toque ou comando de voz.
              </p>
            </div>
            <button 
              onClick={() => navigate('/orcamento')}
              className="inline-flex items-center gap-2 self-start text-xs font-semibold uppercase tracking-wider text-cyan-400 group-hover:text-cyan-300 transition-colors bg-cyan-500/5 hover:bg-cyan-500/10 border border-cyan-500/20 px-5 py-2.5 rounded-lg w-full sm:w-auto text-center justify-center cursor-pointer"
            >
              Solicitar Orçamento
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

        </div>

        {/* Small horizontal newsletter or notice bar */}
        <div className="p-8 rounded-2xl border border-emerald-500/20 bg-gradient-to-r from-emerald-950/20 to-slate-950/80 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-[0_0_20px_rgba(16,185,129,0.05)]">
          <p className="text-slate-300 font-medium text-center sm:text-left text-sm sm:text-base">
            Pronto para começar seu projeto de automação? <span className="text-emerald-400 font-semibold">Fale conosco agora.</span>
          </p>
          <button 
            onClick={() => openWhatsApp("Olá! Quero começar um projeto de automação e gostaria de agendar uma conversa com um analista.")}
            className="w-full sm:w-auto px-5 py-3 rounded-lg bg-[#00b289] hover:bg-[#00ca9a] text-xs sm:text-sm font-bold text-white flex items-center justify-center gap-2.5 shadow-md shadow-emerald-500/20 transition-all duration-300 hover:-translate-y-0.5 cursor-pointer"
          >
            <Phone className="w-4 h-4 fill-current" />
            Falar no WhatsApp
          </button>
        </div>
      </section>

      {/* Honest Scope Clarifications (What we do vs What we don't) */}
      <section className="py-20 px-6 max-w-7xl mx-auto relative z-10">
        <div className="p-8 md:p-12 rounded-3xl bg-slate-950/40 border border-slate-900 shadow-2xl backdrop-blur-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            
            {/* Left Col: No */}
            <div className="flex flex-col">
              <div className="self-start px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-[10px] font-bold text-rose-400 uppercase tracking-wider mb-4">
                NÃO VENDEMOS APARELHOS
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Transparência na Aquisição</h3>
              <p className="text-slate-300 text-sm leading-relaxed">
                Nós <span className="text-[#f7cd8a] font-medium">não embutimos margem sobre dispositivos</span>. Você tem total liberdade para comprar os aparelhos e marcas favoritas (Amazon Echo, interruptores Sonoff, Tuya, Intelbras ou Philips Hue, etc.) onde preferir ou em qualquer e-commerce. Nós enviamos o link ideal e cuidamos da fiação, engenharia e configuração do software.
              </p>
            </div>

            {/* Right Col: Yes */}
            <div className="flex flex-col border-t md:border-t-0 md:border-l border-slate-900 pt-8 md:pt-0 md:pl-12">
              <div className="self-start px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-[10px] font-bold text-cyan-400 uppercase tracking-wider mb-4">
                NÓS FAZEMOS
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Instalação, Engenharia e Configuração</h3>
              <p className="text-slate-300 text-sm leading-relaxed">
                Nossos integradores certificados testam sua cobertura de rede Wi-Fi, executam instalações físicas de interruptores touch elegantes com total segurança do padrão ABNT, realizam a configuração inteligente das contas e criam rotinas sofisticadas integradas a sensores.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Process Flow pipeline: Como Funciona (Screenshot 3) */}
      <section id="como-funciona" className="py-24 px-6 max-w-7xl mx-auto relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-cyan-950/50 border border-cyan-500/20 rounded-full text-xs text-cyan-400 font-semibold uppercase mb-4 tracking-wider">
            Passo a Passo
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mb-4">
            Como Funciona o Nosso Atendimento Inteligente
          </h2>
          <p className="text-slate-400 text-lg">
            Seu caminho simples e rápido para uma casa automatizada e conectada de verdade.
          </p>
        </div>

        {/* 4 Steps timeline cards with connecting pipeline curves */}
        <div className="relative">
          
          {/* Connecting cyan neon path line for desktop */}
          <div className="hidden lg:block absolute top-[40%] left-[10%] right-[10%] h-[3px] bg-gradient-to-r from-cyan-400 via-teal-400 to-purple-500 blur-[1.5px] -z-10" />
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            
            {/* Step 1 */}
            <div className="p-6 rounded-2xl border border-cyan-500/10 bg-[#070b13]/80 backdrop-blur-md relative flex flex-col justify-between h-full group hover:border-cyan-400/30 transition-all duration-300">
              <div>
                <div className="relative w-full h-[180px] rounded-xl overflow-hidden mb-6 border border-white/5 bg-slate-900 flex items-center justify-center p-3">
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-purple-500/5" />
                  {/* Miniature beautiful interactive chat UI representation */}
                  <div className="w-full bg-[#05070d] rounded-lg p-2.5 border border-cyan-500/10 text-[10px] font-mono leading-tight space-y-2">
                    <div className="bg-[#00b289]/10 text-[#00b289] p-1.5 rounded-lg border border-[#00b289]/20 flex items-center gap-1.5 self-start w-[80%]">
                      <MessageSquare className="w-3 h-3 text-emerald-400 shrink-0" />
                      <span>Olá! Quero automatizar minha casa SJC</span>
                    </div>
                    <div className="bg-slate-900 border border-slate-800 p-1.5 rounded-lg text-slate-300 w-[80%] ml-auto text-right">
                      <span>Olá! Perfeito, vamos agendar uma avaliação! 💡</span>
                    </div>
                  </div>
                </div>
                <h4 className="font-bold text-lg text-white mb-2">1. Conversa Inicial via WhatsApp</h4>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                  Fale com nossa equipe para entender suas necessidades, tirar dúvidas sobre marcas e alinhar seus objetivos iniciais.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="p-6 rounded-2xl border border-cyan-500/10 bg-[#070b13]/80 backdrop-blur-md relative flex flex-col justify-between h-full group hover:border-cyan-400/30 transition-all duration-300">
              <div>
                <div className="relative w-full h-[180px] rounded-xl overflow-hidden mb-6 border border-white/5 bg-slate-900 flex items-center justify-center p-3">
                  <div className="absolute inset-0 bg-gradient-to-br from-teal-500/5 to-cyan-500/5" />
                  {/* Miniature beautiful interactive technician mockup */}
                  <div className="w-full text-center space-y-2 font-mono text-[10px]">
                    <div className="relative w-12 h-12 bg-cyan-500/10 text-cyan-400 rounded-full flex items-center justify-center mx-auto border border-cyan-500/20 shadow-[0_0_15px_rgba(6,182,212,0.15)] mb-1">
                      <Tablet className="w-6 h-6 animate-pulse" />
                    </div>
                    <div className="bg-slate-950 p-1.5 rounded border border-white/5 text-slate-300 text-[9px]">
                      Mapeando Rede WiFi: 85% Excelente
                    </div>
                  </div>
                </div>
                <h4 className="font-bold text-lg text-white mb-2">2. Avaliação do Local e Dispositivos</h4>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                  Nossos especialistas visitam sua residência para mapear a rede, analisar o quadro elétrico e planejar as furações ideais.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="p-6 rounded-2xl border border-cyan-500/10 bg-[#070b13]/80 backdrop-blur-md relative flex flex-col justify-between h-full group hover:border-cyan-400/30 transition-all duration-300">
              <div>
                <div className="relative w-full h-[180px] rounded-xl overflow-hidden mb-6 border border-white/5 bg-slate-900 flex items-center justify-center p-3">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5" />
                  {/* Miniature dynamic Quotation list representation */}
                  <div className="w-full bg-[#05070d] rounded-lg p-3 border border-purple-500/15 font-mono text-[8px] text-slate-300 space-y-1.5 shadow-lg">
                    <div className="border-b border-white/5 pb-1 flex justify-between font-bold text-purple-400">
                      <span>Proposta Técnica</span>
                      <span>Total</span>
                    </div>
                    <div className="flex justify-between">
                      <span>• Instalação Fiação Touch</span>
                      <span>Incluso</span>
                    </div>
                    <div className="flex justify-between">
                      <span>• Rotina Geral Alexa</span>
                      <span>Incluso</span>
                    </div>
                    <div className="bg-purple-500/10 text-purple-400 p-1 rounded font-bold text-center mt-1">
                      Proposta customizada gerada!
                    </div>
                  </div>
                </div>
                <h4 className="font-bold text-lg text-white mb-2">3. Orçamento Personalizado</h4>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                  Receba uma proposta sob medida, com os links dos aparelhos corretos e detalhamento total do custo do serviço técnico.
                </p>
              </div>
            </div>

            {/* Step 4 */}
            <div className="p-6 rounded-2xl border border-cyan-500/10 bg-[#070b13]/80 backdrop-blur-md relative flex flex-col justify-between h-full group hover:border-cyan-400/30 transition-all duration-300">
              <div>
                <div className="relative w-full h-[180px] rounded-xl overflow-hidden mb-6 border border-white/5 bg-slate-900 flex items-center justify-center p-3">
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-cyan-500/5" />
                  {/* Miniature connection indicators */}
                  <div className="text-center space-y-2">
                    <div className="w-10 h-10 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center mx-auto shadow-[0_0_15px_rgba(16,185,129,0.2)]">
                      <CheckCircle className="w-5 h-5" />
                    </div>
                    <p className="text-[10px] font-mono text-emerald-400">"Alexa, ligar cinema"</p>
                    <div className="flex justify-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce" />
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce delay-100" />
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce delay-200" />
                    </div>
                  </div>
                </div>
                <h4 className="font-bold text-lg text-white mb-2">4. Instalação e Configuração</h4>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                  Realizamos a fiação física, encaixes, cadastro nas contas oficiais da Amazon/Google e passamos o treinamento completo para usar.
                </p>
              </div>
            </div>

          </div>

        </div>

        {/* Big pulsing cyan gradient button below */}
        <div className="text-center mt-12 px-4">
          <button 
            onClick={() => navigate('/orcamento')}
            className="w-full sm:w-auto px-6 py-3.5 sm:px-10 sm:py-5 rounded-xl sm:rounded-2xl font-bold text-white text-xs sm:text-base md:text-lg bg-gradient-to-r from-cyan-500 via-teal-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 transition-all duration-300 hover:scale-105 shadow-[0_0_35px_rgba(6,182,212,0.45)] hover:shadow-[0_0_50px_rgba(6,182,212,0.6)] cursor-pointer"
          >
            Transformar Minha Casa Agora
          </button>
        </div>
      </section>

      {/* Customer Testimonials section: O Que Dizem... (Screenshot 1 middle) */}
      <section id="testemunhas" className="py-24 bg-[#03050a]/60 border-y border-slate-900 px-6 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-xs uppercase tracking-widest text-cyan-400 font-bold mb-2">Opinião Real</h2>
            <p className="text-3xl sm:text-4xl font-bold text-white">O Que Dizem Nossos Clientes</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Testimonial 1 */}
            <div className="p-8 rounded-2xl border border-slate-800 bg-[#05070d]/60 backdrop-blur-sm relative flex flex-col justify-between">
              <div>
                <div className="flex gap-1 mb-4 text-[#ffc107]">
                  <Star className="w-4 h-4 fill-current text-amber-400" />
                  <Star className="w-4 h-4 fill-current text-amber-400" />
                  <Star className="w-4 h-4 fill-current text-amber-400" />
                  <Star className="w-4 h-4 fill-current text-amber-400" />
                  <Star className="w-4 h-4 fill-current text-amber-400" />
                </div>
                <p className="text-slate-300 text-sm italic leading-relaxed mb-6">
                  "Empresa fantástica. O integrador veio até nossa casa no Urbanova SJC, avaliou toda nossa rede Wi-Fi e automatizou nossa sala e sala de jantar. Agora ligamos a TV, o ar e o som em conjunto pelo controle de voz. Ficou perfeito."
                </p>
              </div>
              <div className="flex items-center gap-3">
                <img 
                  src="/image/homem.jpeg" 
                  alt="Marcos Pinheiro SJC Cliente" 
                  className="w-10 h-10 rounded-full object-cover border border-cyan-500/30"
                  referrerPolicy="no-referrer"
                />
                <div>
                  <h4 className="font-semibold text-white text-sm">Marcos Pinheiro</h4>
                  <p className="text-xs text-slate-400 font-mono">São José dos Campos, SP</p>
                </div>
              </div>
            </div>

            {/* Testimonial 2 */}
            <div className="p-8 rounded-2xl border border-slate-800 bg-[#05070d]/60 backdrop-blur-sm relative flex flex-col justify-between">
              <div>
                <div className="flex gap-1 mb-4 text-[#ffc107]">
                  <Star className="w-4 h-4 fill-current text-amber-400" />
                  <Star className="w-4 h-4 fill-current text-amber-400" />
                  <Star className="w-4 h-4 fill-current text-amber-400" />
                  <Star className="w-4 h-4 fill-current text-amber-400" />
                  <Star className="w-4 h-4 fill-current text-amber-400" />
                </div>
                <p className="text-slate-300 text-sm italic leading-relaxed mb-6">
                  "Contratei a instalação para colocar interruptores inteligentes de toque na casa inteira. O integrador da SmartFlow refez as conexões com total segurança técnica e ensinou todos nós a configurar rotinas diárias na Alexa do quarto."
                </p>
              </div>
              <div className="flex items-center gap-3">
                <img 
                  src="/image/mulher_1.png" 
                  alt="Mariana Vasconcelos Jacareí Cliente" 
                  className="w-10 h-10 rounded-full object-cover border border-cyan-500/30 pointer-events-none select-none"
                  referrerPolicy="no-referrer"
                />
                <div>
                  <h4 className="font-semibold text-white text-sm">Mariana Vasconcelos</h4>
                  <p className="text-xs text-slate-400 font-mono">Jacareí, SP</p>
                </div>
              </div>
            </div>

            {/* Testimonial 3 */}
            <div className="p-8 rounded-2xl border border-slate-800 bg-[#05070d]/60 backdrop-blur-sm relative flex flex-col justify-between">
              <div>
                <div className="flex gap-1 mb-4 text-[#ffc107]">
                  <Star className="w-4 h-4 fill-current text-amber-400" />
                  <Star className="w-4 h-4 fill-current text-amber-400" />
                  <Star className="w-4 h-4 fill-current text-amber-400" />
                  <Star className="w-4 h-4 fill-current text-amber-400" />
                  <Star className="w-4 h-4 fill-current text-amber-400" />
                </div>
                <p className="text-slate-300 text-sm italic leading-relaxed mb-6">
                  "O atendimento superou nossas expectativas de segurança. As câmeras de monitoramento, fechaduras inteligentes completas e os sensores instalados nos permitem viajar com tranquilidade e controlar tudo com avisos no celular."
                </p>
              </div>
              <div className="flex items-center gap-3">
                <img 
                  src="/image/mulher_2.png" 
                  alt="Carolina Alvarenga SJC Cliente" 
                  className="w-10 h-10 rounded-full object-cover border border-cyan-500/30 placeholder-transparent select-none"
                  referrerPolicy="no-referrer"
                />
                <div>
                  <h4 className="font-semibold text-white text-sm">Carolina Alvarenga</h4>
                  <p className="text-xs text-slate-400 font-mono">São José dos Campos, SP</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Marcas Compatíveis (Screenshot 1 bottom portion) */}
      <section className="py-16 max-w-7xl mx-auto px-6 relative z-10 text-center">
        <h3 className="text-xs tracking-[0.15em] font-bold text-cyan-400 uppercase mb-8">
          Marcas e Ecossistemas Totalmente Compatíveis
        </h3>
        
        {/* Simple elegant badges/logos matching Screenshot 1 */}
        <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10">
          <div className="px-6 py-4 rounded-xl border border-slate-900 bg-slate-950/40 hover:border-cyan-500/20 hover:bg-slate-900/40 transition-colors flex items-center gap-3 cursor-pointer">
            <span className="font-bold text-white tracking-tight">amazon alexa</span>
            <span className="w-2 h-2 rounded-full bg-cyan-400" />
          </div>
          <div className="px-6 py-4 rounded-xl border border-slate-900 bg-slate-950/40 hover:border-cyan-500/20 hover:bg-slate-900/40 transition-colors flex items-center gap-3 cursor-pointer">
            <span className="font-bold text-white tracking-tight">Google Home</span>
            <span className="w-2 h-2 rounded-full bg-[#34a853]" />
          </div>
          <div className="px-6 py-4 rounded-xl border border-slate-900 bg-slate-950/40 hover:border-cyan-500/20 hover:bg-slate-900/40 transition-colors flex items-center gap-3 cursor-pointer">
            <span className="font-bold text-white tracking-tight">PHILIPS hue</span>
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
          </div>
          <div className="px-6 py-4 rounded-xl border border-slate-900 bg-slate-950/40 hover:border-cyan-500/20 hover:bg-slate-900/40 transition-colors flex items-center gap-3 cursor-pointer">
            <span className="font-bold text-white tracking-tight">Sonoff & Tuya</span>
            <span className="w-2 h-2 rounded-full bg-blue-500" />
          </div>
        </div>
      </section>

      {/* FAQ or Help Section */}
      <section id="contato" className="py-20 px-6 max-w-4xl mx-auto relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-2xl font-bold text-white mb-2">Possui alguma dúvida rápida?</h2>
          <p className="text-slate-400 text-sm">Separamos respostas rápidas para te deixar confortável com o seu projeto de automação.</p>
        </div>
        
        <div className="space-y-4">
          <div className="p-6 rounded-xl border border-slate-900 bg-slate-950/20">
            <h4 className="font-semibold text-white mb-2 flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-cyan-400" /> Qual marca de dispositivo devo comprar?
            </h4>
            <p className="text-xs sm:text-sm text-slate-400">
              Recomendamos marcas consolidadas como Sonoff, Tuya, Intelbras e Ekaza para interruptores, e lâmpadas Philips Hue ou Xiaomi para melhor fidelidade de cores. O integrador enviará os links exatos após entender seus objetivos.
            </p>
          </div>
          
          <div className="p-6 rounded-xl border border-slate-900 bg-slate-950/20">
            <h4 className="font-semibold text-white mb-2 flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-cyan-400" /> A fiação da minha casa antiga serve para o sistema?
            </h4>
            <p className="text-xs sm:text-sm text-slate-400">
              Sim! Conseguimos instalar relés inteligentes ocultos diretamente nas caixas de tomada/parede antigas ou passar o fio neutro exigido pelos interruptores modernos sem quebrar nenhuma parede.
            </p>
          </div>
        </div>
      </section>

      {/* Glowing horizontal divider line seen in Screenshot 1 */}
      <div className="relative w-full h-[3px] bg-gradient-to-r from-transparent via-cyan-400 via-emerald-400 to-transparent blur-[1px] opacity-70" />

      {/* Footer */}
      <footer className="bg-[#030509] py-16 px-6 text-slate-400 relative z-10 border-t border-slate-950">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          
          {/* Logo brand intro */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4 cursor-pointer select-none" onClick={() => navigate('/')}>
              <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-cyan-400 to-emerald-400 flex items-center justify-center p-[2px] shadow-[0_0_10px_rgba(6,182,212,0.5)]">
                <div className="w-full h-full rounded-full bg-[#05070d] flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-cyan-400" />
                </div>
              </div>
              <span className="font-bold text-lg text-white">SmartFlow Automação</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed mb-4 max-w-sm">
              Sintonizando sua residência com assistentes virtuais de inteligência artificial de forma segura, limpa e profissional nas regiões de SJC e Jacareí.
            </p>
            <div className="text-xs text-slate-500 font-mono">
              Atendimento exclusivo em residências e sobrados.
            </div>
          </div>

          {/* Links links */}
          <div>
            <h4 className="font-semibold text-white text-sm mb-4">Navegação</h4>
            <ul className="space-y-2 text-xs">
              <li><a href="#inicio" className="hover:text-cyan-400 transition-colors">Início</a></li>
              <li><a href="#servicos" className="hover:text-cyan-400 transition-colors">Nossos Serviços</a></li>
              <li><a href="#como-funciona" className="hover:text-cyan-400 transition-colors">Como Funciona</a></li>
              <li><a href="#testemunhas" className="hover:text-cyan-400 transition-colors">Quem Somos</a></li>
            </ul>
          </div>

          {/* Contact Details info */}
          <div>
            <h4 className="font-semibold text-white text-sm mb-4">Contato Oficial</h4>
            <ul className="space-y-2 text-xs">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                (12) 98821-2915
              </li>
              <li className="text-slate-500 mt-2">
                Reserva de visita: São José dos Campos e Jacareí, SP
              </li>
            </ul>
          </div>

        </div>

        {/* Copyright notice row */}
        <div className="max-w-7xl mx-auto border-t border-slate-900 pt-8 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-600 gap-4">
          <div>
            &copy; {new Date().getFullYear()} SmartFlow Automação Residencial. Todos os direitos reservados.
          </div>
          <div>
            Desenvolvido profissionalmente por integradores credenciados. SJC / Jacareí.
          </div>
        </div>
      </footer>

    </div>
  );
}

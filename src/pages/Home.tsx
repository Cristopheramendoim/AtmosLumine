import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Home() {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // 300px roughly after the top part
      setScrolled(window.scrollY > 150);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div>
      <div 
        className={`fixed inset-0 z-0 h-[100vh] w-[100vw] pointer-events-none transition-opacity duration-[1500ms] ease-in-out ${scrolled ? 'opacity-30' : 'opacity-0'}`}
        style={{
          backgroundImage: "url('/Gifdeluzesdebeem.gif')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat"
        }}
      />
      <div className="relative z-10 w-full">
        <nav className="lumina-nav">
        <div className="wrap">
          <div className="brand" onDoubleClick={() => navigate('/admin')}>
            <div className="brand-mark"></div>
            Atmos
          </div>
          <div className="links hidden md:flex">
            <a href="#solucoes">Soluções</a>
            <a href="#como-funciona">Como funciona</a>
          </div>
          <button onClick={() => navigate('/orcamento')} className="nav-cta">Solicitar Orçamento</button>
        </div>
      </nav>

      <section className="hero">
        <div className="beam b1"></div>
        <div className="beam b2"></div>
        <div className="beam b3"></div>
        <div className="wrap hero-grid">
          <div>
            <div className="eyebrow">Atuação: São José dos Campos e Jacareí</div>
            <h1>A luz perfeita para o seu <em>evento.</em></h1>
            <p className="lead">Não vendemos equipamentos, entregamos a experiência visual. Montagem, configuração e operação técnica de sistemas de iluminação para shows, teatros e eventos corporativos.</p>
            <div className="hero-actions">
              <button onClick={() => navigate('/orcamento')} className="btn-primary">Criar meu projeto</button>
              <a href="#solucoes" className="btn-ghost">Ver soluções</a>
            </div>
          </div>
          <div className="stage">
            <div className="stage-glow"></div>
            <div className="fixture">
              <div className="head">
                <div className="cone"></div>
              </div>
              <div className="arm-container">
                <div className="arm"></div>
                <div className="arm"></div>
              </div>
              <div className="base"></div>
            </div>
          </div>
        </div>
      </section>

      <section id="solucoes" className="section border-t border-[var(--line)] py-24">
        <div className="wrap">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="eyebrow mb-2">Expertise</div>
            <h2 className="font-serif text-3xl md:text-4xl font-semibold mb-4 text-white">Mais que luzes, criamos atmosfera.</h2>
            <p className="text-[var(--ink-dim)]">Nossa equipe entrega desde a concepção do projeto até a operação em tempo real durante o seu evento nas regiões de São José dos Campos e Jacareí.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[#1d1c24]/70 backdrop-blur-sm p-8 rounded-2xl border border-[var(--line)] hover:border-amber-500/50 transition-colors">
              <div className="w-12 h-12 bg-amber-500/10 rounded-xl flex items-center justify-center mb-6 text-amber-500">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-serif font-semibold mb-3 text-white">Shows e Bandas</h3>
              <p className="text-[var(--ink-dim)] text-sm">Sincronia perfeita com a música. Programação de transições, estrobos e moving heads para palcos de todos os tamanhos.</p>
            </div>
            <div className="bg-[#1d1c24]/70 backdrop-blur-sm p-8 rounded-2xl border border-[var(--line)] hover:border-teal-500/50 transition-colors">
              <div className="w-12 h-12 bg-teal-500/10 rounded-xl flex items-center justify-center mb-6 text-teal-400">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                </svg>
              </div>
              <h3 className="text-xl font-serif font-semibold mb-3 text-white">Eventos Corporativos</h3>
              <p className="text-[var(--ink-dim)] text-sm">Iluminação cênica elegante e sutil para valorizar o ambiente, focar nos palestrantes e destacar a marca do seu evento.</p>
            </div>
            <div className="bg-[#1d1c24]/70 backdrop-blur-sm p-8 rounded-2xl border border-[var(--line)] hover:border-purple-500/50 transition-colors">
              <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center mb-6 text-purple-400">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
              </div>
              <h3 className="text-xl font-serif font-semibold mb-3 text-white">Casamentos e Festas</h3>
              <p className="text-[var(--ink-dim)] text-sm">Luzes decorativas para pista de dança e iluminação arquitetural para transformar salões e criar momentos inesquecíveis.</p>
            </div>
          </div>
        </div>
      </section>

      <section id="clareza" className="py-24 border-y border-[var(--line)] bg-[#100f14]/50">
        <div className="wrap border border-[var(--line)] rounded-3xl p-8 md:p-12 bg-[var(--bg-soft)]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
            <div className="flex flex-col gap-4">
              <div className="inline-flex items-center self-start px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[11px] font-bold text-[var(--ink-dim)] uppercase tracking-wider mb-2">
                NÃO FAZEMOS
              </div>
              <h3 className="font-serif text-2xl md:text-3xl font-semibold text-white leading-tight">Venda ou aluguel de equipamento</h3>
              <p className="text-[var(--ink-dim)]">Não vendemos refletores, máquinas de fumaça, canhões de luz ou caixas de som. Se você já tem equipamento próprio, ou contratado de outra empresa, sem problema.</p>
            </div>
            
            <div className="flex flex-col gap-4">
              <div className="inline-flex items-center self-start px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/20 text-[11px] font-bold text-teal-400 uppercase tracking-wider mb-2">
                FAZEMOS
              </div>
              <h3 className="font-serif text-2xl md:text-3xl font-semibold text-white leading-tight">Configuração e operação técnica</h3>
              <p className="text-[var(--ink-dim)]">Planejamos onde cada ponto de luz vai ficar, programamos cores, cenas e efeitos, sincronizamos com o som e acompanhamos a operação durante o evento.</p>
            </div>
          </div>
        </div>
      </section>

      <section id="como-funciona" className="py-24 border-b border-[var(--line)]">
        <div className="wrap">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="font-serif text-3xl md:text-4xl font-semibold mb-4 text-white">Como Funciona</h2>
            <p className="text-[var(--ink-dim)]">Um caminho simples, em quatro etapas.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
            <div className="relative">
              <div className="text-xl font-serif text-teal-400 mb-4 pb-4 border-b border-[var(--line)]">01</div>
              <h4 className="font-serif text-xl font-semibold text-white mb-3">Preencha o pedido</h4>
              <p className="text-sm text-[var(--ink-dim)] leading-relaxed">Conte a data, horário, local e selecione as opções do seu evento direto pelo nosso formulário online.</p>
            </div>
            <div className="relative">
              <div className="text-xl font-serif text-teal-400 mb-4 pb-4 border-b border-[var(--line)]">02</div>
              <h4 className="font-serif text-xl font-semibold text-white mb-3">Receba a confirmação</h4>
              <p className="text-sm text-[var(--ink-dim)] leading-relaxed">Você recebe um resumo detalhado via plataforma para ter controle sobre o que foi preenchido.</p>
            </div>
            <div className="relative">
              <div className="text-xl font-serif text-teal-400 mb-4 pb-4 border-b border-[var(--line)]">03</div>
              <h4 className="font-serif text-xl font-semibold text-white mb-3">Combine pelo WhatsApp</h4>
              <p className="text-sm text-[var(--ink-dim)] leading-relaxed">Acerte os últimos detalhes, projeto e orçamentos diretamente com o técnico responsável.</p>
            </div>
            <div className="relative">
              <div className="text-xl font-serif text-teal-400 mb-4 pb-4 border-b border-[var(--line)]">04</div>
              <h4 className="font-serif text-xl font-semibold text-white mb-3">Operação no evento</h4>
              <p className="text-sm text-[var(--ink-dim)] leading-relaxed">No dia, a equipe de técnicos garante que a luz ambiente e do palco saiam perfeitas.</p>
            </div>
          </div>
        </div>
      </section>

      <section id="arsenal" className="py-24 border-y border-[var(--line)]">
        <div className="wrap border border-[var(--line)] rounded-3xl p-8 md:p-12 bg-[#1d1c24]/80 backdrop-blur-md">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="eyebrow mb-2">Nosso Arsenal</div>
            <h2 className="font-serif text-3xl md:text-4xl font-semibold mb-4 text-white">Equipamentos Profissionais</h2>
            <p className="text-[var(--ink-dim)]">Utilizamos tecnologia de ponta para entregar a melhor experiência visual.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-[#15141a]/90 p-6 rounded-2xl border border-[var(--line)] group">
              <h4 className="font-serif text-lg font-semibold text-amber-500 mb-2">Moving Heads</h4>
              <p className="text-sm text-[var(--ink-dim)] group-hover:text-white transition-colors">Cabeças móveis robóticas que criam feixes de luz que giram, mudam de cor, focam desenhos no chão (gobos) e seguem o ritmo da música.</p>
            </div>
             <div className="bg-[#15141a]/90 p-6 rounded-2xl border border-[var(--line)] group">
              <h4 className="font-serif text-lg font-semibold text-amber-500 mb-2">Par LEDs / Refletores</h4>
              <p className="text-sm text-[var(--ink-dim)] group-hover:text-white transition-colors">Usados para banhar paredes, cortinas e pistas de dança com cores sólidas. São econômicos, não esquentam e mudam de cor digitalmente.</p>
            </div>
             <div className="bg-[#15141a]/90 p-6 rounded-2xl border border-[var(--line)] group">
              <h4 className="font-serif text-lg font-semibold text-amber-500 mb-2">Máquinas de Fumaça / Haze</h4>
              <p className="text-sm text-[var(--ink-dim)] group-hover:text-white transition-colors">Essenciais para tornar os feixes de luz dos moving heads visíveis no ar, criando um efeito tridimensional e de show.</p>
            </div>
             <div className="bg-[#15141a]/90 p-6 rounded-2xl border border-[var(--line)] group">
              <h4 className="font-serif text-lg font-semibold text-amber-500 mb-2">Varal de Luzes / Cortinas</h4>
              <p className="text-sm text-[var(--ink-dim)] group-hover:text-white transition-colors">Muito procurados para casamentos e eventos ao ar livre, pois entregam um visual mais romântico, rústico e intimista.</p>
            </div>
             <div className="bg-[#15141a]/90 p-6 rounded-2xl border border-[var(--line)] group">
              <h4 className="font-serif text-lg font-semibold text-amber-500 mb-2">Painel de LED</h4>
              <p className="text-sm text-[var(--ink-dim)] group-hover:text-white transition-colors">Utilizados no fundo do palco ou na pista para exibir imagens, vídeos, logos de empresas e animações gráficas sincronizadas.</p>
            </div>
             <div className="bg-amber-500 p-6 rounded-2xl border border-amber-400 group flex items-center justify-center text-center cursor-pointer hover:bg-amber-400 transition-colors" onClick={() => navigate('/orcamento')}>
               <div>
                <h4 className="font-serif text-xl font-semibold text-[#1a1410] mb-1">Pronto para começar?</h4>
                <p className="text-sm text-[#1a1410]/80 font-medium">Solicite um orçamento &rarr;</p>
               </div>
            </div>
          </div>
        </div>
      </section>

      <footer>
        <div className="wrap">
          <div className="brand" onDoubleClick={() => navigate('/admin')}>
            <div className="brand-mark"></div> Atmos
          </div>
          <div className="text-sm text-[var(--ink-dim)]">
             Atendimento exclusivo: São José dos Campos e Jacareí
          </div>
        </div>
      </footer>
      </div>
    </div>
  );
}

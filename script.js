
document.addEventListener("DOMContentLoaded", function () {

  const counters = document.querySelectorAll(".contador");

  function animateCounter(counter) {
    const target = parseInt(counter.dataset.target);
    let current = 0;
    const increment = target / 200;

    function update() {
      current += increment;

      if (current < target) {
        counter.textContent = Math.floor(current).toLocaleString("pt-BR");
        requestAnimationFrame(update);
      } else {
        counter.textContent = target.toLocaleString("pt-BR");
      }
    }

    update();
  }

  function checkCounters() {
    const triggerBottom = window.innerHeight * 0.85;

    counters.forEach(counter => {
      const top = counter.getBoundingClientRect().top;

      if (top < triggerBottom && !counter.classList.contains("started")) {
        counter.classList.add("started");
        animateCounter(counter);
      }
    });
  }

  window.addEventListener("scroll", checkCounters);
  window.addEventListener("load", checkCounters);
});


//preloader

(function(){
  // configuração
  const MIN_DISPLAY = 700; // ms, tempo mínimo visível antes de sumir
  const SIMULATED_MAX = 90; // % até onde simulamos antes do load
  const SIM_STEP = 0.4; // quanto incrementa por tick (mais baixo = mais lento)
  const TICK = 16; // ms entre ticks

  // elementos
  const preloader = document.getElementById('preloader');
  if (!preloader) return;
  const inner = preloader.querySelector('.preloader-inner');
  const percentEl = preloader.querySelector('.pl-percent');
  const barEl = preloader.querySelector('.pl-progress-bar');

  let percent = 0;
  let simulated = 0;
  let startTime = performance.now();
  let finished = false;

  // inicia animação do SVG (adiciona classe que altera stroke-dashoffset)
  requestAnimationFrame(()=> preloader.classList.add('pl-animate'));

  // simula progresso até SIMULATED_MAX
  let simTimer = setInterval(()=>{
    if (simulated < SIMULATED_MAX){
      simulated += SIM_STEP * (Math.random() * 0.9 + 0.5); // variação para parecer natural
      if (simulated > SIMULATED_MAX) simulated = SIMULATED_MAX;
      setProgress(Math.round(simulated));
    } else {
      clearInterval(simTimer);
    }
  }, TICK);

  // atualiza visual
  function setProgress(n){
    percent = Math.min(100, Math.max(0, n));
    if (barEl) barEl.style.width = percent + '%';
    if (percentEl) percentEl.textContent = percent + '%';
  }

  // finaliza o loader (faz transição suave)
  function finishLoader(){
    if (finished) return;
    finished = true;
    // garante pelo menos MIN_DISPLAY ms
    const elapsed = performance.now() - startTime;
    const wait = Math.max(0, MIN_DISPLAY - elapsed);

    setTimeout(()=>{
      // anima até 100% suavemente
      let animStart = performance.now();
      let from = percent;
      const dur = 420;
      function step(t){
        const p = Math.min(1, (t - animStart) / dur);
        const eased = 1 - Math.pow(1 - p, 3);
        const val = Math.round(from + (100 - from) * eased);
        setProgress(val);
        if (p < 1) requestAnimationFrame(step);
        else {
          // fade out
          preloader.classList.add('hidden');
          // acessibilidade: remove do fluxo após transição
          setTimeout(()=> {
            preloader.style.display = 'none';
            preloader.setAttribute('aria-hidden','true');
          }, 600);
        }
      }
      requestAnimationFrame(step);
    }, wait);
  }

  // quando a página terminar de carregar, finaliza
  window.addEventListener('load', finishLoader);

  // fallback: se load demorar demais, força finalizar após 8s
  setTimeout(()=> { if(!finished) finishLoader(); }, 8000);

  // se quiser que o usuário possa pular (apenas para debug), aperte ESC
  window.addEventListener('keydown', (e)=>{
    if (e.key === 'Escape') finishLoader();
  });

})();

document.addEventListener("DOMContentLoaded", function() {
    const preloader = document.getElementById('preloader');
    
    // Verifica se o usuário já passou pela home nesta sessão
    if (sessionStorage.getItem("homeCarregada")) {
        // Se já carregou uma vez, remove o preloader imediatamente sem animação
        if (preloader) {
            preloader.style.display = 'none';
            preloader.style.visibility = 'hidden';
        }
    } else {
        // Se é a primeira vez, executa a animação de carregamento normalmente
        window.addEventListener("load", function() {
            // Aqui vai sua lógica atual de esconder o preloader (ex: setTimeout)
            setTimeout(() => {
                preloader.classList.add('hidden'); // Sua classe de sumir
                
                // MARCA QUE A HOME JÁ FOI VISTA
                sessionStorage.setItem("homeCarregada", "true");
            }, 1000); 
        });
    }
});

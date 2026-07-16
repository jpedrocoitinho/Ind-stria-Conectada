document.addEventListener("DOMContentLoaded", () => {
    const criarBotaoVoltarAoTopo = () => {
        const botao = document.createElement("button");
        const reduzirMovimento = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

        botao.className = "voltar-topo";
        botao.type = "button";
        botao.setAttribute("aria-label", "Voltar ao topo da página");
        botao.setAttribute("title", "Voltar ao topo");
        botao.innerHTML = `
            <svg class="voltar-topo-icone" viewBox="0 0 384 512" aria-hidden="true">
                <path d="M214.6 41.4c-12.5-12.5-32.8-12.5-45.3 0l-160 160c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L160 141.2V448c0 17.7 14.3 32 32 32s32-14.3 32-32V141.2L329.4 246.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3l-160-160z"></path>
            </svg>
        `;

        document.body.appendChild(botao);

        const atualizarVisibilidade = () => {
            botao.classList.toggle("visivel", window.scrollY > 320);
        };

        botao.addEventListener("click", () => {
            window.scrollTo({
                top: 0,
                behavior: reduzirMovimento ? "auto" : "smooth"
            });
        });

        window.addEventListener("scroll", atualizarVisibilidade, { passive: true });
        atualizarVisibilidade();
    };

    criarBotaoVoltarAoTopo();

    if (!window.gsap) {
        console.warn("GSAP não foi carregado. O site continuará sem animações.");
        return;
    }

    const reduzirMovimento = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduzirMovimento) {
        return;
    }

    const animarEntradaDaPagina = () => {
        const timeline = gsap.timeline({ defaults: { ease: "power3.out" } });

        timeline
            .from(".marca", {
                x: -90,
                opacity: 0,
                duration: 0.8
            })
            .from(".usuario", {
                x: 90,
                opacity: 0,
                duration: 0.7
            }, "<0.1")
            .from(".titulo-pagina .caminho", {
                x: -80,
                opacity: 0,
                duration: 0.55
            }, "-=0.1")
            .from(".titulo-pagina h2", {
                x: -110,
                opacity: 0,
                duration: 0.75
            }, "-=0.3")
            .from(".titulo-pagina > div > p:not(.caminho)", {
                x: 85,
                opacity: 0,
                duration: 0.65
            }, "-=0.5")
            .from(".titulo-pagina > .botao, .titulo-pagina > button", {
                x: 100,
                opacity: 0,
                rotation: 3,
                duration: 0.65
            }, "-=0.55");
    };

    const animarQuandoAparecer = () => {
        const grupos = document.querySelectorAll(
            ".grade-indicadores, .grade-sustentabilidade, .grade-dashboard, main > .painel"
        );

        const observador = new IntersectionObserver((entradas, observer) => {
            entradas.forEach((entrada) => {
                if (!entrada.isIntersecting) return;

                const grupo = entrada.target;
                const itens = grupo.matches(".grade-indicadores, .grade-sustentabilidade, .grade-dashboard")
                    ? grupo.children
                    : [grupo];

                const posicao = Array.from(grupos).indexOf(grupo);
                const origemX = posicao % 2 === 0 ? -85 : 85;

                gsap.from(itens, {
                    x: origemX,
                    y: 28,
                    opacity: 0,
                    rotation: posicao % 2 === 0 ? -1.5 : 1.5,
                    duration: 0.8,
                    stagger: 0.12,
                    ease: "power3.out",
                    clearProps: "transform,opacity"
                });

                observer.unobserve(grupo);
            });
        }, { threshold: 0.14 });

        grupos.forEach((grupo) => observador.observe(grupo));
    };

    const animarGraficoCircular = () => {
        const grafico = document.querySelector(".taxa-circular");

        if (!grafico) return;

        const numero = grafico.querySelector("strong");
        const valorFinal = Number.parseInt(numero.textContent, 10) || 0;
        const progresso = { valor: 0 };

        numero.textContent = "0%";
        grafico.style.background = "conic-gradient(var(--acid) 0%, #3c4038 0% 100%)";

        const observador = new IntersectionObserver((entradas, observer) => {
            if (!entradas[0].isIntersecting) return;

            const timeline = gsap.timeline();

            timeline
                .fromTo(grafico, {
                    rotation: -220,
                    scale: 0.35,
                    opacity: 0
                }, {
                    rotation: 0,
                    scale: 1,
                    opacity: 1,
                    duration: 1.15,
                    ease: "back.out(1.5)"
                })
                .to(progresso, {
                    valor: valorFinal,
                    duration: 1.8,
                    ease: "power2.out",
                    onUpdate: () => {
                        const atual = Math.round(progresso.valor);
                        numero.textContent = `${atual}%`;
                        grafico.style.background =
                            `conic-gradient(var(--acid) 0 ${atual}%, #3c4038 ${atual}% 100%)`;
                    }
                }, "-=0.45")
                .from(".taxa-circular span", {
                    y: 14,
                    opacity: 0,
                    duration: 0.5
                }, "-=0.55")
                .to(grafico, {
                    scale: 1.045,
                    duration: 0.22,
                    yoyo: true,
                    repeat: 1,
                    ease: "power1.inOut"
                });

            observer.unobserve(grafico);
        }, { threshold: 0.45 });

        observador.observe(grafico);
    };

    animarEntradaDaPagina();
    animarQuandoAparecer();
    animarGraficoCircular();
});

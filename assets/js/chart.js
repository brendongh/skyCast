export default function renderChart(param, setCurrent){
    const dados = param.map(t=>t.temp)
    const labels = param.map(t=>t.datetime.slice(0, 5))
    const svg = document.getElementById('chart');

    const largura = 700;
    const altura = 200;
    const margem = 40;
    const espacamento = (largura - margem * 2) / (dados.length - 1);

    // --- ESCALA ---
    const min = Math.min(...dados) - 2; // Margem inferior para não encostar no chão
    const max = Math.max(...dados) + 2; // Margem superior
    const escalaY = (valor) => altura - margem - ((valor - min) / (max - min)) * (altura - margem * 2);

    // 1. Criar a Linha
    let pontosPath = dados.map((v, i) => `${i * espacamento + margem},${escalaY(v)}`).join(" ");
    svg.innerHTML = `<polyline points="${pontosPath}" fill="none" stroke="#007bff" stroke-width="3" stroke-linejoin="round"/>`;

    // 2. Criar Pontos e Legendas
    dados.forEach((valor, i) => {
        const x = i * espacamento + margem;
        const y = escalaY(valor);

        // Ponto (Bolinha)
        const ponto = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        ponto.setAttribute("cx", x);
        ponto.setAttribute("cy", y);
        ponto.setAttribute("r", "5");
        ponto.setAttribute("fill", "#007bff");
        svg.appendChild(ponto);

        
        const txtValor = document.createElementNS("http://www.w3.org/2000/svg", "text");
        txtValor.setAttribute("x", x);
        txtValor.setAttribute("y", y - 12);
        txtValor.setAttribute("text-anchor", "middle");
        txtValor.classList.add("legenda-ponto");
        txtValor.style.fontSize = "12px";
        txtValor.textContent = `${valor}°`;
        txtValor.style.cursor ="pointer"

        svg.appendChild(txtValor);
        txtValor.addEventListener('click', () => {
            document.querySelectorAll('.legenda-ponto').forEach(el => {
                el.classList.remove('ativo');
            });
            txtValor.classList.add('ativo');
            setCurrent(param[i], false)
        
        });


        // Legenda do Eixo X (Base)
        const txtEixoX = document.createElementNS("http://www.w3.org/2000/svg", "text");
        txtEixoX.setAttribute("x", x);
        txtEixoX.setAttribute("y", altura - 10); // Fixado no rodapé
        txtEixoX.setAttribute("text-anchor", "middle");
        txtEixoX.style.fontSize = "12px";
        txtEixoX.style.fill = "#999";
        txtEixoX.textContent = labels[i];
        svg.appendChild(txtEixoX);
    });
}
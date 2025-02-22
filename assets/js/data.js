document.addEventListener("DOMContentLoaded", function () {
    let modelosOriginais = []; // 🔹 Armazena os modelos originais

    // 🔹 Busca os dados do JSON
    fetch("./data/user.json")
        .then(response => {
            if (!response.ok) {
                throw new Error(`Erro ao carregar JSON: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            modelosOriginais = data.models; // 🔹 Salva os modelos originais
            preencherCidades(modelosOriginais); // 🔹 Preenche o select de cidades
            mostrarModelos(modelosOriginais); // 🔹 Exibe os modelos ao carregar a página
            adicionarEventosNavbar();
        })
        .catch(error => console.error("Erro ao buscar JSON:", error));

    // 🔹 Preenche o select de cidades com base nos modelos disponíveis
    function preencherCidades(modelos) {
        const cidadeSelect = document.getElementById("filter-city");
        const cidadesUnicas = [...new Set(modelos.map(modelo => modelo.city))]; // 🔹 Obtém cidades únicas

        cidadesUnicas.forEach(cidade => {
            const option = document.createElement("option");
            option.value = cidade;
            option.textContent = cidade;
            cidadeSelect.appendChild(option);
        });
    }

    // 🔹 Filtra os modelos com base nos inputs
    document.getElementById("filter-form").addEventListener("submit", function (event) {
        event.preventDefault(); // Evita recarregar a página

        const cidadeFiltro = document.getElementById("filter-city").value;
        const generoFiltro = document.getElementById("filter-gender").value;
        const idadeMinFiltro = document.getElementById("filter-min-age").value;
        const idadeMaxFiltro = document.getElementById("filter-max-age").value;

        const modelosFiltrados = modelosOriginais.filter(modelo => {
            const idade = calcularIdade(modelo.birth_date);
            return (
                (cidadeFiltro === "" || modelo.city === cidadeFiltro) &&
                (generoFiltro === "" || modelo.gender === generoFiltro) &&
                (idadeMinFiltro === "" || idade >= parseInt(idadeMinFiltro)) &&
                (idadeMaxFiltro === "" || idade <= parseInt(idadeMaxFiltro))
            );
        });

        mostrarModelos(modelosFiltrados); // 🔹 Exibe os modelos filtrados
        voltarAoTopo(); // 🔹 Volta ao topo após aplicar o filtro
    });
});

// 🔹 Exibe os modelos na tela
function mostrarModelos(modelos) {
    const container = document.getElementById("model-container");

    if (modelos.length === 0) {
        container.innerHTML = `<p>Nenhum modelo encontrado.</p>`;
        return;
    }

    container.innerHTML = `<div class="reels-container">
        ${modelos.map(modelo => `
            <div class="reel" style="background-image: url('${modelo.main_photo}');">
                <div class="container-top">
                    <div class="header">
                        <h1>Potö</h1>
                        <span class="navbar-icon material-symbols-outlined">filter_alt</span>
                    </div>
                </div>
                <div class="container-bottom">
                    <div class="description-bottom">
                        <div class="card">
                            <p><span class="material-symbols-outlined">location_on</span> ${modelo.city}</p>
                            <h2>${modelo.full_name}</h2>
                            <p>${modelo.short_description}</p>
                        </div>
                    </div>
                    <div class="icons-bottom">
                        <span class="material-symbols-outlined">chat</span>
                        <span class="material-symbols-outlined">favorite</span>
                        <span class="material-symbols-outlined">account_circle</span>
                    </div>
                </div>
            </div>
        `).join("")}
    </div>`;

    aplicarEstilosReels();
    adicionarEventosNavbar();
}

// 🔹 Adiciona eventos aos botões do navbar
function adicionarEventosNavbar() {
    document.querySelectorAll(".navbar-icon").forEach(navbar => {
        navbar.addEventListener("click", function (event) {
            const formFilter = document.getElementById("container-filter");
            formFilter.style.display = "flex";
            event.stopPropagation(); // Impede que o clique no ícone feche o filtro imediatamente
        });
    });

    // 🔹 Fecha o filtro ao clicar fora do container
    document.addEventListener("click", function (event) {
        const formFilter = document.getElementById("container-filter");

        if (formFilter.style.display === "flex" && !formFilter.contains(event.target) && !event.target.classList.contains("navbar-icon")) {
            formFilter.style.display = "none";
        }
    });
}


// 🔹 Calcula a idade com base na data de nascimento
function calcularIdade(dataNascimento) {
    const nascimento = new Date(dataNascimento);
    const hoje = new Date();
    let idade = hoje.getFullYear() - nascimento.getFullYear();
    const mes = hoje.getMonth() - nascimento.getMonth();
    if (mes < 0 || (mes === 0 && hoje.getDate() < nascimento.getDate())) {
        idade--;
    }
    return idade;
}

// 🔹 Aplica os estilos para o efeito de Reels
function aplicarEstilosReels() {
    const reelsContainer = document.querySelector(".reels-container");
    if (reelsContainer) {
        reelsContainer.style.cssText = `
            display: flex;
            flex-direction: column;
            align-items: center;
            overflow-y: auto;
            height: 100vh;
            scroll-snap-type: y mandatory;
        `;

        document.querySelectorAll(".reel").forEach(reel => {
            reel.style.cssText += `
                width: 100%;
                height: 100vh;
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                scroll-snap-align: start;
                box-sizing: border-box;
            `;
        });
    }
}

// 🔹 Volta ao primeiro modelo após aplicar filtros
function voltarAoTopo() {
    const reelsContainer = document.querySelector(".reels-container");
    if (reelsContainer) {
        reelsContainer.scrollTop = 0;
    }
}

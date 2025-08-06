let erroMostrado = false;

function carregarPagina(pagina, push = true) {
    const conteudoDiv = document.querySelector('div#conteudo');
    console.log("➡️ Tentando carregar:", pagina);

    if (erroMostrado) {
        console.log("⚠️ Mensagem de erro já exibida. Aguardando interação do usuário.");
        return;
    }

    conteudoDiv.classList.remove("visivel");
    conteudoDiv.innerHTML = `<span class="spinner"></span> Carregando...`;

    fetch(pagina)
        .then(response => {
            if (response.ok) {
                erroMostrado = false; // resetar flag
                return response.text();
            } else {
                throw new Error("ERRO HTTP: " + response.status);
            }
        })
        .then(conteudo => {
            conteudoDiv.innerHTML = conteudo;
            setTimeout(() => {
                conteudoDiv.classList.add("visivel");
            }, 20);
            window.scrollTo(0, 0);
            if (push) {
                history.pushState({ pagina }, "", pagina);
            }
        })
        .catch(error => {
    console.error('Erro ao carregar a home.html:', error);
    
    const telefone = document.querySelector('#telefone');
    telefone.innerHTML = `
        <div class="erro-carregamento">
            <p>❌ Erro ao carregar o conteúdo.</p>
            <button id="tentar-novamente">🔁 Tentar novamente</button>
        </div>
    `;

    document.querySelector('#tentar-novamente').addEventListener('click', () => location.reload());
});

}

// Controle do botão "voltar" do navegador
window.onpopstate = (event) => {
    if (event.state && event.state.pagina) {
        carregarPagina(event.state.pagina, false);
    }
};

document.addEventListener('DOMContentLoaded', () => {
    let paginaAtual = location.pathname.substring(location.pathname.lastIndexOf('/') + 1);

    if (!paginaAtual || paginaAtual === 'index.html' || paginaAtual === '') {
        paginaAtual = "paginas/home.html";
    }

    const links = document.querySelectorAll('a[href^="paginas/"]');
    links.forEach(link => {
        link.addEventListener("click", event => {
            event.preventDefault();
            const pagina = link.getAttribute("href");
            carregarPagina(pagina);
        });
    });

    carregarPagina(paginaAtual, false);
});
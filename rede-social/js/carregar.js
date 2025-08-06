function carregarPagina(pagina, push = true) {
    const conteudoDiv = document.querySelector('div#conteudo')
    conteudoDiv.innerHTML = `<span class="spinner"></span> Carregando...`
    fetch(pagina) 
        .then(response => {
            if (response.ok) {
                return response.text() // continua para o próximo then com o conteúdo da página
            } else {
                throw new Error("ERRO HTTP: " + response.status) // força o catch
            }
        })
        .then(conteudo => {
            conteudoDiv.innerHTML = conteudo
            if (push) {
                history.pushState( { pagina }, "", pagina)
            }
        })
        .catch(error => {
            conteudoDiv.innerHTML = 'ERRO ao carregar a página!'
        })
    }
    // Evento de popstate (navegar para frente/voltar)
    window.onpopstate = (event) => {
        if (event.state && event.state.pagina) {
            carregarPagina(event.state.pagina, false)
        }
    }

    /* 
    if (event.state && event.state.pagina) {
        carregarPagina(event.state.pagina, false); */

    document.addEventListener('DOMContentLoaded', () => {
        // Pegue a página da URL ou defina home.html como padrão
        let paginaAtual = location.pathname.substring(location.pathname.lastIndexOf('/') + 1)
        if (!paginaAtual || paginaAtual === 'index.html' || paginaAtual === '') {
            paginaAtual = "paginas/home.html"
        }
        const links = document.querySelectorAll('a[href^="paginas/"]')
        links.forEach(link => {
            link.addEventListener("click", event => {
                event.preventDefault()
                // pega o href do link clicado
                const pagina = link.getAttribute("href")
                // chama a função carregarPagina()
                carregarPagina(pagina)
            })       
        })
        // carrega a home automaticamente quando o site é aberto
        carregarPagina(paginaAtual, false)
    })
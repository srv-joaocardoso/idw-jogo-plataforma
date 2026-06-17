class Jogo extends ObjetoDoJogo {
    x
    constructor() {
        super()

        this.tela = this.inciarTelaDoJogo({ largura: 1280, altura: 720 })
        this.pontuacao = this.iniciarPontuacao()

        this.jogador = new Jogador(600, 300)
        this.posicaoAnteriorX = this.jogador.posicao.x
        this.registrarCapturaDoMouseNoJogador()
        this.tela.elementoHTML.append(this.jogador.elementoHTML)

        this.estagio = new EstagioClassico(this.jogador, { x: 0, y: this.tela.dimensoes.altura }, { largura: 1280, altura: 720 })
        this.tela.elementoHTML.append(this.estagio.elementoHTML)

        /** @type {Plataforma[]} */
        this.plataformas = this.estagio.plataformas
        this.yBase = 0

        this.timeScale = 10

        this.rodarLoop()
    }

    rodarLoop() {
        this.processarElementos()
        // Se não tiver jogador, é exibido a tela de fim de jogo
        if (this.jogador == null) {
            const audioFim = new Audio("./watersplash.mp3")
            audioFim.play()

            const telaFim = document.createElement('div')
            telaFim.className = 'tela-fim'
            this.tela.elementoHTML.append(telaFim)

            const textoFim = document.createElement('h1')
            textoFim.innerHTML = `Fim do Jogo! Sua pontuação foi: <spam class="placar-texto">${this.pontuacao.valor}</spam>.`
            telaFim.append(textoFim)

            const botaoFim = document.createElement('button')
            botaoFim.innerText = "Recomeçar"
            botaoFim.addEventListener('click', () => {

                location.reload()
            })
            telaFim.append(botaoFim)

            return
        }

        this.renderizarElementos()
        requestAnimationFrame(() => this.rodarLoop())
    }

    processarElementos() {
        const jogadorControle = {
            ...this.jogador,
            posicao: { ...this.jogador.posicao },
            dimensoes: { ...this.jogador.dimensoes }
        }

        // Calcula TimeScale
        const timeScaleBase = 15
        const aceleracaoTimeScale = 17
        const frequenciaAceleracaoTimeScale = 0.02
        this.timeScale = (timeScaleBase + aceleracaoTimeScale * Math.log(1 + frequenciaAceleracaoTimeScale * this.pontuacao.valor)).toFixed(0)

        for (let i = 0; i < this.timeScale; i++) {
            this.jogador.rodarTodosOsProcessos()
            this.plataformas.forEach(plataforma => plataforma.rodarTodosOsProcessos())
            this.estagio.rodarTodosOsProcessos()
        }

        if (this.jogador.tangivel == false) {
            this.jogador = null
            return
        }

        // Inverte jogador para o lado que ele está se movendo
        if (this.posicaoAnteriorX > this.jogador.posicao.x) {
            this.jogador.elementoHTML.style.transform = "scaleX(-1)"
        } else if (this.posicaoAnteriorX < this.jogador.posicao.x) {
            this.jogador.elementoHTML.style.transform = "scaleX(1)"
        }

        this.posicaoAnteriorX = this.jogador.posicao.x
        this.yBase = this.estagio.dimensoes.altura - this.tela.dimensoes.altura

        const plataformasAbaixoDoJogador = this.plataformas.filter(plataforma => plataforma.posicao.y < (jogadorControle.posicao.y - jogadorControle.dimensoes.altura))

        // Define a pontuação resgatando o ID da última plataforma abaixo do jogador.
        if (this.pontuacao.valor < (plataformasAbaixoDoJogador.at(-1)?.id ?? 0)) {
            this.pontuacao.valor = plataformasAbaixoDoJogador.at(-1).id
        }

        // Executa função na primeira plataforma que o jogador colide na queda.
        plataformasAbaixoDoJogador
            .findLast(plataforma => plataforma.tangivel && this.jogador.tangivel && this.verificarColisaoQuedaJogadorComPlataforma(jogadorControle, plataforma))
            ?.acaoAoColidirComJogador(this.jogador)

        // Apaga plataformas inferiores a tela visual de todos os estagios.
        for (let i = this.plataformas.length - 1; i >= 0; i--) {
            if (this.plataformas[i].posicao.y < this.yBase) {
                this.plataformas[i].elementoHTML.remove()
                this.plataformas.splice(i, 1)
            }
        }

        this.linhaDeCorte = this.yBase + (this.tela.dimensoes.altura / 2)

        if (this.jogador.posicao.y > this.linhaDeCorte) this.estagio.dimensoes.altura += this.jogador.posicao.y - this.linhaDeCorte

        // Ação do jogador ao sair da tela
        if (this.jogador.posicao.y < this.yBase) this.jogador = null
    }

    verificarColisaoQuedaJogadorComPlataforma(posicaoControleDoJogador, plataforma = new Plataforma()) {
        if (!this.jogador.tangivel || !plataforma.tangivel) return false
        if (posicaoControleDoJogador.posicao.y < this.jogador.posicao.y) return false

        // Calcular Rastro de Jogador
        const rastro = {
            x1: posicaoControleDoJogador.posicao.x + (posicaoControleDoJogador.dimensoes.largura / 2),
            x2: this.jogador.posicao.x + (this.jogador.dimensoes.largura / 2),
            y1: posicaoControleDoJogador.posicao.y - posicaoControleDoJogador.dimensoes.altura,
            y2: this.jogador.posicao.y - this.jogador.dimensoes.altura
        }



        // Obtem Posição da Plataforma
        const posicaoPlataforma = {
            x1: plataforma.posicao.x - (this.jogador.dimensoes.largura / 2),
            x2: plataforma.posicao.x + plataforma.dimensoes.largura + (this.jogador.dimensoes.largura / 2),
            y1: plataforma.posicao.y
        }



        // Calcular Colisão do Rastro com Plataforma
        const dy = rastro.y2 - rastro.y1

        if (dy === 0) return false

        const t = (posicaoPlataforma.y1 - rastro.y1) / dy

        if (t < 0 || t > 1) return false

        const xColisao = rastro.x1 + t * (rastro.x2 - rastro.x1)

        return (
            xColisao >= posicaoPlataforma.x1 &&
            xColisao <= posicaoPlataforma.x2
        )

    }

    renderizarElementos() {
        this.jogador.renderizar(this.yBase)
        this.estagio.plataformas.forEach(plataforma => plataforma.renderizar())
        this.estagio.renderizar()
        this.pontuacao.renderizar()
    }

    registrarCapturaDoMouseNoJogador() {
        document.addEventListener("mousemove", ({ clientX }) => {
            if (this.jogador == null) return

            if (this.jogador.tangivel == false) return

            const coordenadaLimite = this.tela.dimensoes.largura - this.jogador.dimensoes.largura

            if (clientX > coordenadaLimite) this.jogador.posicao.x = coordenadaLimite

            else this.jogador.posicao.x = clientX
        })
    }

    iniciarPontuacao() {
        const elementoHTML = document.createElement('h1')
        this.tela.elementoHTML.append(elementoHTML)

        elementoHTML.className = "pontuacao"

        function renderizar() {
            elementoHTML.innerText = this.valor
        }

        return { valor: 0, renderizar, elementoHTML }
    }

    inciarTelaDoJogo(dimensoes = { largura: 0, altura: 0 }) {
        const elementoHTML = document.createElement('main')

        elementoHTML.style.width = dimensoes.largura + "px"
        elementoHTML.style.height = dimensoes.altura + "px"

        document.body.append(elementoHTML)

        return { dimensoes, elementoHTML }
    }
}
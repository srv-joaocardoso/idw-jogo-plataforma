class Jogo {
    constructor() {
        this.jogador = new Jogador(0, 50)
        this.telaDoJogo = this.criarTelaDoJogo(400, 500)

        this.registrarCapturaDoMouseNoJogador()
        this.plataformas = []

        this.inserirPlataformas()
        this.loopJogo()
        this.telaDoJogo.adicionarProcesso(() => this.lidarComColisaoEntreJogadorEPlataforma())
        this.telaDoJogo.adicionarProcesso(() => {
            if (this.jogador.posicao.y < 0) {
                this.jogador.posicao.y = 200
                this.jogador.velocidadeVertical = 0
            }

            if (this.jogador.posicao.y > 250) {
                this.telaDoJogo.dimensoes.altura = 250 - this.jogador.posicao.y
                this.telaDoJogo.renderizar()
            }})
    }

    loopJogo() {
        this.telaDoJogo.rodarTodosOsProcessos()
        this.renderizarElementos()

        requestAnimationFrame(() => this.loopJogo())
    }

    lidarComColisaoEntreJogadorEPlataforma() {

        const posicaoControle = {
            x: this.jogador.posicao.x,
            y: this.jogador.posicao.y
        }

        this.jogador.rodarTodosOsProcessos()

        if (this.jogador.velocidadeVertical < 0) return

        const metade = this.jogador.dimensoes.largura / 2

        for (const plataforma of this.plataformas) {

            const retaPlataforma = {
                x1: plataforma.posicao.x - metade,
                x2: plataforma.posicao.x + plataforma.dimensoes.largura + metade,
                y1: plataforma.posicao.y,
                y2: plataforma.posicao.y
            }

            const retaJogador = {
                x1: posicaoControle.x + metade,
                x2: this.jogador.posicao.x + metade,
                y1: posicaoControle.y - this.jogador.dimensoes.altura,
                y2: this.jogador.posicao.y - this.jogador.dimensoes.altura,
            }

            const colidiu = this.verificarColisaoEntreDuasSemiretas(
                retaJogador,
                retaPlataforma
            )

            if (colidiu) {
                this.jogador.posicao.y = plataforma.posicao.y + this.jogador.dimensoes.altura
                this.jogador.velocidadeVertical = -4
                return true
            }
        }

        return false
    }

    verificarColisaoEntreDuasSemiretas(
        reta1 = { x1: 0, x2: 0, y1: 0, y2: 0 },
        reta2 = { x1: 0, x2: 0, y1: 0, y2: 0 }
    ) {
        const dy = reta1.y2 - reta1.y1

        if (dy === 0) return false

        const t = (reta2.y1 - reta1.y1) / dy

        if (t < 0 || t > 1) return false

        const xColisao = reta1.x1 + t * (reta1.x2 - reta1.x1)

        return (
            xColisao >= reta2.x1 &&
            xColisao <= reta2.x2
        )
    }


    renderizarElementos() {
        this.jogador.renderizar()
        this.plataformas.forEach((plataforma) => { plataforma.renderizar() })
    }

    registrarCapturaDoMouseNoJogador() {
        document.addEventListener("mousemove", ({ clientX }) => {
            const coordenadaLimite = this.telaDoJogo.dimensoes.largura - this.jogador.dimensoes.largura

            if (clientX > coordenadaLimite) this.jogador.posicao.x = coordenadaLimite

            else this.jogador.posicao.x = clientX
        })
    }

    criarTelaDoJogo(largura = 400, altura = 500) {
        const telaDoJogo = new TelaDoJogo(largura, altura)
        document.body.append(telaDoJogo.elementoHTML)
        telaDoJogo.elementoHTML.append(this.jogador.elementoHTML)
        return telaDoJogo
    }

    inserirPlataformas() {
        const primeiraPlataforma = new Plataforma(this.jogador.posicao.x, this.jogador.posicao.y - this.jogador.dimensoes.altura)

        this.plataformas.push(primeiraPlataforma)

        this.telaDoJogo.elementoHTML.append(primeiraPlataforma.elementoHTML)


        Array(10).fill().forEach(() => {

            const plataforma = new Plataforma()

            plataforma.posicao.x = Math.random() * (this.telaDoJogo.dimensoes.largura - primeiraPlataforma.dimensoes.largura)

            plataforma.posicao.y = plataforma.id * this.telaDoJogo.dimensoes.altura / 9

            this.plataformas.push(plataforma)
            this.telaDoJogo.elementoHTML.append(plataforma.elementoHTML)
        })
    }
}

class ObjetoDoJogo {
    constructor(
        posicao = { x, y },
        dimensoes = {
            largura: 0,
            altura: 0
        },
        classe = "") {
        this.posicao = posicao

        this.dimensoes = dimensoes

        this.classeHTML = classe

        this.processos = []
    }

    criarElemento() {
        this.elementoHTML = document.createElement('div')
        this.elementoHTML.style.height = this.dimensoes.altura + "px"
        this.elementoHTML.style.width = this.dimensoes.largura + "px"
        this.elementoHTML.className = this.classeHTML
    }

    renderizar() {
        this.elementoHTML.style.left = this.posicao.x + "px"
        this.elementoHTML.style.bottom = this.posicao.y - this.dimensoes.altura + "px"
    }

    adicionarProcesso(processo = () => { }) {
        this.processos.push(processo)
    }

    rodarTodosOsProcessos() {
        this.processos.forEach(processo => processo())
    }
}

class TelaDoJogo extends ObjetoDoJogo {
    constructor(largura = 0, altura = 0) {
        super({ x: 0, y: 0 }, { largura, altura }, "tela-do-jogo")
        this.criarElemento()
    }
}

class Jogador extends ObjetoDoJogo {
    constructor(x = 0, y = 0) {
        super({ x: x, y: y }, { largura: 40, altura: 40 }, "jogador")

        this.velocidadeVertical = 0
        this.gravidadeAplicada = 0.05

        this.adicionarProcesso(() => this.calcularEixoY())

        this.criarElemento()
    }

    calcularEixoY() {
        this.velocidadeVertical += this.gravidadeAplicada
        this.posicao.y -= this.velocidadeVertical
    }
}

class Plataforma extends ObjetoDoJogo {
    static id = 0

    constructor(x = 0, y = 40) {
        super({ x: x, y: y }, { largura: 40, altura: 5 }, "plataforma")

        this.id = Plataforma.id++

        this.criarElemento()
    }
}

const jogo = new Jogo()
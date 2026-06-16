class ObjetoDoJogo {
    constructor(
        posicao = { x: 0, y: 0 },
        dimensoes = {
            largura: 0,
            altura: 0
        },
        classe = "") {
        this.posicao = posicao
        this.dimensoes = dimensoes
        this.classeHTML = classe
        this.processos = []
        this.tangivel = true
    }

    criarElemento() {
        this.elementoHTML = document.createElement('div')
        this.elementoHTML.className = this.classeHTML
        this.elementoHTML.style.width = this.dimensoes.largura + "px"
        this.elementoHTML.style.height = this.dimensoes.altura + "px"
    }

    renderizar(offsetY = 0) {
        this.elementoHTML.style.width = this.dimensoes.largura + "px"
        this.elementoHTML.style.height = this.dimensoes.altura + "px"

        this.elementoHTML.style.left = this.posicao.x + "px"
        this.elementoHTML.style.bottom = this.posicao.y - this.dimensoes.altura - offsetY + "px"
    }

    adicionarProcesso(processo = () => { }) {
        this.processos.push(processo)
    }

    rodarTodosOsProcessos() {
        this.processos.forEach(processo => processo())
    }
}
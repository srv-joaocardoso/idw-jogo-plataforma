class Jogador extends ObjetoDoJogo {
    constructor(x = 0, y = 0) {
        super({ x: x, y: y }, { largura: 10, altura: 10 }, "jogador")

        this.projecaoVertical = 0
        this.gravidadeAplicada = 0.0001

        this.adicionarProcesso(() => this.calcularEixoY())

        this.criarElemento()

        this.vivo = true
    }

    calcularEixoY() {
        this.projecaoVertical -= this.gravidadeAplicada
        this.posicao.y += this.projecaoVertical
    }

    morrer() {
        this.vivo = false
    }
}
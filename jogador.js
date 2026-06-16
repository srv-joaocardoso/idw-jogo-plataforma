class Jogador extends ObjetoDoJogo {
    constructor(x = 0, y = 0) {
        super({ x: x, y: y }, { largura: 112, altura: 140 }, "jogador")

        this.projecaoVertical = 0
        this.gravidadeAplicada = 0.0001

        this.adicionarProcesso(() => this.calcularEixoY())
        
        this.adicionarProcesso(() => {
            this.elementoHTML.style.backgroundImage = this.projecaoVertical > 0 ? "url(personagem-pulando.png)" : "url(personagem-caindo.png)"
        })

        this.criarElemento()
    }

    calcularEixoY() {
        this.projecaoVertical -= this.gravidadeAplicada
        this.posicao.y += this.projecaoVertical
    }
}
class EstagioClassico extends ObjetoDoJogo {
    constructor(jogador = new Jogador(), posicao, dimensoes = { largura: 0, altura: 0 }) {
        super(posicao, dimensoes, "estagio-classico")

        /** @type {Plataforma[]} */
        this.plataformas = []

        this.jogador = jogador

        this.intervaloEntrePlataformas = 20
        this.criarElemento()

        this.adicionarProcesso(() => {
            if (this.plataformas.length == 0) {
                const primeiraPlataforma = new PlataformaTrampolim(0, 20)
                this.plataformas.push(primeiraPlataforma)
                this.elementoHTML.append(primeiraPlataforma.elementoHTML)
            }

            const yUltimaPlataforma = this.plataformas.at(-1).posicao.y
            Array.from({ length: (this.dimensoes.altura - yUltimaPlataforma) / this.intervaloEntrePlataformas }, (_, i) => {
                const novaPlataforma = new PlataformaTrampolim(0, yUltimaPlataforma + ((1 + i) * this.intervaloEntrePlataformas))
                this.elementoHTML.append(novaPlataforma.elementoHTML)
                this.plataformas.push(novaPlataforma)
            })
        })
    }
}
class EstagioClassico extends ObjetoDoJogo {
    constructor(jogador = new Jogador(), posicao, dimensoes = { largura: 0, altura: 0 }) {
        super(posicao, dimensoes, "estagio-classico")

        /** @type {Plataforma[]} */
        this.plataformas = []
        this.classeHTML = "estagio"

        this.jogador = jogador

        this.intervaloEntrePlataformas = 70
        this.criarElemento()

        this.larguraPlataforma = 0

        this.adicionarProcesso(() => {
            if (this.plataformas.length == 0) {
                const primeiraPlataforma = new PlataformaTrampolim(dimensoes.largura / 2, 100)
                this.larguraPlataforma = primeiraPlataforma.dimensoes.largura
                this.plataformas.push(primeiraPlataforma)
                this.elementoHTML.append(primeiraPlataforma.elementoHTML)
            }

            const yUltimaPlataforma = this.plataformas.at(-1).posicao.y
            Array.from({ length: (this.dimensoes.altura - yUltimaPlataforma) / this.intervaloEntrePlataformas }, (_, i) => {
                const x = Math.random() * (this.dimensoes.largura - this.larguraPlataforma)
                const y = yUltimaPlataforma + ((1 + i) * this.intervaloEntrePlataformas)
                const novaPlataforma = this.criarPlataforma(x, y)
                this.elementoHTML.append(novaPlataforma.elementoHTML)
                this.plataformas.push(novaPlataforma)
            })
        })
    }

    criarPlataforma(x, y) {
        const alturaRelativa = Math.min(1, Math.max(0, y / this.dimensoes.altura))
        const id = Plataforma.id

        if (id % 4 === 0) {
            return new PlataformaPulante(x, y)
        }

        const taxaTrampolim = 0.6 - alturaRelativa * 0.35
        const taxaQuebrante = 0.25 + alturaRelativa * 0.25
        const taxaEspinho = 1 - taxaTrampolim - taxaQuebrante

        const aleatorio = (id % 100) / 100

        if (aleatorio < taxaTrampolim) {
            return new PlataformaTrampolim(x, y)
        }

        if (aleatorio < taxaTrampolim + taxaQuebrante) {
            return new PlataformaQuebrante(x, y)
        }

        return new PlataformaEspinho(x, y)
    }
}

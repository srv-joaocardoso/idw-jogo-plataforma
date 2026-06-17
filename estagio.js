class EstagioClassico extends ObjetoDoJogo {
    constructor(jogador = new Jogador(), posicao, dimensoes = { largura: 0, altura: 0 }) {
        super(posicao, dimensoes, "estagio-classico")

        /** @type {Plataforma[]} */
        this.plataformas = []
        this.classeHTML = "estagio"

        this.jogador = jogador

        this.intervaloEntrePlataformas = 120
        this.criarElemento()

        this.larguraPlataforma = 0

        this.adicionarProcesso(() => {
            if (this.plataformas.length == 0) {
                const primeiraPlataforma = new PlataformaPulante(dimensoes.largura / 2, 100)
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
        const porcentagem = Math.random()
        const id = Plataforma.id

        if (id % 4 === 0) {
            return new PlataformaPulante(x, y)
        }

        if (porcentagem < 0.05) { // 5%
            return new PlataformaTrampolim(x, y)
        }

        if (porcentagem < 0.12) { // 7%
            return new PlataformaEspinho(x, y)
        }

        if (porcentagem < 0.3) { // 18%
            return new PlataformaQuebrante(x, y)
        }

        return new PlataformaPulante(x, y) // 70%
    }
}


class Jogo {
    constructor() {
        this.posicaoMouseX = 0
        this.AdicionarRastreioDoMouse()

        this.dimensoes = {
            largura: 400,
            altura: 500
        }

        this.jogador = new Jogador(this.posicaoMouseX)
        this.plataformas = []
        this.ultimaPlataforma = null

        this.AreaDoJogo = this.NovoJogo()
        this.pontuacao = this.InicializarPontuacao()
        this.Renderizar()
    }

    NovoJogo() {
        this.main = document.querySelector('main')
        this.plataformas.forEach(plataforma => plataforma.elemento.remove())
        if(this.pontuacao)
        this.pontuacao.Definir(0)
        this.main.style.width = this.dimensoes.largura + "px"
        this.main.style.height = this.dimensoes.altura + "px"
        this.jogador.elemento.remove()
        this.jogador = new Jogador(this.posicaoMouseX)
        this.jogador.yBase = this.jogador.posicao.y
        this.jogador.estado = "pulando"
        this.plataformas = []
        this.InicializarPlataformas()


        return this.main
    }

    InicializarPontuacao() {
        const elementoPontuacao = document.createElement('h1')
        this.AreaDoJogo.append(elementoPontuacao)
        let valor = 0

        elementoPontuacao.style.position = "absolute"
        elementoPontuacao.style.left = this.dimensoes.largura / 2 + "px"
        elementoPontuacao.style.top = "0"
        elementoPontuacao.style.transform = "translateX(-50%)"
        elementoPontuacao.style.textAlign = "center"
        elementoPontuacao.style.zIndex = "999"

        Renderizar()

        function Renderizar() {
            elementoPontuacao.innerText = valor
        }

        function Adicionar() {
            valor++
            Renderizar()
        }

        function Definir(argumento) {
            valor = argumento
            Renderizar()
        }

        return {Adicionar, Definir}
    }

    VerificarColisao(el1, el2) {
        const r1 = el1.getBoundingClientRect()
        const r2 = el2.getBoundingClientRect()

        return !(
            r1.right < r2.left ||
            r1.left > r2.right ||
            r1.bottom < r2.top ||
            r1.top > r2.bottom
        )
    }

    AdicionarRastreioDoMouse() {
        document.addEventListener("mousemove", ({ clientX }) => {
            this.posicaoMouseX = clientX;
        });
    }

    InicializarPlataformas() {
        this.primeiraPlataforma = new Plataforma(this.jogador.posicao.x, this.dimensoes.altura - this.jogador.dimensoes.altura)

        this.plataformas.push(this.primeiraPlataforma)
        this.intervaloEntrePlataformas = this.jogador.alturaPulo * 0.9


        Array(Math.floor(this.dimensoes.altura / this.intervaloEntrePlataformas))
            .fill()
            .forEach((_, i) => this.plataformas.push(new Plataforma(Math.random() * (
                this.dimensoes.largura - this.primeiraPlataforma.dimensoes.largura
            ), this.primeiraPlataforma.posicao.y - ((i + 1) * this.intervaloEntrePlataformas)
            )))
    }

    Renderizar() {
        this.jogador.Animar()

        this.jogador.posicao.x = this.posicaoMouseX

        const elementos = [this.jogador].concat(this.plataformas)

        elementos.forEach(elemento => {
            if (this.jogador.posicao.y < this.dimensoes.altura / 2) {
                elemento.posicao.y += 4
                if (elemento.classe == "jogador") elemento.yBase += 4
            }

            if (!this.VerificarColisao(elemento.elemento, this.AreaDoJogo)) {
                if (elemento.classe == "plataforma") {
                    elemento.posicao.y = 0
                }

                if (elemento.classe == "jogador") {
                    this.NovoJogo()
                }
            }


            if (elemento.classe == "plataforma" && this.jogador.estado == "caindo" && this.VerificarColisao(this.jogador.elemento, elemento.elemento)) {
                this.jogador.AplicarPulo()

                if(elemento !== this.ultimaPlataforma){
                    this.pontuacao.Adicionar()
                    this.ultimaPlataforma = elemento
                }

            }

            elemento.Renderizar()
        })

        requestAnimationFrame(() => this.Renderizar())
    }
}

class ObjetoDoJogo {
    constructor() {
        this.posicao = {
            x: 0,
            y: 0
        }

        this.dimensoes = {
            largura: 0,
            altura: 0,
        }

        this.classe = ""
    }

    Criar() {
        this.elemento = document.createElement("div")

        this.elemento.style.position = "absolute"

        this.elemento.style.height = this.dimensoes.altura + "px"
        this.elemento.style.width = this.dimensoes.largura + "px"
        this.elemento.className = this.classe

        document.querySelector('main').append(this.elemento)
    }

    Renderizar() {
        this.elemento.style.top = this.posicao.y + "px";
        this.elemento.style.left = this.posicao.x + "px";
    }
}

class Jogador extends ObjetoDoJogo {
    constructor(x) {
        super();
        this.posicao.x = x;
        this.posicao.y = 500;
        this.dimensoes.largura = 20;
        this.dimensoes.altura = 20;
        this.classe = "jogador";

        this.alturaPulo = 150;
        this.yBase = 0;
        this.velocidade = 5;

        this.Criar();
        this.AplicarQueda();
    }

    Animar() {
        console.log(this)
        if (this.estado === "pulando") {
            this.posicao.y -= this.velocidade

            if (this.posicao.y <= this.yBase - this.alturaPulo) {
                this.AplicarQueda()
            }
        }

        if (this.estado === "caindo") {
            this.posicao.y += this.velocidade
        }

        this.elemento.style.top = this.posicao.y + "px"
        this.elemento.style.left = this.posicao.x + "px"
    }

    AplicarPulo() {
        this.estado = "pulando";
        this.yBase = this.posicao.y;
    }

    AplicarQueda() {
        this.estado = "caindo";
    }
}

class Plataforma extends ObjetoDoJogo {
    constructor(x, y) {
        super(x, y)
        this.posicao.x = x
        this.posicao.y = y
        this.dimensoes.largura = 40
        this.dimensoes.altura = 3
        this.classe = "plataforma"

        this.Criar()
    }
}

const jogo = new Jogo()
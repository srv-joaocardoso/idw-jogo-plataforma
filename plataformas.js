class Plataforma extends ObjetoDoJogo {
    static id = 0
    static audioPular = new Audio()

    constructor(x = 0, y = 40) {
        super({ x: x, y: y }, { largura: 100, altura: 100 }, "plataforma")

        this.id = Plataforma.id++
        this.classeHTML = 'plataforma'

        this.criarElemento()
    }

    acaoAoColidirComJogador(jogador = new Jogador()) {
        throw new Error("A função acaoAoColidirComJogador deve ser implementada por classes filhas de Plataforma.")
    }
}

class PlataformaPulante extends Plataforma {
    static audioPular = new Audio("./jump.wav")

    constructor(x, y) {
        super(x, y);
        this.elementoHTML.classList.add('plataforma-pulante')
    }

    acaoAoColidirComJogador(jogador = new Jogador()) {
        this.constructor.audioPular.currentTime = 0.1
        this.constructor.audioPular.play()
        jogador.projecaoVertical = 0.32
    }
}

class PlataformaQuebrante extends Plataforma {
    static audioPular = new Audio("./jump.wav")


    constructor(x, y) {
        super(x, y);
        this.elementoHTML.classList.add("plataforma-quebrante")
    }

    acaoAoColidirComJogador(jogador = new Jogador()) {
        this.constructor.audioPular.currentTime = 0.1
        this.constructor.audioPular.play()
        jogador.projecaoVertical = 0.24

        this.tangivel = false
        this.elementoHTML.classList.add('quebrando')
    }
}

class PlataformaTrampolim extends Plataforma {
    static audioPular = new Audio("./boing.mp3")

    constructor(x, y) {
        super(x, y);
        this.elementoHTML.classList.add("plataforma-trampolim")
    }

    acaoAoColidirComJogador(jogador = new Jogador()) {
        this.constructor.audioPular.currentTime = 0.1
        this.constructor.audioPular.play()

        jogador.projecaoVertical = 0.9
    }
}

class PlataformaEspinho extends Plataforma {
    static audioPular = new Audio("./espinho.mp3")

    constructor(x, y) {
        super(x, y);
        this.elementoHTML.classList.add("plataforma-espinho")
    }

    acaoAoColidirComJogador(jogador = new Jogador()) {
        this.constructor.audioPular.currentTime = 0.1
        this.constructor.audioPular.play()

        jogador.tangivel = false
    }
}


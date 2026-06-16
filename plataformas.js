class Plataforma extends ObjetoDoJogo {
    static id = 0
    static jump = new Audio()

    constructor(x = 0, y = 40) {
        super({ x: x, y: y }, { largura: 40, altura: 5 }, "plataforma")

        this.id = Plataforma.id++

        this.criarElemento()
    }

    acaoAoColidirComJogador(jogador = new Jogador()) {
        throw new Error("A função acaoAoColidirComJogador deve ser implementada por classes filhas de Plataforma.")
    }
}

class PlataformaPulante extends Plataforma {
    static jump = new Audio("./jump.wav")

    constructor(x, y) {
        super(x, y);
    }

    acaoAoColidirComJogador(jogador = new Jogador()) {
        this.constructor.jump.currentTime = 0.1
        this.constructor.jump.play()
        jogador.projecaoVertical = 0.15
    }
}

class PlataformaQuebrante extends Plataforma {
    static jump = new Audio("./jump.wav")

    constructor(x, y) {
        super(x, y);
    }

    acaoAoColidirComJogador(jogador = new Jogador()) {
        this.constructor.jump.currentTime = 0.1
        this.constructor.jump.play()
        jogador.projecaoVertical = 0.15

        this.elementoHTML
    }
}

class PlataformaTrampolim extends Plataforma {
    static jump = new Audio("./jump.wav")

    constructor(x, y) {
        super(x, y);
    }

    acaoAoColidirComJogador(jogador = new Jogador()) {
        this.constructor.jump.currentTime = 0.1
        this.constructor.jump.play()
        jogador.projecaoVertical = 0.3
    }
}

class PlataformaNuvem extends Plataforma {
    static jump = new Audio("./jump.wav")

    constructor(x, y) {
        super(x, y);
    }

    acaoAoColidirComJogador(jogador = new Jogador()) {
        this.constructor.jump.currentTime = 0.1
        this.constructor.jump.play()
        jogador.projecaoVertical = 0.15
    }
}

class PlataformaEspinho extends Plataforma {
    static jump = new Audio("./jump.wav")

    constructor(x, y) {
        super(x, y);
    }

    acaoAoColidirComJogador(jogador = new Jogador()) {
        this.constructor.jump.currentTime = 0.1
        this.constructor.jump.play()

        jogador.morrer()
    }
}


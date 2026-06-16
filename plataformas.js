class Plataforma extends ObjetoDoJogo {
    static id = 0
    static jump = new Audio()

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
    static jump = new Audio("./jump.wav")

    constructor(x, y) {
        super(x, y);
        this.elementoHTML.classList.add('plataforma-pulante')
    }

    acaoAoColidirComJogador(jogador = new Jogador()) {
        this.constructor.jump.currentTime = 0.1
        this.constructor.jump.play()
        jogador.projecaoVertical = 0.25
    }
}

class PlataformaQuebrante extends Plataforma {
    static jump = new Audio("./jump.wav")
    
    
    constructor(x, y) {
        super(x, y);
        this.elementoHTML.classList.add("plataforma-quebrante")
    }
    
    acaoAoColidirComJogador(jogador = new Jogador()) {
        this.constructor.jump.currentTime = 0.1
        this.constructor.jump.play()
        jogador.projecaoVertical = 0.15

        this.tangivel = false
    }
}

class PlataformaTrampolim extends Plataforma {
    static jump = new Audio("./jump.wav")
    
    constructor(x, y) {
        super(x, y);
        this.elementoHTML.classList.add("plataforma-trampolim")
    }
    
    acaoAoColidirComJogador(jogador = new Jogador()) {
        this.constructor.jump.currentTime = 0.1
        this.constructor.jump.play()
        jogador.projecaoVertical = 0.9
    }
}

class PlataformaEspinho extends Plataforma {
    static jump = new Audio("./jump.wav")
    
    constructor(x, y) {
        super(x, y);
        this.elementoHTML.classList.add("plataforma-espinho")
    }

    acaoAoColidirComJogador(jogador = new Jogador()) {
        this.constructor.jump.currentTime = 0.1
        this.constructor.jump.play()

        jogador.tangivel = false
    }
}


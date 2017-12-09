var juego = new Phaser.Game(800, 600, Phaser.CANVAS, 'tanks');

var tanques = [];
    var ip = "192.168.100.44";

Tanque = function(nombre, x, y, direccion, vida, juego, balaNormal, balaMedia, balaAlta) {

    this.nombre = nombre;
    this.x = x;
    this.y = y;
    this.juego = juego;
    this.balaNormal = balaNormal;
    this.balaMedia = balaMedia;
    this.balaAlta = balaAlta;
    this.direccion = direccion;
    this.vida = vida;
    this.tiempoBala = 0;
    this.tiempoEntreDisparos = 2000;
    this.botonDisparo = juego.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    this.botonDisparo2 = juego.input.keyboard.addKey(Phaser.Keyboard.X);
    this.botonDisparo3 = juego.input.keyboard.addKey(Phaser.Keyboard.C);
    this.tank = juego.add.sprite(x, y, 'tank1');

    // Cambia el centro de la imagen 
    this.tank.anchor.setTo(0.5);

    juego.physics.arcade.enable(this.tank, Phaser.Physics.ARCADE);

    // Habilitar Colisiones del tanque
    this.tank.body.immovable = true;
    this.tank.body.collideWorldBounds = true;
    this.tank.enableBody = true;
    this.tank.physicsBodyType = Phaser.Physics.ARCADE;
    this.tank.body.bounce.setTo(1, 1);

    // Redimensiona la imagen. (La disminuye en un 65%)
    this.tank.scale.setTo(0.65, 0.65);

    this.verificarDireccionTanques();
}

Tanque.prototype.verificarDireccionTanques = function() {

    if (this.direccion == "izquierda") {
        this.tank.angle = -180;
    } else if (this.direccion == "arriba") {
        this.tank.angle = -90;
    } else if (this.direccion == "abajo") {
        this.tank.angle = 90;
    } else if (this.direccion == "derecha") {
        this.tank.angle = 0;
    }
}

Tanque.prototype.mover = function(p_direccion) {

    if (p_direccion == "izquierda") {
        this.tank.position.x -= 1;
        this.direccion = "izquierda";
    } else if (p_direccion == "derecha") {
        this.tank.position.x += 1;
        this.direccion = "derecha";
    } else if (p_direccion == "arriba") {
        this.tank.position.y -= 1;
        this.direccion = "arriba";
    } else if (p_direccion == "abajo") {
        this.tank.position.y += 1;
        this.direccion = "abajo";
    }

    this.verificarDireccionTanques();
}

Tanque.prototype.disparar = function(tipoDisparo) {

    //console.log("tiempoBala:" +this.tiempoBala);

    if (juego.time.now > this.tiempoBala) {
        if (tipoDisparo == "balaNormal") {
            juego.sound.play('audio_bala_3');
            bala = this.balaNormal.getFirstExists(false);
        } else if (tipoDisparo == "balaMedia") {
            juego.sound.play('audio_bala_1');
            bala = this.balaMedia.getFirstExists(false);
        } else if (tipoDisparo == "balaAlta") {
            juego.sound.play('audio_bala_2');
            bala = this.balaAlta.getFirstExists(false);
        }
    } else {
        //console.log("No puede disparar tan rapido");
        return;
    }
    if (bala) {
        console.log("Disparado a : " + this.direccion);
        switch (this.direccion) {

            case 'arriba':
                bala.reset(this.tank.position.x, this.tank.position.y);
                bala.body.velocity.y = -300;
                break;

            case 'abajo':
                bala.reset(this.tank.position.x, this.tank.position.y + 77);
                bala.body.velocity.y = 300;
                break;

            case 'derecha':
                bala.reset(this.tank.position.x + 30, this.tank.position.y + 35);
                bala.body.velocity.x = 300;
                break;

            case 'izquierda':
                bala.reset(this.tank.position.x - 30, this.tank.position.y + 35);
                bala.body.velocity.x = -300;
                break;
        }
        this.tiempoBala = juego.time.now + this.tiempoEntreDisparos;
    }
}

var cursores;
var balas;
var balas2;
var balas3;
var disparo1;
var nombreTanque;

var estadoPrincipal = {

    preload: function() {
        juego.load.image('fondo', 'static/img/fondo.png');
        juego.load.image('tank1', 'static/img/Tank01_right.png');
        juego.load.image('balaNormal', 'static/img/BulletNormal.png');
        juego.load.image('balaMedia', 'static/img/bullet2.png');
        juego.load.image('balaAlta', 'static/img/bullet3.png');
        juego.load.audio('audio_bala_1', 'static/mp3/bala1.mp3');
        juego.load.audio('audio_bala_2', 'static/mp3/bala2.mp3');
        juego.load.audio('audio_bala_3', 'static/mp3/bala3.mp3');
    },

    create: function() {
        // Crear el fondo
        juego.add.tileSprite(0, 0, 800, 600, 'fondo');

        // Se crean las balas
        balas = juego.add.group();
        balas.enableBody = true;
        balas.physicsBodyType = Phaser.Physics.ARCADE;
        balas.createMultiple(20, 'balaNormal');
        balas.setAll('anchor.x', 0.5);
        balas.setAll('anchor.y', 1);
        balas.setAll('outOfBoundsKill', true);
        balas.setAll('checkWorldBounds', true);

        balas2 = juego.add.group();
        balas2.enableBody = true;
        balas2.physicsBodyType = Phaser.Physics.ARCADE;
        balas2.createMultiple(20, 'balaMedia');
        balas2.setAll('anchor.x', 0.5);
        balas2.setAll('anchor.y', 1);
        balas2.setAll('outOfBoundsKill', true);
        balas2.setAll('checkWorldBounds', true);

        balas3 = juego.add.group();
        balas3.enableBody = true;
        balas3.physicsBodyType = Phaser.Physics.ARCADE;
        balas3.createMultiple(20, 'balaAlta');
        balas3.setAll('anchor.x', 0.5);
        balas3.setAll('anchor.y', 1);
        balas3.setAll('outOfBoundsKill', true);
        balas3.setAll('checkWorldBounds', true);

        $.ajax({
        type: "GET",
        url: "http://"+ip+":5000/crearTanque",
        async: false,
        success: function(data) {
            nombreTanque = data.nombre;
        }

        });

        $.ajax({
        type: "GET",
        url: "http://"+ip+":5000/getTanks",
        async: false,
        success: function(data) {
            for (var i = 0; i < data.length; i++) {
                var tanque = data[i];
                newTank = new Tanque(tanque.nombre, tanque.x, tanque.y, tanque.direccion, tanque.vida, juego, balas, balas2, balas3);
                tanques.push(newTank); 
            }

            console.log(tanques.length);
           // console.log(tanques);
        }

        });

        // Maneja las teclas
        cursores = juego.input.keyboard.createCursorKeys();

        // Establece los limites del canvas
        juego.physics.startSystem(Phaser.Physics.ARCADE);

        // Agrega MP3
        audio_bala_1 = juego.add.audio('audio_bala_1');
        audio_bala_2 = juego.add.audio('audio_bala_2');
        audio_bala_3 = juego.add.audio('audio_bala_3');
        //disparo1.allowMultiple = true;

    },

    update: function() {

        // Establece los limites del canvas
        juego.physics.startSystem(Phaser.Physics.ARCADE);

        stateText = juego.add.text(juego.world.centerX, juego.world.centerY, 'Game Over', { font: '84px Arial', fill: '#fff' });
        stateText.anchor.setTo(0.5, 0.5);
        stateText.visible = false;

        // if (cursores.right.isDown) {
        //     miTanque.mover("derecha");
        // } else if (cursores.left.isDown) {
        //     nuevoTanque.mover("izquierda");
        // } else if (cursores.up.isDown) {
        //     nuevoTanque.mover("arriba");
        // } else if (cursores.down.isDown) {
        //     nuevoTanque.mover("abajo");
        // }

        // if (nuevoTanque.botonDisparo.isDown) {
        //     nuevoTanque.disparar("balaNormal");
        // }

        // if (nuevoTanque.botonDisparo2.isDown) {
        //     nuevoTanque.disparar("balaMedia");
        // }

        // if (nuevoTanque.botonDisparo3.isDown) {
        //     nuevoTanque.disparar("balaAlta");
        // }

        for (var i = 0; i < tanques.length; i++) {

            juego.physics.arcade.overlap(balas, tanques[i].tank, colisionBalas, null, this);
            juego.physics.arcade.overlap(balas2, tanques[i].tank, colisionBalas2, null, this);
            juego.physics.arcade.overlap(balas3, tanques[i].tank, colisionBalas3, null, this);

        }

    },

    render: function() {

        var pos = 0;
        juego.debug.text(tanques.length,300,50);

        for (var i = 0; i < tanques.length; i++) {
            pos += 20
            juego.debug.text(tanques[i].nombre+ " x:" + 
                tanques[i].tank.position.x + 
                " y:" + tanques[i].tank.position.y + 
                " Vida: " + tanques[i].vida, 500, pos);
        }

    },

    restartGame: function() {
        this.music.stop();
    }

};

function depiringue(){
    for (var i = tanques.length - 1; i >= 0; i--) {
        tanques[i].tank.destroy()
    }
}

function actualizaPosicionTanques(){

    $.ajax({
        type: "GET",
        url: "http://"+ip+":5000/getTanks",
        async: false,
        success: function(data) {
            depiringue();
            tanques = [];
            for (var i = 0; i < data.length; i++) {
                var tanque = data[i];
                //console.log("Tanque: "+ data[i].nombre + " x: "+ data[i].x + " y: " + data[i]   .y);

                if(tanque.vida>0){
                    newTank = new Tanque(tanque.nombre, tanque.x, tanque.y, tanque.direccion, tanque.vida, juego, balas, balas2, balas3);
                    tanques.push(newTank);            
                }
            }
        }
    
        //console.log("Actualizando posicion de los tanques");
        
    });
}


function colisionTanques(tanque1, tanque2) {

    console.log(tanque1);
    console.log("Chocaroooon");

}

function actualizaVida(nombreTanque,vida){

    $.ajax({
        type: "GET",
        url: "http://"+ip+":5000/actualizaVida",
        async: false,
        data: {tank: nombreTanque, vida:vida},
        success: function(data) {
            console.log(data);
        }
    });

}

function obtenerTanque(tank) {

    for (var i = 0; i < tanques.length; i++) {
        if (tanques[i].tank == tank) {
            return i;
        }
    }
    return null;
}

function colisionBalas(tanque, bala) {

    var tank = tanques[obtenerTanque(tanque)];
    console.log(tank);

    if (juego.time.now > tank.tiempoBala) {
        actualizaVida(tank.nombre,0.5);
        tank.vida -= 0.5;
        bala.kill();
    }

    if(tank.vida<=0){
        console.log("se murio el tanque");
        tank.tank.kill();
        bala.kill();
    }

    tank.tiempoBala = juego.time.now + tank.tiempoEntreDisparos;
    
}

function colisionBalas2(tanque, bala) {

    var tank = tanques[obtenerTanque(tanque)];
    console.log(tank);

    if (juego.time.now > tank.tiempoBala) {
        actualizaVida(tank.nombre,50);
        tank.vida -= 50;
        bala.kill();
    }

    if(tank.vida<=0){
        console.log("se murio el tanque");
        tank.tank.kill();
        bala.kill();
    }

    tank.tiempoBala = juego.time.now + tank.tiempoEntreDisparos;

}

function colisionBalas3(tanque, bala) {

    var tank = tanques[obtenerTanque(tanque)];
    console.log(tank);

    if (juego.time.now > tank.tiempoBala) {
        actualizaVida(tank.nombre,100);
        tank.vida -= 100;
        bala.kill();
    }

    if(tank.vida<=0){
        console.log("se murio el tanque");
        tank.tank.kill();
        bala.kill();
    }

    tank.tiempoBala = juego.time.now + tank.tiempoEntreDisparos;
}


juego.state.add('principal', estadoPrincipal);
juego.state.start('principal');


function jugarAutomatico(){

$.ajax({
        type: "GET",
        url: "http://"+ip+":5000/brain",
        async: false,
        success: function(data) {
            console.log(data.disparo);

            for (var i = 0; i < tanques.length; i++) {
                if(tanques[i].nombre == data.tanque){
                    if(data.disparo == 1){
                        tanques[i].disparar("balaNormal");    
                    }
                    if(data.disparo == 2){
                        tanques[i].disparar("balaMedia");    
                    }
                    if(data.disparo == 3){
                        tanques[i].disparar("balaAlta");    
                    }
                    
                    return;
                }
            }

            actualizaPosicionTanques();
        }
         // Fin Ajax
    });
}

$(document).ready(function() {

    setInterval(function() {

        jugarAutomatico();

    }, 250);

});
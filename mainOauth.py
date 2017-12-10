from flask import Flask,request,jsonify,render_template, make_response,url_for
from random import randint
import jwt
import datetime
from functools import wraps
from flask_dance.contrib.twitter import make_twitter_blueprint, twitter
from werkzeug.utils import redirect

app = Flask(__name__)
numTanks = 0
tanques = []
app.config['SECRET_KEY'] = 'ulacit'
twitter_blueprint = make_twitter_blueprint(api_key='Zy17N4uIK4pjExwyd3Fzo1vxz',
                                           api_secret='7H6KeCRYDwSjnhCuZBWI76aq4jdYp8pD10eTqmDX2JVWw6vByb')

app.register_blueprint(twitter_blueprint, url_prefix='/twitter_login')

@app.route('/twitter')
def twitter_login():

    if not twitter.authorized:
        return redirect(url_for('twitter.login'))
    account_info = twitter.get('account/settings.json')

    if account_info.ok:
        account_info_json = account_info.json()
    
        return render_template('TankOauth.html')
        #return '<h1>Your Twitter name is @{}'.format(account_info_json['screen_name'])

    return '<h1>Request failed!</h1>'


class Tank:
    def __init__(self,nombre,x,y,direccion):
        self.x = x
        self.y = y
        self.nombre = nombre
        self.vida = 100
        self.direccion = direccion

    def imprimir(self):
        return {'nombre':self.nombre,
                'x':self.x,
                'y':self.y,
                'vida': self.vida,
                'direccion': self.direccion
                }


@app.route("/Tanks")
def game():
    return render_template('TankOauth.html')

@app.route("/TankOauth")
def game2():
    return render_template('TankOauth.html')

@app.route("/")
def twitterredic():
    return redirect('/twitter')

@app.route("/Login")
def login():
    return render_template('Login.html')


@app.route("/Logout")
def logout():
    return render_template('Login.html'), 401


@app.route("/getTanks")
def info():
    salida = []
    for i in tanques:
        salida.append(i.imprimir())
    return jsonify(salida)


@app.route("/crearTanque")
def crearNuevoTanque():
        global numTanks
        randX = randint(30, 770)
        randY = randint(30, 570)
        numTanks= numTanks +1
        tank = Tank('Tank'+str(numTanks),randX,randY,direccion())
        tanques.append(tank)
        return jsonify(tank.imprimir())


def direccion():
    direccion = randint(1, 4)
    if direccion==1:
        return 'izquierda'
    if direccion==2:
        return 'derecha'
    if direccion==3:
        return 'arriba'
    if direccion==4:
        return 'abajo'


@app.route('/brain', methods=['GET'])
def brain():
    for tanque in tanques:

        num_aleatorio = randint(1, 5)

        if num_aleatorio == 1:
            mover(tanque.nombre, "izquierda")
        elif num_aleatorio == 2:
            mover(tanque.nombre, "derecha")
        elif num_aleatorio == 3:
            mover(tanque.nombre, "arriba")
        elif num_aleatorio == 4:
            mover(tanque.nombre, "abajo")
        elif num_aleatorio == 5:
            return disparoAleatorio(tanque.nombre)

    salida = []
    for i in tanques:
        salida.append(i.imprimir())
    return jsonify(salida)

# Metodo que mueve un tanque en una direccion dada
def mover(nombre,direccion):
    for tank in tanques:
        if tank.nombre == nombre:
            if direccion == 'derecha':
                if(tank.x<=770):
                    tank.x += 7
                    tank.direccion='derecha'
                return
            if direccion == 'izquierda':
                if(tank.x>30):
                    tank.x -= 7
                    tank.direccion='izquierda'
                return
            if direccion == 'arriba':
                if(tank.y>30):
                    tank.y -= 7
                    tank.direccion='arriba'
                return
            if direccion == 'abajo':
                if(tank.y<=570):
                    tank.y += 7
                    tank.direccion='abajo'
                return

def disparoAleatorio(tank):
    num_aleatorio = randint(0, 3)
    return jsonify(tanque=tank,disparo=num_aleatorio)

@app.route('/actualizaVida', methods=['GET'])
def vida():
    if request.method == 'GET':
        nombreTanque = request.args.get('tank')
        vida = request.args.get('vida')
        for tanque in tanques:
            if tanque.nombre == nombreTanque:
                tanque.vida -= int(vida)
                return jsonify(vida=tanque.vida)
        return jsonify(vida=vida,nombreTanque=nombreTanque)


if __name__ == '__main__':
    app.run('0.0.0.0',5002,debug=True)
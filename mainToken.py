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
username = 'user'
password = '123'
app.config['SECRET_KEY'] = 'ulacit'

def requiere_token(funcion):
    @wraps(funcion)
    def validar_token(*args, **kwargs):
        token = request.args.get('token') #http://127.0.0.1:5000/route?token=alshfjfjdklsfj89549834ur

        if not token:
            return jsonify({'message' : 'Se requiere un Token!'}), 403

        try:
            data = jwt.decode(token, app.config['SECRET_KEY'])
        except:
            return jsonify({'message' : 'Token invalido'}), 403

        return funcion(*args, **kwargs)

    return validar_token

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
    return render_template('TankToken.html')

@app.route("/")
def redic():
    return redirect('/Login')

@app.route("/TanksToken")
@requiere_token
def tanksToken():
    return render_template('TankToken.html')

@app.route("/Login")
def login():
    return render_template('Login.html')

@app.route("/LoginToken")
def token():
    global username
    global password
    auth = request.authorization

    if auth and auth.password == password and auth.username == username:
        token = jwt.encode({'user': auth.username, 'exp': datetime.datetime.utcnow() + datetime.timedelta(minutes=60)},
                           app.config['SECRET_KEY'])

        return redirect('/TanksToken'+"?token="+token.decode('UTF-8'))

    return make_response('Could not verify!', 401, {'WWW-Authenticate': 'Basic realm="Login Required"'})


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
    app.run('0.0.0.0',5001,debug=True)
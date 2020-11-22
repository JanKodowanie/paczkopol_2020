from flask import Flask, render_template, make_response, request, session, jsonify
from flask_session import Session
from os import getenv
from dotenv import load_dotenv
from redis import StrictRedis
from redis.exceptions import ConnectionError
from bcrypt import checkpw, gensalt, hashpw
from datetime import datetime
import sys
import re


app = Flask(__name__)

load_dotenv()
SECRET_KEY = getenv("SECRET_KEY")
SESSION_COOKIE_HTTPONLY = True
REDIS_HOST = getenv("REDIS_HOST")
REDIS_PASS = getenv("REDIS_PASS")
db = StrictRedis(REDIS_HOST, db=10, password=REDIS_PASS)

try:
    db.info()
except ConnectionError:
    print("Couldn't connect to database. Process will terminate.")
    sys.exit(-1)

SESSION_TYPE = "redis"
SESSION_REDIS = db
app.config.from_object(__name__)
ses = Session(app)


def save_user(validated_data):
    salt = gensalt()
    password = validated_data['password'].encode()
    hashed_pw = hashpw(password, salt)
    validated_data['password'] = hashed_pw
    login = validated_data.pop('login')
    validated_data.pop('password2')

    try:
        for k, v in validated_data.items():
            db.hset(f'user: {login}', k, v)
    except Exception:
        return False

    return True


def check_if_user_exists(login):
    return db.hexists(f'user: {login}', 'email')


def check_if_user_credentials_are_valid(login, password): 
    if not check_if_user_exists(login):
        return False

    hashed_pw = db.hget(f'user: {login}', 'password')
    return checkpw(password.encode(), hashed_pw)


@app.route('/')
def start():
    return render_template('start.html')


@app.route('/sender/register', methods=['GET'])
def registration_view_get():
    return render_template('registration.html')


@app.route('/sender/register/check-login/<login>', methods=['GET'])
def registration_check_login(login):
    return jsonify(available= not check_if_user_exists(login)), 200


@app.route('/sender/register', methods=['POST'])
def registration_view_post():
    data = {}
    data['firstname'] = request.form.get("firstname", None)  
    data['lastname'] = request.form.get("lastname", None)
    data['login'] = request.form.get("login", None)
    data['email'] = request.form.get("email", None)
    data['password'] = request.form.get("password", None)
    data['password2'] = request.form.get("password2", None)
    data['address'] = request.form.get("address", None)
    
    errors = {}
    for k, v in data.items():
        if not v:
            errors[k] = "field cannot be empty"

    if data['firstname'] and not re.match("^[A-ZĄĆĘŁŃÓŚŹŻ][a-ząćęłńóśźż]+$", data['firstname']):
        errors['firstname'] = "provide a valid firstname"

    if data['lastname'] and not re.match("^[A-ZĄĆĘŁŃÓŚŹŻ][a-ząćęłńóśźż]+$", data['lastname']):
        errors['lastname'] = "provide a valid lastname"

    if data['login'] and not re.match("[a-z]{3,12}", data['login']):
        errors['login'] = "login must contain 3-12 small letters"

    if data['email'] and not re.match("^[\w\-\.]+@([\w\-]+\.)+[\w]{1,}$", data['email']):
        errors['email'] = "provide a valid email address"

    if data['password'] and not re.match(".{8,}", data['password']):
        errors['password'] = "password must contain at least 8 characters"

    if data['password'] and data['password2'] and not data['password'] == data['password2']:
        errors['password2'] = "passwords don't match"

    if data['address'] and not re.match("^[0-9a-zA-ZĄĆĘŁŃÓŚŹŻąćęłńóśźż]+[\s\-\,]{0,}$", data['address']):
        errors['address'] = "provide a valid address"
    
    if errors:
        return jsonify(errors=errors), 400

    save_user(data)
    response = make_response("", 301)
    response.headers["Location"] = "/sender/login"

    return response


@app.route('/sender/login', methods=['GET'])
def login_view_get():
    return render_template('login.html')


@app.route('/sender/login', methods=['POST'])
def login_view_post():
    data = {}
    data['login'] = request.form.get("login", None)  
    data['password'] = request.form.get("password", None)
    
    for k, v in data.items():
        if not v:
            return jsonify(error=f"{k} field cannot be empty."), 400

    if check_if_user_credentials_are_valid(data['login'], data['password']):
        session["login"] = data['login']
        session["timestamp"] = datetime.now()
        response = make_response("", 301)
        response.headers["Location"] = "/sender/dashboard"
        return response

    return jsonify(error=f"Failed to login user with credentials given."), 400    


@app.route('/sender/logout', methods=['GET'])
def logout_view():
    session.clear()
    response = make_response("", 301)
    response.headers["Location"] = "/"
    response.headers['Cache-Control'] = 'no-cache, no-store, must-revalidate'
    return response


@app.route('/sender/dashboard', methods=['GET'])
def dashboard_view():
    if 'login' not in session:
        return jsonify(error="user not authenticated"), 403

    return render_template('dashboard.html')


if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5000, debug=True)
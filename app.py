from flask import Flask, render_template, make_response, request, session
from flask_session import Session
from os import getenv
from dotenv import load_dotenv
from redis import StrictRedis
from bcrypt import checkpw, gensalt, hashpw

app = Flask(__name__)
app.debug = False
load_dotenv()
REDIS_HOST = getenv("REDIS_HOST")
REDIS_PASS = getenv("REDIS_PASS")
db = StrictRedis(REDIS_HOST, db=10, password=REDIS_PASS)

SESSION_TYPE = "redis"
SESSION_REDIS = db
app.config.from_object(__name__)
app.secret_key = getenv("SECRET_KEY")
ses = Session(app)

def save_user(validated_data):
    salt = gensalt()
    password = password.encode()
    hashed_pw = hashpw(password, salt)
    validated_data['password'] = hashed_pw
    login = validated_data.pop('login')
    validated_data.pop('password2')

    try:
        for k, v in validated_data:
            db.hset(f'user: {login}', k, v)
    except Exception:
        return False

    return True

@app.route('/')
def start():
    return render_template('start.html')

@app.route('/sender/register', methods=['GET'])
def registration_view_get():
    return render_template('registration.html')

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

    save_user(data)

    response = make_response("", 301)
    response.headers["Location"] = "/sender/login"
    return response


if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5000)
from flask import Flask

app = Flask(__name__)

@app.route('/')
def index():
    return "<h1>Howdy pardner</h1>"

if __name__ == '__main__':
    app.run(threaded=True, port=5000, debug=True)
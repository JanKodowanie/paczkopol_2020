from flask import Flask, render_template

app = Flask(__name__)
app.debug = False

@app.route('/')
def start():
    return render_template('start.html')

@app.route('/sender/sign-up')
def registration():
    return render_template('registration.html')

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5000, debug=True)
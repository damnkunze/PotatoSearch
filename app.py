from flask import Flask, render_template, url_for

app = Flask(__name__)

@app.route("/")
def index():
    return render_template('index.html')

"""
@app.route("/other/")
def other():
    return render_template('other/index.html')

@app.route("/other/polyInvaders")
def polyInvaders():
    return render_template('other/polyInvaders/index.html')

@app.route("/other/DrawYourThing")
def drawYourThing():
    return render_template('other/DrawYourThing/index.html')

@app.route("/other/Ball")
def ball():
    return render_template('other/Ball/index.html')

"""
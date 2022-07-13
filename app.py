import requests
from flask import Flask, render_template, jsonify, request, redirect, url_for
from pymongo import MongoClient
import certifi
from dotenv import load_dotenv
import os
import jwt
import hashlib
from werkzeug.utils import secure_filename
from datetime import datetime, timedelta

# 환경 변수 ---------------------------------------------------------------------- #
MONGODB_URL = os.getenv("MONGODB_URL")
SECRET_KEY = os.getenv("SECRET_KEY")

ca = certifi.where()
client = MongoClient(MONGODB_URL, tlsCAFile=ca)
db = client.imdb99dbprac

app = Flask(__name__)


@app.route("/")
def home():
    token_receive = request.cookies.get("token")
    try:
        payload = jwt.decode(token_receive, SECRET_KEY, algorithms=["HS256"])
        user_info = db.users.find_one({"email": payload["id"]})
        print(user_info)
        return render_template("index.html", user_info=user_info)
    except jwt.ExpiredSignatureError:
        return redirect(url_for("signin", message="Your login session has expired. Please try again."))
    except jwt.exceptions.DecodeError:
        return redirect(url_for("signin", message="Your account information does not exist. Please try again."))


# SIGN IN -------------------------------------------------------------------- #
@app.route("/signin")
def signin():
    message = request.args.get("message")
    return render_template("signin.html", message=message)


# SIGN UP -------------------------------------------------------------------- #
@app.route("/signup")
def signup():
    return render_template("signup.html")


@app.route('/signup/save', methods=['POST'])
def sign_up():
    useremail_receive = request.form['useremail_give']
    username_receive = request.form['username_give']
    password_receive = request.form['password_give']
    password_hash = hashlib.sha256(
        password_receive.encode('utf-8')).hexdigest()
    doc = {
        "email": useremail_receive,
        "username": username_receive,
        "password": password_hash,
    }
    db.users.insert_one(doc)
    return jsonify({'msg': '가입완료'})


# WELCOME -------------------------------------------------------------------- #
@app.route("/welcome")
def welcome():
    return render_template("welcome.html")


# MAIN PAGE ------------------------------------------------------------------ #

# MY PAGE -------------------------------------------------------------------- #
@app.route("/mypage/<username>")
def mypage(username):
    token_receive = request.cookies.get("token")
    try:
        payload = jwt.decode(token_receive, SECRET_KEY, algorithms=["HS256"])
        # 내 프로필이면 True
        status = (username == payload["id"])
        user_info = db.users.find_one({"username": username}, {"_id": False})
        return render_template("mypage.html", user_info=user_info, status=status)
    except (jwt.ExpiredSignatureError, jwt.exceptions.DecodeError):
        return redirect(url_for("home"))


# DB TEST -------------------------------------------------------------------- #
@app.route('/dbtest', methods=['POST'])
def dbtest_post():
    text_receive = request.form['text_give']

    doc = {
        'text': text_receive,
    }
    db.testdb.insert_one(doc)
    return jsonify({'msg': 'MONGODB TEST SUCCESS'})


if __name__ == '__main__':
    app.run('0.0.0.0', port=5000, debug=True)

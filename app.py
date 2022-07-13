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

app = Flask(__name__)

# 환경 변수 ---------------------------------------------------------------------- #
MONGODB_URL = os.getenv("MONGODB_URL")
SECRET_KEY = os.getenv("SECRET_KEY")

ca = certifi.where()
client = MongoClient(MONGODB_URL, tlsCAFile=ca)
db = client.imdb99db


@app.route("/")
def home():
    token_receive = request.cookies.get("mytoken")
    try:
        payload = jwt.decode(token_receive, SECRET_KEY, algorithms=["HS256"])
        user_info = db.users.find_one({"email": payload["id"]})
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


@app.route('/sign_in', methods=['POST'])
def sign_in():
    useremail_receive = request.form['useremail_give']
    password_receive = request.form['password_give']
    pw_hash = hashlib.sha256(password_receive.encode('utf-8')).hexdigest()

    result = db.users.find_one(
        {'email': useremail_receive, 'password': pw_hash})
    if result is not None:
        payload = {
            'id': useremail_receive,
            'exp': datetime.utcnow() + timedelta(seconds=60 * 60 * 24)  # 로그인 24시간 유지
        }
        # JWT 버전 문제 ------------------------------------------------------------------ #
        # token = jwt.encode(payload, SECRET_KEY,
        #                    algorithm='HS256').decode('utf-8')
        token = jwt.encode(payload, SECRET_KEY,
                           algorithm='HS256')

        return jsonify({'result': 'success', 'token': token})
    # 찾지 못하면
    else:
        return jsonify({'result': 'fail', 'msg': '아이디/비밀번호가 일치하지 않습니다.'})


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
@app.route("/api/like", methods=["POST"])
def add_like():
    token_receive = request.cookies.get("mytoken")
    try:
        payload = jwt.decode(token_receive, SECRET_KEY, algorithms=["HS256"])
        user_info = db.users.find_one({"email": payload["id"]})
        targetmovie_receive = request.form["targetmovie_give"]

        doc = {
            "email": user_info["email"],
            "movie": targetmovie_receive,
        }

        db.likes.insert_one(doc)

        return jsonify({"message": "SUCCESS : UPDATE LIKE"})
    except (jwt.ExpiredSignatureError, jwt.exceptions.DecodeError):
        return redirect(url_for("home"))


@app.route("/api/like", methods=["DELETE"])
def delete_like():
    token_receive = request.cookies.get("mytoken")
    try:
        payload = jwt.decode(token_receive, SECRET_KEY, algorithms=["HS256"])
        user_info = db.users.find_one({"email": payload["id"]})
        targetmovie_receive = request.form["targetmovie_give"]

        db.likes.delete_one({"movie": targetmovie_receive,
                            "email": user_info["email"]})

        return jsonify({"message": "SUCCESS : DELETE LIKE"})
    except (jwt.ExpiredSignatureError, jwt.exceptions.DecodeError):
        return redirect(url_for("home"))


# MY PAGE -------------------------------------------------------------------- #
@app.route("/mypage/<username>")
def mypage(username):
    token_receive = request.cookies.get("mytoken")
    try:
        payload = jwt.decode(token_receive, SECRET_KEY, algorithms=["HS256"])
        # 내 프로필이면 True
        status = (username == payload["id"])
        user_info = db.users.find_one({"username": username}, {"_id": False})
        return render_template("mypage.html", user_info=user_info, status=status)
    except (jwt.ExpiredSignatureError, jwt.exceptions.DecodeError):
        return redirect(url_for("home"))


@app.route("/api/movielist", methods=["GET"])
def get_likes():
    token_receive = request.cookies.get("mytoken")
    try:
        payload = jwt.decode(token_receive, SECRET_KEY, algorithms=["HS256"])
        user_info = db.users.find_one({"email": payload["id"]})
        movie_list = list(db.likes.find({"email": user_info["email"]}, {"_id":
                                                                        False}))
        return jsonify({"movielist": movie_list, "message": "SUCCESS : GET LIKE"})
    except (jwt.ExpiredSignatureError, jwt.exceptions.DecodeError):
        return redirect(url_for("home"))

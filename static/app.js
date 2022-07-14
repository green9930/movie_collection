/* JS 연결 확인 ----------------------------------------------------------------- */
const test = () => {
  console.log('JavaScript connected!');
};

/* app.js ------------------------------------------------------------------- */
$(document).ready(() => {
  // 페이지 로딩 후 바로 들어오는 GET 함수는 이곳에서 호출
  fetchData(POPULAR_MOVIES);
});

const goToHome = () => {
  window.location.href = '/';
};

/* SIGN IN ------------------------------------------------------------------ */

const goToSignIn = () => {
  window.location.href = '/signin';
};

let $useremailin = document.querySelector('#input-useremail-in');
let $passwordin = document.querySelector('#input-password-in');

function sign_in() {
  if ($useremailin.value === '') {
    alert('아이디를 입력해주세요');
  } else if ($passwordin.value === '') {
    alert('비밀번호를 입력해주세요');
  } else {
    $.ajax({
      type: 'POST',
      url: '/sign_in',
      data: {
        useremail_give: $useremailin.value,
        password_give: $passwordin.value,
      },
      success: function (response) {
        console.log(response.result);
        if (response['result'] === 'success') {
          $.cookie('mytoken', response['mytoken'], { path: '/' });
          window.location.replace('/');
        } else {
          alert(response['msg']);
        }
      },
    });
  }
}

/* SIGN UP ------------------------------------------------------------------ */
const goToSignUp = () => {
  window.location.href = '/signup';
};

const $useremail = document.querySelector('#input-useremail');
const $username = document.querySelector('#input-username');
const $password = document.querySelector('#input-password');
const $password2 = document.querySelector('#input-password2');

const $emailmsg = document.querySelector('#emailmsg');
const $namemsg = document.querySelector('#namemsg');
const $pwmsg1 = document.querySelector('#pwmsg1');
const $pwmsg2 = document.querySelector('#pwmsg2');

const $viewPw = document.querySelector('.view-pw');

let emailcheck = false;
let pwcheck = false;
let namecheck = false;

function sign_up() {
  if ($useremail.value === '') {
    $emailmsg.innerText = '이메일을 입력해주세요';
  } else if (!is_useremail($useremail.value)) {
    $emailmsg.innerText = '이메일 형식을 확인해주세요.';
  } else {
    $emailmsg.innerText = '사용가능한 이메일 입니다';
    emailcheck = true;
  }

  if ($username.value === '') {
    $namemsg.innerText = '닉네임을 입력해주세요';
  } else if (is_username($username.value)) {
    $namemsg.innerText = '공백 및 특수문자는 사용이 불가합니다.';
  } else if (is_username2($username.value)) {
    $namemsg.innerText = '공백 및 특수문자는 사용이 불가합니다.';
  } else {
    $namemsg.innerText = '사용가능한 닉네임 입니다';
    namecheck = true;
  }

  if ($password.value === '') {
    $pwmsg1.innerText = '비밀번호를 입력해주세요';
  } else if (!is_password($password.value)) {
    $pwmsg1.innerText =
      '비밀번호의 형식을 확인해주세요. 영문과 숫자 필수 포함, 특수문자(!@#$%^&*) 사용가능 8-20자';
  } else {
    $pwmsg1.innerText = '사용가능한 비밀번호 입니다.';
  }
  if ($password2.value === '') {
    $pwmsg2.innerText = '확인용 비밀번호를 입력해주세요';
  } else if ($password2.value !== $password.value) {
    $pwmsg2.innerText = '비밀번호가 일치하지 않습니다.';
  } else {
    $pwmsg2.innerText = '비밀번호가 일치합니다.';
    pwcheck = true;
  }

  if (emailcheck === true && pwcheck === true && namecheck === true) {
    $.ajax({
      type: 'POST',
      url: '/signup/save',
      data: {
        useremail_give: $useremail.value,
        username_give: $username.value,
        password_give: $password.value,
      },
      success: function (response) {
        alert(response['msg']);
        window.location.replace('/welcome');
      },
    });
  }
}

function is_useremail(asValue) {
  const regExp =
    /^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i;
  return regExp.test(asValue);
}

function is_password(asValue) {
  const regExp = /^(?=.*\d)(?=.*[a-zA-Z])[0-9a-zA-Z!@#$%^&*]{8,20}$/;
  return regExp.test(asValue);
}

function is_username(asValue) {
  const regExp = /[`~!@#$%^&*|\\\'\";:\/?]/gi;
  return regExp.test(asValue);
}

function is_username2(asValue) {
  const regExp = /\s/g;
  return regExp.test(asValue);
}

function view_pw(event) {
  $('.view-pw').empty();
  let target = event.parentElement.children[0];
  let imgsrc = '';
  if (target.type === 'password') {
    target.type = 'text';
    imgsrc = '../static/images/eye-closed-svgrepo-com.svg';
  } else {
    target.type = 'password';
    imgsrc = '../static/images/open-eye.png';
  }
  let img_html = `<img src="${imgsrc}" class="view-pw-img" alt="password-visible" />`;
  $('.view-pw').append(img_html);
}

/* SIGN OUT ------------------------------------------------------------------ */
const handleSignOut = () => {
  $.removeCookie('mytoken', { path: '/' });
  alert('SUCCESS : SIGN OUT');
  window.location.href = '/signin';
};

/* MAIN PAGE ---------------------------------------------------------------- */
const goToMainPage = () => {
  window.location.href = '/';
};

const TMDB_KEY = 'b8732a28012043cd71b5f3b9a7424308';
const BASE_URL = 'https://api.themoviedb.org/3';
const BASE_LANG = 'ko';
const BASE_REGION = 'KR';
const POPULAR_MOVIES = `${BASE_URL}/movie/popular?api_key=${TMDB_KEY}&language=${BASE_LANG}&region=${BASE_REGION}`;

const getImageUrl = (path, size = 300) => {
  return `https://image.tmdb.org/t/p/w${size}${path}`;
};

/* 영화 API 호출 ---------------------------------------------------------------- */
const fetchData = async (url) => {
  try {
    const response = await fetch(url);
    const jsonData = await response.json();
    setMovieList(jsonData.results);
    setMyMovieList(jsonData.results);
  } catch (err) {
    console.error(err);
  }
};

const setMovieList = (movies) => {
  $.ajax({
    type: 'GET',
    url: '/api/movielist',
    data: {},
    success: (res) => {
      console.log(res.message);
    },
  }).then((res) => {
    const mymovies = res.movielist;
    const movieArr = mymovies.map((movie) => {
      return parseInt(movie.movie);
    });

    let arr = [];

    movies.map((movie) => {
      const movieId = movie.id;
      const isTarget = movieArr.includes(movieId);
      arr.push({ ...movie, isChecked: isTarget });
    });

    printMovieList(arr);
  });
};

const printMovieList = (arr) => {
  $('.movie-list').empty();
  arr.map((item) => {
    const { title, original_title, poster_path, id, isChecked } = item;
    const checked = isChecked ? 'checked' : '';
    const isVisible = isChecked ? 'isVisible' : '';
    const isColored = isChecked ? 'isColored' : '';
    let movie_html = `<li class="movie-item">
                        <img class="movie-poster" src=${getImageUrl(
                          poster_path
                        )} alt="movie poster" />
                        <div class="movie-subbox ${isVisible}">
                          <span class="movie-like-message ${isColored}">I LIKE THIS MOVIE</span>
                          <span class="movie-title">${title}</span>
                          <span class="movie-original-title">${original_title}</span>
                          <div class="like-wrapper">
                            <span class="movie-like-text">LIKE</span>
                            <label class="movie-like-label a11y-hidden" for="movie-checkbox">LIKE</label>
                            <input type="checkbox" id="movie-checkbox" class="${id} movie-like-btn"} ${checked}/>
                          </div>
                        </div>
                      </li>`;
    $('.movie-list').append(movie_html);
  });
};

$(document).on('click', '.movie-poster', (e) => {
  e.target.nextElementSibling.classList.add('isVisible');
});

$(document).on('click', '.isVisible', (e) => {
  !e.target.firstElementChild.classList.contains('isColored') &&
    e.target.classList.remove('isVisible');
});

$(document).on('change', '.movie-like-btn', (e) => {
  const isLike = e.target.checked;
  isLike
    ? e.target.parentElement.parentElement.firstElementChild.classList.add(
        'isColored'
      )
    : e.target.parentElement.parentElement.firstElementChild.classList.remove(
        'isColored'
      );

  const targetMovie = e.target.classList[0];
  isLike ? handleAddLike(targetMovie) : handleDeleteLike(targetMovie);
});

const handleAddLike = (targetMovie) => {
  $.ajax({
    type: 'POST',
    url: '/api/like',
    data: {
      targetmovie_give: targetMovie,
    },
    success: (res) => {
      console.log(res.message);
      fetchData(POPULAR_MOVIES);
    },
  });
};

const handleDeleteLike = (targetMovie) => {
  $.ajax({
    type: 'DELETE',
    url: '/api/like',
    data: {
      targetmovie_give: targetMovie,
    },
    success: (res) => {
      console.log(res.message);
      fetchData(POPULAR_MOVIES);
    },
  });
};

/* MY PAGE ------------------------------------------------------------------ */
const goToMyPage = () => {
  window.location.href = '/mypage';
};

const setMyMovieList = (movies) => {
  $.ajax({
    type: 'GET',
    url: '/api/movielist',
    data: {},
    success: (res) => {
      console.log(res.message);
    },
  }).then((res) => {
    const mymovies = res.movielist;
    if (mymovies.length) {
      const arr = mymovies.map((item) => {
        return movies.filter((movie) => movie.id === parseInt(item.movie));
      });
      printMyMovieList(arr);
    } else {
      printEmptyMessage();
    }
  });
};

/* 좋아요 누른 영화 목록 출력 ---------------------------------------------------------- */
const printMyMovieList = (arr) => {
  $('.mymovie-list').empty();
  arr.map((item) => {
    const { id, poster_path, title, original_title } = item[0];
    const movie_html = `<li class="movie-item">
                          <img class="movie-poster" src=${getImageUrl(
                            poster_path
                          )} alt="movie poster" />
                          <div class="movie-subbox">
                            <span class="movie-title">${title}</span>
                            <span class="movie-original-title">${original_title}</span>
                            <button class="${id} mymovie-delete-btn">DELETE</button>
                          </div>
                        </li>`;
    $('.mymovie-list').append(movie_html);
  });
};

/* 좋아요 누른 영화가 없는 경우 --------------------------------------------------------- */
const printEmptyMessage = () => {
  $('.mymovie-wrapper').empty();
  const empty_html = `<div class="empty-container">
  <span class="empty-message">Your Movie List is empty.</span>
  </div>`;
  $('.mymovie-wrapper').append(empty_html);
};

$(document).on('click', '.mymovie-delete-btn', (e) => {
  const targetMovie = e.target.classList[0];
  handleDeleteLike(targetMovie);
  fetchData(POPULAR_MOVIES);
});

/* JS 연결 확인 ----------------------------------------------------------------- */
const test = () => {
  console.log('JavaScript connected!');
};

/* app.js ------------------------------------------------------------------- */
$(document).ready(() => {
  // 페이지 로딩 후 바로 들어오는 GET 함수는 이곳에서 호출
  test();
});

/* SIGN IN ------------------------------------------------------------------ */
const goToHome = () => {
  window.location.href = '/';
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
          $.cookie('mytoken', response['token'], { path: '/' });
          window.location.replace('/');
        } else {
          alert(response['msg']);
        }
      },
    });
  }
}

const goToSignIn = () => {
  window.location.href = '/signin';
};
/* SIGN UP ------------------------------------------------------------------ */
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
  let target = event.parentElement.children[0];
  if (target.type === 'password') {
    target.type = 'text';
  } else {
    target.type = 'password';
  }
}

const goToSignUp = () => {
  window.location.href = '/signup';
};

/* SING OUT ------------------------------------------------------------------ */
var deleteCookie = function (name) {
  document.cookie = name + '=; expires=Thu, 01 Jan 1999 00:00:10 GMT;';
};

function signOut() {
  deleteCookie('mytoken');
}
/* WELCOME ------------------------------------------------------------------ */

/* MAIN PAGE ---------------------------------------------------------------- */

/* MY PAGE ------------------------------------------------------------------ */

/* DB TEST ------------------------------------------------------------------ */
const dbTestPost = () => {
  // input 입력 내용
  let text = $('.dbtest-input').val();
  console.log(text);
  $.ajax({
    type: 'POST',
    url: '/dbtest',
    data: { text_give: text },
    success: (res) => {
      alert(res['msg']);
    },
  });
};

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

/* SIGN UP ------------------------------------------------------------------ */
let useremail = document.querySelector('#input-useremail')
let username = document.querySelector('#input-username')
let password = document.querySelector('#input-password')
let password2 = document.querySelector('#input-password2')

let emailmsg = document.querySelector('#emailmsg')
let namemsg = document.querySelector('#namemsg')
let pwmsg1 = document.querySelector('#pwmsg1')
let pwmsg2 = document.querySelector('#pwmsg2')

let emailcheck = false
let pwcheck = false
let namecheck = false

function sign_up() {

  if (useremail.value == "") {
    emailmsg.innerText = "이메일을 입력해주세요"

  } else if (!((useremail.value).includes('@') && (useremail.value).includes('.'))) {
    emailmsg.innerText = "이메일 형식을 확인해주세요"

  } else {
    emailmsg.innerText = "사용가능한 이메일 입니다"
    emailcheck = true
  }

  if (username.value == "") {
    namemsg.innerText = "닉네임을 입력해주세요"

  } else {
    namemsg.innerText = "사용가능한 닉네임 입니다"
    namecheck = true
  }

  if (password.value == "") {
    pwmsg1.innerText = "비밀번호를 입력해주세요"

  } else if (!is_password(password.value)) {
    pwmsg1.innerText = "비밀번호의 형식을 확인해주세요. 영문과 숫자 필수 포함, 특수문자(!@#$%^&*) 사용가능 8-20자"

  } else {
    pwmsg1.innerText = "사용가능한 비밀번호 입니다."

  }
  if (password2.value == "") {
    pwmsg2.innerText = "확인용 비밀번호를 입력해주세요"

  } else if (password2.value != password.value) {
    pwmsg2.innerText = "비밀번호가 일치하지 않습니다."

  } else {
    pwmsg2.innerText = "비밀번호가 일치합니다."
    pwcheck = true
  }

  if (emailcheck === true && pwcheck === true && namecheck === true) {
    $.ajax({
      type: "POST",
      url: "/signup/save",
      data: {
        useremail_give: useremail.value,
        username_give: username.value,
        password_give: password.value
      },
      success: function (response) {
        alert(response['msg'])
        window.location.replace("/")
      }
    });
  }
}

function is_password(asValue) {
  var regExp = /^(?=.*\d)(?=.*[a-zA-Z])[0-9a-zA-Z!@#$%^&*]{8,20}$/;
  return regExp.test(asValue);
}

const goToSignUp = () => {
  window.location.href = '/signup';
};
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

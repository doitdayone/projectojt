// Đăng nhập
function _accountLogin() {
  var $note = "#js-popup-login-note";
  var $email = "#js-login-email";
  var $password = "#js-login-password";
  var email = $("#js-login-email").val();
  var password = $("#js-login-password").val();

  if (validateEmail(email) == false) {
    $($email).parents(".form-input").addClass("error");
    $($email)
      .parents(".form-input")
      .find($(".note-error"))
      .html("Email đăng nhập không đúng");
  } else if (password == "") {
    $($password).parents(".form-input").addClass("error");
    $($password)
      .parents(".form-input")
      .find($(".note-error"))
      .html("Mật khẩu không đúng");
  } else {
    Hura.User.login(email, password).then(function (data) {
      //console.log(data);
      if (data.status == "error") {
        $($note).html(
          "Tài khoản hoặc Mật khẩu của bạn không đúng, vui lòng kiểm tra lại lại"
        );
      } else {
        location.href = "/taikhoan";
      }
    });
  }
}

// Đăng ký
function _accountRegister() {
  var error = "";
  var $note = "#js-popup-register-note";
  var name = $("#js-popup-register-name").val();
  var $name = "#js-popup-register-name";
  var email = $("#js-popup-register-email").val();
  var $email = "#js-popup-register-email";
  var password = $("#js-popup-register-password").val();
  var $password = "#js-popup-register-password";

  if (name.length < 4) {
    $($name).parents(".form-input").addClass("error");
    $($name).parents(".form-input").find($(".note-error")).html("Tên quá ngắn");
  } else if (name.indexOf("<script") > -1) {
    $($name).parents(".form-input").addClass("error");
    $($name)
      .parents(".form-input")
      .find($(".note-error"))
      .html("Họ tên chứa các ký tự không hợp lệ, bạn vui lòng kiểm tra lại");
  }

  if (validateEmail(email) == false) {
    $($email).parents(".form-input").addClass("error");
    $($email)
      .parents(".form-input")
      .find($(".note-error"))
      .html("Email không hợp lệ");
  }

  if (password == "") {
    $($password).parents(".form-input").addClass("error");
    $($password)
      .parents(".form-input")
      .find($(".note-error"))
      .html("Mật khẩu không hợp lệ");
  } else if (password.length < 6) {
    $($password).parents(".form-input").addClass("error");
    $($password)
      .parents(".form-input")
      .find($(".note-error"))
      .html("Mật khẩu có tối thiểu 6 ký tự");
  } else if (password.indexOf("<script") > -1) {
    $($password).parents(".form-input").addClass("error");
    $($password)
      .parents(".form-input")
      .find($(".note-error"))
      .html("Mật khẩu chứa các ký tự không hợp lệ, bạn vui lòng kiểm tra lại");
  }

  if (name == "" && email == "" && password == "") {
    return false;
  } else {
    var registerParams = {
      action_type: "register",
      info: {
        email: email,
        name: name,
        tel: "",
        mobile: "",
        sex: "",
        birthday: "",
        birthmonth: "",
        birthyear: "",
        password: password,
        address: "",
        province: "",
        district: "",
      },
    };

    Hura.Ajax.post("customer", registerParams).then(function (data) {
      console.log(data);
      if (data.status == "error" && data.message == "Email exist") {
        $($note).html("Email đã được sử dụng Vui lòng đăng ký lại !");
      } else {
        setTimeout(function () {
          _showCustomerForm("login");
        }, 2000);
      }
    });
  }
}

function _accountRecoverPassword() {
  var $email = "#js-forgotpass-email";
  var email = $("#js-forgotpass-email").val();
  if (email == "") {
    $($email).parents(".form-input").addClass("error");
    $($email)
      .parents(".form-input")
      .find($(".note-error"))
      .html("Email không hợp lệ");
    return false;
  } else {
    Hura.Ajax.customPost("/ajax/reset_password_request.php", {
      email: email,
    }).then(function (data) {
      alert(data.message);
    });
  }
}

function subscribe_newsletter(a) {
  var email = $(a).val();

  if (email.length > 3 && validateEmail(email) != false) {
    var params = {
      action: "customer",
      action_type: "register-newsletter",
      info: {
        name: "Khác hàng nhận bản tin",
        email: email,
      },
    };
    Hura.Ajax.post("customer", params).then(function (data) {
      console.log(data);
      if (data.status == "success") {
        alert("Quý khách đăng ký nhận bản tin thành công!");
        $(a).val("");
      } else if (data.message == "Email exist") {
        alert("Email này đã tồn tại");
      } else {
        alert("Lỗi sảy ra, vui lòng thao tác lại");
      }
    });
  } else {
    $(a).addClass("error");
    $(".form-sale")
      .find($(".note-error"))
      .html("Vui lòng nhập đúng địa chỉ Email !");
  }
}

function showCartSummary(display_node) {
  var $status_container = $(display_node);
  $status_container.html("...");
  Hura.Cart.getSummary().then((summary) => {
    $status_container.html(summary.total_item);
  });
}
function formatCurrency(a) {
  var b = parseFloat(a)
    .toFixed(2)
    .replace(/(\d)(?=(\d{3})+\.)/g, "$1.")
    .toString();
  var len = b.length;
  b = b.substring(0, len - 3);
  return b;
}

function validateEmail(sEmail) {
  var filter =
    /^([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
  if (filter.test(sEmail)) {
    return true;
  } else {
    return false;
  }
}

function validatePhoneNumber(a) {
  var number_regex1 = /^[0]\d{9}$/i;
  var number_regex2 = /^[0]\d{10}$/i;

  if (number_regex1.test(a) == false && number_regex2.test(a) == false)
    return false;
  return true;
}

// show content
function collapse_content(item, contentHeight) {
  if ($(item).height() >= contentHeight) {
    $(".more-all").css("display", "flex");
    $(item).css("height", contentHeight);
  } else {
    $(".more-all").remove();
    $(item).addClass("active");
  }
  console.log($(item).height());
}
$(".js-viewmore-content").click(function () {
  var content = $(this).attr("data-content");
  $(this).toggleClass("active");
  $(content).toggleClass("active");

  if ($(this).hasClass("active")) {
    $(this).html('Thu gọn  <i class="fa fa-angle-up"></i>');
  } else {
    $(this).html('Xem thêm  <i class="fa fa-angle-down"></i>');
    $("html,body").animate({ scrollTop: $(content).offset().top }, 500);
  }
});

function formatDate(a) {
  var a = new Date(parseInt(a) * 1000);

  var year = a.getFullYear();
  var month = a.getMonth() + 1;
  var date = a.getDate();
  var hour = a.getHours();
  var min = a.getMinutes();
  var sec = a.getSeconds();
  var time = date + "/" + month + "/" + year;
  return time;
}

function getProvince(province_id) {
  var params = {
    action_type: "district-list",
    province: province_id,
  };
  var target = "#js-district-holder";

  Hura.Ajax.get("province", params).then(function (data) {
    //console.log(data);
    // productTpl is in template: javascript/tpl
    var html = Hura.Template.parse(provinceTpl, data);
    Hura.Template.render(
      target,
      '<option value="0">Chọn quận/Huyện</option>' + html
    );
  });
}

function getWardList(district_id, target) {
  var params = {
    action_type: "ward-list",
    district: district_id,
  };

  Hura.Ajax.get("province", params).then(function (data) {
    //console.log(data);
    var html = Hura.Template.parse(provinceTpl, data);
    Hura.Template.render(
      target,
      '<option value="0">Chọn Phường/Xã</option>' + html
    );
  });
}

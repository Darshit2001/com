"use strict";

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}



var globalJson;
var preference;
var coupon_applied = true;
var steps = 0;
var preference_questions_arr = [];
var iti1 = "";
var iti2 = "";
var headerContent = document.querySelector(".header--content");
var aboutUsContent = document.querySelector(".aboutUs");
var preference_questions = "";

var preferenceFormObj = _defineProperty({
  preferenceDefault: "",
  defaultQuestionsArr: [],
  userDetails: "",
  isLoginUserIdTicket: sessionStorage.loginTicket,
  isPreferenceForm: true
}, "userDetails", sessionStorage.userdetails); // var isLoginUserIdTicket = sessionStorage.loginTicket;
// Stripe Integration


function guid1() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
  }

  return s4() + s4() + s4() + s4() + s4() + s4() + s4() + s4();
}

var ticket_id = guid1().toUpperCase();
var stripe = Stripe(global_parameters.stripe_key); // Create an instance of Elements.

var elements = stripe.elements(); // Custom styling can be passed to options when creating an Element.
// (Note that this demo uses a wider set of styles than the guide below.)

var style = {
  base: {
    color: '#32325d',
    fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
    fontSmoothing: 'antialiased',
    fontSize: '16px',
    '::placeholder': {
      color: '#aab7c4'
    }
  },
  invalid: {
    color: '#fa755a',
    iconColor: '#fa755a'
  }
}; // Create an instance of the card Element.

var cardElement = elements.create('card', {
  style: style
}); // Add an instance of the card Element into the `card-element` <div>.
// cardElement.mount('#card-element');
// Stripe Integration

window.onerror = function (msg, url, line) {
  var logingErrorObj = {message:msg,url:url,line:line}
  postErrorPyament(logingErrorObj);
};

$(window).scroll(function () {
  var mq = window.matchMedia("(max-width: 500px)");

  if (!mq.matches) {
    if ($(window).scrollTop() == 0) {
      $(".navbar--header").removeClass("navbar--header--scroll");
      $(".navbar--header__logo").removeClass("nav--header__logo-scoll");
      $(".nav-element .register").addClass('button-color-white');
      $(".navbar--header__logo img").attr("src", globalJson.appLogo);
      $(".supportHeader").show();
    } else if ($(window).scrollTop() >= 54) {
      $(".navbar--header").addClass("navbar--header--scroll");
      $(".navbar--header__logo").addClass("nav--header__logo-scoll");
      $(".nav-element .register").removeClass('button-color-white');
      $(".navbar--header__logo img").attr("src", globalJson.appLogo);
      $(".supportHeader").hide();
    }
  } else {
    $(".navbar--header")[0].style.cssText = "position:absolute;";
  }
});
$(document).on("click", ".navBarResponsiveClick", function () {
  $(".navigation__button").click();
  var linkElement = this.getAttribute("data-link");

  if (linkElement == "abouUs") {
    aboutus();
  } else if (linkElement == "registerNow" || linkElement == "summary") {
    register_content();
  } else if (linkElement == "alreadyRegistered") {
    $(".register-now").click();
  }
});
$(document).ready(function () {
  try {
    $.ajax({
      url: "https://s3.amazonaws.com/webmobi/nativeapps/".concat(appName, "/appData.json"),
      cache: false,
      type: 'GET',
      dataType: "json",
      success: function success(data) {
        console.log(data);
        globalJson = data;
        aboutus();
        var logoRedirectUrl = "";
        $(".showAfterLogin").hide();

        if (appName == "webmobicmo2020") {
          logoRedirectUrl = "/";
        } else {
          logoRedirectUrl = "/?appName=" + appName;
        }

        if (appName == "ceipal2020") {
          $("#user_type").parent().parent().hide();
          $("#company").parent().find("label,input").hide();
          $("#aboutUs").hide();
          var appendStyleCss = "#user_type-summary{\n                display: none;\n            }\n            #company-summary\n            {\n                display: none;\n            }\n            #aboutUs\n            {\n              display:none !important;\n            }\n            input\n            {\n              border: 2px solid #".concat(globalJson.theme_color, " !important;\n            }\n            ");
          appendStyle(appendStyleCss);
        }
        $(".navbar--header").append("<div class=\"navbar--header__logo\"><div>\n             <a href=\"".concat(logoRedirectUrl, "\"><img src=\"").concat(globalJson.appLogo, "\" alt=\"logo image\"></a>\n             <span class=\"nav-element\">\n <span id=\"summary\" class=\"nav-element--els\"><span>Summary</span></span> <span id=\"aboutUs\" class=\"nav-element--els show\">\n                                 </span>\n  </span>\n</div></div>"));
        document.querySelector('head').innerHTML += "<link rel=\"icon\" href=\"".concat(globalJson.appLogo, "\">");
        $(".navigation__background")[0].style.cssText = "background:#" + globalJson.theme_border + ";";
        $(".applogo").append("<img src=\"".concat(globalJson.appLogo, "\" alt=\"logo image\">"));
        $(".supportHeader").css("background-color","#"+globalJson.theme_color);
        $(".header").css('background-image', 'url("' + globalJson.appLoadingImage + '")');
        $("button.btn,.modal-content--header,.button-edit").css('background', "#".concat(globalJson.theme_color));
        $(".registration-header h1").css('color', "#".concat(globalJson.theme_color));
        if (globalJson.appDescription != "") {
          $(".registration-para").text(globalJson.appDescription);
        } else {
          $(".registration-para").hide();
        }

        $(".footer-element").css("background", "#" + globalJson.theme_color);
        $("label").css("color", "#" + globalJson.theme_color);
        $(".registration-preference,.registration-primary").css("color", "#" + globalJson.theme_color);
        sessionStorage.clear();
        var ticketsJson = checkPaymentCondition();
        $.get(global_parameters.url + "api/event/registration_questions?appid=" + globalJson.appId, function (data) {
          if (data.response == true) {
            console.log("preference form", data);
            var prefQuests = [];
            var preference_form_question_arr = [];
            var defaultIndex = "";
            data.responseString.map(function (obj, index) {
              obj.items[0].questions.map(function (obj1) {
                preference_form_question_arr.push(obj1);
              });

              if (obj.heading != "Default") {
                prefQuests.push(obj);
              } else {
                defaultIndex = index;
                preferenceFormObj.preferenceDefault = obj;
              }
            });
            data.responseString.splice(defaultIndex, 1);
            preference_questions = data;
            changeInput();
            preferenceForm(prefQuests[0]);
            updateDefaultPreferenceForm();
            sessionStorage.setItem("questions_arr", JSON.stringify(preference_form_question_arr));
            preference_questions_arr = prefQuests;
          } else {
            preference_questions = '';
          }

          if (appName == "webmobicmo") {
            if (ticketId == 1) {
              $("#user_type").val('Visitor');
            } else if (ticketId == 2) {
              $("#user_type").val('Exhibitor');
            }

            changeInput();
            $("#user_type").attr('disabled', 'true');
          }

          if (ticketsJson && (preference_questions_arr.length == 1 || preference_questions.responseString && preference_questions.responseString.length == 1 || preference_questions)) {
            $(".nextstepButton .btn").hide();
            appendPayment();
            $(".btn-payment").show();
          }

          var isLoginUserIdTicket = preferenceFormObj.isLoginUserIdTicket;
          var userDetails2 = preferenceFormObj.userDetails;
          var loginTicketArr = isLoginUserIdTicket ? JSON.parse(isLoginUserIdTicket) : "";

          if (loginTicketArr) {
            if (loginTicketArr.userId) {
              getProfileData(loginTicketArr.userId).then(function (userDetails) {
                preferenceFormObj.userDetails = userDetails;
                sessionStorage.email = preferenceFormObj.userDetails.Profile[0].email;
                sessionStorage.setItem("userdetails", userDetails2);
                loginSummary(loginTicketArr.userId);
              });
            }
          }

          setInterval(function () {
            $("#loader-page").hide();
          }, 1000);
        });
      },
      error: function error() {
        document.querySelector("body").innerHTML = "<div class=\"error_page text-center\" style=\"margin-top:5%\"><h1>404</h1><h3>Page Not Found.</h3><h4>Contact:support@webmobi.com</h4></div>";
      }
    });
  } catch (err) {
    document.getElementById("body").innerHTML = err.message;
  }
});

function updateDefaultPreferenceForm() {
  if (!preferenceFormObj.preferenceDefault.items) {
    return;
  }

  var defaultForm = preferenceFormObj.preferenceDefault.items[0].questions;

  for (var k = 0; k < defaultForm.length; k++) {
    var inputs = defaultForm[k];
    var name = inputs.name,
        question = inputs.question,
        user_type = inputs.user_type,
        answer = inputs.answer;
    preferenceFormObj.defaultQuestionsArr[name] = question;

    if (!name) {
      return;
    }

    var label = document.getElementById(name).parentElement.querySelector(".labelName");
    var input = document.getElementById(name).parentElement.querySelector("select");
    label.innerText = question;

    if (name == "user_type") {
      input.innerHTML = "<option class=\"dropdown\" value=\"\">--Choose User Type--</option>";

      for (var h = 0; h < answer.length; h++) {
        var ans = answer[h];
        input.innerHTML += "\n                    <option class=\"dropdown\" value=\"Visitor\">".concat(ans, "</option>\n                ");
      }
    }
  }
}

function updateUserTypeDropDown(value) {
  if($("#user_type")[0])
  {
    $("#user_type")[0].innerHTML = "<option class=\"dropdown\" value=\"".concat(value, "\">").concat(value, "</option>");
    $("#user_type").val(value);
  }
}

$(".btn-backLogin").on("click", function () {
  $("#username").attr("disabled", false);
  $(".modal-input--container-password").hide();
  $(".btn-backLogin").hide();
  $(".btn-nextLogin").show();
  $(".btn-login").hide();
});
$(".btn-sendPassword").on("click", function (event) {
  $(this).attr("disabled", "true");
  var forgotPassword = {};
  forgotPassword.email = $("#email-send").val();
  forgotPassword.appid = globalJson.appId;
  $.ajax({
    // url: globalURL+'/api/user/single_event_login',//Login
    url: global_parameters.url + 'api/user/app_forgot_password',
    //Login
    type: 'POST',
    data: forgotPassword,
    success: function success(resultslog) {
      console.log("log result", resultslog);
      sessionStorage.setItem("userdetails", JSON.stringify(resultslog));

      if (resultslog.response == true) {
        swal('Your password has been reset and the new password has been sent to your Email Id');
        $(".btn-sendPassword").removeAttr("disabled");
      } else {
        swal(resultslog.responseString);
        $(".btn-sendPassword").removeAttr("disabled");
      }
    },
    error: function error(_error) {
      swal("Something Went Wrong. Please try Again and contact customer support at fvpsa_communications@f2solutions.com");
      $(".btn-sendPassword").removeAttr("disabled");
    }
  });
});

function checkanswreg(question_id, type, detail) {
  if (registration_model) {
    var answerobj = JSON.parse(registration_model.responseString[0].answer).filter(function (obj) {
      if (obj.reg_id == question_id) {
        return obj;
      }
    });

    if (steps == 0) {
      var userdata = JSON.parse(sessionStorage.userdetails);
      var _preferenceFormObj$us = preferenceFormObj.userDetails.Profile[0],
          first_name = _preferenceFormObj$us.first_name,
          last_name = _preferenceFormObj$us.last_name,
          email = _preferenceFormObj$us.email,
          company = _preferenceFormObj$us.company,
          designation = _preferenceFormObj$us.designation,
          mobile = _preferenceFormObj$us.mobile,
          user_category = _preferenceFormObj$us.user_category;
      $("#first_name").val(first_name);
      $("#last_name").val(last_name);
      $("#email").val(email);
      $("#company").val(company);
      $("#phone").val(mobile);
      $("#designation").val(designation);
      updateUserTypeDropDown(user_category);
      $("#first_name").attr("disabled", true);
      $("#last_name").attr("disabled", true);
      $("#email").attr("disabled", true);
      $("#company").attr("disabled", true);
      $("#phone").attr("disabled", true);
      $("#designation").attr("disabled", true);
      $("#user_type").attr("disabled", true);
    }

    if (type == "messagebox") {
      $("#question_" + question_id).val(answerobj[0].answertext);
    }
    else if(type == "multiple")
    {
      $("input[name='question_"+question_id+"']").each(function(){
        var value = $(this).val();
        if(answerobj[0].answer.indexOf(value) > -1)
        {
          $(this).attr("checked",true);
        }
      })
    }
    else {
      if (detail == "yes") {
        $("input[name=question_" + question_id + "][value='" + answerobj[0].answer[0] + "']").prop('checked', true);
        $("#question_" + question_id + "_feedback").val(answerobj[0].answertext);
      } else if (question_id != 1) {
        $("input[name=question_" + question_id + "][value='" + answerobj[0].answer[0] + "']").prop('checked', true);
      } else if (question_id == 6) {
        iti1.setNumber(answerobj[0].answer[0]);
      } else if (question_id == 19) {
        iti2.setNumber(answerobj[0].answer[0]);
      } else if (detail == "yes") {
        $(".registration-primary__forms-input select").val(answerobj[0].answer[0]);
        $("#question_" + question_id + "_feedback").val(answerobj[0].answertext);
      } else {
        $(".registration-primary__forms-input select").val(answerobj[0].answer[0]);
      }
    }
  }
}

function preferenceForm(preference_arr) {
  if (preference_arr == undefined) {
    return;
  }

  $(".registration-preference").append("<div class='preference" + steps + "'>");
  $('.preference' + steps).append('<h2 class="header-preference">' + preference_arr.heading + '</h2>');
  var questions_arr = preference_arr.items[0].questions;

  for (var i = 0; i < questions_arr.length; i++) {
    var option = '';
    var reg_question = '';
    var required_arr = "";
    var idEl;
    var label = questions_arr[i].question;
    var isRequied = questions_arr[i].required;
    if(checkLabelElement(label) && questions_arr[i].type == "messagebox")
    {
      idEl= getInputId(label);
      isRequied = 1;
    }
    else
    {
      idEl='question_' + questions_arr[i].id;
    }
    switch (questions_arr[i].type) {
      case "messagebox":
        console.log("messagebox");
        required_arr = isRequied == 1 ? ['<span class="astrics">*</span></label>', 'required'] : ['', 'not-required'];
        $('.preference' + steps).append('<div class="registration-preference--text">' + '<label for="' + idEl + '">' + questions_arr[i].question + required_arr[0] + '</label>' + '<input type="text" class=' + required_arr[1] + ' id="'+idEl+'" name="' + idEl + '">' + '<div class="error-message-input">This field is required</div>' + '</div>');
        checkanswreg(questions_arr[i].id, "messagebox");
        break;

      case "single":
        console.log("single");
        required_arr = isRequied == 1 ? ['<span class="astrics">*</span></label>', 'required'] : ['', ''];
        reg_question = '<div class="registration-preference--radioButton">' + '<label>' + questions_arr[i].question + required_arr[0] + '</label>';

        for (var j = 0; j < questions_arr[i].answer.length; j++) {
          option += '<p class="option_margin">' + '<input type="radio" class="radio' + required_arr[1] + '" name="question_' + questions_arr[i].id + '" value="' + questions_arr[i].answer[j] + '" id="question_' + questions_arr[i].id + '_' + j + '" />' + '<label for="question_' + questions_arr[i].id + '_' + j + '">' + questions_arr[i].answer[j] + '</label>' + '</p>';
        }
        if(questions_arr[i].detail == "yes")
        {
          option += "<div><input id='question_" + questions_arr[i].id + "_feedback' type='text' /></div>";
        }
        reg_question = reg_question + option;
        $('.preference' + steps).append(reg_question);
        checkanswreg(questions_arr[i].id, "single");
        break;

      case "multiple":
        console.log("multiple");
        required_arr = questions_arr[i].required == 1 ? ['<span class="astrics">*</span></label>', 'required'] : ['', ''];
        reg_question = '<div class="registration-preference--checkbox">' + '<label>' + questions_arr[i].question + required_arr[0] + '</label>';

        for (var j = 0; j < questions_arr[i].answer.length; j++) {
          option += '<p>' + '<input type="checkbox" class="checkbox" name="question_' + questions_arr[i].id + '" value="' + questions_arr[i].answer[j] + '" id="question_' + questions_arr[i].id + '_' + j + '" />' + '<label for="question_' + questions_arr[i].id + '_' + j + '">' + questions_arr[i].answer[j] + '</label>' + '</p>';
        }

        reg_question = reg_question + option;
        $('.preference' + steps).append(reg_question);
        checkanswreg(questions_arr[i].id, "multiple");
        break;
    }
  }

  $("label,input,select,.header-preference").css("color", "#" + globalJson.theme_color);
}

function convertLabelMin(label)
{
  var labelReturn = label.trim().replace(" ","_").toLowerCase();
  return labelReturn;
}

function checkLabelElement(label)
{
 var name = convertLabelMin(label),
 checkArr = ['first_name','last_name','email'],
 checkReturn = (checkArr.indexOf(name)>-1)?true:false;
 return checkReturn;
}

function getInputId(inputValue)
{
 var checkArr = ['first_name','last_name','email'],
 indexIndex = checkArr.indexOf(convertLabelMin(inputValue));
 return checkArr[indexIndex];
}

function changeInput() {
  preference_questions_arr = [];

  if (!$("#user_type").val()) {
    return;
  }

  if (!preference_questions) {
    return;
  }

  $(".registration-preference").empty();

  if ($("#user_type").val() == "Visitor") {
    for (var i = 0; i < preference_questions.responseString.length; i++) {
      if (preference_questions.responseString[i].user_type == "attendee" || preference_questions.responseString[i].user_type == "default") {
        preference_questions_arr.push(preference_questions.responseString[i]);
      }
    }

    preferenceForm(preference_questions_arr[0]);
  } else if ($("#user_type").val() == "Exhibitor") {
    for (var _i = 0; _i < preference_questions.responseString.length; _i++) {
      if (preference_questions.responseString[_i].user_type == "exhibitor" || preference_questions.responseString[_i].user_type == "default") {
        preference_questions_arr.push(preference_questions.responseString[_i]);
      }
    }

    preferenceForm(preference_questions_arr[0]);
  } else if ($("#user_type").val() == "Media") {
    for (var _i2 = 0; _i2 < preference_questions.responseString.length; _i2++) {
      if (preference_questions.responseString[_i2].user_type == "media" || preference_questions.responseString[_i2].user_type == "default") {
        preference_questions_arr.push(preference_questions.responseString[_i2]);
      }
    }

    preferenceForm(preference_questions_arr[0]);
  } else if ($("#user_type").val() == "Other") {
    for (var _i3 = 0; _i3 < preference_questions.responseString.length; _i3++) {
      if (preference_questions.responseString[_i3].user_type == "default" || preference_questions.responseString[_i3].user_type == "default") {
        preference_questions_arr.push(preference_questions.responseString[_i3]);
      }
    }

    preferenceForm(preference_questions_arr[0]);
  }

  var ticketsJson = checkPaymentCondition();

  if (ticketsJson && preference_questions_arr.length == 1) {
    $(".nextstepButton .btn").hide();
    appendPayment();
    $(".btn-payment").show();
  }
}

$(".btn-next").on("click", function (event) {
  $(".registration-primary__forms-input,.registration-preference--text").removeClass("invalid");
  $(".error-message").empty();
  $(".btn-back").css("visibility", "visible");
  event.preventDefault();
  var errors = validateForm();

  if (errors.length != 0) {
    for (var i = 0; i < errors.length; i++) {
      $(".error-message").append('<div class="alert alert-danger" role="alert">' + errors[i] + '</div>');
      window.scrollTo(0, 500);
    }

    $(".btn-submit").removeAttr("disabled");
    $("#loader img").remove();
    $(".btn-submit").removeClass("btn-active--submit");

    if (steps == 0) {
      $(".btn-back").css("visibility", "hidden");
    }
  } else {
    if (!preference_questions_arr.length) {
      $(".btn-submit").show();
      $(".btn-next").hide();
      preferenceFormObj.isPreferenceForm = false;
    }

    if (preference_questions) {
      var ticketsJson = checkPaymentCondition();

      if (steps < preference_questions_arr.length - 1) {
        $(".preference" + steps).hide();
        steps++;
        $(".registration-primary").hide();

        if ($(".registration-preference").find(".preference" + steps).length > 0) {
          $(".preference" + steps).show();
        } else {
          preferenceForm(preference_questions_arr[steps]);
        }
      } else if (steps == preference_questions_arr.length - 2 && preference_questions.responseString.length > 1 && ticketsJson) {
        $(".preference" + steps).hide();
        steps++;
        $(".registration-primary").hide();

        if ($(".registration-preference").find(".preference" + steps).length > 0) {
          $(".preference" + steps).show();
        } else {
          preferenceForm(preference_questions_arr[steps]);
        }

        appendPayment();
      } else {
        showSummary();
      }
    } else {
      showSummary();
    }

    var prefenrenceFormlength = preference_questions != '' ? preference_questions_arr.length : 1;

    if (steps == prefenrenceFormlength) {
      $(".btn-next").hide();

      if (sessionStorage.email) {
        $(".btn-submit").hide();
        $(".btn-submit-edit").show();
      } else {
        $(".btn-submit").show();
        $(".btn-submit-edit").hide();
      }
    }
  }
});

function showSummary() {
  $(".preference" + steps).hide();
  $(".registration-primary").hide();
  steps++;
  appendSummary();
}

function appendPayment() {
  if ($("#paymentPage").length > 0) {
    return;
  }

  var price = getFirstPayement().price;
  var paymenthtml = "<div id=\"paymentPage\">\n                <h1 class='text-center'>Payment</h1>\n                <div class=\"registration-preference--text margin-top-large\">\n                    <span class='priceText'>Ticket Amount: $<span id='ticketPrice'>".concat(price, "<span></span>\n                 </div>\n                <div class=\"registration-preference--text\">\n                    <label for=\"cardname\">Coupon Code\n                    </label>\n                    <div class='couponCodeContainer'>\n                        <input type=\"text\" id=\"clientCode\" name=\"clientCode\">\n                        <button id='couponCodeButton' onclick='applyCoupon()'>\n                        Apply\n                        </button>\n                    </div>\n                 </div>\n                </div>\n                <div class=\"registration-preference--text\"  id='cardholderdetail'>\n                    <label for=\"cardname\">Card Holder Name<span class=\"astrics\">*</span>\n                    </label>\n                    <input type=\"text\" class=\"required\" id=\"cardname\" name=\"cardname\"><div class=\"error-message-input\">\n                     </div>\n                </div>\n                <div class=\"registration-preference--text\" id='creditdebitcarddetail'>\n                    <label for=\"cardname\">Credit or Debit Card<span class=\"astrics\">*</span>\n                    </label>\n                    <div class=\"payment-icons\">\n                        <div class=\"payment-icon amex\"></div>\n                        <div class=\"payment-icon discover\"></div>\n                        <div class=\"payment-icon master\"></div>\n                        <div class=\"payment-icon visa\"></div>\n                    </div>\n                <div id=\"card-element\">\n                <!-- A Stripe Element will be inserted here. -->\n                </div>\n            </div>  ");
  $('.preference' + steps).append(paymenthtml);
  $("#couponCodeButton").css("background", "#".concat(globalJson.theme_border));
  $('.btn-payment').show();
  $('.btn-next,.btn-submit').hide();
  cardElement.mount('#card-element');
  $("label").css("color", "#" + globalJson.theme_color);
}

function appendSummary() {
  var defaultArrquestArr = preferenceFormObj.defaultQuestionsArr;
  $(".preference" + steps).remove();
  $(".registration-preference").append('<div class="preference'+steps+'"></div>');

  if (preference_questions_arr.length > 0) {
    for (var i = 0; i < preference_questions_arr.length; i++) {
      var html = "<div id='preference_questions-summary_" + i + "' class='container'></div>";
      $(".preference" + steps).append(html);
      $("<h2 class='text-center summary--header'>"+preference_questions_arr[i].heading+"</h2>").insertBefore($(".preference"+i));
      var prefer = preference_questions_arr[i].items[0].questions;
      var html2 = "";

      for (var j = 0; j < prefer.length; j++) {
        var value="";
        if (prefer[j].type == "messagebox") {
          value = $("#question_" + prefer[j].id).val()||"";
          if(checkLabelElement(prefer[j].question))
          {
            value = $("#"+getInputId(prefer[j].question)).val();
          }
          html2 += '<div id="summary_questions_' + prefer[j].id + '" class="summary"><div class="label-content">' + prefer[j].question + ' </div><div class="input-content">' + value + '</div></div>';
        } else if (prefer[j].type == "single" && prefer[j].detail == "yes") {
          value = $("[name='question_" + prefer[j].id + "']:checked").val()||"";
          html2 += '<div id="summary_questions_' + prefer[j].id + '" class="summary"><div class="label-content">' + prefer[j].question + ' :</div><div class="input-content">' + value + '</div><p>' + $("#question_" + prefer[j].id + "_feedback").val() + '</p></div>';
        } else if (prefer[j].type == "single") {
          value = $("[name='question_" + prefer[j].id + "']:checked").val()||"";
          html2 += '<div id="summary_questions_' + prefer[j].id + '" class="summary"><div class="label-content">' + prefer[j].question + ' :</div><div class="input-content">' + value + '</div></div>';
        } else if (prefer[j].type == "multiple") {
          value = "";
          for (var k = 0; k < prefer[j].answer.length; k++) {
            if ($("input[id='question_" + prefer[j].id + "_" + k + "']:checked").val()) {
              value += $("input[id='question_" + prefer[j].id + "_" + k + "']:checked").val()+"<br>"||"";
            }
          }
          html2 += '<div id="summary_questions_' + prefer[j].id + '" class="summary"><div class="label-content">' + prefer[j].question + ' :</div><div class="input-content">' + value + '</div></div>';
        }
      }

      $("#preference_questions-summary_" + i).append(html2);
    }
  }
}

$(".btn-back").on("click", function () {
  steps--;
  $(".summary--header").remove();
  var steps_previous = steps + 1;
  $("#paymentPage").remove();
  $(".btn-payment").hide();

  if (steps == 0) {
    $(".preference" + steps_previous).hide();
    $(".preference" + steps).show();
    $(".registration-primary").show();
    $(".btn-back").css("visibility", "hidden");
    $(".btn-next").show();
    $(".btn-submit-edit").hide();
    $(".btn-submit").hide();
  } else {
    $(".preference" + steps).show();
    $(".preference" + steps_previous).hide();
  }

  var prefenrenceFormlength = preference_questions != '' ? preference_questions_arr.length - 1 : 0;

  if (steps == prefenrenceFormlength) {
    $(".btn-next").show();
    $(".btn-submit").hide();
    $(".btn-submit-edit").hide();
  }
});

function validateForm() {
  var valid = true;
  var errors = [];
  $.each($(".registration-primary .required,.preference" + steps + " .required"), function (index, value) {
    if (!$(value).val()) {
      $(this).parent().addClass("invalid");
      valid = false;
    }
  });
  $.each($('.preference' + steps + ' .radiorequired'), function (index, value) {
    if (!$('.preference' + steps + ' .radiorequired').is(":checked")) {
      $(this).parent().addClass("invalid");
      valid = false;
    }
  });

  if (!valid) {
    errors.push("Please fill all the * inputs");
  }

  if (!validate($("#email").val())) {
    errors.push("Invalid email address");
  }

  return errors;
}

function validate(email) {
  var reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;

  if (reg.test(email) == false) {
    return false;
  }

  return true;
}

$(".btn-submit").on("click", function (event) {
  $(".btn-submit").attr("disabled", "true");
  $(".btn-submit #loader").html('<img src="assets/images/spinner.png" alt="loader-image">');
  $(".btn-submit").addClass("btn-active--submit");
  $(".error-message").empty();
  event.preventDefault();
  var errors = validateForm();

  if (errors.length != 0) {
    for (var i = 0; i < errors.length; i++) {
      $(".error-message").append('<div class="alert alert-danger" role="alert">' + errors[i] + '</div>');
      window.scrollTo(0, 500);
    }

    $(".btn-submit").removeAttr("disabled");
    $("#loader img").remove();
    $(".btn-submit").removeClass("btn-active--submit");
  } else {
    var personsatt = {};
    personsatt.firstname = $("#first_name").val();
    personsatt.lastname = $("#last_name").val();
    personsatt.email = $("#email").val();
    personsatt.designation = $("#designation").val();
    personsatt.company = $("#company").val();
    personsatt.userCategory = "";
    personsatt.admin_flag = "attendee";
    personsatt.coupon_code = sessionStorage.promo_code || "";
    personsatt.phone = $("#phone").val();
    personsatt.loginType = "general";
    personsatt.userType = sessionStorage.userType == "" || sessionStorage.userType == undefined ? globalJson.info_privacy == false ? "checkedin" : "registered" : sessionStorage.userType;
    personsatt.appType = "dashboard";
    personsatt.appid = globalJson.appId;
    personsatt.info_privacy = globalJson.info_privacy;
    personsatt.deviceType = "web";
    var ticket_id = 0;

    if (getTabsArr("tickets").length) {
      ticket_id = ticketId ? ticketId : getTabsArr("tickets")[0].items[0].ticket_id;
    }

    personsatt.ticket_name = ticket_id; //? getTicketDetails(ticket_id).title : "";

    console.log("personsatt", personsatt);
    $.ajax({
      url: global_parameters.url + "api/user/single_event_register",
      cache: false,
      data: personsatt,
      type: "POST",
      success: function success(data) {
        console.log(data);

        if (data.response == true) {
          if (!preferenceFormObj.isPreferenceForm) {
            var img = globalJson.appLogo; 
            var emailIdSupport = globalJson.event_organizer_email;
            if(appName == "fvpsamidwest-south" || appName == "fvpsaeastern" || appName == "fvpsawest")
            {
              emailIdSupport = "Treceia.bazemore@f2solutions.com";
              img =  "https://webmobi.s3.amazonaws.com/nativeapps/eventdemofirst/1619624704994_FYSB_Logo.png";
            }
            var modalContent = "\n                                        <div class=\"banner-image\">\n                                            <img src=\"".concat(img, "\">\n                                        </div>\n                                        <span style=\"display: none;\" id=\"reg_Content\" class=\"textcenter\">Your registration has been successfully cancelled</span>\n                                        <div id=\"thankyou_content\">\n                                            <span class=\"textcenter\" style=\"margin-top: 28px\">Your confirmation letter has just been emailed to you. If you do not received your confirmation email, please check your spam or junk folder. If further assistance is needed, please contact ").concat(emailIdSupport,'<div class=\"redirect_button\">\n                                            <div class=\"mosaic\">\n                                                <a id=\"home_redirect\">HOME</a>\n                                            </div>\n                                        </div>\n                                        "');
            $('.thankyouContent').html(modalContent);
            $("#home_redirect").css("background", "#".concat(globalJson.theme_color));
            $("#thankyouMdoal").modal('show');
            return;
          }

          var reg_userid = data.userid;
          sessionStorage.setItem("userId", reg_userid);
          var questions_arr = JSON.parse(sessionStorage.questions_arr);
          var answer_array = [];

          for (var _i4 = 0; _i4 < questions_arr.length; _i4++) {
            var answerreg_json = {};
            var submit_ans_arr = [];
            answerreg_json.reg_id = questions_arr[_i4].id;
            answerreg_json.type = questions_arr[_i4].type;
            answerreg_json.detail = "";

            if (questions_arr[_i4].type == "single") {
              if (answerreg_json.reg_id == 1) {
                submit_ans_arr.push($("#user_type").val());
                answerreg_json.answertext = "";
                answerreg_json.answer = submit_ans_arr;
              } else if (questions_arr[_i4].detail == "yes") {
                submit_ans_arr.push($("input[name='question_" + questions_arr[_i4].id + "']:checked").val());
                answerreg_json.answertext = $("#question_" + questions_arr[_i4].id + "_feedback").val();
                answerreg_json.answer = submit_ans_arr;
              } else {
                var checkInputValueText = questions_arr[_i4].name ? document.getElementById(questions_arr[_i4].name).options[document.getElementById(questions_arr[_i4].name).selectedIndex].text : $("input[name='question_" + questions_arr[_i4].id + "']:checked").val();
                submit_ans_arr.push(checkInputValueText);
                answerreg_json.answertext = "";
                answerreg_json.answer = submit_ans_arr;
              }
            } else if (questions_arr[_i4].type == "multiple") {
              for (var j = 0; j < questions_arr[_i4].answer.length; j++) {
                if ($("input[id='question_" + questions_arr[_i4].id + "_" + j + "']:checked").val()) {
                  submit_ans_arr.push($("input[id='question_" + questions_arr[_i4].id + "_" + j + "']:checked").val());
                  answerreg_json.answertext = "";
                }
              }

              answerreg_json.answer = submit_ans_arr;
            } else if (questions_arr[_i4].type == "messagebox") {
              if (answerreg_json.reg_id == 6 && $("#summary_questions_6 .input-content")[0] != undefined) {
                answerreg_json.answertext = $("#summary_questions_6 .input-content")[0].innerHTML;
                answerreg_json.answer = [];
              } else if (answerreg_json.reg_id == 19 && $("#summary_questions_19 .input-content")[0] != undefined) {
                answerreg_json.answertext = $("#summary_questions_19 .input-content")[0].innerHTML;
                answerreg_json.answer = [];
              } else {
                var _checkInputValueText = questions_arr[_i4].name ? "#".concat(questions_arr[_i4].name) : "#question_" + questions_arr[_i4].id;

                answerreg_json.answertext = $(_checkInputValueText).val() || "";
                answerreg_json.answer = [];
              }
            }

            answer_array.push(answerreg_json);
          }

          preference = {};
          var userResponseData = [];
          preference.userResponse = answer_array;
          preference.adminsurvey_flag = 0;
          preference.appid = globalJson.appId;
          userResponseData.push({
            "email": $("#email").val(),
            "userid": "",
            "appid": globalJson.appId,
            "user_type": "attendee",
            "ans_data": JSON.stringify(answer_array)
          });
          preference.userResponse = JSON.stringify(userResponseData);
          $.post(global_parameters.url + "api/event/registration_answers", preference, function (data) {
            console.log("preference", data);
            $(".btn-submit").removeAttr("disabled");
            $("#loader img").remove();
            $(".btn-submit").removeClass("btn-active--submit");
            var img = globalJson.appLogo; 
            var emailIdSupport = globalJson.event_organizer_email;
            if(appName == "fvpsamidwest-south" || appName == "fvpsaeastern" || appName == "fvpsawest")
            {
              emailIdSupport = "Treceia.bazemore@f2solutions.com";
              img = "https://webmobi.s3.amazonaws.com/nativeapps/eventdemofirst/1619624704994_FYSB_Logo.png";
            }
            var modalContent = "\n                                        <div class=\"banner-image\">\n                                            <img src=\"".concat(img, "\">\n                                        </div>\n                                        <span style=\"display: none;\" id=\"reg_Content\" class=\"textcenter\">Your registration has been successfully cancelled</span>\n                                        <div id=\"thankyou_content\">\n                                            <span class=\"textcenter\" style=\"margin-top: 28px\">Your confirmation letter has just been emailed to you. If you do not received your confirmation email, please check your spam or junk folder. If further assistance is needed, please contact ").concat(emailIdSupport,'<div class=\"redirect_button\">\n                                            <div class=\"mosaic\">\n                                                <a id=\"home_redirect\">HOME</a>\n                                            </div>\n                                        </div>\n                                        "');
            $('.thankyouContent').html(modalContent);
            $("#home_redirect").css("background", "#".concat(globalJson.theme_color));
            $(".btn-submit").removeAttr("disabled");
            $("#thankyouMdoal").modal('show'); // $.post("https://api.webmobi.com/api/event/buy_tickets", ticket_details, function(data) {
            //     window.scrollTo(0, 500);
            //     if (data.response == true || data.response == false) {
            //         $("section.registration")[0].innerHTML = "";
            //         appname_1 = globalJson.appName;
            //         ticket_number =ticket_id;
            //         appLogo = globalJson.appLogo;
            //         location_1 = globalJson.location;
            //         var dat123 = new Date(globalJson.startdate  + 19800000);
            //         var dat1   = new Date(globalJson.enddate  + 19800000);
            //         if(globalJson.startdate  == globalJson.enddate)
            //           event_date_1 = dat123.getDate() + " " + monthFullNames[dat123.getMonth()]+ " " + dat123.getFullYear()
            //         else
            //           event_date_1 = dat123.getDate() + " " + monthFullNames[dat123.getMonth()]+ " " + dat123.getFullYear() + " - " + dat1.getDate() + " " + monthFullNames[dat1.getMonth()] + " " + dat1.getFullYear();
            //         $("section.registration")[0].innerHTML = '<div class="ticket_border" style="background-color:#ffffff;font-size: 20px;"> <div class="row row_other"> <p style="text-align:center;">'+appname_1+'</p><p style="text-align:center;">URN NUMBER: '+ticket_number+'</p></div><div class="" style="border: 1px solid black;width: 80%;margin: 0 auto; "> <div class="row attendee_all_details"> <img class="img_logo" width="200" height="200" style="margin: 3% 39%;" src="" alt="'+appLogo+'" crossorigin/> <p style="text-align:center;" class="event_date">'+event_date_1+'</p><p style="text-align:center;" class="event_location">'+location_1+'</p><p style="text-align:center;" class="event_location">'+personsatt.firstname+" "+personsatt.lastname+'</p><p style="text-align:center;" class="event_location">'+personsatt.designation+'</p><p style="text-align:center;" class="event_location">'+personsatt.company+'</p></div><div class="row"> <div class="col-sm-12"> <div id="qrcodeCanvas"></div></div></div><div class="row"> <h3 class="pdf_type_heading">ATTENDEE</h3> </div></div></div>'
            //         new QRCode(document.getElementById("qrcodeCanvas"), reg_userid);
            //         swal("Registered Sucessfully");
            //     }else{
            //       swal("error");
            //       window.location.reload();
            //     }
            // });
          });
        } else {
          swal(data.responseString);
          $(".btn-submit").removeAttr("disabled");
          $("#loader img").remove();
          $(".btn-submit").removeClass("btn-active--submit");
        }
      },
      error: function error(textStatus, errorThrown) {
        swal("Something went wrong. Please try again.");
        $(".btn-submit").removeAttr("disabled");
        $("#loader img").remove();
        $(".btn-submit").removeClass("btn-active--submit");
      }
    });
  }
});
$(document).on("click", "#home_redirect", function () {
  event.preventDefault();

  if (appName == "ceipal2020") {
    window.location.href = globalJson.organizer_website;
    return;
  }
  window.location.href = "/"+globalJson.appUrl;
});
$(document).on("click", "#aboutUs", function () {
  aboutus();
  removeTabActive();
  this.classList.add("active");
});
$(document).on("click", "#summary", function () {
  register_content();
  removeTabActive();
  this.classList.add("active");
});

function aboutus() {
  // headerContent.innerHTML = "";
  var aboutUsArr = [];

  for (var k = 0; k < globalJson.events[0].tabs.length; k++) {
    var tabs = globalJson.events[0].tabs[k];

    if (tabs.type == "aboutus" && tabs.sub_type == "intro") {
      aboutUsArr.push(tabs);
    }
  }

  if (!aboutUsArr.length) {
    $(".aboutUs").hide();
    return;
  }

  var _aboutUsArr$ = aboutUsArr[0],
      content = _aboutUsArr$.content,
      title = _aboutUsArr$.title;
  var image = globalJson.appLogo; // headerContent.innerHTML = `

  aboutUsContent.innerHTML = content; // $('html, body').animate({
  //   scrollTop: $(".aboutUs").offset().top - 100
  // }, 2000);
}

function register_content() {
  removeTabActive();
  headerContent.innerHTML = ""; // toggleElements("registration", "tabEls");

  $('html, body').animate({
    scrollTop: $(".registration").offset().top
  }, 2000);
}

function removeTabActive() {
  for (var k = 0; k < document.querySelectorAll(".nav-element--els").length; k++) {
    var els = document.querySelectorAll(".nav-element--els")[k];
    els.classList.remove("active");
  }
}

var registration_model;
$(".btn-nextLogin").on("click", function () {
  var email = $("#username").val();
  $(".btn-nextLogin").attr("disabled", true);

  if (!email) {
    swal("Please Enter Email");
    return;
  }

  loginMultiEventApi(email, "generate").then(function (loginData) {
    $(".btn-nextLogin").attr("disabled", false);

    if (loginData.response == false) {
      swal(loginData.responseString);
      return;
    }

    $(".btn-backLogin").show();
    $("#username").attr("disabled", true);
    $(".modal-input--container-password").show();
    $(".btn-nextLogin").hide();
    $(".btn-login").show();
  });
});
$(".btn-login").on("click", function () {
  sessionStorage.setItem("email", $("#username").val());
  $(".btn-login").attr("disabled", true);
  var email = $("#username").val();
  var password = $("#password").val(); // var personl = {};
  // var personl = {};
  //    id = globalJson.appId;
  //    personl.email = $('#username').val();
  //    personl.password = $('#password').val();
  //    personl.loginType = "general";
  //    personl.deviceType = "web";
  //    personl.deviceId = id.toString();
  //    personl.appid = id.toString();
  //    personl.info_privacy = globalJson.info_privacy;
  //    personl.userid_flag = false;
  //    var tok = personl.email + ':' + personl.password;
  //    var auth = "Basic " + btoa(tok);
  // console.log(personl);

  loginMultiEventApi(email, "verify", password).then(function (loginData) {
    sessionStorage.setItem("userdetails", JSON.stringify(loginData));

    if (loginData.response == false) {
      swal(loginData.responseString);
      $(".btn-login").attr("disabled", false);
      return;
    }

    swal('Thanks for loggin in');
    $(".btn-login").attr("disabled", false);
    var userId = loginData.responseString.userId;
    getProfileData(userId).then(function (userDetails) {
      preferenceFormObj.userDetails = userDetails;
      loginSummary(userId);
    }); // console.log(personl);
    //        // url: globalURL+'/api/user/single_event_login',//Login
    //        url: global_parameters.url+'api/user/single_event_login', //Login
  });
});

function loginSummary(userId_1) {
  $.ajax({
    url: global_parameters.url + "api/event/reg_answers?appid=" + globalJson.appId + "&userid=" + userId_1,
    type: "GET",
    cache: false,
    success: function success(reg_data) {
      if (reg_data.response == true) {
        console.log("reg", reg_data);
        $(".close").click();
        $(".register").hide();
        $(".register-now").hide();
        $(".registration-primary").hide();
        $(".login-button").show();
        $(".registration-header h1").html("Summary");
        $(".nextstepButton").hide();
        registration_model = reg_data;
        afterLoginSummary(JSON.parse(registration_model.responseString[0].answer));
      } else {
        //swal(reg_data.responseString);
        console.log("reg", reg_data);
        $(".close").click();
        $(".register").hide();
        $(".register-now").hide();
        $(".registration-primary").hide();
        $(".login-button").show();
        $(".registration-header h1").html("Summary");
        $(".nextstepButton").hide();
        registration_model = [];
        afterLoginSummary([]);
      }
    },
    error: function error() {
      swal("Something Went Wrong , Please try Again");
    }
  });
}

function registrationSubmit() {
  return new Promise(function (resolve, reject) {
    var personsatt = {};
    personsatt.firstname = $("#firstName").val();
    personsatt.lastname = $("#lastName").val();
    personsatt.email = $("#email").val();
    personsatt.designation = $("#designation").val();
    personsatt.company = $("#company").val();
    personsatt.userCategory =$("#user_type")[0]?$("#user_type")[0].options[$("#user_type")[0].selectedIndex].text:"";
    personsatt.admin_flag = "attendee";
    personsatt.coupon_code = sessionStorage.promo_code || "";
    personsatt.phone = $("#phone").val();
    personsatt.loginType = "general";
    personsatt.userType = sessionStorage.userType == "" || sessionStorage.userType == undefined ? globalJson.info_privacy == false ? "checkedin" : "registered" : sessionStorage.userType;
    personsatt.appType = "dashboard";
    personsatt.appid = globalJson.appId;
    personsatt.info_privacy = globalJson.info_privacy;
    personsatt.deviceType = "web";
    var ticket_id = 0;

    if (getTabsArr("tickets").length) {
      ticket_id = ticketId ? ticketId : getTabsArr("tickets")[0].items[0].ticket_id;
    }

    personsatt.ticket_name = ticket_id; //? getTicketDetails(ticket_id).title : "";

    console.log("personsatt", personsatt);
    $.ajax({
      url: global_parameters.url + "api/user/single_event_register",
      cache: false,
      data: personsatt,
      type: "POST",
      success: function success(data) {
        resolve(data);
      }
    });
  });
}

function afterLoginSummary(preference_arr_login) {
  if (appName == "ceipal2020") {
    $(".aboutUs").hide();
  }

  $(".showAfterLogin").show();
  $(".hideAfterLogin").hide();
  $(".registration-preference").empty();
  $("#summary")[0].classList.add("show");
  var _preferenceFormObj$us2 = preferenceFormObj.userDetails.Profile[0],
      company = _preferenceFormObj$us2.company,
      designation = _preferenceFormObj$us2.designation,
      mobile = _preferenceFormObj$us2.mobile,
      reg_type = _preferenceFormObj$us2.reg_type,
      first_name = _preferenceFormObj$us2.first_name,
      last_name = _preferenceFormObj$us2.last_name,
      email = _preferenceFormObj$us2.email,
      user_category = _preferenceFormObj$us2.user_category;
  var userdata = JSON.parse(sessionStorage.userdetails); // let email = sessionStorage.email;
  // let email = sessionStorage.email;

  var user_type_1 = JSON.parse(registration_model.responseString[0].answer).filter(function (data) {
    if (data.reg_id == 1) {
      return data;
    }
  });
  // var user_type_2 = user_type_1[0].answer[0];
  var defaultArrquestArr = preferenceFormObj.defaultQuestionsArr;
  $(".registration-preference").append("<div class=\"container\">\n     <div class=\"questions_primary\">\n     <div id=\"first_name-summary\" class=\"summary\">\n     <span class=\"label-content\">".concat(defaultArrquestArr["firstName"] ? defaultArrquestArr["firstName"] : "First Name", ": </span><span class=\"input-content\">").concat(first_name, "</span>\n    </div>\n    <div id=\"last_name-summary\" class=\"summary\">\n            <span class=\"label-content\">").concat(defaultArrquestArr["firstName"] ? defaultArrquestArr["lastName"] : "Last Name", ": </span><span class=\"input-content\">").concat(last_name, "</span>\n    </div>\n    <div id=\"email-summary\" class=\"summary\">\n            <span class=\"label-content\">").concat(defaultArrquestArr["email"] ? defaultArrquestArr["email"] : "Email", ": </span><span class=\"input-content\">").concat(email, "</span>\n    </div>\n    <div id=\"user_type-summary\" class=\"summary\">\n            <span class=\"label-content\">").concat(defaultArrquestArr["user_type"] ? defaultArrquestArr["user_type"] : "User Type", ": </span><span class=\"input-content\">").concat(user_category, "</span>\n    </div>\n    <div id=\"phone-summary\" class=\"summary\">\n            <span class=\"label-content\">").concat(defaultArrquestArr["phone"] ? defaultArrquestArr["phone"] : "Phone", ": </span><span class=\"input-content\">").concat(mobile, "</span>\n    </div>\n    <div id=\"company-summary\" class=\"summary\">\n            <span class=\"label-content\">").concat(defaultArrquestArr["company"] ? defaultArrquestArr["company"] : "Company", ": </span><span class=\"input-content\">").concat(company, "</span>\n    </div>\n    <div id=\"designation-summary\" class=\"summary\">\n            <span class=\"label-content\">").concat(defaultArrquestArr["designation"] ? defaultArrquestArr["designation"] : "Designation", ": </span><span class=\"input-content\">").concat(designation, "</span>\n    </div>\n     </div></div>"));
  steps = 0;
  $(".preference" + steps).remove();
  $(".registration-preference").append('<div class="preference-edit">' + '</div>');

  if (preference_questions_arr.length > 0) {
    var _loop = function _loop(i) {
      var html = "<div id='preference_questions-summary_" + i + "' class='container'><h2 class='text-center'>" + preference_questions_arr[i].heading + "</h2></div>";
      $(".preference-edit").append(html);
      var prefer = preference_questions_arr[i].items[0].questions;
      var prefer_answers = preference_arr_login;
      var html2 = "";

      for (var j = 0; j < prefer.length; j++) {
        // if(prefer[j].id!=1)
        // {
        for (var k = 0; k < preference_arr_login.length; k++) {
          var prefLoginData = preference_arr_login[k];

          if (prefLoginData.reg_id == prefer[j].id) {
            if (prefer[j].type == "messagebox") {
              var value = prefLoginData.answertext;
              if(checkLabelElement(prefer[j].question))
              {
                value = preferenceFormObj.userDetails.Profile[0][getInputId(prefer[j].question)];
              }
              html2 += '<div id="summary_questions_' + prefer[j].id + '" class="summary"><div class="label-content">' + prefer[j].question + ' </div><div class="input-content">' + value + '</div></div>';
            } else if (prefer[j].type == "single" && prefer[j].detail == "yes") {
              html2 += '<div id="summary_questions_' + prefer[j].id + '" class="summary"><div class="label-content">' + prefer[j].question + ' :</div><div class="input-content">' + prefLoginData.answer + '</div><p>' + prefLoginData.answertext + '</p></div>';
            } else if (prefer[j].type == "single") {
              html2 += '<div id="summary_questions_' + prefer[j].id + '" class="summary"><div class="label-content">' + prefer[j].question + ' :</div><div class="input-content">' + prefLoginData.answer + '</div></div>';
            }
            else if (prefer[j].type == "multiple") {
              var answerHtml =  "";
              prefLoginData.answer.forEach((els)=>{
                answerHtml+=(els+"<br>");
              });
              html2 += '<div id="summary_questions_' + prefer[j].id + '" class="summary"><div class="label-content">' + prefer[j].question + ' :</div><div class="input-content">' + answerHtml + '</div></div>';
            }
          }
        } // }

      }

      $("#preference_questions-summary_" + i).append(html2);
    };

    for (var i = 0; i < preference_questions_arr.length; i++) {
      _loop(i);
    }
    var editButtonElement = "<button class='btn button-edit' onclick='edit()' style='text-align:center;background:#".concat(globalJson.theme_color, "'>Edit</button>"+'<button class="btn button-edit" onclick="cancelRegistration(this)" style="text-align:center;background: #f44336;margin-left: 41px;width: auto;">Cancel Registration</button>');
    $(".registration-preference").append(editButtonElement);
  }
}

function cancelRegistration(el)
{
  $(el).attr("disabled",false);
  statusRegistration("rejected").then((res)=>{
    if(res.response)
    {
      swal("Your Registration has been cancelled").then(()=>{
        window.location.href="/"+globalJson.appUrl;
      });
    }
    else
    {
      swal("Error");
    }
  })
}

function loginMultiEventApi(email, activation, passkey) {
  var loginDetails = {};
  loginDetails.email = email;
  loginDetails.event_id = globalJson.event_id ? globalJson.event_id : globalJson.appId;
  loginDetails.passkey = passkey ? passkey : "";
  loginDetails.action = activation;
  loginDetails.deviceId = loginDetails.event_id;
  loginDetails.deviceType = "web";
  return new Promise(function (resolve, reject) {
    $.ajax({
      // url: globalURL+'/api/user/single_event_login',//Login
      url: "".concat(global_parameters.url, "api/event/multievent_login"),
      type: 'POST',
      data: loginDetails,
      success: function success(resultslog) {
        resolve(resultslog);
      },
      error: function error(_error2) {
        reject(_error2);
      }
    });
  });
}

function edit() {
  $(".registration-preference").empty();
  $(".registration-primary").show();
  $("#firstName").attr("disabled", true);
  $("#lastName").attr("disabled", true);
  $("#email").attr("disabled", true);
  preferenceForm(preference_questions_arr[0]);
  $(".nextstepButton").show();
  $(".btn-submit").hide();
  $(".btn-back").show();
  $(".btn-payment").hide();
  $(".btn-back")[0].style.cssText = "display:block;visibility:hidden;background:#" + globalJson.theme_color + ";";
  $(".btn-next").show();
  $(".registration-header h1").html("Edit Registration");
}

function submit() {
  var personsatt = {};
  $(".btn-submit-edit").attr("disabled", true);
  personsatt.firstname = $("#firstName").val();
  personsatt.lastname = $("#lastName").val();
  personsatt.email = $("#email").val();
  personsatt.phone = $("#phone").val();
  personsatt.designation = $("#designation").val();
  personsatt.company = $("#company").val();
  personsatt.userCategory = $("#user_type")[0]?$("#user_type")[0].options[$("#user_type")[0].selectedIndex].text:"";
  personsatt.admin_flag = "attendee";
  personsatt.coupon_code = sessionStorage.promo_code || "";
  personsatt.loginType = "general";
  personsatt.userType = globalJson.info_privacy == false ? "checkedin" : "registered";
  personsatt.appType = "dashboard";
  personsatt.appid = globalJson.appId;
  personsatt.info_privacy = globalJson.info_privacy;
  personsatt.deviceType = "web";
  var ticket_id = 0;

  if (getTabsArr("tickets").length) {
    ticket_id = ticketId ? ticketId : getTabsArr("tickets")[0].items[0].ticket_id;
  }

  personsatt.ticket_name = ticket_id; //? getTicketDetails(ticket_id).title : "";
  // verifyRegistration();

  console.log("personsatt", personsatt); // $.ajax({
  //     url: global_parameters.url+"api/user/single_event_register",
  //     cache: false,
  //     data: personsatt,
  //     type: "POST",
  //     success: function(data){
  // console.log(data);
  // if (data.response == true) {
  // var reg_userid = JSON.parse(sessionStorage.userdetails).responseString.token.userId;

  var questions_arr = JSON.parse(sessionStorage.questions_arr);
  var answer_array = [];

  for (var i = 0; i < questions_arr.length; i++) {
    var answerreg_json = {};
    var submit_ans_arr = [];
    answerreg_json.reg_id = questions_arr[i].id;
    answerreg_json.type = questions_arr[i].type;
    answerreg_json.detail = "";

    if (questions_arr[i].type == "single") {
      if (answerreg_json.reg_id == 1) {
        submit_ans_arr.push($("#user_type").val());
        answerreg_json.answertext = "";
        answerreg_json.answer = submit_ans_arr;
      } else if (questions_arr[i].detail == "yes") {
        submit_ans_arr.push($("input[name='question_" + questions_arr[i].id + "']:checked").val());
        answerreg_json.answertext = $("#question_" + questions_arr[i].id + "_feedback").val();
        answerreg_json.answer = submit_ans_arr;
      } else {
        var checkInputValueText = questions_arr[i].name ? document.getElementById(questions_arr[i].name).options[document.getElementById(questions_arr[i].name).selectedIndex].text : $("input[name='question_" + questions_arr[i].id + "']:checked").val();
        submit_ans_arr.push(checkInputValueText);
        answerreg_json.answertext = "";
        answerreg_json.answer = submit_ans_arr;
      }
    } else if (questions_arr[i].type == "multiple") {
      for (var j = 0; j < questions_arr[i].answer.length; j++) {
        if ($("input[id='question_" + questions_arr[i].id + "_" + j + "']:checked").val()) {
          submit_ans_arr.push($("input[id='question_" + questions_arr[i].id + "_" + j + "']:checked").val());
          answerreg_json.answertext = "";
        }
      }

      answerreg_json.answer = submit_ans_arr;
    } else if (questions_arr[i].type == "messagebox") {
      if (answerreg_json.reg_id == 6 && $("#summary_questions_6 .input-content")[0] != undefined) {
        answerreg_json.answertext = $("#summary_questions_6 .input-content")[0].innerHTML;
        answerreg_json.answer = [];
      } else if (answerreg_json.reg_id == 19 && $("#summary_questions_19 .input-content")[0] != undefined) {
        answerreg_json.answertext = $("#summary_questions_19 .input-content")[0].innerHTML;
        answerreg_json.answer = [];
      } else {
        var _checkInputValueText2 = questions_arr[i].name ? "#".concat(questions_arr[i].name) : "#question_" + questions_arr[i].id;

        answerreg_json.answertext = $(_checkInputValueText2).val() || "";
        answerreg_json.answer = [];
      }
    }

    answer_array.push(answerreg_json);
  }

  preference = {};
  var userResponseData = [];
  preference.userResponse = answer_array;
  preference.adminsurvey_flag = 0;
  preference.appid = globalJson.appId;
  userResponseData.push({
    "email": $("#email").val(),
    "userid": "",
    "appid": globalJson.appId,
    "user_type": "attendee",
    "ans_data": JSON.stringify(answer_array)
  });
  preference.userResponse = JSON.stringify(userResponseData);
  sessionStorage.setItem("userdetails", preference);
  $.post(global_parameters.url + "api/event/registration_answers", preference, function (data) {
    console.log("preference", data);
    $(".btn-submit").removeAttr("disabled");
    $(".btn-payment").removeAttr("disabled");
    $(".btn-submit-edit").attr("disabled", false);
    $("#loader img").remove();
    $(".btn-submit").removeClass("btn-active--submit");
    var img = globalJson.appLogo;
    var emailIdSupport = globalJson.event_organizer_email;
    if(appName == "fvpsamidwest-south" || appName == "fvpsaeastern" || appName == "fvpsawest")
    {
      emailIdSupport = "Treceia.bazemore@f2solutions.com";
      img =  "https://webmobi.s3.amazonaws.com/nativeapps/eventdemofirst/1619624704994_FYSB_Logo.png";
    }
    var modalContent = "\n                                    <div class=\"banner-image\">\n                                        <img src=\"".concat(img, "\">\n                                    </div>\n                                    <span style=\"display: none;\" id=\"reg_Content\" class=\"textcenter\">Your registration has been successfully cancelled</span>\n                                    <div id=\"thankyou_content\">\n                                        <span class=\"textcenter\" style=\"margin-top: 28px\">Your confirmation letter has just been emailed to you. If you do not received your confirmation email, please check your spam or junk folder. If further assistance is needed, please contact ").concat(emailIdSupport,'<div class=\"redirect_button\">\n                                            <div class=\"mosaic\">\n                                                <a id=\"home_redirect\">HOME</a>\n                                            </div>\n                                        </div>\n                                        "');
    $('.thankyouContent').html(modalContent);
    $("#home_redirect").css("background", "#".concat(globalJson.theme_color));
    $("#thankyouMdoal").modal('show'); // $.post("https://api.webmobi.com/api/event/buy_tickets", ticket_details, function(data) {
    //     window.scrollTo(0, 500);f
    //     if (data.response == true || data.response == false) {
    //         $("section.registration")[0].innerHTML = "";
    //         appname_1 = globalJson.appName;
    //         ticket_number =ticket_id;
    //         appLogo = globalJson.appLogo;
    //         location_1 = globalJson.location;
    //         var dat123 = new Date(globalJson.startdate  + 19800000);
    //         var dat1   = new Date(globalJson.enddate  + 19800000);
    //         if(globalJson.startdate  == globalJson.enddate)
    //           event_date_1 = dat123.getDate() + " " + monthFullNames[dat123.getMonth()]+ " " + dat123.getFullYear()
    //         else
    //           event_date_1 = dat123.getDate() + " " + monthFullNames[dat123.getMonth()]+ " " + dat123.getFullYear() + " - " + dat1.getDate() + " " + monthFullNames[dat1.getMonth()] + " " + dat1.getFullYear();
    //         $("section.registration")[0].innerHTML = '<div class="ticket_border" style="background-color:#ffffff;font-size: 20px;"> <div class="row row_other"> <p style="text-align:center;">'+appname_1+'</p><p style="text-align:center;">URN NUMBER: '+ticket_number+'</p></div><div class="" style="border: 1px solid black;width: 80%;margin: 0 auto; "> <div class="row attendee_all_details"> <img class="img_logo" width="200" height="200" style="margin: 3% 39%;" src="" alt="'+appLogo+'" crossorigin/> <p style="text-align:center;" class="event_date">'+event_date_1+'</p><p style="text-align:center;" class="event_location">'+location_1+'</p><p style="text-align:center;" class="event_location">'+personsatt.firstname+" "+personsatt.lastname+'</p><p style="text-align:center;" class="event_location">'+personsatt.designation+'</p><p style="text-align:center;" class="event_location">'+personsatt.company+'</p></div><div class="row"> <div class="col-sm-12"> <div id="qrcodeCanvas"></div></div></div><div class="row"> <h3 class="pdf_type_heading">ATTENDEE</h3> </div></div></div>'
    //         new QRCode(document.getElementById("qrcodeCanvas"), reg_userid);
    //         swal("Registered Sucessfully");
    //     }else{
    //       swal("error");
    //       window.location.reload();
    //     }
    // });
  }); // } else {
  //     swal(data.responseString);
  //     $(".btn-submit").removeAttr("disabled");
  //     $("#loader img").remove()
  //     $(".btn-submit").removeClass("btn-active--submit");  
  // }
  // },
  // error: function (textStatus, errorThrown) {
  //     swal("Something went wrong. Please try again.");
  //     $(".btn-submit").removeAttr("disabled");
  //     $("#loader img").remove()
  //     $(".btn-submit").removeClass("btn-active--submit");  
  // }
  //   });
}

function getTabsArr(tab) {
  var tab_arr = globalJson.events[0].tabs;
  var tabArr = [];
  tab_arr.forEach(function (tabs) {
    if (tabs.type == tab) {
      tabArr.push(tabs);
    }
  });
  return tabArr;
}

function getTicketDetails(ticket_id) {
  if (!getTabsArr("tickets").length) {
    return false;
  }

for (var i = 0; i < getTabsArr("tickets")[0].items.length; i++) {
    var ticketitems = getTabsArr("tickets")[0].items[i];

    if (ticketitems.ticket_id == ticket_id) {
      return ticketitems;
    }
  }
}

function verifyRegistration() {
  var verifyReg = {};
  var userDetails = JSON.parse(sessionStorage.userdetails);
  verifyReg.userid = userDetails.responseString.token.userId;
  verifyReg.appid = globalJson.appId;
  verifyReg.action = sessionStorage.userType == "rejected" ? "decline" : "approve";
  verifyReg.send_email = sessionStorage.email;
  $.post("https://api.webmobi.com/api/user/verifyRegistration", verifyReg, function (verData) {
    console.log(verData);
  });
}

function statusRegistration(status) {
  var verifyReg = {};
  verifyReg.userid = preferenceFormObj.userDetails.Profile[0].event_user_id;
  verifyReg.appid = globalJson.appId;
  verifyReg.action = status == "rejected" ? "decline" : "approve";
  verifyReg.send_email = sessionStorage.email;
  return new Promise((resolve,reject)=>{
    $.post("https://api.webmobi.com/api/user/verifyRegistration", verifyReg, function (verData) {
      resolve(verData);
    });
  });
}



function getJsonArray(key) {
  var tabelementjson;
  var tabsArr = globalJson.events[0].tabs;

  for (var k = 0; k < tabsArr.length; k++) {
    var element = tabsArr[k];

    if (element.type == key) {
      tabelementjson = element;
    }
  }

  return tabelementjson;
}

function handleServerResponse(response) {
  if (response.error) {
    swal("Payment Failed", "error");
    postErrorPyament(response);
    $(".btn-payment").removeAttr("disabled");
  } else if (response.requires_action) {
    // Use Stripe.js to handle required card action
    console.log("requires_action");
    stripe.handleCardAction(response.payment_intent_client_secret).then(function (result) {
      if (result.error) {
        swal("Payment Failed", "error");
        postErrorPyament(result); // Show error in payment form
      } else {
        // The card action has been handled
        // The PaymentIntent can be confirmed again on the server
        $.ajax({
          url: global_parameters.url + 'api/registration/confirm_payment',
          cache: false,
          data: {
            payment_intent_id: result.paymentIntent.id
          },
          type: "POST",
          success: function success(result) {
            console.log(result);
            handleServerResponse(json);
          },
          error: function error(textStatus, errorThrown) {
            swal("Something went wrong. Please try again.");
            $(".btn-payment").removeAttr("disabled");
            $("#loader img").remove();
            $(".btn-submit").removeClass("btn-active--submit");
          }
        });
      }
    });
  } else {
    registrationSubmit().then(function (data) {
      if (data.response == true) {
        if (!preferenceFormObj.isPreferenceForm) {
          var img = globalJson.appLogo; 
          var emailIdSupport = globalJson.event_organizer_email;
          if(appName == "fvpsamidwest-south" || appName == "fvpsaeastern" || appName == "fvpsawest")
          {
            emailIdSupport = "Treceia.bazemore@f2solutions.com";
            img = "https://webmobi.s3.amazonaws.com/nativeapps/eventdemofirst/1619624704994_FYSB_Logo.png";
          }
          var modalContent = "\n                                        <div class=\"banner-image\">\n                                            <img src=\"".concat(img, "\">\n                                        </div>\n                                        <span style=\"display: none;\" id=\"reg_Content\" class=\"textcenter\">Your registration has been successfully cancelled</span>\n                                        <div id=\"thankyou_content\">\n                                            <span class=\"textcenter\" style=\"margin-top: 28px\">Your confirmation letter has just been emailed to you. If you do not received your confirmation email, please check your spam or junk folder. If further assistance is needed, please contact ").concat(emailIdSupport,'<div class=\"redirect_button\">\n                                            <div class=\"mosaic\">\n                                                <a id=\"home_redirect\">HOME</a>\n                                            </div>\n                                        </div>\n                                        "');
          $('.thankyouContent').html(modalContent);
          $("#home_redirect").css("background", "#".concat(globalJson.theme_color));
          $("#thankyouMdoal").modal('show');
          return;
        }

        submit();
      } else {
        swal(data.responseString);
        $(".btn-payment").removeAttr("disabled");
      }
    });
  }
}

function postErrorPyament(log) {
  var params = {};
  params.appid = globalJson.appId||"";
  params.userid = $("#email").val();
  params.deviceType = "web";
  params.deviceId = "";
  params.info = "payment error";
  params.log = JSON.stringify(log);
  params.device_info = "";
  params.device_version = "";
  return new Promise(function (resolve, reject) {
    $.ajax({
      url: global_parameters.url + "api/event/device_log",
      method: "POST",
      cache: false,
      data: params,
      success: function success(data) {
        resolve(data);
      },
      error: function error(_error4) {
        reject(_error4);
      }
    });
  });
}

function makePaymentApi(result) {
  // Otherwise send paymentMethod.id to your server (see Step 2)
  var ticket_checkvalue = getJsonArray('tickets').checkvalue != undefined ? getJsonArray('tickets').checkvalue : '';
  var ticket_id = getFirstPayement().ticket_id != undefined ? getFirstPayement().ticket_id : 1;
  var cardholderName = document.getElementById('cardname');
  var payment_para = {};
  payment_para.firstName = $("#firstName").val();
  payment_para.lastName = $("#lastName").val(); // payment_para.email = $("#email").val();

  payment_para.company = $("#company").val();
  payment_para.phone = $("#phone").val();
  payment_para.email = $("#email").val();
  payment_para.cardholderName = cardholderName.value;
  payment_para.payment_method_id = result.paymentMethod.id;
  payment_para.appid = globalJson.appId;
  payment_para.default_id = ticket_checkvalue;
  payment_para.ticket_id = ticket_id;
    payment_para.coupon_code = $("#clientCode").val();
  $.ajax({
    url: global_parameters.url + "api/registration/confirm_payment",
    type: "POST",
    cache: false,
    data: payment_para,
    success: function success(result) {
      console.log(result);
      handleServerResponse(result);
    },
    error: function error(textStatus, errorThrown) {
      swal(textStatus.responseJSON.responseString);
      $(".btn-payment").removeAttr("disabled");
      $("#loader img").remove();
      $(".btn-submit").removeClass("btn-active--submit");
    }
  });
} // Make payment Button


$(".btn-payment").on("click", function () {
  $(".error-message").empty();
  $(".btn-payment").attr("disabled", true);
  $(".registration-primary__forms-input,.registration-preference--text").removeClass("invalid");
  var errors = validateForm();

  if (errors.length != 0) {
    for (var i = 0; i < errors.length; i++) {
      $(".error-message").append('<div class="alert alert-danger" role="alert">' + errors[i] + '</div>');
      window.scrollTo(0, 500);
    }

    $(".btn-submit").removeAttr("disabled");
    $("#loader img").remove();
    $(".btn-submit").removeClass("btn-active--submit");

    if (steps == 0) {
      $(".btn-back").css("visibility", "hidden");
    }

    $(".btn-payment").removeAttr("disabled");
    return;
  }

  var cardholderName = document.getElementById('cardname');
  stripe.createPaymentMethod('card', cardElement, {
    billing_details: {
      name: cardholderName.value
    }
  }).then(function (result) {
    if (result.error) {
      // Show error in payment form
      swal("Payment Failed", "error");
      $(".btn-payment").removeAttr("disabled");
      $("#loader img").remove();
      $(".btn-submit").removeClass("btn-active--submit");
      postErrorPyament(result);
    } else {
      makePaymentApi(result);
    }
  });
});

function getFirstPayement() {
  var price = '';
  var ticketsJson = getJsonArray('tickets');

  if (ticketsJson == undefined) {
    return;
  }

  var tickets_arr = [];

  for (var k = 0; k < ticketsJson.items.length; k++) {
    var ticketItems = ticketsJson.items[k];

    if (ticketItems.ticket_id == ticketId) {
      tickets_arr.push(ticketItems);
    }
  }

  return tickets_arr[0];
}

function applyCoupon() {
  var couponCode = $("#clientCode").val();
  var ticketsJson = getFirstPayement();
  var price = getTicketDetails(ticketId).price;
  var pricehtml = document.getElementById('ticketPrice');
  var discountedprice = .75*price;
  if (couponCode) {
    if (globalJson.appUrl == "wamft2020" || globalJson.appUrl == "webmobitechconference2018" || globalJson.appUrl == "newyear2020") {
      if (couponCode.toLowerCase() == "wamft2020scholarship" || couponCode.toLowerCase() == "wamft2020volunteer") {
        swal("Coupon Code Applied Successfully");
        sessionStorage.promo_codes = couponCode;
        $("#cardholderdetail").hide();
        $("#creditdebitcarddetail").hide();
        $(".btn-payment").hide();
        $(".btn-submit").show();
        $("#cardname").removeClass("required");
      } else if(couponCode.toLowerCase() == "wamft2020presenter") {
        swal("Coupon Code Applied Successfully");
      pricehtml.innerText = discountedprice;
            

      }
       else {
        swal("Invalid Coupon");
      }
    }
  } else {
    swal("Please Enter Coupon Code");
  }
}

function checkPaymentCondition() {
  var ticketsJson = false;

  if (getFirstPayement()) {
    ticketsJson = getFirstPayement().payment_flag == "paid" ? true : false;
  }

  return ticketsJson;
}

function getProfileData(userId) {
  return new Promise(function (resolve, reject) {
    {
      $.ajax({
        url: "".concat(global_parameters.url, "api/user/profile?userid=").concat(userId, "&appid=").concat(globalJson.appId),
        type: 'GET',
        cache: 'false',
        success: function success(usersData) {
          resolve(usersData);
        },
        error: function error(_error3) {
          reject(_error3);
        }
      });
    }
  });
}

function toggleElements(showElement, hideElement) {
  var displayElement = document.querySelectorAll(".".concat(showElement));
  var hiddenElement = document.querySelectorAll(".".concat(hideElement));

  for (var k = 0; k < hiddenElement.length; k++) {
    hiddenElement[k].style = 'display:none';
  }

  for (var k = 0; k < displayElement.length; k++) {
    displayElement[k].style = 'display:block';
  }
}

function appendStyle(styles, name) {
  var css = document.createElement('style');
  css.type = 'text/css';
  css.class = name;
  if (css.styleSheet) css.styleSheet.cssText = styles;else css.appendChild(document.createTextNode(styles));
  document.getElementsByTagName("head")[0].appendChild(css);
}
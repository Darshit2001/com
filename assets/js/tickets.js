"use strict";
var headerContent = document.querySelector(".header--content");
var aboutUsContent = document.querySelector(".aboutUs");
var speakerContent = document.querySelector(".speakers");
var globalJson;
var ticketsObj = {isAvailable:true};


window.onerror = function(msg, url, line)
{
  postErrorPyament(msg);
};



$(document).ready(function(){
    $.ajax({
    url: "https://s3.amazonaws.com/webmobi/nativeapps/".concat(appName, "/appData.json"),
        cache: false,
        type:'GET',
        dataType: "json",
    success: function success(data) {
            console.log(data);
            globalJson = data;
            showPageDesign();
            sessionStorage.clear();
      var isTicketsAvailable = checkTicktsAvailable();
      isTicketsAvailable ? ticketsDisplay() : ticketsObj.isAvailable=false;
      if(!isTicketsAvailable)
      {
        $(".ticketsDisplay ").hide();
      }
      if($(".navigation__background")[0])
         $(".navigation__background")[0].style.cssText="background:#"+globalJson.theme_border+";"
        
         globalJson.events[0].tabs.forEach((tab)=>{
          dynamicTabUpdate(tab);
        })
            updateEventDetails();
      setInterval(function () {
        $("#loader-page").hide();
      }, 1000);
      $(".agendaDetails .row button").css("background","#"+globalJson.theme_color)
      $(".agendaDetails .agendaHeading").css("background","linear-gradient(to right, "+hexToRgbA("#"+globalJson.theme_color,1)+", "+hexToRgbA("#"+globalJson.theme_color,0.7)+")")
        },
    error: function error() {
      document.querySelector("body").innerHTML = "<div class=\"error_page text-center\" style=\"margin-top:5%\"><h1>404</h1><h3>Page Not Found.</h3><h4>Contact: support@webmobi.com</h4></div>";
        }
  });
});


$(window).scroll(function(){
  var mq = window.matchMedia( "(max-width: 500px)" );
  if (!mq.matches) {
  if ($(window).scrollTop() == 0) {
        $(".navbar--header").removeClass("navbar--header--scroll");
        $(".navbar--header__logo").removeClass("nav--header__logo-scoll");
        $(".nav-element .register").addClass('button-color-white');
        $(".navbar--header__logo img").attr("src",globalJson.appLogo);
    $(".supportHeader").show();
  } else if ($(window).scrollTop() >= 54) {
        $(".navbar--header").addClass("navbar--header--scroll");
        $(".navbar--header__logo").addClass("nav--header__logo-scoll");
        $(".nav-element .register").removeClass('button-color-white');
        $(".navbar--header__logo img").attr("src",globalJson.appLogo);
     $(".supportHeader").hide();
  }
  }
  else
  {
    $(".navbar--header")[0].style.cssText="position:absolute;";
  }
  });

function updateEventDetails() {
  var timeArr = timeConvertor(globalJson.startdate).toDateString().split(" ");
  var time = timeArr[1]+" "+timeArr[2]+", "+timeArr[3];
  var place = globalJson.city;
  var sessionsCount=0;
  for (var i = 0; i < getTabArr("agenda")[0].agenda.length; i++) {
    var agendaDetails = getTabArr("agenda")[0].agenda[i].detail;
    for (var j = 0; j < agendaDetails.length; j++) {
      ++sessionsCount;
    }
  }
  var sessions = sessionsCount + " SESSIONS";
  document.querySelector(".eventDetails--details.eventDetails--date").innerText=time;
  document.querySelector(".eventDetails--details.eventDetails--place").innerText=place;
  document.querySelector(".eventDetails--details.eventDetails--sessions").innerText=sessions;
}

function appendSponsors() {
  var sposorsDetails = document.querySelector(".sposorsDetails .row");
  sposorsDetails.innerHTML="";
  if (!getTabArr("sponsorsData")[0]) {
    $(".sposorsDetails").hide();
    return;
  }
  if (!getTabArr("sponsorsData")[0].items.length) {
    $(".sposorsDetails").hide();
    return;
  }
  var sponsorsCategory = getTabArr("sponsorsData")[0].categories;
  var sposnsors =getTabArr("sponsorsData")[0].items;
  var resultHtml = "";
  for (var i = 0; i < sponsorsCategory.length; i++) {
    var category1=sponsorsCategory[i].category;
    var sponsorRowHtml = "<div class='col-md-3'><h4>"+category1+"</h4>";
    for (var j = 0; j < sposnsors.length; j++) {
      var categories2 = sposnsors[j].categories,
      sposnsorImage = sposnsors[j].image,
      website = sposnsors[j].website;
      if (categories2 == category1) {
        if (sposnsorImage) {
          sponsorRowHtml += "\n            <div class=\"sposorsDetails--imageContainer\">\n             <a href=\"".concat(website, "\" target=\"_blank\">\n              <img src=\"").concat(sposnsorImage, "\">\n             </a>\n            </div>\n          ");
        }
      }
    }
    resultHtml += sponsorRowHtml + "</div>";
  }
  sposorsDetails.innerHTML = resultHtml;
}
function appendAgenda() {
  if (!getTabArr("agenda")[0].agenda.length) {
    $(".agendaDetails").hide();
    return;
  }
  var agendaAppend = document.querySelector(".agendaDetails");
  agendaAppend.innerHTML = "";
  var agendaArray = getTabArr("agenda")[0].agenda;
  var agendaContent = "";
  var isAgendaStart = false;
  for (var i = 0; i < agendaArray.length; i++) {
    var agendaDate = agendaArray[i].name;
    var agendaDetails = agendaArray[i].detail;
    var timeArr = timeConvertor(agendaDate).toDateString().split(" ");
    var time = timeArr[1]+" "+timeArr[2]+", "+timeArr[3];
    var topicCass = !isAgendaStart?"agendaMiddle":"agendaStart";
    var agendaContentDetails = "\n    <div class=\"row ".concat(topicCass, "\">\n          <div class=\"col-md-2\">\n              <button class=\"btn\" style=\"background: rgb(90, 36, 157);\">").concat(time, "</button>\n          </div>\n          <div class=\"col-md-10 borderMark\">\n          </div>\n      </div>\n    ");

    for (var j = 0; j < agendaDetails.length; j++) {
      var agendaDetailsInfo = agendaDetails[j];
      var speakerIds = agendaDetailsInfo.speakerId;
      var fromtime = agendaDetailsInfo.fromtime,
      totime =agendaDetailsInfo.totime,
      topic =agendaDetailsInfo.topic,
      location =agendaDetailsInfo.location;
      var hide_agenda = agendaDetailsInfo.hide_agenda;
      var speakerInfo = "";
      for (var k = 0; k < speakerIds.length; k++) {
        var spkid = speakerIds[k];
        var image = getSpeakerDetails(spkid).image;
        var name = getSpeakerDetails(spkid).name;
        var position = getSpeakerDetails(spkid).position;
        var details = getSpeakerDetails(spkid).details;
        image = image?image:"https://s3.amazonaws.com/webmobi/eventwebsitesingletemplate/user.png";
        speakerInfo += "\n                    <div class=\"agendaDetails--speakers--details\">\n                        <div class=\"agendaDetails--speakers--image\">\n                            <img src=\"".concat(image, "\" alt=\"speakers\">\n                        </div>\n                        <div class=\"agendaDetails--speakers--contents\">\n                            <h5 data-speakerId='"+spkid+"' class=\"agendaDetails--speakers--name\">").concat(name, "</h5>\n                            <p class=\"agendaDetails--speakers--designation\">").concat(position, "</p>\n <br>\n                        </div>\n                    </div>\n        ");
      }
      if(hide_agenda == 0)
      {
      agendaContentDetails += "\n      <div class=\"row\">\n            <div class=\"col-md-2\">\n                <h5 class=\"dateTimeText\"><i class=\"fa fa-clock-o\" aria-hidden=\"true\"></i> &nbsp;".concat(getTime(fromtime), "-").concat(getTime(totime, true), "</h5>\n                <h5 class=\"dateTimeText\">").concat(location, "</h5>\n            </div>\n            <div class=\"col-md-10 borderMark\">\n                <div>\n                    <div class=\"agendaHeading\"><span>").concat(topic, "</span></div>\n                </div>\n                <div class=\"agendaDetails--speakers\">\n                    ").concat(speakerInfo, "\n                </div>\n            </div>\n        </div>\n      ");
        isAgendaStart = true;
      }
    }
    if(!isAgendaStart)
      agendaContentDetails = "";
    agendaContent+=agendaContentDetails;
  }
  agendaAppend.innerHTML = agendaContent;
  $(".agendaDetails--speakers--name").on("click",function()
  {
    $('#speakerModal').modal('show'); 
    var spkId1 = this.getAttribute("data-speakerId"),
    image = getSpeakerDetails(spkId1).image,
    name = getSpeakerDetails(spkId1).name,
    position = getSpeakerDetails(spkId1).position,
    details = getSpeakerDetails(spkId1).details;
    image = image?image:"https://s3.amazonaws.com/webmobi/eventwebsitesingletemplate/user.png";
    var appendHtml = `<div class="speakerContainer--image">
      <img src="${image}" alt="Profile Image">
      </div>
      <div class="speakerContainer--content">
          <h3 class="speakerContainer--content--position">
            ${position}
          </h3>
          <p class="speakerContainer--content--content">
            ${details}
          </p>
      </div>`
    $(".speakerContainer").html(appendHtml);
    $("#speakerModalLabel").text(name);
    $("#speakerModalLabel").parent().css("background","#"+globalJson.theme_color)
  })
}
function getSpeakerDetails(id) {
  var speakerArr = "";
  if (!getTabArr("speakersData")[0].items.length) {
    return;
  }
  var speakers = getTabArr("speakersData")[0].items;
  for (var i = 0; i < speakers.length; i++) {
    var speakerDetails = speakers[i];
    var speakerId = speakerDetails.speakerId;
    if (id == speakerId) {
      speakerArr = speakerDetails;
    }
  }
  return speakerArr;
}
function getTime(time, showAm) {
  var clientTime = new Date(time) * 1 + new Date(time).getTimezoneOffset() * 60 * 1000;
  var hours = new Date(clientTime).getHours(),
  minutes = new Date(clientTime).getMinutes();
  var showAmPm = showAm ? "".concat(hours >= 12 ? "pm" : "am") : "";
  return "".concat(hours < 10 || hours < 22 && hours > 12 ? 0 : "").concat(hours > 12 ? hours - 12 : hours, ":").concat(minutes < 10 ? 0 : "").concat(minutes, " ").concat(showAmPm);
}
function getTabArr(type)
{
  let tabArr = [];
  for(var i=0;i<globalJson.events[0].tabs.length;i++)
  {
    if(globalJson.events[0].tabs[i].type==type)
    {
      tabArr.push(globalJson.events[0].tabs[i]);
    }
  }
  return tabArr;
}
function timeConvertor(time)
{
  return new Date((new Date(time)*1) + new Date(time).getTimezoneOffset()*60*1000)
}

function showPageDesign() {
  var logoRedirectUrl="";
  if(appName == "webmobicmo2020")
  {
    logoRedirectUrl="/"
  }
  else
  {
    logoRedirectUrl="/?appName="+appName;
  }
  $(".navbar--header").append("<div class=\"navbar--header__logo\"><div>\n             <a href=\"".concat(logoRedirectUrl, "\"><img src=\"").concat(globalJson.appLogo, "\" alt=\"logo image\"></a>\n             <span class=\"nav-element\">\n<span id=\"summary\" class=\"nav-element--els\"><span>Summary</span></span><span id=\"aboutUs\" class=\"nav-element--els show\">\n                            </span>\n  </span>\n</div></div>"));
  $(".supportHeader").css("background-color","#"+globalJson.theme_color);
  document.querySelector('head').innerHTML += "<link rel=\"icon\" href=\"".concat(globalJson.appLogo, "\">");
    
  $(".applogo").append("<img src=\"".concat(globalJson.appLogo, "\" alt=\"logo image\">"));
  $(".header").css('background-image','url("'+globalJson.appLoadingImage+'")');
  $("button.btn").css('background', "#".concat(globalJson.theme_color));
  $(".registration-header h1").css('color', "#".concat(globalJson.theme_color));
  $(".registration-header").css("color", "#".concat(globalJson.theme_color));
  // $(".header--left--opacity button")[0].style.cssText="background:#"+globalJson.theme_color+";";
  $("button.btn,.modal-content--header").css('background', "#".concat(globalJson.theme_color));
  if (globalJson.appDescription != "") {
            $(".registration-para").text(globalJson.appDescription);
  } else {
            $(".registration-para").hide();
        }
        $(".footer-element").css("background","#"+globalJson.theme_color);
        $(".registration-preference,.registration-primary").css("color","#"+globalJson.theme_color);
}
$(".btn-send").on("click",function(){
  if (this.classList[1] == "email") {
        $(".modal-content--email").show();
        $(".modal-content--body").hide();
        $(".modal-title").text("Forgot Password");
  } else {
        $(".modal-content--email").hide();
        $(".modal-content--body").show();
        $(".modal-title").text("Already Registered?");
    }
});
$(".btn-sendPassword").on("click", function (event) {
    $(this).attr("disabled","true");
  var forgotPassword = {};
    forgotPassword.email = $("#email-send").val();
    forgotPassword.appid = globalJson.appId;
    $.ajax({
        // url: globalURL+'/api/user/single_event_login',//Login
        url: global_parameters.url+'api/user/app_forgot_password', //Login
        type: 'POST',
        data: forgotPassword,
    success: function success(resultslog) {
         console.log("log result",resultslog);
             sessionStorage.setItem("userdetails",JSON.stringify(resultslog));
             if (resultslog.response == true) {
                 swal('Your password has been reset and the new password has been sent to your Email Id');
                 $(".btn-sendPassword").removeAttr("disabled");
             }else{
                 swal(resultslog.responseString);
        $(".btn-sendPassword").removeAttr("disabled");
             }
    },
    error: function error(_error) {
           swal("Something Went Wrong. Please try Again and contact customer support at support@webmobi.com");
      $(".btn-sendPassword").removeAttr("disabled");
       }
    });
});
$(".btn-nextLogin").on("click",function(){
  var email = $("#username").val();
    $(".btn-nextLogin").attr("disabled",true);
  if (!email) {
        swal("Please Enter Email");
        return;
    }
  loginMultiEventApi(email, "generate").then(function (loginData) {
        $(".btn-nextLogin").attr("disabled",false);
    if (loginData.response == false) {
        swal(loginData.responseString);
        return;
        }
        $(".btn-backLogin").show();
        $("#username").attr("disabled",true);
        $(".modal-input--container-password").show();
        $(".btn-nextLogin").hide();
        $(".btn-login").show();
  });
});
$(".btn-backLogin").on("click",function(){
    $("#username").attr("disabled",false);
    $(".modal-input--container-password").hide();
    $(".btn-backLogin").hide();
    $(".btn-nextLogin").show();
    $(".btn-login").hide();
});
$(".btn-login").on("click",function(){
    sessionStorage.setItem("email",$("#username").val());
    $(".btn-login").attr("disabled",true);
  var email = $("#username").val();
  var password = $("#password").val();
  loginMultiEventApi(email, "verify", password).then(function (loginData) {
        sessionStorage.setItem("userdetails",JSON.stringify(loginData));
    if (loginData.response == false) {
          swal(loginData.responseString);
          $(".btn-login").attr("disabled",false);
          return;
        }
        swal('Thanks for loggin in');
        $(".btn-login").attr("disabled",false);
    var userId = loginData.responseString.userId;
        $(".btn-login").attr("disabled",false);
    var loginTicket = {
      userId: userId
    };
        sessionStorage.loginTicket = JSON.stringify(loginTicket);
        sessionStorage.setItem("userdetails",JSON.stringify(loginData));
    window.location.href = "registration.html?appName=".concat(appName);
});
});


function loginMultiEventApi(email, activation, passkey) {
  var loginDetails = {};
  loginDetails.email = email;
  loginDetails.event_id = globalJson.event_id?globalJson.event_id:globalJson.appId;
  loginDetails.passkey = passkey?passkey:"";
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

function checkTicktsAvailable() {
  var ticketsJSON = getJsonArray('tickets');
  var isTickets = false;
  if (ticketsJSON) {
    var ticketsNumber = ticketsJSON.items.length;
        isTickets = ticketsNumber>1?true:false;
    }
    return isTickets;
}


function openHtml(link, ticketId) {
  var ticketurl = ticketId != undefined ? "&ticketId=".concat(ticketId) : '';
  window.location.href = "".concat(link, ".html?appName=").concat(appName).concat(ticketurl);
}   


function dynamicTabUpdate(tabs)
{
  let tabType = tabs.type;
  let {checkvalue,mod_display,iconCls,title}=tabs;
  let showTabs = (mod_display=="webmobi"||mod_display=="web")?true:false;
  if(!showTabs)
  {
    return;
  }
  switch (tabType) {
    case "aboutus":
        appendAboutus();
        appendAboutus2();
        break;
    case "speakersData":
        appendSpeakers();
        break;
    case "agenda":
            appendAgenda();
            break;
    case "sponsorsData":
              appendSponsors();
            break;
    default:
        break;
 }
}


function ticketsDisplay() {
  var tiketsJson = getJsonArray('tickets');
  var ticketsArr = tiketsJson.items;
  var totalTickets = ticketsArr.length;
  var ticketsElement = document.getElementById("ticketsContainer");
   document.getElementById("ticketsCount").innerText = totalTickets;
  var ticketsHTML = '';
  var checkDate;
  for(var k = 0;k<ticketsArr.length;k++)
  {
        var ticket_id = ticketsArr[k].ticket_id,
            title = ticketsArr[k].title,
            description = ticketsArr[k].description,
            enddate = ticketsArr[k].enddate,
            startdate = ticketsArr[k].startdate,
            ticket_available = ticketsArr[k].ticket_available,
            status = ticketsArr[k].status;
    var ticketsStatus = status == "available" ? true : false;
       checkDate = checkEventDate(startdate,enddate);
       enddate = getDateFormated(enddate);
    if(status != "hidden")
    {
      ticketsHTML += "\n       <div class=\"tickets\">\n       <div class=\"tickets-left\">\n           <h2 class=\"ticketsTitle\">".concat(title, "</h2>\n           <p class=\"ticketsDescription\">").concat(description, "</p>\n           <p class=\"ticketsAvailable\">Total Tickets Avalable: ").concat(ticket_available, "</p>\n       </div>\n       <div class=\"tickets-right\">\n           <button data-ticketid='").concat(ticket_id, "' class=\"btn btn-ticket\" ").concat(ticketsStatus ? '' : 'disabled', ">").concat(ticketsStatus ? 'Register Now' : 'Registration Over', "</button>\n           <p>The Registration Ends on: ").concat(enddate, "</p>\n       </div>\n   </div>\n       ");
    }
  }
   ticketsElement.innerHTML = ticketsHTML;
  document.getElementById("ticketsCount").innerText = $("#ticketsContainer .tickets").length;
  for(var k=0;k<document.querySelectorAll(".btn-ticket").length;k++)
  {
    let element = document.querySelectorAll(".btn-ticket")[k];
    element.addEventListener('click', function () {
      var ticket_id = element.getAttribute('data-ticketid');
            openHtml('registration',ticket_id);
        });
  }
} 


function getJsonArray(key) {
  var tabelementjson;
  var tabsArr = globalJson.events[0].tabs;
  for(var k=0;k<tabsArr.length;k++)
  {
    var element = tabsArr[k];
    if (element.type == key) {
            tabelementjson = element;
        }
  }
    return tabelementjson;
}


function checkEventDate(startDate, enddate) {
  var today = new Date().getTime();
  var checkTime = startDate < today && enddate > today ? true : false;
    return checkTime;
}


function getDateFormated(date) {
  var month = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
    date = new Date(date);
  var _ref = [date.getDate(), month[date.getMonth()], date.getFullYear()],
      dd = _ref[0],
      MM = _ref[1],
      YYYY = _ref[2];
  var resultDate = "".concat(dd < 10 ? 0 : '').concat(dd, "/").concat(MM, "/").concat(YYYY);
    return resultDate;
}


$(document).on("click","#aboutUs",function(){
    aboutus();
});
function appendAboutus() {
  var aboutUsArr = [];
  for(var k=0;k<globalJson.events[0].tabs.length;k++)
  {
    var tabs = globalJson.events[0].tabs[k];
    if (tabs.type == "aboutus") {
            aboutUsArr.push(tabs);
        }
  }
  var _aboutUsArr$ = aboutUsArr[0],
      content = _aboutUsArr$.content,
      title = _aboutUsArr$.title;
  var image = globalJson.appLogo;
    aboutUsContent.innerHTML = content;
}
function appendAboutus2() {
  var aboutUsArr = [];
  var aboutUsContent = document.querySelector(".aboutUsContent2 .aboutUsContent2--content");
  aboutUsContent.innerHTML="";
  for(var k=0;k<globalJson.events[0].tabs.length;k++)
  {
    var tabs = globalJson.events[0].tabs[k];
    if (tabs.type == "aboutus") {
        aboutUsArr.push(tabs);
      }
  }
  if(!aboutUsArr[1])
  {
    $(".aboutUsContent2").hide();
    $(".aboutusLineBreaker").hide();
    return;
  }
  for (var i=1;i<aboutUsArr.length;i++)
  {
    var _aboutUsArr$ = aboutUsArr[i],
    content = _aboutUsArr$.content;
    aboutUsContent.innerHTML += content;
  }
}
$(document).on("click",".navBarResponsiveClick",function(){
  $(".navigation__button").click()
  let linkElement = this.getAttribute("data-link");
  if(linkElement == "abouUs")
  {
    aboutus();
  }
  else if(linkElement == "registerNow")
  {
    register_content();
  }
  else if(linkElement == "alreadyRegistered")
  {
    $(".register-now").click();
  }
});
function appendSpeakers() {
  var speakerArr = [];
  var content = "<h2 class=\"speakers--headerFont\">Speakers<h2>";
  for(var k=0;k<globalJson.events[0].tabs.length;k++)
  {
    var tabs = globalJson.events[0].tabs[k];
    if (tabs.type == "speakersData") {
            speakerArr.push(tabs);
        }
  }
  var items = speakerArr[0].items;
  if(!items)
    if(!items.length)
     $(".speakers--headerFont").hide()
  for(var k=0;k<items.length;k++)
  {
    var speakers = items[k];
    var name = speakers.name,
        company = speakers.company,
        position = speakers.position,
        details = speakers.details,
        image = speakers.image,
        linkedin = speakers.linkedin,
        facebook = speakers.facebook;
        image = image?image:"https://s3.amazonaws.com/webmobi/eventwebsitesingletemplate/user.png";
    if (details) {
      content += "\n             <div class=\"col-xs-12\">&nbsp;\n                         <div class=\"card card--box1\">\n                     <div class=\"card-body\">\n       <p class=\"card-header--text\"><span class=\"speakers--positionFont\"><b>".concat(name, " - ").concat(position, ", ").concat(company, " </b></span></p>\n                           <div class=\"team-thumnail\"><a href=\"").concat(linkedin ? linkedin : facebook, "\" rel=\"noopener noreferrer\" target=\"_blank\"><img caption=\"false\" height=\"200\" src=\"").concat(image, "\" width=\"200\"></a></div>\n                                      <div class=\"team-info\">\n                         <span class=\"team-info--para\"><span class=\"team-info--para--innerText\">").concat(details, "</span></span>\n           </div>\n              </div>\n                 </div>\n             </div>\n             ");
        }
  }
    speakerContent.innerHTML = content;
}
function aboutus(){
  // toggleElements("aboutUs", "tabEls");
  $('html, body').animate({
    scrollTop: $(".aboutUs").offset().top - 100
  }, 2000);
}
function register_content(){
    // headerContent.innerHTML = "";
    // toggleElements("ticketsDisplay", "tabEls");
  if(!ticketsObj.isAvailable)
  {
    window.location.href="registration.html?appName="+appName
  }
  else
  {
   // $(".tabEls").show();
  $('html, body').animate({
    scrollTop: $(".ticketsDisplay").offset().top
  }, 2000);
  }
}

function toggleElements(showElement, hideElement) {
  var displayElement = document.querySelectorAll(".".concat(showElement));
  var hiddenElement = document.querySelectorAll(".".concat(hideElement));
  for(var k=0;k<hiddenElement.length;k++)
  {
    hiddenElement[k].style = 'display:none';
}
  for(var k=0;k<displayElement.length;k++)
  {
        displayElement[k].style = 'display:block';
  }
}

function postErrorPyament(log)
{
  let params = {};
  params.appid = globalJson.appId||"";
  params.userid = "";
  params.deviceType = "web";
  params.deviceId = "";
  params.info = "payment error";
  params.log = JSON.stringify(log);
  params.device_info = "";
  params.device_version = "";
  return new Promise((resolve,reject)=>{
    $.ajax({
      url: global_parameters.url + "api/event/device_log",
      method:"POST",
      cache:false,
      data:params,
      success:function(data)
      {
        resolve(data);
      },
      error:function(error)
      {
        reject(error);
      }
    }
    )
  })
}

function hexToRgbA(hex,alpha){
  var c;
  if(/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)){
      c= hex.substring(1).split('');
      if(c.length== 3){
          c= [c[0], c[0], c[1], c[1], c[2], c[2]];
      }
      c= '0x'+c.join('');
      return 'rgba('+[(c>>16)&255, (c>>8)&255, c&255].join(',')+','+alpha+')';
  }
  throw new Error('Bad Hex');
}




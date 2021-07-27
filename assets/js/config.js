"use strict";

$.urlParam = function(name){
        var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
        if (results == null){
           return null;
        }
        else {
           return decodeURI(results[1]) || 0;
        }
    }
var urlParams =$.urlParam;
var checkAppName = window.location.href.split("/")[window.location.href.split("/").length-1]||"webmobicmo2020";
// var appName = urlParams('appName') == undefined ? "ssapc" : urlParams('appName');
var appName = checkAppName.indexOf("registration.html") == -1?checkAppName:urlParams('appName');
var ticketId = urlParams('ticketId');
var currentHtml = window.location.pathname.split('/').pop();

if(appName == "ssapc" || appName == "ssapcm" || appName == "ssapce" ||appName == "ssapcw")
{
        $(".mailtoLink").text("fvpsa_communications@f2solutions.com");
}


var global_parameters = {};

if(window.location.hostname == "wamfttestpayment.webmobi.com"
|| window.location.hostname == "34.221.101.103")
{
  appName = "newyear2020"
}
if (window.location.hostname == "fvpsa.webmobi.com" || window.location.hostname == "website.webmobi.com") {
        global_parameters.url = "https://api.webmobi.com/";
        global_parameters.stripe_key = "pk_ybTf0JY7xa759xM2ciE2LUh8xYSBn";
} else {
        global_parameters.url = "https://check1.webmobi.in/";
        global_parameters.stripe_key = "pk_test_yZ0K5nrvLCBLOR0ZAIEve83P";
}




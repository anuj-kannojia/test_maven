const express = require('express');
const request = require('request');
var JSSoup = require('jssoup').default;
var phantom = require('phantom');
const Podio = require('podio-js').api;
const url = require('url');
const app = express();
const port = 3000;
var page
var instance

async function fr1() {
   instance = await phantom.create();
   page = await instance.createPage();
}
fr1()
app.use(express.static('public'))

app.get("/scraper/:url/:word", (req, res) => {
    var url;
    var wordto;
    var body_parser = "";
    var all_js = [];
    var all_css = [];
    var whole = [];
    var partial = [];
    var whole_ass = [];
    var partial_ass = [];
    var js_script;
    var link_script;
    var try1 = true
    var accorence = 1
    var contentc
    var status
    var url = req.params.url
    var wordto = req.params.word
    if (!url.includes('http')) {
        url = "http://" + url
    }
    console.log(url)
    console.log(wordto)


    var regex = new RegExp(" " + wordto.trim() + " ", "gi");
    var regex1 = new RegExp(wordto.trim(), "gi");

    console.log("connecting to main site. plz wait")


    async function fr() {

        await page.on('onResourceRequested', function(requestData) {
            console.log('Requesting', requestData.url);
        });

        status = await page.open(url);
        content = await page.property('content');
        body_parser = content; // Print the HTML for the Google homepage.

        var soup = new JSSoup(body_parser);
        //js links collecting
        js_script = soup.findAll('script')
        try {
            for (var f = 0; f <= js_script.length; f++) {
                try {
                    if (js_script[f].attrs.src != undefined) {
                        if (js_script[f].attrs.src[0] == "/") {
                            all_js.push(url + js_script[f].attrs.src)
                        } else {
                            all_js.push(js_script[f].attrs.src)
                        }
                    }
                } catch (e) {}
            }
        } catch (e) {}
        //css links collecting
        link_script = soup.findAll('link')
        try {
            for (var f = 0; f <= link_script.length; f++) {
                try {

                    if (link_script[f].attrs.href != undefined) {
                        if (link_script[f].attrs.href[0] == "/") {
                            all_css.push(url + link_script[f].attrs.href)
                        } else {
                            all_css.push(link_script[f].attrs.href)
                        }
                    }
                } catch (e) {}
            }
        } catch (e) {}
        console.log("totol css or link tag assets files scanned = " + String(all_js.length))
        console.log("totol js or script tag assets files scanned = " + String(all_css.length))
        //matching main body
        try {
            var res4 = body_parser.match(regex);
            var res5 = body_parser.match(regex1);

        } catch (e) {}
        try {
            for (var f1 = 0; f1 < res4.length; f1++) {

                if (res4[f1] != undefined && res4[f1] != null) {
                    whole.push(res4[f1])

                }


            }
        } catch (e) {}
        try {
            for (var f1 = 0; f1 < res5.length; f1++) {

                if (res5[f1] != undefined && res5[f1] != null) {
                    partial.push(res5[f1])

                }


            }
        } catch (e) {}
        //request end
        if (all_css.length == 0 && all_js.length == 0) {
            accorence++
            f2()
        }

        // css assets loop
        var check_css = 0
        try {
            for (var f3 = 0; f3 < all_css.length; f3++) {

                try {
                    request(all_css[f3], function(error, response, body) {

                        check_css++

                        console.log("connecting to css or link tag assets. plz wait" + String(check_css) + "/" + all_css.length)
                        if (body != undefined) {
                            var res = body.match(regex);
                            var res1 = body.match(regex1);
                        }
                        try {
                            for (var f31 = 0; f31 < res.length; f31++) {
                                if (res[f31] != undefined && res[f31] != null) {
                                    whole.push(res[f31])

                                }
                            }
                        } catch (e) {}
                        try {
                            for (var f31 = 0; f31 < res1.length; f31++) {
                                if (res1[f31] != undefined && res1[f31] != null) {
                                    partial.push(res1[f31])

                                }
                            }
                        } catch (e) {}
                        if (check_css == all_css.length) {
                            f2()


                        }
                    });
                } catch (e) {}



            }
        } catch (e) {}

        // js assets loop
        try {
            var check_js = 0
            for (var f4 = 0; f4 < all_js.length; f4++) {
                request(all_js[f4], function(error, response, body) {

                    check_js++
                    console.log("connecting to js or script tag assets. plz wait" + String(check_js) + "/" + all_js.length)
                    if (body != undefined) {
                        var res2 = body.match(regex);
                        var res3 = body.match(regex1);
                    }
                    try {
                        for (var f41 = 0; f41 < res2.length; f41++) {
                            if (res2[f41] != undefined && res2[f41] != null) {
                                whole.push(res2[f41])

                            }
                        }
                    } catch (e) {}
                    try {
                        for (var f41 = 0; f41 < res3.length; f41++) {
                            if (res3[f41] != undefined && res3[f41] != null) {
                                partial.push(res3[f41])

                            }
                        }
                    } catch (e) {}

                    if (check_js == all_js.length) {
                        f2()

                    }
                });


            }
        } catch (e) {}

        //await instance.exit();


    }
    fr();

    function f2() {
        if (try1) {
            if (accorence == 1) {
                accorence++
                return
            }

            console.log("count sent")

            var data = {
                //'whole_count':whole.length,

                'count': partial.length,
                'website': url,
                'keyword': wordto

            }

            try {
                res.send(data)

            } catch (e) {}
        }
    }
});





app.get('/updateES_PtoC', function(req, res) {
	
	var urlObj = url.parse(req.url, true);
    var person_ID = urlObj['query']['person_ID'];
    var eb_score = parseInt(urlObj['query']['eb_score']);
    var notified = urlObj['query']['notified'];
    var app_item_ID = urlObj['query']['app_item_id'];
    var email = urlObj['query']['email'];
    var time_close;
    var utm_source;

	console.log('person_ID '+person_ID+' eb_score '+eb_score+' notified '+ notified+' app_item_ID '+app_item_ID+' email '+email);
  
    if(person_ID) {
   var reqBody = JSON.stringify({
        'custom_fields': [{
            'custom_field_definition_id': 107460,
            'value': eb_score
        }]
    });

    request({
        uri: "https://api.prosperworks.com/developer_api/v1/people/"+person_ID,
        method: "PUT",
        headers: {
            'X-PW-UserEmail': 'bot@convert.com',
            'X-PW-Application': 'developer_api',
            'X-PW-AccessToken': '53d3ba60d1bd6fa3d6756328fa0e40cf',
            'Content-Type': 'application/json'
        },
        body: reqBody
    }, function(error, resp, body) {
        var parse_body = JSON.parse(body);
        //console.log(parse_body);
        console.log("person details", parse_body.status);
        if(parse_body.status!=404){
		var name = parse_body.name;
        var pw_id = parse_body.id;
        var company_ID = parse_body.company_id;
        var custom = parse_body.custom_fields;
        var len = custom.length;
        var time_to_close;
        var utm_source;

        for (var i = 0; i < len; i++) { //for loop starts
            if (custom[i]['custom_field_definition_id'] == 285572) {
                time_to_close = custom[i]['value'];
            }
            if (custom[i]['custom_field_definition_id'] == 289874) {
                utm_source = custom[i]['value'];
            }
        } //for loop ends  

        // Post To Globiflow


        var globi_body = {
            'pw_id': pw_id,
            'name': name,
            'notified': notified,
            'utm_source': utm_source,
            'app_item_id': app_item_ID,
            'score': eb_score,
			'email': email,
            'time_to_close': time_to_close
        };

        request({
            uri: "https://secure.globiflow.com/catch/59t2733y80hrz17",
            method: "POST",
            body: JSON.stringify(globi_body)
        }, function(error1, resp1, body1) {

            if (company_ID != "") {
                // 	Get Company Info
                
                request({
                    uri: "https://api.prosperworks.com/developer_api/v1/companies/" + company_ID,
                    method: "GET",
                    headers: {
                        'X-PW-UserEmail': 'bot@convert.com',
                        'X-PW-Application': 'developer_api',
                        'X-PW-AccessToken': '53d3ba60d1bd6fa3d6756328fa0e40cf',
                        'Content-Type': 'application/json'
                    }
                }, function(error2, resp2, body2) {

                    var parse_body = JSON.parse(body2);
                    //console.log('company details', body2);
                    var status = parse_body.status;

                    console.log('company details status code', status);
                    if(status!=500){
                    var custom_fields = parse_body.custom_fields;
                    var custom_len = custom_fields.length;
                    var company_score;
					
                    for (var i = 0; i < custom_len; i++)
						{ //for loop starts
                        if (custom_fields[i]['custom_field_definition_id'] == 107460)
							{
                            company_score = parseInt(custom_fields[i]['value']);
                             
							}
						} //for loop ends
						console.log(company_score +' < '+ eb_score);
                            if (company_score < eb_score) { // if starts to update company_ID
                                

                                var company_Body = JSON.stringify({
                                    'custom_fields': [{
                                        'custom_field_definition_id': 107460,
                                        'value': ''+eb_score
                                    }]
                                });
                                request({
                                    uri: "https://api.prosperworks.com/developer_api/v1/companies/" + company_ID,
                                    method: "PUT",
                                    headers: {
                                        'X-PW-UserEmail': 'bot@convert.com',
                                        'X-PW-Application': 'developer_api',
                                        'X-PW-AccessToken': '53d3ba60d1bd6fa3d6756328fa0e40cf',
                                        'Content-Type': 'application/json'
                                    },
                                    body: company_Body
                                }, function(error, resp, body) {
									if(error){
										res.json(error);
									
									console('err', error);
									}else{
                                    var parse_body = JSON.parse(body);
                                    res.json({"status":"company EB value updated"});
									}
                                });
                            }else{
								res.json({"status":"company EB value is greater than EB value hence not updated"});
							}
			         } 
                     else{
                        var post_body={
                            "key":"company_notfound",
                            "orignal_body": urlObj
                        };
                        request({
                                uri: "https://secure.globiflow.com/catch/936j88seiz3947z",
                                method: "POST",
                                body: JSON.stringify(post_body)
                        }, function(error, resp, body) {
                            res.json({"status":"company NOT found hence EB value not added"})

                        });
                        
                     }
				
                });

            }
           
        });
    }else{
           var post_body={
                            "key":"person_notfound",
                            "orignal_body": urlObj
                        };
                        request({
                                uri: "https://secure.globiflow.com/catch/936j88seiz3947z", //request to globiflow
                                method: "POST",
                                body: JSON.stringify(post_body)
                        }, function(error, resp, body) {
                             res.json({"status":"person NOT found hence EB value not added"});

                        });
       
    }
    });
}
else{
                                 res.json({"status":"Person Id not provided"});

}
}); //app.get ends


app.get('/get_contributor', function(req, res) {

var urlObj = url.parse(req.url, true);
    var item_ID = urlObj['query']['itemid'];

// get the API id/secret
const clientId = 'convertcom';
const clientSecret = 'NAlP83WEjhohDK02oPSTmBoS0p3WwtQctUDtfkmgSelu7tCnj57SLd2fBJu1iXu6';

// get the app ID and Token for appAuthentication
const appId = '21017096';
const appToken = '97ee57d741454858a7292c33cbf55913';

// instantiate the SDK
const podio = new Podio({
    authType: 'app',
    clientId: clientId,
    clientSecret: clientSecret
});

var highest_contrib;
var lowest_contrib;
var first_comment;
var second_comment;
var contrib_f_nf;
var single_field;
var get_val;
var field_Values = {};
var sort_arr = [];
var fields_EB = ["bof-stage", "acuity-scheduling", "intercom-conversations", "livechat-scripts", "ticket-update", "webinar-seen", "find-ab-testing", "ab-testing-disqualify", "intercom-reply", "very-active-trial", "signal-visitors", "briteverify", "mattermark-traffic", "agency", "intercom-sessions", "tested-visitors", "project-started", "linkedin", "trackers", "location", "conversation", "free-trial", "title-2", "demo-booked", "opened-campaign", "phone-call-note", "wrote-to-convert", "active", "collaborator-invitee", "collaborator-invited", "company-2-person", "company-bonus", "manual-point"];
var fields_label_EB = {
    "bof-stage": "BoF Stage",
    "acuity-scheduling": "Acuity Scheduling",
    "intercom-conversations": "Intercom Conversations",
    "livechat-scripts": "LiveChat Scripts",
    "ticket-update": "Ticket Update",
    "webinar-seen": "Webinar Seen",
    "find-ab-testing": "Find A/B Testing",
    "ab-testing-disqualify": "A/B Testing Disqualify",
    "intercom-reply": "Intercom Reply",
    "very-active-trial": "Very Active Trial",
    "signal-visitors": "Signal Visitors",
    "briteverify": "BriteVerify",
    "mattermark-traffic": "MatterMark Traffic",
    "agency": "Agency",
    "intercom-sessions": "Intercom Sessions",
    "tested-visitors": "Tested Visitors",
    "project-started": "Project Started",
    "linkedin": "Linkedin",
    "trackers": "Trackers",
    "location": "Location",
    "conversation": "Conversation",
    "free-trial": "Free Trial",
    "title-2": "Title",
    "demo-booked": "Demo Booked",
    "opened-campaign": "Opened Campaign",
    "phone-call-note": "Phone Call Note",
    "wrote-to-convert": "Wrote to Convert",
    "active": "Active",
    "collaborator-invitee": "Collaborator Inviter",
    "collaborator-invited": "Collaborator Invited",
    "company-2-person": "Company (>=2 Person)",
    "company-bonus": "Company (Bonus)",
    "manual-point": "Manual Point"
};
var total = fields_EB.length;
podio.authenticateWithApp(appId, appToken, (err) => {

    if (err) throw new Error(err);

    podio.isAuthenticated().then(() => {
        // Ready to make API calls in here...

        function pf(n) {
            if (n < total) {

                single_field = fields_EB[n];
                podio.request('GET', '/item/'+item_ID+'/value/' + single_field + '/v2').then(async function(responseData) {
                    var x = responseData.values;
                    get_val = parseInt(Math.trunc(x));
                    field_Values[single_field] = get_val;

                    await pf(n + 1);

                });

            } else {

                function sortProperties(obj) {
                    // convert object into array
                    var sortable = [];
                    for (var key in obj)
                        if (obj.hasOwnProperty(key))
                            sortable.push([key, obj[key]]); // each item is an array in format [key, value]

                    // sort items by value
                    sortable.sort(function(a, b) {
                        return a[1] - b[1]; // compare numbers
                    });
                    return sortable; // array in format [ [ key1, val1 ], [ key2, val2 ], ... ]
                }
                var sortedValues = sortProperties(field_Values);
                var highest_contrib_Value = sortedValues[32][1];
                var highest_contrib_name = sortedValues[32][0];
                var lowest_contrib_Value = sortedValues[31][1];
                var lowest_contrib_name = sortedValues[31][0];
                var highest_contrib_Label = fields_label_EB[highest_contrib_name];
                var lowest_contrib_Label = fields_label_EB[lowest_contrib_name];
                var first_comment = "First Contributor details whose external id is " + highest_contrib_name + " and value is " + highest_contrib_Value + " and label is: " + highest_contrib_Label;
                var second_comment = "Second Contributor details whose external id is " + lowest_contrib_name + " and value is " + lowest_contrib_Value + " and label is: " + lowest_contrib_Label;
                if (highest_contrib_Value == 0 && lowest_contrib_Value == 0) {
                    var requestData = {'contributor-f-or-nf': "Contributor Not Found"};
                    podio.request('PUT', '/item/'+item_ID+'/value', requestData).then(function(responseData) {
                        // response, if available
                    });
                }
                if (highest_contrib_Value != 0 || lowest_contrib_Value != 0) {
                    var requestData = {
                        'second-item': second_comment,
                        'first-item': first_comment,
                        'highest-contributor': highest_contrib_Label,
                        'lowest-contributor': lowest_contrib_Label,
                        'contributor-f-or-nf': "Contributor Found"
                    };

                    podio.request('PUT', '/item/'+item_ID+'/value', requestData).then(function(responseData) {
                        // response, if available
                    });
                }
            } //else body ends
        }; //function pf() ends


        pf(0);

    }).catch(err => console.log(err));

    });

});

app.listen(port);
var express = require('express');
var router = express.Router();
var request = require('request');
var cheerio = require('cheerio');
const scrapeIt = require("scrape-it");
var tabletojson = require('tabletojson');

router.post('/get-hs-scores', (req, res) => {

    var theUrl = "http://tourneymachine.com/Public/Results/Division.aspx?IDTournament=h20171018142428327245ada17a12c44&IDDivision=h201710181438463598c0556dae69544";
    //const url = "https://scores.newsday.com/sports/highschool/scores/lacrosse-boys/suffolk";
    
    const url = req.body.url;
    var options = {
        url : url, 
        headers: {
           'Host': 'scores.newsday.com',
           'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.4 Safari/605.1.15'
        }
    };
    console.log("hell", options)
    request(options, (error, response, body) => {
        //console.log(body);
        //res.send(body);
        let $ = cheerio.load(body);
        var theScores = [];

        $('.tabContent').each(function() {
            console.log("hello");
			console.log($(this).prev().prev().find('b').html());
			if($(this).prev().prev().find('b').html() != "Non-conference") {
                if($(this).attr('style') == "display: block;") {
                    var scores = [];
                    $(this).children().each(function(i) {
                        if(!$(this).is('p')){
                            //console.log(sendTheScoresPerTable(this));
                            scores.push(sendTheScoresPerTable(this));
                        }
                        else {
                            scores = [];
                            theScores.push({
                            date: $(this).html(), 
                                scores: scores
                            });
                        }
                    })
                }
            }
        })
        function sendTheScoresPerTable(element) {
            var theScores = [];
            $(element).find('tbody').each(function(){
                var theObj = {};
                $(this).find('th').each(function(i) {
                    if(i == 0){
                        theObj.key = $(this).html().trim().replace(/[.()]/g, "");
                    }else {
                        theObj.value = $(this).html().trim();
                        theScores.push(theObj);
                        theObj = {};
                    }
                })
                $(this).find('td').each(function(j) {
                    if(j == 0){
                        theObj.key = $(this).html().trim().replace(/[.()]/g, "");
                    }else if(j == 1){
                        theObj.value = $(this).html().trim();
                        theScores.push(theObj);
                        theObj = {};
                    }else if(j == 2){
                        theObj.key = $(this).html().trim().replace(/[.()]/g, "");
                    }else {
                        theObj.value = $(this).html().trim();
                        theScores.push(theObj);
                        theObj = {};
                    }
                })
            })
            return theScores;
        }

        //check for the duplicate dates
        var theNewScores = [];
        var dates = []
        theScores.forEach(score => {
            if(!dates.includes(score.date)){
                dates.push(score.date);
            }
        })

        dates.forEach(d => {
            var scores = [];
            theScores.forEach(s => {
                if(d == s.date) {
                    scores = scores.concat(s.scores);
                }
            })
            theNewScores.push({
                date: d,
                scores
            })
        });
        let xyz = [
            {
                "date": "Monday Apr 04",
                "scores": [
                    [
                        {
                            "key": "<a href=\"/sports/highschool/game/lacrosse-boys/8252\">View game stats &#xBB;</a>",
                            "value": "F"
                        },
                        {
                            "key": "<a href=\"/sports/highschool/team/lacrosse-boys/riverhead\">Riverhead</a>",
                            "value": "6"
                        },
                        {
                            "key": "<a href=\"/sports/highschool/team/lacrosse-boys/southampton-east-hampton-pierson\">South Fork</a>",
                            "value": "10"
                        }
                    ],
                    [
                        {
                            "key": "<a href=\"/sports/highschool/game/lacrosse-boys/8219\">View game stats &#xBB;</a>",
                            "value": "F"
                        },
                        {
                            "key": "<a href=\"/sports/highschool/team/lacrosse-boys/bay-shore\">Bay Shore</a>",
                            "value": "9"
                        },
                        {
                            "key": "<a href=\"/sports/highschool/team/lacrosse-boys/commack\">Commack</a>",
                            "value": "12"
                        }
                    ],
                    [
                        {
                            "key": "<a href=\"/sports/highschool/game/lacrosse-boys/8798\">View game stats &#xBB;</a>",
                            "value": "F"
                        },
                        {
                            "key": "<a href=\"/sports/highschool/team/lacrosse-boys/brentwood\">Brentwood</a>",
                            "value": "0"
                        },
                        {
                            "key": "<a href=\"/sports/highschool/team/lacrosse-boys/sachem-east\">Sachem East</a>",
                            "value": "20"
                        }
                    ],
                    [
                        {
                            "key": "<a href=\"/sports/highschool/game/lacrosse-boys/8331\">View game stats &#xBB;</a>",
                            "value": "F"
                        },
                        {
                            "key": "<a href=\"/sports/highschool/team/lacrosse-boys/north-babylon\">North Babylon</a>",
                            "value": "5"
                        },
                        {
                            "key": "<a href=\"/sports/highschool/team/lacrosse-boys/middle-country\">Middle Country</a>",
                            "value": "18"
                        }
                    ],
                    [
                        {
                            "key": "<a href=\"/sports/highschool/game/lacrosse-boys/8801\">View game stats &#xBB;</a>",
                            "value": "F"
                        },
                        {
                            "key": "<a href=\"/sports/highschool/team/lacrosse-boys/smithtown-east\">Smithtown East</a>",
                            "value": "14"
                        },
                        {
                            "key": "<a href=\"/sports/highschool/team/lacrosse-boys/connetquot\">Connetquot</a>",
                            "value": "13"
                        }
                    ],
                    [
                        {
                            "key": "<a href=\"/sports/highschool/game/lacrosse-boys/8795\">View game stats &#xBB;</a>",
                            "value": "F"
                        },
                        {
                            "key": "<a href=\"/sports/highschool/team/lacrosse-boys/floyd\">Floyd</a>",
                            "value": "2"
                        },
                        {
                            "key": "<a href=\"/sports/highschool/team/lacrosse-boys/sachem-north\">Sachem North</a>",
                            "value": "17"
                        }
                    ],
                    [
                        {
                            "key": "<a href=\"/sports/highschool/game/lacrosse-boys/8804\">View game stats &#xBB;</a>",
                            "value": "F"
                        },
                        {
                            "key": "<a href=\"/sports/highschool/team/lacrosse-boys/half-hollow-hills\">Half Hollow Hills</a>",
                            "value": "8"
                        },
                        {
                            "key": "<a href=\"/sports/highschool/team/lacrosse-boys/ward-melville\">Ward Melville</a>",
                            "value": "7"
                        }
                    ],
                    [
                        {
                            "key": "<a href=\"/sports/highschool/game/lacrosse-boys/8803\">View game stats &#xBB;</a>",
                            "value": "F"
                        },
                        {
                            "key": "<a href=\"/sports/highschool/team/lacrosse-boys/patchogue-medford\">Patchogue-Medford</a>",
                            "value": "11"
                        },
                        {
                            "key": "<a href=\"/sports/highschool/team/lacrosse-boys/whitman\">Whitman</a>",
                            "value": "3"
                        }
                    ],
                    [
                        {
                            "key": "<a href=\"/sports/highschool/game/lacrosse-boys/8362\">View game stats &#xBB;</a>",
                            "value": "F"
                        },
                        {
                            "key": "<a href=\"/sports/highschool/team/lacrosse-boys/lindenhurst\">Lindenhurst</a>",
                            "value": "6"
                        },
                        {
                            "key": "<a href=\"/sports/highschool/team/lacrosse-boys/northport\">Northport</a>",
                            "value": "10"
                        }
                    ]
                ]
            },
            {
                "date": "Friday Apr 01",
                "scores": [
                    [
                        {
                            "key": "<a href=\"/sports/highschool/game/lacrosse-boys/8251\">View game stats &#xBB;</a>",
                            "value": "F"
                        },
                        {
                            "key": "<a href=\"/sports/highschool/team/lacrosse-boys/middle-country\">Middle Country</a>",
                            "value": "16"
                        },
                        {
                            "key": "<a href=\"/sports/highschool/team/lacrosse-boys/riverhead\">Riverhead</a>",
                            "value": "5"
                        }
                    ],
                    [
                        {
                            "key": "<a href=\"/sports/highschool/game/lacrosse-boys/8784\">View game stats &#xBB;</a>",
                            "value": "F"
                        },
                        {
                            "key": "<a href=\"/sports/highschool/team/lacrosse-boys/kings-park\">Kings Park</a>",
                            "value": "10"
                        },
                        {
                            "key": "<a href=\"/sports/highschool/team/lacrosse-boys/harborfields\">Harborfields</a>",
                            "value": "9"
                        }
                    ]
                ]
            },
            {
                "date": "Saturday Apr 02",
                "scores": [
                    [
                        {
                            "key": "<a href=\"/sports/highschool/game/lacrosse-boys/8295\">View game stats &#xBB;</a>",
                            "value": "F"
                        },
                        {
                            "key": "<a href=\"/sports/highschool/team/lacrosse-boys/bellport\">Bellport</a>",
                            "value": "8"
                        },
                        {
                            "key": "<a href=\"/sports/highschool/team/lacrosse-boys/hauppauge\">Hauppauge</a>",
                            "value": "16"
                        }
                    ],
                    [
                        {
                            "key": "<a href=\"/sports/highschool/game/lacrosse-boys/8799\">View game stats &#xBB;</a>",
                            "value": "F"
                        },
                        {
                            "key": "<a href=\"/sports/highschool/team/lacrosse-boys/smithtown-west\">Smithtown West</a>",
                            "value": "9"
                        },
                        {
                            "key": "<a href=\"/sports/highschool/team/lacrosse-boys/shoreham-wading-river\">Shoreham-Wading River</a>",
                            "value": "11"
                        }
                    ],
                    [
                        {
                            "key": "<a href=\"/sports/highschool/game/lacrosse-boys/8793\">View game stats &#xBB;</a>",
                            "value": "F"
                        },
                        {
                            "key": "<a href=\"/sports/highschool/team/lacrosse-boys/eastport-south-manor\">Eastport-South Manor</a>",
                            "value": "13"
                        },
                        {
                            "key": "<a href=\"/sports/highschool/team/lacrosse-boys/center-moriches\">Center Moriches</a>",
                            "value": "8"
                        }
                    ],
                    [
                        {
                            "key": "<a href=\"/sports/highschool/game/lacrosse-boys/8235\">View game stats &#xBB;</a>",
                            "value": "F"
                        },
                        {
                            "key": "<a href=\"/sports/highschool/team/lacrosse-boys/deer-park\">Deer Park</a>",
                            "value": "2"
                        },
                        {
                            "key": "<a href=\"/sports/highschool/team/lacrosse-boys/east-islip\">East Islip</a>",
                            "value": "15"
                        }
                    ],
                    [
                        {
                            "key": "<a href=\"/sports/highschool/game/lacrosse-boys/9369\">View game stats &#xBB;</a>",
                            "value": "F"
                        },
                        {
                            "key": "<a href=\"/sports/highschool/team/lacrosse-boys/mattituck-greenport-southold\">Mattituck / Greenport / Southold</a>",
                            "value": "4"
                        },
                        {
                            "key": "<a href=\"/sports/highschool/team/lacrosse-boys/westhampton\">Westhampton</a>",
                            "value": "12"
                        }
                    ],
                    [
                        {
                            "key": "<a href=\"/sports/highschool/game/lacrosse-boys/8794\">View game stats &#xBB;</a>",
                            "value": "F"
                        },
                        {
                            "key": "<a href=\"/sports/highschool/team/lacrosse-boys/miller-place\">Miller Place</a>",
                            "value": "9"
                        },
                        {
                            "key": "<a href=\"/sports/highschool/team/lacrosse-boys/bayport-blue-point\">Bayport-Blue Point</a>",
                            "value": "14"
                        }
                    ],
                    [
                        {
                            "key": "<a href=\"/sports/highschool/game/lacrosse-boys/8792\">View game stats &#xBB;</a>",
                            "value": "F"
                        },
                        {
                            "key": "<a href=\"/sports/highschool/team/lacrosse-boys/sayville\">Sayville</a>",
                            "value": "14"
                        },
                        {
                            "key": "<a href=\"/sports/highschool/team/lacrosse-boys/west-babylon\">West Babylon</a>",
                            "value": "5"
                        }
                    ],
                    [
                        {
                            "key": "<a href=\"/sports/highschool/game/lacrosse-boys/8791\">View game stats &#xBB;</a>",
                            "value": "F"
                        },
                        {
                            "key": "<a href=\"/sports/highschool/team/lacrosse-boys/babylon\">Babylon</a>",
                            "value": "7"
                        },
                        {
                            "key": "<a href=\"/sports/highschool/team/lacrosse-boys/rocky-point\">Rocky Point</a>",
                            "value": "8"
                        }
                    ],
                    [
                        {
                            "key": "<a href=\"/sports/highschool/game/lacrosse-boys/8800\">View game stats &#xBB;</a>",
                            "value": "F"
                        },
                        {
                            "key": "<a href=\"/sports/highschool/team/lacrosse-boys/west-islip\">West Islip</a>",
                            "value": "4"
                        },
                        {
                            "key": "<a href=\"/sports/highschool/team/lacrosse-boys/mt-sinai\">Mt Sinai</a>",
                            "value": "15"
                        }
                    ]
                ]
            }
        ]
        // res.send(theNewScores);
        res.send(xyz);
    })
});

router.post('/get-detailed-score', (req, res) => {
    
    var detailScoreUrl = "https://scores.newsday.com" + req.body.link;

    var options = {
        url : detailScoreUrl, 
        headers: {
            'Host': 'scores.newsday.com',
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.4 Safari/605.1.15'
               }
    };
    request(options, (error, response, body) => {
        let $_$ = cheerio.load(body);
        
        var scoreDetail = [];
        $_$('.tabContent').each(function() {
            var schoolScore = [];
            var schoolName;
            $_$(this).find('tbody').children().each(function(i){
                if(i == 0) {
                    schoolName = $_$(this).find('th:first-child').html();	
                }else {
                    console.log(this);
                    if($_$(this).html().trim() != ""){
                        schoolScore.push({
                            name: $_$(this).find('td:nth-child(1) > a').html(),
                            goals: $_$(this).find('td:nth-child(2)').html(),
                            assists: $_$(this).find('td:nth-child(3)').html(),
                            points: $_$(this).find('td:nth-child(4)').html(),
                            saves: $_$(this).find('td:nth-child(5)').html()
                        })
                    }
                }
            });
            scoreDetail.push({
                schoolName,
                schoolScore
            })
        })
        res.send({pos: req.body.position, scoreDetail});
    })

})
module.exports = router;

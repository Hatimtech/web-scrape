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
                "date": "Tuesday Apr 05",
                "scores": [
                    [
                        {
                            "key": "<a href=\"/sports/highschool/game/lacrosse-girls/8435\">View game stats &#xBB;</a>",
                            "value": "F"
                        },
                        {
                            "key": "<a href=\"/sports/highschool/team/lacrosse-girls/ward-melville\">Ward Melville</a>",
                            "value": "8"
                        },
                        {
                            "key": "<a href=\"/sports/highschool/team/lacrosse-girls/floyd\">Floyd</a>",
                            "value": "5"
                        }
                    ]
                ]
            },
            {
                "date": "Monday Apr 04",
                "scores": [
                    [
                        {
                            "key": "<a href=\"/sports/highschool/game/lacrosse-girls/8056\">View game stats &#xBB;</a>",
                            "value": "F"
                        },
                        {
                            "key": "<a href=\"/sports/highschool/team/lacrosse-girls/smithtown-west\">Smithtown West</a>",
                            "value": "7"
                        },
                        {
                            "key": "<a href=\"/sports/highschool/team/lacrosse-girls/comsewogue\">Comsewogue</a>",
                            "value": "8"
                        }
                    ],
                    [
                        {
                            "key": "<a href=\"/sports/highschool/game/lacrosse-girls/8412\">View game stats &#xBB;</a>",
                            "value": "F"
                        },
                        {
                            "key": "<a href=\"/sports/highschool/team/lacrosse-girls/port-jefferson\">Port Jefferson</a>",
                            "value": "1"
                        },
                        {
                            "key": "<a href=\"/sports/highschool/team/lacrosse-girls/west-islip\">West Islip</a>",
                            "value": "12"
                        }
                    ],
                    [
                        {
                            "key": "<a href=\"/sports/highschool/game/lacrosse-girls/8426\">View game stats &#xBB;</a>",
                            "value": "F"
                        },
                        {
                            "key": "<a href=\"/sports/highschool/team/lacrosse-girls/rocky-point\">Rocky Point</a>",
                            "value": "17"
                        },
                        {
                            "key": "<a href=\"/sports/highschool/team/lacrosse-girls/deer-park\">Deer Park</a>",
                            "value": "3"
                        }
                    ],
                    [
                        {
                            "key": "<a href=\"/sports/highschool/game/lacrosse-girls/8428\">View game stats &#xBB;</a>",
                            "value": "F"
                        },
                        {
                            "key": "<a href=\"/sports/highschool/team/lacrosse-girls/harborfields\">Harborfields</a>",
                            "value": "10"
                        },
                        {
                            "key": "<a href=\"/sports/highschool/team/lacrosse-girls/west-babylon\">West Babylon</a>",
                            "value": "11"
                        }
                    ],
                    [
                        {
                            "key": "<a href=\"/sports/highschool/game/lacrosse-girls/8056\">View game stats &#xBB;</a>",
                            "value": "F"
                        },
                        {
                            "key": "<a href=\"/sports/highschool/team/lacrosse-girls/smithtown-west\">Smithtown West</a>",
                            "value": "7"
                        },
                        {
                            "key": "<a href=\"/sports/highschool/team/lacrosse-girls/comsewogue\">Comsewogue</a>",
                            "value": "8"
                        }
                    ],
                    [
                        {
                            "key": "<a href=\"/sports/highschool/game/lacrosse-girls/8414\">View game stats &#xBB;</a>",
                            "value": "F"
                        },
                        {
                            "key": "<a href=\"/sports/highschool/team/lacrosse-girls/kings-park\">Kings Park</a>",
                            "value": "17"
                        },
                        {
                            "key": "<a href=\"/sports/highschool/team/lacrosse-girls/southampton\">Southampton</a>",
                            "value": "1"
                        }
                    ],
                    [
                        {
                            "key": "<a href=\"/sports/highschool/game/lacrosse-girls/8433\">View game stats &#xBB;</a>",
                            "value": "F"
                        },
                        {
                            "key": "<a href=\"/sports/highschool/team/lacrosse-girls/westhampton\">Westhampton</a>",
                            "value": "13"
                        },
                        {
                            "key": "<a href=\"/sports/highschool/team/lacrosse-girls/hauppauge\">Hauppauge</a>",
                            "value": "4"
                        }
                    ],
                    [
                        {
                            "key": "<a href=\"/sports/highschool/game/lacrosse-girls/8413\">View game stats &#xBB;</a>",
                            "value": "F"
                        },
                        {
                            "key": "<a href=\"/sports/highschool/team/lacrosse-girls/mattituck\">Mattituck</a>",
                            "value": "3"
                        },
                        {
                            "key": "<a href=\"/sports/highschool/team/lacrosse-girls/miller-place\">Miller Place</a>",
                            "value": "11"
                        }
                    ],
                    [
                        {
                            "key": "<a href=\"/sports/highschool/game/lacrosse-girls/8431\">View game stats &#xBB;</a>",
                            "value": "F"
                        },
                        {
                            "key": "<a href=\"/sports/highschool/team/lacrosse-girls/bellport\">Bellport</a>",
                            "value": "2"
                        },
                        {
                            "key": "<a href=\"/sports/highschool/team/lacrosse-girls/east-islip\">East Islip</a>",
                            "value": "9"
                        }
                    ],
                    [
                        {
                            "key": "<a href=\"/sports/highschool/game/lacrosse-girls/8430\">View game stats &#xBB;</a>",
                            "value": "F"
                        },
                        {
                            "key": "<a href=\"/sports/highschool/team/lacrosse-girls/bayport-blue-point\">Bayport-Blue Point</a>",
                            "value": "11"
                        },
                        {
                            "key": "<a href=\"/sports/highschool/team/lacrosse-girls/sayville\">Sayville</a>",
                            "value": "8"
                        }
                    ]
                ]
            },
            {
                "date": "Saturday Apr 02",
                "scores": [
                    [
                        {
                            "key": "<a href=\"/sports/highschool/game/lacrosse-girls/8410\">View game stats &#xBB;</a>",
                            "value": "F"
                        },
                        {
                            "key": "<a href=\"/sports/highschool/team/lacrosse-girls/connetquot\">Connetquot</a>",
                            "value": "6"
                        },
                        {
                            "key": "<a href=\"/sports/highschool/team/lacrosse-girls/smithtown-east\">Smithtown East</a>",
                            "value": "12"
                        }
                    ],
                    [
                        {
                            "key": "<a href=\"/sports/highschool/game/lacrosse-girls/8421\">View game stats &#xBB;</a>",
                            "value": "F"
                        },
                        {
                            "key": "<a href=\"/sports/highschool/team/lacrosse-girls/northport\">Northport</a>",
                            "value": "18"
                        },
                        {
                            "key": "<a href=\"/sports/highschool/team/lacrosse-girls/bay-shore\">Bay Shore</a>",
                            "value": "5"
                        }
                    ],
                    [
                        {
                            "key": "<a href=\"/sports/highschool/game/lacrosse-girls/8420\">View game stats &#xBB;</a>",
                            "value": "F"
                        },
                        {
                            "key": "<a href=\"/sports/highschool/team/lacrosse-girls/sachem-east\">Sachem East</a>",
                            "value": "10"
                        },
                        {
                            "key": "<a href=\"/sports/highschool/team/lacrosse-girls/whitman\">Whitman</a>",
                            "value": "5"
                        }
                    ],
                    [
                        {
                            "key": "<a href=\"/sports/highschool/game/lacrosse-girls/8425\">View game stats &#xBB;</a>",
                            "value": "F"
                        },
                        {
                            "key": "<a href=\"/sports/highschool/team/lacrosse-girls/floyd\">Floyd</a>",
                            "value": "9"
                        },
                        {
                            "key": "<a href=\"/sports/highschool/team/lacrosse-girls/longwood\">Longwood</a>",
                            "value": "1"
                        }
                    ],
                    [
                        {
                            "key": "<a href=\"/sports/highschool/game/lacrosse-girls/8424\">View game stats &#xBB;</a>",
                            "value": "F"
                        },
                        {
                            "key": "<a href=\"/sports/highschool/team/lacrosse-girls/huntington\">Huntington</a>",
                            "value": "12"
                        },
                        {
                            "key": "<a href=\"/sports/highschool/team/lacrosse-girls/half-hollow-hills\">Half Hollow Hills</a>",
                            "value": "8"
                        }
                    ]
                ]
            },
            {
                "date": "Friday Apr 01",
                "scores": [
                    [
                        {
                            "key": "<a href=\"/sports/highschool/game/lacrosse-girls/8055\">View game stats &#xBB;</a>",
                            "value": "F"
                        },
                        {
                            "key": "<a href=\"/sports/highschool/team/lacrosse-girls/sayville\">Sayville</a>",
                            "value": "6"
                        },
                        {
                            "key": "<a href=\"/sports/highschool/team/lacrosse-girls/smithtown-west\">Smithtown West</a>",
                            "value": "5"
                        }
                    ],
                    [
                        {
                            "key": "<a href=\"/sports/highschool/game/lacrosse-girls/8419\">View game stats &#xBB;</a>",
                            "value": "F"
                        },
                        {
                            "key": "<a href=\"/sports/highschool/team/lacrosse-girls/rocky-point\">Rocky Point</a>",
                            "value": "9"
                        },
                        {
                            "key": "<a href=\"/sports/highschool/team/lacrosse-girls/shoreham-wading-river\">Shoreham-Wading River</a>",
                            "value": "11"
                        }
                    ]
                ]
            },
            {
                "date": "Thursday Mar 31",
                "scores": [
                    [
                        {
                            "key": "<a href=\"/sports/highschool/game/lacrosse-girls/8390\">View game stats &#xBB;</a>",
                            "value": "F"
                        },
                        {
                            "key": "<a href=\"/sports/highschool/team/lacrosse-girls/ward-melville\">Ward Melville</a>",
                            "value": "8"
                        },
                        {
                            "key": "<a href=\"/sports/highschool/team/lacrosse-girls/sachem-north\">Sachem North</a>",
                            "value": "1"
                        }
                    ]
                ]
            },
            {
                "date": "Wednesday Mar 30",
                "scores": [
                    [
                        {
                            "key": "<a href=\"/sports/highschool/game/lacrosse-girls/8403\">View game stats &#xBB;</a>",
                            "value": "F"
                        },
                        {
                            "key": "<a href=\"/sports/highschool/team/lacrosse-girls/riverhead\">Riverhead</a>",
                            "value": "8"
                        },
                        {
                            "key": "<a href=\"/sports/highschool/team/lacrosse-girls/longwood\">Longwood</a>",
                            "value": "11"
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

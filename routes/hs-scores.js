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
                            "key": "<a href=\"/sports/highschool/game/lacrosse-girls/8920\">View game stats &#xBB;</a>",
                            "value": "F"
                        },
                        {
                            "key": "<a href=\"/sports/highschool/team/lacrosse-girls/kellenberg\">Kellenberg</a>",
                            "value": "5"
                        },
                        {
                            "key": "<a href=\"/sports/highschool/team/lacrosse-girls/sacred-heart\">Sacred Heart</a>",
                            "value": "9"
                        }
                    ]
                ]
            },
            {
                "date": "Friday Apr 01",
                "scores": [
                    [
                        {
                            "key": "<a href=\"/sports/highschool/game/lacrosse-girls/8716\">View game stats &#xBB;</a>",
                            "value": "F"
                        },
                        {
                            "key": "<a href=\"/sports/highschool/team/lacrosse-girls/st-dominic\">St Dominic</a>",
                            "value": "7"
                        },
                        {
                            "key": "<a href=\"/sports/highschool/team/lacrosse-girls/st-john-the-baptist\">St John the Baptist</a>",
                            "value": "5"
                        }
                    ],
                    [
                        {
                            "key": "<a href=\"/sports/highschool/game/lacrosse-girls/8715\">View game stats &#xBB;</a>",
                            "value": "F"
                        },
                        {
                            "key": "<a href=\"/sports/highschool/team/lacrosse-girls/st-anthony-s\">St Anthony&apos;s</a>",
                            "value": "13"
                        },
                        {
                            "key": "<a href=\"/sports/highschool/team/lacrosse-girls/holy-trinity\">Holy Trinity</a>",
                            "value": "1"
                        }
                    ]
                ]
            },
            {
                "date": "Thursday Mar 31",
                "scores": [
                    [
                        {
                            "key": "<a href=\"/sports/highschool/game/lacrosse-girls/8905\">View game stats &#xBB;</a>",
                            "value": "F"
                        },
                        {
                            "key": "<a href=\"/sports/highschool/team/lacrosse-girls/kellenberg\">Kellenberg</a>",
                            "value": "14"
                        },
                        {
                            "key": "<a href=\"/sports/highschool/team/lacrosse-girls/our-lady-of-mercy\">Our Lady of Mercy</a>",
                            "value": "3"
                        }
                    ],
                    [
                        {
                            "key": "<a href=\"/sports/highschool/game/lacrosse-girls/8906\">View game stats &#xBB;</a>",
                            "value": "F"
                        },
                        {
                            "key": "<a href=\"/sports/highschool/team/lacrosse-girls/long-island-lutheran\">Long Island Lutheran</a>",
                            "value": "4"
                        },
                        {
                            "key": "<a href=\"/sports/highschool/team/lacrosse-girls/stony-brook\">Stony Brook School</a>",
                            "value": "22"
                        }
                    ]
                ]
            },
            {
                "date": "Wednesday Mar 30",
                "scores": [
                    [
                        {
                            "key": "<a href=\"/sports/highschool/game/lacrosse-girls/8714\">View game stats &#xBB;</a>",
                            "value": "F"
                        },
                        {
                            "key": "<a href=\"/sports/highschool/team/lacrosse-girls/st-john-the-baptist\">St John the Baptist</a>",
                            "value": "7"
                        },
                        {
                            "key": "<a href=\"/sports/highschool/team/lacrosse-girls/kellenberg\">Kellenberg</a>",
                            "value": "9"
                        }
                    ]
                ]
            },
            {
                "date": "Monday Mar 28",
                "scores": [
                    [
                        {
                            "key": "<a href=\"/sports/highschool/game/lacrosse-girls/8712\">View game stats &#xBB;</a>",
                            "value": "F"
                        },
                        {
                            "key": "<a href=\"/sports/highschool/team/lacrosse-girls/st-anthony-s\">St Anthony&apos;s</a>",
                            "value": "15"
                        },
                        {
                            "key": "<a href=\"/sports/highschool/team/lacrosse-girls/kellenberg\">Kellenberg</a>",
                            "value": "2"
                        }
                    ]
                ]
            },
            {
                "date": "Wednesday Mar 23",
                "scores": [
                    [
                        {
                            "key": "<a href=\"/sports/highschool/game/lacrosse-girls/8030\">View game stats &#xBB;</a>",
                            "value": "F"
                        },
                        {
                            "key": "<a href=\"/sports/highschool/team/lacrosse-girls/st-dominic\">St Dominic</a>",
                            "value": "7"
                        },
                        {
                            "key": "<a href=\"/sports/highschool/team/lacrosse-girls/sacred-heart\">Sacred Heart</a>",
                            "value": "14"
                        }
                    ],
                    [
                        {
                            "key": "<a href=\"/sports/highschool/game/lacrosse-girls/8028\">View game stats &#xBB;</a>",
                            "value": "F"
                        },
                        {
                            "key": "<a href=\"/sports/highschool/team/lacrosse-girls/kellenberg\">Kellenberg</a>",
                            "value": "15"
                        },
                        {
                            "key": "<a href=\"/sports/highschool/team/lacrosse-girls/holy-trinity\">Holy Trinity</a>",
                            "value": "6"
                        }
                    ]
                ]
            }
        ]
        //  res.send(theNewScores);
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

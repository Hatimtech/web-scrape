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

       
        var outerData = []
        detailedScoreFethingArray = []
        theNewScores.forEach(matches => {
            matches.scores.forEach(score => {
                let rendomId = Math.random().toString(36).slice(6)
                let $_$1 = cheerio.load(score[0].key);
    
                outerData.push({
                    id : rendomId,
                    date : matches.date,
                    url :   $_$1('a[href]').attr('href'),
                    match : {
                           "1" : {
                             name: cheerio.text(cheerio.load(score[1].key)('body')) ?  cheerio.text(cheerio.load(score[1].key)('body')) : score[1].key,
                             score : cheerio.text(cheerio.load(score[1].value)('body')) ?  cheerio.text(cheerio.load(score[1].value)('body')) : score[1].value,
                        },
                        "2" : {
                            name: cheerio.text(cheerio.load(score[2].key)('body')) ?  cheerio.text(cheerio.load(score[2].key)('body')) : score[2].key,
                            score : cheerio.text(cheerio.load(score[2].value)('body')) ?  cheerio.text(cheerio.load(score[2].value)('body')) : score[2].value,
                       }
                  
                        }
                })
               
            })
    
        })
        
         res.send(outerData);
    })
});

router.post('/get-detailed-score', (req, res) => {
    let outerData = req.body.outerData
    var innerData = [] 
    var item = outerData.length
    outerData.forEach(data  => {
        
   
    var detailScoreUrl = "https://scores.newsday.com" + data.url;

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
        innerData.push({ id: data.id ,data : {pos: data.id, scoreDetail}})
        if(item == 1){
            res.send(innerData);

        }else {
            item = item - 1 
        }
    })
});


})
module.exports = router;

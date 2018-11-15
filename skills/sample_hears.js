/*

WHAT IS THIS?

This module demonstrates simple uses of Botkit's `hears` handler functions.

In these examples, Botkit is configured to listen for certain phrases, and then
respond immediately with a single line response.

*/
'use strict';
var wordfilter = require('wordfilter');
var request = require('request');


const {google} = require('googleapis');

// initialize the Youtube API library
const youtube = google.youtube({
  version: 'v3',
  auth: 'AIzaSyDHYtWLKrjDUnn0a7dQ_meLHqfzojVkxdI'
});

// a very simple example of searching for youtube videos
async function runSample (q) {
    const res = await youtube.search.list({
    part: 'id, snippet',
    q: q
    });
    console.log('res.data', res.data.items[0].id.videoId)

    const idVideo = res.data.items[0].id.videoId

    return idVideo
}

const scopes = [
  'https://www.googleapis.com/auth/youtube'
];




let data

function getObject(input, field) {
    var output = [];
    for (var i=0; i < input.length ; ++i)
        output.push(input[i][field]);
    return output;
}
function getLink(input) {
    var arrLinkGirl = []
    for (var i=0; i < input.length; ++i) {
        arrLinkGirl.push(input[i][4].href)
    }
    return arrLinkGirl
}

module.exports = function(controller) {

    /* Collect some very simple runtime stats for use in the uptime/debug command */
    var stats = {
        triggers: 0,
        convos: 0,
    }

    controller.on('heard_trigger', function() {
        stats.triggers++;
    });

    controller.on('conversationStarted', function() {
        stats.convos++;
    });

    controller.hears(['^music (.*)','^music'], 'direct_message,direct_mention', function(bot, message) {
        if (message.match[1]) {

            if (!wordfilter.blacklisted(message.match[1])) {
                const id = runSample(message.match[1])

                id.then(function (response) {
                    return bot.reply(message, 'https://www.youtube.com/watch?v=' + response);
                })
                .catch(function (error) {
                    console.log(error);
                    return bot.reply(message, 'Xin lỗi bạn, nhạc của bạn tìm éo ra');
                })
            } else {
                bot.reply(message, '_sigh_');
            }
        } else {
            bot.reply(message, 'Nhập tên bài hát em mới tìm được chứ anh ^^')
        }
    });


    controller.hears(['^gai'], 'direct_message,direct_mention', function(bot, message) {

        
        request('http://xinhvntop.blogspot.com/feeds/posts/summary?alt=json', function (error, response, body) {
            if (!error && response.statusCode == 200) {
                data = JSON.parse(body)
            }

            const arrLink = getObject(data.feed.entry, 'link')
            const arrLink1 = getLink(arrLink)
            let rand = arrLink1[Math.floor(Math.random() * arrLink1.length)];

            bot.reply(message, rand);
        })
    });


    controller.hears(['^uptime','^debug'], 'direct_message,direct_mention', function(bot, message) {

        bot.createConversation(message, function(err, convo) {
            if (!err) {
                convo.setVar('uptime', formatUptime(process.uptime()));
                convo.setVar('convos', stats.convos);
                convo.setVar('triggers', stats.triggers);

                convo.say('My main process has been online for {{vars.uptime}}. Since booting, I have heard {{vars.triggers}} triggers, and conducted {{vars.convos}} conversations.');
                convo.activate();
            }
        });

    });

    controller.hears(['^say (.*)','^say'], 'direct_message,direct_mention', function(bot, message) {
        if (message.match[1]) {

            if (!wordfilter.blacklisted(message.match[1])) {
                bot.reply(message, message.match[1]);
            } else {
                bot.reply(message, '_sigh_');
            }
        } else {
            bot.reply(message, 'I will repeat whatever you say.')
        }
    });


    /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
    /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
    /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
    /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
    /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
    /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
    /* Utility function to format uptime */
    function formatUptime(uptime) {
        var unit = 'second';
        if (uptime > 60) {
            uptime = uptime / 60;
            unit = 'minute';
        }
        if (uptime > 60) {
            uptime = uptime / 60;
            unit = 'hour';
        }
        if (uptime != 1) {
            unit = unit + 's';
        }

        uptime = parseInt(uptime) + ' ' + unit;
        return uptime;
    }


    controller.hears(['^alo'], 'direct_message,direct_mention', function(bot, message) {

        bot.reply(message, 'Mày gọi ai đấy <@' + message.user + '>? Mày muốn cái quái gì?');
    });
    
    controller.hears(['^a buon'], 'direct_message,direct_mention', function(bot, message) {

        bot.reply(message, 'Đừng buồn nữa anh, <@' + message.user + '>, Có em đây rồi a <3' );
    });

    controller.hears(['^trai'], 'direct_message,direct_mention', function(bot, message) {

        bot.reply(message, 'Xin lỗi, em chỉ biết tìm gái' );
    });

};

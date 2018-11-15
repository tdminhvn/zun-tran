module.exports = function(controller) {

    controller.on('user_channel_join,user_group_join', function(bot, message) {

        bot.reply(message, 'Chào, <@' + message.user + '>, Rất vui khi thấy bạn');

    });

}

var base = 1000;
var increase = 25;

util = {
    urlRE: /https?:\/\/([-\w\.]+)+(:\d+)?(\/([^\s]*(\?\S+)?)?)?/g,
    //  html sanitizer
    toStaticHTML: function(inputHtml) {
        inputHtml = inputHtml.toString();
        return inputHtml.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    },
    //pads n with zeros on the left,
    //digits is minimum length of output
    //zeroPad(3, 5); returns "005"
    //zeroPad(2, 500); returns "500"
    zeroPad: function(digits, n) {
        n = n.toString();
        while(n.length < digits)
            n = '0' + n;
        return n;
    },
    //it is almost 8 o'clock PM here
    //timeString(new Date); returns "19:49"
    timeString: function(date) {
        var minutes = date.getMinutes().toString();
        var hours = date.getHours().toString();
        return this.zeroPad(2, hours) + ":" + this.zeroPad(2, minutes);
    },

    //does the argument only contain whitespace?
    isBlank: function(text) {
        var blank = /^\s*$/;
        return(text.match(blank) !== null);
    }
};

//always view the most recent message when it is added
function scrollDown(base) {
    window.scrollTo(0, base);
    $("#entry").focus();
};

// add message on board
function addMessage(from, target, text, time) {
    var name = (target == '*' ? 'all' : target);
    if(text === null) return;
    if(time == null) {
        // if the time is null or undefined, use the current time.
        time = new Date();
    } else if((time instanceof Date) === false) {
        // if it's a timestamp, interpret it
        time = new Date(time);
    }
    //every message you see is actually a table with 3 cols:
    //  the time,
    //  the person who caused the event,
    //  and the content
    var messageElement = $(document.createElement("table"));
    messageElement.addClass("message");
    // sanitize
    text = util.toStaticHTML(text);
    var content = '<tr>' + '  <td class="date">' + util.timeString(time) + '</td>' + '  <td class="nick">' + util.toStaticHTML(from) + ' says to ' + name + ': ' + '</td>' + '  <td class="msg-text">' + text + '</td>' + '</tr>';
    messageElement.html(content);
    //the log is the stream that we view
    $("#chatHistory").append(messageElement);
    base += increase;
    scrollDown(base);
};


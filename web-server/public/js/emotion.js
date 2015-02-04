/**
 * Created by Coofly on 2014/7/16.
 */
(function () {
	var QxEmotion = function (_emotion_btn, _edit) {
        QxEmotion.Bind(_emotion_btn, _edit);
	};

    QxEmotion.Bind = function (_emotion_btn, _edit) {
        _emotion_btn.on('click', function(){
            var emotion_panel = $('.emotion-panel');
            if(0 == emotion_panel.length) {
                emotion_panel = QxEmotion._CreateEmotionPanel();
                //挂接click事件
                emotion_panel.find('td').on('click', function () {
                    emotion_panel.hide(60);
                    var emotion_name = $(this).children('img').attr('alt');
                    _edit.val(_edit.val() + '[#' + emotion_name + ']');
                    _edit.focus();
                });
                return setTimeout(function () {QxEmotion._ToggleEmotionPanel(emotion_panel, _emotion_btn);}, 100);
            } else {
                QxEmotion._ToggleEmotionPanel(emotion_panel, _emotion_btn);
            }
        });
    };

	QxEmotion.Parse = function (_text) {
		var re_ret;
		var re = new RegExp("[[]#(.+?)]","gm"); //js的正则真TMD操蛋..
		var emotion_name = '';
		var emotion_path = '';
		while(null != (re_ret = re.exec(_text))){
			emotion_name = re_ret[1];
			if(undefined != QxEmotion.data[emotion_name]){
				emotion_path = QxEmotion.path + QxEmotion.data[emotion_name];
                //_text = _text.replace(re_ret[0], '<img src="' + emotion_path + '" atl="' + emotion_name + '">');
				_text = _text.replace(re_ret[0], '<img src="' + emotion_path + '" atl="' + emotion_name + '" + height="' + 24 + '" + width= "'  + 24  + '">');
			}
		}
		return _text;
	};

//	QxEmotion.path = '/image/qqface/';
//    QxEmotion.path = '/image/face/png/';
    QxEmotion.path = '/image/face/v2/';

	QxEmotion.data = {

        '微笑':'p000.gif',
        '撇嘴':'p001.gif',
        '色':'p002.gif',
        '发呆':'p003.gif',
        '得意':'p004.gif',
        '流泪':'p005.gif',
        '害羞':'p006.gif',
        '住嘴':'p007.gif',
        '睡':'p008.gif',
        '大哭':'p009.gif',

        '尴尬':'p010.gif',
        '生气':'p011.gif',
        '调皮':'p012.gif',
        '呲牙':'p013.gif',
        '惊讶':'p014.gif',
        '难过':'p015.gif',
        '酷':'p016.gif',
        '冷汗':'p017.gif',
        '淘气':'p018.gif',
        '吐':'p019.gif',

        '偷笑':'p020.gif',
        '可爱':'p021.gif',
        '白眼':'p022.gif',
        '傲慢':'p023.gif',
        '舔':'p024.gif',
        '困':'p025.gif',
        '惊恐':'p026.gif',
        '汗':'p027.gif',
        '大笑':'p028.gif',
        '大兵':'p029.gif',

        '奋斗':'p030.gif',
        '咒骂':'p031.gif',
        '疑问':'p032.gif',
        '嘘':'p033.gif',
        '晕':'p034.gif',
        '折磨':'p035.gif',
        '囧':'p036.gif',
        '骷髅':'p037.gif',
        '敲打':'p038.gif',
        '拜拜':'p039.gif',

        '擦汗':'p040.gif',
        '抠鼻':'p041.gif',
        '高兴':'p042.gif',
        '糗大了':'p043.gif',
        '窃笑':'p044.gif',
        '左哼哼':'p045.gif',
        '右哼哼':'p046.gif',
        '哈欠':'p047.gif',
        '鄙视':'p048.gif',
        '委屈':'p049.gif',

        '快哭了':'p050.gif',
        '阴险':'p051.gif',
        '亲亲':'p052.gif',
        '吓':'p053.gif',
        '可怜':'p054.gif',
        '菜刀':'p055.gif',
        '咖啡':'p056.gif',
        '吃饭':'p057.gif',
        '猪头':'p058.gif',
        '吻':'p059.gif',
        //////////////////////////////////
        '爱心':'p060.gif',
        '心碎':'p061.gif',
        '闪电':'p062.gif',
        '炸弹':'p063.gif',
        '便便':'p064.gif',
        '月亮':'p065.gif',
        '太阳':'p066.gif',
        '拥抱':'p067.gif',
        '给力':'p068.gif',
        '不给力':'p069.gif',

        '握手':'p070.gif',
        '胜利':'p071.gif',
        '抱拳':'p072.gif',
        '勾引':'p073.gif',
        '拳头':'p074.gif',
        '差劲':'p075.gif',
        '爱你':'p076.gif',
        'NO':'p077.gif',
        'OK':'p078.gif',
        '双喜':'p079.gif',

        '发财':'p080.gif',
        '喝彩':'p081.gif',
        '祈祷':'p082.gif',
        '爆筋':'p083.gif',
        '飞机':'p084.gif',
        '开车':'p085.gif',
        '熊猫':'p086.gif',
        '打伞':'p087.gif',
        '纸巾':'p088.gif',
        '药':'p089.gif'


//		'微笑' : '36.gif',
//		'亲亲' : '3.gif',
//		'流泪' : '41.gif',
//		'调皮' : '44.gif',
//		'阴险' : '40.gif',
//		'大笑' : '85.gif',
//		'晕倒' : '96.gif',
//		'白眼' : '80.gif',
//		'脸红' : '75.gif',
//		'妩媚' : '15.gif',
//		'疑问' : '1.gif',
//		'尴尬' : '4.gif',
//		'啤酒' : '5.gif',
//		'吃饭' : '6.gif',
//		'灯泡' : '7.gif',
//		'困' : '8.gif',
//		'抓狂' : '9.gif',
//		'奋斗' : '10.gif',
//		'ok' : '11.gif',
//		'折磨' : '12.gif',
//		'委屈' : '13.gif',
//		'嘘' : '14.gif',
//		'刀' : '16.gif',
//		'饥饿' : '17.gif',
//		'闭嘴' : '18.gif',
//		'爱你' : '19.gif',
//		'口罩' : '20.gif',
//		'猪头' : '21.gif',
//		'难过' : '22.gif',
//		'鄙视' : '23.gif',
//		'蛋糕' : '24.gif',
//		'哈欠' : '25.gif'
	};




	QxEmotion._CreateEmotionPanel = function () {
		//创建panel
		var emotion_html = '<div class="panel panel-default emotion-panel">' +
			'<div class="panel-body"><table class="table-condensed table-bordered"><tbody>';
		var column_count = 0;
		for(var emotion_name in QxEmotion.data){
			//创建tr
			if(column_count == 0) {
				emotion_html += '<tr>';
			}
			//生成img
			var path = QxEmotion.path + QxEmotion.data[emotion_name];
			emotion_html += '<td><img src="'+ path + '" alt="' + emotion_name + '" + height="' + 24 + '" + width= "'  + 24  +  '"></td>';
			column_count++;
			//闭合tr
			if(column_count == 8){ //这里可以设定列数
				emotion_html += '</tr>';
				column_count = 0;
			}
		}
		//闭合panel
		emotion_html += '</tbody></table></div></div>';
		$('body').append(emotion_html);

		return $('.emotion-panel');
	};

    QxEmotion._ToggleEmotionPanel = function (_emotion_panel, _emotion_btn) {
        if (_emotion_panel.is(':visible')) {
            _emotion_panel.hide(60);
        } else {
            _emotion_panel.css("left", _emotion_btn.offset().left);
            _emotion_panel.css("top", _emotion_btn.offset().top - _emotion_panel.height() - 5);
            _emotion_panel.show(60);
        }
    };

	window.QxEmotion = QxEmotion;
})();




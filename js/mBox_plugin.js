(function($, window, document, undefined) {
	var defualts = {

	}

	var musicBox = function(elements, options) {
		this.$element = elements;
		this.settings = $.extend(true, options, defualts);
	}
	musicBox.prototype = {
		init: function() {
			var that = this;
			return that.$element.each(function() {
				that.getStart($(this))
			})
		},
		getStart: function(elem) {
			var that = this;
			that.active(elem);
			that.mBoxControl(elem);
			that.mList(elem);
			that.mAudio();

		},
		active: function(elem) {
			var that = this;
			var id = elem[0].id;
			var oBox = document.getElementById(id);
			var y = -60;
			var x = 45;
			var ra = 60;

			function int() {

				oBox.style.transform = 'perspective(800px) rotateX(' + ra + 'deg) rotateY(' + ra + 'deg)';
				ra++
			}
			var setint = setInterval(int, 10);
			oBox.onmousedown = function(ev) {
				var oEvent = ev || event;
				var disX = oEvent.clientX - y;
				var disY = oEvent.clientY - x;

				document.onmousemove = function(ev) {
					var active = 1;
					var oEvent = ev || event;
					x = oEvent.clientY - disY;
					y = oEvent.clientX - disX;
					oBox.style.transform = 'perspective(800px) rotateX(' + x + 'deg) rotateY(' + y + 'deg)';
					//that.interval(oBox,active);
					clearInterval(setint);
				};
				document.onmouseup = function() {
					var active = 0;
					document.onmousemove = null;
					document.onmouseup = null;
					setint = setInterval(int, 10);
				};
				return false;
			};

		},
		//歌曲控制:上一首下一首控制；
		mBoxControl: function() {
			var that = this;
			var srcArr = that.settings.mSrc;
			var imgArr = that.settings.mImg;
			function next() {
				var name = $('.mBox_audio').attr("src");
				var li = $(".mBox_li");
				for(var i = 0; i < srcArr.length-1; i++) {
					if(srcArr[i] == name) {
						$('.mBox_background').css('background-image', 'url(' + imgArr[i + 1] + ')')
						$(".mBox_audio").attr('src', srcArr[i + 1]);
						$('.mBox_audio').attr("autoplay", "autoplay");
						that.mLoad()
					}
				}
				var listName = name.split("/")[1];
				for(var i = 0; i < li.length-1; i++) {
					if($(li[i]).text() == listName) {
						$(li).css('color', '#000000');
						$(li[i + 1]).css('color', 'red');

					}
				}
			}
			$(".mBox_next").click(function() {
				next();
			});
			$(".mBox_prev").click(function() {
				var name = $('.mBox_audio').attr("src");
				var li = $(".mBox_li");
				for(var i = 1; i < srcArr.length; i++) {
						if(srcArr[i] == name) {
							$('.mBox_background').css('background-image', 'url(' + imgArr[i - 1] + ')')
							$(".mBox_audio").attr('src', srcArr[i - 1]);
							$('.mBox_audio').attr("autoplay", "autoplay");
							that.mLoad()
						}
					}
					var listName = name.split("/")[1];
					for(var i = 1; i < li.length; i++) {
						if($(li[i]).text() == listName) {
							$(li).css('color', '#000000');
							$(li[i - 1]).css('color', 'red');
						}
					}
				
			});
			$(".mBox_audio").bind('ended', function() {
				next();
			});
			$('.up_vol').click(function() {

			})

		},
		mList: function() {
			var that = this;
			var srcArr = that.settings.mSrc;
			//var mBox = that.settings.mBox;
			var img = that.settings.mImg;
			var mList = $('<ul class="mBox_ul"></ul>');
			for(var i = 0; i < srcArr.length; i++) {
				var name = srcArr[i].split("/")[1];
				mList.append('<li class="mBox_li" data-img=' + img[i] + '>' + name + '</li>')
			}
			$('.music').append(mList);
			var li = $(".mBox_li");
			li.each(function() {
				var img = $(this).attr('data-img')
				var text = $(this).text()
				$(this).click(function() {
					$('.pusCon').html("<img src='images/stop.svg'/>")
					li.css("color", "#000000")
					$(this).css('color', "red")
					$('.mBox_background').css('background-image', 'url(' + img + ')')
					$(".mBox_audio").attr('src', 'data/' + text + '');
					$('.mBox_audio').attr("autoplay", "autoplay");
					that.mLoad()
				})
			});
		},
		mAudio: function() {
			var that = this;
			var audio = document.getElementById("mBox_audio");
			var pause = $('.pusCon');
			pause.click(function() {
				if(audio.paused) {
					audio.play();
					pause.html("<img src='images/stop.svg'/>");
					return
				}
				audio.pause();
				pause.html("<img src='images/play-button.svg'/>");
			});

		},
		//进度条占比
		mLoad: function() {
			var audio = document.getElementById("mBox_audio");
			var left = $(".mBox_dur").offset().left;
			var vol = $(".u_vol").offset().left;

			function load() {
				var load = (audio.currentTime / audio.duration) * 100;
				load = load + "%";
				var durion = audio.duration.toFixed(0);
				var current = audio.currentTime.toFixed(0)
				durion = Math.floor(durion / 60) + ":" + (durion % 60 / 100).toFixed(2).slice(-2);
				current = Math.floor(current / 60) + ":" + (current % 60 / 100).toFixed(2).slice(-2);
				$('.mBox_durTime').text(durion);
				$('.mBox_curTime').text(current);
				$('.mBox_cur').css("width", load);
			}

			var m_dur = $(".mBox_dur");
			m_dur.on('mousedown', function(event) {
				var x = event.clientX;
				x = x - left;
				$('.mBox_cur').css('width', x)
				var w = $('.mBox_dur').css('width');
				w = parseInt(w);
				var test = (x / w)
				audio.currentTime = test * audio.duration
			});
			$('.u_vol').on('mousedown', function(event) {
				var x = event.clientX || event.x;
				x = x - vol;
				$('.d_vol').css("width", x);
				var w = $('.u_vol').css('width');
				w = parseInt(w);
				var test = (x / w);
				audio.volume = test * 1;
			})
			setInterval(load, 1000);
		}
	}

	$.fn.extend({
		mBox: function(options) {
			new musicBox(this, options).init();
		}
	})

})(jQuery, window, document)
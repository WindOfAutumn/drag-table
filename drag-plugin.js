/*
 *	@author : autumn
 *	@version : 1.2
 *	@desc : 面向对象版本；参数说明：是否允许行列的拖拽，默认都为false; 拖拽行或列时是否让几行或列固定不动，默认无固定行列
 * 	注：此版本的行暂时仅可固定第一行，其他功能尚未实现
 */

;(function($, window, document, undefined) {

	var DragRowCol = function(ele, options) {

		this.$ele = ele;

		this.defaults = {
			"dragcol" : false,
			"dragrow" : false,
			"fixcol" : undefined,
			"fixrow" : undefined
		}

		this.settings = $.extend({}, this.defaults, options);
	};


	DragRowCol.prototype = {

		// 拖动列
		dragColumn : function() {

			let _ele = this.$ele;

			let _fixcol = this.settings.fixcol;

			let $len = _ele.find("th").length;

			let _start;

			if (_fixcol === undefined) {
				_start = 0;
			} else {
				_start = _fixcol + 1;
			}

			_ele.find("th").mousedown(function(_downe) {

				let self = $(this);

				let cur_index = self.index();

				if (cur_index <= _fixcol) {
					return;
				}

				//当前拖动元素的宽、高、顶部及左边距
				let cur_th_width = self.width();
				let cur_th_height = self.height();
				let cur_th_top = self.offset().top;
				let cur_th_left = self.offset().left;
				let cur_th_text = self.html();

				self.html("");

				$("body").append("<div class='temp' id='temp0'></div>");
				
				$("#temp0").css({
					"height" : cur_th_height,
					"line-height" : cur_th_height + "px",
					"top" : cur_th_top
				});

				$("#temp0").html(cur_th_text);

				_ele.find("tr").each(function(i, c) {

					if (i == 0) {
						return true;
					}

					let temp_td = $(c).find("td:eq(" + cur_index + ")");

					let cur_td_top = temp_td.offset().top;
					let cur_td_height = temp_td.height();
					let cur_td_html = temp_td.html();

					temp_td.html("");

					$("body").append("<div class='temp' id='temp" + i + "'></div>");
				
					$("#temp" + i).css({
						"height" : cur_td_height,
						"line-height" : cur_td_height + "px",
						"top" : cur_td_top
					});

					$("#temp" + i).html(cur_td_html);
				});
				
				$(".temp").css({
					"display" : "block",
					"position" : "absolute",
					"border" : "1px solid #aaa",
					"width" : cur_th_width,
					"left" : cur_th_left,
					"background-color" : "#89a",
					"opacity" : "0.7",
					"text-align" : "center"
				});

				//鼠标点击处与单元格的左边距
				var cur_th_padding_left = _downe.pageX - cur_th_left;

				$(document).mousemove(function(_movee) {

					let cur_mouse_left = _movee.pageX;
					let cur_div_left = cur_mouse_left - cur_th_padding_left;
				
					$(".temp").css({
						"left" : cur_div_left
					});

					if (cur_div_left - cur_th_left >= cur_th_width / 2 && cur_index < ($len - 1)) {

						self.before(_ele.find("th:eq(" + (cur_index + 1) + ")").detach().clone(true));

						_ele.find("tr").each(function(i, t) {
							if (i == 0) {return true;}
							$(t).find("td:eq(" + cur_index + ")")
							.before($(t).find("td:eq(" + (cur_index + 1) + ")").detach().clone(true));
						});

						cur_th_left = cur_th_left + cur_th_width;
						cur_index++;
					} else if ((cur_th_left - cur_div_left) >= cur_th_width / 2 && cur_index > _start) {

						self.after(_ele.find("th:eq(" + (cur_index - 1) + ")").detach().clone(true));

						_ele.find("tr").each(function(i, t) {
							if (i == 0) {return true;}
							$(t).find("td:eq(" + cur_index + ")")
							.after($(t).find("td:eq(" + (cur_index - 1) + ")").detach().clone(true));

						});

						cur_th_left = cur_th_left - cur_th_width;
						cur_index--;
					}
				});

				$(document).mouseup(function(_upe) {
		
					self.html($("#temp0").html());

					_ele.find("tr").each(function(i, u) {
						if (i == 0) {return true;}
						$(u).find("td:eq(" + cur_index + ")").html($("#temp" + i).html());
					});

					self.removeAttr("style");

					$(".temp").remove();

					$(document).unbind("mousemove");
					$(document).unbind("mousedown");
					$(document).unbind("mouseup");
				});

			});

		},

		// 拖动行
		dragRow : function() {

			let _ele = this.$ele;

			let trs = _ele.find("tr:gt(0)").each(function(i, t) {

				let cur_index = i;
				let max_index = _ele.find("tr:last").index();

				$(t).find("td:eq(0)").mousedown(function(e) {

					let self = $(this);
					let parent = self.parent();
					let cur_tr_width = parent.width();
					let cur_tr_height = parent.outerHeight(true);
					let cur_tr_left = parent.offset().left;
					let cur_tr_top = parent.offset().top;
					
					$("body").append("<tr id='temp-row'></tr>");

					parent.find("td").each(function(i, t) {

						let cell = $(t);
						let cur_td_width = cell.width();
						let cur_td_height = cell.height();
						let cur_content = cell.html();

						cell.html("");
						cell.css("height", cur_td_height);

						$("#temp-row").append("<td id='tempc" + i + "'></td>");
						$("#tempc" + i).css({
							"margin-top" : "1px",
							"text-align" : "center",
							"border" : "1px #aaa solid",
							"width" : cur_td_width,
							"vertical-align" : "middle",
							"height" : cur_td_height
						});
						$("#tempc" + i).html(cur_content);
					});

					$("#temp-row").css({
						"position" : "absolute",
						"left" : cur_tr_left,
						"top" : cur_tr_top,
						"display" : "block",
						// "margin-left" : "-1px",
						"border" : "1px #aaa solid",
						"background-color" : "#89a",
						"opacity" : "0.7",
						"width" : cur_tr_width,
						"height" : cur_tr_height
					});

					$("#tempc0").css({
						"background-color" : "#89a",
						"opacity" : "0.7"
					});

					let cur_tr_padding_top = e.pageY - cur_tr_top;
					// let curTop = cur_tr_top;

					$(document).mousemove(function(e) {

						let vIndx = (e.pageY - cur_tr_top) / (1.2 * cur_tr_height);

						if (vIndx >= 1 && cur_index < max_index) {
							parent.before(parent.next().detach().clone(true));
							cur_index++;
							cur_tr_top = cur_tr_top + cur_tr_height;
						} else if (vIndx <= -0.27 && cur_index > 0) {
				
							parent.after(parent.prev().detach().clone(true));
							cur_index--;
							cur_tr_top = cur_tr_top - cur_tr_height;
						}

						let rowy = e.pageY - cur_tr_padding_top;
				
						$("#temp-row").css({
							"top" : rowy
						});
					});

					$(document).mouseup(function(e) {

						parent.find("td").each(function(i, c) {
							$(c).html($("#tempc" + i).html());
						});

						$("#temp-row").remove();

						$(document).unbind("mousemove");
						$(document).unbind("mousedown");
						$(document).unbind("mouseup");
					});
				});

			});
			
		}

	}

	$.fn.drag = function(options) {

		var dg = new DragRowCol(this, options);

		if (dg.settings.dragcol){

			dg.dragColumn();

		}

		if (dg.settings.dragrow) {

			dg.dragRow();

		}

	}

})(jQuery, window, document);
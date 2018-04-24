/*
 *	author: 秋
 * 	v 1.1
 */

$.fn.dragRC = function(options) {

	var defaults = {
		"column_class" : "drag-table-column",
		"row_class" : "drag-table-row"
	};

	var settings = $.extend({}, defaults, options);

	//ID字符串
	let _col_selector = "." + settings.column_class;
	let _row_selector = "." + settings.row_class;

	$(_col_selector + " thead th").mousedown(function(e) {

		let self = this;

		var cur_index = $(self).index();
		var $leng = $(_col_selector + " thead").find("th").length;

		if (cur_index == 0) {
			return;
		}

		//当前拖动元素的宽、高、顶部及左边距
		let cur_th_width = $(self).width();
		let cur_th_height = $(self).height();
		
		let cur_th_top = $(self).offset().top;
		let cur_th_left = $(self).offset().left;

		let cur_th_text = $(self).html();

		$(self).html("");

		//将被元素的宽度固定为原始宽度，则否置空后会变形
		// $(self).css({
		// 	"width" : th_width + "px"
		// });

		$("body").append("<div class='temp' id='temp0'></div>");
		
		$("#temp0").css({
			"height" : cur_th_height,
			"line-height" : cur_th_height + "px",
			"top" : cur_th_top
		});

		$("#temp0").html(cur_th_text);

		$(_col_selector + " tbody tr").each(function(i) {

			let temp_td = $("." + settings.column_class + " tbody tr:eq(" + i + ") td:eq(" + cur_index + ")");

			let cur_td_top = temp_td.offset().top;
			let cur_td_height = temp_td.height();
			let cur_td_html = temp_td.html();

			temp_td.html("");

			$("body").append("<div class='temp' id='temp" + (i + 1) + "'></div>");
		
			$("#temp" + (i + 1)).css({
				"height" : cur_td_height,
				"line-height" : cur_td_height + "px",
				"top" : cur_td_top
			});

			$("#temp" + (i + 1)).html(cur_td_html);
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
		var cur_th_padding_left = e.pageX - cur_th_left;

		$(document).mousemove(function(e) {

			let cur_mouse_left = e.pageX;
			let cur_div_left = cur_mouse_left - cur_th_padding_left;
		
			$(".temp").css({
				"left" : cur_div_left
			});

			if (cur_div_left - cur_th_left >= cur_th_width / 2 && cur_index < ($leng - 1)) {

				$(self).before($(_col_selector + " thead th:eq(" + (cur_index + 1) + ")").detach().clone(true));

				$(_col_selector + " tbody tr").each(function(i) {
					$(_col_selector + " tbody tr:eq(" + i + ") td:eq(" + cur_index + ")")
					.before($(_col_selector + " tbody tr:eq(" + i + ") td:eq(" + (cur_index + 1) + ")").detach().clone(true));
				});

				cur_th_left = cur_th_left + cur_th_width;
				cur_index++;
			} else if ((cur_th_left - cur_div_left) >= cur_th_width / 2 && cur_index > 1) {

				$(self).after($(_col_selector + " thead th:eq(" + (cur_index - 1) + ")").detach().clone(true));

				$(_col_selector + " tbody tr").each(function(i) {

					$(_col_selector + " tbody tr:eq(" + i + ") td:eq(" + cur_index + ")")
					.after($(_col_selector + " tbody tr:eq(" + i + ") td:eq(" + (cur_index - 1) + ")").detach().clone(true));

				});

				cur_th_left = cur_th_left - cur_th_width;
				cur_index--;
			}
		});

		$(document).mouseup(function(e) {
		
			$(_col_selector + " thead th:eq(" + cur_index + ")").html($("#temp0").html());

			$(_col_selector + " tbody tr").each(function(i) {
				$(_col_selector + " tbody tr:eq(" + i + ") td:eq(" + cur_index + ")").html($("#temp" + (i + 1)).html());
			});

			$(self).removeAttr("style");

			$(".temp").remove();

			$(document).unbind("mousemove");
			$(document).unbind("mousedown");
			$(document).unbind("mouseup");
		});
	});	


	$(_row_selector + " tbody tr").each(function(i) {

		let hih = $(this).height();
		var curIndex = i;
		var len;

		$(_row_selector + " tbody tr:eq(" + i + ") td:eq(0)").mousedown(function(e) {

			$("body").append("<tr id='temp-row'></tr>");
			let prt = $(this).parent();
			let trwth = prt.width();
			let trhgt = prt.height() - 1;
			let lef = prt.offset().left;
			let ptp = prt.offset().top;

			curIndex = $(this).parent().index();

			$("#temp-row").css({
				"position" : "absolute",
				"left" : lef,
				"top" : ptp,
				"display" : "block",
				"margin-left" : "-1px",
				"border" : "1px #aaa solid",
				"background-color" : "#89a",
				"opacity" : "0.7",
				"width" : trwth,
				"height" : trhgt
			});
			$(_row_selector + " tbody tr:eq(" + curIndex + ") td").each(function(i, t) {
				let wdth = $(t).width();
				let high = $(t).height();
				let cont = $(t).html();
				len = $(_row_selector + " tbody tr").length;

				$(t).html("");
				$(t).css("height", high);

				$("#temp-row").append("<td id='tempc" + i + "'></td>");
				$("#tempc" + i).css({
					"margin-top" : "1px",
					"text-align" : "center",
					"border" : "1px #aaa solid",
					"width" : wdth,
					"vertical-align" : "middle",
					"height" : high
				});
				$("#tempc" + i).html(cont);
			});

			var pdx = e.pageY - ptp;
			var curTop = ptp;
			$(document).mousemove(function(e) {

				var vIndx = (e.pageY - ptp) / (1.2 * hih);
				if (vIndx >= 1 && curIndex < len - 1) {
					$(_row_selector + " tbody tr:eq(" + curIndex + ")").before($(_row_selector + " tbody tr:eq(" + (curIndex + 1) + ")").detach().clone(true));
					curIndex++;
					ptp = ptp + hih;
				} else if (vIndx <= -0.27 && curIndex > 0) {
		
					$(_row_selector + " tbody tr:eq(" + curIndex + ")").after($(_row_selector + " tbody tr:eq(" + (curIndex - 1) + ")").detach().clone(true));
					curIndex--;
					ptp = ptp - hih;
				}

				let rowy = e.pageY - pdx;
		
				$("#temp-row").css({
					"top" : rowy
				});
			});


			$(document).mouseup(function(e) {

				$(_row_selector + " tbody tr:eq(" + curIndex + ") td").each(function(i, c) {
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
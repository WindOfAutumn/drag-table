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

		var index = $(self).index();
		var $leng = $(_col_selector + " thead").find("th").length;

		if (index == 0) {
			return;
		}

		let wd = $(self).width();
		let hg = $(self).height();
		
		let tp = $(self).offset().top;
		let lf = $(self).offset().left;

		let txt = $(self).html();

		$(self).html("");

		$(self).css({
			"width" : wd
		});

		$("body").append("<div class='temp' id='temp0'></div>");
		
		$("#temp0").css({
			"height" : hg,
			"line-height" : hg + "px",
			"left" : lf,
			"top" : tp
		});

		$("#temp0").html(txt);

		$(_col_selector + " tbody tr").each(function(i) {
			let tt = $("." + settings.column_class + " tbody tr:eq(" + i + ") td:eq(" + index + ")");

			let ttp = tt.offset().top;
			let ttf = tt.offset().left;
			let thg = tt.height();

			let ttxt = tt.html();

			tt.html("");

			$("body").append("<div class='temp' id='temp" + (i + 1) + "'></div>");
		
			$("#temp" + (i + 1)).css({
				"height" : thg,
				"line-height" : thg + "px",
				"top" : ttp,
				"left" : ttf
			});

			$("#temp" + (i + 1)).html(ttxt);
		});
		
		$(".temp").css({
			"display" : "block",
			"position" : "absolute",
			"margin" : "auto",
			"border" : "1px solid #aaa",
			"width" : wd,
			"background-color" : "#89a",
			"opacity" : "0.7",
			"text-align" : "center"
		});

		//鼠标点击处与单元格的左边距
		var padX = e.pageX - lf;

		$(document).mousemove(function(e) {

			let mx = e.pageX;
			let x = mx - padX;
		
			$(".temp").css({
				"left" : x
			});

			let id = _col_selector + " thead th:eq(" + index + ")";
			let wdx = $(id).width();
			let lfx = $(id).offset().left;

			if (x >= (lfx + wdx / 2) && index < ($leng - 1)) {

				$(id).before($(_col_selector + " thead th:eq(" + (index + 1) + ")").clone(true));
				$(_col_selector + " thead th:eq(" + (index + 2) + ")").remove();

				$(_col_selector + " tbody tr").each(function(i) {
					$(_col_selector + " tbody tr:eq(" + i + ") td:eq(" + index + ")").before($(_col_selector + " tbody tr:eq(" + i + ") td:eq(" + (index + 1) + ")").clone(true));
					$(_col_selector + " tbody tr:eq(" + i + ") td:eq(" + (index + 2) + ")").remove();
				});

				index++;
			} else if ((lfx - x) >= (wdx / 2) && index > 1) {

				let obj = $(_col_selector + " thead th:eq(" + (index - 1) + ")").clone(true);
				$(_col_selector + " thead th:eq(" + index + ")").after(obj);
				var oo = $(_col_selector + " thead th:eq(" + (index - 1) + ")").remove();

				$(_col_selector + " tbody tr").each(function(i) {
					let ebj = $(_col_selector + " tbody tr:eq(" + i + ") td:eq(" + (index - 1) + ")").clone(true);
					$(_col_selector + " tbody tr:eq(" + i + ") td:eq(" + index + ")").after(ebj);
					$(_col_selector + " tbody tr:eq(" + i + ") td:eq(" + (index - 1) + ")").remove();
				});

				index--;
			}
		});

		$(document).mouseup(function(e) {
		
			$(_col_selector + " thead th:eq(" + index + ")").html($("#temp0").html());

			$(_col_selector + " tbody tr").each(function(i) {
				$(_col_selector + " tbody tr:eq(" + i + ") td:eq(" + index + ")").html($("#temp" + (i + 1)).html());
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
					"border" : "1px green solid",
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
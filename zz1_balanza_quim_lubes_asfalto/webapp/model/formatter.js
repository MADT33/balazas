sap.ui.define([], function () {
	"use strict";
	return {

		formatterColor: function (Estado) {
			var state;
			switch (Estado) {
			case "Pendiente":
				state = "Warning";				
				break;
			case "OK":
				state = "Success";				
				break;
			case "Error":
				state = "Error";
				break;
			default:
				break;
			}
			return state;
		}
		

	};
});
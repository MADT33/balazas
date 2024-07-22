/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"ypf/zz1_balanza_quim_lubes_asfalto/test/unit/AllTests"
	], function () {
		QUnit.start();
	});
});

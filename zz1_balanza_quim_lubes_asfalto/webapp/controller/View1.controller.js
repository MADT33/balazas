sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "ypf/zz1balanzaquimlubesasfalto/services/Services",
    "sap/m/MessageToast",
    "sap/m/MessageBox",
    "sap/ui/model/json/JSONModel",
    'sap/ui/model/Filter',
    "sap/ui/model/FilterOperator",
    "sap/ui/core/Fragment",
    "../model/formatter"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, Services, MessageToast, MessageBox, JSONModel, Filter, FilterOperator, Fragment, formatter) {
        "use strict";

        return Controller.extend("ypf.zz1balanzaquimlubesasfalto.controller.View1", {
            formatter: formatter,
            onInit: function () {

                const oData = {
                    Procesos: [{
                        proceso: "Peso inicial",
                        status: "Pendiente",
                        datos: ""
                    },
                    {
                        proceso: "Peso Final",
                        status: "Pendiente",
                        datos: ""
                    },
                    {
                        proceso: "Cierre de Viaje",
                        status: "Pendiente",
                        datos: ""
                    }

                    ]
                };
                const oModel = new JSONModel(oData.Procesos);
                this.getView().setModel(oModel, "ProcesoLU_AS");

                const Campos = {
                    LoteFlag: {
                        editable: true
                    }
                };
                const oModelLote = new JSONModel(Campos);
                this.getView().setModel(oModelLote, "LoteModel");

                const oModelData = {
                    Procesos2: [{
                        proceso: "Peso inicial",
                        status: "",
                        datos: ""
                    }, {

                        proceso: "IFIX - Enviar a Masico",
                        status: "",
                        datos: ""

                    },
                    {

                        proceso: "IFIX - Consulta despacho Cargadero",
                        status: "",
                        datos: ""
                    },
                    {

                        proceso: "Peso Final",
                        status: "",
                        datos: ""
                    },
                    {

                        proceso: "Cierre de Viaje",
                        status: "",
                        datos: ""
                    }
                    ]
                };
                const oModelCreados = new JSONModel(oModelData.Procesos2);
                this.getView().setModel(oModelCreados, "ProcesoBQ");



            },
            onEnviar: function () {

                var that = this;

                var oModel = this.getOwnerComponent().getModel();


                var num_transporte = this.getView().byId("In1").getValue();

                if (num_transporte == "") {
                    MessageBox.error("Debe ingresar un Numero de Transporte");
                } else {

                    var sPath = "/BalanzaSet";
                    var oFilter = [];
                    oFilter.push(new Filter("Num_Transporte", FilterOperator.EQ, num_transporte));

                    oModel.read(sPath, {
                        filters: oFilter,
                        success: function (oData, oResponse) {
                            var oModelTransporte = oResponse.data.results;

                            const oModelInicial = new JSONModel(oModelTransporte);
                            that.getView().setModel(oModelInicial, "Inicial");
                            var error = oModelTransporte[0].Errores;

                            var Bal_Q = that.getView().getModel("Inicial").oData[0].Bal_Quimica;
                            that.PanelView(Bal_Q, oModelTransporte, error);

                            that.getView().byId("BTNR").setEnabled(true);

                        },
                        error: function (oError) {
                            console.log(oError)
                        }
                    });
                }
            },
            PanelView: function (Bal_Q, oModelTransporte, error) {

                if (error) {
                    MessageBox.error(error);
                    this.getView().byId("Panel_LU_AS").setVisible(false);
                    this.getView().byId("Panel_BQ").setVisible(false);
                    this.getView().byId("PanelTabla").setVisible(false);
                } else {
                    if (Bal_Q == "") {
                        this.getView().byId("Panel_LU_AS").setVisible(true);
                        this.getView().byId("Panel_BQ").setVisible(false);
                        this.getView().byId("PanelTabla").setVisible(true);
                        this.Estado(oModelTransporte);
                    }
                    else {
                        this.getView().byId("Panel_LU_AS").setVisible(false);
                        this.getView().byId("Panel_BQ").setVisible(true);
                        this.getView().byId("PanelTabla").setVisible(true);
                        this.EstadoBQ(oModelTransporte);
                    }
                }
            },
            Estado: function (oModelTransporte) {


                var EstadoPesoInicial = oModelTransporte[0].Estado_Peso_Ini;
                var EstadoPesoFinal = oModelTransporte[0].Estado_Peso_Final;
                var EstadoCierre = oModelTransporte[0].Estado_Cierre;
                var EstadoIFixM = oModelTransporte[0].Estado_Fix_Masico;
                var EstadoIfixD = oModelTransporte[0].Estado_Ifix_Despacho;

                var HabEnvPesoInicial = oModelTransporte[0].HabEnv_Peso_Ini;
                var HabEnvPesoFinal = oModelTransporte[0].HabEnv_Peso_Final;
                var HabCierre = oModelTransporte[0].HabEnv_Cierre;

                var estadoPesoInicial = this.getView().byId("Table_BLU_AS").getItems()[0].mAggregations.cells[2];
                var buttonHabEnvPesoInicial = this.getView().byId("Table_BLU_AS").getItems()[0].mAggregations.cells[3];

                var estadoPesoFinal = this.getView().byId("Table_BLU_AS").getItems()[1].mAggregations.cells[2];
                var buttonHabEnvPesoFinal = this.getView().byId("Table_BLU_AS").getItems()[1].mAggregations.cells[3];

                var estadoCierre = this.getView().byId("Table_BLU_AS").getItems()[2].mAggregations.cells[2];
                var buttonHabEnvCierre = this.getView().byId("Table_BLU_AS").getItems()[2].mAggregations.cells[3];

                buttonHabEnvPesoInicial.setEnabled(true).setType("Emphasized");
                buttonHabEnvPesoFinal.setEnabled(true).setType("Emphasized");
                buttonHabEnvCierre.setEnabled(true).setType("Emphasized");


                for (let index = 0; index < oModelTransporte.length; index++) {

                    switch (EstadoPesoInicial) {
                        case "":
                            estadoPesoInicial.setText("Pendiente");
                            break;
                        case "1 ":
                            estadoPesoInicial.setText("OK");
                            break;
                        case "2 ":
                            estadoPesoInicial.setText("Error");
                            break;
                    }
                };

                switch (EstadoPesoFinal) {
                    case "":
                        estadoPesoFinal.setText("Pendiente");
                        break;
                    case "1 ":
                        estadoPesoFinal.setText("OK");
                        break;
                    case "2 ":
                        estadoPesoFinal.setText("Error");
                        break;
                }
                ;

                switch (EstadoCierre) {
                    case "":
                        estadoCierre.setText("Pendiente");
                        break;
                    case "1 ":
                        estadoCierre.setText("OK");
                        break;
                    case "2 ":
                        estadoCierre.setText("Error");
                        break;
                }


                if (HabEnvPesoInicial == "0 ") {
                    buttonHabEnvPesoInicial.setEnabled(false).setType("Ghost");
                };
                if (HabEnvPesoFinal == "0 ") {
                    buttonHabEnvPesoFinal.setEnabled(false).setType("Ghost");
                };
                if (HabCierre == "0 ") {
                    buttonHabEnvCierre.setEnabled(false).setType("Ghost");
                };

            },

            EstadoBQ: function (oModelTransporte) {

                var EstadoPesoInicial = oModelTransporte[0].Estado_Peso_Ini;

                var EstadoPesoFinal = oModelTransporte[0].Estado_Peso_Final;
                var EstadoCierre = oModelTransporte[0].Estado_Cierre;
                var EstadoIFixM = oModelTransporte[0].Estado_Fix_Masico;
                var EstadoIfixD = oModelTransporte[0].Estado_Ifix_Despacho;

                var HabEnvPesoInicial = oModelTransporte[0].HabEnv_Peso_Ini;
                var HabEnvPesoFinal = oModelTransporte[0].HabEnv_Peso_Final;
                var HabEnvIfixD = oModelTransporte[0].HabEnv_Ifix_Despacho;
                var HabEnvIfixM = oModelTransporte[0].HabEnv_Fix_Masico;
                var HabCierre = oModelTransporte[0].HabEnv_Cierre;

                var estadoPesoInicial = this.getView().byId("Table_BQ").getItems()[0].mAggregations.cells[3];
                var buttonHabEnvPesoInicial = this.getView().byId("Table_BQ").getItems()[0].mAggregations.cells[4];
                var estadoIfixMosico = this.getView().byId("Table_BQ").getItems()[1].mAggregations.cells[3];
                var buttonHabEnviarIfixM = this.getView().byId("Table_BQ").getItems()[1].mAggregations.cells[4];
                var estadoIfixCar = this.getView().byId("Table_BQ").getItems()[2].mAggregations.cells[3];
                var buttonHabEnvIfixCar = this.getView().byId("Table_BQ").getItems()[2].mAggregations.cells[4];
                var estadoPesoFinal = this.getView().byId("Table_BQ").getItems()[3].mAggregations.cells[3];
                var buttonHabEnvPesoFinal = this.getView().byId("Table_BQ").getItems()[3].mAggregations.cells[4];
                var estadoCierre = this.getView().byId("Table_BQ").getItems()[4].mAggregations.cells[3];
                var buttonHabEnvCierre = this.getView().byId("Table_BQ").getItems()[4].mAggregations.cells[4];

                this.getView().byId("Table_BQ").getItems()[1].mAggregations.cells[2].setVisible(true);
                this.getView().byId("Table_BQ").getItems()[2].mAggregations.cells[2].setVisible(true);

                buttonHabEnvPesoInicial.setEnabled(true).setType("Emphasized");
                buttonHabEnviarIfixM.setEnabled(true).setType("Emphasized");
                buttonHabEnvIfixCar.setEnabled(true).setType("Emphasized");
                buttonHabEnvPesoFinal.setEnabled(true).setType("Emphasized");
                buttonHabEnvCierre.setEnabled(true).setType("Emphasized");

                for (let index = 0; index < oModelTransporte.length; index++) {

                    switch (EstadoPesoInicial) {
                        case "":
                            estadoPesoInicial.setText("Pendiente");
                            break;
                        case "1 ":
                            estadoPesoInicial.setText("OK");
                            break;
                        case "2 ":
                            estadoPesoInicial.setText("Error");
                            break;
                    }
                };

                switch (EstadoIFixM) {
                    case "":
                        estadoIfixMosico.setText("Pendiente");
                        break;
                    case "1 ":
                        estadoIfixMosico.setText("OK");
                        break;
                    case "2 ":
                        estadoIfixMosico.setText("Error");
                        break;
                }

                switch (EstadoIfixD) {
                    case "":
                        estadoIfixCar.setText("Pendiente");
                        break;
                    case "1 ":
                        estadoIfixCar.setText("OK");
                        break;
                    case "2 ":
                        estadoIfixCar.setText("Error");
                        break;
                }
                switch (EstadoPesoFinal) {
                    case "":
                        estadoPesoFinal.setText("Pendiente");
                        break;
                    case "1 ":
                        estadoPesoFinal.setText("OK");
                        break;
                    case "2 ":
                        estadoPesoFinal.setText("Error");
                        break;
                }
                ;

                switch (EstadoCierre) {
                    case "":
                        estadoCierre.setText("Pendiente");
                        break;
                    case "1 ":
                        estadoCierre.setText("OK");
                        break;
                    case "2 ":
                        estadoCierre.setText("Error");
                        break;
                };

                if (HabEnvPesoInicial == "0 ") {
                    buttonHabEnvPesoInicial.setEnabled(false).setType("Ghost");
                };
                if (HabEnvPesoFinal == "0 ") {
                    buttonHabEnvPesoFinal.setEnabled(false).setType("Ghost");
                };
                if (HabCierre == "0 ") {
                    buttonHabEnvCierre.setEnabled(false).setType("Ghost");
                };
                if (HabEnvIfixD == "0 ") {
                    buttonHabEnvIfixCar.setEnabled(false).setType("Ghost");
                };
                if (HabEnvIfixM == "0 ") {
                    buttonHabEnviarIfixM.setEnabled(false).setType("Ghost");
                };
            },

            /////////////////////////PANEL - BALANZA QUIMICA //////////////////////////////////////////////
            onPressPanel3: function (oEvent) {


                var Almacen;
                var sPath = oEvent.getSource().getParent().getBindingContextPath();
                var that = this;
                var oModel = this.getOwnerComponent().getModel();

                var Transporte = this.getView().getModel("Inicial").oData[0].Transporte;
                var oFilter = [];

                var Num_Transporte = new sap.ui.model.Filter({
                    path: "Num_Transporte",
                    operator: sap.ui.model.FilterOperator.EQ,
                    value1: Transporte
                });

                oFilter.push(Num_Transporte);

                switch (sPath) {

                    case '/0':
                        this.fragmento = sap.ui.xmlfragment("ypf.zz1balanzaquimlubesasfalto.fragments.cargaManual", this);
                        this.getView().addDependent(this.fragmento);
                        this.fragmento.open();
                        break;
                    case '/1':

                        oModel.read("/BQ_Ifix_InicialSet", {
                            filters: oFilter,
                            success: function (oData, oResponse) {

                                var oModelIfixInicial = oData.results[0];
                                var estadoPesoInicial = that.getView().byId("Table_BQ").getItems()[1].mAggregations.cells[3];
                                var msg = oModelIfixInicial.Msg_Resultado;
                                var buttonHabEnvIfixCar = that.getView().byId("Table_BQ").getItems()[1].mAggregations.cells[4];
                                var btnIfix = oModelIfixInicial.Habilitar_Pasos;

                                if (btnIfix == "0 ") {
                                    buttonHabEnvIfixCar.setEnabled(false).setType("Ghost");
                                };



                                switch (oModelIfixInicial.Status) {
                                    case "1 ":
                                        estadoPesoInicial.setText("OK");
                                        MessageBox.success(msg);
                                        that.CerrarDialogo();

                                        break;
                                    case "2 ":
                                        estadoPesoInicial.setText("Error");
                                        MessageBox.error(msg);
                                        that.CerrarDialogo();
                                        break;
                                };

                            },
                            error: function (oError) {
                                console.log(oError)
                            }
                        });


                        break;
                    case '/2':

                        oModel.read("/BQ_Ifix_FinalSet", {
                            filters: oFilter,
                            success: function (oData, oResponse) {

                                var oModelIfixFinal = oData.results[0];
                                var estadoPesoInicial = that.getView().byId("Table_BQ").getItems()[2].mAggregations.cells[3];
                                var msg = oModelIfixFinal.Msg_Resultado;

                                var buttonHabEnvIfixCar = that.getView().byId("Table_BQ").getItems()[2].mAggregations.cells[4];
                                var btnIfix = oModelIfixFinal.Habilitar_Pasos;

                                if (btnIfix == "0 ") {
                                    buttonHabEnvIfixCar.setEnabled(false).setType("Ghost");
                                };

                                switch (oModelIfixFinal.Status) {
                                    case "1 ":
                                        estadoPesoInicial.setText("OK");
                                        MessageBox.success(msg);
                                        that.CerrarDialogo();

                                        break;
                                    case "2 ":
                                        estadoPesoInicial.setText("Error");
                                        MessageBox.error(msg);
                                        that.CerrarDialogo();
                                        break;
                                };
                            },
                            error: function (oError) {
                                console.log(oError)
                            }
                        });

                        break;

                    case '/3':
                        this.fragmento = sap.ui.xmlfragment("ypf.zz1balanzaquimlubesasfalto.fragments.cargaManualPesoFinal", this);
                        this.getView().addDependent(this.fragmento);
                        this.fragmento.open();

                        break;
                    case '/4':

                        oModel.read("/ConsultaAlmacenSet", {
                            filters: oFilter,
                            success: function (oData, oResponse) {

                                var Almacen = oData.results;
                                const oModelAlmacen = new JSONModel(Almacen);
                                that.getView().setModel(oModelAlmacen, "AlmacenModel");


                                that.openFragmentAlancen();

                            },
                            error: function (oError) {
                                console.log(oError)
                            }
                        });

                        break;
                    default:
                }
            },
            /////////////////////////////OPEN FRAGMENT ALMACEN  ///////////////////////////////////////
            openFragmentAlancen() {

                var that = this;
                var AlmacenModel = this.getView().getModel("AlmacenModel").oData;
                var loteModel = this.getView().getModel("LoteModel");
                var oView = this.getView();

                
                    if (!this.pDialog) {
                      this.pDialog = this.loadFragment({
                        name: "ypf.zz1balanzaquimlubesasfalto.fragments.cargaManualFinalViaje"
                      });
                    }
                    this.pDialog.then(function (oDialog) {
                    //var oColums = sap.ui.getCore().byId("idTable").getItems("cells");
                    var oColums = oDialog.mAggregations.content[0].mAggregations.items[0].mAggregations.items[0].mAggregations.items;
                    var obj = [];

                    for (let i = 0; i < oColums.length; i++) {
                        for (let j = 0; j < AlmacenModel.length; j++) {

                            if (i == j) {
                                var oItems = oColums[i].mAggregations.cells[4];
                                var objItem = {};
                                objItem.objInput = oItems;
                                objItem.flag = AlmacenModel[j];
                                obj.push(objItem);
                            }
                        }
                    };

                    obj.forEach(function (comp, i) {
                        comp.objInput.setEditable(true);

                        if (comp.flag.LoteFlag == "G") {
                            comp.objInput.setEditable(false);
                            comp.objInput.setEnabled(false); 
                                               

                        }
                    })



                      oDialog.open();
                    });
         
            },
            VerPosiciones: function () {

                var that = this;
                var oModel = this.getOwnerComponent().getModel();

                var Transporte = this.getView().getModel("Inicial").oData[0].Transporte;
                var oFilter = [];

                var Num_Transporte = new sap.ui.model.Filter({
                    path: "Num_Transporte",
                    operator: sap.ui.model.FilterOperator.EQ,
                    value1: Transporte
                });

                oFilter.push(Num_Transporte);


                oModel.read("/PosicionesSet", {
                    filters: oFilter,
                    success: function (oData, oResponse) {

                        var oModelPosiciones = oResponse.data.results;
                        const oModelPos = new JSONModel(oModelPosiciones);
                        that.getView().setModel(oModelPos, "PocisionesModel");
                        that.openfragmentPos();

                    },
                    error: function (oError) {
                        console.log(oError)
                    }
                });

            },
            onChangeNumTransporte: function (oEvent) {

                this.getView().byId("Panel_LU_AS").setVisible(false);
                this.getView().byId("Panel_BQ").setVisible(false);
                this.getView().byId("PanelTabla").setVisible(false);

            },
            openfragmentPos: function () {
                this.fragmento = sap.ui.xmlfragment("ypf.zz1balanzaquimlubesasfalto.fragments.Posiciones", this);
                this.getView().addDependent(this.fragmento);
                this.fragmento.open();
            },

            VerPrecintos: function () {
                var that = this;
                var oModel = this.getOwnerComponent().getModel();

                var Transporte = this.getView().getModel("Inicial").oData[0].Transporte;
                var oFilter = [];

                var Num_Transporte = new sap.ui.model.Filter({
                    path: "Num_Transporte",
                    operator: sap.ui.model.FilterOperator.EQ,
                    value1: Transporte
                });

                oFilter.push(Num_Transporte);

                oModel.read("/PrecintosSet", {
                    filters: oFilter,
                    success: function (oData, oResponse) {

                        var oModelPrecintos = oResponse.data.results;
                        const oModelP = new sap.ui.model.json.JSONModel(oModelPrecintos);
                        that.getView().setModel(oModelP, "PrecintoModel");
                        that.openFragment();
                    },
                    error: function (oError) {
                        console.log(oError)
                    }
                });

            },
            openFragment: function () {

                this.fragmento = sap.ui.xmlfragment("ypf.zz1balanzaquimlubesasfalto.fragments.Precintos", this);
                this.getView().addDependent(this.fragmento);
                this.fragmento.open();

            },
            onPressIfix: function (oEvent) {

                var sPath = oEvent.getSource().getParent().getBindingContextPath();

                var that = this;
                var oModel = this.getOwnerComponent().getModel();

                var Transporte = this.getView().getModel("Inicial").oData[0].Transporte;
                var oFilter = [];

                var Num_Transporte = new sap.ui.model.Filter({
                    path: "Num_Transporte",
                    operator: sap.ui.model.FilterOperator.EQ,
                    value1: Transporte
                });
                oFilter.push(Num_Transporte);

                switch (sPath) {
                    case "/1":
                        oModel.read("/TablaIfixMosicoSet", {
                            filters: oFilter,
                            success: function (oData, oResponse) {

                                var oModelIfixMosico = oResponse.data.results;
                                const oModelIfixM = new sap.ui.model.json.JSONModel(oModelIfixMosico);
                                that.getView().setModel(oModelIfixM, "IfixMosicoModel");
                                that.openfragmentIfix(sPath);

                            },
                            error: function (oError) {
                                console.log(oError)
                            }
                        });

                        break;
                    case "/2":

                        oModel.read("/TablaIfixDespachoSet", {
                            filters: oFilter,
                            success: function (oData, oResponse) {

                                var oModelIfixConsulta = oResponse.data.results;
                                const oModelIfixCons = new sap.ui.model.json.JSONModel(oModelIfixConsulta);
                                that.getView().setModel(oModelIfixCons, "IfixConsultaModel");
                                that.openfragmentIfix(sPath);

                            },
                            error: function (oError) {
                                console.log(oError)
                            }
                        });
                        break;
                };


            },

            CerrarDialogoAlmacen: function () {               
                this.byId("helloDialog").close();
            },
            CerrarDialogo: function () {

                this.fragmento.close();
                this.fragmento.destroy(true);

            },
            openfragmentIfix: function (sPath) {

                switch (sPath) {
                    case "/1":
                        this.fragmento = sap.ui.xmlfragment("ypf.zz1balanzaquimlubesasfalto.fragments.ifixMosaico", this);
                        this.getView().addDependent(this.fragmento);
                        this.fragmento.open();

                        break;
                    case "/2":
                        this.fragmento = sap.ui.xmlfragment("ypf.zz1balanzaquimlubesasfalto.fragments.ifixDespacho", this);
                        this.getView().addDependent(this.fragmento);
                        this.fragmento.open();
                        break;
                };
            },
            onEnviarPesadaInicial: function (oEvent) {

                var that = this;
                var oModel = this.getOwnerComponent().getModel();

                var Num_Tranporte = this.getView().getModel("Inicial").oData[0].Transporte;
                var Posicion = sap.ui.getCore().byId("InPos").getValue();
                var Peso = sap.ui.getCore().byId("InPeso").getValue();
                var Unidad = sap.ui.getCore().byId("InUnitMedida").getValue();
                var Balanza = sap.ui.getCore().byId("InBalanza").getValue();
                var ZtipoPesada = "01";

                var oEntry = {
                    Num_Transporte: Num_Tranporte,
                    Posicion: Posicion,
                    Peso: Peso,
                    Unidad_Medida: Unidad,
                    Balanza: Balanza,
                    Tipo_Pesada: ZtipoPesada
                }

                var panelBQ = this.getView().byId("Panel_BQ").getVisible();
                if (panelBQ == true) {

                    oModel.create("/BQ_PesadaInicialSet", oEntry, {
                        method: "POST",
                        success: function (oData, oResponse) {

                            var oModelRes = oResponse.data;
                            var estadoPesoInicial = that.getView().byId("Table_BQ").getItems()[0].mAggregations.cells[3];
                            var buttonHabEnvPesoInicial = that.getView().byId("Table_BQ").getItems()[0].mAggregations.cells[4];
                            var DatoPesoInicial = that.getView().byId("Table_BQ").getItems()[0].mAggregations.cells[1];

                            var buttonHabEnvIFixM = that.getView().byId("Table_BQ").getItems()[1].mAggregations.cells[4];
                            var buttonHabEnvIFixC = that.getView().byId("Table_BQ").getItems()[2].mAggregations.cells[4];
                            var buttonHabEnvCierre = that.getView().byId("Table_BQ").getItems()[3].mAggregations.cells[4];

                            var HabilitarPaso = oModelRes.Habilitar_Pasos;
                            var Peso = oModelRes.Peso;
                            var msg = oModelRes.Msg_Resultado;


                            switch (oModelRes.Status) {
                                case "1 ":
                                    estadoPesoInicial.setText("OK");
                                    MessageBox.success(msg);
                                    that.CerrarDialogo();
                                    buttonHabEnvIFixM.setEnabled(true).setType("Emphasized");
                                    buttonHabEnvIFixC.setEnabled(true).setType("Emphasized");
                                    buttonHabEnvCierre.setEnabled(true).setType("Emphasized");
                                    break;
                                case "2 ":
                                    estadoPesoInicial.setText("Error");
                                    MessageBox.error(msg);
                                    that.CerrarDialogo();
                                    break;
                            };
                            if (HabilitarPaso == "0 ") {
                                buttonHabEnvPesoInicial.setEnabled(false).setType("Ghost");
                            };
                            DatoPesoInicial.setText(Peso);
                        },
                        error: function (e) {
                            alert("error");
                        }
                    });

                } else {

                    oModel.create("/BLYA_Peso_InicialSet", oEntry, {
                        method: "POST",
                        success: function (oData, oResponse) {

                            var oModelRes = oResponse.data;

                            var estadoPesoInicial = that.getView().byId("Table_BLU_AS").getItems()[0].mAggregations.cells[2];
                            var buttonHabEnvPesoInicial = that.getView().byId("Table_BLU_AS").getItems()[0].mAggregations.cells[3];
                            var buttonHabEnvPesoFinal = that.getView().byId("Table_BLU_AS").getItems()[1].mAggregations.cells[3];
                            var DatoPesoInicial = that.getView().byId("Table_BLU_AS").getItems()[0].mAggregations.cells[1];
                            var HabilitarPaso = oModelRes.Habilitar_Pasos;
                            var Peso = oModelRes.Peso;
                            var msg = oModelRes.Msg_Resultado;

                            switch (oModelRes.Status) {
                                case "0 ":
                                    estadoPesoInicial.setText("Pendiente");
                                    break;
                                case "1 ":
                                    estadoPesoInicial.setText("OK");
                                    MessageBox.success(msg);
                                    that.CerrarDialogo();
                                    buttonHabEnvPesoFinal.setEnabled(true).setType("Emphasized");
                                    break;
                                case "2 ":
                                    estadoPesoInicial.setText("Error");
                                    MessageBox.error(msg);
                                    that.CerrarDialogo();
                                    break;
                            };
                            if (HabilitarPaso == "0 ") {
                                buttonHabEnvPesoInicial.setEnabled(false).setType("Ghost");
                            }
                            DatoPesoInicial.setText(Peso);
                        },
                        error: function (e) {
                            alert("error");
                        }
                    });
                }

            },
            onEnviarPesoFinal: function (oEvent) {

                var that = this;
                var oModel = this.getOwnerComponent().getModel();

                var Num_Tranporte = this.getView().getModel("Inicial").oData[0].Transporte;
                var Posicion = sap.ui.getCore().byId("InPos").getValue();
                var Peso = sap.ui.getCore().byId("InPeso").getValue();
                var Unidad = sap.ui.getCore().byId("InUnitMedida").getValue();
                var Balanza = sap.ui.getCore().byId("InBalanza").getValue();
                var ZtipoPesada = "02";

                var oEntry = {
                    Num_Transporte: Num_Tranporte,
                    Posicion: Posicion,
                    Peso: Peso,
                    Unidad_Medida: Unidad,
                    Balanza: Balanza,
                    Tipo_Pesada: ZtipoPesada
                }

                var panelBQ = this.getView().byId("Panel_BQ").getVisible();
                if (panelBQ == true) {

                    oModel.create("/BQ_PesadaFinalSet", oEntry, {
                        method: "POST",
                        success: function (oData, oResponse) {

                            var oModelRes = oResponse.data;

                            var estadoPesoFinal = that.getView().byId("Table_BQ").getItems()[3].mAggregations.cells[3];
                            var buttonHabEnvPesoFinal = that.getView().byId("Table_BQ").getItems()[3].mAggregations.cells[4];
                            var DatoPesoInicial = that.getView().byId("Table_BQ").getItems()[3].mAggregations.cells[1];

                            var buttonHabEnvCierre = that.getView().byId("Table_BQ").getItems()[4].mAggregations.cells[4];

                            var HabilitarPaso = oModelRes.Habilitar_Pasos;
                            var Peso = oModelRes.Peso;
                            var msg = oModelRes.Msg_Resultado;


                            switch (oModelRes.Status) {

                                case "1 ":
                                    estadoPesoFinal.setText("OK");
                                    MessageBox.success(msg);
                                    that.CerrarDialogo();
                                    buttonHabEnvCierre.setEnabled(true).setType("Emphasized");
                                    break;
                                case "2 ":
                                    estadoPesoFinal.setText("Error");
                                    MessageBox.error(msg);
                                    that.CerrarDialogo();
                                    break;
                            };
                            if (HabilitarPaso == "0 ") {
                                buttonHabEnvPesoFinal.setEnabled(false).setType("Ghost");
                            };
                            DatoPesoInicial.setText(Peso);

                        },
                        error: function (e) {
                            alert("error");
                        }
                    });



                } else {

                    oModel.create("/BLYA_Peso_FinalSet", oEntry, {
                        method: "POST",
                        success: function (oData, oResponse) {

                            var oModelRes = oResponse.data;

                            var estadoPesoFinal = that.getView().byId("Table_BLU_AS").getItems()[1].mAggregations.cells[2];
                            var buttonHabEnvPesoFinal = that.getView().byId("Table_BLU_AS").getItems()[1].mAggregations.cells[3];
                            var DatoPesoInicial = that.getView().byId("Table_BLU_AS").getItems()[1].mAggregations.cells[1];
                            var buttonHabEnvCierre = that.getView().byId("Table_BLU_AS").getItems()[2].mAggregations.cells[3];

                            var HabilitarPaso = oModelRes.Habilitar_Pasos;
                            var Peso = oModelRes.Peso;
                            var msg = oModelRes.Msg_Resultado;


                            switch (oModelRes.Status) {

                                case "1 ":
                                    estadoPesoFinal.setText("OK");
                                    MessageBox.success(msg);
                                    that.CerrarDialogo();
                                    buttonHabEnvCierre.setEnabled(true).setType("Emphasized");
                                    break;
                                case "2 ":
                                    estadoPesoFinal.setText("Error");
                                    MessageBox.error(msg);
                                    that.CerrarDialogo();
                                    break;
                            };
                            if (HabilitarPaso == "0 ") {
                                buttonHabEnvPesoFinal.setEnabled(false).setType("Ghost");
                            };
                            DatoPesoInicial.setText(Peso);

                        },
                        error: function (e) {
                            alert("error");
                        }
                    });
                }

            },
            onEnviarAlmacen: function (evt) {

                var that = this;
                var oModel = this.getOwnerComponent().getModel();
                var Num_Tranporte = this.getView().getModel("Inicial").oData[0].Transporte;
               

                var oTable = this.getView().byId("idTable");
                var oItems = oTable.getItems();
                var EnviarObj = [];


     
                for (var i = 0, len = oItems.length; i < len; i++) {
                    var obj = {
                        Posicion: oItems[i].getAggregation("cells")[1].getProperty("text"),
                        Almacen: oItems[i].getAggregation("cells")[3].getProperty("value"),
                        Lote: oItems[i].getAggregation("cells")[4].getProperty("value"),
                        LoteFlag : oItems[i].oParent.mAggregations.items[i].mAggregations.cells[5].mProperties.text
                    }
                    EnviarObj.push(obj);
                }

                Services.postData({
                    Key: Num_Tranporte,
                    Cierre_de_ViajeSet: EnviarObj

                }).then(oData => {
                    console.log(oData);


                    var oModelRes = oData.Cierre_de_ViajeSet.results[0];
                    var panelBQ = this.getView().byId("Panel_BQ").getVisible();
                    if (panelBQ == true) {

                        var estadoCierre = that.getView().byId("Table_BQ").getItems()[4].mAggregations.cells[3];
                        var buttonHabEnvCierre = that.getView().byId("Table_BQ").getItems()[4].mAggregations.cells[4];
                        var DatoPesoInicial = that.getView().byId("Table_BQ").getItems()[3].mAggregations.cells[1];

                        var HabilitarPaso = oModelRes.Habilitar_Pasos;
                        var Almacen = oModelRes.Almacen;
                        var msg = oModelRes.Msg_Resultado;


                        switch (oModelRes.Status) {

                            case "1 ":
                                estadoCierre.setText("OK");
                                MessageBox.success(msg);
                                that.CerrarDialogoAlmacen();
                                break;
                            case "2 ":
                                estadoCierre.setText("Error");
                                MessageBox.error(msg);
                                that.CerrarDialogoAlmacen();
                                break;
                        };
                        if (HabilitarPaso == "0 ") {
                            buttonHabEnvCierre.setEnabled(false).setType("Ghost");
                        };

                    } else {

                        var estadoCierre = that.getView().byId("Table_BLU_AS").getItems()[2].mAggregations.cells[2];
                        var buttonHabEnvCierre = that.getView().byId("Table_BLU_AS").getItems()[2].mAggregations.cells[3];
                        var DatoPesoInicial = that.getView().byId("Table_BLU_AS").getItems()[2].mAggregations.cells[1];

                        var HabilitarPaso = oModelRes.Habilitar_Pasos;
                        var Almacen = oModelRes.Almacen;
                        var msg = oModelRes.Msg_Resultado;

                        switch (oModelRes.Status) {

                            case "1 ":
                                estadoCierre.setText("OK");
                                MessageBox.success(msg);
                                that.CerrarDialogoAlmacen();
                                break;
                            case "2 ":
                                estadoCierre.setText("Error");
                                MessageBox.error(msg);
                                that.CerrarDialogoAlmacen();
                                break;
                        };
                        if (HabilitarPaso == "0 ") {
                            buttonHabEnvCierre.setEnabled(false).setType("Ghost");
                        };

                    }

                });

            },
            ////////////////////////////PANEL - BALANZA NO QUIMICA ///////////////////////////////
            onPressPanel2: function (oEvent) {

                var that = this;
                var sPath = oEvent.getSource().getParent().getBindingContextPath();
                var oModel = this.getOwnerComponent().getModel();

                var Transporte = this.getView().getModel("Inicial").oData[0].Transporte;
                var oFilter = [];

                var Num_Transporte = new sap.ui.model.Filter({
                    path: "Num_Transporte",
                    operator: sap.ui.model.FilterOperator.EQ,
                    value1: Transporte
                });

                oFilter.push(Num_Transporte);



                switch (sPath) {

                    case '/0':
                        this.fragmento = sap.ui.xmlfragment("ypf.zz1balanzaquimlubesasfalto.fragments.cargaManual", this);
                        this.getView().addDependent(this.fragmento);
                        this.fragmento.open();


                        break;
                    case '/1':
                        this.fragmento = sap.ui.xmlfragment("ypf.zz1balanzaquimlubesasfalto.fragments.cargaManualPesoFinal", this);
                        this.getView().addDependent(this.fragmento);
                        this.fragmento.open();

                        break;
                    case '/2':


                        oModel.read("/ConsultaAlmacenSet", {
                            filters: oFilter,
                            success: function (oData, oResponse) {

                                var Almacen = oData.results;
                                const oModelAlmacen = new JSONModel(Almacen);

                                that.getView().setModel(oModelAlmacen, "AlmacenModel");

                                that.openFragmentAlancen();

                            },
                            error: function (oError) {
                                console.log(oError)
                            }
                        });

                        break;
                    default:
                }


            }
        });
    });
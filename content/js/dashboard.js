/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 97.83024888321634, "KoPercent": 2.169751116783663};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8753669432035737, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Query cross patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.377, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.796, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.313, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [0.5, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [0.894, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #4"], "isController": false}, {"data": [0.999, 500, 1500, "Create EHR"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.503, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.498, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [0.912, 500, 1500, "Query single patient #2"], "isController": false}, {"data": [0.854, 500, 1500, "Query single patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 23505, 510, 2.169751116783663, 297.555924271431, 1, 7048, 31.0, 834.0, 1969.9500000000007, 3863.9900000000016, 16.417086901253022, 109.08909146933975, 135.9854598360212], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query cross patient #1", 500, 500, 100.0, 49.229999999999976, 19, 169, 40.0, 80.90000000000003, 88.0, 110.96000000000004, 0.3556779720095663, 0.20650718629558545, 0.17922835308294552], "isController": false}, {"data": ["Query participation #2", 500, 0, 0.0, 15.380000000000006, 5, 104, 13.0, 25.0, 31.94999999999999, 47.99000000000001, 0.355556566916457, 3.8008274779092703, 0.12847258765536043], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 16.534000000000017, 5, 89, 14.0, 28.0, 32.0, 51.99000000000001, 0.3555363407915377, 3.8177082574115104, 0.14999189377142996], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 0, 0.0, 68.65599999999986, 16, 685, 56.0, 130.0, 146.0, 179.96000000000004, 0.35259438951807404, 0.1903748012249129, 3.9253672270566833], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 70.73199999999997, 27, 169, 61.5, 118.0, 132.89999999999998, 154.99, 0.35549538993578333, 1.4785289338586607, 0.1478916368287536], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 6.5140000000000065, 1, 24, 5.0, 13.0, 16.0, 19.99000000000001, 0.3555072697681595, 0.22219204360509967, 0.15032680450157526], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 63.63999999999998, 25, 160, 54.0, 104.90000000000003, 121.94999999999999, 139.99, 0.35547971988198074, 1.4590033292897515, 0.12913911698837582], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 1206.2000000000007, 596, 2676, 931.5, 2341.3000000000006, 2432.9, 2548.95, 0.35535567193848655, 1.5028130177087946, 0.17281945764195927], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 23.945999999999984, 8, 85, 20.0, 40.0, 46.0, 69.0, 0.3551048091844308, 0.5280283671038006, 0.18136700703462627], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 10.545999999999994, 2, 57, 7.0, 24.0, 26.94999999999999, 38.0, 0.353266514149737, 0.34078696055320123, 0.19319262492563738], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 38.015999999999984, 14, 95, 30.0, 67.0, 72.94999999999999, 85.0, 0.3554696109029639, 0.579192602988433, 0.2322355172793778], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 813.0, 813, 813, 813.0, 813.0, 813.0, 813.0, 1.2300123001230012, 0.5249173585485856, 1454.8462965098402], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 11.253999999999987, 3, 127, 8.0, 20.0, 24.0, 40.950000000000045, 0.35327250451835535, 0.3549574487684214, 0.20734060079641753], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 38.18399999999997, 15, 96, 30.0, 66.90000000000003, 70.94999999999999, 80.97000000000003, 0.3554549539046016, 0.5584822149002452, 0.21139850285927966], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 23.24000000000002, 8, 75, 19.0, 42.0, 45.94999999999999, 60.950000000000045, 0.35545065811689347, 0.5501445906630221, 0.2030650732406081], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 2964.598000000002, 1542, 6359, 2662.0, 4543.700000000001, 4953.549999999999, 5825.98, 0.3547337084997034, 0.5417400355744699, 0.19538067538460227], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 60.548000000000016, 13, 402, 50.0, 122.0, 136.84999999999997, 171.99, 0.35253621604547436, 0.19032342399565957, 2.842323241866637], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 43.617999999999995, 18, 96, 36.0, 73.0, 79.94999999999999, 91.98000000000002, 0.3554761816739231, 0.643485483508038, 0.2964615812007132], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 37.29799999999997, 14, 100, 29.0, 67.0, 72.0, 81.99000000000001, 0.35547340170271763, 0.6018032776869345, 0.25480222348612763], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 180.0, 180, 180, 180.0, 180.0, 180.0, 180.0, 5.555555555555555, 2.587890625, 757.6822916666667], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 734.0, 734, 734, 734.0, 734.0, 734.0, 734.0, 1.3623978201634876, 0.6239888453678474, 2605.5086639986375], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 8.442000000000002, 1, 38, 6.0, 19.0, 23.0, 28.980000000000018, 0.3532113623856743, 0.29678722697644716, 0.1493559764775361], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 609.7500000000005, 330, 1411, 487.0, 1203.8000000000002, 1250.85, 1363.6500000000003, 0.35313427860317026, 0.31084162073272537, 0.16346254693154563], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 9.790000000000012, 2, 49, 6.0, 23.0, 27.0, 36.0, 0.3532285798656884, 0.3199733508905599, 0.17247489251254317], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 1715.4080000000004, 932, 3864, 1353.5, 3076.7000000000003, 3525.0, 3710.84, 0.3530018927961492, 0.33398184745129106, 0.18649807031515303], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 68.0, 68, 68, 68.0, 68.0, 68.0, 68.0, 14.705882352941176, 6.879021139705882, 968.3335248161764], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 0, 0.0, 100.28000000000004, 31, 1345, 84.0, 171.90000000000003, 192.0, 228.0, 0.3522066805154333, 0.19012556872573735, 16.110016115216666], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 124.58800000000006, 19, 379, 111.0, 227.0, 254.95, 289.98, 0.3529156835023917, 78.35787058661292, 0.10890757420581619], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 615.0, 615, 615, 615.0, 615.0, 615.0, 615.0, 1.6260162601626016, 0.8527057926829268, 0.6669207317073171], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 7.692000000000002, 1, 36, 5.0, 18.0, 20.0, 28.99000000000001, 0.35555226867236067, 0.3863137898547427, 0.15242914643277966], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 9.979999999999999, 2, 88, 7.0, 20.0, 24.0, 33.99000000000001, 0.3555494875109687, 0.36476321915217097, 0.13090054374183127], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 6.338000000000001, 1, 61, 4.0, 13.0, 16.0, 24.0, 0.35556263520269205, 0.20167971011156133, 0.13784996696823118], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 198.55799999999996, 90, 485, 144.5, 381.80000000000007, 407.95, 454.94000000000005, 0.3555118197014696, 0.3238782113382674, 0.11595795681669029], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 10, 2.0, 324.484, 58, 874, 274.0, 538.9000000000001, 580.0, 659.94, 0.3527058179530083, 0.18904205188020418, 104.33685640887633], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 6.186, 1, 20, 5.0, 12.0, 14.949999999999989, 18.99000000000001, 0.35554721204764617, 0.19825923640547458, 0.1489548378598049], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 9.956000000000014, 2, 46, 8.0, 20.0, 24.0, 32.0, 0.3555773010829462, 0.19127072504522943, 0.1513981477267232], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 56.32400000000003, 7, 597, 39.0, 128.0, 147.95, 168.97000000000003, 0.35206556869151306, 0.1487318873266957, 0.2554538257205022], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 10.638000000000005, 2, 96, 8.0, 20.0, 24.0, 30.0, 0.35555353285101315, 0.18290451503209226, 0.1430547417330248], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 10.172000000000013, 2, 37, 8.0, 20.0, 23.0, 31.0, 0.35320861772513873, 0.21692114096626575, 0.17660430886256934], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 10.554000000000011, 2, 50, 8.0, 21.0, 24.0, 35.99000000000001, 0.35319714051595036, 0.20689143360070356, 0.16659591686445704], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 855.1339999999999, 390, 1867, 663.5, 1639.8000000000002, 1699.95, 1794.96, 0.35296476282179795, 0.3225518849377229, 0.15545616018811612], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 31.209999999999994, 7, 214, 28.0, 56.0, 63.0, 96.97000000000003, 0.3530083726525826, 0.31253444589511276, 0.14513332508470436], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 22.282000000000004, 7, 184, 17.0, 39.0, 42.94999999999999, 56.99000000000001, 0.3533017104749011, 0.23544936842019726, 0.16526515558347424], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 844.692, 459, 5630, 812.0, 1050.6000000000001, 1096.4499999999998, 1235.97, 0.35319190116842947, 0.26536369869799337, 0.1952213047473936], "isController": false}, {"data": ["Query single patient #2", 500, 0, 0.0, 274.5399999999999, 148, 628, 200.0, 536.0, 564.95, 609.9000000000001, 0.355625605897126, 6.876007198395702, 0.17920196547159867], "isController": false}, {"data": ["Query single patient #1", 500, 0, 0.0, 439.54000000000036, 222, 964, 337.0, 777.8000000000001, 821.95, 890.9300000000001, 0.3555128308135769, 0.6891130172622809, 0.2541361251518928], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 38.440000000000026, 14, 103, 29.0, 67.0, 72.94999999999999, 88.97000000000003, 0.3550755565276735, 0.28968478655698143, 0.21914819504442348], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 37.79000000000002, 14, 115, 30.0, 67.0, 73.94999999999999, 90.95000000000005, 0.3550846344226146, 0.29528061450946835, 0.2247019952205608], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 38.75600000000003, 13, 92, 30.0, 68.0, 73.0, 85.99000000000001, 0.3550483256276012, 0.28739636361280135, 0.21670430030981516], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 39.95400000000003, 16, 111, 33.0, 71.0, 79.0, 93.99000000000001, 0.3550516032000091, 0.31756453373558313, 0.2468718178500063], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 38.46199999999996, 14, 103, 29.0, 70.0, 75.0, 91.95000000000005, 0.3545915707910158, 0.2661694531949764, 0.19564866943058976], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 3355.210000000002, 1674, 7048, 3029.5, 5025.4000000000015, 5579.499999999999, 6817.640000000001, 0.3541844054023039, 0.2960158427127267, 0.22551585187724818], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["No results for path: $['rows'][1]", 500, 98.03921568627452, 2.1272069772388855], "isController": false}, {"data": ["500", 10, 1.9607843137254901, 0.042544139544777704], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 23505, 510, "No results for path: $['rows'][1]", 500, "500", 10, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["Query cross patient #1", 500, 500, "No results for path: $['rows'][1]", 500, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 10, "500", 10, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});

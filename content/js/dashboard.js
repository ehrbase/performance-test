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

    var data = {"OkPercent": 97.87279302276112, "KoPercent": 2.1272069772388855};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8930865773239737, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Query cross patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.213, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.654, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [1.0, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [0.975, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.496, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.137, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 23505, 500, 2.1272069772388855, 323.1843863007857, 1, 22457, 9.0, 836.0, 1492.0, 6026.0, 15.346075047889155, 96.66889321044721, 126.99008061790069], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query cross patient #1", 500, 500, 100.0, 6205.022000000002, 5269, 22457, 6013.0, 6465.9, 6606.75, 19875.470000000118, 0.331034848038453, 0.19225560007514492, 0.16681052889437673], "isController": false}, {"data": ["Query participation #2", 500, 0, 0.0, 2.2779999999999982, 1, 9, 2.0, 3.0, 4.0, 6.0, 0.3321610263509986, 0.17052770816697602, 0.12001912084948188], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 3.6159999999999997, 2, 14, 3.0, 4.0, 5.0, 8.990000000000009, 0.3321583784293691, 0.19063750057297318, 0.1401293158998901], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 0, 0.0, 13.150000000000015, 8, 359, 11.0, 15.0, 17.0, 54.850000000000136, 0.33005478909498975, 0.17170262372928904, 3.631569637434814], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 33.56199999999998, 24, 56, 33.0, 40.0, 41.0, 44.0, 0.33210123774131306, 1.381174670098933, 0.13815930398222595], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 2.346000000000001, 1, 10, 2.0, 3.0, 4.0, 6.990000000000009, 0.33211028186863845, 0.2074748714982292, 0.1404333516104692], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 29.28600000000001, 21, 45, 29.0, 35.0, 36.0, 37.99000000000001, 0.33209991425180213, 1.3630074517824136, 0.12064567197428751], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 850.0780000000001, 654, 1095, 855.5, 991.5000000000002, 1050.0, 1073.0, 0.33195549671828795, 1.4039091691336492, 0.16143929430244863], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 5.5100000000000025, 3, 24, 5.0, 7.0, 8.0, 12.0, 0.3320421321620658, 0.49375378424267496, 0.16958792492261757], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 3.8479999999999994, 2, 26, 4.0, 5.0, 5.949999999999989, 9.990000000000009, 0.33024466506255823, 0.3185409747352924, 0.18060255120608654], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 7.4179999999999975, 5, 19, 7.0, 9.0, 10.0, 13.0, 0.3320974878817627, 0.5411859365265392, 0.21696603456337812], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 492.0, 492, 492, 492.0, 492.0, 492.0, 492.0, 2.032520325203252, 0.8793032266260162, 2404.04479484248], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 3.858000000000002, 2, 23, 4.0, 5.0, 6.0, 10.0, 0.33024990009940525, 0.3317689206359952, 0.19382831050756105], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 7.659999999999997, 5, 24, 7.0, 9.0, 10.0, 16.0, 0.3320957232712757, 0.5217243271325527, 0.19750614792207707], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 6.412, 4, 20, 6.0, 8.0, 8.0, 11.990000000000009, 0.3320939586795413, 0.5139381027920468, 0.18972164631594887], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 1551.8279999999997, 1317, 1995, 1521.5, 1771.9, 1843.95, 1894.97, 0.3317449385674722, 0.5065946073118575, 0.18271889194536559], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 11.520000000000001, 7, 85, 11.0, 13.0, 18.0, 33.960000000000036, 0.3300388851814521, 0.1716943501220814, 2.6609385117754574], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 10.869999999999992, 8, 23, 11.0, 13.0, 14.0, 18.0, 0.33210123774131306, 0.6011908060678217, 0.2769672431944154], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 7.589999999999999, 5, 18, 7.0, 9.0, 11.0, 15.0, 0.33209969367124254, 0.5622700780417675, 0.23804802261200397], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 50.0, 50, 50, 50.0, 50.0, 50.0, 50.0, 20.0, 9.43359375, 2727.65625], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 441.0, 441, 441, 441.0, 441.0, 441.0, 441.0, 2.2675736961451247, 1.0518530328798186, 4336.606257086168], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 2.223999999999998, 1, 19, 2.0, 3.0, 3.0, 7.990000000000009, 0.3302389939599288, 0.27757812938598664, 0.13964207459438396], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 552.3300000000005, 440, 707, 544.5, 637.9000000000001, 651.95, 674.98, 0.3301338957054202, 0.2907080420864594, 0.15281588531676676], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 3.2439999999999998, 2, 16, 3.0, 4.0, 5.0, 9.990000000000009, 0.33024750068691483, 0.29919327037329857, 0.16125366244478262], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 753.5100000000004, 630, 960, 734.5, 873.9000000000001, 892.9, 920.99, 0.3301025100334658, 0.31227890868605335, 0.17439986125791504], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 45.0, 45, 45, 45.0, 45.0, 45.0, 45.0, 22.22222222222222, 10.52517361111111, 1463.259548611111], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 0, 0.0, 23.881999999999987, 16, 603, 22.0, 26.0, 31.899999999999977, 60.92000000000007, 0.3299097498888204, 0.17162717076491554, 15.048910563776174], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 30.493999999999968, 21, 256, 28.0, 35.0, 40.0, 108.97000000000003, 0.33017662468360826, 74.676250340701, 0.10189044277345724], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 460.0, 460, 460, 460.0, 460.0, 460.0, 460.0, 2.1739130434782608, 1.1400305706521738, 0.8916440217391304], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 2.5999999999999996, 1, 18, 2.0, 3.0, 4.0, 6.0, 0.33211204663384514, 0.3608831986425252, 0.14238006686743945], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 3.3340000000000005, 2, 9, 3.0, 4.0, 5.0, 8.0, 0.33211028186863845, 0.34077304127167685, 0.12227107057077802], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 1.724000000000001, 1, 9, 2.0, 3.0, 3.0, 5.990000000000009, 0.3321621296641376, 0.18836901398170053, 0.12877770066080335], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 92.36399999999999, 67, 125, 92.0, 110.0, 114.0, 117.99000000000001, 0.33214469817346987, 0.3025338685872823, 0.10833625897454975], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 0, 0.0, 81.60599999999998, 59, 339, 80.0, 91.0, 99.94999999999999, 306.93000000000006, 0.33011536871905994, 0.17173413874055704, 97.61292235785562], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 214.26199999999994, 13, 367, 263.0, 335.0, 340.95, 346.99, 0.3321056494492028, 0.1850937648409712, 0.1391341050915117], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 416.586, 301, 552, 402.5, 490.90000000000003, 500.95, 523.99, 0.3320630813594397, 0.17858443314009476, 0.14138623386007393], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 7.252000000000006, 4, 304, 6.0, 8.0, 11.0, 27.99000000000001, 0.32985272735429083, 0.1487268581511227, 0.23933650041429502], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 388.58200000000016, 300, 488, 391.0, 451.0, 459.0, 476.98, 0.33204345519106776, 0.17079160965203838, 0.13359560892453118], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 3.308, 2, 17, 3.0, 4.0, 5.0, 10.0, 0.3302357222585482, 0.2027563485753631, 0.1651178611292741], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 4.162, 2, 47, 4.0, 5.0, 6.0, 9.990000000000009, 0.3302259075433504, 0.19339822169220963, 0.1557608528744514], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 669.4459999999997, 537, 850, 670.0, 803.0, 824.95, 838.0, 0.33006938718657436, 0.30161057254331003, 0.14537235705189944], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 240.71199999999988, 166, 326, 236.0, 281.90000000000003, 287.0, 296.99, 0.33017335421789856, 0.2923549628934676, 0.13574509973216337], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 4.299999999999995, 3, 34, 4.0, 5.0, 6.0, 9.990000000000009, 0.3302542627568965, 0.22018348410816488, 0.15448417173882173], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 983.5720000000009, 805, 8872, 925.0, 1090.6000000000001, 1110.0, 1140.99, 0.330074180871409, 0.24810683374856665, 0.18244334606759524], "isController": false}, {"data": ["Query single patient #2", 500, 0, 0.0, 134.11399999999998, 117, 165, 133.0, 149.0, 151.0, 160.97000000000003, 0.3321605850277952, 6.4222178675738855, 0.16737779479916243], "isController": false}, {"data": ["Query single patient #1", 500, 0, 0.0, 181.28999999999996, 159, 257, 179.0, 201.0, 203.95, 210.98000000000002, 0.3321290334580146, 0.643730287103961, 0.2374203637610026], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 6.920000000000002, 5, 31, 7.0, 9.0, 10.0, 13.0, 0.33203507618544825, 0.2709814780458408, 0.20492789858320634], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 6.7499999999999964, 5, 16, 6.0, 9.0, 9.0, 13.0, 0.3320399271371584, 0.27617356088084877, 0.21011901639148303], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 8.104000000000001, 6, 32, 8.0, 9.900000000000034, 11.0, 17.0, 0.3320300048874817, 0.2687076028811572, 0.2026550322799571], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 9.321999999999985, 7, 22, 9.0, 11.0, 12.0, 16.0, 0.33203220978060644, 0.29691915509589756, 0.2308661458630779], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 7.554000000000006, 5, 34, 7.0, 9.0, 10.0, 19.960000000000036, 0.33201721708480914, 0.24924312006373403, 0.18319309341105194], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 1600.5220000000013, 1371, 1953, 1579.0, 1787.6000000000001, 1828.9, 1928.7500000000002, 0.3316894802691196, 0.2771777394151253, 0.21119291126510348], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["No results for path: $['rows'][1]", 500, 100.0, 2.1272069772388855], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 23505, 500, "No results for path: $['rows'][1]", 500, null, null, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["Query cross patient #1", 500, 500, "No results for path: $['rows'][1]", 500, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});

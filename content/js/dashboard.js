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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8915549883003616, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Query cross patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.18, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.655, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [1.0, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [0.954, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [0.998, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.496, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.12, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 23505, 500, 2.1272069772388855, 324.45973197191825, 1, 18507, 9.0, 840.0, 1513.9500000000007, 6051.990000000002, 15.258389679992522, 96.11654041412199, 126.2644767157006], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query cross patient #1", 500, 500, 100.0, 6187.788000000002, 5087, 18507, 6026.5, 6525.400000000001, 6709.4, 16070.15000000008, 0.3291654405254007, 0.19116990149888777, 0.1658685227647527], "isController": false}, {"data": ["Query participation #2", 500, 0, 0.0, 2.3, 1, 8, 2.0, 3.0, 3.0, 5.990000000000009, 0.3302435744507719, 0.16954331008253445, 0.11932629154959531], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 3.716, 2, 15, 4.0, 5.0, 5.0, 11.970000000000027, 0.3302407388938388, 0.18953689907743948, 0.13932031172083825], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 0, 0.0, 13.144000000000007, 8, 371, 11.0, 15.0, 18.0, 35.98000000000002, 0.3280465353693213, 0.17065788071932733, 3.609472962896625], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 33.474000000000025, 24, 46, 33.5, 40.0, 41.0, 44.0, 0.3301648513102592, 1.3731214393784317, 0.13735373697086956], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 2.19, 1, 10, 2.0, 3.0, 3.0, 6.0, 0.33017313618915484, 0.20626470405426198, 0.13961422653310943], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 29.773999999999997, 21, 60, 30.0, 35.0, 37.0, 40.98000000000002, 0.3301635432094934, 1.3550601803534863, 0.11994222468157377], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 853.0540000000004, 648, 1120, 854.0, 1018.9000000000001, 1057.95, 1077.0, 0.33002058668419737, 1.395726030233516, 0.16049829313352568], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 5.686000000000001, 3, 16, 5.0, 8.0, 9.0, 10.990000000000009, 0.3301253948299722, 0.4909035546499482, 0.1686089663047612], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 3.948000000000005, 2, 24, 4.0, 5.0, 6.0, 11.0, 0.32826319880669763, 0.3166297305599251, 0.17951893684741277], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 7.745999999999998, 5, 25, 7.0, 10.0, 10.949999999999989, 14.990000000000009, 0.33016550536452915, 0.5380375785711361, 0.2157038311414746], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 451.0, 451, 451, 451.0, 451.0, 451.0, 451.0, 2.2172949002217295, 0.9592398835920177, 2622.5943216463415], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 4.122000000000001, 2, 21, 4.0, 5.0, 6.0, 11.0, 0.3282675091324021, 0.3297774114449154, 0.19266481737165397], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 8.151999999999989, 5, 25, 8.0, 10.0, 11.0, 17.0, 0.33016441527551893, 0.518690230954961, 0.19635754775663186], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 6.632000000000003, 4, 23, 6.0, 8.0, 9.0, 12.990000000000009, 0.3301639792419303, 0.5109513276801556, 0.18861907017239182], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 1569.7140000000006, 1332, 1953, 1546.0, 1764.0, 1823.9, 1919.8200000000002, 0.32982988034431604, 0.503670197454307, 0.1816641137833928], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 11.465999999999996, 8, 53, 10.0, 14.0, 17.0, 31.980000000000018, 0.32803835686899196, 0.1706536260621882, 2.644809252256248], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 10.817999999999998, 8, 23, 11.0, 13.0, 14.0, 17.0, 0.3301679035856895, 0.5976909614803012, 0.27535487271697145], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 7.783999999999999, 5, 28, 8.0, 9.0, 10.949999999999989, 15.0, 0.33016615942139044, 0.5589964572758387, 0.23666207130400446], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 64.0, 64, 64, 64.0, 64.0, 64.0, 64.0, 15.625, 7.3699951171875, 2130.9814453125], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 409.0, 409, 409, 409.0, 409.0, 409.0, 409.0, 2.444987775061125, 1.1341496026894866, 4675.9006341687045], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 2.3480000000000008, 1, 52, 2.0, 3.0, 3.0, 6.0, 0.3282731127250476, 0.27592573325544506, 0.13881079864252502], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 555.3679999999997, 434, 689, 546.0, 647.0, 662.95, 682.99, 0.3281746466707667, 0.2889827740717744, 0.15190896730658535], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 3.3040000000000003, 1, 13, 3.0, 4.0, 5.0, 9.0, 0.32827893204297826, 0.2974098125445228, 0.1602924472866105], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 757.1819999999998, 625, 941, 737.0, 880.0, 895.95, 930.97, 0.32812748146407855, 0.31041052008698006, 0.17335641354693995], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 54.0, 54, 54, 54.0, 54.0, 54.0, 54.0, 18.51851851851852, 8.77097800925926, 1219.3829571759259], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 0, 0.0, 24.098000000000017, 16, 585, 22.0, 26.0, 30.0, 70.96000000000004, 0.3279144379415368, 0.17058916038655866, 14.957893941649592], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 30.52600000000002, 20, 260, 29.0, 35.900000000000034, 41.94999999999999, 115.93000000000006, 0.3281785238661268, 74.22433864951093, 0.10127384134931257], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 497.0, 497, 497, 497.0, 497.0, 497.0, 497.0, 2.012072434607646, 1.0551590794768613, 0.8252640845070423], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 2.7100000000000017, 1, 13, 3.0, 3.0, 4.0, 7.0, 0.33019821138232863, 0.35880356619846765, 0.14155958476254127], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 3.3940000000000006, 2, 8, 3.0, 4.0, 5.0, 8.0, 0.3301971210773408, 0.33880997762419207, 0.12156671352163814], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 1.7940000000000005, 1, 10, 2.0, 3.0, 3.0, 5.0, 0.33024444693962474, 0.18728149685772408, 0.12803422405764747], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 91.14400000000006, 68, 123, 90.0, 111.0, 114.0, 118.0, 0.33022765233896945, 0.3007877281377736, 0.1077109725402498], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 0, 0.0, 82.29199999999999, 58, 350, 79.5, 93.90000000000003, 103.0, 298.8800000000001, 0.3281137005844361, 0.170692821717124, 97.02104238277481], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 211.85600000000008, 12, 357, 262.0, 334.0, 336.95, 340.99, 0.330192977984053, 0.1840277680324989, 0.1383328003468347], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 425.252, 335, 535, 408.5, 500.0, 509.0, 525.97, 0.33015133476883135, 0.17755629059623348, 0.14057224800704146], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 7.360000000000001, 4, 273, 6.0, 8.0, 11.0, 31.960000000000036, 0.32785874795989894, 0.1478277954302392, 0.23788969700605947], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 401.3520000000002, 293, 525, 401.0, 466.90000000000003, 477.95, 495.98, 0.33013280582512733, 0.169808838043118, 0.13282687109370359], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 3.4640000000000004, 2, 20, 3.0, 5.0, 6.0, 8.990000000000009, 0.32826923329437874, 0.2015489742817469, 0.16413461664718934], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 4.195999999999999, 2, 49, 4.0, 5.0, 6.0, 9.0, 0.32825953511884637, 0.19224660723254233, 0.15483335494375272], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 668.8260000000007, 536, 869, 673.0, 803.9000000000001, 833.9, 855.0, 0.328105949348316, 0.2998164236960085, 0.14450760073836963], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 243.2239999999999, 175, 312, 239.0, 286.0, 292.0, 301.0, 0.32818541688408953, 0.2905947259208719, 0.13492779346504072], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 4.558000000000002, 3, 70, 4.0, 5.0, 6.0, 9.990000000000009, 0.3282711729982516, 0.21886134034925425, 0.15355653502554933], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 991.3220000000002, 818, 9237, 939.5, 1091.9, 1112.0, 1143.96, 0.32810465751123435, 0.24662640227829313, 0.18135472280406115], "isController": false}, {"data": ["Query single patient #2", 500, 0, 0.0, 136.46999999999971, 116, 157, 142.0, 151.0, 152.0, 155.0, 0.33023921207565915, 6.38506874073679, 0.1664096029600001], "isController": false}, {"data": ["Query single patient #1", 500, 0, 0.0, 183.19799999999992, 159, 253, 182.0, 205.0, 207.0, 218.95000000000005, 0.33021151368297447, 0.6400137630095081, 0.23604963673431378], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 7.141999999999999, 5, 15, 7.0, 9.0, 10.0, 13.0, 0.3301221253790627, 0.26942027480521147, 0.2037472492573903], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 6.917999999999996, 5, 16, 7.0, 9.0, 9.0, 12.0, 0.33012343315165543, 0.274579520751559, 0.20890623504128192], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 8.516000000000004, 5, 19, 8.0, 10.0, 11.0, 15.990000000000009, 0.3301188559929117, 0.2671609347166854, 0.20148855956598613], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 9.784, 7, 19, 9.0, 12.0, 13.0, 17.0, 0.3301195098649613, 0.29520872693207395, 0.2295362217029809], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 7.870000000000009, 5, 31, 8.0, 9.0, 10.0, 19.970000000000027, 0.3301038176506511, 0.24780674381467974, 0.18213736032482217], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 1612.9260000000004, 1398, 1965, 1589.0, 1806.0, 1867.6999999999998, 1951.95, 0.32978898122247496, 0.2755895792205899, 0.20998282788774772], "isController": false}]}, function(index, item){
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

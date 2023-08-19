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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.890151031695384, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Query cross patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.18, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.591, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [1.0, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [0.974, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.497, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.095, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 23505, 500, 2.1272069772388855, 324.4342905764714, 1, 17856, 9.0, 844.0, 1520.0, 6023.0, 15.25182544981692, 96.07519063159623, 126.2101571508221], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query cross patient #1", 500, 500, 100.0, 6171.1839999999975, 4956, 17856, 6010.0, 6564.8, 6760.8, 14589.370000000066, 0.3287959492339054, 0.1909553114930624, 0.16568233379364766], "isController": false}, {"data": ["Query participation #2", 500, 0, 0.0, 2.2960000000000003, 1, 10, 2.0, 3.0, 4.0, 6.0, 0.3298801479446487, 0.16935673103123172, 0.11919497533156254], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 3.6280000000000006, 2, 22, 3.5, 4.0, 5.0, 8.980000000000018, 0.329877753901959, 0.18932856908761753, 0.13916717742738896], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 0, 0.0, 13.296000000000008, 8, 388, 12.0, 15.0, 18.94999999999999, 35.99000000000001, 0.32788669809569965, 0.17057472943609392, 3.6077142846135235], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 33.891999999999996, 24, 72, 34.0, 40.0, 42.0, 45.98000000000002, 0.3297963771208381, 1.371588993367465, 0.13720044595066114], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 2.266000000000001, 1, 25, 2.0, 3.0, 4.0, 6.0, 0.32980529614536763, 0.20603490820034484, 0.13945868479584392], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 30.052, 21, 62, 30.0, 36.0, 37.0, 43.0, 0.3298026856492298, 1.3535791455125727, 0.11981113189600925], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 856.8660000000009, 671, 1131, 860.0, 1003.0, 1047.95, 1079.99, 0.32964482747708307, 1.3941368660188265, 0.1603155508628783], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 5.621999999999999, 4, 15, 5.0, 7.0, 8.0, 11.990000000000009, 0.3297576610948614, 0.49035672668530894, 0.16842114917247314], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 3.808000000000002, 2, 25, 4.0, 5.0, 5.0, 9.0, 0.32808915625967866, 0.3164618559855929, 0.17942375732951174], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 7.76000000000001, 5, 19, 8.0, 10.0, 11.0, 12.990000000000009, 0.32980986461305056, 0.5374580265414488, 0.2154714838145809], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 422.0, 422, 422, 422.0, 422.0, 422.0, 422.0, 2.3696682464454977, 1.0251592120853081, 2802.819997778436], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 4.144000000000003, 2, 18, 4.0, 5.0, 6.0, 10.990000000000009, 0.32809410788915405, 0.3296032126236833, 0.19256304574353672], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 8.002, 5, 16, 8.0, 10.0, 11.0, 13.0, 0.32980812422948574, 0.518130495634, 0.19614565200757506], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 6.614000000000003, 4, 24, 6.0, 8.0, 9.0, 11.990000000000009, 0.3298074715903844, 0.510399607718748, 0.18841540125036607], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 1565.9339999999997, 1338, 1912, 1544.5, 1741.9, 1833.8, 1888.98, 0.3294662778086012, 0.5031149543672732, 0.18146384832426862], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 11.979999999999999, 8, 86, 11.0, 14.0, 18.0, 47.88000000000011, 0.3278783125545917, 0.17057036707124665, 2.643518894971396], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 10.942, 8, 20, 11.0, 13.0, 15.0, 18.980000000000018, 0.3298116050149833, 0.5970459671214109, 0.27505772527616773], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 7.715999999999998, 5, 17, 8.0, 10.0, 10.0, 12.990000000000009, 0.3298120401183366, 0.5583969063218371, 0.23640823969419827], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 76.0, 76, 76, 76.0, 76.0, 76.0, 76.0, 13.157894736842104, 6.206311677631579, 1794.5106907894738], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 441.0, 441, 441, 441.0, 441.0, 441.0, 441.0, 2.2675736961451247, 1.0518530328798186, 4336.606257086168], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 2.358000000000001, 1, 16, 2.0, 3.0, 4.0, 8.0, 0.32809303143524954, 0.27577436824866564, 0.13873465098775686], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 564.4979999999996, 448, 765, 554.5, 649.8000000000001, 665.0, 695.9200000000001, 0.3279860671518674, 0.2888167154409281, 0.15182167561521986], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 3.38, 2, 22, 3.0, 4.0, 5.0, 10.0, 0.3280960455239825, 0.2972441234307166, 0.1602031472285071], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 762.8719999999998, 623, 961, 743.0, 883.0, 904.0, 939.98, 0.3279479900723584, 0.3102407201787054, 0.1732615845987753], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 63.0, 63, 63, 63.0, 63.0, 63.0, 63.0, 15.873015873015872, 7.517981150793651, 1045.1853918650793], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 0, 0.0, 24.506, 16, 556, 22.0, 27.0, 32.94999999999999, 71.97000000000003, 0.3277609599987414, 0.17050931738372024, 14.95089300931759], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 30.691999999999997, 21, 261, 29.0, 34.0, 38.94999999999999, 114.99000000000001, 0.32801834278572856, 74.18811039600834, 0.10122441046903342], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 485.0, 485, 485, 485.0, 485.0, 485.0, 485.0, 2.061855670103093, 1.0812661082474226, 0.8456829896907216], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 2.6940000000000017, 1, 8, 3.0, 4.0, 4.0, 6.0, 0.32983706049211686, 0.3584111284962728, 0.14140475542581965], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 3.3620000000000005, 2, 9, 3.0, 4.0, 5.0, 6.990000000000009, 0.3298359725708405, 0.33843940892569124, 0.12143375162031922], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 1.8240000000000003, 1, 15, 2.0, 2.900000000000034, 3.0, 5.980000000000018, 0.32988167144445285, 0.18707576701612133, 0.12789357769867948], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 91.84799999999998, 65, 118, 92.0, 111.0, 113.0, 116.0, 0.3298655665869931, 0.30045792247202574, 0.1075928703516169], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 0, 0.0, 82.47200000000001, 58, 347, 80.0, 92.0, 100.0, 272.0, 0.3279563791779183, 0.17061097924987192, 96.97452348757996], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 208.18799999999985, 12, 376, 260.0, 333.0, 336.0, 345.99, 0.329832056113668, 0.1838266140084292, 0.13818159382105819], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 425.6039999999998, 333, 558, 417.0, 491.0, 501.0, 520.0, 0.3297689704546789, 0.17735065402255487, 0.14040944445140624], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 7.42, 5, 285, 6.0, 8.0, 10.949999999999989, 29.99000000000001, 0.32770274477264966, 0.1477574553603321, 0.23777650328718625], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 400.12599999999986, 305, 491, 402.5, 454.0, 464.0, 485.96000000000004, 0.32976766548895636, 0.16962102254852365, 0.1326799591615723], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 3.5439999999999987, 2, 19, 3.0, 4.0, 5.0, 9.990000000000009, 0.32809044797469766, 0.20143920463493376, 0.16404522398734883], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 4.219999999999998, 2, 32, 4.0, 5.0, 6.0, 9.970000000000027, 0.32808398950131235, 0.19214379818733596, 0.1547505536417323], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 676.2979999999998, 532, 868, 683.0, 802.0, 834.95, 850.0, 0.3279398164848787, 0.29966461492486896, 0.14443443089324245], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 245.11800000000017, 171, 310, 239.0, 284.0, 290.0, 302.95000000000005, 0.32802652028811224, 0.2904540295023772, 0.1348624658606399], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 4.589999999999999, 3, 46, 4.0, 5.0, 6.0, 13.970000000000027, 0.3280975525891162, 0.21874558606261285, 0.15347532000994793], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 980.8620000000002, 778, 8249, 936.0, 1085.9, 1107.95, 1136.97, 0.32793099807110987, 0.24649586770050194, 0.18125873526196112], "isController": false}, {"data": ["Query single patient #2", 500, 0, 0.0, 133.4419999999999, 117, 167, 129.0, 150.0, 151.0, 159.95000000000005, 0.32984141224899066, 6.377377409285365, 0.16620914914109294], "isController": false}, {"data": ["Query single patient #1", 500, 0, 0.0, 180.702, 159, 230, 174.0, 202.0, 204.0, 212.0, 0.32981595610017694, 0.6392470959292795, 0.23576687486848588], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 7.061999999999999, 5, 22, 7.0, 9.0, 10.0, 14.990000000000009, 0.32975722613497493, 0.2691224721223241, 0.20352203800517982], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 7.020000000000001, 5, 16, 7.0, 9.0, 11.0, 14.990000000000009, 0.32975679117623585, 0.2742745670046014, 0.20867421941621175], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 8.5, 5, 30, 8.0, 10.0, 12.0, 17.0, 0.32975592126220016, 0.2668672163175761, 0.20126704178601085], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 9.766000000000004, 7, 26, 10.0, 12.0, 13.0, 16.99000000000001, 0.3297557037844083, 0.2948833940550982, 0.22928326278759645], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 7.770000000000007, 5, 29, 8.0, 9.0, 11.0, 15.970000000000027, 0.3297130836745864, 0.24751342241356572, 0.18192176980091923], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 1621.942, 1389, 1960, 1594.5, 1813.7, 1886.85, 1945.99, 0.3294085403775812, 0.2752716621938477, 0.20974059406853804], "isController": false}]}, function(index, item){
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

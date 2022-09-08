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

    var data = {"OkPercent": 97.83450329717081, "KoPercent": 2.165496702829185};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9025101042331419, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Query cross patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.995, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.993, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [1.0, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [0.987, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.737, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.707, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 23505, 509, 2.165496702829185, 185.143714103382, 1, 3512, 16.0, 522.9000000000015, 1197.9000000000015, 2175.9900000000016, 26.63631150829176, 177.9542648500553, 220.68502005655895], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query cross patient #1", 500, 500, 100.0, 24.259999999999994, 16, 59, 25.0, 28.0, 30.0, 46.940000000000055, 0.5774232142609675, 0.33531823164718055, 0.29209494627654414], "isController": false}, {"data": ["Query participation #2", 500, 0, 0.0, 7.453999999999995, 4, 26, 7.0, 10.0, 12.0, 18.99000000000001, 0.5771812545380877, 6.162759278837996, 0.20967912762516464], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 7.7399999999999975, 5, 34, 7.0, 9.0, 10.0, 16.980000000000018, 0.5771619331692655, 6.19749832947693, 0.24461745995650508], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 0, 0.0, 21.803999999999995, 14, 247, 20.0, 27.0, 32.0, 47.99000000000001, 0.5740692901633228, 0.3099873256264531, 6.392126998478716], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 43.697999999999986, 25, 68, 45.0, 53.0, 55.0, 60.99000000000001, 0.5770420363582647, 2.3999561484117495, 0.2411855386341184], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 2.5400000000000014, 1, 23, 2.0, 3.0, 4.0, 7.0, 0.5770766680978168, 0.36064023157798153, 0.24514487365483428], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 38.37800000000004, 23, 63, 39.0, 47.0, 48.0, 55.99000000000001, 0.5770367087672649, 2.3682465607169565, 0.21075364167866903], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 774.2280000000002, 583, 1021, 779.5, 915.0, 928.95, 965.9200000000001, 0.5766979429184376, 2.438943456929314, 0.2815907924406434], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 11.043999999999984, 7, 26, 11.0, 14.0, 16.0, 21.980000000000018, 0.5767884190114078, 0.8576314316955618, 0.2957167187314346], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 3.2219999999999978, 1, 18, 3.0, 4.0, 5.0, 11.960000000000036, 0.5744379698902594, 0.5541778119600282, 0.3152677139436775], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 17.371999999999975, 11, 58, 18.0, 22.0, 23.0, 31.950000000000045, 0.576998752528697, 0.9402442601606595, 0.37809195600269113], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 589.0, 589, 589, 589.0, 589.0, 589.0, 589.0, 1.697792869269949, 0.724546370967742, 2008.1358101655348], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 4.296000000000002, 2, 25, 4.0, 6.0, 7.0, 14.0, 0.5744472094503459, 0.5772195904162674, 0.3382731125962486], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 18.134000000000004, 11, 54, 19.0, 22.0, 23.0, 34.0, 0.576980775000577, 0.906570900479471, 0.34427270852085207], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 10.633999999999997, 7, 52, 11.0, 13.0, 15.0, 29.920000000000073, 0.5769787775666035, 0.893012141508661, 0.33074857659335577], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 1935.8280000000004, 1532, 2357, 1916.5, 2188.8, 2241.95, 2325.9300000000003, 0.5757847946751422, 0.8791930178176605, 0.31825604861926804], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 18.91000000000002, 12, 166, 17.0, 24.0, 30.0, 48.99000000000001, 0.5740304052425049, 0.30986878812996965, 4.629241295402935], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 22.339999999999986, 14, 96, 23.0, 26.900000000000034, 28.0, 48.91000000000008, 0.5770207265844989, 1.044494293625652, 0.4823532636292296], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 17.208000000000002, 11, 49, 18.0, 22.0, 23.0, 26.99000000000001, 0.5770147334942051, 0.9768645311495634, 0.41472933969895986], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 81.0, 81, 81, 81.0, 81.0, 81.0, 81.0, 12.345679012345679, 5.750868055555555, 1683.7625385802469], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 727.0, 727, 727, 727.0, 727.0, 727.0, 727.0, 1.375515818431912, 0.6299969910591472, 2630.598779229711], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 2.245999999999999, 1, 19, 2.0, 3.0, 4.0, 9.990000000000009, 0.574608289529028, 0.4829470445309932, 0.2440962948682883], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 408.4340000000001, 319, 523, 409.0, 476.0, 482.95, 505.9200000000001, 0.5743126052427849, 0.5056609365344369, 0.2669656250933258], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 2.916, 2, 12, 3.0, 4.0, 4.0, 8.990000000000009, 0.5745911209583261, 0.5204953869670093, 0.2816843190635544], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 1154.0540000000008, 933, 1420, 1145.0, 1340.0, 1369.9, 1400.98, 0.5738189371725645, 0.5427710738591045, 0.30428094031709235], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 69.0, 69, 69, 69.0, 69.0, 69.0, 69.0, 14.492753623188406, 6.77932518115942, 954.3280117753623], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 3, 0.6, 45.17799999999999, 13, 640, 44.0, 52.0, 61.0, 102.99000000000001, 0.5736168377192077, 0.3088814636579316, 26.23848894410907], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 43.46199999999997, 12, 202, 43.0, 53.0, 62.0, 89.99000000000001, 0.574227520428144, 128.47555019968763, 0.1783245620079588], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 295.0, 295, 295, 295.0, 295.0, 295.0, 295.0, 3.389830508474576, 1.7776747881355932, 1.39698093220339], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 2.2580000000000027, 1, 18, 2.0, 3.0, 4.0, 7.990000000000009, 0.5772272312718625, 0.6271675333493033, 0.24859102440516734], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 3.164, 2, 20, 3.0, 4.0, 6.0, 11.0, 0.5772219002606734, 0.5922454530787862, 0.21363974628788596], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 2.253999999999998, 1, 11, 2.0, 3.0, 4.0, 7.990000000000009, 0.5771959129911792, 0.32729488405288504, 0.22490348562839899], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 123.046, 88, 266, 123.0, 148.90000000000003, 153.0, 162.0, 0.5771332866240126, 0.5257796962489799, 0.18937185967350414], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 6, 1.2, 173.3600000000001, 38, 592, 173.0, 208.0, 239.69999999999993, 344.82000000000016, 0.5739809828620758, 0.30854056259033025, 169.7952337193164], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 2.2559999999999985, 1, 12, 2.0, 3.0, 4.0, 7.0, 0.5772172357066582, 0.32183355760628013, 0.24294983260700165], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 3.3320000000000003, 2, 15, 3.0, 5.0, 6.0, 9.0, 0.5772752148041075, 0.31042749177960094, 0.24692045320722564], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 11.628000000000014, 7, 332, 10.0, 15.0, 19.94999999999999, 43.940000000000055, 0.573416853409422, 0.242242861605269, 0.41718315995119076], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 4.552, 2, 68, 4.0, 5.0, 6.0, 12.990000000000009, 0.5772305632038605, 0.296841944531029, 0.23337251285781077], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 3.611999999999998, 2, 14, 3.0, 5.0, 5.949999999999989, 10.980000000000018, 0.5746016861111877, 0.35292102897084243, 0.2884231119737798], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 3.928000000000001, 2, 35, 4.0, 5.0, 5.0, 11.0, 0.5745798959091061, 0.33660281863040836, 0.27213989210538714], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 520.3819999999987, 389, 821, 509.0, 631.9000000000001, 642.95, 699.7900000000002, 0.5740402907399265, 0.5244485912477225, 0.25394555830584636], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 16.062000000000005, 6, 106, 15.0, 24.0, 31.0, 47.99000000000001, 0.5743528479285964, 0.5085008259911894, 0.2372570846423792], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 9.366000000000014, 5, 45, 10.0, 12.0, 13.0, 18.980000000000018, 0.574456449307665, 0.382962738313258, 0.269837453239245], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 518.4259999999991, 434, 3512, 507.5, 561.8000000000001, 588.95, 657.8500000000001, 0.5741965268000487, 0.43154121274038737, 0.318499635959402], "isController": false}, {"data": ["Query single patient #2", 500, 0, 0.0, 173.45400000000006, 143, 246, 180.0, 192.0, 194.95, 206.99, 0.5772925441513338, 11.161896092465524, 0.2920288455765536], "isController": false}, {"data": ["Query single patient #1", 500, 0, 0.0, 261.31800000000004, 210, 371, 266.0, 287.0, 291.95, 331.98, 0.5771386159985133, 1.118704301442962, 0.41369115638955933], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 17.774000000000008, 11, 38, 19.0, 21.0, 22.0, 27.99000000000001, 0.5767644666947358, 0.47067810558827095, 0.35709831238717044], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 17.371999999999993, 11, 33, 19.0, 21.0, 23.0, 27.0, 0.5767717852471005, 0.47966346844308533, 0.36611490274474157], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 17.197999999999997, 11, 81, 18.0, 21.0, 23.0, 33.99000000000001, 0.5767378553426111, 0.4668445121951219, 0.3531392922849777], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 20.084000000000007, 13, 35, 21.0, 25.0, 26.0, 29.0, 0.5767531565700259, 0.5158910544287721, 0.40215015018652195], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 16.43799999999999, 10, 42, 18.0, 20.0, 21.0, 25.0, 0.5765130874235976, 0.43271923819848884, 0.31922160211833966], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 2143.439999999998, 1726, 2695, 2118.5, 2436.7000000000003, 2487.9, 2620.98, 0.5753965057321, 0.48076738078647496, 0.36748956518436854], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["No results for path: $['rows'][1]", 500, 98.23182711198429, 2.1272069772388855], "isController": false}, {"data": ["500", 9, 1.768172888015717, 0.03828972559029994], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 23505, 509, "No results for path: $['rows'][1]", 500, "500", 9, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["Query cross patient #1", 500, 500, "No results for path: $['rows'][1]", 500, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 3, "500", 3, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 6, "500", 6, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});

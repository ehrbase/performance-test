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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8885768985322272, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Query cross patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.183, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.575, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [1.0, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [0.915, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [0.995, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.496, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.1, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 23505, 500, 2.1272069772388855, 326.72512231440106, 1, 18245, 9.0, 851.0, 1510.0, 6073.990000000002, 15.175246496877792, 95.59280001375166, 125.57645978018974], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query cross patient #1", 500, 500, 100.0, 6202.202000000005, 5241, 18245, 6055.0, 6506.7, 6768.25, 15689.130000000077, 0.3273091002403758, 0.19009179199604873, 0.16493310129300187], "isController": false}, {"data": ["Query participation #2", 500, 0, 0.0, 2.3820000000000006, 1, 11, 2.0, 3.0, 3.0, 6.0, 0.32841477472388525, 0.1686044250196228, 0.11866549477327887], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 3.6839999999999997, 2, 14, 4.0, 5.0, 5.0, 7.0, 0.3284121861939458, 0.18848742768363658, 0.13854889105057086], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 0, 0.0, 13.435999999999993, 9, 406, 12.0, 16.0, 20.0, 31.0, 0.3265003343363424, 0.1698535088909306, 3.592460221648017], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 34.10800000000003, 25, 49, 34.0, 41.0, 42.0, 43.0, 0.32839471468410397, 1.3657596243870513, 0.1366173324760042], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 2.3999999999999986, 1, 11, 2.0, 3.0, 4.0, 5.990000000000009, 0.3284033423578572, 0.20515908412084455, 0.13886586644624235], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 30.03800000000001, 22, 50, 30.0, 36.0, 37.0, 40.99000000000001, 0.32839406762684714, 1.3477978827695574, 0.11929940738006557], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 866.0399999999998, 677, 1103, 867.0, 1019.8000000000001, 1060.9, 1087.94, 0.32820932928454305, 1.3880658441658824, 0.1596174277184594], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 5.63, 4, 17, 5.0, 7.0, 8.949999999999989, 13.0, 0.3283492112066899, 0.48826233144193243, 0.16770179439560431], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 3.992000000000001, 2, 17, 4.0, 5.0, 5.0, 9.0, 0.3266840070537611, 0.31510650449909217, 0.1786553163575256], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 7.701999999999994, 5, 24, 7.0, 9.0, 10.0, 15.990000000000009, 0.3283932048878045, 0.5351494384065705, 0.21454595124017692], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 489.0, 489, 489, 489.0, 489.0, 489.0, 489.0, 2.044989775051125, 0.8846977249488752, 2418.793535915133], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 4.173999999999997, 3, 15, 4.0, 5.0, 6.0, 9.990000000000009, 0.3266859280689856, 0.3281885557264123, 0.19173656520455112], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 7.936000000000009, 5, 33, 8.0, 10.0, 11.0, 14.990000000000009, 0.3283914794233183, 0.5159049383428578, 0.19530313571171956], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 6.5500000000000025, 4, 25, 6.0, 8.0, 8.0, 12.0, 0.32838975397696407, 0.5082055927976903, 0.1876054746841055], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 1571.0819999999999, 1331, 1976, 1538.5, 1771.8000000000002, 1814.0, 1902.99, 0.32805040953813125, 0.5009528377918665, 0.18068401462842387], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 11.928000000000003, 8, 75, 11.0, 14.0, 17.0, 33.0, 0.326485837044389, 0.16984596704288718, 2.632292061170386], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 10.892000000000005, 8, 22, 11.0, 13.0, 15.0, 19.99000000000001, 0.32839751862834926, 0.5944860979067942, 0.27387839932481467], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 7.633999999999999, 5, 22, 7.0, 9.0, 10.0, 14.0, 0.3283970872491949, 0.5560012833347673, 0.23539400589932527], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 81.0, 81, 81, 81.0, 81.0, 81.0, 81.0, 12.345679012345679, 5.823206018518518, 1683.7384259259259], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 529.0, 529, 529, 529.0, 529.0, 529.0, 529.0, 1.890359168241966, 0.8768755907372401, 3615.204838137996], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 2.3500000000000005, 1, 15, 2.0, 3.0, 4.0, 7.0, 0.32669361235581373, 0.2745981045808325, 0.13814290444342514], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 568.8140000000005, 446, 707, 554.5, 655.0, 672.95, 688.9300000000001, 0.3265905449424515, 0.28758785183599406, 0.15117570146750195], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 3.3700000000000006, 2, 14, 3.0, 4.0, 5.0, 8.990000000000009, 0.32669446618777614, 0.29597433908892756, 0.15951878231825006], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 774.9180000000001, 627, 955, 754.5, 901.0, 920.0, 935.0, 0.3265455400410141, 0.308913994231573, 0.17252064175994983], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 62.0, 62, 62, 62.0, 62.0, 62.0, 62.0, 16.129032258064516, 7.639238911290323, 1062.043220766129], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 0, 0.0, 25.197999999999983, 17, 939, 23.0, 27.0, 31.0, 76.82000000000016, 0.32628769438589394, 0.16974288835577103, 14.883689653090922], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 30.59600000000001, 21, 278, 29.0, 34.900000000000034, 39.94999999999999, 158.48000000000047, 0.3266532738824375, 73.87937192231368, 0.10080315873715845], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 441.0, 441, 441, 441.0, 441.0, 441.0, 441.0, 2.2675736961451247, 1.1891475340136055, 0.9300595238095238], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 2.655999999999999, 1, 8, 3.0, 3.0, 4.0, 6.0, 0.32836732482424136, 0.3568140683644352, 0.14077466366976754], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 3.492, 2, 28, 3.0, 4.0, 5.0, 8.0, 0.32836603092813976, 0.33693112534815006, 0.12089257193350457], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 1.8760000000000017, 1, 13, 2.0, 3.0, 3.0, 5.990000000000009, 0.32841585329007006, 0.18624450211335603, 0.12732528687124783], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 92.19800000000004, 66, 120, 91.0, 111.0, 114.0, 118.0, 0.32839795000863686, 0.29912114448491767, 0.10711417510047336], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 0, 0.0, 83.28599999999999, 59, 415, 81.0, 94.0, 106.84999999999997, 296.0, 0.32656964064929883, 0.1698895637405156, 96.56447411347773], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 200.9839999999999, 13, 352, 259.0, 334.0, 337.0, 344.99, 0.3283617180147776, 0.1830071446173962, 0.1375656025667379], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 437.6640000000001, 347, 541, 426.0, 511.0, 520.0, 537.97, 0.3283226913004993, 0.17657284113876756, 0.13979364590529073], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 7.494, 4, 272, 6.0, 9.0, 11.0, 29.940000000000055, 0.3262329812409511, 0.14709475563355423, 0.23671006353713545], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 408.838, 311, 514, 408.5, 473.0, 482.0, 503.96000000000004, 0.32829639123474896, 0.16886425022192836, 0.13208800116085606], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 3.542, 2, 12, 3.0, 5.0, 5.0, 8.990000000000009, 0.3266914777954336, 0.20058027246559285, 0.1633457388977168], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 4.198000000000003, 2, 24, 4.0, 5.0, 6.0, 9.980000000000018, 0.32668720875835344, 0.19132576754342978, 0.15409172053738737], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 684.7600000000003, 541, 877, 689.5, 791.0, 835.0, 852.99, 0.32653530369089384, 0.2983812002115296, 0.14381584176229797], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 246.78799999999993, 175, 314, 241.0, 289.0, 298.95, 307.99, 0.3266468718662316, 0.28923240741194417, 0.1342952471246909], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 4.522000000000003, 3, 42, 4.0, 5.0, 6.0, 10.0, 0.32668763565704073, 0.21780558177677567, 0.15281579832004152], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 990.3640000000001, 812, 8508, 945.5, 1081.8000000000002, 1115.95, 1161.8100000000002, 0.3264841315652694, 0.24540830166709326, 0.18045900240814694], "isController": false}, {"data": ["Query single patient #2", 500, 0, 0.0, 134.74000000000007, 118, 165, 135.0, 150.0, 151.0, 155.0, 0.3284020481778941, 6.349547768828275, 0.16548384458964194], "isController": false}, {"data": ["Query single patient #1", 500, 0, 0.0, 183.00399999999996, 160, 247, 182.0, 203.0, 205.0, 213.97000000000003, 0.3283802643461128, 0.6364644477054429, 0.23474057959116656], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 6.943999999999996, 5, 20, 7.0, 8.0, 9.949999999999989, 15.990000000000009, 0.3283453299772063, 0.26797019112817483, 0.202650633345307], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 6.843999999999994, 5, 22, 7.0, 9.0, 10.0, 14.0, 0.32834705495676, 0.2731020216574434, 0.2077821207148247], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 8.163999999999989, 6, 19, 8.0, 10.0, 11.0, 14.0, 0.3283418800724716, 0.26572285101060344, 0.20040397953642064], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 9.60200000000001, 7, 31, 9.0, 12.0, 13.0, 16.0, 0.3283433893968726, 0.2936204346724709, 0.22830126294001296], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 7.515999999999998, 5, 27, 7.0, 9.0, 9.0, 18.0, 0.3283069538695899, 0.24645785010653562, 0.18114592669562335], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 1629.6120000000003, 1385, 1987, 1603.0, 1828.9, 1889.6999999999998, 1957.99, 0.3279957491750907, 0.27409105715489923, 0.20884104342007725], "isController": false}]}, function(index, item){
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

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

    var data = {"OkPercent": 100.0, "KoPercent": 0.0};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9149284253578732, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.001, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.997, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [1.0, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [0.818, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.719, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.725, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 22005, 0, 0.0, 191.2849352419906, 1, 3708, 12.0, 573.0, 1244.0, 2133.9900000000016, 25.70950883797226, 172.8514518263624, 226.47080517978546], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query participation #2", 500, 0, 0.0, 6.931999999999997, 4, 19, 6.0, 9.0, 11.949999999999989, 18.0, 0.5949406249256325, 6.360492791178816, 0.21496878049070703], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 7.259999999999993, 4, 35, 7.0, 9.0, 10.0, 15.990000000000009, 0.5949215120049212, 6.387760583058777, 0.2509825128770761], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 0, 0.0, 20.09999999999997, 13, 251, 18.0, 24.0, 28.94999999999999, 47.99000000000001, 0.5910500832198516, 0.3185205839101982, 6.580049754596005], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 41.49200000000005, 24, 85, 43.0, 51.0, 53.0, 58.99000000000001, 0.5948075678556473, 2.4739115541964867, 0.24744924209619706], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 2.160000000000002, 1, 10, 2.0, 3.0, 4.0, 6.0, 0.5948394112041572, 0.37177463200259825, 0.25152877446425786], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 36.89400000000002, 22, 99, 38.0, 46.0, 48.0, 52.99000000000001, 0.5947969541637571, 2.440665658089298, 0.21607858100480237], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 759.9000000000004, 563, 1022, 768.0, 902.0, 919.8499999999999, 951.96, 0.5944455012364467, 2.5142026033740725, 0.2890955660310063], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 8.192000000000009, 5, 36, 8.0, 10.0, 11.0, 17.99000000000001, 0.5945593066962837, 0.8842908438461329, 0.3036665209005433], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 3.267999999999999, 1, 18, 3.0, 4.0, 5.0, 9.0, 0.5919730818000244, 0.5711615281429923, 0.3237352791093883], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 12.338000000000005, 8, 30, 13.0, 15.0, 17.0, 24.0, 0.5947799730445716, 0.9694216552845605, 0.3885818378582211], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 600.0, 600, 600, 600.0, 600.0, 600.0, 600.0, 1.6666666666666667, 0.7112630208333334, 1971.3167317708335], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 4.206000000000002, 2, 21, 4.0, 5.0, 7.0, 10.0, 0.5919842958405999, 0.5942042369500022, 0.3474439080080084], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 13.348, 9, 35, 14.0, 16.0, 18.0, 25.99000000000001, 0.5947672378414708, 0.9338774957920218, 0.3537238748490778], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 8.067999999999998, 5, 32, 8.0, 10.0, 11.0, 17.99000000000001, 0.5947615779262567, 0.9206026377081219, 0.33978078426451186], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 1862.9440000000009, 1451, 2259, 1854.0, 2103.9, 2155.95, 2238.88, 0.5935521245604747, 0.9065581277466624, 0.32691738110557395], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 17.23800000000002, 11, 140, 15.0, 22.0, 27.0, 45.960000000000036, 0.5910039739107206, 0.31916523200451996, 4.764969539655184], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 16.720000000000024, 11, 39, 17.0, 20.0, 21.94999999999999, 27.99000000000001, 0.5947983693007907, 1.0769103287926427, 0.49605254627233913], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 12.29800000000001, 8, 37, 13.0, 15.0, 17.0, 26.980000000000018, 0.5947891710304365, 1.0071918189128681, 0.42634301907845745], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 74.0, 74, 74, 74.0, 74.0, 74.0, 74.0, 13.513513513513514, 6.294869087837838, 1843.0109797297298], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 535.0, 535, 535, 535.0, 535.0, 535.0, 535.0, 1.8691588785046729, 0.8560893691588785, 3574.6604848130837], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 2.0560000000000014, 1, 15, 2.0, 3.0, 3.9499999999999886, 7.0, 0.5919261276192731, 0.4977035116017521, 0.250296887948384], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 392.19600000000014, 307, 520, 390.0, 464.0, 472.9, 495.96000000000004, 0.591713175322247, 0.5205457977122002, 0.2738984815456495], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 3.0040000000000022, 1, 19, 3.0, 4.0, 5.0, 11.0, 0.5919597656786463, 0.5364635376462732, 0.28904285433527654], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 1118.2919999999997, 911, 1385, 1111.5, 1297.0, 1331.95, 1365.97, 0.5913240929088415, 0.5595635215123705, 0.3124085295543782], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 63.0, 63, 63, 63.0, 63.0, 63.0, 63.0, 15.873015873015872, 7.424975198412699, 1045.1853918650793], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 0, 0.0, 41.236000000000004, 28, 582, 40.5, 47.0, 54.0, 79.0, 0.5906067539425953, 0.3189507177053274, 27.01449134879227], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 40.53399999999997, 28, 167, 40.0, 49.0, 55.0, 83.99000000000001, 0.5913835417960318, 133.82766991188385, 0.1824972648511192], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 308.0, 308, 308, 308.0, 308.0, 308.0, 308.0, 3.246753246753247, 1.7026430600649352, 1.3316761363636365], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 2.0540000000000025, 1, 9, 2.0, 3.0, 4.0, 7.0, 0.5949788544515128, 0.64669088379349, 0.2550739424845841], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 3.0879999999999996, 2, 13, 3.0, 4.0, 6.0, 9.990000000000009, 0.5949703585767356, 0.6106580535782707, 0.21904670428069273], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 1.9699999999999986, 1, 17, 2.0, 3.0, 3.0, 9.970000000000027, 0.5949526596168743, 0.3375659133177773, 0.2306603572928702], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 118.83200000000002, 84, 192, 119.0, 144.0, 148.0, 156.99, 0.5948797510071314, 0.5420144606344274, 0.1940330437855292], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 0, 0.0, 161.00999999999993, 109, 653, 161.0, 187.0, 214.95, 325.5500000000004, 0.5911451190329812, 0.31924145588402203, 174.87157926487558], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 2.2080000000000006, 1, 15, 2.0, 3.0, 4.0, 6.990000000000009, 0.5949646947950108, 0.3310885563300674, 0.24925766998736296], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 453.6080000000001, 340, 625, 462.0, 531.8000000000001, 540.9, 571.97, 0.5947445988269258, 0.6463433392173399, 0.2555543198084447], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 11.405999999999997, 6, 314, 10.0, 14.0, 18.94999999999999, 40.98000000000002, 0.5904072983788596, 0.2496546486309045, 0.4283912331010671], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 2.8239999999999985, 1, 19, 3.0, 3.900000000000034, 5.0, 9.980000000000018, 0.5949838104905166, 0.6333323764010381, 0.24171217301177234], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 3.557999999999998, 2, 30, 3.0, 4.0, 6.0, 10.990000000000009, 0.591919820908739, 0.3635913743667938, 0.29595991045436953], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 3.923999999999995, 2, 26, 4.0, 5.0, 6.949999999999989, 10.0, 0.5919030036709825, 0.3468181662134663, 0.27918862380184034], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 518.8919999999998, 370, 840, 526.0, 630.0, 637.95, 662.99, 0.5913170997078894, 0.5398309350497298, 0.260433605437752], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 16.725999999999978, 6, 120, 15.0, 26.0, 34.0, 54.97000000000003, 0.5914954780170705, 0.5239124985951982, 0.2431831994581901], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 6.821999999999995, 4, 43, 7.0, 8.0, 9.0, 13.990000000000009, 0.5919948093895112, 0.3948559129033557, 0.276919446970289], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 513.6800000000002, 347, 3708, 503.0, 557.9000000000001, 576.9, 622.9300000000001, 0.591781807680381, 0.44499217960341153, 0.3270981476045856], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 12.572000000000006, 8, 48, 13.0, 15.0, 16.0, 23.99000000000001, 0.594540218267605, 0.48538635007003683, 0.3669427909620374], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 12.163999999999982, 8, 29, 13.0, 15.0, 16.0, 20.980000000000018, 0.5945479948868873, 0.4940089999702726, 0.3762374030143583], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 12.746000000000018, 8, 35, 13.0, 15.0, 17.0, 25.0, 0.594523251804378, 0.48130837475178656, 0.3628681956813831], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 15.364, 10, 40, 16.0, 19.0, 20.0, 24.0, 0.5945310279798193, 0.5318265836225726, 0.41338485539221803], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 11.982000000000003, 8, 35, 12.0, 14.900000000000034, 16.0, 21.99000000000001, 0.5943833154225828, 0.44636793902340444, 0.3279556379040618], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 2099.1840000000007, 1677, 2679, 2082.0, 2370.9, 2439.9, 2588.9, 0.5932239586546629, 0.4952261414222189, 0.3777168174246487], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": []}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 22005, 0, null, null, null, null, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});

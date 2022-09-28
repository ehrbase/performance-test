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

    var data = {"OkPercent": 97.8557753669432, "KoPercent": 2.1442246330567962};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9002552648372687, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Query cross patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.979, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.499, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.997, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [1.0, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [0.995, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.727, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.618, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #2"], "isController": false}, {"data": [0.998, 500, 1500, "Query single patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 23505, 504, 2.1442246330567962, 188.28623697085703, 1, 3710, 17.0, 548.0, 1212.9500000000007, 2241.0, 26.188277055370296, 175.91720008998217, 216.97300113839066], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query cross patient #1", 500, 500, 100.0, 25.684000000000008, 17, 49, 27.0, 30.0, 31.94999999999999, 41.99000000000001, 0.5677282807030293, 0.329720396305565, 0.28719067324625897], "isController": false}, {"data": ["Query participation #2", 500, 0, 0.0, 7.383999999999993, 4, 26, 7.0, 10.0, 12.0, 19.99000000000001, 0.5676876718674426, 6.067866058848208, 0.2062302870455944], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 7.784000000000007, 5, 40, 7.0, 9.0, 11.0, 17.99000000000001, 0.5676651139133584, 6.095554731573874, 0.2405924408578101], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 0, 0.0, 22.276000000000014, 14, 272, 20.0, 28.0, 32.94999999999999, 47.98000000000002, 0.5640431515572667, 0.3044775437500071, 6.280488294976519], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 42.44400000000002, 26, 83, 44.0, 52.0, 53.0, 57.0, 0.5675504183414134, 2.3604155859560785, 0.2372183389161376], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 2.714000000000004, 1, 14, 3.0, 3.900000000000034, 4.0, 7.0, 0.5675761885896753, 0.3546386742583766, 0.2411090254262781], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 36.75200000000002, 23, 54, 38.0, 45.0, 46.0, 50.0, 0.5675446203580526, 2.3293217299072175, 0.2072868047010856], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 769.3679999999998, 593, 972, 764.0, 917.0, 932.9, 953.98, 0.5671956711626377, 2.3987890283796354, 0.2769510113098817], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 11.630000000000003, 7, 25, 12.0, 15.0, 16.0, 19.99000000000001, 0.5672329920859653, 0.8434555174469524, 0.290817696137824], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 3.4579999999999966, 2, 21, 3.0, 5.0, 6.0, 11.990000000000009, 0.5648945172467945, 0.5449069604607731, 0.3100299987233384], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 18.15600000000001, 11, 31, 19.0, 23.0, 24.0, 28.99000000000001, 0.5675291596482227, 0.9248452968716658, 0.37188678332417724], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 661.0, 661, 661, 661.0, 661.0, 661.0, 661.0, 1.5128593040847202, 0.6456245272314675, 1789.397870177761], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 4.690000000000002, 3, 32, 4.0, 6.0, 7.949999999999989, 14.0, 0.5649021758902011, 0.5675644980589961, 0.332652355529093], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 18.84599999999998, 12, 33, 20.0, 24.0, 25.0, 30.0, 0.567514988070835, 0.8916336603496573, 0.338624665733672], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 10.810000000000006, 7, 27, 11.0, 14.0, 15.0, 20.0, 0.5675136997807128, 0.8782983896231256, 0.32532279469851405], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 1995.068, 1520, 2571, 1992.5, 2239.9, 2310.95, 2453.5700000000006, 0.566271296047766, 0.864698481062189, 0.31299761090140193], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 19.005999999999997, 12, 113, 17.0, 24.0, 28.94999999999999, 47.0, 0.5639814382429045, 0.3044442301314979, 4.548201872079987], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 22.702000000000005, 15, 46, 23.0, 28.0, 30.0, 35.99000000000001, 0.5675433319333931, 1.0273709300048808, 0.4744307540380708], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 17.919999999999995, 11, 34, 19.0, 22.0, 24.0, 26.0, 0.5675401108973377, 0.9608564925169837, 0.40791945470746144], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 84.0, 84, 84, 84.0, 84.0, 84.0, 84.0, 11.904761904761903, 5.545479910714286, 1623.628162202381], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 709.0, 709, 709, 709.0, 709.0, 709.0, 709.0, 1.4104372355430184, 0.6459912729196051, 2697.384079689704], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 2.4299999999999997, 1, 28, 2.0, 3.0, 4.0, 8.990000000000009, 0.5648823914860926, 0.47480461247655736, 0.23996468778950222], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 415.14600000000013, 321, 572, 411.5, 483.90000000000003, 497.0, 519.99, 0.5646718691768213, 0.49717262619004593, 0.26248418918766303], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 3.2099999999999995, 1, 24, 3.0, 4.0, 5.0, 12.0, 0.5649091964957552, 0.5117569784645316, 0.2769379068758488], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 1166.5620000000008, 944, 1707, 1161.0, 1349.7, 1375.85, 1451.98, 0.5642824978754764, 0.5337825880196054, 0.2992240198695153], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 62.0, 62, 62, 62.0, 62.0, 62.0, 62.0, 16.129032258064516, 7.544732862903226, 1062.074722782258], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 1, 0.2, 45.175999999999995, 13, 760, 43.0, 51.0, 57.94999999999999, 96.92000000000007, 0.5635053640075599, 0.30389448066218644, 25.77596801768956], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 44.994000000000035, 11, 195, 46.0, 53.0, 58.0, 89.0, 0.5643812237139445, 127.2354908786823, 0.17526682533304136], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 286.0, 286, 286, 286.0, 286.0, 286.0, 286.0, 3.4965034965034967, 1.8336156031468533, 1.4409418706293708], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 2.338000000000002, 1, 7, 2.0, 3.0, 4.0, 7.0, 0.5677276360729598, 0.6168782126287606, 0.24449989014470244], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 3.4039999999999995, 2, 21, 3.0, 5.0, 6.0, 10.990000000000009, 0.5677218344682092, 0.5825302819278244, 0.2101236086557142], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 2.356000000000004, 1, 10, 2.0, 3.0, 4.0, 7.990000000000009, 0.567703785789466, 0.3219445951619148, 0.2212048930957001], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 123.388, 89, 195, 122.0, 150.0, 155.0, 170.93000000000006, 0.5676399800190727, 0.5170989570324916, 0.18625686844375822], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 2, 0.4, 168.16600000000005, 38, 613, 168.5, 197.0, 210.95, 378.62000000000035, 0.5641398841256678, 0.3041033507793593, 166.88403681576884], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 2.346, 1, 12, 2.0, 3.0, 4.0, 7.990000000000009, 0.5677173221909346, 0.3164724689032837, 0.23895133385184847], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 3.4000000000000017, 1, 15, 3.0, 5.0, 6.0, 11.0, 0.5677695400726064, 0.3053801699674895, 0.24285454936699374], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 12.057999999999987, 7, 347, 10.0, 14.0, 20.0, 42.950000000000045, 0.5633028473832329, 0.2380020542246587, 0.4098248254887779], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 4.930000000000007, 2, 62, 5.0, 6.0, 7.0, 14.0, 0.5677302146020212, 0.2919885283013512, 0.2295315516066765], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 3.94, 2, 22, 4.0, 5.0, 6.949999999999989, 11.990000000000009, 0.5648753715467756, 0.3468511304850811, 0.28354095798344015], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 4.102000000000004, 2, 32, 4.0, 5.0, 6.0, 9.0, 0.5648562271445049, 0.3308424703535209, 0.2675344435205907], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 523.1540000000005, 384, 797, 518.5, 635.0, 650.0, 689.97, 0.5643506468587115, 0.5156280069307903, 0.24965902639355103], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 17.35200000000002, 7, 172, 17.0, 26.0, 33.94999999999999, 48.97000000000003, 0.5644991030109253, 0.499808828850646, 0.23318664118517715], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 9.849999999999998, 6, 56, 10.0, 12.0, 13.0, 17.980000000000018, 0.5649123877377857, 0.37663216428951535, 0.26535435400573726], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 544.3739999999998, 449, 3710, 530.0, 596.0, 627.8499999999999, 719.98, 0.5646489125991242, 0.424365639885557, 0.31320369370732665], "isController": false}, {"data": ["Query single patient #2", 500, 0, 0.0, 173.3759999999999, 141, 295, 181.0, 191.0, 195.0, 210.95000000000005, 0.567563947429957, 10.973730311561392, 0.28710754371945085], "isController": false}, {"data": ["Query single patient #1", 500, 1, 0.2, 261.0920000000001, 24, 328, 269.0, 288.0, 291.95, 301.0, 0.5676386911614115, 1.0984518222337263, 0.4068816399535899], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 18.851999999999993, 12, 48, 19.0, 23.0, 24.0, 32.99000000000001, 0.5672066095451798, 0.4629103863896505, 0.35118065473793353], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 18.350000000000005, 11, 42, 19.0, 22.0, 24.0, 31.99000000000001, 0.5672136875469369, 0.4717467494401601, 0.36004775088428614], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 18.095999999999986, 12, 36, 19.0, 23.0, 24.0, 29.980000000000018, 0.5671853765997464, 0.4590479396424009, 0.34729026477347746], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 21.354000000000003, 14, 44, 22.0, 26.0, 28.0, 32.99000000000001, 0.5671969580092748, 0.5072790246736348, 0.39548694142443575], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 17.65, 11, 47, 19.0, 22.0, 23.0, 27.0, 0.5670149272349744, 0.42562222446193115, 0.31396236693577195], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 2179.5940000000014, 1748, 2690, 2167.5, 2466.8, 2559.95, 2655.9700000000003, 0.5658976494875231, 0.4728627495891583, 0.36142291285628914], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["No results for path: $['rows'][1]", 500, 99.2063492063492, 2.1272069772388855], "isController": false}, {"data": ["400", 1, 0.1984126984126984, 0.0042544139544777706], "isController": false}, {"data": ["500", 3, 0.5952380952380952, 0.012763241863433313], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 23505, 504, "No results for path: $['rows'][1]", 500, "500", 3, "400", 1, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["Query cross patient #1", 500, 500, "No results for path: $['rows'][1]", 500, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 1, "500", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 2, "500", 2, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Query single patient #1", 500, 1, "400", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});

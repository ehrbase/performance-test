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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.916927970915701, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.003, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.997, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [1.0, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [0.856, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.741, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.751, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 22005, 0, 0.0, 190.2001817768699, 1, 3670, 12.0, 569.0, 1267.9500000000007, 2133.9900000000016, 25.87916236425347, 174.0159819336868, 227.96525499369045], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query participation #2", 500, 0, 0.0, 6.783999999999996, 4, 22, 6.0, 9.0, 12.0, 18.0, 0.5989150055758987, 6.427332416469325, 0.21640483599910404], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 7.252000000000002, 5, 37, 7.0, 9.0, 10.0, 16.980000000000018, 0.5988920497080401, 6.430392835753856, 0.2526575834705794], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 0, 0.0, 19.691999999999997, 13, 229, 18.0, 24.900000000000034, 30.0, 44.0, 0.5950404568006579, 0.32067102117272955, 6.624473835476074], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 41.19200000000003, 25, 77, 42.0, 51.0, 53.0, 56.99000000000001, 0.5986561367043262, 2.4899184435778565, 0.2490503068711357], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 2.1920000000000024, 1, 13, 2.0, 3.0, 3.9499999999999886, 6.0, 0.5986833755205552, 0.37417710970034695, 0.253154200781641], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 36.38799999999999, 22, 51, 37.0, 45.0, 46.0, 49.0, 0.5986461019757716, 2.4564600948494886, 0.21747690423338578], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 760.6539999999999, 569, 961, 757.5, 904.0, 916.95, 938.97, 0.5982800644706598, 2.530420858615652, 0.29096042197889505], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 7.676000000000001, 5, 20, 8.0, 10.0, 11.0, 15.990000000000009, 0.5984977705958046, 0.8901485396654398, 0.3056780605679744], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 3.180000000000001, 1, 16, 3.0, 4.0, 6.0, 9.990000000000009, 0.5959489772323653, 0.5749976460015399, 0.3259095969239497], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 11.785999999999994, 7, 23, 12.0, 14.0, 15.949999999999989, 19.0, 0.5986410847376455, 0.9757148148702445, 0.39110438055613755], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 601.0, 601, 601, 601.0, 601.0, 601.0, 601.0, 1.663893510815308, 0.7100795549084858, 1968.0366706530783], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 4.076000000000002, 2, 21, 4.0, 5.0, 7.0, 12.0, 0.5959582114102159, 0.5981930547030042, 0.34977625493900366], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 12.565999999999999, 8, 31, 13.0, 15.0, 16.0, 21.0, 0.5986353508541927, 0.9399510376146537, 0.35602434440449554], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 7.699999999999996, 4, 26, 8.0, 10.0, 11.0, 15.0, 0.5986346341264843, 0.9265975537992945, 0.3419934189101497], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 1834.1339999999989, 1450, 2283, 1824.0, 2085.3, 2156.95, 2232.98, 0.5974757843064621, 0.9125509049368229, 0.32907845932504354], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 16.715999999999973, 11, 117, 15.0, 21.0, 25.94999999999999, 40.0, 0.5950050515928881, 0.3213259702449874, 4.79722822846766], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 15.947999999999986, 10, 27, 17.0, 19.0, 20.0, 23.99000000000001, 0.5986539863770298, 1.083891104241224, 0.4992680706699058], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 11.586000000000004, 7, 29, 12.0, 14.0, 15.0, 20.0, 0.5986482522464276, 1.0137266302688528, 0.429109196434451], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 77.0, 77, 77, 77.0, 77.0, 77.0, 77.0, 12.987012987012989, 6.0496144480519485, 1771.205357142857], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 588.0, 588, 588, 588.0, 588.0, 588.0, 588.0, 1.7006802721088434, 0.7789248511904763, 3252.454692814626], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 2.0659999999999985, 1, 22, 2.0, 2.0, 3.9499999999999886, 8.0, 0.5958992596547599, 0.5010442017214338, 0.2519769330376084], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 395.154, 308, 527, 394.0, 459.0, 466.0, 492.0, 0.5956912460788624, 0.5240454122242992, 0.2757398932044734], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 2.931999999999998, 1, 14, 3.0, 4.0, 5.0, 12.0, 0.5959305097351209, 0.5400620244474532, 0.29098169420660197], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 1141.9440000000002, 916, 1436, 1145.0, 1334.8000000000002, 1357.95, 1391.95, 0.5952820327214627, 0.5633088766670873, 0.3144995895530384], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 53.0, 53, 53, 53.0, 53.0, 53.0, 53.0, 18.867924528301884, 8.82591391509434, 1242.3901827830189], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 0, 0.0, 39.16799999999997, 26, 599, 38.0, 44.0, 51.0, 76.99000000000001, 0.594589709316983, 0.3211016691916909, 27.19667266112192], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 38.063999999999986, 27, 169, 38.0, 46.0, 52.0, 73.99000000000001, 0.5953529132999459, 134.7259224025943, 0.1837221880886552], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 263.0, 263, 263, 263.0, 263.0, 263.0, 263.0, 3.802281368821293, 1.9939698193916349, 1.5595294676806084], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 1.8920000000000008, 1, 9, 2.0, 3.0, 3.0, 5.990000000000009, 0.5989243318999078, 0.650979278715427, 0.2567654118203706], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 2.914000000000002, 1, 14, 3.0, 4.0, 6.0, 9.0, 0.5989178751831191, 0.614709655095174, 0.22050003803128507], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 1.9800000000000002, 1, 17, 2.0, 3.0, 4.0, 9.0, 0.5989272015965003, 0.33982100012457683, 0.2322012685877057], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 118.77000000000011, 79, 187, 118.5, 146.0, 150.0, 154.99, 0.5988497294396923, 0.5456316382492509, 0.19532793909458712], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 0, 0.0, 153.8959999999999, 106, 523, 153.0, 179.0, 205.95, 330.7700000000002, 0.5951077383049427, 0.3213814250806966, 176.043794796735], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 2.1859999999999986, 1, 16, 2.0, 3.0, 4.0, 8.990000000000009, 0.5989128533885292, 0.33328564489738227, 0.25091173252312404], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 449.5520000000002, 337, 584, 456.0, 518.0, 527.0, 552.97, 0.5986948452373825, 0.6506363003652039, 0.2572516913129378], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 10.90199999999999, 6, 297, 9.0, 14.0, 18.0, 29.99000000000001, 0.5944052203044068, 0.25134517616387514, 0.43129206902946704], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 2.727999999999997, 1, 27, 2.0, 3.0, 4.0, 10.0, 0.5989279190249454, 0.63753069505585, 0.24331446710388405], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 3.2339999999999995, 2, 19, 3.0, 4.0, 5.0, 9.980000000000018, 0.5958928679966201, 0.3660318495799551, 0.29794643399831006], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 3.698, 2, 31, 3.0, 5.0, 5.949999999999989, 8.990000000000009, 0.5958722735864123, 0.3491439103045384, 0.2810608477951534], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 508.38999999999993, 370, 840, 510.5, 620.0, 628.0, 652.95, 0.5952770717130288, 0.5434461110548905, 0.26217769467048435], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 14.390000000000011, 5, 123, 13.0, 22.900000000000034, 31.0, 50.97000000000003, 0.5954684848304403, 0.5274315583410248, 0.24481663292345254], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 6.456, 4, 46, 6.0, 8.0, 9.0, 15.990000000000009, 0.5959702873053561, 0.39750752561480296, 0.2787790699406891], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 512.282, 412, 3670, 500.0, 559.0, 591.95, 691.7000000000003, 0.5956976334124421, 0.44793669699959016, 0.32926255909320523], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 11.460000000000003, 7, 25, 12.0, 14.0, 15.0, 19.99000000000001, 0.5984863084287221, 0.48860796274063634, 0.36937826848335187], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 11.305999999999996, 7, 21, 12.0, 14.0, 15.0, 19.0, 0.5984891739293328, 0.4972837194785483, 0.3787314303771559], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 11.550000000000008, 7, 27, 12.0, 14.0, 16.0, 20.0, 0.5984641017293219, 0.4844987698570389, 0.3652734995906506], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 14.105999999999993, 9, 29, 15.0, 17.0, 19.0, 24.980000000000018, 0.598474846700668, 0.535354452712707, 0.41612704184655824], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 11.100000000000003, 7, 33, 12.0, 14.0, 15.0, 19.0, 0.5983065531320152, 0.4493141985923043, 0.3301203149605357], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 2095.9040000000005, 1651, 2732, 2080.5, 2415.7000000000003, 2515.5, 2618.0, 0.5971503982993157, 0.4985039516427608, 0.38021685516714243], "isController": false}]}, function(index, item){
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

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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8730482875983834, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Query cross patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [1.0, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [0.794, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [0.789, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.452, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 23505, 500, 2.1272069772388855, 465.63263135502893, 1, 20910, 11.0, 1022.0, 1897.9500000000007, 10420.990000000002, 10.61665104619519, 66.87706738939578, 87.85369340637315], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query cross patient #1", 500, 500, 100.0, 10544.931999999997, 8998, 20910, 10407.5, 11212.2, 11474.449999999999, 19937.610000000066, 0.2285388324042468, 0.13276767067965622, 0.11516214601620249], "isController": false}, {"data": ["Query participation #2", 500, 0, 0.0, 2.7779999999999982, 1, 10, 3.0, 4.0, 4.0, 6.980000000000018, 0.22945442163259575, 0.11779930077780461, 0.08290833594146527], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 4.1039999999999965, 2, 12, 4.0, 5.0, 6.0, 9.0, 0.22945347394854093, 0.1316915050530244, 0.09680068432204071], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 0, 0.0, 16.080000000000013, 10, 489, 14.0, 18.0, 21.0, 75.7800000000002, 0.228128520308229, 0.1186780703646452, 2.5100820686648597], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 42.995999999999995, 26, 65, 45.0, 53.900000000000034, 56.0, 58.99000000000001, 0.22938536649817548, 0.9539899942963329, 0.09542789660959254], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 2.5900000000000016, 1, 11, 2.0, 4.0, 4.0, 7.990000000000009, 0.22938968122633557, 0.14330358689189368, 0.09699778512793292], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 38.03599999999995, 23, 56, 40.0, 48.0, 49.0, 52.0, 0.22938462985349203, 0.9414424587222359, 0.0833311350639639], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 1044.8720000000003, 753, 1468, 1052.5, 1254.9, 1391.0, 1432.94, 0.2293113047721517, 0.9698054303611378, 0.11152053689114409], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 6.861999999999992, 4, 18, 7.0, 9.0, 10.0, 15.0, 0.22935811379556945, 0.34106044282973785, 0.11714286476082307], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 4.419999999999996, 3, 19, 4.0, 5.0, 6.0, 10.980000000000018, 0.2282608894139904, 0.22017144832333246, 0.12483017389827598], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 9.546000000000003, 6, 19, 10.0, 12.0, 13.0, 15.990000000000009, 0.22938515602778314, 0.37380596065929883, 0.14986198181893254], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 541.0, 541, 541, 541.0, 541.0, 541.0, 541.0, 1.8484288354898337, 0.7996620841035119, 2186.303214533272], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 5.02, 3, 19, 5.0, 6.0, 7.0, 12.0, 0.22826255672324536, 0.22931247531911106, 0.13397050448307662], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 9.857999999999993, 6, 30, 10.0, 12.0, 13.0, 17.99000000000001, 0.2293842089157972, 0.36036393625481655, 0.13642088206027392], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 7.719999999999995, 4, 16, 8.0, 9.0, 11.0, 14.0, 0.22938368274585114, 0.3549869295743924, 0.13104438906867472], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 2085.0280000000007, 1610, 2691, 2051.0, 2459.8, 2589.0, 2676.99, 0.22918843001800046, 0.34998460928071046, 0.12623268997085182], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 14.117999999999997, 10, 83, 13.0, 17.0, 20.0, 37.0, 0.22812217128507606, 0.11867476744655554, 1.8392350059859257], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 14.197999999999993, 9, 38, 14.0, 17.0, 18.0, 23.980000000000018, 0.22938610314759023, 0.41524932936105413, 0.19130442586722854], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 9.673999999999992, 6, 27, 10.0, 12.0, 13.0, 17.980000000000018, 0.22938568220448816, 0.3883674327097101, 0.1644229401739202], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 56.0, 56, 56, 56.0, 56.0, 56.0, 56.0, 17.857142857142858, 8.4228515625, 2435.4073660714284], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 543.0, 543, 543, 543.0, 543.0, 543.0, 543.0, 1.8416206261510129, 0.8542673802946592, 3521.9951369705336], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 2.762, 1, 20, 3.0, 4.0, 4.0, 6.0, 0.22825640864105723, 0.191857981915473, 0.09651857904450956], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 696.9539999999995, 513, 895, 685.5, 833.0, 842.95, 873.0, 0.22819932023986486, 0.2009468838412974, 0.1056313259704062], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 3.771999999999997, 2, 17, 4.0, 5.0, 5.949999999999989, 10.980000000000018, 0.22825515822419312, 0.20679159456656857, 0.1114527139766568], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 958.4759999999995, 758, 1227, 932.5, 1146.0, 1172.0, 1204.95, 0.22817672195844993, 0.21585651594567384, 0.12055039705031387], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 66.0, 66, 66, 66.0, 66.0, 66.0, 66.0, 15.151515151515152, 7.176254734848484, 997.6769649621211], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 0, 0.0, 30.156, 19, 1312, 27.0, 33.0, 36.0, 96.99000000000001, 0.22798694820318927, 0.11860442107160249, 10.399678076729463], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 38.76999999999995, 24, 282, 37.0, 45.0, 50.94999999999999, 125.99000000000001, 0.22820515278106773, 51.61329980414863, 0.07042268386603262], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 459.0, 459, 459, 459.0, 459.0, 459.0, 459.0, 2.1786492374727673, 1.1425142973856208, 0.8935866013071895], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 3.2220000000000013, 2, 13, 3.0, 4.0, 5.0, 6.990000000000009, 0.22942852108539882, 0.2493041110321622, 0.09835851636375983], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 3.9060000000000015, 2, 13, 4.0, 5.0, 5.949999999999989, 7.0, 0.22942788943778236, 0.23541228292106672, 0.0844671038262148], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 2.1659999999999973, 1, 10, 2.0, 3.0, 4.0, 6.0, 0.2294547375290203, 0.13012369202195054, 0.088958526170919], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 125.69800000000004, 86, 165, 125.0, 154.0, 158.0, 163.0, 0.22944336580568808, 0.20898840011779624, 0.07483797283115218], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 0, 0.0, 101.06, 69, 485, 97.0, 116.0, 123.0, 424.3200000000006, 0.22817078674656294, 0.11870005840601715, 67.46858644432793], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 251.55200000000013, 15, 449, 315.0, 414.90000000000003, 423.0, 438.0, 0.22942483652333273, 0.12786625825413206, 0.09611645983252905], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 485.2040000000002, 341, 667, 453.5, 588.0, 604.0, 616.98, 0.2294105204911771, 0.12337760521454702, 0.09767869817788401], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 8.430000000000007, 5, 311, 7.0, 9.0, 13.0, 26.950000000000045, 0.22795680492094914, 0.10278314101567522, 0.1654022520080715], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 463.9319999999998, 306, 609, 481.5, 545.0, 559.0, 577.97, 0.22939410136007762, 0.11799235071031883, 0.09229528296909373], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 4.151999999999996, 2, 14, 4.0, 5.0, 6.0, 10.990000000000009, 0.22825515822419312, 0.14014287160852779, 0.11412757911209656], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 4.612000000000004, 2, 38, 4.0, 5.0, 6.0, 10.0, 0.2282514070557988, 0.13367641730999325, 0.10766155235151446], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 777.5199999999994, 551, 1158, 735.5, 995.7, 1104.9, 1137.96, 0.22817391050380342, 0.20850059550538466, 0.10049456409884311], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 278.6719999999995, 196, 377, 272.0, 337.0, 347.95, 362.99, 0.22821046481907473, 0.20207100640244458, 0.0938248102429985], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 5.262000000000003, 3, 52, 5.0, 6.0, 7.0, 11.0, 0.2282638072211712, 0.15218553108199784, 0.10677574576068458], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 1254.7040000000013, 963, 11276, 1153.5, 1498.8000000000002, 1517.95, 1735.0700000000018, 0.2281687042892522, 0.1715075521274222, 0.12611668615987964], "isController": false}, {"data": ["Query single patient #2", 500, 0, 0.0, 165.51200000000014, 143, 214, 162.0, 184.0, 186.0, 188.99, 0.22946010790132115, 4.4365372391669595, 0.11562638249715011], "isController": false}, {"data": ["Query single patient #1", 500, 0, 0.0, 224.55200000000005, 194, 310, 215.5, 252.0, 254.0, 260.99, 0.2294424182129556, 0.4447037713392921, 0.16401547864441748], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 8.482000000000005, 5, 19, 8.0, 11.0, 12.0, 15.990000000000009, 0.22935600960909938, 0.18718272538126998, 0.14155566218061602], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 8.360000000000007, 5, 18, 8.0, 11.0, 12.0, 15.990000000000009, 0.22935695648823307, 0.19076720059628224, 0.14513994902771], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 9.702000000000004, 6, 25, 10.0, 12.0, 13.0, 18.99000000000001, 0.2293532742244075, 0.18561264832276242, 0.1399861292873581], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 11.972000000000001, 8, 34, 12.0, 15.0, 16.0, 21.980000000000018, 0.22935453670154232, 0.20509984648727472, 0.15947307630029114], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 9.066000000000003, 6, 40, 9.0, 11.0, 13.0, 36.80000000000018, 0.22934790885163667, 0.17216995216146644, 0.12654450048942845], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 2084.599999999999, 1614, 2746, 2020.0, 2539.4, 2668.9, 2741.9700000000003, 0.22916994188708614, 0.1915068466525376, 0.14591679893591813], "isController": false}]}, function(index, item){
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

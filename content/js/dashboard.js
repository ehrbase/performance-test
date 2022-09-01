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

    var data = {"OkPercent": 97.8387577111253, "KoPercent": 2.1612422888747074};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9015528610933844, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Query cross patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.996, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.499, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.995, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [1.0, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [0.987, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.704, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.693, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 23505, 508, 2.1612422888747074, 188.5314188470546, 1, 3284, 19.0, 537.9000000000015, 1216.9500000000007, 2215.0, 26.183842769950907, 174.94733319636154, 216.88512223652125], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query cross patient #1", 500, 500, 100.0, 31.46799999999994, 20, 60, 33.0, 37.0, 39.0, 47.98000000000002, 0.56738168106114, 0.3295512379700899, 0.28590717522221504], "isController": false}, {"data": ["Query participation #2", 500, 0, 0.0, 7.364000000000004, 4, 26, 7.0, 10.0, 13.0, 19.99000000000001, 0.5671326228295834, 6.071617738008547, 0.20492096723334557], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 7.4399999999999995, 4, 30, 7.0, 9.0, 11.0, 15.0, 0.5671165413150071, 6.0896320693203565, 0.23925229086726862], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 0, 0.0, 21.532, 14, 258, 20.0, 26.0, 30.0, 48.99000000000001, 0.5639757129498976, 0.3044730834836329, 6.278635866825031], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 42.940000000000026, 26, 94, 44.0, 52.0, 54.0, 59.97000000000003, 0.5670194283536931, 2.3582393398221146, 0.23588894187370438], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 2.442000000000003, 1, 16, 2.0, 3.0, 4.0, 7.0, 0.5670567260866508, 0.35431409846202877, 0.2397808226518748], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 37.61400000000004, 23, 106, 38.0, 46.0, 47.94999999999999, 61.950000000000045, 0.5670065682040861, 2.3271134514228464, 0.20598285485539067], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 771.5719999999992, 599, 997, 769.5, 911.9000000000001, 931.0, 963.0, 0.5666749778996758, 2.3965869077538136, 0.27558997948636577], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 14.189999999999994, 9, 53, 15.0, 18.0, 19.0, 28.960000000000036, 0.566809238083686, 0.8428254101431647, 0.2894933901540701], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 3.297999999999996, 2, 23, 3.0, 4.0, 6.0, 11.990000000000009, 0.5647560592677598, 0.5447734015144499, 0.3088509699120562], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 23.763999999999992, 16, 51, 25.0, 29.0, 30.0, 33.0, 0.5669795637886028, 0.923949675673515, 0.3704192657954837], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 611.0, 611, 611, 611.0, 611.0, 611.0, 611.0, 1.6366612111292964, 0.6984579582651391, 1935.826577843699], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 4.193999999999998, 2, 25, 4.0, 5.0, 7.0, 11.990000000000009, 0.5647681796053173, 0.5674298702642776, 0.3314703866628865], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 24.37599999999996, 16, 45, 26.0, 30.0, 32.0, 37.98000000000002, 0.5669737774627923, 0.8907833540042523, 0.3371943656980865], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 13.627999999999997, 9, 44, 14.0, 17.0, 18.0, 24.970000000000027, 0.5669731345449927, 0.8774617973501944, 0.3239055504968953], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 1927.5460000000005, 1556, 2330, 1919.5, 2163.9, 2211.95, 2295.87, 0.56580607562564, 0.8639880876603353, 0.31163537759068455], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 18.964000000000006, 12, 474, 17.0, 23.0, 28.0, 42.99000000000001, 0.5639343670626238, 0.3044188205199926, 4.546720834442404], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 27.937999999999988, 19, 61, 29.0, 34.0, 35.94999999999999, 44.99000000000001, 0.567007211197712, 1.0264325561223737, 0.4728751546512169], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 23.53800000000001, 16, 57, 24.0, 29.0, 30.0, 37.99000000000001, 0.5669962805044, 0.9599036620163521, 0.40642116200217726], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 91.0, 91, 91, 91.0, 91.0, 91.0, 91.0, 10.989010989010989, 5.118904532967033, 1498.7122252747254], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 639.0, 639, 639, 639.0, 639.0, 639.0, 639.0, 1.5649452269170578, 0.7167571400625978, 2992.86910700313], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 2.2139999999999995, 1, 19, 2.0, 3.0, 4.0, 8.0, 0.5647649899923644, 0.4746739435223715, 0.23881175846356814], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 415.21600000000024, 322, 552, 416.5, 478.90000000000003, 486.0, 498.99, 0.5645156737776824, 0.4970351019374178, 0.2613090130572475], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 3.0100000000000002, 1, 20, 3.0, 4.0, 5.0, 10.990000000000009, 0.5647873180396458, 0.5116145776266281, 0.2757750576365458], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 1169.9019999999994, 947, 1553, 1168.0, 1340.0, 1367.0, 1405.94, 0.5641519780296653, 0.5336591228734292, 0.29805294933012594], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 56.0, 56, 56, 56.0, 56.0, 56.0, 56.0, 17.857142857142858, 8.353097098214285, 1175.8335658482142], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 2, 0.4, 44.62399999999999, 24, 672, 43.0, 51.0, 59.94999999999999, 90.99000000000001, 0.5635155254162408, 0.303702950327797, 25.77533220649012], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 48.86000000000001, 9, 206, 50.5, 58.0, 63.0, 90.95000000000005, 0.5643850460538198, 126.27346320597515, 0.17416569780567095], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 346.0, 346, 346, 346.0, 346.0, 346.0, 346.0, 2.890173410404624, 1.5156475794797688, 1.1854226878612717], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 2.1839999999999997, 1, 23, 2.0, 3.0, 4.0, 7.0, 0.5671712221859233, 0.6162415027116456, 0.24315250638634797], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 3.2399999999999998, 2, 37, 3.0, 4.0, 6.0, 11.990000000000009, 0.5671647885949967, 0.5819587060787588, 0.20880969267608765], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 2.2840000000000003, 1, 19, 2.0, 3.0, 4.0, 8.0, 0.5671435587804599, 0.3216268906439461, 0.2198788992537525], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 122.44000000000007, 85, 281, 121.0, 148.0, 152.0, 169.95000000000005, 0.567081808355837, 0.5165904833606856, 0.18496613670981404], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 6, 1.2, 167.62999999999985, 31, 560, 165.0, 199.0, 221.84999999999997, 324.99, 0.5640539686837236, 0.3032362948986959, 166.85751961497675], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 2.203999999999999, 1, 11, 2.0, 3.0, 4.0, 6.990000000000009, 0.5671602851681914, 0.3161619501381035, 0.23760914290737706], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 3.172000000000003, 2, 33, 3.0, 4.0, 5.0, 9.0, 0.5672085398917767, 0.30507843076085356, 0.2415067611257955], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 11.44799999999999, 7, 316, 10.0, 14.0, 19.0, 29.0, 0.5633320414251849, 0.23798248157059226, 0.4087458074012817], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 4.387999999999999, 2, 55, 4.0, 5.0, 6.0, 10.990000000000009, 0.5671744390361211, 0.29173481326632356, 0.22819909070593933], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 3.6019999999999976, 2, 29, 3.0, 5.0, 6.0, 10.980000000000018, 0.5647541455778057, 0.3468086819795988, 0.2823770727889028], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 3.883999999999997, 2, 41, 4.0, 5.0, 6.0, 11.0, 0.5647292687885428, 0.33076810945582685, 0.26637132502428335], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 530.4799999999996, 389, 752, 532.5, 635.9000000000001, 646.95, 694.97, 0.5642519317164882, 0.5155378142601134, 0.24851330195716426], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 15.053999999999993, 5, 103, 14.0, 25.0, 30.0, 44.99000000000001, 0.5645118496682363, 0.49978814046691905, 0.2320893444436792], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 12.596000000000004, 8, 50, 13.0, 15.0, 16.0, 22.970000000000027, 0.5647745589393083, 0.37654027259126477, 0.2641865368475866], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 522.8280000000001, 436, 3284, 511.0, 572.8000000000001, 594.95, 672.8900000000001, 0.5645010149728249, 0.4242544864423791, 0.31201911569787], "isController": false}, {"data": ["Query single patient #2", 500, 0, 0.0, 173.59399999999982, 142, 246, 177.0, 193.0, 197.95, 223.92000000000007, 0.5672619513584222, 10.967891280630727, 0.2858468426767049], "isController": false}, {"data": ["Query single patient #1", 500, 0, 0.0, 277.8800000000001, 222, 439, 278.0, 309.0, 315.0, 346.9200000000001, 0.5670689453765168, 1.099153502515518, 0.4053656914214944], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 23.756000000000004, 16, 61, 25.0, 29.0, 29.0, 37.99000000000001, 0.5667809674951115, 0.46256301010287076, 0.34981012837588915], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 23.190000000000005, 16, 41, 24.0, 28.0, 30.0, 35.98000000000002, 0.5667893198754876, 0.47136170319340437, 0.35867136648370707], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 23.665999999999997, 16, 69, 26.0, 29.0, 30.0, 39.99000000000001, 0.5667546269847746, 0.45869931513370876, 0.3459195721342619], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 26.420000000000012, 18, 91, 28.0, 33.0, 34.0, 43.99000000000001, 0.5667706879802673, 0.5068977852443518, 0.3940827439862796], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 23.220000000000006, 15, 48, 25.0, 29.0, 30.0, 37.98000000000002, 0.5665857204534046, 0.42526795432242576, 0.312618097711107], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 2192.581999999999, 1736, 2772, 2184.0, 2509.8, 2583.9, 2680.98, 0.5654758875426793, 0.4725103262965514, 0.3600491002713153], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["No results for path: $['rows'][1]", 500, 98.4251968503937, 2.1272069772388855], "isController": false}, {"data": ["500", 8, 1.5748031496062993, 0.034035311635822164], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 23505, 508, "No results for path: $['rows'][1]", 500, "500", 8, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["Query cross patient #1", 500, 500, "No results for path: $['rows'][1]", 500, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 2, "500", 2, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 6, "500", 6, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});

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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8678791746436928, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Query cross patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.451, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [0.5, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [0.746, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [0.772, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [0.84, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.484, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 23505, 500, 2.1272069772388855, 503.7335460540307, 1, 22840, 13.0, 1059.9000000000015, 1904.0, 10726.87000000002, 9.84082193157269, 61.990011319117066, 81.53238426672165], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query cross patient #1", 500, 500, 100.0, 11328.919999999996, 9137, 22840, 10845.0, 13091.500000000002, 13769.699999999999, 21238.390000000058, 0.21175646481899268, 0.12304208649150454, 0.10711899294554514], "isController": false}, {"data": ["Query participation #2", 500, 0, 0.0, 3.218000000000001, 2, 11, 3.0, 4.0, 5.0, 7.0, 0.21250326723773377, 0.10909677013627833, 0.07719845255120797], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 4.618000000000003, 2, 17, 4.0, 6.0, 6.0, 9.0, 0.21250182220312538, 0.12190216835796867, 0.090064248863434], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 0, 0.0, 16.34199999999999, 11, 442, 14.0, 19.0, 23.0, 38.98000000000002, 0.21139611064979782, 0.10997345908618535, 2.353846146122065], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 43.804, 27, 60, 45.5, 55.0, 57.0, 59.0, 0.2124348303049332, 0.8834944689139864, 0.08879112047901505], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 2.6780000000000004, 1, 10, 2.0, 4.0, 4.0, 8.0, 0.21243997508503973, 0.1327148207633308, 0.09024549722850808], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 38.59199999999998, 24, 55, 39.0, 49.0, 51.0, 53.0, 0.21243419850701245, 0.8718743461009827, 0.07758827172033463], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 1154.3339999999992, 816, 1808, 1145.0, 1498.0000000000005, 1587.0, 1689.93, 0.21236084524713067, 0.8981785359036357, 0.10369181896832552], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 6.844000000000005, 4, 15, 7.0, 9.0, 10.0, 13.0, 0.2123120613632812, 0.31571259663914253, 0.10885139864816665], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 4.472000000000005, 2, 22, 4.0, 5.0, 6.0, 9.990000000000009, 0.2115406420343102, 0.20404375736690286, 0.11609945392898664], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 10.145999999999994, 6, 28, 10.0, 12.0, 14.0, 18.0, 0.2124331154336057, 0.3462410836510625, 0.13920177778901313], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 549.0, 549, 549, 549.0, 549.0, 549.0, 549.0, 1.8214936247723132, 0.7880094489981785, 2154.448073201275], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 4.974000000000002, 3, 17, 5.0, 6.0, 7.0, 12.0, 0.21154216352632327, 0.21251517484488672, 0.12457023887341107], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 15.75200000000001, 7, 24, 17.0, 20.0, 20.94999999999999, 22.0, 0.2124319421165444, 0.3337318257835021, 0.1267538248371178], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 7.893999999999991, 5, 16, 8.0, 9.900000000000034, 10.0, 14.0, 0.2124318518619227, 0.32875281246494875, 0.12177489945600452], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 2355.8400000000015, 1699, 3765, 2277.5, 2987.6000000000004, 3274.7, 3543.99, 0.21215018026400817, 0.32396617029358615, 0.1172626972943639], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 14.203999999999995, 9, 72, 13.0, 17.0, 22.0, 53.8900000000001, 0.2113907481879585, 0.1099706694015697, 1.70475077982047], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 14.876, 9, 27, 15.0, 18.0, 19.0, 24.99000000000001, 0.2124347400478573, 0.3845628925528452, 0.1775821655087557], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 10.264000000000003, 6, 22, 10.0, 13.0, 14.0, 19.0, 0.21243401799401107, 0.3596068119835729, 0.15268695043319544], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 62.0, 62, 62, 62.0, 62.0, 62.0, 62.0, 16.129032258064516, 7.60773689516129, 2199.7542842741937], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 694.0, 694, 694, 694.0, 694.0, 694.0, 694.0, 1.440922190201729, 0.6683965237752162, 2755.6848883285306], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 3.066000000000004, 2, 23, 3.0, 4.0, 4.0, 11.970000000000027, 0.2115277549797864, 0.17785683304452746, 0.08985798185176475], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 745.5580000000003, 571, 992, 725.5, 900.0, 921.0, 959.98, 0.2114744335868771, 0.18615945695691674, 0.09830256873764989], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 3.853999999999998, 2, 18, 4.0, 5.0, 5.0, 10.980000000000018, 0.21154368504022292, 0.19165155473502463, 0.10370598622089053], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 998.538, 795, 1330, 968.5, 1205.0, 1235.9, 1283.93, 0.211469156589104, 0.20005106121038177, 0.11213647658972996], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 65.0, 65, 65, 65.0, 65.0, 65.0, 65.0, 15.384615384615385, 7.286658653846153, 1013.0558894230769], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 0, 0.0, 30.208000000000002, 20, 704, 28.0, 34.0, 38.0, 75.92000000000007, 0.21132874214596728, 0.10993841233259594, 9.666638947379989], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 37.21600000000002, 26, 240, 35.0, 42.900000000000034, 47.0, 109.95000000000005, 0.21145940825199194, 47.825844575484666, 0.06566805842200531], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 1051.0, 1051, 1051, 1051.0, 1051.0, 1051.0, 1051.0, 0.9514747859181732, 0.49896675784966704, 0.3921116793529972], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 3.2499999999999964, 2, 10, 3.0, 4.0, 5.0, 8.0, 0.21247409940728226, 0.23082073990493057, 0.09150495882676901], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 3.9200000000000004, 2, 12, 4.0, 5.0, 5.0, 9.0, 0.21247319650626073, 0.21807551711726567, 0.07863998191003206], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 2.2640000000000007, 1, 12, 2.0, 3.0, 4.0, 6.990000000000009, 0.21250380913077865, 0.12051082714876414, 0.08280177719060615], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 193.87999999999994, 92, 293, 195.0, 273.0, 278.0, 286.99, 0.21248656022506576, 0.19354330037843856, 0.0697221525738497], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 0, 0.0, 115.23800000000003, 85, 415, 114.0, 130.0, 139.0, 275.8000000000002, 0.2114276653100058, 0.11004975157249326, 62.54459802315133], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 255.9820000000001, 18, 462, 310.0, 419.0, 430.0, 452.98, 0.21247093928727898, 0.11842930964367349, 0.08942868636017309], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 529.0959999999998, 331, 1033, 503.0, 828.8000000000001, 908.95, 983.96, 0.21249071415579138, 0.11427808710228114, 0.09088958281273109], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 8.266000000000004, 5, 267, 7.0, 10.0, 13.0, 27.920000000000073, 0.2113070396940274, 0.09527595048547793, 0.153734125558643], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 535.4160000000004, 304, 1057, 484.5, 874.3000000000002, 925.9, 1005.98, 0.2124463838438774, 0.10927503401797722, 0.08589140909313013], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 4.3059999999999965, 2, 16, 4.0, 6.0, 7.0, 10.990000000000009, 0.21152668112945094, 0.12987201141884483, 0.10617647861380643], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 4.716000000000006, 3, 34, 4.0, 6.0, 6.0, 10.990000000000009, 0.2115239070665484, 0.12387988506531224, 0.10018466301491794], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 888.9239999999996, 604, 1442, 895.0, 1174.0, 1286.55, 1395.99, 0.21144152373219663, 0.19321088688618526, 0.09353809594793465], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 514.0440000000008, 273, 1066, 416.5, 938.3000000000002, 992.9, 1037.99, 0.21145144926708814, 0.1872315855126577, 0.0873476201562288], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 5.716000000000003, 4, 48, 5.0, 7.0, 8.0, 12.0, 0.21154287953013787, 0.14109744796785564, 0.09936730962304328], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 1234.4540000000002, 959, 9413, 1154.0, 1476.0, 1493.85, 1525.95, 0.21145940825199194, 0.1588877909152809, 0.11729389051477679], "isController": false}, {"data": ["Query single patient #2", 500, 0, 0.0, 169.4980000000002, 145, 211, 167.0, 190.0, 192.0, 195.99, 0.21256162692968758, 4.109870753496957, 0.10752629174763494], "isController": false}, {"data": ["Query single patient #1", 500, 0, 0.0, 229.9259999999999, 198, 342, 221.0, 258.0, 261.0, 266.98, 0.2125435554881084, 0.4119505078250036, 0.1523505563752652], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 9.239999999999998, 6, 19, 9.0, 12.0, 13.0, 15.990000000000009, 0.2123106189279163, 0.17333171623411917, 0.13145012929716693], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 9.160000000000005, 6, 21, 9.0, 11.0, 13.0, 15.990000000000009, 0.21231124999097678, 0.1765293403001147, 0.13476788329505363], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 10.097999999999983, 7, 22, 10.0, 12.0, 13.0, 16.0, 0.21230872576124354, 0.17181871496640638, 0.12999762798076142], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 12.538, 8, 26, 13.0, 15.0, 16.0, 20.99000000000001, 0.21230953711425482, 0.18985738889735768, 0.14803614208943155], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 9.394, 6, 31, 9.0, 12.0, 12.949999999999989, 18.99000000000001, 0.2123039479192939, 0.1593751638721098, 0.11755501803734342], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 2070.1340000000046, 1681, 2735, 2011.0, 2588.4, 2647.95, 2699.94, 0.2121506303419529, 0.17728458582999268, 0.13549464086292695], "isController": false}]}, function(index, item){
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

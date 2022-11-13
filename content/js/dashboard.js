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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8689002339927675, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Query cross patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.421, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.683, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.499, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.989, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [0.5, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [0.993, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [0.995, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [0.735, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [0.732, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.487, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [0.837, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.469, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 23505, 508, 2.1612422888747074, 515.2951712401632, 1, 25846, 22.0, 1021.0, 1934.9500000000007, 10825.970000000005, 9.61711564269582, 64.56186511130979, 79.67895096263216], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query cross patient #1", 500, 500, 100.0, 11607.062000000004, 9109, 25846, 10943.5, 13627.600000000002, 14587.299999999997, 21790.850000000013, 0.20708881583715863, 0.12031819753104574, 0.10475781894887516], "isController": false}, {"data": ["Query participation #2", 500, 0, 0.0, 7.359999999999999, 5, 22, 7.0, 9.0, 10.0, 13.0, 0.20779687107783404, 2.2187527143466284, 0.0754887070712444], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 9.351999999999999, 6, 35, 9.0, 11.0, 12.0, 23.960000000000036, 0.2077943666947189, 2.231248425308315, 0.08806909682178517], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 0, 0.0, 23.658000000000005, 16, 319, 22.0, 28.0, 32.94999999999999, 59.97000000000003, 0.20662010826893673, 0.12143491531158312, 2.300666478986735], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 44.367999999999995, 27, 92, 45.0, 54.0, 56.0, 66.96000000000004, 0.20773091368365076, 0.8639548986325074, 0.0868250303287134], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 3.0539999999999994, 1, 20, 3.0, 4.0, 5.0, 13.0, 0.20773548791041782, 0.1298229136761412, 0.08824700902444506], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 38.807999999999986, 24, 81, 40.0, 48.0, 50.0, 55.99000000000001, 0.2077294465215081, 0.852541528881456, 0.07586993456937893], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 1218.1379999999995, 813, 2814, 1200.5, 1605.6000000000001, 1697.8, 2103.0, 0.20766120323885023, 0.8782779126248874, 0.10139707189396985], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 11.472000000000001, 7, 41, 11.0, 14.0, 16.0, 22.980000000000018, 0.2075848170804109, 0.30869484056240537, 0.1064277626632966], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 4.842, 3, 27, 5.0, 6.0, 7.0, 17.970000000000027, 0.20676202807084, 0.1994344948689935, 0.11347681618731648], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 19.754000000000016, 13, 46, 21.0, 24.0, 25.0, 35.97000000000003, 0.20772823828589304, 0.3385491535385882, 0.13611879676741626], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 686.0, 686, 686, 686.0, 686.0, 686.0, 686.0, 1.4577259475218658, 0.6918504008746356, 1724.1865775327988], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 5.317999999999994, 3, 17, 5.0, 7.0, 8.0, 12.990000000000009, 0.20676331059488284, 0.20773776346297942, 0.12175612918819761], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 25.138, 13, 50, 25.0, 31.0, 32.0, 42.99000000000001, 0.20772703006433307, 0.32638744453688295, 0.12394649938408935], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 12.344000000000001, 8, 26, 13.0, 15.0, 17.0, 24.0, 0.20772728896776987, 0.3214839455887448, 0.11907804553132902], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 2430.074000000003, 1699, 5467, 2294.0, 3226.5, 3478.9, 4423.8, 0.20744047495571147, 0.3167624155717267, 0.11465948127434833], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 20.902000000000026, 14, 90, 19.0, 25.900000000000034, 29.94999999999999, 50.99000000000001, 0.20661421695897758, 0.12140804734998671, 1.6662306676242546], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 24.63, 16, 48, 25.0, 29.0, 31.0, 39.99000000000001, 0.207729878037634, 0.37605761772467644, 0.17364919492208467], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 19.449999999999985, 13, 49, 20.0, 24.0, 25.0, 32.0, 0.20772936021849805, 0.3516545663016031, 0.14930547765704547], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 114.0, 114, 114, 114.0, 114.0, 114.0, 114.0, 8.771929824561402, 4.505893640350877, 1196.3575932017543], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 681.0, 681, 681, 681.0, 681.0, 681.0, 681.0, 1.4684287812041115, 0.7428184654919235, 2808.289739353891], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 2.8920000000000012, 2, 23, 3.0, 3.0, 5.0, 11.990000000000009, 0.20676168606711567, 0.17381429215860442, 0.08783333343671418], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 568.6820000000001, 421, 1294, 554.0, 661.0, 703.8499999999999, 969.8300000000002, 0.20672296146353242, 0.1819767694555248, 0.0960938766178139], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 3.677999999999998, 2, 16, 3.0, 5.0, 6.0, 10.990000000000009, 0.20676801331916836, 0.1873366661924787, 0.10136478777951417], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 820.7479999999999, 603, 1519, 788.5, 972.0, 996.0, 1331.890000000001, 0.20670800551166224, 0.1955469843937523, 0.10961176464143808], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 62.0, 62, 62, 62.0, 62.0, 62.0, 62.0, 16.129032258064516, 8.316532258064516, 1062.074722782258], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 5, 1.0, 43.53200000000001, 13, 760, 41.0, 51.0, 55.89999999999998, 100.93000000000006, 0.20655079992993797, 0.12087578726837393, 9.44808541867021], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 47.217999999999996, 16, 228, 46.0, 55.900000000000034, 61.94999999999999, 117.96000000000004, 0.2066728888984418, 46.50464702698982, 0.06418161979463329], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 1328.0, 1328, 1328, 1328.0, 1328.0, 1328.0, 1328.0, 0.7530120481927711, 0.39489010730421686, 0.3103233245481928], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 3.5119999999999987, 2, 20, 3.0, 4.0, 5.0, 7.990000000000009, 0.20777157094838167, 0.22572392744679073, 0.08947974881663702], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 4.286000000000003, 2, 22, 4.0, 5.0, 6.0, 13.990000000000009, 0.20777122559675013, 0.21322603187501482, 0.07689970166129717], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 2.538000000000002, 1, 19, 2.0, 4.0, 4.0, 7.0, 0.20779851191329649, 0.11783068509714788, 0.08096836548184111], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 200.014, 94, 464, 196.0, 272.0, 281.0, 336.9000000000001, 0.20778314089151434, 0.18928273064967555, 0.06817884310502814], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 3, 0.6, 156.98599999999993, 32, 501, 155.0, 189.0, 201.95, 261.97, 0.20663394136059357, 0.1211552913993168, 61.12651710639747], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 259.08199999999977, 18, 800, 313.0, 416.0, 431.95, 514.6600000000003, 0.20776794481350958, 0.11584320893331522, 0.08744920333459241], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 567.2280000000001, 341, 2036, 512.0, 904.5000000000002, 972.0, 1472.8500000000001, 0.20779903007724723, 0.11174311670907845, 0.08888278825569755], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 15.543999999999999, 9, 328, 13.0, 19.0, 24.94999999999999, 49.0, 0.20652563168962337, 0.09715377152461764, 0.15025546446168886], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 581.9019999999998, 317, 1813, 507.0, 964.6000000000001, 1007.8499999999999, 1435.3900000000006, 0.20774368750031164, 0.10686789724332436, 0.08399012365735255], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 4.612, 3, 20, 4.0, 6.0, 7.0, 13.0, 0.20676066006273117, 0.12696921760215527, 0.10378415944555061], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 5.030000000000005, 3, 34, 5.0, 6.0, 7.0, 15.0, 0.20675809509631823, 0.12108876680684866, 0.09792741808761168], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 925.1499999999999, 604, 1921, 920.5, 1304.6000000000001, 1397.8, 1668.7300000000002, 0.20665776936083644, 0.18883959118030105, 0.09142184523482316], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 538.5120000000006, 274, 1819, 425.0, 972.9000000000001, 1023.95, 1498.980000000001, 0.2066634923154247, 0.18300375156237603, 0.08536978247014126], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 10.63, 6, 73, 10.0, 13.0, 14.0, 22.99000000000001, 0.20676399461421147, 0.1378748353383238, 0.09712254043890207], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 1273.203999999999, 954, 10290, 1181.0, 1486.0, 1510.9, 2675.600000000002, 0.2066848494218198, 0.15530025082239904, 0.11464550241366568], "isController": false}, {"data": ["Query single patient #2", 500, 0, 0.0, 172.464, 144, 357, 179.5, 188.0, 191.0, 349.8900000000001, 0.20785613030085098, 4.018878386885733, 0.10514597216390702], "isController": false}, {"data": ["Query single patient #1", 500, 0, 0.0, 261.3680000000003, 215, 468, 267.0, 289.0, 296.0, 416.9200000000001, 0.20783746777480064, 0.40285274395858045, 0.1489772474088903], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 18.338000000000008, 12, 50, 18.0, 22.0, 24.0, 35.99000000000001, 0.20758180072230165, 0.16944756437007852, 0.1285223258378313], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 17.906000000000002, 12, 42, 18.0, 22.0, 23.0, 33.99000000000001, 0.2075827487111187, 0.17259775772228583, 0.13176639322483122], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 18.77000000000001, 13, 56, 19.0, 23.0, 25.0, 36.99000000000001, 0.20757981859184493, 0.1680034288034435, 0.1271020959541863], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 21.579999999999995, 14, 63, 22.0, 26.0, 28.0, 41.99000000000001, 0.2075796462344637, 0.1856747229797726, 0.14473815176895224], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 18.440000000000015, 11, 82, 19.0, 22.900000000000034, 24.0, 39.960000000000036, 0.20756594473847312, 0.1558301330124087, 0.11493153385421315], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 2128.7139999999995, 1671, 3945, 2049.0, 2588.0, 2678.95, 3188.2000000000007, 0.20742059628443338, 0.1733319125454614, 0.1324737011425971], "isController": false}]}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 23505, 508, "No results for path: $['rows'][1]", 500, "500", 8, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["Query cross patient #1", 500, 500, "No results for path: $['rows'][1]", 500, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 5, "500", 5, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 3, "500", 3, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});

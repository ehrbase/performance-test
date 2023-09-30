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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8942990853009998, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Query cross patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.213, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.688, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [1.0, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [0.987, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.496, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.149, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 23505, 500, 2.1272069772388855, 322.8342905764743, 1, 20545, 9.0, 839.0, 1488.9500000000007, 6046.990000000002, 15.334191430467058, 96.5940352327594, 126.8917426696139], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query cross patient #1", 500, 500, 100.0, 6207.095999999998, 5026, 20545, 6036.5, 6523.3, 6795.499999999999, 18227.9500000001, 0.3308666124486578, 0.19215789364193483, 0.16672575392920647], "isController": false}, {"data": ["Query participation #2", 500, 0, 0.0, 2.2639999999999993, 1, 9, 2.0, 3.0, 4.0, 6.0, 0.3319770962361765, 0.1704332805296097, 0.11995266172596221], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 3.5519999999999983, 2, 25, 3.0, 4.0, 5.0, 7.0, 0.33197268794301754, 0.19053092620213952, 0.14005097772596053], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 0, 0.0, 13.403999999999986, 7, 389, 11.0, 15.0, 18.0, 82.97000000000003, 0.3298559914712435, 0.17159920431313097, 3.6293822811586915], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 33.44400000000002, 23, 47, 33.0, 40.0, 41.0, 44.99000000000001, 0.3319259672322685, 1.380445738195053, 0.1380863887118617], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 2.1560000000000024, 1, 10, 2.0, 3.0, 4.0, 6.0, 0.3319332389315202, 0.20736426980164333, 0.14035848872787915], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 29.675999999999974, 21, 43, 30.0, 35.0, 36.0, 39.0, 0.33192486548744826, 1.3622890150710485, 0.12058208004036207], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 858.112, 668, 1078, 862.0, 1017.5000000000002, 1056.9, 1076.96, 0.33176541000564663, 1.4031052527007364, 0.16134684978790237], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 5.483999999999996, 3, 17, 5.0, 7.0, 8.0, 12.0, 0.3319001883201669, 0.4935427107001965, 0.16951542821430396], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 3.7000000000000006, 2, 25, 3.0, 5.0, 5.0, 9.990000000000009, 0.3300550069674612, 0.31835803801936635, 0.18049883193533037], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 7.515999999999996, 5, 40, 7.0, 9.0, 10.0, 14.0, 0.33192200098514446, 0.5408999631483599, 0.21685138540923993], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 503.0, 503, 503, 503.0, 503.0, 503.0, 503.0, 1.9880715705765406, 0.8600739314115308, 2351.4712506212722], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 3.9480000000000004, 2, 23, 4.0, 5.0, 6.0, 12.980000000000018, 0.3300598002346065, 0.33157794638607624, 0.19371673822363136], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 7.787999999999996, 5, 21, 8.0, 9.0, 10.0, 18.960000000000036, 0.33191957721411935, 0.5214476006446542, 0.19740138918300654], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 6.4519999999999955, 4, 15, 6.0, 8.0, 8.949999999999989, 11.990000000000009, 0.3319178144937888, 0.5136655076234884, 0.18962101706920553], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 1550.4359999999992, 1312, 1917, 1527.5, 1755.0, 1798.95, 1883.97, 0.3315981905349939, 0.5063705141811282, 0.1826380658806021], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 11.207999999999998, 7, 85, 10.0, 13.0, 15.0, 34.97000000000003, 0.32984619931418374, 0.17159411019204965, 2.659384981970607], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 10.865999999999996, 8, 35, 10.0, 13.0, 15.0, 20.0, 0.33192640793224454, 0.6008743180157041, 0.276821437865368], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 7.570000000000001, 5, 23, 7.0, 9.0, 10.0, 15.0, 0.3319242044440668, 0.5619729614128155, 0.23792223248236818], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 73.0, 73, 73, 73.0, 73.0, 73.0, 73.0, 13.698630136986301, 6.461365582191781, 1868.2577054794522], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 418.0, 418, 418, 418.0, 418.0, 418.0, 418.0, 2.3923444976076556, 1.1097301136363638, 4575.223347787081], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 2.247999999999998, 1, 29, 2.0, 3.0, 4.0, 6.0, 0.33006481152639133, 0.27743172258679716, 0.13956842128020258], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 546.1100000000007, 424, 672, 531.0, 639.0, 651.95, 670.0, 0.3299548159874987, 0.29055034875399166, 0.15273299099421325], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 3.1540000000000004, 1, 23, 3.0, 4.0, 5.0, 9.0, 0.33005326399574364, 0.2990172983803626, 0.1611588203104217], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 752.0759999999999, 608, 947, 733.0, 876.0, 889.0, 911.96, 0.3299086614879804, 0.3120955268261929, 0.17429744713378656], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 51.0, 51, 51, 51.0, 51.0, 51.0, 51.0, 19.607843137254903, 9.286917892156863, 1291.1113664215686], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 0, 0.0, 25.180000000000014, 17, 1235, 22.0, 26.0, 30.0, 58.98000000000002, 0.3295800754342877, 0.17145566600058532, 15.03387238626521], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 30.44800000000001, 20, 229, 29.0, 36.0, 40.0, 96.93000000000006, 0.329986173579327, 74.63317589727366, 0.10183167075299546], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 452.0, 452, 452, 452.0, 452.0, 452.0, 452.0, 2.2123893805309733, 1.1602081028761062, 0.907425331858407], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 2.591999999999999, 1, 10, 2.0, 3.0, 4.0, 6.0, 0.331928170743851, 0.3606833934261626, 0.14230123726225646], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 3.3160000000000003, 2, 15, 3.0, 4.0, 5.0, 6.0, 0.3319268486333908, 0.34058482336678714, 0.12220353704569173], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 1.7659999999999998, 1, 16, 2.0, 3.0, 3.0, 6.0, 0.3319786391664415, 0.18826495659213302, 0.12870656225495825], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 91.93199999999997, 66, 118, 91.5, 112.0, 114.0, 117.99000000000001, 0.3319570394477828, 0.30236293971029443, 0.10827504997613228], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 0, 0.0, 81.98800000000007, 57, 297, 80.0, 93.0, 100.0, 221.96000000000004, 0.32992629446581634, 0.17163577766102053, 97.5570143567427], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 207.284, 12, 370, 260.0, 334.0, 337.95, 348.0, 0.33192111960976695, 0.18499092009032236, 0.1390567971802637], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 412.1240000000001, 330, 520, 401.0, 486.0, 496.0, 510.0, 0.33186758483365136, 0.178479294573965, 0.14130299510495312], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 6.980000000000005, 4, 269, 6.0, 8.0, 10.0, 22.980000000000018, 0.3295257728697477, 0.14857943807782342, 0.23909926683810792], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 385.9879999999997, 287, 487, 385.5, 449.0, 459.0, 472.98, 0.3318576728812547, 0.17069604969070865, 0.1335208605733173], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 3.244000000000001, 2, 18, 3.0, 4.0, 5.0, 8.990000000000009, 0.33006132539425825, 0.2026492733287345, 0.16503066269712913], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 3.9599999999999955, 2, 44, 4.0, 5.0, 5.0, 7.990000000000009, 0.33005195677903615, 0.19329634667964432, 0.1556788038322993], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 670.6079999999996, 517, 874, 677.5, 783.9000000000001, 819.0, 847.95, 0.32989647188919174, 0.3014525661244488, 0.14529620002150925], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 236.054, 166, 304, 231.0, 279.0, 282.0, 297.0, 0.3299907470594524, 0.2921932717444103, 0.1356700239375288], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 4.5699999999999985, 3, 60, 4.0, 5.0, 7.0, 10.990000000000009, 0.330064157871007, 0.22005673947276871, 0.15439524572286362], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 979.5560000000006, 814, 9094, 921.5, 1077.9, 1110.95, 1131.96, 0.3298895068085895, 0.24796801981019476, 0.18234127036490397], "isController": false}, {"data": ["Query single patient #2", 500, 0, 0.0, 134.75399999999996, 117, 165, 140.0, 149.0, 150.0, 153.99, 0.3319372054472223, 6.41789889537107, 0.16726523243238936], "isController": false}, {"data": ["Query single patient #1", 500, 0, 0.0, 181.11800000000002, 159, 228, 177.0, 202.0, 204.0, 209.0, 0.33192222132972027, 0.6433294452102628, 0.23727252540366722], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 6.689999999999994, 4, 31, 6.0, 8.0, 9.949999999999989, 13.0, 0.33189578206926396, 0.2708677969073287, 0.20484192799587386], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 6.663999999999995, 4, 19, 6.0, 8.0, 10.0, 13.0, 0.33189732424377194, 0.2760549512027959, 0.21002877549801194], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 7.8939999999999975, 5, 16, 8.0, 9.0, 10.949999999999989, 13.990000000000009, 0.33189137593535284, 0.2685954122572132, 0.20257041988241753], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 9.228000000000009, 6, 21, 9.0, 11.0, 12.0, 17.99000000000001, 0.33189335868113545, 0.2967949877713892, 0.230769600957977], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 7.3619999999999965, 5, 30, 7.0, 9.0, 10.949999999999989, 14.990000000000009, 0.3318794799581301, 0.24913972171739668, 0.18311709587533545], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 1603.886000000001, 1329, 1957, 1577.0, 1811.0, 1862.0, 1941.98, 0.3315682848304194, 0.2770764619260139, 0.21111574385686863], "isController": false}]}, function(index, item){
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

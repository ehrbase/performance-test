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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8748138693894916, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Query cross patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.501, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [1.0, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [0.81, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [0.84, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.467, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 23505, 500, 2.1272069772388855, 459.232333546055, 1, 19818, 11.0, 999.0, 1830.9500000000007, 10382.920000000013, 10.80959522308328, 68.09247332710534, 89.45032293550759], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query cross patient #1", 500, 500, 100.0, 10485.382, 9117, 19818, 10352.0, 11123.300000000001, 11361.699999999999, 19113.830000000056, 0.2326934264107039, 0.1351812463641652, 0.11725567190226877], "isController": false}, {"data": ["Query participation #2", 500, 0, 0.0, 2.76, 2, 8, 3.0, 4.0, 5.0, 7.0, 0.2336670254234397, 0.11996200384312157, 0.0844304681705788], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 4.055999999999999, 2, 22, 4.0, 5.0, 6.0, 8.990000000000009, 0.2336659334229676, 0.13410918528516824, 0.09857781566281446], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 0, 0.0, 15.766000000000004, 10, 464, 14.0, 17.0, 20.0, 71.81000000000017, 0.2324560751000491, 0.1209293708657687, 2.5576978497580596], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 42.88000000000001, 26, 60, 45.0, 54.0, 56.0, 59.0, 0.23363263231083234, 0.9716539331527976, 0.09719482555118611], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 2.524000000000002, 1, 12, 2.0, 3.0, 4.0, 7.990000000000009, 0.23363809085904988, 0.14595763974945586, 0.09879423177926622], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 37.24599999999995, 23, 68, 38.5, 47.0, 49.0, 51.99000000000001, 0.23363197730218613, 0.9588744602809285, 0.08487411675430981], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 1025.1460000000013, 723, 1431, 1024.5, 1324.5000000000002, 1389.0, 1415.98, 0.23354783923874614, 0.9877226199898733, 0.11358088275478083], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 6.535999999999999, 4, 17, 6.0, 9.0, 10.0, 14.990000000000009, 0.2335889731055, 0.34735182152097255, 0.11930374309978173], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 4.214000000000003, 3, 16, 4.0, 5.0, 6.0, 9.990000000000009, 0.23247347593876277, 0.22423474308542518, 0.1271339321540109], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 8.794, 6, 32, 9.0, 11.0, 12.949999999999989, 16.0, 0.23363121313007418, 0.3807253336545762, 0.15263601717189418], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 544.0, 544, 544, 544.0, 544.0, 544.0, 544.0, 1.838235294117647, 0.7952521829044117, 2174.2463953354777], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 4.744000000000006, 3, 17, 5.0, 6.0, 7.0, 12.990000000000009, 0.23247466491101798, 0.23354395755919272, 0.13644265001125178], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 8.899999999999999, 6, 22, 9.0, 11.0, 12.0, 15.0, 0.23363044896296115, 0.36703480424922386, 0.13894623380707358], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 7.292000000000005, 5, 19, 7.0, 9.0, 10.0, 14.0, 0.2336295756352388, 0.36155773906730404, 0.13347002123692844], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 2015.479999999999, 1564, 2864, 1970.0, 2410.8, 2529.75, 2615.99, 0.2334071989315552, 0.3564269248449826, 0.12855630878652063], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 13.923999999999994, 9, 86, 13.0, 16.900000000000034, 19.0, 46.960000000000036, 0.23245002324500233, 0.120926222541841, 1.8741283124128312], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 13.44399999999999, 9, 28, 13.0, 17.0, 18.0, 22.0, 0.23363306898530353, 0.4229374573327607, 0.19484632901704024], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 8.908000000000005, 6, 18, 9.0, 11.0, 12.949999999999989, 16.0, 0.23363263231083234, 0.3955578427379034, 0.16746714073842864], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 86.0, 86, 86, 86.0, 86.0, 86.0, 86.0, 11.627906976744185, 5.484647529069768, 1585.8466569767443], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 648.0, 648, 648, 648.0, 648.0, 648.0, 648.0, 1.5432098765432098, 0.715844425154321, 2951.301480516975], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 2.7520000000000007, 2, 27, 2.0, 3.0, 4.0, 8.0, 0.23252277444314284, 0.1954440206942944, 0.098322618490118], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 668.2759999999995, 479, 883, 643.5, 805.0, 821.0, 848.98, 0.2324425669283505, 0.20468338576656536, 0.1075954850820685], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 3.5659999999999994, 2, 14, 3.0, 4.0, 5.0, 9.0, 0.2325026633180083, 0.21063969315112255, 0.11352669107324624], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 928.9219999999997, 725, 1216, 891.5, 1129.0, 1147.95, 1178.98, 0.23239189826068607, 0.2198440974258879, 0.12277736031155387], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 98.0, 98, 98, 98.0, 98.0, 98.0, 98.0, 10.204081632653061, 4.832987882653061, 671.9048947704082], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 0, 0.0, 29.912000000000013, 19, 1253, 27.0, 32.900000000000034, 37.0, 90.91000000000008, 0.23231588269348893, 0.1208564393258286, 10.597143438098502], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 38.047999999999995, 26, 293, 36.0, 44.0, 48.0, 120.0, 0.23253077661093835, 52.591628807022936, 0.07175754434478175], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 418.0, 418, 418, 418.0, 418.0, 418.0, 418.0, 2.3923444976076556, 1.2545790968899522, 0.98123504784689], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 3.0699999999999985, 2, 11, 3.0, 4.0, 5.0, 7.990000000000009, 0.2336395101233663, 0.2538799016693076, 0.10016381342202912], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 3.8420000000000054, 2, 10, 4.0, 5.0, 6.0, 9.0, 0.23363863672790025, 0.23973286327770713, 0.08601734965470546], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 2.1179999999999994, 1, 12, 2.0, 3.0, 4.0, 6.990000000000009, 0.23366778982984313, 0.13251291233602364, 0.09059190679926535], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 124.882, 87, 168, 124.0, 153.0, 156.0, 161.0, 0.23365621506839584, 0.21282567222308932, 0.07621208577426192], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 0, 0.0, 99.38199999999996, 69, 491, 97.0, 113.0, 121.89999999999998, 397.29000000000065, 0.232498663132687, 0.12095152620841179, 68.74831075190068], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 251.45199999999983, 14, 454, 317.0, 409.90000000000003, 418.0, 431.99, 0.23363568906641047, 0.13021310947958117, 0.09788057676708017], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 471.8840000000003, 354, 629, 444.5, 573.0, 581.95, 604.98, 0.23361920536763486, 0.1256410474492287, 0.09947067728543828], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 8.233999999999995, 5, 304, 7.0, 9.0, 12.0, 28.99000000000001, 0.2322852313979018, 0.104734779481177, 0.16854289739125103], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 445.1719999999999, 316, 581, 451.5, 526.0, 537.0, 559.99, 0.23360316055732108, 0.12015734443080721, 0.09398877163048465], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 3.9819999999999958, 2, 15, 4.0, 5.0, 6.0, 11.980000000000018, 0.23252147684620889, 0.1427622829179492, 0.11626073842310446], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 4.420000000000004, 2, 29, 4.0, 5.0, 6.0, 10.990000000000009, 0.23251877356577771, 0.13617561884290288, 0.10967438245338929], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 758.9720000000008, 538, 1152, 712.0, 953.7, 1092.0, 1127.97, 0.232445484560506, 0.21240387144346787, 0.10237589212576975], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 275.0919999999998, 183, 360, 269.5, 332.0, 339.0, 348.99, 0.2325252615444142, 0.20589158192864823, 0.0955987647560531], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 5.203999999999998, 3, 49, 5.0, 6.0, 7.0, 15.990000000000009, 0.23247574580544011, 0.15499366837776563, 0.10874597875078693], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 1251.2120000000002, 953, 10827, 1151.0, 1490.0, 1503.95, 1525.98, 0.2323755895949647, 0.1746697412765042, 0.12844197628002932], "isController": false}, {"data": ["Query single patient #2", 500, 0, 0.0, 165.15199999999993, 145, 213, 161.0, 185.0, 186.0, 190.0, 0.233661674718648, 4.517773179559417, 0.11774357827619371], "isController": false}, {"data": ["Query single patient #1", 500, 0, 0.0, 224.15999999999988, 195, 265, 219.0, 251.0, 253.0, 261.0, 0.2336482444371858, 0.45285547579778024, 0.16702198723439451], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 7.8000000000000025, 5, 18, 8.0, 10.0, 11.0, 14.0, 0.23358624494694555, 0.1906351179341913, 0.14416651055319296], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 7.878, 5, 27, 8.0, 10.0, 12.0, 17.0, 0.23358711795074957, 0.1942856291306962, 0.14781684807820872], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 9.01, 6, 34, 9.0, 11.0, 12.0, 18.99000000000001, 0.2335834077296487, 0.1890360408394894, 0.14256799788186567], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 11.146000000000011, 8, 27, 11.0, 14.0, 15.0, 20.0, 0.23358449895891387, 0.20888248197428422, 0.16241422193236982], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 8.489999999999993, 5, 37, 9.0, 10.0, 11.0, 17.980000000000018, 0.23355002104285688, 0.17532444987876417, 0.12886304871993567], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 2062.8979999999997, 1642, 2741, 1999.5, 2544.6000000000004, 2671.75, 2717.99, 0.23336798069953452, 0.19501495582460807, 0.14858976896103174], "isController": false}]}, function(index, item){
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

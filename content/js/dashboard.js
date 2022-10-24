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

    var data = {"OkPercent": 97.80897681344395, "KoPercent": 2.191023186556052};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8986385875345672, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Query cross patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [0.998, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.001, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.974, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.493, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.995, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [1.0, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [0.975, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.696, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.605, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 23505, 515, 2.191023186556052, 190.381663475856, 1, 3908, 17.0, 564.0, 1214.0, 2292.970000000005, 25.86505713861272, 171.41186744674033, 214.29508554973563], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query cross patient #1", 500, 500, 100.0, 25.563999999999997, 16, 72, 27.0, 30.0, 32.0, 45.99000000000001, 0.5603069585641799, 0.3253785678946354, 0.2834365278674269], "isController": false}, {"data": ["Query participation #2", 500, 0, 0.0, 7.927999999999996, 4, 30, 7.0, 10.0, 13.0, 23.99000000000001, 0.56002580598914, 6.005625957994144, 0.20344687483199225], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 8.208, 4, 43, 8.0, 10.0, 12.0, 18.980000000000018, 0.5600019712069386, 6.013236635342956, 0.2373445854529408], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 1, 0.2, 22.16200000000001, 14, 298, 20.0, 28.0, 33.0, 46.99000000000001, 0.5566224151846595, 0.3003086645236704, 6.1978601347026245], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 44.255999999999986, 26, 92, 46.0, 54.0, 56.0, 66.94000000000005, 0.5598564975825397, 2.3284486407943916, 0.23400252047395212], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 2.6339999999999986, 1, 24, 2.0, 3.0, 4.0, 9.0, 0.5598909780287582, 0.34990014869304653, 0.23784431195557604], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 39.11000000000001, 23, 57, 41.0, 48.0, 50.0, 54.0, 0.5598427065931556, 2.2977114662364464, 0.20447380104085958], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 775.7519999999994, 583, 1411, 766.0, 917.9000000000001, 937.9, 1150.4400000000005, 0.5595344673231871, 2.3663565038887646, 0.27321018912264994], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 11.22800000000001, 7, 31, 11.0, 14.0, 16.94999999999999, 22.0, 0.5596152533210368, 0.832128207714632, 0.2869121171811956], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 3.509999999999998, 2, 18, 3.0, 5.0, 6.0, 10.990000000000009, 0.5573328280182359, 0.5376443927440839, 0.3058799310021959], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 18.10400000000001, 11, 47, 19.0, 22.900000000000034, 24.0, 35.99000000000001, 0.5598144998673239, 0.912210073819939, 0.36683157169040465], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 603.0, 603, 603, 603.0, 603.0, 603.0, 603.0, 1.658374792703151, 0.7077243988391376, 1961.5124248548923], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 4.622000000000002, 2, 23, 4.0, 6.0, 7.0, 12.0, 0.5573415255106363, 0.5600313515058254, 0.3282001366044079], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 18.813999999999993, 12, 44, 20.0, 24.0, 25.0, 33.0, 0.5598044714941965, 0.8795829355222808, 0.33402395711225985], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 10.920000000000014, 6, 34, 11.0, 14.0, 15.0, 22.99000000000001, 0.5598025912142343, 0.8663961927965722, 0.3209024619558159], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 1987.8920000000007, 1474, 3391, 1962.0, 2252.9, 2361.7, 2584.5800000000004, 0.5587072854312605, 0.8531482073038686, 0.3088167222207944], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 18.836, 12, 75, 17.0, 24.900000000000034, 30.0, 44.99000000000001, 0.5565858578212558, 0.3004204780042835, 4.488560560437432], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 22.58199999999998, 15, 52, 24.0, 28.0, 30.0, 40.97000000000003, 0.5598370650205964, 1.013452700975908, 0.46798879654065484], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 18.028, 11, 51, 19.0, 23.0, 24.0, 30.980000000000018, 0.5598251554074631, 0.9477632133432087, 0.40237433044911414], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 80.0, 80, 80, 80.0, 80.0, 80.0, 80.0, 12.5, 5.82275390625, 1704.8095703125], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 710.0, 710, 710, 710.0, 710.0, 710.0, 710.0, 1.4084507042253522, 0.6450814260563381, 2693.584947183099], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 2.4480000000000026, 1, 19, 2.0, 3.0, 4.949999999999989, 9.980000000000018, 0.5573496019966492, 0.4682836115947667, 0.23676472350443595], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 416.18600000000004, 312, 899, 412.0, 484.90000000000003, 502.0, 628.0, 0.5571415518397929, 0.4905424612201623, 0.2589837682380287], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 3.311999999999993, 1, 20, 3.0, 4.0, 6.0, 13.0, 0.5573688622540889, 0.5049261130934863, 0.27324137583159436], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 1167.6600000000005, 920, 1745, 1155.5, 1347.9, 1386.95, 1571.7100000000003, 0.5567600130504547, 0.5266666993763174, 0.2952350459828095], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 67.0, 67, 67, 67.0, 67.0, 67.0, 67.0, 14.925373134328359, 6.981693097014925, 982.8154151119402], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 2, 0.4, 45.382000000000005, 12, 680, 44.0, 52.0, 60.94999999999999, 96.99000000000001, 0.5561716701724021, 0.2997765302229247, 25.440508819214173], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 44.716, 8, 181, 45.0, 53.0, 62.89999999999998, 89.92000000000007, 0.5569497865211469, 123.17858057100163, 0.17295901573605926], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 269.0, 269, 269, 269.0, 269.0, 269.0, 269.0, 3.717472118959108, 1.9494946561338289, 1.5320051115241635], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 2.362000000000003, 1, 11, 2.0, 3.0, 4.0, 8.0, 0.5600753637409449, 0.60853172777929, 0.24120433145484058], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 3.469999999999999, 2, 18, 3.0, 5.0, 6.0, 10.980000000000018, 0.5600684627688889, 0.5746455571729088, 0.2072909642474696], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 2.263999999999999, 1, 12, 2.0, 3.0, 4.0, 7.990000000000009, 0.5600396060009364, 0.31759824179765994, 0.2182185574163805], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 122.61400000000002, 85, 256, 122.0, 144.0, 150.0, 186.99, 0.5599781384534748, 0.5101193036923838, 0.1837428266800464], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 12, 2.4, 170.22200000000007, 26, 615, 172.0, 203.0, 226.95, 323.84000000000015, 0.5567265370384599, 0.29790850192404694, 164.69101816376], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 2.399999999999999, 1, 18, 2.0, 3.0, 4.0, 7.990000000000009, 0.5600640713297601, 0.31226962989566004, 0.2357300925225846], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 3.5440000000000005, 1, 26, 3.0, 5.0, 6.0, 15.940000000000055, 0.5601174006071673, 0.30123266961755185, 0.23958146627533133], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 11.832000000000003, 6, 308, 10.0, 15.0, 19.0, 36.98000000000002, 0.5559991192973951, 0.23491614351782866, 0.4045110780044524], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 4.833999999999999, 2, 65, 4.0, 6.0, 7.0, 14.990000000000009, 0.5600778732274936, 0.28811630969169955, 0.2264377339025218], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 4.057999999999996, 2, 15, 4.0, 5.0, 6.949999999999989, 13.0, 0.5573433892943253, 0.3423209628413589, 0.2797602559543781], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 4.177999999999998, 2, 27, 4.0, 5.0, 6.949999999999989, 14.0, 0.5573291006045906, 0.3264653174797355, 0.2639693494074477], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 538.3679999999996, 379, 1132, 547.0, 640.0, 656.0, 892.6000000000004, 0.5568685277955356, 0.5088233903993639, 0.2463490655189235], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 18.29000000000002, 7, 109, 17.0, 29.0, 36.0, 59.99000000000001, 0.557055892760056, 0.4932185930495022, 0.23011195570068718], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 9.96, 6, 49, 10.0, 12.0, 14.0, 21.99000000000001, 0.5573514658343551, 0.3714333860494928, 0.26180278815070784], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 550.5699999999995, 373, 3550, 533.0, 606.9000000000001, 641.8, 724.94, 0.5571508641967055, 0.41873043181699154, 0.30904461998411004], "isController": false}, {"data": ["Query single patient #2", 500, 0, 0.0, 173.7880000000001, 142, 387, 178.0, 190.90000000000003, 196.0, 297.8800000000001, 0.5601826643631955, 10.831078204230835, 0.28337365248060087], "isController": false}, {"data": ["Query single patient #1", 500, 0, 0.0, 263.40800000000013, 210, 474, 267.0, 286.0, 294.0, 401.95000000000005, 0.5599944448551071, 1.0854726696111174, 0.4014022680895006], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 18.28600000000001, 11, 44, 19.0, 22.0, 24.0, 31.0, 0.5595945849151207, 0.4566029502945706, 0.3464677410509634], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 18.154000000000003, 11, 48, 19.0, 23.0, 24.0, 36.0, 0.5596027268321674, 0.46538508257218036, 0.35521657464932493], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 18.292000000000012, 11, 42, 19.0, 22.0, 25.0, 36.0, 0.5595714130633066, 0.4529173203160235, 0.3426281992096613], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 20.922, 13, 44, 22.0, 26.0, 27.94999999999999, 34.0, 0.5595820593515115, 0.5005319439517013, 0.3901773343525188], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 17.680000000000017, 11, 46, 18.0, 22.0, 24.0, 38.99000000000001, 0.5593573208126791, 0.4198741439036205, 0.30972226650467677], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 2247.0340000000006, 1664, 3908, 2228.0, 2577.0, 2674.95, 3352.880000000001, 0.5583447980131859, 0.46655160459919776, 0.35659911904357766], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["No results for path: $['rows'][1]", 500, 97.0873786407767, 2.1272069772388855], "isController": false}, {"data": ["500", 15, 2.912621359223301, 0.06381620931716656], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 23505, 515, "No results for path: $['rows'][1]", 500, "500", 15, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["Query cross patient #1", 500, 500, "No results for path: $['rows'][1]", 500, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 1, "500", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 2, "500", 2, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 12, "500", 12, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});

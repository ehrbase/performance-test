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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8735588172729206, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Query cross patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.998, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [1.0, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [0.995, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [0.796, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [0.813, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.455, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 23505, 500, 2.1272069772388855, 463.3995320144641, 1, 19822, 11.0, 1002.0, 1876.9000000000015, 10470.990000000002, 10.712752391170195, 67.48242204057081, 88.6489402370957], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query cross patient #1", 500, 500, 100.0, 10547.767999999996, 9112, 19822, 10421.0, 11273.0, 11622.55, 18841.160000000058, 0.23065773436901732, 0.13398556396854014, 0.11622987395938764], "isController": false}, {"data": ["Query participation #2", 500, 0, 0.0, 2.895999999999999, 2, 10, 3.0, 4.0, 4.0, 7.990000000000009, 0.23161970268368487, 0.11891093154085935, 0.08369071288375332], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 4.182000000000001, 2, 17, 4.0, 5.0, 6.0, 9.0, 0.23161820055819984, 0.13293391860357387, 0.09771392836049057], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 0, 0.0, 16.439999999999998, 10, 479, 14.0, 19.0, 22.0, 82.98000000000002, 0.23034065540208726, 0.11982887747973234, 2.534422035561833], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 42.79600000000004, 26, 63, 45.0, 54.0, 56.0, 59.0, 0.231582262651339, 0.9631266579842617, 0.09634183973581095], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 2.548, 1, 9, 2.0, 4.0, 4.0, 7.0, 0.2315870894829355, 0.14467634473938348, 0.0979269626426866], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 37.436, 23, 64, 39.0, 48.0, 49.0, 52.0, 0.2315809755302278, 0.9504567203814879, 0.08412902626684056], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 1022.8740000000006, 731, 1462, 989.5, 1277.8000000000002, 1396.9, 1421.99, 0.23150173788354628, 0.9790692297555202, 0.11258580611914652], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 6.934000000000003, 4, 22, 7.0, 9.0, 10.0, 15.0, 0.23154140353915667, 0.34430704158506764, 0.11825796294040912], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 4.482000000000003, 3, 22, 4.0, 6.0, 6.0, 11.990000000000009, 0.2304460744663445, 0.22227919161245424, 0.12602519697378214], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 9.409999999999995, 6, 20, 9.0, 12.0, 13.0, 17.0, 0.23158043923398747, 0.3773833933145969, 0.15129620492923596], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 474.0, 474, 474, 474.0, 474.0, 474.0, 474.0, 2.109704641350211, 0.9126944883966245, 2495.3376351529537], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 5.03, 3, 16, 5.0, 6.0, 7.0, 11.0, 0.2304479862763615, 0.23150795699448815, 0.1352531638204036], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 9.713999999999999, 6, 25, 10.0, 12.0, 13.0, 16.99000000000001, 0.23157861584534994, 0.363811362398997, 0.137725954150213], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 7.526, 5, 18, 7.0, 9.0, 10.0, 15.0, 0.2315777577900442, 0.35838241069087984, 0.13229784014372642], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 2044.6060000000002, 1616, 2676, 2002.0, 2392.6000000000004, 2502.85, 2624.91, 0.23135637766244918, 0.3532951965962387, 0.12742675488439584], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 14.191999999999998, 9, 83, 13.0, 17.0, 19.0, 49.88000000000011, 0.23033450097569694, 0.11982567579566751, 1.8570719141165568], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 14.042000000000005, 9, 26, 14.0, 17.0, 18.0, 23.0, 0.23158161908899497, 0.41922379211080163, 0.19313545185742356], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 9.526000000000007, 6, 19, 9.0, 12.0, 13.0, 16.99000000000001, 0.2315811900494194, 0.39208459472712787, 0.16599667333620494], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 65.0, 65, 65, 65.0, 65.0, 65.0, 65.0, 15.384615384615385, 7.256610576923077, 2098.1971153846152], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 543.0, 543, 543, 543.0, 543.0, 543.0, 543.0, 1.8416206261510129, 0.8542673802946592, 3521.9951369705336], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 2.837999999999997, 2, 17, 3.0, 4.0, 4.0, 7.0, 0.23045828935420978, 0.1937087443652948, 0.09744964774450472], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 683.5799999999996, 512, 888, 656.5, 820.9000000000001, 838.0, 864.0, 0.2303856563733427, 0.20287211934414734, 0.10664336046969185], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 3.7479999999999976, 2, 20, 3.0, 5.0, 5.0, 9.980000000000018, 0.23045032297612766, 0.20878034094549158, 0.11252457176568734], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 943.2980000000001, 750, 1231, 909.0, 1144.0, 1166.0, 1194.94, 0.23036071262547173, 0.21792258391349678, 0.12170424368201191], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 60.0, 60, 60, 60.0, 60.0, 60.0, 60.0, 16.666666666666668, 7.893880208333334, 1097.4446614583335], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 0, 0.0, 31.080000000000023, 20, 1674, 27.0, 32.900000000000034, 37.0, 112.94000000000005, 0.23015807256423712, 0.11973389339423315, 10.498714423315933], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 39.022, 26, 382, 37.0, 45.900000000000034, 51.0, 127.94000000000005, 0.23041825060012433, 52.11383749945851, 0.07110563202113211], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 463.0, 463, 463, 463.0, 463.0, 463.0, 463.0, 2.1598272138228944, 1.13264376349892, 0.8858666306695464], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 3.2439999999999976, 2, 10, 3.0, 4.0, 5.0, 7.0, 0.23158966387539362, 0.2516524754792864, 0.0992850219153299], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 3.9479999999999977, 2, 22, 4.0, 5.0, 6.0, 9.0, 0.2315888057382148, 0.23762956452851533, 0.08526267555010447], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 2.229999999999999, 1, 11, 2.0, 3.0, 4.0, 8.990000000000009, 0.2316205610498526, 0.13135192969458975, 0.08979820579764794], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 125.85000000000004, 90, 169, 126.0, 153.0, 157.0, 164.99, 0.2316091882144275, 0.2109611386127721, 0.07554440318712771], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 0, 0.0, 103.024, 69, 595, 99.0, 113.90000000000003, 129.0, 505.4600000000014, 0.23038353329088135, 0.11985118361268106, 68.12288090346286], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 250.766, 15, 441, 315.0, 413.0, 419.0, 429.99, 0.23158676768790254, 0.12907117596402623, 0.09702219075987324], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 486.52599999999995, 350, 649, 463.5, 592.0, 604.95, 625.99, 0.2315600618172741, 0.12453363441737406, 0.09859393257063624], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 8.540000000000013, 5, 315, 7.0, 10.0, 13.0, 29.920000000000073, 0.23012724655971273, 0.10376176856355955, 0.16697709393932283], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 457.228, 333, 592, 460.0, 548.0, 557.95, 575.99, 0.2315519118546706, 0.119102253411107, 0.09316346453527763], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 4.164000000000008, 3, 20, 4.0, 5.0, 6.0, 10.0, 0.23045722713864306, 0.14149488601009402, 0.11522861356932154], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 4.584000000000001, 2, 27, 4.0, 6.0, 6.0, 10.0, 0.23045457164256497, 0.13496671011695568, 0.10870074033531141], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 775.348, 554, 1162, 743.0, 977.6000000000001, 1093.75, 1141.0, 0.2303810917944245, 0.21051747207320406, 0.1014666722649272], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 275.3580000000003, 189, 403, 268.0, 336.0, 344.0, 362.98, 0.23042653333880211, 0.2040332441832278, 0.09473590872620673], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 5.273999999999995, 3, 49, 5.0, 6.0, 7.949999999999989, 11.0, 0.2304491546203212, 0.15364252182699167, 0.10779799322571665], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 1264.807999999999, 945, 11000, 1156.0, 1498.0, 1514.0, 1752.0600000000018, 0.23034861419970212, 0.1731461248395046, 0.12732159730178846], "isController": false}, {"data": ["Query single patient #2", 500, 0, 0.0, 166.26999999999992, 144, 195, 166.5, 185.0, 187.0, 192.0, 0.23161251411678274, 4.478153319696375, 0.11671099344166005], "isController": false}, {"data": ["Query single patient #1", 500, 0, 0.0, 224.334, 196, 271, 213.5, 253.0, 255.0, 261.99, 0.2315987819756858, 0.4488832212646127, 0.16555694180293168], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 8.407999999999998, 5, 27, 8.0, 10.900000000000034, 11.0, 17.0, 0.23153829411846424, 0.18896373806420094, 0.14290254090123966], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 8.203999999999997, 5, 22, 8.0, 10.0, 11.0, 16.0, 0.23153979520768195, 0.19258277243782693, 0.14652127665486123], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 9.516000000000009, 6, 22, 10.0, 12.0, 13.0, 16.0, 0.23153604252113114, 0.1873791345680533, 0.14131838532783883], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 11.780000000000001, 7, 34, 12.0, 15.0, 15.0, 22.0, 0.23153657861176224, 0.2070511332036883, 0.16099027731599094], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 8.871999999999993, 5, 37, 9.0, 11.0, 12.0, 30.88000000000011, 0.2315212473994376, 0.1738014629769743, 0.127743657012385], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 2066.9580000000014, 1675, 2753, 2016.0, 2492.8, 2659.75, 2721.98, 0.23133507636602207, 0.19331615058317259, 0.1472953806549281], "isController": false}]}, function(index, item){
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

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

    var data = {"OkPercent": 97.79195915762604, "KoPercent": 2.208040842373963};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8770899808551372, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Query cross patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [0.998, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.395, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [0.997, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.806, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.313, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.995, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [1.0, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [0.904, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.519, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [0.998, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.503, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [0.953, 500, 1500, "Query single patient #2"], "isController": false}, {"data": [0.843, 500, 1500, "Query single patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 23505, 519, 2.208040842373963, 291.7947670708348, 1, 6940, 33.0, 814.9000000000015, 1881.9500000000007, 3786.9600000000064, 16.703857414935047, 110.38716237958903, 138.36082767107152], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query cross patient #1", 500, 500, 100.0, 51.171999999999976, 21, 134, 42.0, 86.0, 92.0, 103.0, 0.36145161861649333, 0.20981842884571872, 0.18213772969346734], "isController": false}, {"data": ["Query participation #2", 500, 0, 0.0, 14.952000000000004, 4, 104, 12.0, 26.0, 31.0, 50.98000000000002, 0.3613528762604892, 3.862830487694489, 0.13056695724255957], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 16.120000000000008, 5, 41, 15.0, 27.0, 31.0, 36.0, 0.361344780735987, 3.880099082997283, 0.15244232937299454], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 1, 0.2, 73.03200000000001, 13, 351, 66.0, 135.0, 148.0, 179.96000000000004, 0.35960848704798115, 0.19401580236564847, 4.0034538597138525], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 67.63199999999993, 27, 173, 57.0, 114.0, 127.94999999999999, 155.0, 0.3612440087681146, 1.5024173602401116, 0.15028315208517268], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 7.344000000000004, 1, 47, 6.0, 14.0, 16.0, 25.0, 0.36127898541299963, 0.22575843974805848, 0.15276738348030164], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 61.76800000000002, 24, 136, 54.0, 99.0, 109.94999999999999, 120.0, 0.36122156463843164, 1.4825697105694151, 0.13122502152880525], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 1131.0919999999996, 587, 2616, 909.0, 2193.8, 2340.75, 2455.86, 0.3611307726754012, 1.527174780297066, 0.1756280515550291], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 26.48200000000001, 8, 79, 23.0, 44.900000000000034, 51.94999999999999, 65.98000000000002, 0.3613562712658166, 0.5373854737760141, 0.18455989245314655], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 11.512000000000004, 2, 38, 8.5, 24.0, 28.0, 34.99000000000001, 0.3599750897237911, 0.34725854783348997, 0.19686137719269828], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 41.33599999999994, 15, 108, 32.0, 72.90000000000003, 79.0, 88.0, 0.3611837291064242, 0.5884621178314963, 0.23596866676972442], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 893.0, 893, 893, 893.0, 893.0, 893.0, 893.0, 1.1198208286674132, 0.47789228723404253, 1324.5129216825308], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 11.126, 2, 36, 9.0, 20.0, 24.0, 32.0, 0.35998156894367006, 0.36169851228617095, 0.21127824505385323], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 42.55599999999998, 16, 164, 34.0, 74.90000000000003, 79.94999999999999, 102.97000000000003, 0.3611646838725522, 0.5674532043433664, 0.21479423093592215], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 25.842000000000006, 8, 72, 21.5, 44.0, 48.0, 56.99000000000001, 0.36116207509281867, 0.558963912911183, 0.20632794329033097], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 2831.67, 1544, 6091, 2462.5, 4332.1, 4881.15, 5897.690000000001, 0.3604996236383929, 0.5505455902694663, 0.19855643333208362], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 1, 0.2, 77.24999999999997, 13, 676, 69.0, 143.90000000000003, 158.84999999999997, 206.96000000000004, 0.3595650413607667, 0.1939719965801769, 2.8989931459711817], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 48.03399999999999, 18, 108, 41.0, 78.0, 85.94999999999999, 97.98000000000002, 0.3612077341800043, 0.6539426162817998, 0.30124160643527703], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 41.002, 15, 108, 32.0, 74.0, 78.0, 91.0, 0.361192861095339, 0.6115065683824773, 0.2589019141054481], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 129.0, 129, 129, 129.0, 129.0, 129.0, 129.0, 7.751937984496124, 3.6110101744186047, 1057.2311046511627], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 989.0, 989, 989, 989.0, 989.0, 989.0, 989.0, 1.0111223458038423, 0.46310193377148634, 1933.7142157482306], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 8.832, 1, 86, 6.0, 19.0, 23.0, 37.930000000000064, 0.3602936248925424, 0.3026769039446387, 0.15235072224460044], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 610.2440000000001, 316, 1386, 475.0, 1186.8000000000002, 1241.95, 1311.97, 0.3602129002325534, 0.3171132860115643, 0.1667391745217093], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 10.546000000000005, 2, 39, 7.0, 23.0, 26.94999999999999, 36.0, 0.3603149152359162, 0.32645375808456595, 0.1759350172050372], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 1724.0780000000004, 940, 3712, 1361.5, 3244.7000000000003, 3505.75, 3628.98, 0.35972128794609937, 0.34033919581608174, 0.1900480632605857], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 176.0, 176, 176, 176.0, 176.0, 176.0, 176.0, 5.681818181818182, 2.6578036221590913, 374.1288618607955], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 2, 0.4, 105.9339999999999, 30, 1056, 96.5, 175.0, 193.0, 228.98000000000002, 0.359306911340301, 0.19370712794847253, 16.434782337262714], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 129.93799999999993, 10, 494, 115.0, 239.0, 261.69999999999993, 325.9100000000001, 0.3596860947513886, 79.24749038019539, 0.11099688080218631], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 421.0, 421, 421, 421.0, 421.0, 421.0, 421.0, 2.375296912114014, 1.2456391033254157, 0.9742428741092637], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 8.568000000000008, 1, 35, 6.0, 19.0, 20.0, 27.0, 0.36135418202421943, 0.3926381380250115, 0.15491649014514874], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 10.284000000000011, 2, 70, 8.0, 20.0, 23.0, 33.0, 0.36135183165629947, 0.3706749912191505, 0.13303675833439932], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 6.026000000000006, 1, 19, 5.0, 12.0, 15.0, 17.0, 0.36136410613697434, 0.20497037921007252, 0.14009917005505743], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 185.9099999999998, 91, 444, 142.0, 357.90000000000003, 384.0, 419.9200000000001, 0.3613157965098339, 0.3291657475696093, 0.117851050814731], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 14, 2.8, 315.4580000000003, 28, 845, 275.0, 515.0, 552.0, 666.6900000000003, 0.3596069352355102, 0.1921565277289312, 106.3783336012405], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 6.7239999999999975, 1, 29, 5.0, 13.900000000000034, 16.0, 19.0, 0.3613497424660385, 0.201453892947248, 0.15138578077922904], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 9.699999999999985, 2, 47, 7.0, 20.0, 23.0, 32.99000000000001, 0.3613782097612591, 0.19439112672847197, 0.1538680658749111], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 62.04999999999992, 7, 448, 52.0, 128.90000000000003, 145.95, 199.91000000000008, 0.3591990149326214, 0.15178613842919397, 0.2606297539989626], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 11.057999999999998, 2, 89, 9.0, 20.0, 24.0, 33.98000000000002, 0.36135522664199815, 0.18592996800199468, 0.14538901696924145], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 10.142000000000003, 2, 47, 8.0, 20.0, 24.0, 31.0, 0.36028609598309824, 0.22126773553343237, 0.18014304799154912], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 11.69, 2, 93, 9.0, 24.0, 27.0, 36.0, 0.36026922198420436, 0.2110340296346654, 0.16993167404137763], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 809.1339999999996, 381, 1836, 632.0, 1593.8000000000002, 1650.75, 1761.93, 0.3597968730773355, 0.32879531281819535, 0.158465224372928], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 30.458000000000037, 5, 397, 25.0, 56.0, 64.0, 86.97000000000003, 0.35981318499435094, 0.3186201973935133, 0.1479310067213103], "isController": false}, {"data": ["Query magnitude #1", 500, 1, 0.2, 24.437999999999985, 7, 214, 21.0, 40.900000000000034, 47.0, 54.97000000000003, 0.3599859749464161, 0.23961285218327893, 0.16839187695247393], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 833.188, 462, 5580, 803.5, 1018.8000000000001, 1071.0, 1266.6900000000003, 0.35980464047240907, 0.2703728077553012, 0.19887639307361674], "isController": false}, {"data": ["Query single patient #2", 500, 0, 0.0, 252.65400000000005, 142, 615, 195.0, 497.0, 520.95, 561.98, 0.36141686978294746, 6.987960588529424, 0.18212021953906338], "isController": false}, {"data": ["Query single patient #1", 500, 0, 0.0, 442.9140000000001, 220, 964, 355.0, 749.8000000000001, 799.9, 862.94, 0.36131449102350277, 0.7003587423834905, 0.25828340569258207], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 42.78400000000002, 15, 112, 34.0, 72.90000000000003, 78.94999999999999, 92.98000000000002, 0.36134269162725624, 0.2947363650497063, 0.2230161924886972], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 43.51400000000002, 15, 98, 36.0, 72.0, 76.94999999999999, 92.99000000000001, 0.36134582529941117, 0.30048728387906193, 0.22866415507228363], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 41.954, 15, 116, 33.0, 76.0, 83.0, 95.99000000000001, 0.36133485768465295, 0.2924645749563869, 0.22054129497354305], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 46.800000000000004, 17, 123, 39.0, 79.0, 88.0, 103.0, 0.3613398191421937, 0.3231888270656533, 0.25124409299730655], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 41.148000000000025, 15, 98, 32.0, 76.0, 79.94999999999999, 92.0, 0.3612377450095005, 0.2711992370658825, 0.1993157479788748], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 3295.965999999999, 1702, 6940, 2863.5, 4973.700000000001, 5673.85, 6751.800000000003, 0.3607896675611845, 0.3015363066701351, 0.22972154614247298], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["No results for path: $['rows'][1]", 500, 96.33911368015414, 2.1272069772388855], "isController": false}, {"data": ["400", 1, 0.1926782273603083, 0.0042544139544777706], "isController": false}, {"data": ["500", 18, 3.468208092485549, 0.07657945118059988], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 23505, 519, "No results for path: $['rows'][1]", 500, "500", 18, "400", 1, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["Query cross patient #1", 500, 500, "No results for path: $['rows'][1]", 500, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 1, "500", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 1, "500", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 2, "500", 2, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 14, "500", 14, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Query magnitude #1", 500, 1, "400", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});

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

    var data = {"OkPercent": 97.78770474367155, "KoPercent": 2.212295256328441};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8768134439480961, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Query cross patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [0.996, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.387, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [0.998, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.81, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.323, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.992, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [1.0, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [0.889, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #4"], "isController": false}, {"data": [0.999, 500, 1500, "Create EHR"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.522, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [0.999, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.502, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [0.952, 500, 1500, "Query single patient #2"], "isController": false}, {"data": [0.842, 500, 1500, "Query single patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 23505, 520, 2.212295256328441, 295.8884918102515, 1, 6988, 33.0, 822.9000000000015, 1905.7000000000044, 3845.930000000011, 16.57215497238679, 109.51308132425477, 137.26991444638213], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query cross patient #1", 500, 500, 100.0, 53.92000000000003, 21, 132, 44.0, 91.0, 97.0, 119.91000000000008, 0.3589233734490024, 0.20841180108646104, 0.18086373115203636], "isController": false}, {"data": ["Query participation #2", 500, 0, 0.0, 15.066, 4, 97, 12.0, 25.0, 29.94999999999999, 63.930000000000064, 0.35873126795001586, 3.831034142427793, 0.12961969642725182], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 15.618, 5, 43, 14.0, 27.0, 31.0, 38.99000000000001, 0.3587225173711379, 3.851921054366191, 0.1513360620159488], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 2, 0.4, 70.02400000000004, 14, 311, 63.0, 130.0, 143.0, 183.99, 0.3558807514777948, 0.19186003966290976, 3.961953678561388], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 66.78200000000011, 28, 160, 59.0, 112.0, 122.94999999999999, 147.97000000000003, 0.3584352723247825, 1.4907357979432267, 0.1491146738382396], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 7.376000000000004, 1, 40, 6.0, 15.0, 16.0, 25.980000000000018, 0.3584478633998206, 0.22398930920286214, 0.1515702391134007], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 60.17799999999999, 24, 203, 52.0, 99.0, 110.94999999999999, 130.99, 0.35843193198395656, 1.4711201591527387, 0.13021160029104673], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 1150.4579999999999, 590, 2570, 911.0, 2248.7000000000007, 2364.0, 2514.9700000000003, 0.3582904101421983, 1.5152444340032647, 0.17424670336993628], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 26.642000000000007, 9, 96, 23.0, 44.0, 48.0, 83.88000000000011, 0.3579887333785831, 0.5323572144037483, 0.1828399487861318], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 11.368000000000006, 2, 40, 8.0, 24.0, 28.0, 36.0, 0.3564759924113391, 0.3438830602341049, 0.19494780834995107], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 42.63399999999998, 15, 115, 33.0, 74.0, 81.0, 92.0, 0.35842679311963926, 0.5840109559869819, 0.2341675044892956], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 1242.0, 1242, 1242, 1242.0, 1242.0, 1242.0, 1242.0, 0.8051529790660226, 0.34360532407407407, 952.326923560789], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 11.586000000000006, 3, 153, 10.0, 20.0, 24.0, 35.98000000000002, 0.35647955055058267, 0.3581595996823767, 0.20922286121181657], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 43.01600000000005, 16, 142, 35.5, 76.0, 82.0, 95.0, 0.3584260223027008, 0.5631502856117758, 0.21316547615463358], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 26.348000000000024, 9, 66, 22.0, 47.0, 52.94999999999999, 60.0, 0.3584306472540628, 0.5547365321924486, 0.20476750844104175], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 2949.267999999999, 1527, 6247, 2597.0, 4495.200000000001, 4978.899999999999, 5986.600000000001, 0.3576225822925324, 0.5461518480236345, 0.19697181290330887], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 1, 0.2, 71.93799999999999, 12, 243, 66.0, 132.0, 147.95, 187.98000000000002, 0.35586150155048857, 0.1919740742885795, 2.8691333562508143], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 47.47600000000004, 19, 114, 39.5, 79.0, 84.94999999999999, 99.97000000000003, 0.3584309041993048, 0.648874746499743, 0.2989257736193421], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 43.69599999999999, 15, 134, 34.0, 76.0, 82.94999999999999, 93.98000000000002, 0.3584306472540628, 0.6068097846638278, 0.25692196785593957], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 130.0, 130, 130, 130.0, 130.0, 130.0, 130.0, 7.6923076923076925, 3.583233173076923, 1049.0985576923076], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 909.0, 909, 909, 909.0, 909.0, 909.0, 909.0, 1.1001100110011, 0.5038589796479648, 2103.898085121012], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 9.215999999999996, 1, 48, 7.0, 20.0, 23.0, 29.0, 0.3565113227996121, 0.2994994525322999, 0.15075136989475785], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 620.8700000000003, 321, 1384, 479.0, 1196.0, 1252.75, 1320.99, 0.35636470934537945, 0.31374571738710544, 0.16495788303682601], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 10.641999999999998, 1, 92, 8.0, 23.0, 27.0, 36.0, 0.3564637936160186, 0.3229443613042155, 0.17405458672657162], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 1711.0679999999998, 936, 3744, 1373.5, 3134.5000000000005, 3467.95, 3699.92, 0.35622862182983245, 0.33703471755166914, 0.18820281680658138], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 70.0, 70, 70, 70.0, 70.0, 70.0, 70.0, 14.285714285714285, 6.682477678571428, 940.6668526785713], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 3, 0.6, 105.04800000000006, 17, 947, 92.0, 176.0, 190.95, 229.98000000000002, 0.3556430595545642, 0.19154712910696606, 16.267196897867848], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 128.46400000000006, 10, 452, 114.0, 232.80000000000007, 267.9, 298.95000000000005, 0.3560061802672895, 78.43671678640341, 0.10986128219185885], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 366.0, 366, 366, 366.0, 366.0, 366.0, 366.0, 2.73224043715847, 1.4328253073770492, 1.1206454918032787], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 9.730000000000004, 1, 51, 7.0, 20.0, 24.0, 30.970000000000027, 0.35878197823772034, 0.38984324770523043, 0.1538137582483977], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 11.29, 2, 89, 9.0, 21.0, 28.0, 46.97000000000003, 0.3587794037660356, 0.36809715714860786, 0.13208968283183148], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 6.371999999999995, 1, 28, 5.0, 13.0, 15.0, 17.0, 0.3587413059044514, 0.20348269310865127, 0.1390823226992844], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 188.02800000000002, 84, 476, 142.0, 363.60000000000014, 394.4999999999999, 434.97, 0.35871582604004276, 0.32677680580237195, 0.11700301357165456], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 14, 2.8, 332.39800000000014, 55, 901, 292.5, 535.8000000000001, 575.95, 723.0, 0.35590431014355756, 0.19015786558312786, 105.28302912115836], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 7.539999999999995, 1, 40, 7.0, 15.0, 16.0, 25.980000000000018, 0.35877760165783956, 0.200019914399252, 0.1503081944445441], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 10.652, 2, 52, 9.0, 20.0, 24.0, 31.0, 0.3588038627388647, 0.1930063442353495, 0.15277195718178224], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 59.11400000000001, 8, 592, 49.0, 123.0, 139.0, 166.99, 0.3555027199513104, 0.15020406522692806, 0.2579477743396715], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 11.853999999999992, 2, 82, 11.0, 20.0, 24.0, 35.0, 0.35878326548741785, 0.1845659601506603, 0.14435420447345326], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 10.761999999999992, 2, 51, 9.0, 20.0, 24.0, 32.99000000000001, 0.35650801822183786, 0.21892725690074746, 0.17825400911091893], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 12.174000000000001, 2, 68, 10.0, 24.0, 28.0, 36.99000000000001, 0.3564912420796558, 0.2088210114957731, 0.16814967766061892], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 818.1920000000006, 379, 1836, 641.0, 1601.9, 1667.75, 1752.88, 0.3561963924429373, 0.32550506422220954, 0.15687946581227025], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 31.546000000000003, 4, 682, 28.0, 56.900000000000034, 67.0, 94.92000000000007, 0.3561195222585385, 0.3153292304951557, 0.1464124207723093], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 24.861999999999984, 8, 98, 21.0, 40.900000000000034, 45.0, 66.98000000000002, 0.35649505470060117, 0.23757749534060962, 0.16675891718905075], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 832.5119999999995, 441, 4726, 805.0, 1023.9000000000001, 1107.6499999999999, 1363.5800000000004, 0.35640433644284236, 0.267837858836796, 0.19699692815102418], "isController": false}, {"data": ["Query single patient #2", 500, 0, 0.0, 257.8440000000002, 145, 578, 197.0, 500.0, 530.8, 562.9200000000001, 0.358826779960242, 6.9378611255140195, 0.18081505708934068], "isController": false}, {"data": ["Query single patient #1", 500, 0, 0.0, 448.258, 225, 920, 376.0, 739.9000000000001, 794.6499999999999, 884.8700000000001, 0.3587371877013413, 0.6953426731606468, 0.2564410365208806], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 41.408, 16, 107, 32.5, 74.90000000000003, 80.0, 90.97000000000003, 0.3579774560117302, 0.29205227177863247, 0.22093921113223972], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 42.503999999999984, 15, 95, 34.0, 74.0, 78.94999999999999, 89.0, 0.3579830946063403, 0.297711186980656, 0.22653617705557474], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 42.23799999999998, 15, 100, 33.0, 76.0, 83.94999999999999, 92.99000000000001, 0.3579684858863765, 0.289739832307873, 0.21848662468650912], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 44.85200000000007, 17, 103, 36.0, 76.0, 84.0, 94.97000000000003, 0.35797104873346264, 0.3201757382794909, 0.24890174482248575], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 42.514000000000024, 15, 112, 32.0, 79.0, 84.0, 99.99000000000001, 0.3574983126079645, 0.2683716092625668, 0.19725248693701167], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 3318.938000000004, 1681, 6988, 2940.0, 5120.6, 5534.9, 6821.710000000001, 0.3570701678586859, 0.2984276694119411, 0.22735327094127267], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["No results for path: $['rows'][1]", 500, 96.15384615384616, 2.1272069772388855], "isController": false}, {"data": ["500", 20, 3.8461538461538463, 0.08508827908955541], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 23505, 520, "No results for path: $['rows'][1]", 500, "500", 20, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["Query cross patient #1", 500, 500, "No results for path: $['rows'][1]", 500, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 2, "500", 2, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 1, "500", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 3, "500", 3, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 14, "500", 14, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});

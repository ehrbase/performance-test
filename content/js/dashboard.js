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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8895341416719846, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Query cross patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.175, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.593, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [1.0, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [0.946, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [0.997, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.496, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.101, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 23505, 500, 2.1272069772388855, 326.29253350350945, 1, 17838, 9.0, 847.9000000000015, 1510.0, 6074.970000000005, 15.166786254458732, 95.53950676004408, 125.50645055219555], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query cross patient #1", 500, 500, 100.0, 6216.525999999996, 5162, 17838, 6065.0, 6597.400000000001, 6751.75, 15840.770000000077, 0.32721121156495303, 0.19003494104471996, 0.16488377457765213], "isController": false}, {"data": ["Query participation #2", 500, 0, 0.0, 2.3799999999999994, 1, 10, 2.0, 3.0, 4.0, 5.0, 0.3282873380886848, 0.168539000494729, 0.11861944833282557], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 3.5459999999999994, 1, 14, 3.0, 5.0, 5.0, 7.0, 0.32828496710912913, 0.18841441212861942, 0.13849522049916385], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 0, 0.0, 12.852000000000002, 8, 339, 11.0, 15.0, 17.0, 39.92000000000007, 0.3262600161824968, 0.16972848947322058, 3.5898160178986247], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 33.62200000000003, 24, 67, 33.0, 40.0, 41.0, 44.0, 0.3282226872773009, 1.3650441802096818, 0.13654576638684587], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 2.274000000000002, 1, 29, 2.0, 3.0, 3.0, 6.0, 0.3282304440301447, 0.20505107163137096, 0.13879275611821548], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 29.845999999999965, 21, 64, 30.0, 35.0, 37.0, 41.99000000000001, 0.32822247181717745, 1.34709361770583, 0.119237069839834], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 863.7039999999998, 681, 1138, 863.5, 1022.9000000000001, 1067.0, 1086.97, 0.328080329812594, 1.3875202784401355, 0.15955469164714042], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 5.6840000000000055, 3, 15, 5.0, 8.0, 8.949999999999989, 12.0, 0.32816646178140574, 0.4879905791202776, 0.1676084565543703], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 3.99, 2, 68, 4.0, 5.0, 5.0, 11.0, 0.32647262004724714, 0.3149026089324868, 0.17853971408833827], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 7.911999999999993, 5, 19, 8.0, 10.0, 11.0, 15.990000000000009, 0.3282267810733935, 0.5348782342236157, 0.21443722318173852], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 446.0, 446, 446, 446.0, 446.0, 446.0, 446.0, 2.242152466367713, 0.9699936939461883, 2651.995603279148], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 4.115999999999999, 3, 19, 4.0, 5.0, 6.0, 9.0, 0.32648626341695297, 0.3279879726949743, 0.191619379212489], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 8.277999999999992, 5, 21, 8.0, 10.0, 12.0, 16.99000000000001, 0.328223980043982, 0.5156417958364788, 0.19520351938162603], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 6.586000000000003, 4, 27, 6.0, 8.0, 9.0, 12.0, 0.3282216099795124, 0.507945378467415, 0.18750941585743627], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 1570.3780000000002, 1325, 1928, 1548.5, 1760.9, 1823.95, 1916.96, 0.3278716474304371, 0.5006798572299305, 0.18058555581129543], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 11.551999999999998, 7, 65, 10.0, 14.0, 17.94999999999999, 53.77000000000021, 0.32625043635995865, 0.16972350581378276, 2.6303941431521665], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 11.166, 8, 42, 11.0, 13.0, 15.0, 22.970000000000027, 0.32822828933980164, 0.5941797482735193, 0.27373726474237364], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 7.867999999999995, 5, 21, 8.0, 10.0, 10.0, 14.0, 0.32822828933980164, 0.5557154956165112, 0.23527301208536563], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 78.0, 78, 78, 78.0, 78.0, 78.0, 78.0, 12.82051282051282, 6.047175480769231, 1748.4975961538462], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 423.0, 423, 423, 423.0, 423.0, 423.0, 423.0, 2.3640661938534278, 1.0966127364066194, 4521.14269355792], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 2.327999999999999, 1, 17, 2.0, 3.0, 4.0, 7.0, 0.32647688347778847, 0.274415935916179, 0.13805126029871329], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 567.0299999999997, 442, 740, 556.0, 656.0, 668.0, 699.9300000000001, 0.3263737397078041, 0.2873969383124258, 0.15107534435693276], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 3.2980000000000005, 2, 17, 3.0, 4.0, 5.0, 9.0, 0.32646856989137085, 0.2957696845448473, 0.15940848139227093], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 768.7460000000002, 591, 941, 750.0, 887.9000000000001, 898.0, 930.99, 0.3263253868750624, 0.3087057280466228, 0.17240433037051636], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 93.0, 93, 93, 93.0, 93.0, 93.0, 93.0, 10.752688172043012, 5.092825940860215, 708.028813844086], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 0, 0.0, 25.823999999999987, 17, 1375, 22.0, 27.0, 30.0, 64.95000000000005, 0.32595905302375916, 0.16957192103153002, 14.868698600331827], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 31.045999999999992, 20, 301, 29.0, 35.900000000000034, 39.0, 119.8900000000001, 0.32638098321618436, 73.81778777480463, 0.10071913153936939], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 467.0, 467, 467, 467.0, 467.0, 467.0, 467.0, 2.1413276231263385, 1.122942317987152, 0.8782789079229122], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 2.713999999999999, 1, 12, 3.0, 4.0, 4.0, 6.990000000000009, 0.3282364773136076, 0.3566718854215082, 0.14071856791081422], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 3.416000000000001, 2, 12, 3.0, 4.0, 5.0, 6.0, 0.32823539992529366, 0.3367970869682669, 0.1208444782928083], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 1.8719999999999992, 1, 10, 2.0, 3.0, 3.0, 6.0, 0.3282886313646959, 0.1861723546091724, 0.12727596352713305], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 91.61400000000003, 66, 120, 91.0, 110.90000000000003, 114.0, 118.0, 0.3282660005055297, 0.2990009583315552, 0.10707113688363955], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 0, 0.0, 81.93000000000004, 58, 319, 80.0, 92.0, 98.94999999999999, 305.9000000000001, 0.3263177199006167, 0.16975850836743897, 96.48998282100364], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 201.84000000000003, 12, 367, 259.0, 334.0, 337.95, 347.95000000000005, 0.32823109044276405, 0.18293434143221668, 0.13751087675775955], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 430.3180000000004, 305, 545, 417.5, 501.0, 510.95, 520.0, 0.3282004963704307, 0.17650712437124988, 0.13974161759522244], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 7.1979999999999995, 4, 273, 6.0, 8.0, 11.0, 25.99000000000001, 0.32590487488511855, 0.14694681619453914, 0.23647199417933892], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 405.67, 300, 522, 404.0, 466.0, 473.95, 489.0, 0.3281733542926715, 0.16880096429637992, 0.13203849801619208], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 3.533999999999996, 2, 14, 3.0, 5.0, 5.0, 8.0, 0.32647432540610144, 0.20044694641217778, 0.16323716270305072], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 4.177999999999996, 2, 24, 4.0, 5.0, 6.0, 9.980000000000018, 0.32647006204237056, 0.19119859463616215, 0.15398929684225096], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 684.8279999999992, 544, 915, 692.0, 815.9000000000001, 837.95, 859.98, 0.32632091442951927, 0.29818529574301317, 0.1437214183669074], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 247.36200000000008, 183, 335, 238.0, 290.0, 296.95, 312.9200000000001, 0.3263978149624675, 0.28901187773888565, 0.13419285165937384], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 4.546000000000002, 3, 36, 4.0, 5.0, 6.0, 10.0, 0.32648796891834536, 0.2176724621682066, 0.15272239952332756], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 989.8480000000008, 818, 8435, 936.0, 1085.8000000000002, 1112.85, 1141.91, 0.32631175694734044, 0.2452787328515014, 0.18036372503144013], "isController": false}, {"data": ["Query single patient #2", 500, 0, 0.0, 134.11199999999994, 117, 164, 130.0, 151.0, 152.0, 160.98000000000002, 0.3282851826513099, 6.347288211533512, 0.16542495532038665], "isController": false}, {"data": ["Query single patient #1", 500, 0, 0.0, 181.83000000000007, 160, 234, 174.0, 205.0, 206.95, 219.99, 0.32826018164605414, 0.6362317042136133, 0.2346547392235465], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 7.071999999999999, 5, 15, 7.0, 9.0, 10.0, 13.0, 0.32816452331477675, 0.2678226306439376, 0.20253904173333875], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 7.088000000000001, 5, 21, 7.0, 9.0, 10.0, 13.0, 0.3281656002378544, 0.27295109704939746, 0.20766729390051725], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 8.317999999999996, 6, 18, 8.0, 10.0, 11.0, 15.0, 0.3281625848710485, 0.26557774971531894, 0.20029454643008332], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 9.857999999999988, 7, 18, 10.0, 12.0, 13.0, 17.0, 0.32816301563434236, 0.2934591357876208, 0.2281758468082537], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 7.955999999999992, 5, 37, 8.0, 9.900000000000034, 11.0, 28.920000000000073, 0.3281158537705761, 0.24631439253123005, 0.18104048572302295], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 1618.3439999999985, 1411, 1968, 1597.0, 1804.9, 1865.9, 1947.0, 0.32781059890340797, 0.27393633553480007, 0.2087231547705293], "isController": false}]}, function(index, item){
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

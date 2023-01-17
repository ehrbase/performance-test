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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8712827058072751, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Query cross patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.479, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [0.5, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [0.991, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [0.819, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [0.83, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [0.846, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.488, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 23505, 500, 2.1272069772388855, 485.76290151031895, 1, 24863, 13.0, 1009.9000000000015, 1807.0, 10443.990000000002, 10.209608629497408, 64.40311008655472, 84.58782607602673], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query cross patient #1", 500, 500, 100.0, 11029.002000000004, 9080, 24863, 10532.0, 12721.1, 13305.05, 23599.370000000083, 0.21985869242120704, 0.12774992381896308, 0.11121758073650903], "isController": false}, {"data": ["Query participation #2", 500, 0, 0.0, 3.073999999999998, 2, 23, 3.0, 4.0, 5.0, 9.990000000000009, 0.22067650589647625, 0.11329281827620753, 0.08016763690770425], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 4.578000000000001, 3, 17, 4.0, 5.0, 6.949999999999989, 12.990000000000009, 0.22067494756763245, 0.12659070087908073, 0.09352824926206298], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 0, 0.0, 16.54999999999998, 9, 428, 14.0, 19.0, 24.0, 56.97000000000003, 0.2193636698664514, 0.12889972050326412, 2.442563050602811], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 44.744, 26, 78, 47.0, 55.0, 57.0, 61.0, 0.22060348288778783, 0.9174670494229012, 0.09220536198825506], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 2.808000000000002, 1, 14, 3.0, 4.0, 5.0, 9.990000000000009, 0.22060903093953416, 0.1378306626036366, 0.09371575044794664], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 39.296, 24, 76, 41.0, 49.0, 51.0, 59.98000000000002, 0.2206029962298948, 0.9053883040151952, 0.08057179745115299], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 1102.3680000000002, 771, 1771, 1102.5, 1363.4, 1489.9, 1628.7400000000002, 0.22052457503811768, 0.9327069672754762, 0.1076780151553309], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 6.692, 4, 21, 6.0, 8.0, 9.0, 15.0, 0.22050668024987816, 0.3278981709797773, 0.11305274133904886], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 4.3459999999999885, 2, 21, 4.0, 5.0, 6.0, 11.990000000000009, 0.21951130636885713, 0.21173194571639053, 0.12047397869072043], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 10.317999999999985, 6, 27, 10.0, 13.0, 14.0, 19.0, 0.2206011469494832, 0.3595540178307495, 0.1445540718780305], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 544.0, 544, 544, 544.0, 544.0, 544.0, 544.0, 1.838235294117647, 0.8724437040441175, 2174.2499856387867], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 4.642000000000001, 3, 17, 4.0, 6.0, 7.0, 13.0, 0.21951265556313118, 0.2205223280315905, 0.12926380010211727], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 15.912, 8, 34, 17.0, 20.0, 20.0, 22.99000000000001, 0.220599978998882, 0.3465763545059311, 0.13162752653155949], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 7.746000000000002, 4, 24, 8.0, 9.0, 10.0, 15.990000000000009, 0.220599978998882, 0.3413935475774593, 0.12645721452377318], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 2215.158000000001, 1557, 3731, 2168.0, 2831.4, 3089.7, 3352.75, 0.22034731143227956, 0.33648368589821276, 0.12179353346745139], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 13.685999999999998, 9, 61, 12.0, 17.0, 20.0, 37.0, 0.21935905040344517, 0.12889700607251658, 1.7690107795230958], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 14.739999999999993, 10, 39, 14.0, 18.0, 20.0, 29.980000000000018, 0.22060338555603745, 0.3993502947647287, 0.18441064261325005], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 10.205999999999994, 7, 25, 10.0, 12.0, 15.0, 22.99000000000001, 0.22060231491245177, 0.37343404757377163, 0.1585579138433247], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 63.0, 63, 63, 63.0, 63.0, 63.0, 63.0, 15.873015873015872, 8.153521825396826, 2164.8375496031745], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 740.0, 740, 740, 740.0, 740.0, 740.0, 740.0, 1.3513513513513513, 0.68359375, 2584.3855574324325], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 2.800000000000003, 2, 17, 3.0, 3.0, 5.0, 9.0, 0.21951014992982262, 0.1845685928609153, 0.09324894064401644], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 689.5400000000001, 529, 1178, 654.5, 833.9000000000001, 856.8499999999999, 948.8700000000001, 0.21945340302002997, 0.19318328764679238, 0.10201154281009205], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 3.6859999999999995, 2, 16, 3.0, 4.0, 6.0, 11.0, 0.21952132935092372, 0.1988790355977983, 0.10761690169351924], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 941.3000000000004, 753, 1364, 908.0, 1141.0, 1190.9, 1253.88, 0.21943905233928612, 0.207590629288662, 0.11636270060569569], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 71.0, 71, 71, 71.0, 71.0, 71.0, 71.0, 14.084507042253522, 7.262323943661973, 927.4455325704226], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 0, 0.0, 29.344000000000005, 20, 555, 27.0, 34.0, 39.0, 74.85000000000014, 0.21930680627445545, 0.12886630703457283, 10.031573052632318], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 37.31600000000002, 26, 226, 35.0, 45.0, 52.0, 126.95000000000005, 0.21942817018848879, 49.6555706298137, 0.06814273253900335], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 989.0, 989, 989, 989.0, 989.0, 989.0, 989.0, 1.0111223458038423, 0.5302467770475228, 0.41669299797775533], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 2.9979999999999993, 2, 10, 3.0, 4.0, 4.0, 7.990000000000009, 0.22063852789974184, 0.2396901476623348, 0.09502108476932242], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 3.8919999999999946, 2, 24, 4.0, 5.0, 5.949999999999989, 13.950000000000045, 0.22063735955328878, 0.22645494618213527, 0.0816616789752895], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 2.130000000000001, 1, 19, 2.0, 3.0, 4.0, 7.0, 0.22067728506915144, 0.12513350286130168, 0.08598655931893694], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 201.55800000000008, 87, 363, 197.0, 304.90000000000003, 315.0, 334.99, 0.2206561519597135, 0.20098456981869567, 0.07240279986178098], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 0, 0.0, 119.45000000000006, 86, 368, 117.0, 136.0, 151.95, 248.97000000000003, 0.21939553021098393, 0.12898057537794172, 64.90165430811645], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 270.5200000000003, 16, 621, 336.5, 445.90000000000003, 469.95, 522.9300000000001, 0.22063463345968343, 0.12299217312427466, 0.09286477248156598], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 504.4740000000005, 311, 1191, 462.0, 815.9000000000001, 905.0, 1001.96, 0.2206716361919137, 0.11866531036362273, 0.0943888443867756], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 8.174000000000012, 4, 272, 7.0, 10.0, 15.0, 28.960000000000036, 0.21928247266424697, 0.10315484365927187, 0.1595365645848281], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 504.5459999999997, 285, 1064, 455.5, 852.7, 913.95, 969.97, 0.22060825224877023, 0.11347321537299783, 0.08919122698338953], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 3.924, 2, 15, 4.0, 5.0, 6.0, 11.990000000000009, 0.21950899350297282, 0.13477294854028712, 0.1101832252544219], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 4.3740000000000006, 3, 31, 4.0, 5.0, 6.0, 11.0, 0.21950629522104065, 0.12855480498731472, 0.1039653839669968], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 842.046, 582, 1394, 831.5, 1129.7000000000005, 1245.8, 1333.91, 0.2194135339533667, 0.20049554478076637, 0.0970647762508546], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 461.7959999999998, 240, 1122, 380.0, 825.9000000000001, 875.95, 967.96, 0.21942393318277925, 0.1942908930235916, 0.09064094114874573], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 5.643999999999999, 3, 43, 5.0, 7.0, 8.0, 13.990000000000009, 0.21951352291106543, 0.1464138048322829, 0.10311133253927975], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 1194.8639999999996, 908, 10565, 1129.5, 1417.0, 1441.95, 1658.7800000000002, 0.21942200732518427, 0.16487078210560868, 0.12171064468818817], "isController": false}, {"data": ["Query single patient #2", 500, 0, 0.0, 170.02999999999977, 142, 283, 168.0, 190.0, 196.0, 243.92000000000007, 0.22073359485849653, 4.267875434182981, 0.11166015833662227], "isController": false}, {"data": ["Query single patient #1", 500, 0, 0.0, 230.54400000000004, 195, 441, 222.5, 259.0, 263.95, 322.8900000000001, 0.22071420468064198, 0.4277868058317548, 0.15820725218319456], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 9.406000000000002, 6, 37, 9.0, 11.0, 13.0, 24.99000000000001, 0.2205039573845232, 0.18002080895845837, 0.13652295799002706], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 9.088, 6, 44, 9.0, 11.0, 12.0, 19.99000000000001, 0.22050522156364663, 0.18334233959347657, 0.13996913478161163], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 10.171999999999995, 7, 31, 10.0, 12.0, 14.0, 18.99000000000001, 0.2205014290697618, 0.17844896414492412, 0.1350140586198639], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 12.272000000000002, 8, 30, 12.0, 15.0, 16.0, 23.0, 0.22050249873431568, 0.19719641822356132, 0.15374881259404433], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 9.56199999999999, 6, 45, 9.0, 12.0, 13.0, 26.980000000000018, 0.22044348820958004, 0.16548546271639283, 0.12206197052229674], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 1999.5840000000003, 1621, 2878, 1919.0, 2509.0, 2580.0, 2685.8900000000003, 0.2202890633088739, 0.18408550230862938, 0.1406924291054722], "isController": false}]}, function(index, item){
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

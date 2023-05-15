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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.876473090831738, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Query cross patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.08, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.506, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [0.5, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [0.837, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [0.838, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [0.836, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.496, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.104, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 23505, 500, 2.1272069772388855, 359.92588810891465, 1, 23500, 10.0, 871.0, 1542.9500000000007, 6255.970000000005, 13.756297288186381, 86.65450534281887, 113.83453398860343], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query cross patient #1", 500, 500, 100.0, 6957.250000000002, 5048, 23500, 6325.0, 8385.9, 8777.5, 22798.340000000127, 0.29707900043611196, 0.17256866554044017, 0.14969996506350955], "isController": false}, {"data": ["Query participation #2", 500, 0, 0.0, 2.2280000000000006, 1, 10, 2.0, 3.0, 4.0, 6.0, 0.2978835966227149, 0.15293006404348386, 0.10763372143594192], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 3.6019999999999985, 2, 16, 3.0, 5.0, 5.0, 8.980000000000018, 0.29788217687528745, 0.17096517008923356, 0.12566904336926188], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 0, 0.0, 12.723999999999982, 7, 363, 11.0, 15.0, 18.0, 40.960000000000036, 0.2957535119250774, 0.15385825521250776, 3.254155096542819], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 34.236000000000004, 24, 83, 34.0, 41.0, 42.0, 45.0, 0.29781049722440617, 1.2385630299165535, 0.12389382013437208], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 2.398000000000001, 1, 37, 2.0, 3.0, 4.0, 7.0, 0.29781830224507344, 0.18605209582929294, 0.12593293444542658], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 30.444, 22, 65, 30.0, 36.0, 37.0, 39.99000000000001, 0.2978108519891978, 1.222277974378439, 0.10818909857420077], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 942.6560000000002, 731, 1301, 936.0, 1142.8000000000002, 1206.95, 1275.93, 0.29769311650160574, 1.2590064028951846, 0.14477653517363248], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 5.407999999999997, 3, 18, 5.0, 7.0, 8.0, 10.0, 0.2976351695240635, 0.44258989158787765, 0.15201483755965353], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 3.811999999999999, 2, 17, 4.0, 5.0, 5.0, 9.0, 0.29597602830951514, 0.2854867997281164, 0.1618618904817661], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 7.977999999999995, 5, 29, 8.0, 10.0, 11.0, 15.0, 0.2978128032106603, 0.48531562777896575, 0.1945671536600896], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 527.0, 527, 527, 527.0, 527.0, 527.0, 527.0, 1.8975332068311195, 0.8209054791271347, 2244.3833758301707], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 3.883999999999999, 2, 22, 4.0, 5.0, 6.0, 8.990000000000009, 0.2959786563871306, 0.29734004258984875, 0.1737140356334624], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 12.301999999999992, 6, 30, 13.0, 16.0, 16.0, 20.0, 0.29781244844121985, 0.46786510149597144, 0.17711697373115518], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 6.6480000000000015, 4, 15, 6.0, 8.0, 9.0, 12.0, 0.29781333536640575, 0.46088649481298516, 0.170137501161472], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 1831.8720000000012, 1370, 2676, 1695.5, 2361.9, 2464.5499999999997, 2612.99, 0.2973804352222146, 0.4541179300403605, 0.16379156783723536], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 10.706000000000005, 7, 72, 10.0, 13.0, 16.0, 36.91000000000008, 0.29574284095304904, 0.1538527039102527, 2.384426655183958], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 11.232, 8, 28, 11.0, 13.0, 15.0, 20.99000000000001, 0.297814399683602, 0.5391225887084862, 0.248372555986129], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 7.817999999999997, 5, 31, 8.0, 10.0, 11.0, 13.0, 0.29781546400840553, 0.5042242657285281, 0.21347319392790007], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 50.0, 50, 50, 50.0, 50.0, 50.0, 50.0, 20.0, 9.43359375, 2727.65625], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 559.0, 559, 559, 559.0, 559.0, 559.0, 559.0, 1.7889087656529516, 0.8298160778175312, 3421.1866894007153], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 2.2479999999999993, 1, 19, 2.0, 3.0, 4.0, 7.0, 0.2959443198518858, 0.24875218314425449, 0.12514051806236967], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 591.4760000000002, 415, 732, 583.5, 680.0, 694.95, 716.97, 0.2958462593494814, 0.26051516652150475, 0.13694445989419354], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 3.3540000000000005, 2, 22, 3.0, 4.0, 5.0, 10.980000000000018, 0.2959697211136512, 0.2681387402093216, 0.144516465387525], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 797.2319999999997, 659, 971, 781.0, 911.0, 928.95, 957.99, 0.2958511608311997, 0.27987693164921046, 0.1563041777438272], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 76.0, 76, 76, 76.0, 76.0, 76.0, 76.0, 13.157894736842104, 6.2320106907894735, 866.4036800986843], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 0, 0.0, 23.148, 15, 962, 20.0, 25.0, 28.0, 71.85000000000014, 0.29557605408332405, 0.15376593727610113, 13.482770982648503], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 30.145999999999997, 21, 291, 29.0, 35.0, 40.0, 84.94000000000005, 0.295846959551212, 66.91188885691687, 0.09129652267400683], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 979.0, 979, 979, 979.0, 979.0, 979.0, 979.0, 1.021450459652707, 0.5356629851889684, 0.4189542900919305], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 2.6580000000000026, 1, 8, 2.0, 3.0, 4.0, 6.990000000000009, 0.29781688311997734, 0.3236170156410449, 0.1276773551656934], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 3.268000000000003, 2, 11, 3.0, 4.0, 5.0, 6.0, 0.29781546400840553, 0.30558367791823415, 0.10964495110465712], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 1.7220000000000002, 1, 9, 2.0, 3.0, 3.0, 4.990000000000009, 0.2978843065015037, 0.16893007385594555, 0.11548834929794627], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 153.36599999999999, 68, 268, 156.0, 212.0, 248.95, 261.99, 0.2978498812770373, 0.27129644801357955, 0.09715025424465865], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 0, 0.0, 81.61399999999995, 58, 302, 80.0, 93.0, 99.0, 206.76000000000022, 0.29579882840000044, 0.1538818299579729, 87.4657492687853], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 218.064, 13, 427, 271.0, 350.0, 395.0, 413.98, 0.2978122710568166, 0.1659808996238631, 0.12476705496423274], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 455.6120000000004, 284, 803, 413.0, 674.8000000000001, 720.95, 754.97, 0.29784384880969683, 0.16018123630662906, 0.12681632625100372], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 7.175999999999994, 4, 285, 6.0, 9.0, 11.0, 32.90000000000009, 0.29552940842696196, 0.13325086246563733, 0.21443198287229762], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 460.00000000000034, 271, 869, 413.5, 698.9000000000001, 737.9, 804.99, 0.2977697049102225, 0.15316238405592114, 0.1198057797099723], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 3.4300000000000015, 2, 24, 3.0, 5.0, 5.0, 11.990000000000009, 0.29594256820144454, 0.1817012227089162, 0.14797128410072227], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 4.115999999999997, 2, 41, 4.0, 5.0, 5.0, 9.980000000000018, 0.29593573696284703, 0.17331603595116113, 0.1395868759307179], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 769.4479999999999, 584, 1162, 758.0, 969.8000000000001, 1029.95, 1087.8200000000002, 0.2957923537676551, 0.2702889290468091, 0.1302757339347778], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 435.73400000000004, 242, 874, 340.0, 742.6000000000001, 780.0, 818.0, 0.29583733206793844, 0.2619518235930864, 0.12162843437558798], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 4.641999999999998, 3, 40, 4.0, 6.0, 7.0, 10.990000000000009, 0.2959819853524435, 0.19733384884762376, 0.13845251072638715], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 1001.1000000000001, 823, 9976, 942.0, 1082.9, 1103.95, 1134.94, 0.2958425833447726, 0.22237597151006339, 0.1635223654034583], "isController": false}, {"data": ["Query single patient #2", 500, 0, 0.0, 133.19399999999996, 117, 160, 132.0, 149.0, 150.0, 153.99, 0.29794678908704336, 5.760705148989781, 0.15013724918839294], "isController": false}, {"data": ["Query single patient #1", 500, 0, 0.0, 181.54799999999997, 160, 262, 180.0, 201.0, 203.0, 212.0, 0.29792069232002166, 0.5774279074750686, 0.21296674490064046], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 7.226000000000002, 5, 17, 7.0, 9.0, 10.0, 14.0, 0.29763357497211174, 0.24290562005853858, 0.18369572205310022], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 7.192, 5, 18, 7.0, 9.0, 10.0, 15.0, 0.29763392931551336, 0.24755643939191008, 0.18834647089497333], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 8.571999999999994, 6, 18, 8.0, 10.0, 12.0, 13.990000000000009, 0.2976303859194636, 0.2408684346829284, 0.1816591710934226], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 9.699999999999989, 7, 19, 9.0, 12.0, 13.0, 17.0, 0.2976316260984839, 0.2661565003267995, 0.2069469900216021], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 8.094000000000007, 5, 43, 8.0, 9.0, 10.0, 15.0, 0.2975976135052178, 0.2234045522242148, 0.1642018082328594], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 1623.4559999999997, 1407, 2025, 1601.0, 1807.0, 1885.8, 1950.8300000000002, 0.29734382758815503, 0.2484766471733009, 0.18932439022214556], "isController": false}]}, function(index, item){
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

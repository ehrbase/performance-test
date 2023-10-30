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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8889172516485854, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Query cross patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.142, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.57, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.998, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [1.0, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [0.923, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [0.992, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.554, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.495, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.104, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 23505, 500, 2.1272069772388855, 323.6287598383322, 1, 27453, 9.0, 822.0, 1521.0, 5898.970000000005, 15.298252465098116, 96.36770169770412, 126.59434466424224], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query cross patient #1", 500, 500, 100.0, 6150.194000000001, 5000, 27453, 5883.0, 6362.6, 6631.2, 26779.69000000018, 0.33111179393721063, 0.19233779681688987, 0.16684930241367252], "isController": false}, {"data": ["Query participation #2", 500, 0, 0.0, 2.398000000000002, 1, 9, 2.0, 3.0, 4.0, 6.0, 0.3321943496398681, 0.17054481596599128, 0.12003116149096797], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 3.6800000000000024, 2, 27, 3.0, 5.0, 5.0, 9.0, 0.33219236329619867, 0.19065700569610244, 0.1401436532655838], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 0, 0.0, 13.278000000000002, 8, 363, 11.0, 15.0, 19.0, 36.99000000000001, 0.32909871052543244, 0.17120524812890928, 3.621049972158249], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 31.670000000000012, 21, 45, 32.0, 40.0, 41.0, 44.0, 0.33212704789537734, 1.3812820118579319, 0.13817004140960032], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 2.223999999999997, 1, 11, 2.0, 3.0, 4.0, 6.0, 0.3321341077815036, 0.20748975594619695, 0.1404434264349522], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 27.82600000000002, 18, 44, 27.0, 35.0, 37.0, 40.0, 0.3321261654307145, 1.363115192106756, 0.12065520853537676], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 798.0359999999998, 614, 1092, 782.5, 945.9000000000001, 1009.8499999999999, 1078.98, 0.33199098312489833, 1.404059248563309, 0.16145655234003845], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 5.504000000000001, 3, 22, 5.0, 8.0, 9.0, 12.0, 0.3320807248392397, 0.4938111723827722, 0.1696076358309789], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 3.977999999999997, 2, 22, 4.0, 5.0, 6.0, 12.970000000000027, 0.32923111365716506, 0.3175633430374204, 0.18004826528126214], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 7.516000000000002, 5, 23, 7.0, 10.0, 10.0, 15.990000000000009, 0.33212638604644057, 0.54123302896441, 0.2169849143213562], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 422.0, 422, 422, 422.0, 422.0, 422.0, 422.0, 2.3696682464454977, 1.0251592120853081, 2802.819997778436], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 4.2459999999999996, 3, 20, 4.0, 5.0, 6.0, 11.0, 0.3292339319025705, 0.33074827938231766, 0.193232024485786], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 7.800000000000006, 5, 21, 8.0, 10.0, 11.0, 13.990000000000009, 0.33212462112883845, 0.5217697258361071, 0.19752333424556895], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 6.580000000000006, 4, 26, 6.0, 8.0, 9.0, 13.0, 0.3321237386770714, 0.5139841893739667, 0.18973865930281913], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 1580.154000000001, 1357, 1954, 1560.5, 1745.9, 1813.8, 1898.98, 0.33177355525887625, 0.5066383067322826, 0.18273465348242796], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 12.168000000000005, 7, 64, 11.0, 15.0, 18.94999999999999, 57.960000000000036, 0.3290880968835357, 0.17119972665119954, 2.653272781123507], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 10.709999999999988, 7, 24, 10.0, 13.0, 15.0, 21.980000000000018, 0.33212925407755084, 0.601241523023532, 0.2769906083810824], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 7.513999999999997, 5, 17, 7.0, 9.0, 11.0, 14.0, 0.33212837160116426, 0.5623186319615767, 0.2380685788625533], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 42.0, 42, 42, 42.0, 42.0, 42.0, 42.0, 23.809523809523807, 11.23046875, 3247.209821428571], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 407.0, 407, 407, 407.0, 407.0, 407.0, 407.0, 2.457002457002457, 1.1397228194103195, 4698.878032862408], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 2.452000000000001, 1, 16, 2.0, 3.0, 4.0, 10.970000000000027, 0.3292794640910866, 0.27677160892367103, 0.1392363358900786], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 569.1239999999998, 430, 725, 560.0, 659.9000000000001, 670.95, 695.94, 0.3291751923041473, 0.289863830715403, 0.15237211050016194], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 3.3679999999999986, 2, 16, 3.0, 4.0, 5.0, 9.990000000000009, 0.32927165767864797, 0.29830918900884623, 0.16077717660090235], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 770.1439999999994, 619, 998, 753.5, 896.9000000000001, 909.0, 958.95, 0.3290841981666061, 0.311315579693333, 0.17386186641419327], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 46.0, 46, 46, 46.0, 46.0, 46.0, 46.0, 21.73913043478261, 10.296365489130435, 1431.449558423913], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 0, 0.0, 26.255999999999986, 16, 1562, 22.0, 27.0, 31.0, 85.99000000000001, 0.32875314452382737, 0.171025476190711, 14.996151738972634], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 30.660000000000046, 20, 221, 29.0, 36.900000000000034, 42.0, 102.95000000000005, 0.32921398843405414, 74.45853030789245, 0.1015933792433214], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 431.0, 431, 431, 431.0, 431.0, 431.0, 431.0, 2.320185614849188, 1.216737964037123, 0.9516386310904873], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 2.7160000000000024, 1, 8, 3.0, 4.0, 4.0, 6.0, 0.3321400647938838, 0.3609136440398462, 0.1423920785590967], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 3.364, 2, 9, 3.0, 4.0, 5.0, 7.0, 0.3321389616273215, 0.34080246911273726, 0.12228162942724628], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 1.8619999999999999, 1, 9, 2.0, 3.0, 3.0, 7.0, 0.33219457034618666, 0.18838741107981838, 0.12879027776116805], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 90.32599999999995, 65, 124, 89.0, 109.0, 113.0, 116.0, 0.33217139778388527, 0.3025581879169997, 0.10834496763654071], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 0, 0.0, 82.01999999999998, 56, 387, 80.0, 94.0, 99.94999999999999, 294.8000000000002, 0.32916002312020004, 0.17123714444957203, 97.33043300836461], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 207.76799999999992, 12, 368, 265.0, 335.0, 338.95, 343.0, 0.33213454903435197, 0.18510987156190922, 0.13914621243724318], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 435.4360000000002, 321, 556, 421.0, 507.90000000000003, 519.95, 542.98, 0.3320794015132194, 0.17859321016342292, 0.14139318267555046], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 7.385999999999999, 4, 248, 6.0, 9.0, 11.0, 28.0, 0.32870321977951905, 0.14820855820742357, 0.23850243388299086], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 405.31999999999994, 315, 538, 398.5, 474.0, 485.0, 510.98, 0.33207190286498356, 0.1708250509066227, 0.13360705466833322], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 3.560000000000003, 2, 16, 3.0, 4.900000000000034, 5.949999999999989, 11.990000000000009, 0.3292775124532755, 0.2021680320844715, 0.16463875622663776], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 4.118, 2, 30, 4.0, 5.0, 6.0, 8.990000000000009, 0.32927165767864797, 0.1928393611586543, 0.15531075259647167], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 622.83, 464, 880, 611.5, 743.9000000000001, 813.95, 844.99, 0.3291405219378741, 0.30076179470946107, 0.1449632572206848], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 251.25999999999993, 171, 321, 245.0, 293.0, 299.0, 314.96000000000004, 0.3292087861874528, 0.2915008774648685, 0.13534853416495862], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 4.4940000000000015, 2, 42, 4.0, 6.0, 7.0, 17.980000000000018, 0.32923696699004323, 0.2195052438806371, 0.15400830780100655], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 1039.2720000000006, 815, 13736, 938.5, 1087.9, 1114.9, 3996.180000000026, 0.3290527952047794, 0.24733908886432693, 0.18187879109951677], "isController": false}, {"data": ["Query single patient #2", 500, 0, 0.0, 132.60999999999999, 115, 163, 130.0, 149.0, 150.0, 154.0, 0.332176694084531, 6.422529330994477, 0.1673859122535332], "isController": false}, {"data": ["Query single patient #1", 500, 0, 0.0, 178.6120000000001, 155, 265, 174.0, 200.0, 202.0, 205.99, 0.3321438156150108, 0.6437589377824883, 0.23743093069354285], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 6.624000000000008, 4, 22, 6.0, 9.0, 9.0, 13.0, 0.3320780781977458, 0.27101657297913884, 0.20495443888767126], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 6.503999999999999, 4, 17, 6.0, 9.0, 10.0, 12.990000000000009, 0.3320794015132194, 0.27620639361603916, 0.21014399627008418], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 8.219999999999997, 5, 26, 8.0, 10.0, 12.0, 16.99000000000001, 0.33207190286498356, 0.2687415103742583, 0.20268060477599092], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 9.489999999999984, 6, 26, 9.0, 12.0, 13.0, 16.0, 0.3320734466766421, 0.2969560311096367, 0.23089481839235274], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 7.624000000000001, 5, 38, 7.0, 9.0, 11.0, 32.92000000000007, 0.33205315772591404, 0.24927010046434314, 0.18321292394056782], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 1622.1960000000006, 1413, 1971, 1597.0, 1817.8000000000002, 1895.9, 1951.94, 0.33174273748799094, 0.27722224403891477, 0.2112268211349317], "isController": false}]}, function(index, item){
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

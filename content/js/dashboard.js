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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.890044671346522, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Query cross patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.179, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.595, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [1.0, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [0.952, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.496, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.11, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 23505, 500, 2.1272069772388855, 327.854328866198, 1, 23948, 9.0, 847.0, 1507.0, 6098.0, 15.075144834910969, 94.96225193534106, 124.74810998498258], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query cross patient #1", 500, 500, 100.0, 6279.668000000001, 5068, 23948, 6087.5, 6559.0, 6744.2, 23076.890000000145, 0.32549646348092426, 0.18905750057775622, 0.1640197023009345], "isController": false}, {"data": ["Query participation #2", 500, 0, 0.0, 2.4160000000000013, 1, 8, 2.0, 3.0, 4.0, 7.0, 0.32657220021488453, 0.16765846813961613, 0.11799972078076881], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 3.634000000000003, 2, 12, 3.0, 4.0, 5.0, 8.990000000000009, 0.32657006724077686, 0.18743017013484078, 0.13777174711720272], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 0, 0.0, 13.361999999999998, 8, 351, 12.0, 16.0, 19.0, 44.8900000000001, 0.32422036350290273, 0.16866741195471807, 3.56737386287813], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 33.860000000000014, 24, 57, 34.0, 40.0, 42.0, 46.99000000000001, 0.3265037456509701, 1.3578952799230888, 0.13583065981182937], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 2.228000000000002, 1, 8, 2.0, 3.0, 4.0, 6.990000000000009, 0.3265120610290223, 0.20397756890710536, 0.13806613518121746], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 29.988, 21, 59, 30.0, 35.0, 37.0, 42.99000000000001, 0.32650417207031074, 1.3400413564468903, 0.11861284375991757], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 867.5100000000002, 673, 1094, 874.5, 1007.0, 1056.85, 1082.99, 0.32635712346220525, 1.3802324786611395, 0.15871664793376777], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 5.772000000000005, 4, 15, 5.0, 8.0, 8.0, 13.0, 0.3264660119499619, 0.4854619736878188, 0.16673996508772468], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 3.8920000000000066, 2, 24, 4.0, 5.0, 5.0, 10.990000000000009, 0.3244216859027098, 0.3129243587724273, 0.17741810947804446], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 7.903999999999997, 5, 18, 8.0, 10.0, 11.0, 14.980000000000018, 0.3265133403555469, 0.5320860118991257, 0.2133177975565048], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 412.0, 412, 412, 412.0, 412.0, 412.0, 412.0, 2.4271844660194173, 1.0500417172330099, 2870.849609375], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 4.196000000000001, 3, 19, 4.0, 5.0, 6.0, 10.990000000000009, 0.32442631694374835, 0.32591855127265956, 0.19041036765936795], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 8.332000000000006, 6, 20, 8.0, 10.0, 11.0, 15.0, 0.3265131271337633, 0.5129540358899964, 0.1941860297113885], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 6.611999999999999, 4, 19, 6.0, 8.0, 9.0, 13.0, 0.32651184780890957, 0.5052994046301339, 0.18653264742989464], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 1574.01, 1347, 1981, 1550.0, 1756.9, 1835.9, 1896.98, 0.3261791375823602, 0.49809529221573484, 0.17965335312153433], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 11.697999999999993, 7, 72, 10.0, 14.0, 16.0, 56.840000000000146, 0.32420985195929736, 0.16866194359105208, 2.6139419314218353], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 11.024, 8, 24, 11.0, 13.0, 15.0, 20.0, 0.3265129139122582, 0.5910744664534102, 0.2723066684385434], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 7.850000000000001, 5, 18, 7.0, 10.0, 11.0, 15.990000000000009, 0.3265137667999496, 0.5528126783581452, 0.23404404768668263], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 80.0, 80, 80, 80.0, 80.0, 80.0, 80.0, 12.5, 5.89599609375, 1704.78515625], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 434.0, 434, 434, 434.0, 434.0, 434.0, 434.0, 2.304147465437788, 1.0688184043778801, 4406.551519297235], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 2.3579999999999997, 1, 18, 2.0, 3.0, 4.0, 7.990000000000009, 0.3244248434163493, 0.27269112009461527, 0.13718355195242116], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 563.0640000000002, 419, 719, 554.0, 651.9000000000001, 665.0, 690.97, 0.3243194157061407, 0.2855879495472501, 0.15012441703585025], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 3.276000000000001, 2, 19, 3.0, 4.0, 4.0, 8.990000000000009, 0.3244193704317697, 0.2939131778742745, 0.1584078957186376], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 764.282, 594, 946, 746.0, 891.9000000000001, 904.95, 930.97, 0.3242783994915315, 0.3067692659877358, 0.17132286535636576], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 81.0, 81, 81, 81.0, 81.0, 81.0, 81.0, 12.345679012345679, 5.847318672839506, 812.9219714506172], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 0, 0.0, 25.784000000000002, 17, 1239, 22.0, 27.0, 34.0, 57.0, 0.3239512725453888, 0.16852742421645905, 14.777113223237414], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 31.35200000000002, 21, 293, 29.0, 36.0, 40.94999999999999, 115.84000000000015, 0.324326778689136, 73.35318707310488, 0.10008521686110057], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 451.0, 451, 451, 451.0, 451.0, 451.0, 451.0, 2.2172949002217295, 1.1627806263858094, 0.9094373614190687], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 2.726, 1, 17, 3.0, 4.0, 4.0, 6.0, 0.32652208268845223, 0.35480897131666767, 0.13998358818381887], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 3.3339999999999983, 2, 18, 3.0, 4.0, 5.0, 7.0, 0.32652165622232726, 0.3350386420013296, 0.12021353944904042], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 1.9739999999999964, 1, 22, 2.0, 3.0, 3.0, 8.0, 0.3265730534123292, 0.1851994510225329, 0.12661084199677217], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 92.18400000000003, 66, 119, 91.0, 111.0, 114.0, 118.0, 0.32655663014457315, 0.29744397900600084, 0.10651358834793695], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 0, 0.0, 83.91199999999995, 58, 411, 81.0, 93.0, 101.0, 362.9800000000009, 0.3242775582418708, 0.1686971660654561, 95.88672056646102], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 204.09599999999998, 12, 347, 261.0, 332.90000000000003, 337.95, 345.0, 0.3265173916223474, 0.18197923884061512, 0.13679293066990922], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 426.846, 341, 545, 412.0, 499.0, 510.0, 527.0, 0.326454288564698, 0.1755680090385399, 0.13899811505293783], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 7.335999999999998, 4, 266, 6.0, 8.0, 11.949999999999989, 26.980000000000018, 0.32389964811542227, 0.14604268215954258, 0.23501702983374878], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 400.65, 298, 494, 400.5, 463.0, 471.0, 488.98, 0.32645109142393397, 0.16791509215224634, 0.13134555631509842], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 3.5360000000000005, 2, 15, 3.0, 4.900000000000034, 5.949999999999989, 9.990000000000009, 0.32442273840042724, 0.1991873240817701, 0.1622113692002136], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 4.179999999999997, 2, 47, 4.0, 5.0, 5.949999999999989, 10.990000000000009, 0.3244134766548818, 0.18999414656708905, 0.1530192472893632], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 678.0500000000005, 542, 885, 686.0, 781.6000000000001, 824.8, 850.99, 0.3242592621415638, 0.2963014005649245, 0.14281340549398952], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 246.338, 167, 324, 238.0, 290.90000000000003, 297.95, 314.0, 0.3243400329010529, 0.2871897961247204, 0.1333468299329524], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 4.617999999999995, 3, 67, 4.0, 5.0, 6.0, 11.0, 0.32442947454753446, 0.2163000454769016, 0.15175949053541896], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 1005.9980000000008, 818, 10291, 935.5, 1092.7, 1119.95, 1174.6900000000003, 0.324267042989379, 0.24374178287046375, 0.1792335413398325], "isController": false}, {"data": ["Query single patient #2", 500, 0, 0.0, 133.41800000000012, 117, 156, 130.0, 149.0, 152.0, 154.0, 0.32654404719998276, 6.313623918690206, 0.16454758628436633], "isController": false}, {"data": ["Query single patient #1", 500, 0, 0.0, 182.05800000000008, 160, 284, 177.5, 203.0, 205.0, 212.99, 0.32651355357760903, 0.6328464012900551, 0.23340617306524394], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 7.1880000000000015, 5, 16, 7.0, 9.0, 10.0, 12.990000000000009, 0.326463240892002, 0.2664341748494678, 0.20148903148803252], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 7.030000000000003, 5, 32, 7.0, 9.0, 10.0, 14.0, 0.32646409352021005, 0.2715358721602521, 0.20659055918075797], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 8.475999999999996, 6, 17, 8.0, 10.0, 12.0, 15.0, 0.3264602567283459, 0.26420007749350344, 0.19925552778829705], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 9.908, 7, 31, 10.0, 12.0, 13.0, 15.990000000000009, 0.32646153564894675, 0.2919375906338838, 0.2269927865059083], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 7.834000000000002, 5, 37, 8.0, 9.0, 10.0, 14.990000000000009, 0.32644427106626495, 0.24505954649545753, 0.1801181769066794], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 1623.7539999999995, 1412, 1967, 1593.5, 1837.8000000000002, 1905.85, 1956.0, 0.32613509689799863, 0.27253619508455706, 0.20765633122802257], "isController": false}]}, function(index, item){
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

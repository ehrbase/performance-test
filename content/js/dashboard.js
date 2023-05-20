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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8921506062539886, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Query cross patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.202, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.628, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [0.5, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [0.965, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.496, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.143, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 23505, 500, 2.1272069772388855, 323.6072325037236, 1, 19583, 9.0, 839.0, 1491.0, 6005.990000000002, 15.312005315718501, 96.45427916153662, 126.70815067676068], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query cross patient #1", 500, 500, 100.0, 6163.213999999996, 5096, 19583, 5986.0, 6489.200000000001, 6632.85, 17161.560000000092, 0.33035485396994035, 0.19186067891060862, 0.16646787563329027], "isController": false}, {"data": ["Query participation #2", 500, 0, 0.0, 2.274000000000001, 1, 10, 2.0, 3.0, 4.0, 6.0, 0.33148299525382646, 0.1701796146825089, 0.11977412914444902], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 3.5960000000000005, 2, 14, 3.0, 4.900000000000034, 5.0, 7.990000000000009, 0.33148035813137894, 0.19024836062245382, 0.1398432760866755], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 0, 0.0, 12.373999999999999, 7, 376, 11.0, 14.0, 16.94999999999999, 52.86000000000013, 0.3293165496056105, 0.17131857337930154, 3.623446840240638], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 34.207999999999956, 24, 57, 34.0, 40.900000000000034, 42.0, 47.99000000000001, 0.33142806387016505, 1.3783750096528422, 0.13787925313348662], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 2.2720000000000007, 1, 8, 2.0, 3.0, 4.0, 5.0, 0.3314392683942165, 0.2070556781098284, 0.14014961251435132], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 30.361999999999988, 21, 58, 31.0, 36.0, 37.0, 40.98000000000002, 0.3314256473074318, 1.3602401193314615, 0.12040072343590294], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 857.9839999999998, 675, 1080, 859.0, 1023.7, 1058.95, 1076.99, 0.33127808409957954, 1.4010442496004787, 0.16110984949374083], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 5.845999999999997, 4, 16, 5.0, 8.0, 9.0, 13.0, 0.33136963686526977, 0.4927537692881982, 0.16924445320364853], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 3.785999999999999, 2, 21, 4.0, 5.0, 5.949999999999989, 9.0, 0.3295411929786635, 0.3178624333173396, 0.18021783991020662], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 7.938000000000009, 5, 21, 8.0, 10.0, 11.0, 14.990000000000009, 0.3314243291971577, 0.5400889573970595, 0.21652624632118994], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 506.0, 506, 506, 506.0, 506.0, 506.0, 506.0, 1.976284584980237, 0.8549746788537549, 2337.5297214673915], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 4.029999999999997, 2, 19, 4.0, 5.0, 6.0, 12.980000000000018, 0.32954510253136776, 0.3310608812744564, 0.19341465490366408], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 8.219999999999995, 5, 27, 8.0, 10.0, 11.0, 15.0, 0.33141971589376273, 0.5206623155814991, 0.19710410837822412], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 6.661999999999993, 4, 15, 6.5, 8.0, 9.0, 12.980000000000018, 0.3314186175071222, 0.5128929661618278, 0.18933583129068993], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 1571.0619999999983, 1325, 1930, 1543.0, 1785.9, 1850.0, 1906.96, 0.3310690418001151, 0.505562472024666, 0.18234662067896965], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 10.811999999999985, 7, 70, 10.0, 13.0, 17.0, 35.99000000000001, 0.32930895832331686, 0.17131462420743568, 2.655053476481742], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 11.316000000000006, 8, 32, 11.0, 14.0, 15.0, 18.99000000000001, 0.331426086679853, 0.5999686046282328, 0.27640417775839304], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 7.944000000000002, 6, 18, 8.0, 10.0, 11.0, 14.0, 0.33142520793617547, 0.5611281223154558, 0.23756455334487578], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 60.0, 60, 60, 60.0, 60.0, 60.0, 60.0, 16.666666666666668, 7.861328125, 2273.046875], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 560.0, 560, 560, 560.0, 560.0, 560.0, 560.0, 1.7857142857142856, 0.8283342633928571, 3415.077427455357], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 2.2099999999999986, 1, 27, 2.0, 3.0, 3.0, 6.0, 0.32952772745157094, 0.27698028349105625, 0.13934131443997091], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 554.1280000000003, 426, 679, 539.0, 645.9000000000001, 654.95, 666.0, 0.32942633697678864, 0.2900849827298243, 0.1524883630146463], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 3.261999999999999, 2, 17, 3.0, 4.0, 5.0, 10.990000000000009, 0.3295420617601369, 0.2985541661284146, 0.16090920984381682], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 757.6279999999997, 601, 947, 733.5, 877.9000000000001, 891.0, 918.94, 0.3294002938250621, 0.31161460803835533, 0.1740288661712486], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 83.0, 83, 83, 83.0, 83.0, 83.0, 83.0, 12.048192771084338, 5.706419427710843, 793.3334902108434], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 0, 0.0, 21.6, 15, 619, 20.0, 24.0, 27.0, 47.98000000000002, 0.3291760591568879, 0.17124548679049392, 15.015443089080309], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 29.45799999999998, 20, 286, 27.0, 35.0, 39.94999999999999, 106.95000000000005, 0.3294356701083909, 74.50866818856338, 0.10166178882251126], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 538.0, 538, 538, 538.0, 538.0, 538.0, 538.0, 1.858736059479554, 0.9747473280669144, 0.7623722118959108], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 2.5500000000000025, 1, 8, 2.0, 3.0, 4.0, 6.0, 0.33143707136900746, 0.3601497496904377, 0.1420906975888616], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 3.2519999999999993, 2, 12, 3.0, 4.0, 5.0, 7.0, 0.3314359728673255, 0.34008114360490976, 0.12202281422947434], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 1.7379999999999989, 1, 9, 2.0, 3.0, 3.0, 5.980000000000018, 0.33148475335876926, 0.18798487414352627, 0.12851508504241346], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 90.98000000000002, 66, 125, 89.0, 109.90000000000003, 113.0, 117.98000000000002, 0.3314678323727395, 0.3019173456370878, 0.10811548438720216], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 0, 0.0, 80.21399999999993, 57, 362, 78.0, 91.0, 98.0, 287.8700000000001, 0.32938206606877235, 0.17135265665575755, 97.3960896337535], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 206.57799999999992, 12, 360, 260.0, 333.0, 338.0, 347.97, 0.331432018321562, 0.18471832732060414, 0.13885189048823252], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 425.59399999999994, 330, 544, 414.0, 496.0, 504.9, 523.9200000000001, 0.33136392706017237, 0.17820842604619877, 0.14108854706858903], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 7.154000000000007, 4, 316, 6.0, 8.0, 10.0, 31.950000000000045, 0.32911019135782965, 0.1483920570818589, 0.23879772673717523], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 395.3499999999998, 300, 498, 392.5, 457.0, 464.95, 486.94000000000005, 0.33136173103368294, 0.17044095444604604, 0.13332132147058337], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 3.326, 2, 17, 3.0, 4.0, 5.0, 10.990000000000009, 0.3295257728697477, 0.2023204576766983, 0.16476288643487383], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 4.038, 2, 40, 4.0, 5.0, 6.0, 11.0, 0.32951752044656213, 0.1929833517451248, 0.1554267210700093], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 668.9119999999999, 539, 869, 668.0, 795.0, 826.75, 847.98, 0.3293560299160669, 0.3009587214382451, 0.145058173332174], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 241.866, 169, 321, 236.0, 282.90000000000003, 289.0, 301.99, 0.329437840679907, 0.2917036958231235, 0.13544270598265706], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 4.672, 3, 51, 4.0, 6.0, 6.0, 10.0, 0.3295474917481308, 0.21971227352672498, 0.15415356303452604], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 983.6119999999993, 816, 9027, 932.5, 1093.9, 1115.0, 1148.98, 0.32936405729090157, 0.247573055212285, 0.18205083635415067], "isController": false}, {"data": ["Query single patient #2", 500, 0, 0.0, 133.70999999999992, 117, 173, 132.5, 149.0, 150.0, 157.98000000000002, 0.33144102603535547, 6.408305426344192, 0.16701520452562835], "isController": false}, {"data": ["Query single patient #1", 500, 0, 0.0, 183.43800000000002, 161, 274, 180.0, 203.0, 205.0, 214.0, 0.3314104896722549, 0.6423376103099815, 0.23690671722665096], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 7.233999999999997, 5, 17, 7.0, 9.0, 10.0, 14.0, 0.3313648054789182, 0.2704344546745964, 0.20451421588151986], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 7.0699999999999985, 5, 20, 7.0, 9.0, 10.0, 13.990000000000009, 0.33136656233038175, 0.27561349101797794, 0.20969290272469468], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 8.600000000000009, 6, 19, 8.0, 10.0, 12.0, 14.0, 0.33135953503630045, 0.26816500027337165, 0.20224580995867947], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 9.892000000000003, 7, 25, 10.0, 12.0, 14.0, 19.0, 0.3313610722314119, 0.2963189916533459, 0.2303994955359036], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 8.14, 6, 36, 8.0, 9.0, 10.0, 18.970000000000027, 0.3313331853378439, 0.2487296219736855, 0.1828156735506658], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 1619.1759999999997, 1408, 2014, 1587.0, 1832.8000000000002, 1900.85, 1951.99, 0.33102213677437464, 0.27662007095625013, 0.21076800114930885], "isController": false}]}, function(index, item){
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

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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8734737289938311, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Query cross patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.998, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [1.0, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [0.772, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [0.819, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.465, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 23505, 500, 2.1272069772388855, 461.8611784726639, 1, 19934, 11.0, 1009.9000000000015, 1840.0, 10356.980000000003, 10.727282850677867, 67.57396612060629, 88.76918102951566], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query cross patient #1", 500, 500, 100.0, 10482.975999999997, 9018, 19934, 10329.0, 11198.1, 11537.75, 18912.920000000056, 0.23096800538802165, 0.13417887784887486, 0.11638622146505777], "isController": false}, {"data": ["Query participation #2", 500, 0, 0.0, 3.0380000000000003, 1, 22, 3.0, 4.0, 5.0, 8.0, 0.23191804572867258, 0.11906409748048873, 0.08379851261680551], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 4.328000000000001, 2, 15, 4.0, 6.0, 6.0, 10.0, 0.23191664730162662, 0.13310520779847557, 0.09783983558037372], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 0, 0.0, 16.35399999999999, 10, 446, 14.0, 19.0, 22.94999999999999, 63.86000000000013, 0.23057157771830056, 0.11994900895148036, 2.536962857570403], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 40.80400000000005, 25, 57, 42.0, 52.0, 54.0, 55.99000000000001, 0.2318719065389269, 0.9643312569300717, 0.09646233611873327], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 2.6960000000000015, 1, 22, 2.0, 3.900000000000034, 5.0, 8.0, 0.23187771325909226, 0.14485790229391982, 0.09804985336053412], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 35.24400000000006, 22, 56, 36.0, 45.0, 47.0, 48.99000000000001, 0.2318699710301658, 0.9516428183087776, 0.08423401291330243], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 1034.5600000000002, 735, 1443, 1019.0, 1277.6000000000001, 1390.0, 1428.99, 0.23179408155535683, 0.9803056122388666, 0.11272798106891377], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 6.685999999999999, 4, 19, 6.0, 9.0, 10.0, 14.990000000000009, 0.231809986281485, 0.34470642989324224, 0.11839513947775065], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 4.324000000000002, 3, 18, 4.0, 5.0, 6.0, 11.990000000000009, 0.23072361848465342, 0.22254689962253618, 0.12617697885879486], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 9.258000000000006, 6, 42, 9.0, 12.0, 13.0, 16.99000000000001, 0.23186835813088136, 0.3778525858365068, 0.1514843081929293], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 552.0, 552, 552, 552.0, 552.0, 552.0, 552.0, 1.8115942028985508, 0.7837267889492753, 2142.735578011775], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 4.883999999999998, 3, 17, 5.0, 6.0, 7.949999999999989, 12.0, 0.23072500256104753, 0.23178624744587423, 0.1354157485734273], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 9.325999999999993, 6, 19, 9.0, 12.0, 13.0, 17.99000000000001, 0.23186760545222762, 0.36426536676470034, 0.1378978239457096], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 7.425999999999999, 5, 24, 7.0, 9.0, 10.0, 14.990000000000009, 0.23186642268135896, 0.3588291393431409, 0.13246275123886228], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 2023.6079999999997, 1635, 2672, 1963.0, 2400.9, 2560.1, 2647.78, 0.2316350469385259, 0.35372074145336163, 0.12758024069660998], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 14.3, 10, 82, 13.0, 17.0, 21.0, 50.840000000000146, 0.23056636783728285, 0.11994629864316304, 1.8589413406880932], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 13.70399999999999, 9, 28, 13.0, 17.0, 19.0, 24.0, 0.2318705086682471, 0.419746758421305, 0.1933763812526201], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 9.179999999999998, 6, 20, 9.0, 12.0, 13.0, 17.980000000000018, 0.2318696484485138, 0.39257297676921177, 0.1662034394152433], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 58.0, 58, 58, 58.0, 58.0, 58.0, 58.0, 17.241379310344826, 8.132408405172413, 2351.4278017241377], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 532.0, 532, 532, 532.0, 532.0, 532.0, 532.0, 1.8796992481203008, 0.8719308035714285, 3594.8183446898493], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 2.811999999999999, 1, 19, 3.0, 4.0, 4.0, 8.990000000000009, 0.23070935281873767, 0.19391977252403877, 0.097555810322767], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 691.6260000000002, 506, 894, 676.0, 825.9000000000001, 845.95, 873.97, 0.23065752155725197, 0.20311151734706023, 0.10676920431458733], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 3.6680000000000046, 2, 12, 3.0, 4.0, 5.0, 10.990000000000009, 0.2307194663551031, 0.2090241759104421, 0.11265598943120268], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 948.1900000000002, 711, 1235, 922.0, 1133.9, 1152.85, 1209.94, 0.2306361359775305, 0.2181831360183531, 0.12184975543344141], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 68.0, 68, 68, 68.0, 68.0, 68.0, 68.0, 14.705882352941176, 6.965188419117647, 968.3335248161764], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 0, 0.0, 31.252, 20, 1682, 27.0, 33.0, 40.94999999999999, 92.92000000000007, 0.23038894722849007, 0.11985400007625875, 10.509245825237082], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 38.95199999999999, 26, 449, 37.0, 44.0, 50.0, 122.98000000000002, 0.23064571111993715, 52.16528238516611, 0.0711758249159181], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 437.0, 437, 437, 437.0, 437.0, 437.0, 437.0, 2.288329519450801, 1.2000321796338673, 0.9385726544622426], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 3.1899999999999995, 2, 10, 3.0, 4.0, 5.0, 7.0, 0.2318892200266951, 0.2519779824374061, 0.09941344491378822], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 3.9660000000000037, 2, 23, 4.0, 5.0, 6.0, 8.0, 0.2318885747571663, 0.23793715271787322, 0.08537303972993329], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 2.1920000000000006, 1, 12, 2.0, 3.0, 3.9499999999999886, 7.990000000000009, 0.23191869116222805, 0.1315209991648608, 0.089913789444731], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 126.28800000000012, 88, 166, 126.0, 154.0, 160.0, 164.0, 0.23190675122296026, 0.21123217376285863, 0.07564145987155148], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 0, 0.0, 99.73800000000007, 70, 491, 96.0, 114.0, 119.94999999999999, 395.5700000000004, 0.23061081887595675, 0.11996942316739347, 68.19008774165131], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 254.10199999999992, 14, 454, 318.0, 418.0, 426.95, 443.93000000000006, 0.2318866389701265, 0.12923830442054773, 0.09714782042791432], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 491.3379999999998, 363, 653, 480.5, 590.0, 604.0, 633.9100000000001, 0.2318604014894712, 0.12469515791432295, 0.09872181157168892], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 8.451999999999996, 5, 325, 7.0, 9.0, 12.0, 27.960000000000036, 0.23035636129091705, 0.10386507380041923, 0.16714333636635875], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 457.53, 332, 647, 464.5, 544.0, 559.0, 598.97, 0.23185373553464544, 0.11925750101899715, 0.09328490140651749], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 3.9399999999999986, 2, 13, 4.0, 5.0, 6.0, 9.990000000000009, 0.23070818183496059, 0.14164896582173642, 0.1153540909174803], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 4.543999999999997, 3, 28, 4.0, 5.900000000000034, 6.0, 10.0, 0.23070552055240132, 0.13511367942429744, 0.10881910783868148], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 768.4299999999995, 532, 1127, 737.0, 968.9000000000001, 1065.8, 1115.97, 0.23063028489297832, 0.21074517956758665, 0.1015764243034504], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 277.8000000000001, 192, 377, 270.0, 338.0, 345.0, 369.0, 0.2306681626265907, 0.20424719700698832, 0.09483525045487762], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 5.291999999999998, 3, 48, 5.0, 7.0, 8.0, 12.990000000000009, 0.23072617371558202, 0.1538272129466455, 0.10792757540015994], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 1266.7540000000004, 950, 10948, 1163.5, 1494.9, 1508.0, 1937.1200000000035, 0.23062911471169284, 0.17335696863743857, 0.12747663957697083], "isController": false}, {"data": ["Query single patient #2", 500, 0, 0.0, 167.96399999999988, 144, 204, 170.0, 188.0, 189.95, 193.0, 0.231915033752914, 4.484002439369293, 0.11686343497705433], "isController": false}, {"data": ["Query single patient #1", 500, 0, 0.0, 226.88399999999996, 195, 282, 220.5, 254.0, 257.0, 265.99, 0.23190191105726865, 0.44947074403757, 0.16577363173234438], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 8.164, 5, 23, 8.0, 11.0, 12.0, 18.99000000000001, 0.2318080518063179, 0.18918389353033, 0.14306903197421184], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 8.173999999999994, 5, 21, 8.0, 10.0, 11.0, 15.990000000000009, 0.23180912651075802, 0.19280678822312278, 0.14669171287008906], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 9.223999999999998, 6, 33, 9.0, 11.0, 13.0, 16.99000000000001, 0.23180590242733232, 0.18759752871147908, 0.14148309474324483], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 11.280000000000003, 7, 21, 11.0, 14.0, 15.0, 19.99000000000001, 0.23180665470544326, 0.2072926482229702, 0.16117806459987855], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 8.63400000000001, 6, 35, 9.0, 11.0, 12.0, 30.850000000000136, 0.23179880975947165, 0.1740098271974643, 0.1278968042129897], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 2055.723999999999, 1666, 2879, 1990.0, 2483.6000000000004, 2672.8, 2726.98, 0.2316198099791079, 0.19355408945041253, 0.1474766758851351], "isController": false}]}, function(index, item){
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

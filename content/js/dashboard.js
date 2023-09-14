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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.889661774090619, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Query cross patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.186, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.589, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.998, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [1.0, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [0.943, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [0.996, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.496, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.105, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 23505, 500, 2.1272069772388855, 326.3118910870017, 1, 20439, 9.0, 847.0, 1510.9500000000007, 6060.990000000002, 15.163136772719385, 95.51651773129025, 125.47625077936458], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query cross patient #1", 500, 500, 100.0, 6219.7100000000055, 4958, 20439, 6046.0, 6534.500000000001, 6664.7, 18906.960000000105, 0.32721121156495303, 0.19003494104471996, 0.16488377457765213], "isController": false}, {"data": ["Query participation #2", 500, 0, 0.0, 2.3619999999999983, 1, 8, 2.0, 3.0, 4.0, 5.990000000000009, 0.3282491910298687, 0.16851941622686747, 0.11860566472758928], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 3.5679999999999965, 2, 12, 3.0, 4.0, 5.0, 7.990000000000009, 0.3282468206012957, 0.18839251849178465, 0.1384791274411716], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 0, 0.0, 13.089999999999998, 8, 360, 11.0, 15.0, 17.94999999999999, 51.91000000000008, 0.32620467386056706, 0.1696996990354128, 3.589207090221689], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 33.54999999999998, 24, 65, 33.0, 40.0, 41.0, 44.0, 0.3281800316890639, 1.3648667800337237, 0.1365280209956457], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 2.247999999999997, 1, 10, 2.0, 3.0, 4.0, 7.980000000000018, 0.3281875710115857, 0.2050242881365444, 0.1387746271953287], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 29.684000000000008, 22, 60, 29.0, 35.0, 37.0, 40.0, 0.32818541688408953, 1.346941536516535, 0.11922360847742314], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 861.1660000000003, 675, 1097, 860.0, 1016.9000000000001, 1054.95, 1074.99, 0.32803276128793535, 1.3873191012082757, 0.1595315577357342], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 5.681999999999999, 4, 24, 5.0, 8.0, 9.0, 11.990000000000009, 0.328142555626726, 0.48795503015466013, 0.16759624667263448], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 3.847999999999997, 2, 15, 4.0, 5.0, 5.0, 10.990000000000009, 0.3263503070303688, 0.31478463062203677, 0.17847282415723298], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 7.767999999999993, 5, 36, 8.0, 9.0, 10.0, 14.0, 0.32819015600190876, 0.5348185500214307, 0.21441329527859077], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 426.0, 426, 426, 426.0, 426.0, 426.0, 426.0, 2.347417840375587, 1.0155333039906103, 2776.50243911385], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 4.240000000000005, 3, 20, 4.0, 5.0, 6.0, 13.0, 0.32635222412304266, 0.32785331687267105, 0.19154070966596545], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 8.034, 5, 23, 8.0, 10.0, 11.0, 14.0, 0.32818843267050213, 0.5155859507044565, 0.1951823784143904], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 6.567999999999995, 4, 13, 6.0, 8.0, 9.0, 12.0, 0.3281873555975635, 0.5078923674697411, 0.1874898467036862], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 1564.74, 1315, 1984, 1543.0, 1767.5000000000005, 1833.9, 1931.99, 0.3278634776479074, 0.5006673814773528, 0.1805810560482615], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 11.592000000000002, 7, 59, 10.0, 14.0, 18.94999999999999, 33.0, 0.326196799748437, 0.16969560272850576, 2.6299616979717735], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 10.997999999999992, 8, 22, 11.0, 13.0, 14.0, 19.0, 0.3281940335637474, 0.5941177362865764, 0.27370869596039094], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 7.797999999999997, 5, 25, 8.0, 10.0, 11.0, 15.0, 0.32819144851234094, 0.5556531212893855, 0.23524660469536943], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 83.0, 83, 83, 83.0, 83.0, 83.0, 83.0, 12.048192771084338, 5.682887801204819, 1643.1664156626505], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 496.0, 496, 496, 496.0, 496.0, 496.0, 496.0, 2.0161290322580645, 0.9352161038306451, 3855.7325793850805], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 2.336000000000001, 1, 17, 2.0, 3.0, 3.0, 7.0, 0.326376083160626, 0.2743312095089672, 0.13800863672710065], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 565.456, 435, 699, 555.5, 651.0, 666.0, 691.99, 0.3262615064276779, 0.2872981083602554, 0.15102339262374936], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 3.3580000000000014, 2, 17, 3.0, 4.0, 5.0, 9.990000000000009, 0.32635776251728876, 0.29566929674308007, 0.15935437622914495], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 771.2960000000004, 604, 938, 753.0, 890.0, 905.95, 929.0, 0.32621808200731117, 0.3086042170129906, 0.17234763902925326], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 66.0, 66, 66, 66.0, 66.0, 66.0, 66.0, 15.151515151515152, 7.176254734848484, 997.6769649621211], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 0, 0.0, 26.073999999999998, 17, 1538, 22.0, 27.0, 30.0, 77.98000000000002, 0.32587195187523016, 0.1695266088705604, 14.864725461027344], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 30.295999999999978, 21, 254, 29.0, 35.0, 40.0, 88.94000000000005, 0.3263224052310787, 73.8045391558741, 0.10070105473927818], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 416.0, 416, 416, 416.0, 416.0, 416.0, 416.0, 2.403846153846154, 1.2606107271634617, 0.9859525240384616], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 2.69, 1, 7, 3.0, 3.0, 4.0, 6.0, 0.32820157352962415, 0.35663395789272273, 0.14070360427686035], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 3.37, 2, 10, 3.0, 4.0, 5.0, 7.0, 0.3282004963704307, 0.33676127298962427, 0.12083162805825427], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 1.8299999999999998, 1, 11, 2.0, 3.0, 3.0, 5.990000000000009, 0.3282506995022406, 0.18615084346479116, 0.12726125752186476], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 91.32999999999997, 66, 122, 91.0, 109.90000000000003, 114.0, 117.0, 0.3282343225440523, 0.2989721044727178, 0.10706080442354833], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 0, 0.0, 81.33399999999997, 57, 330, 79.0, 91.0, 97.0, 300.98, 0.32626491275349967, 0.16973103678995782, 96.4743680982736], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 209.42399999999995, 12, 355, 260.0, 335.0, 338.0, 346.0, 0.3281966186558773, 0.18291512913388255, 0.13749643496422984], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 434.7340000000002, 317, 550, 424.5, 502.80000000000007, 514.0, 532.99, 0.3281503085925502, 0.17648013324707357, 0.13972024858042176], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 7.549999999999997, 4, 287, 6.0, 8.0, 11.0, 27.99000000000001, 0.32581525493088803, 0.14690640757240267, 0.2364069672008299], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 409.174, 305, 521, 413.5, 470.0, 478.95, 496.99, 0.32813717183821783, 0.16878235329971458, 0.132023940231783], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 3.480000000000001, 2, 25, 3.0, 4.0, 5.0, 10.990000000000009, 0.32637416578763223, 0.200385450949553, 0.16318708289381614], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 4.224, 2, 48, 4.0, 5.0, 6.0, 9.0, 0.3263643662330372, 0.1911366934312644, 0.15393944227593453], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 676.6699999999998, 536, 883, 681.5, 807.5000000000002, 839.0, 855.98, 0.3262038225868746, 0.2980782996413715, 0.14366984764324262], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 247.49599999999998, 177, 346, 239.0, 293.0, 298.0, 314.99, 0.32631559024942913, 0.28893907112798817, 0.13415904638184536], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 4.611999999999998, 3, 43, 4.0, 5.0, 6.0, 9.990000000000009, 0.3263532891842604, 0.2175826699794789, 0.15265939992115304], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 993.1940000000003, 749, 8938, 939.0, 1081.9, 1114.95, 1149.88, 0.3261810526645404, 0.24518048637346032, 0.18029148028137681], "isController": false}, {"data": ["Query single patient #2", 500, 0, 0.0, 133.61400000000023, 115, 173, 130.0, 150.0, 151.0, 157.98000000000002, 0.32824121790621497, 6.346438167355426, 0.16540280121055362], "isController": false}, {"data": ["Query single patient #1", 500, 0, 0.0, 181.69199999999998, 157, 257, 175.0, 202.0, 203.95, 207.99, 0.32820954472741215, 0.6361335600741622, 0.23461854173873603], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 6.999999999999993, 5, 15, 7.0, 8.0, 9.0, 13.0, 0.3281397560346542, 0.2678024174958211, 0.20252375567763814], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 6.926000000000004, 5, 17, 7.0, 8.900000000000034, 9.0, 13.0, 0.328141048148136, 0.2729306758967275, 0.20765175703124233], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 8.432000000000006, 5, 16, 8.0, 10.0, 12.0, 14.0, 0.3281378178835111, 0.26555770611156687, 0.20027942986054142], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 9.761999999999999, 7, 27, 10.0, 11.0, 13.0, 15.0, 0.3281378178835111, 0.29343660274815425, 0.2281583264971288], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 7.9420000000000055, 5, 31, 8.0, 9.0, 11.0, 24.960000000000036, 0.32809281614531627, 0.24629709833893168, 0.18102777453330438], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 1615.0060000000003, 1410, 1980, 1599.0, 1793.8000000000002, 1858.9, 1950.91, 0.32779211686182314, 0.2739208909373347, 0.20871138690811397], "isController": false}]}, function(index, item){
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

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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8909168262071899, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Query cross patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.173, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.608, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.998, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [1.0, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [0.972, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.496, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.125, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 23505, 500, 2.1272069772388855, 330.09865985960323, 1, 23790, 9.0, 845.9000000000015, 1509.9500000000007, 6131.910000000014, 15.004117275321244, 94.51483089348865, 124.16035086805888], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query cross patient #1", 500, 500, 100.0, 6353.59800000001, 5241, 23790, 6098.0, 6793.9, 7012.9, 22220.040000000135, 0.32379099679705947, 0.18806691756151706, 0.16316030697976824], "isController": false}, {"data": ["Query participation #2", 500, 0, 0.0, 2.4559999999999995, 1, 21, 2.0, 3.0, 4.0, 8.990000000000009, 0.32488037904443584, 0.16678990631586949, 0.11738841820941529], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 3.6139999999999985, 2, 32, 3.0, 5.0, 5.0, 7.990000000000009, 0.324878057021297, 0.18645906532420556, 0.1370579303058597], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 0, 0.0, 13.455999999999998, 8, 397, 11.0, 16.0, 17.94999999999999, 63.840000000000146, 0.32276639201398477, 0.16791102020485338, 3.551375916817937], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 33.77600000000003, 24, 52, 34.0, 40.0, 41.0, 44.0, 0.32482297148054307, 1.3509051141346717, 0.1351314314948353], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 2.3060000000000014, 1, 12, 2.0, 3.0, 4.0, 8.990000000000009, 0.32483162352794426, 0.20292777137408324, 0.137355559558203], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 29.90000000000002, 22, 53, 30.0, 35.0, 36.0, 39.0, 0.32482297148054307, 1.3331413578818294, 0.11800209510816605], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 869.4300000000004, 661, 1145, 874.5, 1032.9, 1064.85, 1080.97, 0.3246829146655376, 1.3731518997765533, 0.15790243310882593], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 5.655999999999998, 3, 28, 5.0, 7.0, 8.0, 14.990000000000009, 0.3247879459500892, 0.4829666534938089, 0.16588290598818034], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 3.8899999999999944, 2, 17, 4.0, 5.0, 6.0, 9.0, 0.3229715449150068, 0.3115256099882826, 0.17662506362539435], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 7.721999999999994, 5, 19, 7.0, 9.900000000000034, 11.0, 15.0, 0.3248248706709777, 0.5293344823607102, 0.21221468601453528], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 482.0, 482, 482, 482.0, 482.0, 482.0, 482.0, 2.074688796680498, 0.8975460321576764, 2453.921242868257], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 4.193999999999999, 2, 18, 4.0, 5.0, 7.0, 9.990000000000009, 0.3229744656387466, 0.3244600220187842, 0.18955825571180343], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 8.013999999999996, 5, 21, 8.0, 9.900000000000034, 10.0, 15.990000000000009, 0.32482381556243894, 0.5103001175131359, 0.19318135124758332], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 6.569999999999998, 4, 25, 6.0, 8.0, 9.0, 12.0, 0.32482212740303407, 0.5026844467938106, 0.1855673286433349], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 1589.0160000000003, 1338, 1986, 1569.0, 1800.9, 1869.95, 1925.99, 0.3245027482137746, 0.49553534414976713, 0.17873002928961806], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 11.543999999999992, 8, 62, 11.0, 14.0, 17.0, 32.99000000000001, 0.3227551411666436, 0.16790516723719018, 2.6022133256560642], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 11.108000000000006, 8, 38, 11.0, 13.0, 15.0, 21.0, 0.32482634783444775, 0.5880213371525332, 0.27090009868224446], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 7.6979999999999995, 5, 23, 7.0, 9.0, 11.0, 15.990000000000009, 0.324825714762744, 0.5499546776770674, 0.2328340572615763], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 45.0, 45, 45, 45.0, 45.0, 45.0, 45.0, 22.22222222222222, 10.481770833333334, 3030.729166666667], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 460.0, 460, 460, 460.0, 460.0, 460.0, 460.0, 2.1739130434782608, 1.008406929347826, 4157.485563858695], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 2.328, 1, 16, 2.0, 3.0, 4.0, 6.990000000000009, 0.3229878181914491, 0.27148324706597865, 0.13657590359072017], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 561.5940000000005, 443, 693, 559.0, 645.0, 660.0, 678.98, 0.32288561583327735, 0.28432537954396925, 0.14946072451657566], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 3.279999999999997, 2, 16, 3.0, 4.0, 5.0, 9.0, 0.32297968134824634, 0.29260886736677894, 0.15770492253332344], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 772.5180000000007, 616, 978, 766.5, 889.8000000000001, 902.95, 938.8400000000001, 0.3228364149145258, 0.3054051401287601, 0.17056103561402194], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 57.0, 57, 57, 57.0, 57.0, 57.0, 57.0, 17.543859649122805, 8.309347587719298, 1155.2049067982455], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 0, 0.0, 26.496000000000002, 17, 1530, 22.0, 27.0, 34.94999999999999, 82.99000000000001, 0.32243856416817623, 0.16774047609182535, 14.708110676069834], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 31.416000000000018, 20, 233, 29.0, 36.900000000000034, 43.0, 119.97000000000003, 0.3229027145785409, 73.0311056170784, 0.09964575957697161], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 474.0, 474, 474, 474.0, 474.0, 474.0, 474.0, 2.109704641350211, 1.1063587816455698, 0.8653085443037976], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 2.788000000000002, 1, 18, 3.0, 4.0, 4.0, 7.0, 0.3248309904356763, 0.35297137828875136, 0.13925859843873234], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 3.3840000000000012, 2, 21, 3.0, 4.0, 5.0, 7.990000000000009, 0.32482951322998127, 0.3333023611776109, 0.11959055321064739], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 1.838000000000001, 1, 9, 2.0, 3.0, 3.0, 5.0, 0.32488080123402724, 0.18423977547325385, 0.12595476375967657], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 93.44000000000015, 66, 124, 93.0, 112.0, 115.0, 118.0, 0.3248641255794764, 0.29590236188401703, 0.10596154096049328], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 0, 0.0, 82.78200000000005, 58, 477, 79.0, 91.0, 99.0, 352.8900000000001, 0.322835998021661, 0.16794723096300687, 95.4604607822058], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 208.82599999999994, 12, 361, 262.0, 334.0, 338.0, 353.93000000000006, 0.32482634783444775, 0.18103676266855237, 0.13608447580173638], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 426.8059999999996, 314, 538, 420.0, 495.0, 502.95, 515.98, 0.3247835155477117, 0.17466946274148465, 0.1382867312292991], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 7.219999999999997, 4, 281, 6.0, 8.0, 11.0, 27.980000000000018, 0.32238367913281374, 0.14535914891837054, 0.23391706405828183], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 400.0499999999999, 286, 500, 404.5, 460.90000000000003, 470.0, 485.0, 0.32476199816964135, 0.1670462813046209, 0.13066596020106666], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 3.5599999999999987, 2, 17, 3.0, 5.0, 6.0, 10.980000000000018, 0.3229848972262057, 0.19830452610848417, 0.16149244861310286], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 4.115999999999999, 2, 32, 4.0, 5.0, 5.0, 10.0, 0.3229786381928699, 0.18915382725649027, 0.15234246313198846], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 677.8120000000005, 538, 866, 681.0, 806.9000000000001, 834.0, 849.99, 0.32282515918508603, 0.2949909469737078, 0.1421817839770252], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 245.206, 177, 322, 243.0, 287.0, 294.95, 306.97, 0.322906676741355, 0.2859206180353066, 0.13275753018370162], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 4.564000000000002, 3, 37, 4.0, 5.0, 6.0, 12.980000000000018, 0.3229765519023319, 0.21533136889574317, 0.15107985191525097], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 1002.1159999999994, 816, 9338, 945.0, 1084.9, 1115.0, 1144.99, 0.32280744342315343, 0.24264464577855022, 0.17842677048584457], "isController": false}, {"data": ["Query single patient #2", 500, 0, 0.0, 134.996, 117, 163, 137.0, 150.0, 151.0, 156.98000000000002, 0.3248594820310474, 6.281053394026289, 0.16369872336720753], "isController": false}, {"data": ["Query single patient #1", 500, 0, 0.0, 182.17600000000013, 160, 239, 183.0, 203.0, 205.0, 210.99, 0.32483943186882724, 0.6296016297113087, 0.23220943762498197], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 6.847999999999994, 5, 19, 7.0, 8.0, 10.0, 13.990000000000009, 0.32478372651651266, 0.265063484460073, 0.20045245620941013], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 6.838000000000001, 5, 19, 7.0, 9.0, 10.0, 14.990000000000009, 0.324785625248055, 0.2701398094531454, 0.2055284034772848], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 8.241999999999997, 5, 23, 8.0, 10.0, 11.0, 16.99000000000001, 0.3247799291200283, 0.26284021002056507, 0.1982299372070485], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 9.657999999999985, 7, 19, 9.0, 12.0, 13.0, 16.99000000000001, 0.32478161684083623, 0.2904353265208224, 0.22582471795964393], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 7.561999999999999, 5, 33, 7.0, 9.0, 10.0, 17.99000000000001, 0.3247641075904517, 0.24379825893150012, 0.17919113358262226], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 1632.4939999999997, 1430, 1961, 1604.5, 1852.8000000000002, 1903.8, 1952.99, 0.32446505446470403, 0.2711406169492108, 0.20659298389744826], "isController": false}]}, function(index, item){
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

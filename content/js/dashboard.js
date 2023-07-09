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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.890044671346522, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Query cross patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.184, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.6, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [1.0, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [0.963, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [0.997, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.497, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.093, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 23505, 500, 2.1272069772388855, 324.38544990427727, 1, 17161, 9.0, 842.0, 1515.0, 6054.0, 15.251459286617127, 96.07288407495892, 126.20712711909634], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query cross patient #1", 500, 500, 100.0, 6168.311999999998, 4963, 17161, 6043.0, 6560.8, 6730.15, 13861.110000000057, 0.3288002735618276, 0.1909578229394087, 0.1656845128495147], "isController": false}, {"data": ["Query participation #2", 500, 0, 0.0, 2.3480000000000003, 1, 11, 2.0, 3.0, 4.0, 6.0, 0.3298690485850927, 0.1693510327457706, 0.11919096482078545], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 3.666000000000001, 2, 20, 4.0, 5.0, 5.0, 7.0, 0.329866872327666, 0.1893223237653248, 0.1391625867632341], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 0, 0.0, 12.860000000000001, 9, 325, 11.0, 14.900000000000034, 17.0, 38.0, 0.3279518619139008, 0.170608629257963, 3.60843127752336], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 33.588000000000044, 23, 51, 33.0, 40.0, 41.94999999999999, 43.99000000000001, 0.3298187843671173, 1.3716821827852406, 0.13720976771522655], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 2.245999999999999, 1, 10, 2.0, 3.0, 3.9499999999999886, 6.0, 0.32982705188707245, 0.20604849937761638, 0.1394678842452172], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 29.468000000000004, 21, 46, 30.0, 35.0, 37.0, 38.0, 0.3298155209864914, 1.3536318244190795, 0.11981579473337384], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 853.4339999999997, 676, 1083, 859.0, 993.0, 1040.9, 1077.0, 0.32967569142882763, 1.394267396120838, 0.1603305608706603], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 5.746000000000003, 4, 52, 5.0, 7.0, 8.0, 11.0, 0.329782020679971, 0.49039294991171734, 0.1684335906402586], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 3.8919999999999964, 2, 18, 4.0, 5.0, 6.0, 9.990000000000009, 0.328107456504435, 0.31647950767968314, 0.1794337652758629], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 7.719999999999999, 5, 22, 8.0, 9.0, 10.0, 14.0, 0.3298116050149833, 0.5374608626997587, 0.2154726208545155], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 502.0, 502, 502, 502.0, 502.0, 502.0, 502.0, 1.9920318725099602, 0.8617872260956175, 2356.155456299801], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 4.101999999999999, 2, 22, 4.0, 5.0, 6.0, 9.0, 0.3281100402328531, 0.32961921824993984, 0.19257239666010229], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 8.006000000000006, 5, 20, 8.0, 10.0, 10.0, 14.990000000000009, 0.3298096470641005, 0.5181328880161026, 0.1961465576777707], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 6.655999999999998, 4, 28, 6.0, 8.0, 9.0, 13.0, 0.32980921196706126, 0.5104023010706267, 0.18841639550852624], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 1568.6239999999982, 1331, 1920, 1546.5, 1767.8000000000002, 1833.8, 1879.95, 0.32949189713526567, 0.50315407663026, 0.18147795896903302], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 11.439999999999998, 7, 71, 10.0, 14.0, 16.0, 34.0, 0.32794347303943916, 0.17060426515902308, 2.644044251380478], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 11.11199999999998, 8, 46, 11.0, 13.0, 15.0, 18.0, 0.32981334543528434, 0.5970491177410556, 0.2750591767595047], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 7.781999999999994, 5, 18, 8.0, 10.0, 11.0, 14.990000000000009, 0.32981269277551895, 0.5583980113201611, 0.23640870751682705], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 87.0, 87, 87, 87.0, 87.0, 87.0, 87.0, 11.494252873563218, 5.421605603448276, 1567.6185344827588], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 505.0, 505, 505, 505.0, 505.0, 505.0, 505.0, 1.9801980198019802, 0.9185488861386139, 3787.0165532178216], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 2.342, 1, 16, 2.0, 3.0, 4.0, 7.0, 0.32810939429693375, 0.2757881218411268, 0.13874157004938703], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 562.2420000000004, 429, 715, 559.0, 645.9000000000001, 658.95, 682.99, 0.3279931672463399, 0.28882296761493864, 0.1518249621823878], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 3.2760000000000007, 2, 14, 3.0, 4.0, 5.0, 8.0, 0.3281027197746853, 0.29725017008024734, 0.16020640613998305], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 755.1199999999998, 625, 927, 730.5, 873.8000000000001, 890.0, 921.98, 0.32795723962326895, 0.3102494703080634, 0.17326647132440284], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 46.0, 46, 46, 46.0, 46.0, 46.0, 46.0, 21.73913043478261, 10.296365489130435, 1431.449558423913], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 0, 0.0, 22.932000000000013, 16, 642, 21.0, 25.0, 28.0, 57.960000000000036, 0.3278071602262394, 0.1705333518790234, 14.953000443523088], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 30.127999999999982, 21, 271, 28.0, 34.0, 39.94999999999999, 116.91000000000008, 0.32807301068008876, 74.20047466730936, 0.10124128063955866], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 496.0, 496, 496, 496.0, 496.0, 496.0, 496.0, 2.0161290322580645, 1.0572864163306452, 0.8269279233870968], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 2.6960000000000015, 1, 11, 3.0, 4.0, 4.0, 7.0, 0.3298233532084886, 0.35839623373888413, 0.14139887896340478], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 3.304000000000001, 2, 9, 3.0, 4.0, 5.0, 7.0, 0.32982183024730044, 0.3384248977140049, 0.1214285449250315], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 1.7900000000000003, 1, 10, 2.0, 2.0, 3.0, 5.990000000000009, 0.32986991909610364, 0.18706910226396323, 0.12788902136831362], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 91.234, 66, 126, 90.0, 111.0, 113.94999999999999, 116.99000000000001, 0.3298529449600779, 0.3004464260680803, 0.10758875353190041], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 0, 0.0, 82.72599999999997, 59, 400, 80.0, 93.0, 99.94999999999999, 366.72000000000025, 0.32800457107170244, 0.17063604985899083, 96.98877351054765], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 210.64399999999992, 13, 377, 259.5, 334.0, 338.0, 363.95000000000005, 0.32981769656639986, 0.1838186109447364, 0.13817557795604057], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 423.7939999999999, 303, 535, 410.5, 493.0, 508.0, 528.95, 0.329774407923028, 0.1773535783079011, 0.14041175962347677], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 7.281999999999999, 4, 263, 6.0, 8.0, 11.0, 27.970000000000027, 0.32775344026398573, 0.14778031338309067, 0.23781328722279432], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 398.74800000000016, 295, 516, 399.5, 459.0, 472.0, 490.0, 0.3297546163997523, 0.1696143105506968, 0.13267470894208783], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 3.527999999999999, 2, 30, 3.0, 4.0, 5.0, 10.0, 0.32810767181358236, 0.2014497796346849, 0.16405383590679115], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 4.190000000000005, 2, 24, 4.0, 5.0, 6.0, 8.990000000000009, 0.3281031503808293, 0.192155019838757, 0.15475959143939508], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 676.496, 535, 895, 678.0, 814.7, 837.0, 857.98, 0.32795853029976063, 0.29968171522147363, 0.14444267301288286], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 246.19000000000028, 174, 328, 240.0, 287.0, 293.95, 305.97, 0.32807214962714604, 0.2904944324105757, 0.13488122557912935], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 4.459999999999999, 3, 40, 4.0, 5.0, 6.0, 10.990000000000009, 0.32811240868631664, 0.21875549075608913, 0.15348226929760322], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 983.8840000000001, 812, 8364, 936.0, 1096.8000000000002, 1110.0, 1134.98, 0.3279396013959733, 0.24650233456102988, 0.1812634906153524], "isController": false}, {"data": ["Query single patient #2", 500, 0, 0.0, 133.39800000000005, 117, 168, 130.0, 149.0, 151.0, 160.0, 0.32984206502242597, 6.37739003044937, 0.16620947807770683], "isController": false}, {"data": ["Query single patient #1", 500, 0, 0.0, 181.362, 159, 220, 176.0, 202.0, 205.0, 213.99, 0.32981943705099204, 0.6392538426850336, 0.2357693632044201], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 7.123999999999995, 5, 18, 7.0, 9.0, 10.0, 14.0, 0.32977897553501695, 0.2691402223089541, 0.20353546146301826], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 7.014000000000003, 5, 22, 7.0, 9.0, 10.0, 14.990000000000009, 0.32977941055228155, 0.274293380626449, 0.2086885332401157], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 8.414000000000003, 6, 20, 8.0, 10.0, 11.949999999999989, 14.0, 0.3297765829605759, 0.2668839375637293, 0.20127965268589834], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 9.797999999999996, 7, 18, 10.0, 12.0, 13.0, 15.990000000000009, 0.329777670490109, 0.2949030377387673, 0.2292985365126539], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 7.643999999999997, 5, 24, 7.0, 9.0, 10.0, 14.980000000000018, 0.32974722237427234, 0.24753905010871766, 0.18194060609517954], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 1633.3259999999993, 1417, 1976, 1607.0, 1829.8000000000002, 1885.0, 1958.99, 0.32943827479764254, 0.27529650988973703, 0.20975952653131147], "isController": false}]}, function(index, item){
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

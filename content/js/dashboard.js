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

    var data = {"OkPercent": 100.0, "KoPercent": 0.0};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9202453987730062, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.006, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.996, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [1.0, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.731, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.761, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 22005, 0, 0.0, 180.6792547148372, 1, 3679, 11.0, 570.0, 1234.9500000000007, 2151.0, 27.17347680962019, 182.01571659317088, 239.36183283048098], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query participation #2", 500, 0, 0.0, 7.254000000000001, 4, 28, 7.0, 10.0, 12.0, 19.0, 0.6298181085302564, 6.7339623215252935, 0.22757099624628407], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 7.466, 4, 35, 7.0, 9.0, 10.0, 14.990000000000009, 0.6297951024613652, 6.7622035003382, 0.2656948088508885], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 0, 0.0, 19.822000000000006, 12, 257, 18.0, 25.0, 29.94999999999999, 43.99000000000001, 0.6251508176347543, 0.33689768281597937, 6.959686836949414], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 43.82600000000001, 25, 81, 46.0, 54.0, 56.0, 60.97000000000003, 0.6297062672145951, 2.619061515690391, 0.2619676463216968], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 2.2180000000000026, 1, 29, 2.0, 3.0, 4.0, 6.0, 0.6297483021985774, 0.3935926888741108, 0.26629005356639057], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 38.662000000000006, 23, 71, 40.0, 48.0, 49.0, 52.99000000000001, 0.6296991297558028, 2.5838818275128146, 0.2287578869816002], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 748.5500000000004, 565, 964, 754.5, 890.9000000000001, 904.0, 928.95, 0.6292988980976294, 2.6616147731062823, 0.3060457531763862], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 8.533999999999999, 5, 26, 9.0, 11.0, 12.0, 19.99000000000001, 0.6292505877200488, 0.9358873487281587, 0.3213848216577984], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 3.012000000000002, 1, 19, 3.0, 4.0, 5.0, 8.0, 0.6262666242475406, 0.6042494382388381, 0.3424895601353738], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 12.988000000000007, 8, 39, 14.0, 16.0, 17.0, 28.950000000000045, 0.6296745464139405, 1.026295720668815, 0.41137917143645136], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 603.0, 603, 603, 603.0, 603.0, 603.0, 603.0, 1.658374792703151, 0.7077243988391376, 1961.5091858416254], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 3.920000000000003, 2, 22, 4.0, 5.0, 6.0, 9.990000000000009, 0.6262791752153775, 0.6286277221224351, 0.3675720549848065], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 13.765999999999998, 9, 41, 14.0, 17.0, 19.0, 24.0, 0.6296539296072093, 0.9886550529098197, 0.37447191711991257], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 8.080000000000005, 5, 24, 8.0, 10.0, 12.0, 16.0, 0.6296515508317697, 0.9746071367855028, 0.3597130441763528], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 1863.9060000000009, 1464, 2285, 1864.5, 2117.7000000000003, 2181.5499999999997, 2244.99, 0.6281020389448388, 0.9593277235446562, 0.34594682613758704], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 16.727999999999984, 11, 68, 15.0, 22.0, 25.0, 39.99000000000001, 0.625108612621443, 0.33758306912075975, 5.039938189260384], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 17.270000000000003, 11, 46, 18.0, 21.0, 22.0, 29.99000000000001, 0.6296983367148135, 1.1400983557317033, 0.5251585737836433], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 12.987999999999994, 8, 28, 14.0, 16.900000000000034, 18.0, 22.0, 0.6296919924588088, 1.066294838792553, 0.45136125240699765], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 81.0, 81, 81, 81.0, 81.0, 81.0, 81.0, 12.345679012345679, 5.750868055555555, 1683.7384259259259], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 696.0, 696, 696, 696.0, 696.0, 696.0, 696.0, 1.4367816091954022, 0.6580572018678161, 2747.763447377874], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 2.028, 1, 20, 2.0, 2.0, 3.9499999999999886, 8.0, 0.6261505516386361, 0.5264801025008453, 0.2647687391206342], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 389.3300000000002, 302, 540, 387.5, 454.0, 462.95, 485.95000000000005, 0.6259255874624601, 0.5506433654391432, 0.2897350863839903], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 2.716, 1, 14, 3.0, 3.0, 4.0, 9.990000000000009, 0.6262407394650652, 0.5675306701402153, 0.30578161106692636], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 1123.0039999999997, 913, 1412, 1113.0, 1306.8000000000002, 1335.0, 1362.97, 0.6255285716430383, 0.5919308456270549, 0.3304794504481287], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 56.0, 56, 56, 56.0, 56.0, 56.0, 56.0, 17.857142857142858, 8.353097098214285, 1175.8335658482142], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 0, 0.0, 41.861999999999995, 27, 903, 40.0, 48.0, 53.89999999999998, 85.8900000000001, 0.6244146113019045, 0.3372082812987824, 28.560870668123634], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 40.82599999999996, 27, 184, 41.0, 50.0, 56.0, 82.98000000000002, 0.6255434408642508, 141.5579149620608, 0.19303879620420242], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 262.0, 262, 262, 262.0, 262.0, 262.0, 262.0, 3.8167938931297707, 2.001580391221374, 1.5654818702290076], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 2.010000000000003, 1, 16, 2.0, 3.0, 4.0, 6.0, 0.6298474635412796, 0.6845900653529728, 0.27002249657677907], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 3.0560000000000036, 2, 14, 3.0, 4.900000000000034, 6.0, 9.0, 0.6298411162800073, 0.6464482550881715, 0.23188486409918235], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 1.9139999999999977, 1, 12, 2.0, 3.0, 3.0, 6.0, 0.6298308022532826, 0.35735517198159883, 0.24418244970171213], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 120.0759999999999, 83, 204, 120.0, 144.90000000000003, 149.0, 155.99, 0.6297530612296307, 0.5737886778586381, 0.20540773676825844], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 0, 0.0, 161.3000000000001, 109, 558, 161.0, 191.90000000000003, 214.0, 332.82000000000016, 0.6252618283906385, 0.33766581162111636, 184.9639282543315], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 2.1399999999999975, 1, 14, 2.0, 3.0, 4.0, 6.0, 0.6298363559180054, 0.3504940908753088, 0.26386698895393], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 2.9479999999999977, 1, 11, 3.0, 4.0, 5.0, 8.0, 0.6298911044258668, 0.33822199693117055, 0.2681958218063261], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 10.462000000000007, 6, 288, 9.0, 13.0, 17.0, 43.86000000000013, 0.6242166081567633, 0.2639509680975376, 0.4529227928324952], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 4.192, 2, 55, 4.0, 5.0, 6.0, 9.990000000000009, 0.6298498437972387, 0.32415123796986794, 0.2534161480902953], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 3.229999999999999, 2, 14, 3.0, 4.0, 5.0, 8.0, 0.6261411422317172, 0.384612088343506, 0.3130705711158586], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 3.817999999999997, 2, 31, 3.0, 5.0, 6.0, 14.960000000000036, 0.626119188048637, 0.36686671174724816, 0.29532770295653477], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 508.76399999999984, 363, 818, 522.0, 615.0, 625.95, 644.97, 0.6254808383945158, 0.5710200263327433, 0.2754803301913346], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 15.593999999999996, 5, 118, 14.5, 27.0, 35.0, 52.960000000000036, 0.6256812104178424, 0.5541922439931475, 0.25723807576749186], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 6.953999999999994, 4, 49, 7.0, 8.0, 10.0, 13.990000000000009, 0.6262925111699269, 0.41773221204009775, 0.29296300083046384], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 511.704, 335, 3679, 499.0, 562.8000000000001, 583.0, 661.8300000000002, 0.6260682289155872, 0.47077396119629117, 0.34604943121701404], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 12.989999999999986, 8, 29, 14.0, 15.900000000000034, 17.0, 21.99000000000001, 0.6292371254937937, 0.5137131219851676, 0.3883572883907008], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 12.868000000000007, 8, 32, 13.0, 16.0, 17.0, 22.99000000000001, 0.6292426686936671, 0.5228367502258982, 0.3981926262827112], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 13.076000000000002, 8, 37, 14.0, 17.0, 18.0, 27.970000000000027, 0.6292165373207205, 0.5093950287489036, 0.3840432967045413], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 15.786000000000007, 10, 34, 17.0, 19.0, 20.0, 24.99000000000001, 0.6292260393870331, 0.5628623555454321, 0.4375087305112965], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 12.410000000000002, 8, 39, 13.0, 15.0, 17.0, 20.0, 0.628959298785857, 0.47233369215461324, 0.3470332068496183], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 2094.250000000001, 1652, 2662, 2065.0, 2409.8, 2486.9, 2608.6200000000003, 0.6276864982123489, 0.5239956309881292, 0.399659762533644], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": []}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 22005, 0, null, null, null, null, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});

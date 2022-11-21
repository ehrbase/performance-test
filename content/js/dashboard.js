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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8731121038077004, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Query cross patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.447, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.702, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [0.5, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [0.981, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [0.798, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [0.806, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.496, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [0.836, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.473, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 23505, 500, 2.1272069772388855, 495.5915762603711, 1, 24830, 14.0, 1012.8000000000029, 1945.9500000000007, 10826.94000000001, 9.952361616444747, 67.08398636223717, 82.4565038688456], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query cross patient #1", 500, 500, 100.0, 11324.370000000003, 8923, 24830, 10938.5, 13141.300000000001, 13856.95, 22130.200000000063, 0.2141967002569932, 0.12445999673135837, 0.10835340891906492], "isController": false}, {"data": ["Query participation #2", 500, 0, 0.0, 7.759999999999996, 5, 27, 7.0, 9.0, 11.0, 18.0, 0.21492878119906186, 2.2948915666835887, 0.0780795962949717], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 9.584, 6, 34, 9.0, 11.0, 14.0, 22.0, 0.2149264715048335, 2.307794816252912, 0.09109188343075951], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 0, 0.0, 22.10799999999999, 15, 278, 20.0, 28.0, 33.0, 56.99000000000001, 0.2137357721439878, 0.12560483215971022, 2.379897728501708], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 46.501999999999995, 27, 95, 47.0, 57.0, 60.0, 86.99000000000001, 0.21485323375602125, 0.8935523585245169, 0.08980193754646201], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 2.9019999999999992, 1, 10, 3.0, 4.0, 5.0, 9.0, 0.21485711142661684, 0.13424918571840483, 0.09127230807673664], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 41.67200000000001, 24, 83, 42.0, 51.0, 53.0, 76.0, 0.21485231052174736, 0.8817987831570829, 0.07847144935071633], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 1163.4120000000014, 790, 1918, 1144.5, 1510.9, 1591.5, 1764.98, 0.21478327508410913, 0.908424183973903, 0.10487464603716266], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 6.336000000000006, 4, 45, 6.0, 8.0, 9.0, 15.0, 0.21476187203628616, 0.31935551774255205, 0.11010740509672876], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 4.771999999999996, 3, 24, 4.0, 6.0, 7.0, 14.980000000000018, 0.21386677981645097, 0.20628745809815116, 0.11737610376645063], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 9.044000000000002, 6, 28, 9.0, 11.0, 13.0, 21.0, 0.2148519412302594, 0.35018348624345985, 0.14078677008350005], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 696.0, 696, 696, 696.0, 696.0, 696.0, 696.0, 1.4367816091954022, 0.6819100215517242, 1699.413781878592], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 5.0859999999999985, 3, 28, 5.0, 6.0, 7.0, 14.980000000000018, 0.21386824347445216, 0.21486406748313008, 0.12593999103036588], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 14.733999999999998, 6, 34, 16.0, 18.0, 19.0, 30.970000000000027, 0.2148507410416909, 0.33755611162806587, 0.12819707302389957], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 7.161999999999996, 4, 30, 7.0, 9.0, 11.0, 19.99000000000001, 0.2148507410416909, 0.33249620882439257, 0.12316150878073492], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 2333.5799999999995, 1605, 4008, 2278.5, 3022.3, 3184.85, 3655.020000000002, 0.2146150257130262, 0.327730138532926, 0.11862510210309847], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 20.22599999999999, 13, 116, 18.0, 26.0, 34.0, 53.98000000000002, 0.21373056441112528, 0.12558966592950996, 1.723620118073313], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 13.790000000000003, 9, 39, 13.0, 16.0, 18.0, 26.0, 0.21485351072785064, 0.38894150524543364, 0.17960410662406265], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 9.152000000000005, 6, 29, 9.0, 11.0, 13.949999999999989, 20.0, 0.21485304910853173, 0.3636895614344363, 0.1544256290467572], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 107.0, 107, 107, 107.0, 107.0, 107.0, 107.0, 9.345794392523365, 4.800671728971963, 1274.6239778037384], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 777.0, 777, 777, 777.0, 777.0, 777.0, 777.0, 1.287001287001287, 0.6510416666666666, 2461.3195785070784], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 2.6199999999999988, 1, 20, 2.0, 3.0, 4.0, 8.0, 0.21384400422042527, 0.17980438245486932, 0.09084193538660644], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 536.6399999999993, 388, 958, 533.5, 640.8000000000001, 686.8499999999999, 800.9200000000001, 0.21380760992597553, 0.188201225486423, 0.09938713117652768], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 3.6079999999999997, 2, 18, 3.0, 5.0, 6.0, 11.0, 0.2138555286145113, 0.1937460082528987, 0.10483933141062955], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 799.3559999999993, 614, 1323, 779.0, 957.9000000000001, 1012.8499999999999, 1139.99, 0.213800387406302, 0.20225641922300663, 0.11337266636877145], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 61.0, 61, 61, 61.0, 61.0, 61.0, 61.0, 16.393442622950822, 8.452868852459016, 1079.4857838114754], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 0, 0.0, 36.93400000000004, 24, 586, 34.0, 46.0, 55.89999999999998, 81.93000000000006, 0.21367840971980348, 0.12555901944580367, 9.774117882105074], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 40.86000000000001, 28, 202, 38.0, 51.0, 58.0, 88.99000000000001, 0.21378219613319313, 48.37790094757354, 0.06638939293980022], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 960.0, 960, 960, 960.0, 960.0, 960.0, 960.0, 1.0416666666666667, 0.5462646484375, 0.42928059895833337], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 3.321999999999999, 2, 25, 3.0, 4.0, 5.0, 9.0, 0.2148946951525344, 0.23342600487982873, 0.09254742242408952], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 4.122000000000002, 2, 17, 4.0, 5.0, 7.0, 12.0, 0.21489377156190378, 0.22055991592925867, 0.0795358783417593], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 2.4259999999999993, 1, 12, 2.0, 3.0, 4.0, 7.990000000000009, 0.21493044420964488, 0.12188697095408485, 0.08374731175746905], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 211.59600000000003, 90, 458, 223.0, 311.0, 326.74999999999994, 433.6400000000003, 0.21491048978100621, 0.19575113566761942, 0.07051750445939266], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 0, 0.0, 125.24600000000002, 86, 354, 121.0, 154.90000000000003, 174.74999999999994, 263.9200000000001, 0.21375276756395803, 0.12566324811865504, 63.232410498509935], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 279.5280000000002, 16, 696, 342.0, 470.90000000000003, 493.95, 595.7400000000002, 0.21489090848140033, 0.11979034934062872, 0.0904472476127769], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 523.0579999999997, 309, 1137, 475.0, 843.2000000000006, 909.8499999999999, 1077.97, 0.21492868881033964, 0.11558923653783411, 0.09193238837786011], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 15.292000000000012, 9, 326, 13.0, 19.0, 27.0, 53.960000000000036, 0.213651018153927, 0.10050569526848456, 0.15543946144987855], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 531.4979999999998, 286, 1231, 463.0, 881.0000000000003, 938.95, 1146.7900000000002, 0.21486745256586118, 0.11052034759859837, 0.0868702396115884], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 4.427999999999998, 3, 25, 4.0, 5.0, 7.0, 13.0, 0.21384281526632412, 0.13130617116150006, 0.10733906938172909], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 4.777999999999996, 3, 29, 4.0, 6.0, 7.0, 11.0, 0.21384052885328872, 0.12523662456895096, 0.10128189110727054], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 892.5140000000001, 584, 1617, 892.5, 1194.9, 1269.95, 1405.8600000000001, 0.21376163183919653, 0.1953309536408736, 0.0945644718976133], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 493.4059999999999, 245, 1278, 397.5, 878.0, 919.6999999999999, 1012.8800000000001, 0.21377698613784513, 0.1892907530283648, 0.08830826673467625], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 4.871999999999997, 3, 48, 4.0, 6.0, 6.0, 18.99000000000001, 0.2138691582708764, 0.14264905771387557, 0.10046002453934721], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 1221.0299999999997, 889, 10508, 1144.0, 1430.9, 1516.6499999999999, 2067.670000000002, 0.21378137348546586, 0.16062037604250484, 0.11858185560521933], "isController": false}, {"data": ["Query single patient #2", 500, 0, 0.0, 170.78999999999996, 143, 372, 172.5, 189.0, 200.95, 274.9000000000001, 0.21500170066345223, 4.157049483823917, 0.10876062592155103], "isController": false}, {"data": ["Query single patient #1", 500, 0, 0.0, 231.26400000000024, 193, 469, 228.0, 259.90000000000003, 287.0, 336.99, 0.2149834892680242, 0.41669174807374787, 0.15409949328391578], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 7.925999999999999, 5, 30, 8.0, 10.0, 11.0, 17.99000000000001, 0.2147596581713473, 0.17533112717895147, 0.1329664289849943], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 7.963999999999994, 5, 30, 8.0, 9.0, 11.0, 22.0, 0.21476067285377848, 0.17855378511927594, 0.13632269272944925], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 8.493999999999993, 5, 25, 8.0, 10.0, 12.0, 20.0, 0.2147576288352491, 0.1738005806563079, 0.1314971028122082], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 11.126, 7, 41, 11.0, 13.0, 15.0, 21.99000000000001, 0.21475836677121105, 0.1920594140833383, 0.14974362683070772], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 7.731999999999997, 5, 30, 8.0, 9.0, 10.949999999999989, 19.970000000000027, 0.21474554585526065, 0.16120805522890372, 0.11890695751946562], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 2067.9359999999974, 1640, 3249, 2027.5, 2484.9000000000005, 2609.9, 2923.55, 0.21459669555424316, 0.1793286507350795, 0.13705687391843263], "isController": false}]}, function(index, item){
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

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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9156555328334469, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.002, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.995, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [1.0, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [0.838, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.728, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.729, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 22005, 0, 0.0, 191.8126789366056, 1, 4039, 13.0, 576.9000000000015, 1268.9500000000007, 2178.980000000003, 25.772260123561622, 173.26725392901062, 227.02357086127134], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query participation #2", 500, 0, 0.0, 7.112000000000001, 4, 27, 7.0, 9.0, 11.949999999999989, 18.0, 0.5972866462235358, 6.379362021707785, 0.2158164639674885], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 7.382000000000004, 5, 33, 7.0, 9.0, 10.0, 15.990000000000009, 0.5972666688168267, 6.412940879857421, 0.25197187590709874], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 0, 0.0, 19.722, 12, 251, 18.0, 25.0, 30.0, 42.99000000000001, 0.5936409184812291, 0.3199168012252749, 6.608893037779308], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 42.63600000000001, 27, 60, 44.0, 53.0, 55.0, 58.0, 0.5971311431359179, 2.483575721304564, 0.2484158857186533], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 2.1740000000000026, 1, 8, 2.0, 3.0, 3.0, 6.0, 0.5971575301564552, 0.3732234563477846, 0.25250899468529797], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 37.602, 23, 57, 38.5, 46.0, 48.0, 51.0, 0.5971140284775622, 2.450173446697422, 0.21692033065786442], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 744.7560000000002, 572, 981, 743.5, 890.9000000000001, 911.0, 928.99, 0.5967463004713103, 2.5239338157629345, 0.2902145094088989], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 8.333999999999996, 5, 21, 8.0, 10.900000000000034, 12.0, 16.0, 0.5969023157422242, 0.887775612183015, 0.30486319446599924], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 3.1320000000000006, 1, 18, 3.0, 4.0, 5.0, 12.0, 0.5941615311304992, 0.5732730398016926, 0.32493208733699175], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 12.656000000000008, 8, 30, 13.0, 16.0, 17.0, 23.980000000000018, 0.597104758447241, 0.9732107830551223, 0.3901006673839885], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 639.0, 639, 639, 639.0, 639.0, 639.0, 639.0, 1.5649452269170578, 0.6678526017214398, 1851.0016260758998], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 4.0240000000000045, 2, 22, 4.0, 5.0, 6.949999999999989, 10.0, 0.594172122157035, 0.5964002676151239, 0.3487279740394317], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 13.599999999999998, 9, 38, 14.0, 17.0, 18.0, 22.0, 0.59709834090255, 0.9375376918327695, 0.3551102437594267], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 8.004000000000001, 5, 27, 8.0, 10.0, 11.0, 16.0, 0.5970947756595508, 0.9242140814652228, 0.34111371461019263], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 1847.4059999999981, 1478, 2482, 1830.5, 2094.9, 2148.95, 2301.5300000000007, 0.5956160277890614, 0.9097104174434493, 0.32805414030569396], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 17.41199999999998, 11, 234, 15.0, 22.900000000000034, 27.0, 50.950000000000045, 0.593601451236828, 0.32056797122457603, 4.785911700596926], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 16.940000000000005, 11, 32, 17.0, 21.0, 22.0, 26.99000000000001, 0.5971175939504823, 1.0811093937345646, 0.4979867433922967], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 12.690000000000008, 8, 29, 13.0, 16.0, 17.0, 21.980000000000018, 0.5971133153880879, 1.0111274305497504, 0.4280089584910708], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 87.0, 87, 87, 87.0, 87.0, 87.0, 87.0, 11.494252873563218, 5.354256465517242, 1567.6185344827588], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 619.0, 619, 619, 619.0, 619.0, 619.0, 619.0, 1.6155088852988693, 0.7399156906300485, 3089.5692397011308], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 2.0960000000000005, 1, 19, 2.0, 3.0, 4.0, 10.0, 0.5944398474429576, 0.4998170982894399, 0.2513598183035162], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 400.33600000000035, 309, 574, 403.5, 466.0, 476.0, 500.96000000000004, 0.5941283483588392, 0.5226704895855242, 0.2750164425020408], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 2.788, 1, 16, 3.0, 4.0, 5.0, 9.0, 0.5944115800886387, 0.5386854944553288, 0.2902400293401556], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 1146.9680000000003, 915, 1430, 1143.5, 1326.9, 1358.95, 1383.99, 0.5934908299731861, 0.5616138810976732, 0.31355326075731804], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 58.0, 58, 58, 58.0, 58.0, 58.0, 58.0, 17.241379310344826, 8.065059267241379, 1135.2875808189654], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 0, 0.0, 41.19599999999999, 27, 630, 40.0, 47.0, 53.94999999999999, 79.99000000000001, 0.593166250263959, 0.3203329456991888, 27.13156331041339], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 39.84199999999999, 27, 195, 40.0, 47.0, 53.0, 77.0, 0.5939780133098593, 134.41478817407594, 0.18329790254483938], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 287.0, 287, 287, 287.0, 287.0, 287.0, 287.0, 3.484320557491289, 1.827226698606272, 1.4291158536585367], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 1.9460000000000002, 1, 9, 2.0, 3.0, 4.0, 5.990000000000009, 0.5973023436949362, 0.6492163169262344, 0.2560700477364033], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 2.987999999999998, 2, 26, 3.0, 4.0, 5.0, 13.990000000000009, 0.5972966354280526, 0.6130456678075032, 0.21990315581677328], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 1.8900000000000023, 1, 10, 2.0, 3.0, 3.0, 6.990000000000009, 0.5972980624845449, 0.33889665459328183, 0.23156965899059018], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 117.44399999999999, 84, 173, 117.0, 146.0, 149.0, 154.0, 0.5972274313725958, 0.544153509248664, 0.19479879109223341], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 0, 0.0, 161.0799999999999, 110, 570, 162.0, 189.0, 206.95, 318.9000000000001, 0.5937297389726576, 0.3206372516131637, 175.63615729503854], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 2.0239999999999987, 1, 8, 2.0, 3.0, 4.0, 5.0, 0.5972923542994895, 0.33238386247463003, 0.2502328320258604], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 451.0380000000003, 345, 572, 456.5, 524.0, 533.8499999999999, 549.94, 0.5970569867011526, 0.6488563448051863, 0.2565479239731515], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 11.180000000000003, 6, 326, 9.0, 14.0, 18.0, 39.99000000000001, 0.5929559208427564, 0.2507323376219859, 0.4302404777208672], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 2.608000000000001, 1, 14, 2.0, 3.0, 4.0, 7.990000000000009, 0.5973051978692929, 0.6358033844507122, 0.24265523663440025], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 3.3059999999999987, 2, 17, 3.0, 4.0, 5.0, 9.990000000000009, 0.5944327803523323, 0.36513497933751654, 0.2972163901761661], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 3.6820000000000017, 2, 29, 3.0, 5.0, 5.0, 10.0, 0.5944137000469587, 0.34828927737126486, 0.2803728682838682], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 513.8959999999989, 374, 907, 519.5, 620.8000000000001, 631.0, 681.8500000000001, 0.593776274600151, 0.5420759888156301, 0.2615166990670587], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 14.234, 5, 121, 13.0, 23.0, 30.94999999999999, 42.99000000000001, 0.5941106994584087, 0.526228910555446, 0.24425840280467778], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 6.875999999999994, 4, 36, 7.0, 8.0, 9.0, 13.990000000000009, 0.5941841257768957, 0.3963161698297068, 0.2779435510225909], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 517.5539999999999, 422, 4039, 503.0, 570.9000000000001, 595.95, 662.9000000000001, 0.5938912347592662, 0.44657836988733884, 0.32826410046264126], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 12.750000000000007, 8, 29, 13.0, 15.0, 16.0, 20.0, 0.5968873518376371, 0.4873025645861959, 0.3683914124622917], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 12.432000000000006, 8, 37, 13.0, 15.0, 16.0, 20.980000000000018, 0.5968902020473333, 0.49595513624018867, 0.3777195809830782], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 12.794000000000002, 8, 30, 13.0, 15.0, 17.0, 22.99000000000001, 0.5968738137132953, 0.48321131989093924, 0.3643028648152437], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 15.187999999999999, 10, 35, 16.0, 18.0, 19.0, 23.99000000000001, 0.5968823640361663, 0.5339299272042268, 0.41501976874389684], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 12.438000000000002, 8, 30, 13.0, 15.0, 16.0, 24.99000000000001, 0.5967448760501218, 0.44814141570560906, 0.32925864742999883], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 2122.139999999999, 1606, 2753, 2109.0, 2443.7000000000003, 2517.9, 2634.9700000000003, 0.5954415377634977, 0.49707738685717623, 0.3791287916228521], "isController": false}]}, function(index, item){
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

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

    var data = {"OkPercent": 97.83024888321634, "KoPercent": 2.169751116783663};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8990853009997872, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Query cross patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.001, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.979, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.495, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.995, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [1.0, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [0.983, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.712, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.593, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 23505, 510, 2.169751116783663, 191.3977451606038, 1, 3444, 19.0, 551.9000000000015, 1188.9500000000007, 2253.0, 25.605411941566718, 170.62165277051537, 212.14389410193144], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query cross patient #1", 500, 500, 100.0, 31.520000000000014, 20, 89, 33.0, 37.0, 39.0, 48.99000000000001, 0.5551731029735072, 0.32233437104439167, 0.28083951888698894], "isController": false}, {"data": ["Query participation #2", 500, 0, 0.0, 8.003999999999994, 4, 33, 7.0, 10.900000000000034, 13.0, 22.980000000000018, 0.5549438840744424, 5.945357701913558, 0.20160070788641854], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 8.229999999999997, 5, 37, 8.0, 10.0, 12.0, 19.980000000000018, 0.5549272545861963, 5.958776344477752, 0.23519377782266523], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 0, 0.0, 22.066000000000006, 14, 271, 20.0, 27.0, 31.0, 52.98000000000002, 0.5511542824136589, 0.2975511887984506, 6.136973757891151], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 45.29599999999996, 26, 109, 47.0, 55.0, 57.0, 62.0, 0.5547628610674081, 2.307232734670238, 0.23187353958676826], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 2.7059999999999986, 1, 14, 2.0, 4.0, 4.0, 9.990000000000009, 0.5547942545506999, 0.34671498520086325, 0.2356791999312055], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 40.002, 23, 72, 41.0, 49.0, 51.0, 57.99000000000001, 0.5547560903897384, 2.2768349303143136, 0.20261599395093957], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 783.3200000000003, 580, 1356, 782.0, 924.9000000000001, 941.0, 1135.4400000000005, 0.5544386696576785, 2.344742791742856, 0.2707220066687883], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 13.93399999999998, 9, 39, 14.0, 17.0, 19.0, 26.99000000000001, 0.5543925631564007, 0.8244250533325646, 0.2842344684151469], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 3.569999999999998, 2, 19, 3.0, 5.0, 6.0, 11.990000000000009, 0.5520658857510691, 0.5325322420278926, 0.30298928495322347], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 23.036, 14, 62, 24.0, 28.0, 30.0, 45.97000000000003, 0.5547099310828382, 0.9038294105402653, 0.36348668335603945], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 606.0, 606, 606, 606.0, 606.0, 606.0, 606.0, 1.6501650165016502, 0.7042208127062707, 1951.8019673061056], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 4.756000000000002, 2, 39, 4.0, 6.0, 7.0, 16.970000000000027, 0.5520732004897994, 0.554706330871823, 0.32509779286655177], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 23.668000000000013, 15, 54, 25.0, 29.0, 30.0, 36.99000000000001, 0.5547019309174215, 0.8715342396700633, 0.33097937479545364], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 13.423999999999987, 8, 30, 14.0, 17.0, 18.0, 25.0, 0.554703161697081, 0.858472480621445, 0.31797925382440095], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 2016.126000000001, 1495, 2844, 1997.0, 2264.9, 2331.9, 2619.9900000000007, 0.5534922594107522, 0.8452161923468625, 0.30593419807273997], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 18.82800000000001, 12, 171, 17.0, 23.0, 26.0, 42.97000000000003, 0.5511208696246426, 0.2975019344342524, 4.4444884192971665], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 27.739999999999995, 18, 58, 29.0, 34.0, 37.0, 44.99000000000001, 0.5547567058990609, 1.0042873331846585, 0.4637419338374962], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 23.152000000000005, 15, 72, 24.0, 29.0, 31.0, 50.99000000000001, 0.5547253166649471, 0.9391607955925965, 0.3987088213529307], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 88.0, 88, 88, 88.0, 88.0, 88.0, 88.0, 11.363636363636363, 5.293412642045455, 1549.8268821022727], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 693.0, 693, 693, 693.0, 693.0, 693.0, 693.0, 1.443001443001443, 0.6609059343434344, 2759.661345598846], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 2.5319999999999983, 1, 31, 2.0, 3.0, 4.949999999999989, 10.990000000000009, 0.5519756865749577, 0.46383099104750636, 0.23448185904307287], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 415.42400000000015, 312, 849, 414.0, 482.0, 496.95, 613.8600000000001, 0.5517972034917727, 0.4858057066866785, 0.2564994813106287], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 3.1739999999999986, 1, 18, 3.0, 4.0, 6.0, 11.0, 0.5520415046884884, 0.5001312737446852, 0.2706297220250207], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 1155.7499999999989, 925, 1885, 1152.0, 1336.0, 1373.0, 1533.6600000000003, 0.5514855918874263, 0.5217086012863953, 0.29243816054186766], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 98.0, 98, 98, 98.0, 98.0, 98.0, 98.0, 10.204081632653061, 4.773198341836735, 671.9248246173469], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 2, 0.4, 45.496000000000045, 18, 784, 44.0, 52.0, 55.94999999999999, 105.97000000000003, 0.5506523027177995, 0.2968015911648939, 25.188040878224346], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 49.376000000000005, 11, 199, 51.0, 59.0, 68.0, 98.98000000000002, 0.5514874167116129, 122.91732069627493, 0.17126269386161416], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 372.0, 372, 372, 372.0, 372.0, 372.0, 372.0, 2.688172043010753, 1.4097152217741935, 1.1078209005376345], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 2.382000000000001, 1, 11, 2.0, 3.0, 4.0, 7.0, 0.5549734500701486, 0.6030198429369639, 0.23900712058685114], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 3.540000000000003, 2, 25, 3.0, 5.0, 6.0, 15.990000000000009, 0.5549666742512113, 0.5693481153331742, 0.20540270463008695], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 2.306, 1, 16, 2.0, 3.0, 4.0, 7.990000000000009, 0.5549549709536569, 0.3147461802449349, 0.21623733731495026], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 122.54400000000003, 81, 260, 120.0, 147.0, 153.0, 196.8900000000001, 0.5548903037358545, 0.5054530457373883, 0.18207338091332725], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 8, 1.6, 170.28599999999997, 37, 679, 171.5, 200.80000000000007, 221.74999999999994, 348.95000000000005, 0.5512472520324486, 0.2958722726353147, 163.07013436100522], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 2.412, 1, 23, 2.0, 3.0, 4.0, 9.0, 0.5549629784197097, 0.3094254617430721, 0.233583050487202], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 3.4379999999999993, 2, 19, 3.0, 5.0, 5.0, 11.990000000000009, 0.5550178049711835, 0.29852152969567264, 0.23740019392322106], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 12.175999999999995, 7, 309, 10.0, 15.0, 20.0, 45.97000000000003, 0.5504831590687146, 0.23258558568105225, 0.400498001470891], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 4.798000000000002, 2, 71, 5.0, 6.0, 6.0, 10.0, 0.5549759140453304, 0.2854917502830377, 0.2243750277487957], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 4.047999999999996, 2, 19, 4.0, 5.0, 6.949999999999989, 11.990000000000009, 0.5519683744200192, 0.3389570947392998, 0.2770622504412987], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 4.195999999999995, 2, 31, 4.0, 5.0, 6.0, 12.0, 0.5519519227797182, 0.32328427814623634, 0.26142254155094075], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 530.6019999999997, 374, 1130, 524.5, 638.0, 660.95, 812.5900000000004, 0.5514424079063607, 0.5038966557637312, 0.24394864334138808], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 16.893999999999995, 5, 110, 16.0, 28.900000000000034, 35.0, 54.0, 0.5516030135175835, 0.48842184412746886, 0.22785944796673616], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 12.481999999999998, 7, 46, 13.0, 15.0, 17.0, 23.980000000000018, 0.5520823441858, 0.3679531778273793, 0.25932774175133766], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 550.6480000000003, 434, 3444, 531.5, 604.8000000000001, 651.95, 754.8400000000001, 0.5518465336863679, 0.4147439269978776, 0.30610237415415725], "isController": false}, {"data": ["Query single patient #2", 500, 0, 0.0, 173.11599999999999, 142, 368, 178.0, 190.0, 194.95, 236.85000000000014, 0.5550609345893993, 10.732050049220028, 0.2807827774583094], "isController": false}, {"data": ["Query single patient #1", 500, 0, 0.0, 276.4660000000001, 221, 470, 278.0, 305.0, 317.0, 380.8600000000001, 0.5548859931238528, 1.0755077761723075, 0.39774054585244917], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 23.41399999999999, 14, 52, 25.0, 28.0, 30.0, 40.98000000000002, 0.5543655175778219, 0.4523048768504721, 0.3432302130315811], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 23.059999999999988, 15, 64, 24.0, 28.0, 30.0, 42.960000000000036, 0.5543790400372542, 0.46107228340410905, 0.35190075783614777], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 23.056000000000022, 15, 47, 25.0, 28.0, 29.0, 42.99000000000001, 0.5543421621561693, 0.4486533643025821, 0.3394263043671075], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 25.992000000000015, 17, 62, 28.0, 32.0, 33.0, 45.99000000000001, 0.5543556834762093, 0.49582568437980906, 0.38653316211134126], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 22.645999999999997, 14, 63, 24.0, 28.0, 29.0, 45.99000000000001, 0.5539405112206189, 0.4158708387988797, 0.3067229197871982], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 2202.2619999999997, 1655, 3051, 2174.0, 2509.8, 2609.8, 2838.840000000001, 0.5529652206994788, 0.4620877626999522, 0.353163334313925], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["No results for path: $['rows'][1]", 500, 98.03921568627452, 2.1272069772388855], "isController": false}, {"data": ["500", 10, 1.9607843137254901, 0.042544139544777704], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 23505, 510, "No results for path: $['rows'][1]", 500, "500", 10, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["Query cross patient #1", 500, 500, "No results for path: $['rows'][1]", 500, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 2, "500", 2, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 8, "500", 8, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});

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

    var data = {"OkPercent": 97.83450329717081, "KoPercent": 2.165496702829185};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9000638162093172, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Query cross patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [0.998, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.988, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.996, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [1.0, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [0.986, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.732, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.604, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 23505, 509, 2.165496702829185, 188.12180387151778, 1, 4053, 17.0, 548.9000000000015, 1217.8500000000022, 2215.980000000003, 26.221026351545817, 174.9587315850418, 217.24433296603817], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query cross patient #1", 500, 500, 100.0, 25.16600000000001, 15, 79, 26.0, 29.900000000000034, 32.0, 42.99000000000001, 0.5689881001828728, 0.3304198356933063, 0.2878279647409454], "isController": false}, {"data": ["Query participation #2", 500, 0, 0.0, 7.666000000000004, 4, 47, 7.0, 10.0, 12.949999999999989, 18.980000000000018, 0.5687369830323009, 6.08986899214688, 0.20661148211720304], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 7.9259999999999975, 5, 32, 8.0, 10.0, 11.0, 15.0, 0.5687201635184215, 6.106851579748216, 0.24103960055370593], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 1, 0.2, 22.089999999999982, 14, 260, 20.0, 27.0, 32.94999999999999, 58.98000000000002, 0.5647241661282963, 0.3046477310653634, 6.288071232612142], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 42.681999999999974, 26, 74, 43.0, 53.0, 54.0, 57.0, 0.5685862897925116, 2.3647559318475415, 0.2376513008117138], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 2.6840000000000015, 1, 21, 2.0, 4.0, 4.0, 7.0, 0.5686134474805875, 0.3552867848122211, 0.24154965786528865], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 37.81800000000001, 23, 68, 38.0, 46.0, 48.0, 58.98000000000002, 0.5685759446889321, 2.3335867049886856, 0.2076634797984967], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 770.5260000000005, 593, 1082, 767.0, 912.0, 932.0, 972.96, 0.5682283095889664, 2.40309190247668, 0.27745522929148747], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 11.19399999999999, 6, 33, 11.0, 14.0, 16.0, 25.99000000000001, 0.5681863378458692, 0.8449052915051597, 0.2913064720401185], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 3.5539999999999936, 1, 24, 3.0, 5.0, 6.0, 12.980000000000018, 0.5655360093743249, 0.5455577871056659, 0.3103820676448932], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 17.340000000000014, 10, 42, 18.0, 21.0, 22.0, 26.99000000000001, 0.568553316087216, 0.9264498553742503, 0.3725578858344942], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 652.0, 652, 652, 652.0, 652.0, 652.0, 652.0, 1.5337423312883436, 0.6545365222392637, 1814.0981475268404], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 4.587999999999998, 3, 23, 4.0, 6.0, 7.0, 11.0, 0.5655481632126755, 0.5682135298490665, 0.3330327562668392], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 18.272, 11, 41, 19.0, 22.0, 24.0, 29.0, 0.5685481440882932, 0.893256871543938, 0.33924112894330777], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 10.430000000000001, 7, 20, 11.0, 13.0, 14.949999999999989, 18.0, 0.568545558124118, 0.8799275221675913, 0.3259142994324778], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 1993.6919999999982, 1558, 2897, 1985.0, 2224.8, 2300.7, 2426.75, 0.5671950277415088, 0.8661411492477293, 0.31350818916181056], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 19.094000000000012, 12, 69, 17.0, 24.900000000000034, 31.94999999999999, 49.97000000000003, 0.5646916388367804, 0.3048595897769355, 4.553929251478645], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 21.933999999999994, 14, 40, 23.0, 27.0, 28.94999999999999, 34.99000000000001, 0.568569479190357, 1.029260673115192, 0.4752885490106891], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 17.215999999999976, 11, 46, 18.0, 22.0, 23.0, 27.99000000000001, 0.5685591346984817, 0.9625495161703903, 0.40865187806453374], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 85.0, 85, 85, 85.0, 85.0, 85.0, 85.0, 11.76470588235294, 5.480238970588235, 1604.5266544117646], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 632.0, 632, 632, 632.0, 632.0, 632.0, 632.0, 1.5822784810126582, 0.7246959058544303, 3026.0210640822784], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 2.5320000000000005, 1, 33, 2.0, 3.0, 5.0, 9.990000000000009, 0.5654854805948003, 0.4752154428995381, 0.24022088286986143], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 415.65399999999977, 322, 538, 420.5, 482.0, 490.0, 511.99, 0.5652598103666389, 0.49765826992060364, 0.2627574899751173], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 3.1820000000000013, 2, 13, 3.0, 4.0, 5.0, 9.0, 0.5655264146077734, 0.5123481543904078, 0.2772404884112327], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 1169.7879999999989, 941, 1431, 1163.0, 1338.9, 1369.0, 1414.96, 0.5649296210678073, 0.5343947336978259, 0.29956717210919864], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 69.0, 69, 69, 69.0, 69.0, 69.0, 69.0, 14.492753623188406, 6.77932518115942, 954.3280117753623], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 1, 0.2, 46.04799999999998, 11, 750, 43.0, 53.0, 59.94999999999999, 96.95000000000005, 0.5642226422546337, 0.30431326170056705, 25.80877789375688], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 44.19000000000004, 11, 215, 45.0, 55.0, 60.94999999999999, 87.96000000000004, 0.5650585852741211, 126.18311679640883, 0.17547717784879935], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 288.0, 288, 288, 288.0, 288.0, 288.0, 288.0, 3.472222222222222, 1.8208821614583335, 1.4309353298611112], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 2.485999999999997, 1, 25, 2.0, 4.0, 5.0, 7.990000000000009, 0.5687544505035752, 0.6179939227165078, 0.24494210221882484], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 3.525999999999997, 2, 20, 3.0, 5.0, 7.0, 15.970000000000027, 0.5687473339968719, 0.5835503163657045, 0.21050316365704536], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 2.4139999999999997, 1, 15, 2.0, 3.0, 4.949999999999989, 8.980000000000018, 0.5687505687505688, 0.32257043975793975, 0.22161277044089545], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 124.96599999999997, 82, 190, 125.0, 151.0, 155.95, 165.98000000000002, 0.5686852338604287, 0.5180511444932503, 0.18659984236045318], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 7, 1.4, 168.3040000000001, 29, 425, 171.5, 202.0, 222.95, 338.63000000000034, 0.5648077337993374, 0.3033800759977046, 167.0816003149368], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 2.399999999999999, 1, 29, 2.0, 3.0, 4.0, 7.0, 0.5687440992799699, 0.3170448429839728, 0.23938350272428424], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 3.5160000000000022, 1, 15, 3.0, 5.0, 6.0, 10.980000000000018, 0.5687919768478913, 0.3059300971724213, 0.24329188072204727], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 12.818000000000014, 7, 329, 10.0, 17.0, 25.0, 47.97000000000003, 0.5640386975669627, 0.23831295955052884, 0.410360185241589], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 4.81, 2, 56, 5.0, 6.0, 7.0, 10.0, 0.5687570383683498, 0.2925488473427671, 0.22994669324657893], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 4.098000000000004, 2, 22, 4.0, 5.900000000000034, 6.949999999999989, 12.980000000000018, 0.5654746084936548, 0.3472190806966195, 0.28384174684154156], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 4.190000000000001, 2, 40, 4.0, 5.0, 6.0, 11.980000000000018, 0.5654515866006069, 0.33122320642997616, 0.2678164252942327], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 524.2319999999999, 388, 817, 516.0, 639.0, 653.95, 683.98, 0.5649315359471586, 0.51619074362503, 0.24991600174224887], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 17.55800000000001, 6, 168, 16.0, 28.0, 36.94999999999999, 55.99000000000001, 0.5651908027631048, 0.500421261432397, 0.23347237262577472], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 9.557999999999996, 5, 48, 10.0, 12.0, 13.0, 25.980000000000018, 0.5655571190067913, 0.3769979454016813, 0.26565720140846344], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 552.0500000000001, 448, 4053, 533.0, 603.9000000000001, 650.0, 745.94, 0.5652521420229922, 0.4248190009648854, 0.3135382975283785], "isController": false}, {"data": ["Query single patient #2", 500, 0, 0.0, 175.30800000000016, 143, 248, 182.0, 192.0, 198.0, 232.0, 0.5688489228276797, 10.998607262295101, 0.2877575605710333], "isController": false}, {"data": ["Query single patient #1", 500, 0, 0.0, 259.62800000000004, 208, 430, 265.0, 286.0, 292.0, 323.9000000000001, 0.5686600095534882, 1.102237472775402, 0.40761371778541045], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 17.981999999999992, 11, 45, 19.0, 22.0, 23.94999999999999, 34.950000000000045, 0.5681443723027345, 0.4636113560839172, 0.3517612617577478], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 17.142000000000014, 11, 48, 18.0, 21.0, 23.0, 30.980000000000018, 0.5681598665506105, 0.4725014974563483, 0.3606483527909149], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 17.197999999999997, 11, 45, 18.0, 21.0, 23.0, 31.99000000000001, 0.56812500568125, 0.45984060152223416, 0.34786560406459355], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 20.491999999999997, 13, 44, 21.0, 25.0, 26.0, 32.0, 0.5681288788999207, 0.5081124986791004, 0.3961367378267025], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 16.873999999999988, 10, 44, 18.0, 21.0, 23.0, 30.0, 0.5678404686273819, 0.42627406898296366, 0.314419478234107], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 2163.3380000000016, 1704, 2793, 2137.0, 2465.9, 2560.75, 2689.91, 0.5667649059170257, 0.47358742702901835, 0.3619768051462253], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["No results for path: $['rows'][1]", 500, 98.23182711198429, 2.1272069772388855], "isController": false}, {"data": ["500", 9, 1.768172888015717, 0.03828972559029994], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 23505, 509, "No results for path: $['rows'][1]", 500, "500", 9, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["Query cross patient #1", 500, 500, "No results for path: $['rows'][1]", 500, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 1, "500", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 1, "500", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 7, "500", 7, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});

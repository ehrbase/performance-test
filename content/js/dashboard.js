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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9151329243353783, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.003, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.989, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [1.0, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [0.852, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.706, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.719, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 22005, 0, 0.0, 193.3588275391954, 1, 3875, 14.0, 583.9000000000015, 1283.9500000000007, 2166.9900000000016, 25.424257549288747, 170.93363613820492, 223.95807382292216], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query participation #2", 500, 0, 0.0, 6.873999999999996, 4, 50, 6.0, 9.0, 11.949999999999989, 18.980000000000018, 0.5886487332867909, 6.2932263620007225, 0.21269534308214122], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 7.261999999999998, 5, 32, 7.0, 9.0, 10.0, 16.99000000000001, 0.5886307154570894, 6.320215366734595, 0.2483285830834596], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 0, 0.0, 20.46600000000001, 12, 256, 19.0, 26.0, 31.94999999999999, 41.99000000000001, 0.584564914180025, 0.3150256857823291, 6.507851583644809], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 41.084, 26, 75, 42.0, 51.0, 53.0, 57.99000000000001, 0.5884381322032183, 2.447419926810065, 0.24479945734235448], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 2.3400000000000003, 1, 26, 2.0, 3.0, 4.0, 7.990000000000009, 0.588481071506335, 0.36780066969145936, 0.24884014058812798], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 36.13800000000002, 22, 59, 37.0, 45.0, 46.0, 49.0, 0.5884312070960097, 2.4145447101799777, 0.21376602445284726], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 742.0260000000001, 569, 986, 734.0, 889.9000000000001, 909.95, 932.98, 0.5881031438817865, 2.4873776524922047, 0.28601109927063445], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 9.628, 6, 21, 10.0, 12.0, 13.949999999999989, 17.99000000000001, 0.5882754352649946, 0.8749448124107292, 0.30045708265975796], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 3.2880000000000007, 1, 46, 3.0, 4.900000000000034, 6.0, 10.990000000000009, 0.5855507163041912, 0.564964948934122, 0.3202230479788546], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 15.534, 10, 34, 16.0, 19.0, 21.0, 24.99000000000001, 0.5884201272635051, 0.9590558519558497, 0.38442682142508294], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 620.0, 620, 620, 620.0, 620.0, 620.0, 620.0, 1.6129032258064515, 0.6883190524193549, 1907.7258694556451], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 4.124000000000008, 2, 20, 4.0, 5.0, 6.0, 11.990000000000009, 0.5855616883383047, 0.5877575446695734, 0.34367438934699335], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 16.520000000000003, 10, 40, 17.0, 20.0, 21.0, 29.0, 0.5884132025800742, 0.9239006676136196, 0.34994496130006364], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 9.549999999999999, 6, 25, 10.0, 12.0, 13.0, 17.0, 0.5884111252068265, 0.9107730795437696, 0.33615284008397806], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 1867.7579999999998, 1463, 2271, 1856.5, 2135.0, 2187.8, 2249.99, 0.5872756166687613, 0.8969717426464283, 0.32346039824334116], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 17.527999999999984, 11, 183, 16.0, 22.0, 28.0, 44.99000000000001, 0.5845252777956383, 0.3156664830283086, 4.712735052227334], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 19.81200000000002, 13, 42, 20.0, 24.0, 25.0, 32.0, 0.5884339771193332, 1.0653872984172303, 0.4907447426366314], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 15.426, 10, 29, 16.0, 19.0, 21.0, 25.0, 0.588427052109923, 0.9964184651939515, 0.4217826721178549], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 84.0, 84, 84, 84.0, 84.0, 84.0, 84.0, 11.904761904761903, 5.545479910714286, 1623.6049107142856], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 608.0, 608, 608, 608.0, 608.0, 608.0, 608.0, 1.644736842105263, 0.7533023231907895, 3145.4660516036183], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 2.1479999999999984, 1, 37, 2.0, 3.0, 3.0, 9.0, 0.5854698102492345, 0.49227490881307706, 0.24756682406046732], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 405.50399999999973, 308, 607, 410.0, 470.80000000000007, 483.95, 511.93000000000006, 0.5852559968255714, 0.514865246269871, 0.2709095141555868], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 3.048, 1, 28, 3.0, 4.0, 5.949999999999989, 11.0, 0.5855157456894331, 0.5306236445310487, 0.2858963601999185], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 1149.4479999999985, 918, 1461, 1147.5, 1335.7, 1355.95, 1407.92, 0.5848945142743506, 0.5534792815740681, 0.30901165256096064], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 62.0, 62, 62, 62.0, 62.0, 62.0, 62.0, 16.129032258064516, 7.544732862903226, 1062.043220766129], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 0, 0.0, 41.144000000000055, 27, 597, 40.0, 48.0, 54.94999999999999, 81.91000000000008, 0.5841251149266165, 0.3154503794476747, 26.718019661067242], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 43.10999999999999, 30, 188, 44.0, 50.0, 56.0, 76.98000000000002, 0.5849088828942227, 132.36248115862261, 0.18049922558063905], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 280.0, 280, 280, 280.0, 280.0, 280.0, 280.0, 3.571428571428571, 1.8729073660714284, 1.4648437499999998], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 2.008000000000001, 1, 7, 2.0, 3.0, 4.0, 6.0, 0.5886896239921634, 0.6398550307649197, 0.2523776805982028], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 3.065999999999997, 1, 17, 3.0, 4.0, 5.0, 12.970000000000027, 0.5886785344259207, 0.6042003317203541, 0.21673028074079306], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 1.952000000000001, 1, 10, 2.0, 3.0, 3.0, 6.990000000000009, 0.5886653661086512, 0.33399861104406864, 0.2282228030714204], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 116.8899999999999, 85, 185, 116.0, 142.0, 147.0, 152.0, 0.5885932973349673, 0.5362866664194575, 0.1919825794041788], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 0, 0.0, 163.4479999999999, 112, 631, 165.0, 189.0, 207.89999999999998, 310.9200000000001, 0.5846606103622908, 0.3157395679007293, 172.953342548559], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 2.1320000000000006, 1, 9, 2.0, 3.0, 4.0, 6.0, 0.5886736828720683, 0.32758770649201113, 0.24662208003136454], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 449.58000000000015, 347, 592, 451.0, 523.9000000000001, 534.0, 550.95, 0.5884561382448237, 0.6395093055511422, 0.25285224690207264], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 11.289999999999992, 6, 333, 9.0, 14.0, 18.94999999999999, 41.90000000000009, 0.5839245569472424, 0.24691341128726169, 0.42368744708183703], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 2.7760000000000007, 1, 27, 3.0, 3.0, 5.0, 9.0, 0.5886930895672988, 0.6266361988558161, 0.2391565676367151], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 3.461999999999998, 2, 13, 3.0, 4.0, 6.0, 10.0, 0.585461583767258, 0.35962435174766133, 0.29273079188362894], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 3.905999999999998, 2, 23, 4.0, 5.0, 6.0, 13.990000000000009, 0.5854471879800668, 0.34303546170707033, 0.2761435466741916], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 523.3459999999997, 372, 885, 531.5, 626.0, 638.0, 683.8100000000002, 0.5848425194547864, 0.5339200985225708, 0.2575820080801842], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 15.671999999999981, 6, 118, 15.0, 23.0, 31.94999999999999, 51.950000000000045, 0.5850300178902179, 0.5181857677992457, 0.2405250366521306], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 8.278, 5, 38, 8.0, 10.0, 11.0, 14.0, 0.5855726607836133, 0.3905723899562577, 0.27391533644077226], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 521.3379999999997, 344, 3875, 506.0, 576.8000000000001, 612.75, 715.9000000000001, 0.5853635693129002, 0.44016596520598944, 0.3235505666319351], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 15.655999999999993, 10, 34, 16.0, 19.0, 20.0, 24.99000000000001, 0.5882463669904374, 0.4802480105507868, 0.36305830462691063], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 15.108000000000008, 10, 27, 16.0, 19.0, 20.0, 24.0, 0.5882629770812744, 0.4887867884959292, 0.37226016518424393], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 15.321999999999987, 10, 29, 16.0, 19.0, 20.0, 24.99000000000001, 0.5882242216617098, 0.4762088669507398, 0.359023572791571], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 17.911999999999995, 12, 30, 19.0, 22.0, 23.0, 28.99000000000001, 0.588235294117647, 0.5261948529411765, 0.40900735294117646], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 15.363999999999994, 10, 46, 16.0, 19.0, 20.0, 27.99000000000001, 0.5880187648548241, 0.4415883107161716, 0.3244439474052496], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 2118.1480000000006, 1631, 2849, 2089.0, 2452.8, 2546.9, 2697.84, 0.5868902796884317, 0.48993875653208885, 0.37368404527036864], "isController": false}]}, function(index, item){
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

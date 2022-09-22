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

    var data = {"OkPercent": 97.800467985535, "KoPercent": 2.1995320144650075};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.900659434162944, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Query cross patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.993, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.987, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [1.0, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [0.977, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.713, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.662, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 23505, 517, 2.1995320144650075, 186.47228249308753, 1, 3260, 17.0, 541.0, 1191.0, 2194.0, 26.315612698668602, 174.62362137446596, 218.0279921414225], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query cross patient #1", 500, 500, 100.0, 27.406000000000002, 17, 74, 29.0, 32.0, 34.0, 48.0, 0.5701845915596715, 0.33111465599623224, 0.2884332211210057], "isController": false}, {"data": ["Query participation #2", 500, 0, 0.0, 7.658000000000003, 5, 34, 7.0, 10.0, 12.949999999999989, 19.99000000000001, 0.5699252713984142, 6.09292525579671, 0.20704316500020517], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 7.98, 5, 51, 8.0, 10.0, 11.0, 16.99000000000001, 0.5698960395644627, 6.119542559764998, 0.24153796989353205], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 0, 0.0, 21.593999999999994, 14, 247, 20.0, 26.0, 30.94999999999999, 55.97000000000003, 0.5664380900160755, 0.3058666116891297, 6.307155373401653], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 44.87000000000002, 27, 97, 46.0, 55.0, 57.0, 76.91000000000008, 0.5696467164993614, 2.36916625687706, 0.23809452603684247], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 2.5999999999999983, 1, 19, 2.0, 3.0, 4.0, 7.0, 0.5696830625249948, 0.3560196468734084, 0.2420040353499734], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 39.907999999999994, 24, 95, 41.0, 49.0, 50.0, 55.0, 0.5696460675053376, 2.337914243060002, 0.20805432543651978], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 772.8359999999999, 582, 1067, 781.0, 920.9000000000001, 933.9, 987.94, 0.5693100872638501, 2.4076668437932676, 0.27798344104680184], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 12.424000000000005, 8, 35, 13.0, 15.0, 17.0, 22.0, 0.5695331650552675, 0.8469080525012758, 0.29199698403712443], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 3.484, 2, 30, 3.0, 5.0, 6.0, 11.990000000000009, 0.5672844772813912, 0.5472123569875832, 0.31134167600795104], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 20.13200000000002, 13, 42, 21.0, 25.0, 26.0, 35.0, 0.5696207578918108, 0.9281892372009063, 0.37325735209512206], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 611.0, 611, 611, 611.0, 611.0, 611.0, 611.0, 1.6366612111292964, 0.6984579582651391, 1935.829774447627], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 4.339999999999996, 2, 21, 4.0, 6.0, 7.0, 10.990000000000009, 0.5672941317960418, 0.5700319907797685, 0.3340608998759895], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 20.751999999999985, 14, 73, 22.0, 25.0, 27.94999999999999, 35.98000000000002, 0.5696038860655523, 0.8949800934121893, 0.33987106873637934], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 11.62200000000001, 8, 38, 12.0, 14.0, 16.0, 19.99000000000001, 0.5696051838628573, 0.8815352226757545, 0.326521721608884], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 1930.6640000000007, 1514, 2396, 1922.0, 2158.9, 2234.25, 2300.95, 0.5685675395694578, 0.8682048538895136, 0.3142668236292121], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 18.316000000000006, 12, 99, 17.0, 23.0, 28.94999999999999, 47.98000000000002, 0.5663950990964866, 0.30574715443102213, 4.5676667268933455], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 24.697999999999997, 16, 58, 26.0, 30.0, 31.0, 42.98000000000002, 0.5696408756063827, 1.0312324479405204, 0.47618416945221054], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 20.247999999999994, 13, 67, 21.0, 25.0, 26.0, 32.99000000000001, 0.5696311410509239, 0.9643966474074378, 0.4094223826303516], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 95.0, 95, 95, 95.0, 95.0, 95.0, 95.0, 10.526315789473683, 4.903371710526316, 1435.6291118421052], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 666.0, 666, 666, 666.0, 666.0, 666.0, 666.0, 1.5015015015015014, 0.6876994181681682, 2871.539508258258], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 2.3039999999999994, 1, 20, 2.0, 3.0, 4.0, 8.990000000000009, 0.5672066095451798, 0.476565442384287, 0.24095202651577458], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 414.8620000000002, 319, 563, 424.5, 476.90000000000003, 489.0, 503.98, 0.5670136412141803, 0.49920235356022197, 0.26357274728315416], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 3.1840000000000015, 1, 32, 3.0, 4.0, 6.0, 15.990000000000009, 0.567246506045146, 0.5139065001202563, 0.27808373636197586], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 1151.3419999999996, 926, 1469, 1141.5, 1318.8000000000002, 1352.95, 1399.8600000000001, 0.5666582801241208, 0.5359978615024831, 0.3004838340892555], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 61.0, 61, 61, 61.0, 61.0, 61.0, 61.0, 16.393442622950822, 7.668417008196721, 1079.4857838114754], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 6, 1.2, 44.55800000000001, 9, 670, 44.0, 52.0, 59.0, 96.97000000000003, 0.5659725956069207, 0.30413952356426904, 25.888824588113444], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 45.45799999999998, 10, 189, 46.0, 54.900000000000034, 63.0, 90.95000000000005, 0.5667706879802673, 125.59848660005316, 0.17600886599387208], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 305.0, 305, 305, 305.0, 305.0, 305.0, 305.0, 3.278688524590164, 1.719390368852459, 1.3511782786885247], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 2.3459999999999974, 1, 34, 2.0, 3.0, 4.0, 9.0, 0.569980495267452, 0.6193583953994595, 0.2454701156376429], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 3.2239999999999998, 2, 23, 3.0, 4.0, 6.0, 11.980000000000018, 0.5699733480462453, 0.5848082403041833, 0.21095693252883493], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 2.270000000000001, 1, 21, 2.0, 3.0, 4.0, 9.990000000000009, 0.5699395636086749, 0.3232125038898375, 0.22207606042955205], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 122.79799999999997, 86, 233, 122.0, 149.0, 153.0, 171.99, 0.5698752543068323, 0.5191352089590089, 0.18699031781942932], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 11, 2.2, 170.118, 39, 572, 173.0, 204.90000000000003, 216.0, 341.83000000000015, 0.5665170306349749, 0.3033776152550573, 167.58724503901036], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 2.3679999999999994, 1, 20, 2.0, 3.0, 4.0, 9.990000000000009, 0.5699694496374995, 0.31779247804192695, 0.23989925077515845], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 3.346, 2, 21, 3.0, 5.0, 5.0, 8.0, 0.5700207829577467, 0.30655873572525455, 0.24381748333544243], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 11.266000000000007, 7, 312, 10.0, 13.0, 17.94999999999999, 44.87000000000012, 0.5657900692527045, 0.23908498131478295, 0.41163437655592267], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 4.504, 2, 62, 4.0, 5.0, 6.0, 9.990000000000009, 0.569983094301423, 0.2932117720888398, 0.23044238382889562], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 3.655999999999998, 2, 29, 3.0, 5.0, 6.0, 10.990000000000009, 0.5671969580092748, 0.34837303629323174, 0.2847062855632493], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 3.9740000000000055, 2, 30, 4.0, 5.0, 6.0, 9.990000000000009, 0.5671789426877022, 0.3322029102518728, 0.2686345578159527], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 527.9739999999998, 377, 724, 529.0, 638.0, 647.0, 690.96, 0.5667147996436498, 0.5177238548252365, 0.25070488695173176], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 15.254000000000001, 5, 107, 14.0, 25.900000000000034, 31.0, 50.97000000000003, 0.5668876394685315, 0.501955753498547, 0.23417331200702032], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 10.814000000000012, 6, 49, 11.0, 13.0, 14.0, 19.980000000000018, 0.5673012119823093, 0.3780641533993823, 0.26647644820653393], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 527.7220000000001, 361, 3260, 514.0, 576.9000000000001, 603.0, 647.99, 0.5671004607124143, 0.42620811714991186, 0.3145635368014173], "isController": false}, {"data": ["Query single patient #2", 500, 0, 0.0, 173.63199999999998, 143, 304, 178.0, 191.0, 196.0, 221.94000000000005, 0.5700591265326039, 11.022038655068053, 0.288369753460829], "isController": false}, {"data": ["Query single patient #1", 500, 0, 0.0, 267.7219999999998, 216, 405, 271.0, 294.0, 300.0, 330.95000000000005, 0.5698843476704838, 1.1046428940835746, 0.40849131952161627], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 20.554000000000006, 13, 43, 22.0, 24.0, 26.0, 35.960000000000036, 0.5695098115150328, 0.46466105303218413, 0.3526066606450496], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 20.13399999999999, 13, 43, 22.0, 24.0, 26.0, 33.98000000000002, 0.5695227854676009, 0.4736349482104455, 0.36151348686908263], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 20.167999999999996, 13, 87, 22.0, 24.0, 26.0, 31.99000000000001, 0.569479973667246, 0.4609050574377501, 0.3486952573138313], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 22.836000000000034, 15, 55, 24.0, 28.0, 29.0, 37.98000000000002, 0.5694838653831259, 0.5093888580339366, 0.39708152332378116], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 19.655999999999995, 13, 51, 21.0, 24.0, 26.0, 33.99000000000001, 0.5691934301417519, 0.4272897282072911, 0.3151686278226302], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 2153.0100000000016, 1674, 2651, 2149.0, 2434.3, 2509.8, 2619.99, 0.5681443723027345, 0.4747401059077924, 0.3628578315292856], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["No results for path: $['rows'][1]", 500, 96.71179883945841, 2.1272069772388855], "isController": false}, {"data": ["500", 17, 3.288201160541586, 0.0723250372261221], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 23505, 517, "No results for path: $['rows'][1]", 500, "500", 17, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["Query cross patient #1", 500, 500, "No results for path: $['rows'][1]", 500, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 6, "500", 6, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 11, "500", 11, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});

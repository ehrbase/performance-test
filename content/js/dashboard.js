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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8716868751329504, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Query cross patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.479, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [0.5, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [0.997, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [0.827, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [0.835, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [0.839, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.495, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 23505, 500, 2.1272069772388855, 481.123590725377, 1, 22757, 12.0, 1016.0, 1790.9500000000007, 10351.88000000002, 10.314856553060622, 69.52734958172829, 85.45981768474586], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query cross patient #1", 500, 500, 100.0, 10911.067999999997, 9025, 22757, 10438.5, 12598.2, 13196.55, 19432.270000000044, 0.22192819202647515, 0.1289524162653835, 0.11226445651339269], "isController": false}, {"data": ["Query participation #2", 500, 0, 0.0, 7.586000000000003, 5, 19, 7.0, 9.0, 10.0, 13.980000000000018, 0.22276934373042415, 2.3786087902722417, 0.08092792565206813], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 9.015999999999993, 6, 35, 9.0, 10.0, 12.0, 19.0, 0.22276646544914397, 2.3920027827429946, 0.09441469336418797], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 0, 0.0, 16.238000000000007, 10, 423, 14.0, 19.0, 21.0, 38.98000000000002, 0.22159692494379196, 0.13021199776164946, 2.4674298224698394], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 44.46999999999999, 28, 84, 46.0, 56.0, 58.0, 74.95000000000005, 0.22272855847849668, 0.9263050188261314, 0.09309357717655915], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 2.676, 1, 18, 2.0, 3.0, 4.0, 7.990000000000009, 0.22273609915142, 0.1391469824103075, 0.09461933899498798], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 38.946000000000005, 24, 76, 39.0, 49.0, 51.0, 62.99000000000001, 0.22272558203762724, 0.9141123348489809, 0.08134703875202402], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 1106.3500000000006, 763, 1672, 1098.0, 1395.9, 1488.85, 1547.93, 0.22265694754246848, 0.9417258201234677, 0.10871921266722094], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 6.543999999999998, 4, 33, 6.0, 8.0, 9.0, 13.990000000000009, 0.22265357641760192, 0.3310906517059049, 0.11415344494066504], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 4.143999999999999, 2, 21, 4.0, 5.0, 5.0, 13.980000000000018, 0.2217577137311933, 0.21389874163030947, 0.12170687023137755], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 9.870000000000013, 6, 26, 10.0, 12.0, 13.0, 20.0, 0.22272260567630833, 0.36301174694702987, 0.14594420743047157], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 523.0, 523, 523, 523.0, 523.0, 523.0, 523.0, 1.9120458891013383, 0.9074749043977055, 2261.552566324092], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 4.491999999999998, 3, 28, 4.0, 6.0, 6.0, 13.990000000000009, 0.22175958245331737, 0.22277958990776575, 0.13058694162045936], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 15.136000000000012, 7, 33, 16.0, 19.0, 19.0, 24.99000000000001, 0.22272201041359033, 0.34989758337153015, 0.13289369957295283], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 7.415999999999998, 4, 21, 7.0, 9.0, 10.0, 15.0, 0.2227218119933914, 0.3446772291836399, 0.1276735387110554], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 2175.1640000000007, 1583, 3365, 2188.5, 2711.9, 2982.0499999999997, 3249.98, 0.22249059532253573, 0.3397566101677757, 0.1229782001489797], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 14.245999999999992, 9, 94, 13.0, 18.0, 23.94999999999999, 35.99000000000001, 0.22159054145205623, 0.13020824677452805, 1.7870065344834767], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 14.38000000000001, 9, 42, 14.0, 17.0, 18.0, 32.940000000000055, 0.2227247883334974, 0.4031905931461792, 0.186184002747533], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 9.835999999999999, 6, 30, 10.0, 12.0, 13.949999999999989, 20.99000000000001, 0.2227239946350244, 0.37702561209008206, 0.1600828711439238], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 67.0, 67, 67, 67.0, 67.0, 67.0, 67.0, 14.925373134328359, 7.666744402985074, 2035.5935167910447], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 651.0, 651, 651, 651.0, 651.0, 651.0, 651.0, 1.5360983102918586, 0.7770497311827956, 2937.7040130568357], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 2.663999999999999, 2, 16, 2.0, 3.0, 4.0, 9.0, 0.22174069997330242, 0.1864440846455209, 0.09419648875818999], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 685.5039999999998, 519, 939, 657.0, 833.9000000000001, 852.0, 896.99, 0.22168367867216796, 0.1951465836217438, 0.10304827250776559], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 3.5080000000000005, 2, 13, 3.0, 4.0, 5.0, 8.990000000000009, 0.2217601725826367, 0.20090735322913858, 0.10871445960594103], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 928.0699999999997, 749, 1376, 878.0, 1138.8000000000002, 1169.0, 1224.94, 0.2216776833086015, 0.20970838730261265, 0.11754978714508849], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 78.0, 78, 78, 78.0, 78.0, 78.0, 78.0, 12.82051282051282, 6.610576923076923, 844.2132411858975], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 0, 0.0, 29.384000000000004, 20, 520, 27.0, 33.0, 40.94999999999999, 77.97000000000003, 0.22154046835427332, 0.13017882345063458, 10.133745642298988], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 36.51199999999997, 26, 233, 35.0, 42.0, 49.94999999999999, 100.95000000000005, 0.22165979742954434, 50.16057745729835, 0.06883575740487803], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 968.0, 968, 968, 968.0, 968.0, 968.0, 968.0, 1.0330578512396695, 0.5417500645661157, 0.42573282541322316], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 2.8899999999999997, 2, 12, 3.0, 4.0, 4.0, 7.0, 0.22273619837420394, 0.2419689470658515, 0.09592447605764057], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 3.6559999999999993, 2, 11, 3.0, 5.0, 5.0, 7.990000000000009, 0.2227352061503427, 0.22860810709375992, 0.08243812805759754], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 2.2099999999999995, 1, 13, 2.0, 3.0, 3.9499999999999886, 6.990000000000009, 0.22277103103334125, 0.12633336467907383, 0.08680238416240543], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 194.8420000000001, 90, 396, 190.0, 271.90000000000003, 291.79999999999995, 323.94000000000005, 0.2227526705817676, 0.20289418298664108, 0.0730907200346425], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 0, 0.0, 113.72000000000004, 83, 445, 110.0, 130.0, 140.0, 373.5700000000004, 0.22162668668989904, 0.13029225135480393, 65.56167571494554], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 254.45, 16, 538, 307.0, 424.0, 438.95, 468.8800000000001, 0.22273222953179903, 0.1241362409336846, 0.09374764739082557], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 496.1520000000004, 300, 991, 457.0, 817.0, 899.95, 931.0, 0.22274512878677857, 0.11979293933024104, 0.09527574844590725], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 7.965999999999988, 5, 272, 7.0, 10.0, 12.0, 27.99000000000001, 0.22151573470566763, 0.1042054146143234, 0.16116134995676012], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 502.38799999999895, 290, 1022, 454.0, 862.3000000000002, 896.0, 951.97, 0.2227063363070568, 0.11455239687137685, 0.09003947581164211], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 3.876000000000002, 2, 14, 4.0, 5.0, 6.0, 11.990000000000009, 0.2217396182619428, 0.13614249550533794, 0.11130289432288926], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 4.296000000000006, 3, 29, 4.0, 5.0, 6.0, 10.990000000000009, 0.22173715986628362, 0.1298613204525478, 0.10502199466323003], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 848.9679999999998, 555, 1324, 842.5, 1159.6000000000001, 1253.0, 1294.0, 0.2216517398996627, 0.20254077103663415, 0.09805492009233124], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 461.86600000000027, 238, 975, 379.0, 855.8000000000001, 877.95, 910.97, 0.22165478597013866, 0.19626622166697696, 0.09156247506383657], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 5.3740000000000006, 3, 35, 5.0, 6.0, 7.0, 12.990000000000009, 0.22176076271509684, 0.1479126962250109, 0.10416692076754062], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 1185.982, 899, 9205, 1135.0, 1408.0, 1418.0, 1510.8700000000001, 0.22167375209869625, 0.1665627132224403, 0.12295965936724558], "isController": false}, {"data": ["Query single patient #2", 500, 0, 0.0, 164.7780000000001, 142, 234, 160.0, 185.0, 186.0, 197.95000000000005, 0.22280299536346967, 4.30787459240977, 0.11270698398269265], "isController": false}, {"data": ["Query single patient #1", 500, 0, 0.0, 224.91400000000004, 193, 316, 217.0, 252.90000000000003, 256.0, 276.99, 0.22278641644484568, 0.4318031529123531, 0.15969260710011396], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 8.798000000000009, 6, 22, 9.0, 11.0, 12.0, 16.99000000000001, 0.22265159345065885, 0.18177415246557693, 0.13785264672628683], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 8.65199999999999, 6, 25, 9.0, 10.900000000000034, 11.949999999999989, 16.0, 0.22265238663319756, 0.18512763186253622, 0.1413320813589633], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 9.606000000000002, 6, 22, 10.0, 12.0, 13.0, 16.99000000000001, 0.2226496105190363, 0.1801874597004205, 0.13632940019085524], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 11.869999999999994, 8, 46, 12.0, 14.0, 16.0, 21.0, 0.22265020539481448, 0.19910451131063042, 0.1552463346209937], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 9.017999999999994, 6, 28, 9.0, 11.0, 12.0, 20.980000000000018, 0.22258141917022536, 0.1670903932913515, 0.12324576627882596], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 2003.5539999999999, 1591, 2912, 1938.0, 2520.1000000000004, 2573.9, 2647.9700000000003, 0.22241587230837873, 0.185862779387698, 0.1420507621969528], "isController": false}]}, function(index, item){
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

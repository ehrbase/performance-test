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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8864071474154436, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Query cross patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.16, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.541, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [1.0, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [0.881, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [0.983, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.497, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.1, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 23505, 500, 2.1272069772388855, 327.6709210806232, 1, 18319, 10.0, 851.0, 1518.9500000000007, 6062.980000000003, 15.099326006685972, 95.11455722294455, 124.94821124498296], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query cross patient #1", 500, 500, 100.0, 6180.695999999999, 4951, 18319, 6039.5, 6519.7, 6641.85, 15090.170000000071, 0.32553376143193186, 0.1890607258410002, 0.16403849697155942], "isController": false}, {"data": ["Query participation #2", 500, 0, 0.0, 2.551999999999998, 1, 19, 2.0, 3.0, 4.0, 7.0, 0.3265679342945316, 0.16765627806443184, 0.1179981793837663], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 3.8499999999999974, 2, 27, 4.0, 5.0, 5.0, 7.990000000000009, 0.32656558808584235, 0.1874275993886039, 0.13776985747371473], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 0, 0.0, 13.713999999999986, 8, 397, 12.0, 15.0, 18.0, 57.92000000000007, 0.3246508704539139, 0.16889137226514106, 3.5721107005900854], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 34.36200000000004, 24, 68, 34.0, 41.0, 42.0, 46.98000000000002, 0.3265020399847458, 1.357888186233825, 0.13582995022802902], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 2.4239999999999964, 1, 9, 2.0, 3.0, 4.0, 7.0, 0.3265109949312433, 0.20397690289791567, 0.1380656843801058], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 30.208000000000002, 21, 49, 31.0, 36.0, 37.0, 39.0, 0.3265058777588114, 1.3400483569489594, 0.11861346340456821], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 871.8620000000001, 688, 1092, 880.5, 1010.9000000000001, 1051.85, 1085.0, 0.326352863158939, 1.38021446094829, 0.15871457602846842], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 5.904000000000003, 4, 14, 6.0, 8.0, 9.0, 12.0, 0.3264655856302908, 0.4854613397413087, 0.16673974734828328], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 4.056, 2, 25, 4.0, 5.0, 6.0, 9.990000000000009, 0.32488206780938517, 0.3133684249961014, 0.17766988083325752], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 8.175999999999998, 6, 19, 8.0, 10.0, 11.0, 14.0, 0.3265067306097448, 0.5320752406599485, 0.21331347927531177], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 495.0, 495, 495, 495.0, 495.0, 495.0, 495.0, 2.0202020202020203, 0.8739741161616161, 2389.4748263888887], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 4.354000000000002, 2, 21, 4.0, 5.0, 7.0, 11.980000000000018, 0.32488671200352437, 0.3263810639698687, 0.190680579994256], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 8.424000000000007, 6, 29, 8.0, 10.0, 11.949999999999989, 16.0, 0.3265060909711271, 0.5129429820372674, 0.19418184511857067], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 6.823999999999997, 4, 26, 7.0, 8.0, 9.0, 12.0, 0.3265056645467742, 0.5052898356092955, 0.18652911499986613], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 1581.4499999999998, 1320, 1998, 1560.5, 1777.8000000000002, 1830.95, 1924.95, 0.32616934973573763, 0.49808034558131864, 0.17964796215913673], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 11.922000000000002, 8, 65, 11.0, 14.0, 17.0, 37.0, 0.3246392770672867, 0.1688853411001116, 2.6174041713549987], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 11.54599999999999, 8, 24, 11.0, 14.0, 15.949999999999989, 19.99000000000001, 0.32650864954063497, 0.5910667468163774, 0.2723031120192405], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 8.226, 5, 22, 8.0, 10.0, 11.0, 14.0, 0.32650864954063497, 0.5528040144483343, 0.23404037965119734], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 71.0, 71, 71, 71.0, 71.0, 71.0, 71.0, 14.084507042253522, 6.643375880281691, 1920.8846830985917], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 545.0, 545, 545, 545.0, 545.0, 545.0, 545.0, 1.834862385321101, 0.8511324541284403, 3509.0703841743116], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 2.4760000000000035, 1, 20, 2.0, 3.0, 4.0, 8.0, 0.3248738352460822, 0.2730685143893119, 0.13737340884917343], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 585.3000000000001, 449, 755, 583.0, 675.0, 685.95, 714.95, 0.32477233459344995, 0.2859867791272068, 0.15033406894267118], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 3.4899999999999993, 2, 16, 3.0, 4.0, 5.0, 9.0, 0.3248913563304431, 0.29434078142706577, 0.15863835758322417], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 784.5060000000002, 599, 966, 771.5, 904.0, 921.0, 947.99, 0.3247425927838299, 0.30720839556213264, 0.17156810810161324], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 56.0, 56, 56, 56.0, 56.0, 56.0, 56.0, 17.857142857142858, 8.457728794642858, 1175.8335658482142], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 0, 0.0, 23.40599999999999, 16, 577, 22.0, 26.0, 30.899999999999977, 53.97000000000003, 0.32451980804004316, 0.16882319037208143, 14.803047103076578], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 30.148000000000017, 20, 280, 29.0, 35.0, 40.0, 95.99000000000001, 0.3247803510485859, 73.45577181269495, 0.10022518645639954], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 482.0, 482, 482, 482.0, 482.0, 482.0, 482.0, 2.074688796680498, 1.0879959802904564, 0.8509465767634855], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 2.864000000000002, 1, 12, 3.0, 4.0, 4.0, 6.0, 0.326516538715719, 0.35480294706481225, 0.13998121142207096], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 3.539999999999998, 2, 10, 3.0, 4.0, 5.0, 7.990000000000009, 0.32651504613984117, 0.3350318595015552, 0.12021110585421886], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 1.9500000000000004, 1, 15, 2.0, 3.0, 3.0, 6.0, 0.3265692140589353, 0.18519727372672296, 0.1266093534974583], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 92.54399999999995, 66, 129, 92.0, 112.0, 115.0, 117.99000000000001, 0.3265485257640256, 0.29743659713414483, 0.10651094492693804], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 0, 0.0, 82.71999999999994, 58, 398, 80.0, 94.0, 105.84999999999997, 347.7600000000002, 0.3247168631311928, 0.16892570327990009, 96.01662010497446], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 214.02399999999994, 13, 376, 261.5, 334.0, 338.0, 347.98, 0.3265107817125229, 0.18197555491323628, 0.1367901614791722], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 447.0460000000003, 339, 584, 435.5, 524.9000000000001, 536.0, 552.99, 0.32646856989137085, 0.17557568957507505, 0.13900419577406026], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 7.320000000000008, 4, 289, 6.0, 8.0, 10.0, 24.980000000000018, 0.32446273837466233, 0.1462965731786771, 0.23542560020739658], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 419.6, 281, 537, 418.5, 485.0, 495.95, 511.96000000000004, 0.3264594041201789, 0.16791936791419862, 0.13134890087647821], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 3.793999999999998, 2, 25, 4.0, 5.0, 5.949999999999989, 10.990000000000009, 0.3248704579049104, 0.19946221248964474, 0.1624352289524552], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 4.315999999999998, 2, 47, 4.0, 5.0, 6.0, 9.990000000000009, 0.3248611705787532, 0.19025634043728915, 0.1532304154194705], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 680.4900000000001, 543, 893, 678.0, 809.7, 839.95, 867.8900000000001, 0.32471032591824833, 0.29671357330562903, 0.14301206737219727], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 251.63400000000001, 171, 327, 245.0, 301.0, 307.95, 314.0, 0.32478942277774203, 0.28758771242852194, 0.13353158885686464], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 4.835999999999998, 3, 55, 4.0, 6.0, 7.0, 12.990000000000009, 0.3248905118974905, 0.21660742322024978, 0.1519751515614238], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 982.8219999999995, 804, 8011, 943.5, 1078.0, 1109.95, 1140.94, 0.32472572042024705, 0.2440865568990902, 0.17948706812291], "isController": false}, {"data": ["Query single patient #2", 500, 0, 0.0, 136.20600000000022, 118, 177, 135.0, 154.0, 155.0, 159.0, 0.32655620358819953, 6.313858958538791, 0.16455371196436616], "isController": false}, {"data": ["Query single patient #1", 500, 0, 0.0, 185.09000000000012, 158, 270, 179.0, 207.0, 210.0, 216.99, 0.32653125197959576, 0.6328807042152572, 0.2334188246572891], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 7.4700000000000015, 5, 19, 7.0, 9.0, 10.0, 14.990000000000009, 0.3264604698810835, 0.26643191336359406, 0.20148732125473123], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 7.346000000000007, 5, 18, 7.0, 9.0, 10.949999999999989, 15.0, 0.3264630277356459, 0.2715349856960224, 0.20658988473896342], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 8.556000000000003, 6, 18, 8.0, 10.0, 11.0, 15.0, 0.3264555674385382, 0.26419628251170996, 0.1992526656729359], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 10.154000000000014, 7, 26, 10.0, 12.0, 13.0, 17.0, 0.3264574857680859, 0.2919339690358339, 0.22698997057312223], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 8.010000000000003, 5, 25, 8.0, 9.0, 11.0, 19.960000000000036, 0.3264223199748263, 0.24504306795688352, 0.18010606522048522], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 1618.3040000000005, 1401, 1970, 1601.0, 1798.8000000000002, 1861.6499999999999, 1946.0, 0.3261189303559979, 0.27252268544426855, 0.20764603768760806], "isController": false}]}, function(index, item){
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

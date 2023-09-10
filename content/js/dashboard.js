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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8932142097426079, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Query cross patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.207, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.661, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [1.0, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [0.99, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.497, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.126, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 23505, 500, 2.1272069772388855, 324.6298659859609, 1, 19080, 9.0, 834.9000000000015, 1496.0, 6126.990000000002, 15.240877843440101, 96.00622882941241, 126.11956477381189], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query cross patient #1", 500, 500, 100.0, 6297.057999999996, 5072, 19080, 6116.5, 6761.900000000001, 6989.6, 16115.11000000007, 0.3286494217742073, 0.19087021252279185, 0.16560849769090916], "isController": false}, {"data": ["Query participation #2", 500, 0, 0.0, 2.2359999999999993, 1, 12, 2.0, 3.0, 4.0, 6.0, 0.3297272166736459, 0.16927821784912342, 0.11913971696215721], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 3.4720000000000026, 2, 17, 3.0, 4.0, 5.0, 7.0, 0.3297241725407028, 0.1892404232850551, 0.13910238529060898], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 0, 0.0, 13.152000000000001, 8, 362, 11.0, 15.0, 18.94999999999999, 70.66000000000031, 0.3276690280681289, 0.1704614921310283, 3.6053192766050866], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 33.394000000000005, 23, 61, 33.0, 40.0, 41.0, 47.0, 0.3296400462550913, 1.3709388294795115, 0.1371354098678407], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 2.234, 1, 8, 2.0, 3.0, 4.0, 6.0, 0.32964743547481096, 0.20593628998788216, 0.13939193316464177], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 29.341999999999988, 21, 43, 29.0, 35.0, 36.0, 38.0, 0.32964069823174136, 1.352914315298361, 0.11975228490449978], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 845.0579999999998, 673, 1129, 852.0, 980.3000000000002, 1056.95, 1073.99, 0.3294927656568372, 1.3934937648024626, 0.16024159892295406], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 5.434000000000002, 3, 15, 5.0, 7.0, 8.0, 11.0, 0.32959311071296266, 0.4901120367321634, 0.16833710635046822], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 3.7180000000000004, 2, 15, 3.5, 5.0, 5.0, 9.990000000000009, 0.3278787425719071, 0.31625889924384604, 0.1793086873440117], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 7.412000000000002, 5, 20, 7.0, 9.0, 10.0, 15.0, 0.32964265417716576, 0.5371855404804475, 0.21536224184035538], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 437.0, 437, 437, 437.0, 437.0, 437.0, 437.0, 2.288329519450801, 0.9899706807780321, 2706.6133616990846], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 3.8119999999999976, 2, 14, 4.0, 5.0, 6.0, 9.0, 0.3278813226994863, 0.3293894487052622, 0.19243815912342896], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 7.666000000000006, 5, 24, 7.0, 9.0, 10.0, 18.970000000000027, 0.3296404809059048, 0.5178671269903692, 0.19604595007001563], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 6.441999999999996, 4, 25, 6.0, 8.0, 9.0, 13.0, 0.32964265417716576, 0.5101445415049769, 0.18832124286488475], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 1554.977999999999, 1281, 1923, 1529.0, 1779.9, 1841.9, 1895.91, 0.32931763410308035, 0.5028879664290311, 0.18138197815833723], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 11.530000000000001, 7, 64, 10.0, 14.0, 18.0, 40.950000000000045, 0.3276610831033699, 0.17045735896484, 2.6417674825209194], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 10.661999999999997, 8, 21, 10.0, 13.0, 14.0, 19.99000000000001, 0.3296450448086509, 0.5967444492307074, 0.2749188166665898], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 7.480000000000002, 5, 18, 7.0, 9.0, 11.0, 14.0, 0.3296439581536774, 0.5581123307525507, 0.23628775906718671], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 69.0, 69, 69, 69.0, 69.0, 69.0, 69.0, 14.492753623188406, 6.835937499999999, 1976.5624999999998], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 426.0, 426, 426, 426.0, 426.0, 426.0, 426.0, 2.347417840375587, 1.0888901115023475, 4489.303660504695], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 2.204, 1, 16, 2.0, 3.0, 3.0, 6.990000000000009, 0.32787680750287057, 0.27559262400956613, 0.13864322036010054], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 548.9599999999994, 428, 717, 539.5, 631.0, 642.0, 666.99, 0.32778094268487995, 0.28863608772303034, 0.15172672542249324], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 3.14, 2, 14, 3.0, 4.0, 5.0, 8.990000000000009, 0.32788089267540316, 0.29704920209365065, 0.1600980921266617], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 748.9319999999999, 600, 951, 727.5, 866.9000000000001, 883.0, 906.98, 0.32774033526525337, 0.3100442775144566, 0.17315187634619345], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 49.0, 49, 49, 49.0, 49.0, 49.0, 49.0, 20.408163265306122, 9.665975765306122, 1343.8097895408164], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 0, 0.0, 24.022, 16, 686, 22.0, 27.0, 32.0, 74.90000000000009, 0.32751556517723507, 0.17038165695855945, 14.939699267020165], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 30.922000000000008, 21, 253, 29.0, 35.900000000000034, 42.0, 114.92000000000007, 0.32778781901130016, 74.13597269211972, 0.10115327227301842], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 410.0, 410, 410, 410.0, 410.0, 410.0, 410.0, 2.4390243902439024, 1.2790586890243902, 1.0003810975609757], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 2.5720000000000023, 1, 12, 2.0, 3.0, 4.0, 6.990000000000009, 0.32967482194262865, 0.3582348350818187, 0.1413352019851699], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 3.267999999999998, 1, 10, 3.0, 4.0, 5.0, 7.0, 0.32967395246101605, 0.33827316268585367, 0.12137410163847953], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 1.7320000000000004, 1, 10, 2.0, 3.0, 3.0, 5.0, 0.3297283038776049, 0.186988792328871, 0.12783411781192297], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 91.50199999999998, 66, 118, 91.0, 110.0, 113.0, 116.99000000000001, 0.3297054740999865, 0.30031210229277183, 0.10754065268495652], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 0, 0.0, 81.26399999999991, 56, 298, 79.0, 91.0, 100.94999999999999, 249.93000000000006, 0.32773260165937573, 0.17049456467770122, 96.9083539613695], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 212.6600000000001, 12, 362, 261.0, 333.90000000000003, 337.0, 343.0, 0.3296702572153281, 0.18373643798374992, 0.138113808931031], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 410.79199999999975, 315, 513, 399.5, 481.80000000000007, 494.0, 506.0, 0.32964830481655727, 0.177285759712428, 0.1403580672851748], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 7.035999999999997, 4, 266, 6.0, 8.0, 10.0, 29.980000000000018, 0.32746108288760417, 0.14764849275394118, 0.23760115682176752], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 382.76399999999984, 287, 494, 380.0, 445.90000000000003, 454.0, 475.98, 0.329613752013116, 0.16954185480744954, 0.13261803303652714], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 3.2939999999999987, 2, 18, 3.0, 4.0, 5.0, 9.0, 0.32787293743331886, 0.20130565868525574, 0.16393646871665943], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 4.092000000000002, 2, 50, 4.0, 5.0, 5.0, 10.980000000000018, 0.32786283268241634, 0.1920142767460663, 0.1546462384625069], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 666.322, 519, 879, 673.0, 807.6000000000001, 836.95, 854.99, 0.3277063960423554, 0.2994513201570238, 0.14433162560068583], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 239.05999999999983, 171, 306, 233.0, 280.0, 287.0, 298.96000000000004, 0.3277865296781202, 0.2902415276605941, 0.13476379784618026], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 4.421999999999999, 3, 35, 4.0, 5.0, 6.0, 10.0, 0.32788282779266004, 0.2186024271116474, 0.1533748774537931], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 978.7099999999997, 795, 8604, 929.5, 1084.9, 1110.0, 1148.94, 0.32770704039251436, 0.24632752544972877, 0.1811349461544562], "isController": false}, {"data": ["Query single patient #2", 500, 0, 0.0, 133.67400000000006, 117, 166, 132.0, 149.0, 150.0, 156.99, 0.32971851930007356, 6.375001313722225, 0.1661472226160527], "isController": false}, {"data": ["Query single patient #1", 500, 0, 0.0, 180.59999999999982, 157, 255, 175.0, 201.0, 203.0, 216.0, 0.32970308259194103, 0.6390283252451672, 0.2356861879465828], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 6.722000000000003, 5, 21, 6.0, 8.0, 9.949999999999989, 13.0, 0.3295900690557113, 0.2689860513774887, 0.20341887074532178], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 6.602000000000006, 5, 14, 6.0, 8.0, 9.0, 12.0, 0.3295915898773194, 0.27413716114688647, 0.2085696779692412], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 7.953999999999997, 5, 27, 8.0, 9.0, 10.949999999999989, 13.990000000000009, 0.3295883309910589, 0.2667315876714848, 0.20116475280215998], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 9.229999999999999, 7, 21, 9.0, 11.0, 12.0, 17.99000000000001, 0.3295883309910589, 0.29473372126154546, 0.22916688639222066], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 7.452000000000003, 5, 36, 7.0, 9.0, 10.0, 22.910000000000082, 0.3295629138898245, 0.24740069095336617, 0.1818389124489754], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 1613.0840000000014, 1397, 1965, 1593.0, 1811.6000000000001, 1881.75, 1955.89, 0.32925496187227543, 0.27514332365598126, 0.20964280775461286], "isController": false}]}, function(index, item){
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

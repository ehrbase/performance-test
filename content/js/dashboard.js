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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8926185917889811, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Query cross patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.2, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.644, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [1.0, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [0.984, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [0.999, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.497, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.129, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 23505, 500, 2.1272069772388855, 324.3750691342247, 1, 18049, 9.0, 838.0, 1497.9000000000015, 6069.0, 15.246680984687156, 96.04278431605938, 126.1675862628572], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query cross patient #1", 500, 500, 100.0, 6214.786000000001, 5074, 18049, 6059.0, 6556.0, 6772.85, 15702.990000000076, 0.3289082023785325, 0.19102050491849326, 0.16573889885480741], "isController": false}, {"data": ["Query participation #2", 500, 0, 0.0, 2.4100000000000033, 1, 13, 2.0, 3.0, 4.0, 6.990000000000009, 0.32999706302613907, 0.1694167539096402, 0.11923722003874165], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 3.722000000000002, 2, 14, 4.0, 5.0, 5.0, 8.0, 0.32999466728617666, 0.18939566983472547, 0.1392165002613558], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 0, 0.0, 13.35400000000001, 8, 354, 12.0, 15.0, 19.0, 41.940000000000055, 0.32784821414520793, 0.17055470913798212, 3.6072908484121657], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 33.878000000000014, 24, 52, 34.0, 40.0, 41.0, 45.0, 0.3299149743128201, 1.3720822268122561, 0.1372497842356068], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 2.3259999999999996, 1, 13, 2.0, 3.0, 4.0, 6.990000000000009, 0.32992302895734427, 0.20610845786552995, 0.13950846829934574], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 29.89399999999999, 21, 49, 30.0, 35.0, 37.0, 41.99000000000001, 0.3299167158242573, 1.3540471491814106, 0.11985255692053097], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 854.181999999999, 672, 1132, 859.5, 986.0, 1040.0, 1083.99, 0.32976505558849545, 1.3946453358277862, 0.16037402117487376], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 5.6059999999999945, 4, 15, 5.0, 7.0, 8.0, 11.990000000000009, 0.3298727482886202, 0.4905278638150047, 0.16847992905756673], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 3.874000000000001, 2, 22, 4.0, 5.0, 6.0, 10.990000000000009, 0.3280461049117687, 0.31642033035390926, 0.17940021362362352], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 7.817999999999994, 5, 21, 8.0, 10.0, 11.0, 14.990000000000009, 0.32991649813432217, 0.5376317964860593, 0.21554114966002103], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 487.0, 487, 487, 487.0, 487.0, 487.0, 487.0, 2.053388090349076, 0.8883309804928131, 2428.7269795944558], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 3.969999999999998, 2, 24, 4.0, 5.0, 6.0, 9.990000000000009, 0.3280501943041301, 0.3295590970533219, 0.19253727224295136], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 8.053999999999993, 5, 19, 8.0, 10.0, 11.0, 14.0, 0.3299151920007443, 0.5182986997299974, 0.19620932805513017], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 6.722000000000001, 4, 13, 7.0, 8.0, 9.0, 11.0, 0.32991453893783357, 0.5105653017579825, 0.18847656765491466], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 1564.6719999999993, 1340, 1918, 1549.0, 1755.8000000000002, 1807.95, 1895.99, 0.3295770340176231, 0.5032840858043921, 0.181524850767519], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 11.471999999999996, 8, 45, 11.0, 14.0, 18.0, 34.0, 0.32784090536544425, 0.17055090693088457, 2.643217299508894], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 11.08, 8, 26, 11.0, 13.0, 14.0, 19.99000000000001, 0.3299201989022895, 0.597242550690589, 0.2751482908814016], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 7.848000000000003, 5, 21, 8.0, 10.0, 11.0, 15.980000000000018, 0.329918239661847, 0.5585767102384187, 0.23648436319511298], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 43.0, 43, 43, 43.0, 43.0, 43.0, 43.0, 23.25581395348837, 10.969295058139537, 3171.6933139534885], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 444.0, 444, 444, 444.0, 444.0, 444.0, 444.0, 2.2522522522522523, 1.0447459177927927, 4307.304863457207], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 2.2419999999999995, 1, 18, 2.0, 3.0, 3.9499999999999886, 6.0, 0.3280486876740298, 0.2757370956717912, 0.138715900159038], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 554.3700000000005, 432, 713, 543.0, 643.9000000000001, 659.95, 674.99, 0.32794691457704356, 0.2887822386164707, 0.15180355225538933], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 3.214000000000001, 2, 11, 3.0, 4.0, 5.0, 8.0, 0.3280476115181453, 0.29720024382958843, 0.16017949781159438], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 753.006, 614, 925, 729.0, 881.9000000000001, 898.0, 917.98, 0.32790433063249463, 0.31019941809277723, 0.1732385184298629], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 57.0, 57, 57, 57.0, 57.0, 57.0, 57.0, 17.543859649122805, 8.309347587719298, 1155.2049067982455], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 0, 0.0, 24.107999999999997, 16, 559, 22.0, 27.0, 32.0, 54.99000000000001, 0.32772272036075717, 0.17048942418298726, 14.949148699268521], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 31.259999999999998, 21, 255, 29.0, 35.0, 42.0, 108.90000000000009, 0.32796735019435347, 74.17657737024464, 0.10120867447403877], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 470.0, 470, 470, 470.0, 470.0, 470.0, 470.0, 2.127659574468085, 1.1157746010638299, 0.8726728723404256], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 2.7419999999999973, 2, 10, 3.0, 4.0, 4.0, 6.990000000000009, 0.329937615395681, 0.35852039455754703, 0.14144786441279683], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 3.403999999999999, 2, 10, 3.0, 4.0, 5.0, 7.990000000000009, 0.32993630909489235, 0.3385423626260687, 0.12147069192263125], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 1.7580000000000002, 1, 9, 2.0, 3.0, 3.0, 5.990000000000009, 0.32999793421293183, 0.1871416995867106, 0.12793865222903705], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 92.08000000000001, 67, 120, 91.0, 111.0, 114.0, 118.0, 0.32997397825207503, 0.3005566691948173, 0.10762823118768854], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 0, 0.0, 83.57599999999996, 58, 386, 81.0, 91.0, 103.89999999999998, 311.99, 0.3279064810715984, 0.1705850210270031, 96.95976894889577], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 214.91400000000007, 12, 355, 265.5, 340.90000000000003, 344.0, 350.99, 0.32993239025458904, 0.18388253363495752, 0.13822362833908075], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 416.566, 333, 534, 409.0, 488.0, 495.0, 513.99, 0.32988754793266073, 0.17741442531444881, 0.1404599325182032], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 7.2719999999999985, 4, 313, 6.0, 8.0, 10.0, 29.0, 0.32765958004526946, 0.1477379928737318, 0.23774518356800314], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 388.04999999999995, 281, 509, 383.0, 452.80000000000007, 463.0, 486.97, 0.32987122487123477, 0.169674289894461, 0.13272162563178586], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 3.464000000000002, 2, 20, 3.0, 4.900000000000034, 6.0, 9.990000000000009, 0.3280454592275579, 0.20141158268648235, 0.16402272961377895], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 4.227999999999998, 2, 44, 4.0, 5.0, 6.0, 11.980000000000018, 0.32803663513141146, 0.1921160648971277, 0.15472821754733568], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 667.7660000000003, 539, 892, 674.5, 782.8000000000001, 832.9, 855.96, 0.32788433289965163, 0.2996139151733721, 0.14440999427513954], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 241.7819999999999, 174, 318, 237.0, 284.90000000000003, 291.0, 303.0, 0.32796821069727355, 0.2904023987512938, 0.13483849287456265], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 4.537999999999995, 3, 66, 4.0, 5.0, 6.0, 11.0, 0.3280527771307848, 0.21871573386226376, 0.15345437523988859], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 977.2719999999997, 812, 8989, 922.0, 1076.9, 1115.95, 1164.8300000000002, 0.3278791725903504, 0.24645691204542833, 0.18123008953724445], "isController": false}, {"data": ["Query single patient #2", 500, 0, 0.0, 135.5660000000003, 117, 169, 134.0, 153.0, 155.0, 158.99, 0.3299789869381118, 6.380037371563929, 0.16627847388678288], "isController": false}, {"data": ["Query single patient #1", 500, 0, 0.0, 182.22400000000025, 159, 254, 177.0, 205.0, 207.95, 215.0, 0.329948937102494, 0.6395048388248935, 0.23586193550686096], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 7.048000000000004, 5, 18, 7.0, 9.0, 10.0, 13.990000000000009, 0.3298690485850927, 0.26921373300102325, 0.20359105342361192], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 6.953999999999999, 5, 15, 7.0, 9.0, 10.0, 13.990000000000009, 0.32987078961170907, 0.2743693849806531, 0.20874635905115968], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 8.462000000000002, 5, 24, 8.0, 10.0, 12.0, 14.0, 0.32986578420972074, 0.2669561269848024, 0.20133409680769088], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 9.707999999999997, 7, 24, 10.0, 12.0, 13.0, 16.0, 0.329866872327666, 0.29498280630778034, 0.22936055966533028], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 7.733999999999995, 5, 30, 8.0, 9.0, 10.0, 15.0, 0.3298220478123233, 0.24759522106817486, 0.18198189161519793], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 1624.8940000000011, 1424, 1981, 1600.0, 1840.9, 1877.9, 1945.99, 0.3295092684367026, 0.27535583602926833, 0.20980472951243173], "isController": false}]}, function(index, item){
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

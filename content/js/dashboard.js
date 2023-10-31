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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8900659434162944, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Query cross patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.171, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.555, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [1.0, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [0.943, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [0.995, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.558, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.496, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.115, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 23505, 500, 2.1272069772388855, 321.63267389917, 1, 20206, 9.0, 827.0, 1513.0, 5956.0, 15.39724297314506, 96.99121319695371, 127.41349956593925], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query cross patient #1", 500, 500, 100.0, 6099.920000000001, 5244, 20206, 5948.5, 6307.400000000001, 6514.799999999999, 19231.51000000011, 0.332392883069502, 0.19304430809596052, 0.16749485123424127], "isController": false}, {"data": ["Query participation #2", 500, 0, 0.0, 2.4619999999999997, 1, 7, 2.0, 3.0, 4.0, 6.0, 0.33354747080959307, 0.1712394930462023, 0.1205200822261225], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 3.6640000000000015, 2, 21, 3.0, 5.0, 5.0, 8.990000000000009, 0.3335436882193703, 0.1914325791048888, 0.14071374346754686], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 0, 0.0, 13.842000000000017, 7, 375, 12.0, 16.0, 21.0, 61.76000000000022, 0.3312317781118066, 0.17231492238080126, 3.6445199648298097], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 30.17200000000003, 19, 45, 31.0, 38.0, 39.0, 42.0, 0.3334911858279586, 1.3869553203099467, 0.13873754410420933], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 2.2719999999999967, 1, 8, 2.0, 3.0, 4.0, 6.990000000000009, 0.33349963848639186, 0.2083428259141892, 0.14102084322715594], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 26.279999999999994, 17, 42, 27.0, 33.0, 34.0, 36.99000000000001, 0.3334900736679573, 1.3687129565479108, 0.1211506908246876], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 808.3399999999999, 603, 1115, 794.0, 948.9000000000001, 1021.9, 1078.94, 0.3333488896148487, 1.409802118890548, 0.16211694045722133], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 5.595999999999998, 3, 17, 5.0, 7.900000000000034, 9.0, 13.0, 0.3334531541667306, 0.49585200427853743, 0.17030859338789073], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 3.93, 2, 16, 4.0, 5.0, 6.0, 9.0, 0.3314421245705339, 0.319695996933166, 0.18125741187451072], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 7.524000000000002, 5, 22, 7.0, 10.0, 10.949999999999989, 13.990000000000009, 0.3334909633953649, 0.5434567436791791, 0.21787642042138586], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 423.0, 423, 423, 423.0, 423.0, 423.0, 423.0, 2.3640661938534278, 1.0227356678486998, 2796.193945774232], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 4.195999999999998, 2, 18, 4.0, 5.0, 6.0, 11.0, 0.33144410195220575, 0.3329686153508336, 0.19452920436843327], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 7.875999999999993, 5, 18, 8.0, 10.0, 10.949999999999989, 14.990000000000009, 0.3334896288060337, 0.5239141608950728, 0.19833514056921345], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 6.4460000000000015, 4, 14, 6.0, 8.0, 9.0, 12.990000000000009, 0.3334891839452971, 0.5160973092675311, 0.19051872324999883], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 1581.7340000000002, 1354, 1946, 1556.0, 1770.6000000000001, 1847.85, 1907.97, 0.33314810298807196, 0.5087373243393339, 0.183491728598899], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 12.020000000000007, 7, 48, 11.0, 15.0, 23.0, 34.98000000000002, 0.3312234400204034, 0.17231058470045807, 2.670488985164502], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 10.855999999999996, 7, 28, 10.5, 14.0, 15.0, 20.0, 0.3334922979953778, 0.6037089919111442, 0.2781273657109889], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 7.645999999999997, 5, 23, 8.0, 10.0, 11.0, 15.0, 0.3334920755613005, 0.5646274866419749, 0.23904607759960406], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 49.0, 49, 49, 49.0, 49.0, 49.0, 49.0, 20.408163265306122, 9.626116071428571, 2783.3227040816328], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 465.0, 465, 465, 465.0, 465.0, 465.0, 465.0, 2.150537634408602, 0.9975638440860215, 4112.7814180107525], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 2.469999999999999, 1, 21, 2.0, 3.0, 4.0, 7.990000000000009, 0.33145684564452443, 0.27860177892060417, 0.1401570450821085], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 571.4200000000002, 435, 717, 558.5, 662.0, 673.0, 692.0, 0.3313531668084858, 0.2917817031668748, 0.15338027447970926], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 3.337999999999999, 2, 24, 3.0, 4.0, 5.0, 9.990000000000009, 0.3314522314358577, 0.3002847164310152, 0.1618419098807899], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 773.1620000000003, 633, 952, 757.5, 898.0, 915.0, 934.99, 0.33130113218848917, 0.31341281226788215, 0.1750331176894264], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 47.0, 47, 47, 47.0, 47.0, 47.0, 47.0, 21.27659574468085, 10.077293882978724, 1400.9931848404256], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 0, 0.0, 25.983999999999995, 16, 1490, 22.0, 28.0, 32.94999999999999, 52.99000000000001, 0.33089880055802773, 0.172141699262956, 15.094026341860815], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 30.925999999999938, 20, 271, 29.0, 37.0, 42.0, 124.97000000000003, 0.3313568998778618, 74.94319390753122, 0.10225466832168394], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 382.0, 382, 382, 382.0, 382.0, 382.0, 382.0, 2.617801047120419, 1.3728116819371727, 1.0737074607329842], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 2.752, 1, 8, 3.0, 4.0, 4.0, 5.0, 0.33349719162014935, 0.362388339929352, 0.14297389367309138], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 3.358000000000001, 2, 9, 3.0, 4.0, 5.0, 6.0, 0.33349585698096873, 0.34219475770358754, 0.12278118953303244], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 1.9400000000000002, 1, 11, 2.0, 3.0, 3.0, 5.990000000000009, 0.3335481383344207, 0.18915501895720843, 0.12931504972535646], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 91.19000000000001, 63, 119, 90.0, 111.0, 114.0, 116.99000000000001, 0.3335307835571992, 0.30379638391761254, 0.10878836104307082], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 0, 0.0, 85.16599999999998, 55, 378, 82.0, 97.0, 112.0, 309.93000000000006, 0.33129652231414597, 0.17234860390817255, 97.96218163232447], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 206.07799999999983, 12, 388, 266.0, 337.0, 340.95, 349.99, 0.3334909633953649, 0.185865847382196, 0.1397144758755972], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 431.0059999999996, 332, 562, 416.5, 504.0, 513.95, 543.97, 0.33343380805416034, 0.17932161370459632, 0.14196986358556044], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 7.466000000000003, 5, 268, 6.0, 8.0, 11.949999999999989, 29.970000000000027, 0.3308447193543499, 0.14917413610653996, 0.2400562758596504], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 401.93199999999996, 301, 522, 392.0, 464.0, 475.0, 501.98, 0.3334209118928572, 0.1715001254912957, 0.13414982001939177], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 3.532, 2, 19, 3.0, 5.0, 6.0, 10.0, 0.33145508783559824, 0.20350500807921776, 0.16572754391779915], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 4.255999999999992, 2, 37, 4.0, 5.0, 6.0, 10.0, 0.3314473976407574, 0.1941135926163463, 0.1563370049418807], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 614.8820000000005, 457, 861, 590.0, 744.0, 820.0, 846.97, 0.3313053031377262, 0.30273992695215024, 0.14591669112804154], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 247.32799999999986, 169, 345, 237.0, 294.0, 299.0, 309.96000000000004, 0.331369197642507, 0.2934138331976929, 0.13623675020263226], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 4.409999999999998, 3, 40, 4.0, 5.0, 6.0, 10.990000000000009, 0.33144520050777404, 0.22097749300650626, 0.1550412607843982], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 995.630000000001, 806, 9761, 934.0, 1075.0, 1107.8, 1234.6500000000003, 0.3312717190020771, 0.24900698714168823, 0.1831052665577887], "isController": false}, {"data": ["Query single patient #2", 500, 0, 0.0, 133.98400000000007, 115, 167, 135.0, 150.0, 151.0, 156.0, 0.3335245540776712, 6.4485897695929, 0.16806510732820149], "isController": false}, {"data": ["Query single patient #1", 500, 0, 0.0, 179.6620000000002, 156, 243, 178.0, 201.0, 203.0, 208.0, 0.3334951896653843, 0.646378161992954, 0.23839695198736455], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 7.0000000000000036, 4, 29, 7.0, 9.0, 10.0, 13.990000000000009, 0.333448706585812, 0.2721351743953408, 0.20580037359593087], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 6.762, 4, 19, 7.0, 9.0, 10.0, 14.990000000000009, 0.33345070798254317, 0.27734697509356626, 0.2110117761452031], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 8.093999999999992, 5, 19, 8.0, 10.0, 11.0, 14.0, 0.3334435920144261, 0.26985160072097175, 0.2035178173916175], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 9.641999999999996, 6, 26, 9.0, 12.0, 13.0, 18.0, 0.33344559334976104, 0.29818307059209936, 0.23184888912600576], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 7.422000000000003, 4, 29, 7.0, 9.0, 10.0, 16.99000000000001, 0.3334266928073194, 0.25030120412882273, 0.18397078265247604], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 1621.6519999999998, 1400, 1955, 1609.5, 1813.0, 1865.85, 1937.99, 0.33311725127633873, 0.27837086239226155, 0.2121019998361063], "isController": false}]}, function(index, item){
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

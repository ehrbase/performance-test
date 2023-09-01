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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8933843863007871, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Query cross patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.219, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.667, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [0.5, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [0.994, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [0.998, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.496, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.116, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 23505, 500, 2.1272069772388855, 323.3777068708801, 1, 21810, 9.0, 824.9000000000015, 1498.9500000000007, 6054.970000000005, 15.312434243827633, 96.45698109056062, 126.71170009346741], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query cross patient #1", 500, 500, 100.0, 6242.806000000004, 4928, 21810, 6037.5, 6604.3, 6832.95, 19708.720000000114, 0.3304048450566479, 0.19188971230824128, 0.1664930664543265], "isController": false}, {"data": ["Query participation #2", 500, 0, 0.0, 2.183999999999997, 1, 13, 2.0, 3.0, 3.0, 5.0, 0.331476842033385, 0.1701764556888387, 0.11977190581284419], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 3.553999999999998, 2, 19, 3.0, 4.0, 5.0, 9.0, 0.33147398525868893, 0.1902447030042813, 0.1398405875310094], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 0, 0.0, 13.449999999999994, 8, 348, 11.0, 15.0, 19.94999999999999, 41.99000000000001, 0.3292521432668266, 0.1712850676168664, 3.6227381818235695], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 33.63600000000001, 24, 71, 34.0, 40.0, 41.0, 44.98000000000002, 0.33141092900448793, 1.3783037475202178, 0.1378721247616327], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 2.2359999999999993, 1, 7, 2.0, 3.0, 4.0, 6.0, 0.3314190568609048, 0.2070430516254779, 0.14014106603590992], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 29.649999999999995, 21, 52, 30.0, 35.0, 36.0, 40.99000000000001, 0.3314104896722549, 1.3601779092289867, 0.12039521695124886], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 842.5520000000002, 670, 1120, 841.0, 1002.8000000000001, 1042.6999999999998, 1088.92, 0.3312701826358771, 1.4010108326591983, 0.16110600678971365], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 5.525999999999999, 3, 23, 5.0, 7.0, 8.0, 11.990000000000009, 0.3313476771533789, 0.49272111472482566, 0.1692332374523605], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 3.7560000000000002, 2, 18, 4.0, 5.0, 5.0, 10.990000000000009, 0.32948538336942296, 0.31780860157012963, 0.18018731903015317], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 7.396, 5, 23, 7.0, 9.0, 10.0, 13.0, 0.3314144437042855, 0.5400728480017366, 0.21651978792789747], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 440.0, 440, 440, 440.0, 440.0, 440.0, 440.0, 2.2727272727272725, 0.9832208806818182, 2688.1591796875], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 3.8579999999999988, 2, 21, 4.0, 5.0, 5.0, 10.980000000000018, 0.3294882059696673, 0.3310037230107973, 0.19338126151149418], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 7.6480000000000015, 5, 20, 7.0, 9.0, 10.0, 14.0, 0.33141268634506826, 0.5206512721193112, 0.19709992771889312], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 6.444000000000001, 4, 20, 6.0, 8.0, 8.0, 12.990000000000009, 0.3314124666764765, 0.5128834473309366, 0.18933231738841674], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 1551.3739999999991, 1313, 1967, 1521.5, 1747.5000000000002, 1817.95, 1905.97, 0.3310624655281208, 0.5055524296591579, 0.18234299859166028], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 11.494, 7, 70, 10.0, 14.0, 16.0, 32.99000000000001, 0.32924260372952857, 0.1712801049148019, 2.654518492569324], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 10.695999999999994, 8, 30, 10.0, 13.0, 14.0, 19.99000000000001, 0.3314153223908831, 0.5999491184269571, 0.2763952005095842], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 7.597999999999995, 5, 30, 7.0, 10.0, 11.0, 16.0, 0.33141620108214015, 0.5611128730255052, 0.23755809726004973], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 48.0, 48, 48, 48.0, 48.0, 48.0, 48.0, 20.833333333333332, 9.82666015625, 2841.30859375], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 489.0, 489, 489, 489.0, 489.0, 489.0, 489.0, 2.044989775051125, 0.9486036554192229, 3910.9271152862984], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 2.2319999999999975, 1, 19, 2.0, 3.0, 4.0, 7.0, 0.32947300792382583, 0.27693428969737904, 0.13931817620216463], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 546.9480000000002, 423, 682, 541.0, 633.0, 642.95, 663.99, 0.32937490571643324, 0.29003969358746584, 0.15246455596639585], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 3.1920000000000006, 1, 11, 3.0, 4.0, 5.0, 8.0, 0.32948777172032817, 0.2985049811549469, 0.16088270103531646], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 736.412, 584, 927, 711.5, 862.0, 876.95, 896.98, 0.3293493045789434, 0.311566371912762, 0.17400192751680504], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 57.0, 57, 57, 57.0, 57.0, 57.0, 57.0, 17.543859649122805, 8.309347587719298, 1155.2049067982455], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 0, 0.0, 24.390000000000004, 17, 649, 22.0, 26.0, 31.0, 82.0, 0.3291034760567348, 0.17120772727556954, 15.012132193955159], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 30.708000000000023, 21, 256, 29.0, 35.0, 41.94999999999999, 107.98000000000002, 0.3293790283055162, 74.4958574771592, 0.10164430951615538], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 508.0, 508, 508, 508.0, 508.0, 508.0, 508.0, 1.968503937007874, 1.0323111466535433, 0.8073941929133858], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 2.672000000000002, 1, 26, 2.0, 3.0, 4.0, 5.990000000000009, 0.33142410951313134, 0.36013566493784804, 0.1420851406994772], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 3.2479999999999984, 2, 8, 3.0, 4.0, 5.0, 6.990000000000009, 0.3314230110973681, 0.3400678437403473, 0.12201804217158962], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 1.7499999999999996, 1, 9, 2.0, 2.0, 3.0, 5.0, 0.33147772105089046, 0.1879808861244752, 0.1285123586496128], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 90.94000000000005, 65, 129, 89.0, 110.0, 114.0, 118.99000000000001, 0.3314610205154484, 0.30191114105953504, 0.10811326255093727], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 0, 0.0, 82.79399999999995, 59, 367, 80.0, 91.0, 105.84999999999997, 311.85000000000014, 0.3293104765517768, 0.17131541402724318, 97.37492108897705], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 211.62800000000013, 12, 381, 259.5, 333.0, 336.0, 354.0, 0.3314190568609048, 0.18471110345809272, 0.138846460345047], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 408.84399999999954, 317, 513, 399.5, 480.0, 489.95, 503.97, 0.33137600572617737, 0.17821492198580385, 0.14109368993809898], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 7.438000000000003, 4, 318, 6.0, 8.0, 11.0, 32.98000000000002, 0.32903871996041006, 0.14835983143839934, 0.2387458680962741], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 382.04200000000014, 293, 516, 390.0, 438.90000000000003, 449.0, 470.0, 0.33136019383245896, 0.1704401637631782, 0.1333207029872784], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 3.327999999999998, 2, 16, 3.0, 4.0, 5.0, 9.990000000000009, 0.3294704026853156, 0.20228646178934057, 0.1647352013426578], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 4.191999999999999, 2, 27, 4.0, 5.0, 6.0, 17.970000000000027, 0.3294647581432157, 0.1929524512754569, 0.15540183416325506], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 667.7859999999991, 529, 888, 674.0, 805.9000000000001, 836.0, 857.97, 0.3293057050237561, 0.30091273559353404, 0.1450360087555801], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 237.86800000000005, 170, 309, 230.0, 279.90000000000003, 285.95, 298.97, 0.3293861888371021, 0.29165796023485235, 0.1354214702152539], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 4.356000000000006, 3, 39, 4.0, 5.0, 6.0, 9.0, 0.3294901601058586, 0.21967405000573312, 0.15412674481514282], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 984.2120000000006, 771, 9458, 925.5, 1078.0, 1108.95, 1134.0, 0.3293057050237561, 0.24752919356819855, 0.18201858305024018], "isController": false}, {"data": ["Query single patient #2", 500, 0, 0.0, 133.80600000000018, 117, 168, 132.0, 149.0, 150.0, 155.99, 0.33145091311412056, 6.408496589825849, 0.1670201866864123], "isController": false}, {"data": ["Query single patient #1", 500, 0, 0.0, 182.03400000000005, 160, 247, 179.0, 203.0, 204.0, 213.96000000000004, 0.3314287229388448, 0.6423729499062057, 0.23691975116331485], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 7.053999999999999, 4, 29, 7.0, 9.0, 10.0, 14.0, 0.3313404310871545, 0.2704145621717245, 0.20449917231160317], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 6.960000000000001, 5, 15, 7.0, 9.0, 10.0, 13.0, 0.33134592050216133, 0.2755963222176717, 0.20967984031777398], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 8.366000000000007, 5, 28, 8.0, 10.0, 12.0, 15.990000000000009, 0.33133691795700304, 0.26814669656264456, 0.20223200558899113], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 9.759999999999994, 7, 34, 9.0, 12.0, 14.0, 20.980000000000018, 0.33133801580217265, 0.2962983734865308, 0.23038346411244817], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 7.767999999999999, 5, 28, 8.0, 9.0, 10.949999999999989, 15.0, 0.3313678799812048, 0.24875566701206248, 0.1828348165911921], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 1620.3160000000005, 1397, 1982, 1591.5, 1815.9, 1889.85, 1958.0, 0.33100592037189175, 0.27660651964983546, 0.21075767586179045], "isController": false}]}, function(index, item){
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

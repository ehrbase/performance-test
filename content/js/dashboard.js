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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9115655532833447, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.979, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [1.0, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [0.798, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.723, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.612, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 22005, 0, 0.0, 200.48579868211797, 1, 3919, 13.0, 597.0, 1321.9000000000015, 2233.970000000005, 24.58585048272287, 165.30262603984292, 216.57268483590437], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query participation #2", 500, 0, 0.0, 8.004000000000005, 4, 92, 7.0, 10.0, 12.949999999999989, 24.940000000000055, 0.5687505687505688, 6.086410895981208, 0.2055055765993266], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 8.239999999999997, 5, 40, 8.0, 10.0, 12.0, 19.99000000000001, 0.5687305138707685, 6.106543948366094, 0.2399331855392305], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 0, 0.0, 20.912000000000003, 13, 271, 19.0, 26.0, 30.0, 47.960000000000036, 0.5656946900502224, 0.30485640405987763, 6.297772916574741], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 45.26400000000004, 27, 228, 46.0, 55.0, 56.0, 61.99000000000001, 0.5684847947371952, 2.364430410923549, 0.23649855718559096], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 2.4859999999999998, 1, 15, 2.0, 3.0, 4.0, 6.990000000000009, 0.5685209926376532, 0.3553256203985332, 0.2403999900508826], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 39.513999999999974, 24, 71, 41.0, 48.0, 49.0, 55.0, 0.5684757459822977, 2.33266028173658, 0.2065165795951316], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 774.81, 576, 1164, 767.0, 922.9000000000001, 938.0, 955.98, 0.5681417900102492, 2.402951262240615, 0.2763033314698283], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 8.570000000000013, 5, 36, 8.0, 11.0, 12.0, 18.99000000000001, 0.5683820436744762, 0.8453572778478782, 0.2902966883220225], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 3.514000000000002, 2, 22, 3.0, 5.0, 6.0, 10.990000000000009, 0.5662988744243571, 0.5463899296203759, 0.3096946969508203], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 12.890000000000004, 8, 46, 13.0, 16.0, 17.0, 29.960000000000036, 0.5684770386439321, 0.9265509545866433, 0.3713975965359283], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 666.0, 666, 666, 666.0, 666.0, 666.0, 666.0, 1.5015015015015014, 0.6407774962462462, 1775.9610196133633], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 4.716000000000003, 2, 34, 4.0, 6.0, 7.0, 10.990000000000009, 0.5663110610743827, 0.5684347275534116, 0.33237592549385153], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 13.932, 9, 66, 14.0, 17.0, 18.94999999999999, 27.99000000000001, 0.5684679901359434, 0.89258356763689, 0.33808301366483356], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 8.478000000000002, 5, 28, 8.0, 11.0, 13.0, 18.0, 0.5684641122921269, 0.8798980644365441, 0.3247573297762639], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 1993.7140000000002, 1581, 3919, 1988.5, 2232.8, 2305.75, 2465.67, 0.5673398342913812, 0.8665229500309767, 0.3124801431057998], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 18.072000000000006, 12, 86, 16.0, 24.0, 29.0, 44.0, 0.5656505320508904, 0.3054733830313891, 4.5605574146603045], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 17.351999999999983, 11, 37, 18.0, 21.0, 23.0, 26.0, 0.5684867337935802, 1.0292718793489235, 0.47410905337863035], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 12.700000000000008, 8, 41, 13.0, 16.0, 18.0, 24.980000000000018, 0.5684847947371952, 0.9626490567131801, 0.407488124352638], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 75.0, 75, 75, 75.0, 75.0, 75.0, 75.0, 13.333333333333334, 6.2109375, 1818.4375], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 626.0, 626, 626, 626.0, 626.0, 626.0, 626.0, 1.5974440894568689, 0.7316418730031949, 3055.0213408546324], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 2.4419999999999993, 1, 21, 2.0, 3.0, 4.0, 13.0, 0.5664592670470252, 0.47629045793700064, 0.23952818616343935], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 416.04999999999984, 320, 589, 412.0, 484.90000000000003, 496.95, 546.96, 0.5662366665420947, 0.4981334362185356, 0.26210564447358675], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 3.2340000000000004, 1, 22, 3.0, 4.0, 5.949999999999989, 12.980000000000018, 0.5664855801095583, 0.5133775569742872, 0.2766042871628703], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 1185.9820000000004, 950, 1475, 1168.0, 1369.7, 1393.95, 1440.8500000000001, 0.5656748500961647, 0.5352919235773278, 0.2988575135761964], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 60.0, 60, 60, 60.0, 60.0, 60.0, 60.0, 16.666666666666668, 7.796223958333334, 1097.4446614583335], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 0, 0.0, 42.516, 27, 691, 41.0, 49.0, 57.0, 85.0, 0.5652157202317837, 0.30523856766423474, 25.853099515836213], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 41.63599999999996, 28, 174, 41.0, 49.0, 57.0, 86.93000000000006, 0.5660148816632686, 128.08684617498463, 0.17466865488827432], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 294.0, 294, 294, 294.0, 294.0, 294.0, 294.0, 3.401360544217687, 1.7837213010204083, 1.3950892857142858], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 2.3380000000000005, 1, 11, 2.0, 3.0, 4.0, 7.990000000000009, 0.5687745070715734, 0.6182090101275989, 0.24383985215275464], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 3.5140000000000002, 2, 49, 3.0, 5.0, 7.0, 12.990000000000009, 0.5687699780454788, 0.5837668427009749, 0.20940066574525928], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 2.1659999999999995, 1, 12, 2.0, 3.0, 4.0, 7.990000000000009, 0.5687673900629512, 0.3227088414322018, 0.22050845103026523], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 124.33000000000003, 85, 436, 123.0, 150.0, 153.0, 193.81000000000017, 0.5687059323990632, 0.5181666356721933, 0.1854958802942257], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 0, 0.0, 165.654, 113, 588, 166.0, 193.0, 224.95, 387.5600000000004, 0.5657913497292122, 0.30554943007837343, 167.37146882546241], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 2.3579999999999988, 1, 13, 2.0, 3.0, 4.949999999999989, 7.990000000000009, 0.5687660960805191, 0.3165094454985576, 0.23828188986185808], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 471.35600000000005, 358, 737, 473.5, 544.9000000000001, 554.95, 603.98, 0.5685507300759925, 0.6178769477126635, 0.24429914182952803], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 12.085999999999984, 7, 317, 10.0, 15.0, 19.0, 44.97000000000003, 0.5650355972426263, 0.2389261851621652, 0.40998188354616344], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 3.24, 1, 26, 3.0, 4.0, 6.0, 12.990000000000009, 0.5687770951188688, 0.6054365563277021, 0.23106569489204043], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 3.891999999999999, 2, 18, 4.0, 5.0, 7.0, 10.0, 0.5664522078607706, 0.34794769408635223, 0.2832261039303853], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 4.226000000000004, 2, 31, 4.0, 5.0, 6.0, 11.0, 0.5664329564288442, 0.33189431040752587, 0.2671749198780583], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 527.7600000000002, 386, 867, 518.0, 637.0, 657.95, 732.7400000000002, 0.5659444084126505, 0.5166674519145333, 0.249258718939556], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 16.129999999999974, 6, 116, 16.0, 25.900000000000034, 30.0, 38.98000000000002, 0.5661212654395422, 0.5014374880406883, 0.23275102807621806], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 7.231999999999995, 4, 47, 7.0, 9.0, 10.0, 15.0, 0.5663251725875964, 0.37773446570051594, 0.26491187272408073], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 544.3560000000006, 449, 3398, 529.0, 593.0, 624.95, 737.7900000000002, 0.5660610191136164, 0.4256513522631685, 0.3128813836116278], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 12.945999999999998, 8, 37, 13.0, 16.0, 17.0, 27.940000000000055, 0.5683697677300107, 0.4640206306858291, 0.35079071602086603], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 12.796000000000003, 8, 66, 13.0, 16.0, 17.0, 28.0, 0.5683749364841009, 0.4722618466388011, 0.35967476449384506], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 12.650000000000011, 8, 28, 13.0, 16.0, 17.94999999999999, 21.99000000000001, 0.5683542620317756, 0.4601227375237714, 0.34689591188462865], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 15.744000000000005, 10, 50, 16.0, 19.0, 20.0, 27.99000000000001, 0.5683581383770192, 0.508414115970068, 0.3951865180902712], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 12.626000000000007, 8, 50, 13.0, 16.0, 18.0, 33.930000000000064, 0.5682379962564481, 0.42673341711055524, 0.31352975379384096], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 2177.509999999997, 1657, 3480, 2156.5, 2499.0, 2610.75, 2724.94, 0.5671165413150071, 0.4734315470485554, 0.3610937352904147], "isController": false}]}, function(index, item){
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

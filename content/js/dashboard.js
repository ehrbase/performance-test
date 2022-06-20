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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9170415814587594, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.008, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.997, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [1.0, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [0.876, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.721, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.751, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 22005, 0, 0.0, 189.24080890706577, 1, 3679, 12.0, 572.0, 1248.9500000000007, 2137.980000000003, 25.944825537112713, 174.43187294699263, 228.54367100785126], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query participation #2", 500, 0, 0.0, 6.606000000000001, 4, 34, 6.0, 9.0, 11.949999999999989, 17.0, 0.6003568521128959, 6.41669494284903, 0.21692581570485497], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 7.050000000000001, 4, 31, 7.0, 9.0, 10.0, 15.0, 0.6003388312363498, 6.445927143779949, 0.25326794442783507], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 0, 0.0, 19.79399999999999, 13, 241, 18.0, 25.0, 30.0, 49.98000000000002, 0.5964167282963954, 0.32141270248347925, 6.639795607987213], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 40.94999999999997, 24, 68, 42.0, 51.0, 53.0, 56.0, 0.600168767457409, 2.4962097466807665, 0.24967958489927367], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 2.116000000000002, 1, 12, 2.0, 3.0, 3.0, 5.990000000000009, 0.6002119948765904, 0.37513249679786903, 0.25380057986480825], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 36.44000000000005, 21, 81, 37.0, 46.0, 47.0, 52.0, 0.6001608431059524, 2.4626756220667136, 0.21802718128458426], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 742.5520000000006, 553, 986, 740.0, 886.0, 897.95, 920.98, 0.5998130982385889, 2.5369048129602816, 0.29170597941681375], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 8.319999999999999, 5, 28, 8.0, 10.0, 12.0, 20.980000000000018, 0.6000398426455517, 0.8924420706534913, 0.30646566181994483], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 3.102000000000003, 2, 17, 3.0, 4.0, 5.0, 10.970000000000027, 0.5974008284754689, 0.5763984555993783, 0.3267035780725221], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 12.485999999999999, 8, 30, 13.0, 15.0, 17.0, 20.0, 0.6001558004457956, 0.9781836239687823, 0.3920939750959349], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 563.0, 563, 563, 563.0, 563.0, 563.0, 563.0, 1.7761989342806395, 0.758006771758437, 2100.8704068605684], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 4.083999999999998, 2, 26, 4.0, 5.0, 6.0, 11.0, 0.5974115352998528, 0.5996518285572273, 0.3506292311671988], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 13.420000000000016, 8, 35, 14.0, 16.0, 18.0, 22.99000000000001, 0.6001500375093773, 0.9423293323330832, 0.35692516879219804], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 7.961999999999991, 5, 25, 8.0, 10.0, 11.0, 15.0, 0.6001471560826716, 0.9289387132724944, 0.34285750616051053], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 1831.5240000000008, 1424, 2316, 1813.0, 2090.0000000000005, 2174.0, 2267.76, 0.5990312466678887, 0.914926630652908, 0.329935178828798], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 16.747999999999998, 11, 80, 15.0, 21.0, 25.0, 43.97000000000003, 0.5963726231569104, 0.3220645123103237, 4.80825427420259], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 16.997999999999994, 11, 37, 18.0, 20.0, 22.0, 26.99000000000001, 0.6001702082710657, 1.086636295053277, 0.5005325760385646], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 12.506000000000007, 8, 32, 13.0, 15.0, 16.0, 21.0, 0.6001572411971936, 1.016281890855404, 0.4301908349987697], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 75.0, 75, 75, 75.0, 75.0, 75.0, 75.0, 13.333333333333334, 6.2109375, 1818.4375], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 661.0, 661, 661, 661.0, 661.0, 661.0, 661.0, 1.5128593040847202, 0.692901380484115, 2893.2577297655066], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 2.052000000000001, 1, 16, 2.0, 2.0, 3.9499999999999886, 8.0, 0.5972980624845449, 0.5022203435538997, 0.25256841899981247], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 390.796, 304, 617, 395.0, 456.0, 463.9, 495.9200000000001, 0.5970933495742724, 0.5252788799125856, 0.27638891376777847], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 2.814, 1, 13, 3.0, 4.0, 4.0, 9.980000000000018, 0.5973508683689573, 0.5413492244593676, 0.29167522869577994], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 1123.684000000001, 911, 1496, 1116.5, 1303.8000000000002, 1342.95, 1371.99, 0.5967078434859195, 0.5646581057986875, 0.31525287434168203], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 57.0, 57, 57, 57.0, 57.0, 57.0, 57.0, 17.543859649122805, 8.20655153508772, 1155.2049067982455], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 0, 0.0, 40.34199999999995, 26, 564, 39.0, 47.0, 54.0, 79.97000000000003, 0.595979522143619, 0.32185222240763806, 27.26024302554964], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 39.19400000000001, 27, 181, 40.0, 46.0, 52.94999999999999, 79.0, 0.5967605450572114, 135.04446369577386, 0.18415657445124883], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 277.0, 277, 277, 277.0, 277.0, 277.0, 277.0, 3.6101083032490977, 1.893191561371841, 1.4807084837545126], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 2.0039999999999987, 1, 12, 2.0, 3.0, 4.0, 6.990000000000009, 0.6003921761694739, 0.6525746992935786, 0.2573946927132803], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 2.9679999999999995, 2, 15, 3.0, 4.0, 6.0, 9.990000000000009, 0.6003856877658208, 0.6162161697674586, 0.2210404338747211], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 1.924000000000002, 1, 30, 2.0, 3.0, 3.0, 6.0, 0.6003712695931164, 0.34064033948593814, 0.23276112698092502], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 117.62599999999999, 82, 185, 116.0, 145.0, 150.0, 155.0, 0.6002984683984878, 0.5469516318513565, 0.195800476997163], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 0, 0.0, 157.21199999999996, 105, 516, 158.0, 182.0, 214.0, 316.97, 0.5965070930658437, 0.32213713131387844, 176.45774962628832], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 2.1620000000000004, 1, 17, 2.0, 3.0, 4.0, 8.990000000000009, 0.6003820831577216, 0.3341032483072227, 0.25152725944791265], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 446.0080000000001, 336, 613, 458.5, 517.0, 524.0, 551.98, 0.6001594023372608, 0.652227919235349, 0.25788099319179175], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 11.308000000000007, 6, 287, 9.0, 14.0, 19.0, 41.99000000000001, 0.5958019792541751, 0.2519357978682205, 0.43230553768149615], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 2.646000000000001, 1, 19, 2.0, 3.0, 4.0, 8.990000000000009, 0.6003965018498216, 0.6390939326331109, 0.24391107887649002], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 3.308000000000001, 2, 22, 3.0, 4.0, 5.0, 10.0, 0.597291640784029, 0.3668910566925334, 0.2986458203920145], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 3.665999999999998, 1, 31, 3.0, 5.0, 5.0, 10.0, 0.597270949577192, 0.3499634470178859, 0.28172057484939816], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 512.2900000000004, 367, 816, 524.0, 615.0, 624.95, 671.8800000000001, 0.5966907530833995, 0.5447367027465675, 0.2628003219146613], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 14.820000000000011, 6, 116, 14.0, 23.900000000000034, 32.94999999999999, 48.0, 0.5968852141982279, 0.5286864153103444, 0.2453990968529824], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 6.870000000000004, 4, 37, 7.0, 8.0, 10.0, 14.0, 0.5974236701647815, 0.398476920627486, 0.27945892383684595], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 511.77200000000005, 329, 3679, 499.5, 562.8000000000001, 595.9, 677.7300000000002, 0.597204604686384, 0.44906986875831606, 0.3300955139184505], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 12.517999999999999, 8, 24, 13.0, 15.0, 16.0, 18.0, 0.600023280903299, 0.489862756674959, 0.37032686868250486], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 12.342000000000008, 8, 26, 13.0, 15.0, 16.0, 19.0, 0.6000297614761692, 0.49856379126404665, 0.37970633343413834], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 12.467999999999998, 8, 24, 13.0, 15.0, 17.0, 19.0, 0.6000146403572246, 0.4857540398985735, 0.3662198732649077], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 15.152000000000003, 9, 32, 16.0, 18.0, 20.0, 25.99000000000001, 0.6000160804309554, 0.5367331344480032, 0.4171986809246488], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 12.121999999999998, 8, 33, 13.0, 15.0, 16.0, 25.980000000000018, 0.5998346855606596, 0.45046179023061245, 0.33096347396657483], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 2082.4959999999983, 1625, 2665, 2073.5, 2366.8, 2455.1, 2597.87, 0.5986840923649818, 0.49978428663796975, 0.38119338693551574], "isController": false}]}, function(index, item){
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

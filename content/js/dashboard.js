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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.871176345458413, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Query cross patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.468, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [0.5, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [0.995, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [0.806, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [0.842, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [0.848, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.489, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 23505, 500, 2.1272069772388855, 485.5924271431602, 1, 24122, 13.0, 1017.9000000000015, 1800.8500000000022, 10439.990000000002, 10.192793623357087, 64.29702726650892, 84.44851174317802], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query cross patient #1", 500, 500, 100.0, 10982.636000000004, 9225, 24122, 10513.0, 12624.300000000001, 13130.099999999999, 21792.380000000067, 0.2194467571694353, 0.12751056690997462, 0.11100919942750731], "isController": false}, {"data": ["Query participation #2", 500, 0, 0.0, 2.9320000000000004, 1, 15, 3.0, 4.0, 4.0, 8.0, 0.22028712223512126, 0.11309291311545469, 0.08002618112447765], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 4.346, 3, 17, 4.0, 5.0, 6.0, 10.0, 0.22028566645225528, 0.12636738885486698, 0.09336326097683476], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 0, 0.0, 16.758000000000017, 11, 410, 15.0, 20.0, 23.0, 47.960000000000036, 0.21898849215473729, 0.12867926329533882, 2.4383855347151506], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 44.650000000000006, 29, 89, 46.0, 56.0, 58.0, 65.99000000000001, 0.22022735391108367, 0.9159027679440147, 0.09204815183002325], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 2.636000000000001, 1, 10, 2.0, 3.0, 4.0, 8.990000000000009, 0.22023278605486, 0.1375831206710493, 0.09355591985728916], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 39.53600000000005, 24, 75, 40.0, 50.0, 52.0, 60.960000000000036, 0.22022541392467673, 0.9038511224173615, 0.08043389141389562], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 1120.6200000000001, 784, 1655, 1125.5, 1411.4, 1512.95, 1592.96, 0.22015540329607863, 0.9311455582766763, 0.10749775551566339], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 6.521999999999999, 4, 17, 6.0, 8.0, 9.0, 14.0, 0.2200948344622731, 0.32728574744535927, 0.11284158993427088], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 4.194000000000004, 3, 16, 4.0, 5.0, 6.0, 11.0, 0.2191699158606693, 0.2114026539011149, 0.1202866139782189], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 10.107999999999993, 6, 24, 10.0, 12.0, 14.0, 18.99000000000001, 0.22022386196015975, 0.35893908751123693, 0.14430684704615937], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 538.0, 538, 538, 538.0, 538.0, 538.0, 538.0, 1.858736059479554, 0.8821735594795539, 2198.498126742565], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 4.588000000000005, 3, 15, 4.0, 6.0, 7.0, 12.990000000000009, 0.21917116478953869, 0.22017926653383432, 0.12906270739071468], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 15.657999999999998, 7, 37, 16.0, 19.0, 20.0, 24.99000000000001, 0.2202223100175165, 0.34597053940261613, 0.13140217912177984], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 7.536000000000008, 5, 21, 7.0, 9.0, 10.0, 15.0, 0.2202218250399262, 0.3408083284756069, 0.12624044072112958], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 2201.1739999999995, 1576, 3688, 2149.5, 2804.2000000000003, 3063.95, 3343.98, 0.2199432194584646, 0.3358666129876911, 0.12157017794286228], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 14.328000000000003, 9, 56, 13.0, 18.900000000000034, 27.0, 40.99000000000001, 0.21898417620342753, 0.12867672721031678, 1.7659876241092818], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 14.681999999999986, 10, 33, 15.0, 17.0, 19.0, 27.99000000000001, 0.2202258989180742, 0.3986669444174056, 0.18409508737682764], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 10.229999999999993, 6, 47, 10.0, 13.0, 14.0, 21.99000000000001, 0.22022512292966362, 0.372795539637439, 0.15828680710569573], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 62.0, 62, 62, 62.0, 62.0, 62.0, 62.0, 16.129032258064516, 8.285030241935484, 2199.7542842741937], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 757.0, 757, 757, 757.0, 757.0, 757.0, 757.0, 1.321003963011889, 0.6682422391017173, 2526.3478368560104], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 2.6799999999999997, 2, 17, 3.0, 3.0, 4.0, 7.990000000000009, 0.21915051125622773, 0.18426620135899616, 0.09309616444966705], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 701.3140000000006, 540, 1031, 682.0, 839.9000000000001, 864.95, 953.95, 0.21909798237049993, 0.19287041334806257, 0.10184632774253709], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 3.654000000000001, 2, 15, 3.0, 5.0, 6.0, 10.0, 0.21917068443059676, 0.19856136294248916, 0.10744500350015582], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 949.0899999999993, 745, 1426, 915.0, 1148.0, 1183.9, 1302.8700000000001, 0.21909798237049993, 0.2072679750997334, 0.11618184026091942], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 62.0, 62, 62, 62.0, 62.0, 62.0, 62.0, 16.129032258064516, 8.316532258064516, 1062.074722782258], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 0, 0.0, 29.802000000000046, 19, 585, 27.0, 34.0, 40.94999999999999, 91.74000000000024, 0.21892894704809346, 0.12864427414873858, 10.014288945051462], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 36.656000000000006, 26, 252, 35.0, 42.0, 49.94999999999999, 120.86000000000013, 0.21905565108815894, 49.571271296316574, 0.0680270478965181], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 1026.0, 1026, 1026, 1026.0, 1026.0, 1026.0, 1026.0, 0.9746588693957114, 0.511124817251462, 0.4016660575048733], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 3.054, 2, 18, 3.0, 4.0, 5.0, 8.0, 0.22024044971337908, 0.23925769635757535, 0.09484964680039079], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 3.7240000000000006, 2, 14, 4.0, 5.0, 5.0, 7.990000000000009, 0.22023938258972442, 0.2260464756853519, 0.08151438086084527], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 2.0279999999999996, 1, 13, 2.0, 3.0, 3.0, 7.0, 0.2202878016070436, 0.12492512624143191, 0.08583479769649452], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 201.00200000000015, 89, 426, 192.0, 298.80000000000007, 312.95, 371.96000000000004, 0.22026800448641873, 0.20063102584426523, 0.07227543897210614], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 0, 0.0, 112.95800000000001, 79, 452, 110.0, 134.90000000000003, 147.84999999999997, 331.8700000000001, 0.21901947608789163, 0.12875949668448317, 64.79040985990638], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 265.6119999999999, 17, 605, 317.5, 432.80000000000007, 454.9, 505.8700000000001, 0.22023627828879935, 0.1227576368030678, 0.09269710541257081], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 506.8760000000001, 288, 1044, 470.5, 847.4000000000002, 903.95, 970.98, 0.22027372975849627, 0.11846381417509912, 0.09421864612716932], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 8.207999999999995, 4, 281, 7.0, 10.0, 14.0, 30.980000000000018, 0.21890393050763385, 0.10297676988753154, 0.15926116037908908], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 514.0720000000002, 290, 1157, 454.0, 881.7, 929.0, 1026.7600000000002, 0.2202119319633215, 0.11326936199648542, 0.0890309959304835], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 3.918, 2, 20, 4.0, 5.0, 6.0, 11.0, 0.21914935861557214, 0.13455214185077768, 0.11000270539883211], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 4.3759999999999994, 3, 33, 4.0, 5.0, 6.0, 10.990000000000009, 0.21914647706697862, 0.12834407593929467, 0.10379496228269983], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 861.856, 564, 1454, 856.0, 1146.0, 1254.95, 1311.99, 0.21905104458871633, 0.20016430950401148, 0.09690441718621924], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 468.4259999999998, 251, 970, 385.5, 869.7, 897.75, 953.96, 0.2190531558769114, 0.19396258492690854, 0.09048777825774758], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 5.625999999999999, 4, 42, 5.0, 7.0, 8.0, 14.980000000000018, 0.21917222158662278, 0.14618615951529623, 0.10295101424137261], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 1182.904000000001, 903, 10403, 1097.0, 1413.0, 1436.9, 1639.4600000000005, 0.21908483008437832, 0.1646174316050023, 0.1215236166874286], "isController": false}, {"data": ["Query single patient #2", 500, 0, 0.0, 170.57999999999973, 143, 285, 172.0, 189.0, 195.0, 246.94000000000005, 0.22033206686461299, 4.26011190610593, 0.11145704163659133], "isController": false}, {"data": ["Query single patient #1", 500, 0, 0.0, 230.26999999999987, 195, 326, 226.0, 257.0, 262.95, 296.0, 0.22031692148521806, 0.4270167941805929, 0.15792248083022464], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 9.143999999999991, 6, 37, 9.0, 11.0, 13.0, 19.0, 0.22009328433763367, 0.17968553291627123, 0.1362686936231052], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 8.875999999999996, 6, 30, 9.0, 11.0, 13.0, 20.0, 0.2200939625144767, 0.1830003921524177, 0.13970808167422835], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 9.684000000000008, 6, 28, 10.0, 12.0, 13.0, 17.980000000000018, 0.22009173423482908, 0.17811740339623552, 0.13476320055199006], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 11.921999999999992, 8, 33, 12.0, 15.0, 17.0, 19.99000000000001, 0.22009231552082206, 0.19681712328669138, 0.1534628059393232], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 9.132000000000009, 6, 31, 9.0, 11.0, 12.0, 26.0, 0.22008747156469866, 0.16521820338525342, 0.12186484021209389], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 2002.2319999999993, 1595, 2915, 1928.5, 2507.5, 2580.7, 2674.92, 0.2199300622402076, 0.1837855015230157, 0.14046314521982012], "isController": false}]}, function(index, item){
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

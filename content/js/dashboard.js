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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.871176345458413, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Query cross patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.467, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [0.5, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [0.992, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [0.814, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [0.837, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [0.848, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.489, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 23505, 500, 2.1272069772388855, 490.1670282918538, 1, 25637, 12.0, 1024.9000000000015, 1814.9500000000007, 10585.0, 10.107229948188891, 63.757296351464134, 83.73960648184976], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query cross patient #1", 500, 500, 100.0, 11131.19999999999, 8975, 25637, 10658.0, 12858.300000000001, 13213.45, 24058.570000000087, 0.21760758736727026, 0.12644190867531815, 0.11007883814086523], "isController": false}, {"data": ["Query participation #2", 500, 0, 0.0, 2.946, 1, 15, 3.0, 4.0, 4.0, 7.0, 0.2183899159766637, 0.11211890891415223, 0.07933696166339736], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 4.423999999999996, 2, 16, 4.0, 5.0, 6.0, 10.990000000000009, 0.218388485161376, 0.12527906636083544, 0.09255918218753631], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 0, 0.0, 16.48999999999998, 10, 428, 14.0, 20.0, 25.0, 51.950000000000045, 0.2170742815166893, 0.12755445891738978, 2.417071247903605], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 44.96600000000002, 27, 84, 46.0, 55.900000000000034, 58.0, 74.97000000000003, 0.21833489078888763, 0.9080322097183043, 0.09125716138441788], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 2.6880000000000015, 1, 18, 2.0, 3.0, 4.0, 8.990000000000009, 0.21834032531835113, 0.1364132355940145, 0.09275199366551047], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 39.841999999999956, 24, 80, 41.0, 50.0, 51.0, 63.98000000000002, 0.2183342234091841, 0.896076914725639, 0.07974316362796373], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 1117.778, 778, 1867, 1114.0, 1427.8000000000002, 1526.9, 1656.89, 0.21825797831126817, 0.9231204141270531, 0.10657127847229891], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 6.6339999999999995, 4, 25, 6.0, 8.0, 9.0, 14.0, 0.21821816142470274, 0.32449509431934487, 0.11187942846481341], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 4.210000000000002, 2, 22, 4.0, 5.0, 6.0, 11.990000000000009, 0.21724348432479637, 0.20954449404535608, 0.11922933417044489], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 10.270000000000001, 6, 30, 10.0, 12.0, 14.0, 19.0, 0.2183337467118938, 0.35585842115444405, 0.14306830473015694], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 496.0, 496, 496, 496.0, 496.0, 496.0, 496.0, 2.0161290322580645, 0.9568737399193549, 2384.6612745715724], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 4.561999999999998, 3, 17, 4.0, 6.0, 7.0, 12.990000000000009, 0.21724527773939778, 0.21824452115556242, 0.12792861570005554], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 15.902, 8, 37, 17.0, 20.0, 20.0, 25.0, 0.21833136325666555, 0.34301221738642507, 0.13027388959943617], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 7.607999999999998, 5, 17, 8.0, 9.0, 10.0, 13.990000000000009, 0.21833174460600507, 0.3378832997993968, 0.1251569668786377], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 2225.277999999998, 1584, 3491, 2189.0, 2868.9, 3079.75, 3341.87, 0.21806569621616764, 0.33299952131853855, 0.12053240630698328], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 13.765999999999996, 9, 59, 12.0, 17.0, 22.94999999999999, 41.98000000000002, 0.2170707946006679, 0.1275524099796561, 1.7505572478635891], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 14.680000000000009, 10, 37, 14.0, 17.0, 19.0, 28.980000000000018, 0.2183350814695523, 0.39524406628019904, 0.18251448216595387], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 10.207999999999988, 7, 32, 10.0, 12.0, 14.0, 20.99000000000001, 0.2183346047685151, 0.36959528378695256, 0.15692799717737022], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 66.0, 66, 66, 66.0, 66.0, 66.0, 66.0, 15.151515151515152, 7.782907196969696, 2066.43584280303], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 709.0, 709, 709, 709.0, 709.0, 709.0, 709.0, 1.4104372355430184, 0.7134828984485191, 2697.384079689704], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 2.804000000000001, 1, 20, 3.0, 3.0, 4.0, 8.990000000000009, 0.21722375871827554, 0.18264614868792506, 0.09227767093989245], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 701.344, 537, 1038, 694.5, 847.0, 870.95, 915.98, 0.21717186634027183, 0.19117486694965607, 0.10095098474411072], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 3.6500000000000004, 2, 18, 3.0, 4.0, 5.949999999999989, 11.990000000000009, 0.21724348432479637, 0.19681538363570006, 0.10650022376078885], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 951.4760000000003, 735, 1333, 907.0, 1159.0, 1193.95, 1244.99, 0.2171715833589234, 0.20544559034728774, 0.1151603220350541], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 58.0, 58, 58, 58.0, 58.0, 58.0, 58.0, 17.241379310344826, 8.890086206896552, 1135.321255387931], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 0, 0.0, 28.994, 19, 527, 27.0, 33.0, 38.0, 87.97000000000003, 0.2170220837331965, 0.12752378711240397, 9.927064845764574], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 37.124, 27, 229, 35.0, 44.0, 51.0, 108.94000000000005, 0.21713753665281618, 49.13721095329675, 0.06743138345273002], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 1004.0, 1004, 1004, 1004.0, 1004.0, 1004.0, 1004.0, 0.9960159362549801, 0.5223247634462151, 0.41046750498007967], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 2.953999999999998, 2, 9, 3.0, 4.0, 4.0, 6.990000000000009, 0.21835396050413564, 0.2372083132265728, 0.09403720369367559], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 3.751999999999998, 2, 14, 4.0, 5.0, 5.0, 9.0, 0.21835291158322892, 0.22411026374411483, 0.08081616551762086], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 2.057999999999999, 1, 12, 2.0, 3.0, 3.0, 7.990000000000009, 0.21839048830802843, 0.12383679083694661, 0.0850955125340853], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 206.6499999999999, 87, 418, 219.5, 306.80000000000007, 314.0, 352.96000000000004, 0.218370553866338, 0.19890273368815636, 0.07165283798739215], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 0, 0.0, 112.80600000000004, 79, 361, 111.0, 131.0, 156.84999999999997, 279.7900000000002, 0.21710614015243457, 0.12763466442555235, 64.22440622556198], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 275.948, 17, 605, 341.0, 453.80000000000007, 475.95, 531.95, 0.21835033700191012, 0.12171879831001206, 0.0919033156717024], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 496.87200000000064, 301, 1077, 467.5, 794.9000000000001, 858.75, 924.95, 0.21837284280387237, 0.11742914319886517, 0.0934055714336876], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 8.14600000000001, 4, 259, 7.0, 10.0, 13.949999999999989, 30.980000000000018, 0.216999478767252, 0.10208087784860642, 0.1578755973453152], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 503.8200000000003, 290, 1113, 454.5, 865.9000000000001, 916.8, 995.95, 0.21832650116935676, 0.11229956194424988, 0.08826872215245476], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 4.030000000000001, 2, 15, 4.0, 5.0, 7.0, 12.990000000000009, 0.21722262625630706, 0.13336917710312773, 0.10903557607006038], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 4.448000000000004, 2, 28, 4.0, 5.0, 6.0, 12.0, 0.21722017262921559, 0.12721592746822938, 0.1028826012941109], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 870.5059999999994, 553, 1422, 867.0, 1148.0, 1269.6999999999998, 1366.91, 0.21713159607790855, 0.19841035719341776, 0.09605528615555915], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 473.8520000000002, 229, 995, 386.5, 874.9000000000001, 905.9, 946.99, 0.21713376482155078, 0.19226304287241044, 0.08969490480421483], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 5.3980000000000015, 3, 39, 5.0, 6.0, 7.949999999999989, 15.980000000000018, 0.217246221653713, 0.1449015326069199, 0.10204632091351167], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 1202.3460000000007, 905, 10636, 1131.5, 1421.9, 1447.9, 1697.1300000000008, 0.21716196243184915, 0.1631726143889779, 0.12045702603641632], "isController": false}, {"data": ["Query single patient #2", 500, 0, 0.0, 170.64399999999992, 143, 295, 173.0, 189.0, 199.74999999999994, 234.98000000000002, 0.2184417241168401, 4.223562202919255, 0.11050079403566716], "isController": false}, {"data": ["Query single patient #1", 500, 0, 0.0, 229.88400000000033, 195, 478, 222.5, 256.0, 262.0, 322.9000000000001, 0.21842263906969428, 0.42334530858204394, 0.15656466511440978], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 9.217999999999996, 6, 30, 9.0, 11.0, 12.0, 18.99000000000001, 0.21821578049238208, 0.17815272704260882, 0.13510625471891627], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 8.899999999999995, 5, 34, 9.0, 11.0, 12.0, 16.99000000000001, 0.2182169233334119, 0.18143970006302107, 0.1385166017253103], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 9.929999999999994, 6, 26, 10.0, 12.0, 13.0, 17.99000000000001, 0.21821482813400137, 0.17659844748332837, 0.1336139621484559], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 12.293999999999997, 8, 34, 12.0, 15.0, 16.0, 23.0, 0.21821511384064274, 0.19515079919103293, 0.15215389773654192], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 9.26999999999999, 6, 34, 9.0, 11.0, 12.0, 24.970000000000027, 0.2181691247054717, 0.16377811313705384, 0.12080263057422112], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 2015.5160000000008, 1629, 2882, 1937.0, 2508.0, 2594.95, 2824.5800000000004, 0.21801568230405952, 0.18218574170352222, 0.139240484596538], "isController": false}]}, function(index, item){
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

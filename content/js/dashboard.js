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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8620718995958306, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Query cross patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.448, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [0.5, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [0.974, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [0.601, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [0.724, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.274, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 23505, 500, 2.1272069772388855, 493.8128908742823, 1, 29437, 14.0, 1211.9000000000015, 2344.0, 9665.970000000005, 10.040966974381758, 63.25070673971341, 83.0898585846423], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query cross patient #1", 500, 500, 100.0, 9885.03600000001, 8426, 29437, 9633.5, 10374.6, 10606.45, 28118.81000000015, 0.21656065300833066, 0.1257722519048675, 0.10912626655497912], "isController": false}, {"data": ["Query participation #2", 500, 0, 0.0, 3.5399999999999983, 2, 11, 3.0, 4.0, 5.0, 8.0, 0.217333191342315, 0.11157639845758635, 0.07852859452798491], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 5.075999999999999, 3, 16, 5.0, 6.0, 7.0, 11.980000000000018, 0.21733196327263687, 0.12473453919429825, 0.09168692200564367], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 0, 0.0, 20.556000000000004, 12, 559, 18.0, 23.900000000000034, 27.0, 83.0, 0.2159215358412476, 0.11232769663866309, 2.3757694768782582], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 53.171999999999976, 31, 78, 55.0, 68.0, 71.0, 73.99000000000001, 0.21726208064073196, 0.9035705033647379, 0.09038442026655451], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 3.5140000000000002, 2, 23, 3.0, 4.0, 5.0, 9.990000000000009, 0.21726850041281015, 0.13573128163972537, 0.09187232488158865], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 46.428, 27, 75, 47.0, 60.0, 62.0, 67.97000000000003, 0.21726075897004496, 0.8916835589169898, 0.07892676009458664], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 1211.2680000000005, 845, 1786, 1172.5, 1510.5000000000002, 1718.35, 1768.99, 0.217184789941043, 0.9185198648882563, 0.10562307167054631], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 8.871999999999987, 6, 27, 9.0, 11.0, 12.0, 17.99000000000001, 0.21724348432479637, 0.32304572853145574, 0.11095541240416847], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 5.4480000000000075, 3, 27, 5.0, 6.900000000000034, 8.0, 15.990000000000009, 0.21604888927105537, 0.20839223478702548, 0.11815173632010839], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 11.806000000000004, 8, 32, 11.0, 15.0, 16.0, 22.99000000000001, 0.2172604757569898, 0.3540475864262172, 0.14194068191545525], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 653.0, 653, 653, 653.0, 653.0, 653.0, 653.0, 1.5313935681470139, 0.6625071784073506, 1811.3170582886676], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 5.957999999999996, 4, 32, 6.0, 7.0, 8.0, 15.0, 0.216050102883059, 0.21704384896174964, 0.12680284358663912], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 12.227999999999986, 8, 32, 12.0, 15.0, 16.0, 23.99000000000001, 0.2172593429121529, 0.3413157007189546, 0.12920990218115344], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 9.372000000000005, 6, 28, 9.0, 11.0, 12.0, 18.0, 0.21725868209145371, 0.33622266220424574, 0.12411750881201214], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 2344.658, 1970, 2955, 2297.0, 2696.9, 2771.9, 2922.98, 0.21705166567618758, 0.3314633292296098, 0.11954798773571268], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 18.394000000000013, 13, 103, 17.0, 22.0, 24.94999999999999, 93.88000000000011, 0.21591389008601147, 0.11232371912863201, 1.7408057388184675], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 17.127999999999993, 12, 40, 17.0, 20.900000000000034, 22.0, 29.99000000000001, 0.2172627414821056, 0.3933028481570254, 0.1811937316657404], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 12.046000000000003, 8, 27, 12.0, 15.0, 16.0, 22.0, 0.21726179742423105, 0.3678407722776988, 0.15573257745057184], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 107.0, 107, 107, 107.0, 107.0, 107.0, 107.0, 9.345794392523365, 4.408221378504673, 1274.6057242990655], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 581.0, 581, 581, 581.0, 581.0, 581.0, 581.0, 1.721170395869191, 0.7983944707401033, 3291.6408939328744], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 3.528000000000001, 2, 27, 3.0, 4.0, 5.0, 11.970000000000027, 0.21605383715935872, 0.18160126775530436, 0.0913587026269554], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 772.3019999999997, 575, 995, 746.0, 943.0, 953.95, 964.99, 0.21599335777226178, 0.19019860413752557, 0.09998130037505087], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 4.688, 3, 19, 4.0, 6.0, 7.0, 13.0, 0.21605421059408858, 0.19573794112328313, 0.10549522001664483], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 1042.846000000001, 817, 1483, 994.0, 1301.8000000000002, 1324.95, 1366.9, 0.21597171288893266, 0.20431050585218552, 0.11410224284464118], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 94.0, 94, 94, 94.0, 94.0, 94.0, 94.0, 10.638297872340425, 5.038646941489362, 700.4965924202128], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 0, 0.0, 36.99400000000002, 24, 1322, 34.0, 41.0, 45.0, 112.95000000000005, 0.2157920041293958, 0.11226031105446332, 9.843402844613358], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 47.362000000000045, 31, 411, 45.0, 54.0, 60.89999999999998, 176.94000000000005, 0.21599494399035107, 48.85170936981207, 0.06665468974702239], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 626.0, 626, 626, 626.0, 626.0, 626.0, 626.0, 1.5974440894568689, 0.8377221445686901, 0.655201677316294], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 4.142000000000004, 3, 26, 4.0, 5.0, 6.0, 10.0, 0.21731505510892482, 0.2361412450881365, 0.09316534100861133], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 4.969999999999997, 3, 34, 5.0, 6.0, 7.0, 11.0, 0.21731411059636643, 0.22298252846162905, 0.08000724579573255], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 2.8259999999999965, 1, 15, 3.0, 4.0, 5.0, 9.0, 0.2173339470843999, 0.12324999649549011, 0.08425935253174488], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 126.87799999999999, 82, 173, 130.0, 161.0, 167.95, 172.0, 0.21732468960601206, 0.19795010863517923, 0.07088520149258597], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 0, 0.0, 126.84799999999998, 83, 433, 126.0, 141.90000000000003, 158.0, 411.9200000000001, 0.2159617315811638, 0.11234860745175955, 63.85844990767636], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 262.1339999999998, 16, 536, 279.5, 485.80000000000007, 502.0, 518.99, 0.21731165490213802, 0.12111517047773361, 0.09104169917286839], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 576.4620000000003, 457, 763, 544.0, 700.0, 711.95, 735.97, 0.21728653444925905, 0.11686959961479444, 0.09251653224597357], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 10.937999999999994, 7, 389, 9.0, 12.900000000000034, 17.0, 44.99000000000001, 0.21575838857826873, 0.09728301327194575, 0.1565512526500524], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 536.2260000000007, 395, 698, 522.5, 645.0, 657.95, 676.98, 0.21727624240728172, 0.11175934534994078, 0.08741973815605475], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 5.031999999999997, 3, 19, 5.0, 6.0, 7.0, 13.970000000000027, 0.21605243679061883, 0.13265071048303706, 0.1080262183953094], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 5.708000000000002, 3, 46, 5.0, 7.0, 8.0, 14.990000000000009, 0.21604851585472035, 0.12652974164378353, 0.10190569644319328], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 938.5840000000003, 676, 1429, 892.0, 1160.6000000000001, 1336.6499999999999, 1405.99, 0.2159635038955497, 0.19735521104817452, 0.09511673853212198], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 324.1460000000005, 226, 479, 321.0, 396.90000000000003, 401.95, 408.99, 0.21600670139190398, 0.1912650744326692, 0.08880744266210115], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 6.807999999999998, 4, 66, 7.0, 8.0, 9.0, 17.970000000000027, 0.21605094308397166, 0.14404310483677568, 0.10106289232150628], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 1584.988, 1270, 14325, 1465.0, 1764.9, 1807.95, 4716.470000000025, 0.2159339380347334, 0.16232327696593815, 0.1193541102809171], "isController": false}, {"data": ["Query single patient #2", 500, 0, 0.0, 172.44000000000003, 131, 228, 183.5, 206.0, 208.0, 212.0, 0.21733224667209997, 4.202048950692746, 0.10951507742461287], "isController": false}, {"data": ["Query single patient #1", 500, 0, 0.0, 232.71999999999994, 179, 312, 224.0, 281.0, 284.0, 289.0, 0.21731760533384328, 0.4212035395333321, 0.15534813193786454], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 11.104000000000001, 7, 35, 11.0, 14.0, 15.0, 21.99000000000001, 0.21724103022648247, 0.17729541149470085, 0.13407844834290716], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 10.932000000000002, 8, 32, 11.0, 13.0, 15.0, 19.99000000000001, 0.21724206849207936, 0.18069066616737198, 0.13747349646764398], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 12.422, 8, 38, 13.0, 15.0, 16.94999999999999, 21.0, 0.21723753795139789, 0.17580753913642863, 0.13259127072228874], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 15.190000000000003, 10, 36, 15.0, 18.0, 20.94999999999999, 27.99000000000001, 0.21723952003969402, 0.1942660164995588, 0.15104935377759973], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 11.540000000000003, 7, 41, 12.0, 14.0, 15.0, 31.8900000000001, 0.21727718659069498, 0.1631085411173175, 0.11988438517943618], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 2644.7639999999997, 2289, 3354, 2599.5, 3041.9, 3168.85, 3272.99, 0.21701388888888887, 0.18136088053385416, 0.1381768120659722], "isController": false}]}, function(index, item){
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

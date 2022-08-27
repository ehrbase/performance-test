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

    var data = {"OkPercent": 97.8557753669432, "KoPercent": 2.1442246330567962};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.900276536907041, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Query cross patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [0.998, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.499, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.98, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.493, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.997, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [1.0, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [0.995, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.703, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.652, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #2"], "isController": false}, {"data": [0.997, 500, 1500, "Query single patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 23505, 504, 2.1442246330567962, 189.89959583067454, 1, 3412, 17.0, 551.0, 1207.9000000000015, 2242.9900000000016, 25.847479527102738, 173.63828888661473, 214.0989695819262], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query cross patient #1", 500, 500, 100.0, 25.144000000000016, 16, 60, 26.0, 29.900000000000034, 32.0, 42.98000000000002, 0.5597781487240976, 0.3251031863551837, 0.28207570775550234], "isController": false}, {"data": ["Query participation #2", 500, 0, 0.0, 7.507999999999995, 4, 31, 7.0, 10.0, 12.0, 21.0, 0.5596666177891153, 5.991094506074622, 0.2022232896308327], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 7.98600000000001, 5, 43, 7.0, 10.0, 12.0, 22.970000000000027, 0.5596478248167993, 6.009402153412901, 0.2361014260945872], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 1, 0.2, 22.071999999999992, 9, 251, 20.0, 28.0, 32.0, 43.99000000000001, 0.5566341889171906, 0.30031501668232663, 6.196904056304661], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 43.470000000000006, 25, 98, 44.0, 53.0, 54.94999999999999, 67.98000000000002, 0.5594618424644965, 2.326838954572817, 0.23274486805651906], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 2.5100000000000002, 1, 12, 2.0, 3.0, 4.0, 7.0, 0.5594950221727877, 0.34958931841477153, 0.23658334433673545], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 38.53600000000003, 23, 76, 39.0, 47.0, 49.0, 63.99000000000001, 0.5594574605330734, 2.2961303358954623, 0.2032404055842806], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 789.6339999999999, 572, 1699, 799.0, 925.0, 951.9, 1197.5900000000004, 0.559136514298239, 2.364705169762233, 0.2719238126176982], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 11.23, 7, 43, 11.0, 14.0, 16.0, 25.99000000000001, 0.5593291629750942, 0.8316711206747076, 0.2856730002304436], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 3.366000000000001, 1, 32, 3.0, 5.0, 6.0, 11.980000000000018, 0.5572570470726174, 0.5376028522366069, 0.3047499476178376], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 18.03200000000001, 11, 38, 19.0, 22.0, 24.94999999999999, 33.98000000000002, 0.5594411853887389, 0.9116651371777759, 0.36549429006354134], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 723.0, 723, 723, 723.0, 723.0, 723.0, 723.0, 1.3831258644536653, 0.5902597683264177, 1635.9474952455048], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 4.321999999999995, 2, 25, 4.0, 6.0, 7.0, 12.0, 0.55726698438315, 0.5598933227294715, 0.32706782970143866], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 18.899999999999988, 12, 89, 19.0, 23.0, 26.0, 35.99000000000001, 0.5594292926128481, 0.8789300694503495, 0.3327074601574458], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 10.77399999999999, 7, 57, 11.0, 14.0, 15.949999999999989, 24.0, 0.5594255371044581, 0.8658443192854122, 0.3195936906309649], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 2020.9159999999988, 1503, 3240, 1988.5, 2292.9, 2364.95, 2822.5000000000005, 0.5584071547591924, 0.8527215351254852, 0.30756019070721147], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 19.11800000000001, 12, 211, 17.0, 25.0, 30.0, 48.960000000000036, 0.5565976300072913, 0.300458358148311, 4.487568391933787], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 23.100000000000005, 14, 72, 24.0, 28.0, 32.0, 42.98000000000002, 0.5594593384952782, 1.0127055401160319, 0.466580346752898], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 18.158000000000005, 11, 58, 19.0, 22.900000000000034, 24.0, 34.97000000000003, 0.5594512007501121, 0.9470984343198696, 0.4010128724126781], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 81.0, 81, 81, 81.0, 81.0, 81.0, 81.0, 12.345679012345679, 5.750868055555555, 1683.7384259259259], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 742.0, 742, 742, 742.0, 742.0, 742.0, 742.0, 1.3477088948787064, 0.6172612028301887, 2577.4169263814015], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 2.2680000000000016, 1, 16, 2.0, 3.0, 4.0, 9.0, 0.5572315843319852, 0.4683738251468584, 0.23562624610913047], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 410.07199999999983, 318, 818, 409.5, 474.0, 490.9, 586.6500000000003, 0.5570217606121001, 0.49040543942889675, 0.2578401509083354], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 2.976, 2, 12, 3.0, 4.0, 6.0, 9.990000000000009, 0.5572526996107033, 0.5047893170338776, 0.2720960447317887], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 1165.371999999999, 933, 2205, 1148.5, 1357.9, 1385.95, 1590.92, 0.5566360479731212, 0.5265809629219161, 0.29408213081392437], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 55.0, 55, 55, 55.0, 55.0, 55.0, 55.0, 18.18181818181818, 8.504971590909092, 1197.2123579545455], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 1, 0.2, 45.59999999999997, 22, 638, 44.0, 53.900000000000034, 63.0, 94.99000000000001, 0.5562118855805406, 0.2999611590287651, 25.44126200861461], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 45.51800000000001, 26, 202, 44.5, 56.0, 69.94999999999999, 95.95000000000005, 0.5569156673743207, 125.55240595573969, 0.17186069422879433], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 311.0, 311, 311, 311.0, 311.0, 311.0, 311.0, 3.215434083601286, 1.686218850482315, 1.31883038585209], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 2.330000000000003, 1, 22, 2.0, 4.0, 4.949999999999989, 12.990000000000009, 0.5596816530757306, 0.6081039542208392, 0.23994164619164618], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 3.181999999999999, 1, 20, 3.0, 5.0, 6.0, 11.0, 0.5596766412237665, 0.5742752379884998, 0.20605282591929686], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 2.3559999999999994, 1, 20, 2.0, 3.0, 4.0, 11.0, 0.5596797736207252, 0.3173941809954017, 0.2169852247338163], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 127.72200000000008, 86, 371, 125.0, 153.90000000000003, 160.95, 289.8600000000001, 0.5596083636827603, 0.5098141491658478, 0.18252850924808783], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 2, 0.4, 175.95199999999997, 38, 600, 177.0, 210.0, 242.95, 310.97, 0.5566843877863444, 0.30008441596849167, 164.67746228463272], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 2.4319999999999986, 1, 40, 2.0, 3.0, 4.949999999999989, 12.990000000000009, 0.5596722559269292, 0.3119877687126419, 0.23447206815688731], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 3.5040000000000004, 1, 26, 3.0, 5.0, 7.0, 18.960000000000036, 0.5597148588623012, 0.3010478841658905, 0.23831609224996417], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 12.767999999999999, 7, 365, 10.0, 16.0, 22.0, 47.0, 0.5560077752127286, 0.23488830811560069, 0.40343142283501693], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 4.525999999999998, 2, 49, 4.0, 6.0, 6.0, 11.990000000000009, 0.5596847855287902, 0.2878506949885824, 0.22518567542759918], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 3.678, 2, 20, 3.0, 5.0, 6.0, 10.0, 0.5572247532608793, 0.34218497333400943, 0.27861237663043964], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 4.086000000000001, 2, 28, 4.0, 5.0, 6.0, 15.990000000000009, 0.5572110916211054, 0.3263961916432824, 0.26282515356737685], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 535.3779999999998, 381, 1110, 535.5, 641.0, 659.95, 813.8400000000001, 0.5567618729469406, 0.5086944021073437, 0.24521445771393577], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 16.127999999999986, 5, 106, 15.0, 26.900000000000034, 36.94999999999999, 52.99000000000001, 0.5570329306727955, 0.4931667116702855, 0.2290145154426239], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 9.564, 6, 56, 10.0, 12.0, 13.0, 20.980000000000018, 0.5572744375986376, 0.37153987430953694, 0.2606781793063939], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 530.5440000000002, 392, 3298, 517.0, 583.0, 601.95, 655.96, 0.5570552721382122, 0.4186270370118664, 0.3079035976857696], "isController": false}, {"data": ["Query single patient #2", 500, 0, 0.0, 176.96599999999995, 142, 315, 183.0, 193.0, 199.0, 255.91000000000008, 0.5596565947134838, 10.820843299301549, 0.2820144559298415], "isController": false}, {"data": ["Query single patient #1", 500, 0, 0.0, 271.9900000000001, 212, 1263, 269.0, 296.0, 324.95, 481.6700000000003, 0.5595839381503065, 1.084676958487825, 0.40001508078713316], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 18.423999999999978, 12, 41, 19.0, 22.0, 25.0, 33.99000000000001, 0.5593066387460792, 0.4564630381508651, 0.3451970661010958], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 17.93400000000001, 11, 47, 18.0, 22.0, 24.0, 41.940000000000055, 0.559317900633819, 0.46511653108800755, 0.3539433589948386], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 17.694000000000017, 11, 49, 18.0, 22.0, 24.0, 37.99000000000001, 0.5592828651390042, 0.45271544764441246, 0.341359170617068], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 20.707999999999984, 13, 47, 21.0, 25.900000000000034, 27.0, 39.99000000000001, 0.5592941260693703, 0.5002110374039133, 0.38888419703260907], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 17.254000000000005, 11, 43, 18.0, 21.0, 23.0, 33.0, 0.5591021267126696, 0.41965091794784914, 0.30848896639908036], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 2191.654000000001, 1698, 3412, 2154.5, 2527.4, 2649.7999999999997, 3182.960000000002, 0.5580693479294511, 0.4663530485514752, 0.3553332176269552], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["No results for path: $['rows'][1]", 500, 99.2063492063492, 2.1272069772388855], "isController": false}, {"data": ["500", 4, 0.7936507936507936, 0.017017655817911082], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 23505, 504, "No results for path: $['rows'][1]", 500, "500", 4, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["Query cross patient #1", 500, 500, "No results for path: $['rows'][1]", 500, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 1, "500", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 1, "500", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 2, "500", 2, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});

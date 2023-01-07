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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8709636247606892, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Query cross patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.466, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [0.5, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [0.999, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [0.989, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [0.804, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [0.839, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [0.848, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.493, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 23505, 500, 2.1272069772388855, 485.45130823228857, 1, 22777, 13.0, 1012.0, 1835.9500000000007, 10445.94000000001, 10.162294062764543, 64.10462114568895, 84.19581924335549], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query cross patient #1", 500, 500, 100.0, 10962.361999999992, 8917, 22777, 10558.5, 12569.100000000002, 12933.9, 20103.39000000005, 0.21869721196046304, 0.1270750401528081, 0.11063003495656236], "isController": false}, {"data": ["Query participation #2", 500, 0, 0.0, 2.9159999999999977, 1, 8, 3.0, 4.0, 4.0, 7.0, 0.2194550404653149, 0.1126657317607624, 0.07972390141904018], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 4.424000000000003, 2, 21, 4.0, 5.0, 6.0, 9.990000000000009, 0.21945311406163384, 0.12588979322469232, 0.0930104018581534], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 0, 0.0, 16.55800000000001, 11, 401, 14.0, 19.0, 25.94999999999999, 41.960000000000036, 0.2182574066742242, 0.1282496720409643, 2.430245069237797], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 45.19199999999998, 28, 106, 47.0, 56.0, 58.0, 63.99000000000001, 0.21940621656797776, 0.9124877427345824, 0.09170494208114695], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 2.736000000000002, 1, 13, 3.0, 4.0, 4.0, 8.0, 0.21940997148109193, 0.13706909458610284, 0.09320638436940916], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 39.80400000000003, 25, 61, 41.0, 49.0, 51.94999999999999, 55.99000000000001, 0.21940438729789016, 0.900481457559293, 0.08013402426700285], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 1129.210000000001, 779, 1793, 1123.5, 1464.7000000000007, 1516.95, 1576.8300000000002, 0.21933451276812, 0.9276736082018825, 0.10709693006255859], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 6.680000000000001, 4, 20, 6.0, 8.0, 9.0, 13.990000000000009, 0.21930180445910746, 0.32610649479289794, 0.11243500716897598], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 4.274, 2, 21, 4.0, 5.0, 6.0, 12.0, 0.2184181545675386, 0.21067753461709332, 0.1198740262372624], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 10.292000000000005, 7, 24, 10.0, 13.0, 14.0, 19.0, 0.21940313570961556, 0.3576013999017074, 0.1437690469347188], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 543.0, 543, 543, 543.0, 543.0, 543.0, 543.0, 1.8416206261510129, 0.8740504143646408, 2178.2541292587475], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 4.582000000000004, 3, 15, 4.0, 6.0, 6.0, 13.0, 0.2184193949433289, 0.21942403883999206, 0.12862001479572982], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 15.896000000000006, 7, 26, 17.0, 20.0, 20.0, 22.0, 0.2194018841356202, 0.3446816455349742, 0.13091264766295307], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 7.699999999999998, 5, 18, 7.0, 9.0, 11.0, 15.980000000000018, 0.21940226923379025, 0.3395400098412888, 0.12577063675804187], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 2224.846000000003, 1609, 3454, 2146.5, 2861.0000000000005, 3198.7999999999993, 3322.91, 0.21914618891628704, 0.33464949909207736, 0.12112963176427585], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 13.718000000000005, 9, 55, 12.0, 17.0, 21.94999999999999, 33.0, 0.21825302422303014, 0.12824709688011668, 1.7600912832361162], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 14.718, 10, 43, 15.0, 18.0, 19.0, 24.0, 0.21940457985119982, 0.3971801403476246, 0.18340851596936233], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 10.296000000000005, 6, 33, 10.0, 12.0, 14.0, 19.99000000000001, 0.21940419474491848, 0.3714058781784537, 0.15769676497291016], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 64.0, 64, 64, 64.0, 64.0, 64.0, 64.0, 15.625, 8.026123046875, 2131.011962890625], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 711.0, 711, 711, 711.0, 711.0, 711.0, 711.0, 1.4064697609001406, 0.7114759142053446, 2689.79650140647], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 2.7739999999999987, 2, 15, 3.0, 3.0, 4.0, 8.990000000000009, 0.2184052745747431, 0.1836395912195838, 0.09277958441407543], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 693.2779999999999, 527, 1003, 669.5, 834.0, 855.0, 942.97, 0.21835024164821243, 0.19221218244778482, 0.10149874514116125], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 3.6379999999999986, 2, 17, 3.0, 4.0, 5.0, 11.0, 0.21841672338220916, 0.19787829926651293, 0.10707538587682519], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 942.7940000000003, 736, 1292, 903.0, 1134.9, 1172.95, 1219.99, 0.21834499732309035, 0.20655564683286212, 0.1157825522914434], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 73.0, 73, 73, 73.0, 73.0, 73.0, 73.0, 13.698630136986301, 7.0633561643835625, 902.0360659246576], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 0, 0.0, 29.42599999999998, 20, 546, 27.0, 34.0, 39.94999999999999, 76.94000000000005, 0.2182019721094239, 0.12821709827925926, 9.98103552109904], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 36.58599999999998, 25, 253, 35.0, 42.0, 48.94999999999999, 104.97000000000003, 0.21831963741474616, 49.4047148377121, 0.06779848115028252], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 974.0, 974, 974, 974.0, 974.0, 974.0, 974.0, 1.026694045174538, 0.538412795174538, 0.42311024127310065], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 3.082, 2, 19, 3.0, 4.0, 4.0, 8.0, 0.2194197926307424, 0.238366177459268, 0.09449621928726307], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 3.8659999999999974, 2, 22, 4.0, 5.0, 5.949999999999989, 9.0, 0.2194181557114107, 0.22520359536395768, 0.0812104306783444], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 2.084, 1, 15, 2.0, 3.0, 4.0, 6.980000000000018, 0.21945561839301428, 0.12445319546582748, 0.08551053880743428], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 205.896, 91, 519, 222.0, 303.90000000000003, 316.0, 351.9000000000001, 0.2194360668630473, 0.19987325578499301, 0.0720024594394374], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 0, 0.0, 112.51000000000002, 82, 374, 111.0, 129.0, 140.0, 237.86000000000013, 0.21828637338582682, 0.1283285124787771, 64.57354318948698], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 280.232, 18, 537, 347.5, 461.90000000000003, 488.0, 511.98, 0.21941526708981632, 0.12230001285773465, 0.09235154308174885], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 505.60799999999995, 275, 1084, 473.5, 806.7000000000005, 896.0, 973.95, 0.219468429905295, 0.11803072171205567, 0.09387419169777265], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 8.361999999999997, 5, 266, 7.0, 10.0, 13.949999999999989, 32.0, 0.2181786446742593, 0.10263558098245845, 0.15873348660383124], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 516.1320000000003, 291, 1097, 461.0, 895.6000000000001, 919.95, 1010.6700000000003, 0.2193926421850805, 0.11284794781767946, 0.08869975963342124], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 3.9960000000000018, 2, 16, 4.0, 5.0, 6.0, 13.0, 0.2184041297600088, 0.13409459025528822, 0.10962863544594192], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 4.538000000000001, 3, 27, 4.0, 5.0, 6.0, 11.0, 0.21840184016654451, 0.12790797613894375, 0.10344227781325593], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 854.8120000000005, 587, 1398, 859.0, 1086.2000000000003, 1197.0, 1339.8500000000001, 0.2183159197278561, 0.1994925676255393, 0.09657921058273322], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 467.68399999999986, 241, 997, 388.0, 871.0, 894.95, 936.96, 0.21831887480198478, 0.19331240915205822, 0.090184457071523], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 5.629999999999996, 3, 48, 5.0, 6.0, 7.0, 13.990000000000009, 0.2184204445030782, 0.14568473007383048, 0.10259788457615295], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 1177.6260000000002, 911, 9778, 1099.0, 1414.9, 1431.95, 1623.4400000000005, 0.21833727432113484, 0.16405572813297614, 0.12110895685000449], "isController": false}, {"data": ["Query single patient #2", 500, 0, 0.0, 170.55799999999996, 143, 287, 172.0, 189.0, 191.0, 243.9000000000001, 0.21953588357924278, 4.244705298734551, 0.11105428485746852], "isController": false}, {"data": ["Query single patient #1", 500, 0, 0.0, 231.43200000000002, 196, 372, 226.5, 259.90000000000003, 263.0, 294.99, 0.21952132935092372, 0.42547478278913264, 0.1573522028745879], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 9.339999999999998, 6, 25, 9.0, 11.0, 12.0, 19.980000000000018, 0.2192989189001896, 0.17903700800835792, 0.13577686970968772], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 9.078000000000005, 6, 24, 9.0, 11.0, 12.949999999999989, 18.980000000000018, 0.21930065022642792, 0.1823407808747903, 0.13920451430388492], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 10.236000000000011, 6, 24, 10.0, 12.0, 13.0, 18.99000000000001, 0.2192967066897776, 0.17747399785242735, 0.13427640145946343], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 12.405999999999999, 8, 37, 12.0, 15.0, 16.0, 22.99000000000001, 0.2192974761492065, 0.19610633973104483, 0.15290859176809907], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 9.450000000000005, 5, 28, 10.0, 11.0, 12.0, 25.980000000000018, 0.21927266380325802, 0.16460653260957273, 0.12141367224262432], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 1987.0780000000018, 1591, 2692, 1936.0, 2427.9, 2562.0, 2620.0, 0.21912006640214493, 0.18310862502048775, 0.1399458236591824], "isController": false}]}, function(index, item){
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

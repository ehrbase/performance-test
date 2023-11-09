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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8617315464794725, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Query cross patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.444, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [0.5, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [0.998, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [0.967, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [0.579, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [0.705, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.312, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 23505, 500, 2.1272069772388855, 494.6405020208469, 1, 29057, 14.0, 1208.0, 2334.0, 9765.0, 10.020420256553452, 63.121277529644544, 82.91983274120629], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query cross patient #1", 500, 500, 100.0, 9963.236000000008, 8612, 29057, 9739.5, 10427.7, 10706.25, 27700.510000000148, 0.21626886891814093, 0.12560279202569102, 0.10897923472828196], "isController": false}, {"data": ["Query participation #2", 500, 0, 0.0, 3.3940000000000006, 2, 11, 3.0, 4.0, 5.0, 8.990000000000009, 0.2170511945629544, 0.1114316245055574, 0.07842670116044251], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 4.978000000000005, 3, 17, 5.0, 6.0, 7.0, 11.970000000000027, 0.21704987545678145, 0.12457263896943851, 0.09156791620832969], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 0, 0.0, 20.96199999999998, 13, 552, 18.0, 23.0, 29.94999999999999, 86.98000000000002, 0.2154171466878752, 0.11207750235020107, 2.3702197184885643], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 50.80799999999998, 30, 74, 53.5, 64.0, 66.0, 69.99000000000001, 0.21698940223759472, 0.9024364621125653, 0.09027098179024935], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 3.4680000000000044, 2, 28, 3.0, 4.0, 5.0, 9.0, 0.21699552338235262, 0.13556074830363748, 0.09175689611773308], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 43.94800000000001, 28, 69, 44.0, 57.0, 59.0, 63.98000000000002, 0.2169891197315584, 0.8905686947138847, 0.0788280786524802], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 1222.298000000002, 855, 1785, 1198.5, 1546.0000000000005, 1727.9, 1754.0, 0.21691070567126056, 0.9173607052320164, 0.10548977678153101], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 8.590000000000007, 6, 22, 8.0, 11.0, 13.0, 17.99000000000001, 0.21696143770798465, 0.3226263191526615, 0.11081135929812108], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 5.2540000000000004, 3, 27, 5.0, 6.0, 7.0, 14.0, 0.21554855166461678, 0.20790962887173697, 0.11787811419158731], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 11.826000000000008, 8, 48, 12.0, 14.0, 16.0, 23.99000000000001, 0.21698846055366774, 0.3536043105571396, 0.14176296885781614], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 612.0, 612, 612, 612.0, 612.0, 612.0, 612.0, 1.6339869281045751, 0.706890829248366, 1932.663462520425], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 5.905999999999995, 4, 30, 5.0, 7.900000000000034, 9.0, 17.99000000000001, 0.2155498525854558, 0.21654129770818775, 0.126509239652206], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 11.964000000000002, 8, 27, 12.0, 15.0, 16.0, 21.99000000000001, 0.2169873305437442, 0.34088836769436204, 0.12904812920033223], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 9.190000000000001, 6, 20, 9.0, 11.0, 12.0, 16.99000000000001, 0.216986671376724, 0.33580170702871903, 0.12396211206580424], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 2314.489999999998, 1929, 2988, 2271.5, 2685.1000000000004, 2793.2999999999997, 2927.98, 0.21677256006225706, 0.3310371022494488, 0.11939426159679004], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 18.40000000000001, 12, 100, 17.0, 21.0, 25.0, 72.98000000000002, 0.21541185669941645, 0.11206254900619739, 1.736758094639045], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 16.944000000000017, 12, 42, 16.0, 21.0, 22.0, 28.0, 0.21698968474436664, 0.3928085434643358, 0.18096600661297763], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 11.952000000000005, 8, 25, 12.0, 15.0, 16.94999999999999, 23.99000000000001, 0.21698902556304311, 0.36737894873916355, 0.15553705543288443], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 90.0, 90, 90, 90.0, 90.0, 90.0, 90.0, 11.11111111111111, 5.240885416666667, 1515.3645833333335], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 596.0, 596, 596, 596.0, 596.0, 596.0, 596.0, 1.6778523489932886, 0.7783006501677853, 3208.79758284396], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 3.379999999999999, 2, 24, 3.0, 4.0, 5.0, 9.980000000000018, 0.2155508747485599, 0.18117850918440723, 0.09114602418567036], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 768.3879999999997, 592, 1013, 731.0, 940.9000000000001, 953.95, 969.0, 0.21548668313846872, 0.18976464382852604, 0.09974676543714274], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 4.496000000000003, 3, 17, 4.0, 6.0, 6.0, 12.0, 0.21554743660211023, 0.1952788207130309, 0.10524777177837412], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 1041.9239999999993, 785, 1367, 997.0, 1313.9, 1330.0, 1349.0, 0.2154689466154138, 0.2038348860115405, 0.11383662120990123], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 93.0, 93, 93, 93.0, 93.0, 93.0, 93.0, 10.752688172043012, 5.092825940860215, 708.028813844086], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 0, 0.0, 36.58800000000003, 25, 1167, 34.0, 40.0, 45.94999999999999, 99.95000000000005, 0.21530472077130763, 0.11200681425984696, 9.821175300027129], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 47.019999999999996, 31, 401, 45.0, 54.0, 62.0, 171.82000000000016, 0.21549457729445698, 48.7385411263589, 0.06650027971196132], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 604.0, 604, 604, 604.0, 604.0, 604.0, 604.0, 1.6556291390728477, 0.8682352028145696, 0.6790666390728477], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 3.925999999999999, 2, 11, 4.0, 5.0, 6.0, 9.0, 0.2170275473065796, 0.23582883023779708, 0.09304208326912936], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 4.716, 3, 15, 4.0, 6.0, 7.0, 10.0, 0.21702679369389585, 0.22268771718956382, 0.07990146603769409], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 2.726000000000001, 1, 14, 2.0, 4.0, 4.0, 8.990000000000009, 0.2170520425682466, 0.12309012855449852, 0.08415005947225968], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 125.484, 82, 173, 127.0, 160.90000000000003, 166.0, 170.0, 0.21704167851352493, 0.1977046214684606, 0.07079289123390364], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 0, 0.0, 123.78400000000013, 85, 526, 122.0, 140.0, 160.0, 419.97, 0.21546012587180555, 0.11208765981754838, 63.71012843039453], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 269.13799999999975, 16, 546, 287.0, 493.0, 504.0, 520.0, 0.21702425028972738, 0.12095499011997102, 0.09092129235770806], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 579.6719999999995, 436, 756, 549.0, 696.9000000000001, 707.95, 746.99, 0.21700230413046526, 0.11670443252703958, 0.09239551230554965], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 10.529999999999998, 6, 437, 9.0, 12.0, 16.0, 38.91000000000008, 0.21526615938478655, 0.09706107270463846, 0.15619409806923476], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 539.9799999999999, 369, 694, 534.5, 643.0, 659.9, 682.96, 0.21698582388215412, 0.11160996415719669, 0.08730289007758546], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 4.917999999999997, 3, 32, 5.0, 6.0, 7.0, 14.990000000000009, 0.21554975966201798, 0.1323420794893626, 0.10777487983100899], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 5.464000000000003, 3, 42, 5.0, 6.0, 7.0, 12.980000000000018, 0.21554613571043357, 0.12623552055361734, 0.10166873393372991], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 940.0279999999999, 667, 1421, 916.0, 1149.0, 1296.85, 1393.99, 0.2154643968785242, 0.19688690508125378, 0.09489691698458438], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 330.3579999999997, 218, 461, 329.0, 394.0, 401.0, 415.0, 0.21550358662619223, 0.190819586943198, 0.0886005956734638], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 6.664000000000001, 4, 50, 6.5, 8.0, 9.0, 18.960000000000036, 0.21555133937135745, 0.14371001455294868, 0.10082919097546897], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 1580.7000000000012, 1269, 16214, 1436.0, 1755.7, 1806.0, 6590.9500000000435, 0.21543543163135034, 0.16193633406344402, 0.11907856865560966], "isController": false}, {"data": ["Query single patient #2", 500, 0, 0.0, 171.02, 130, 215, 174.0, 204.0, 206.0, 209.0, 0.21705713073915334, 4.196729672789631, 0.10937644478652647], "isController": false}, {"data": ["Query single patient #1", 500, 0, 0.0, 234.91000000000014, 178, 390, 234.0, 280.0, 284.0, 292.98, 0.21703225750443286, 0.42065048026525687, 0.15514415282543445], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 10.71799999999999, 7, 24, 11.0, 14.0, 15.0, 19.99000000000001, 0.2169588958354306, 0.1770651551158474, 0.13390431852342982], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 10.622, 7, 26, 11.0, 13.0, 15.0, 20.99000000000001, 0.21696021383598676, 0.18045623410766432, 0.13729513531808535], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 11.827999999999996, 8, 35, 12.0, 14.900000000000034, 15.0, 23.970000000000027, 0.2169558833228616, 0.17557959967625844, 0.13241936237967628], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 14.691999999999991, 10, 46, 14.0, 18.0, 19.0, 27.980000000000018, 0.2169573895686887, 0.1940137218768984, 0.15085318493447888], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 11.06999999999999, 7, 53, 11.0, 13.0, 14.0, 46.720000000000255, 0.21695004681782012, 0.16286295946223292, 0.119703883253973], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 2626.7080000000005, 2242, 3299, 2565.5, 3029.3, 3148.9, 3283.92, 0.21673563194475148, 0.1811283381622032, 0.13799964065232223], "isController": false}]}, function(index, item){
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

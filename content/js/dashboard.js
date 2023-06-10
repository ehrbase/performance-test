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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8894065092533503, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Query cross patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.171, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.566, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [1.0, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [0.934, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [0.994, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.496, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.143, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 23505, 500, 2.1272069772388855, 326.8600297808977, 1, 20792, 9.0, 850.0, 1501.0, 6043.0, 15.108827913631885, 95.17441219074469, 125.02684033582995], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query cross patient #1", 500, 500, 100.0, 6223.113999999999, 4940, 20792, 6038.0, 6504.8, 6750.9, 19847.10000000011, 0.32621893335542923, 0.18945865415606183, 0.16438375938613425], "isController": false}, {"data": ["Query participation #2", 500, 0, 0.0, 2.480000000000001, 1, 13, 2.0, 3.0, 4.0, 7.0, 0.32724097894793336, 0.16800181156515434, 0.11824136934642124], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 3.7139999999999986, 2, 16, 4.0, 5.0, 5.0, 8.990000000000009, 0.3272392655703715, 0.18781424684410453, 0.1380540651625005], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 0, 0.0, 12.792000000000016, 8, 457, 11.0, 14.0, 17.94999999999999, 40.99000000000001, 0.3248742574186661, 0.16900758366161878, 3.574568611656358], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 33.90800000000002, 23, 51, 34.0, 40.0, 41.0, 45.0, 0.32716817622063177, 1.3606585778833657, 0.13610707331053626], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 2.2839999999999976, 1, 9, 2.0, 3.0, 4.0, 6.990000000000009, 0.3271765254769089, 0.20439267100862632, 0.13834710501123196], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 30.226000000000017, 21, 54, 30.0, 36.0, 37.0, 40.0, 0.32716817622063177, 1.3427665682463, 0.11885406401765138], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 869.3940000000001, 681, 1104, 876.0, 1010.9000000000001, 1065.0, 1091.92, 0.3270258762494841, 1.3830607739574252, 0.15904188122289364], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 5.7079999999999975, 3, 17, 5.0, 7.0, 9.0, 12.0, 0.3271390641990785, 0.48646281684236214, 0.16708372126574028], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 3.9580000000000055, 2, 15, 4.0, 5.0, 6.0, 11.980000000000018, 0.3251241649185824, 0.3136019423161455, 0.17780227768984974], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 7.994000000000011, 5, 22, 8.0, 10.0, 11.0, 14.0, 0.32717181558764313, 0.5331590628801327, 0.21374799280091136], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 586.0, 586, 586, 586.0, 586.0, 586.0, 586.0, 1.7064846416382253, 0.7382545861774744, 2018.413035942833], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 4.129999999999998, 2, 22, 4.0, 5.0, 6.0, 10.990000000000009, 0.3251264904611139, 0.3266219453146997, 0.19082130934289984], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 8.327999999999998, 5, 22, 8.0, 10.0, 12.0, 14.990000000000009, 0.3271713874226158, 0.5139881666607776, 0.19457751459020803], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 6.865999999999996, 4, 17, 7.0, 8.0, 10.0, 14.0, 0.3271713874226158, 0.50632008726806, 0.18690943519749048], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 1581.047999999999, 1337, 1982, 1559.0, 1774.9, 1857.3999999999999, 1927.99, 0.3268516472669319, 0.4991222552224356, 0.18002375884623983], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 10.665999999999997, 7, 76, 10.0, 13.0, 15.0, 37.99000000000001, 0.32486876926065716, 0.16900472858676238, 2.619254452164048], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 11.364000000000008, 8, 31, 11.0, 14.0, 15.0, 18.0, 0.3271722437537911, 0.5922680273133204, 0.2728565392243531], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 7.992000000000001, 5, 17, 8.0, 10.0, 11.0, 15.0, 0.3271726719210598, 0.5539282549182233, 0.2345163488184159], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 67.0, 67, 67, 67.0, 67.0, 67.0, 67.0, 14.925373134328359, 7.039995335820895, 2035.5643656716418], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 559.0, 559, 559, 559.0, 559.0, 559.0, 559.0, 1.7889087656529516, 0.8298160778175312, 3421.1866894007153], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 2.3320000000000025, 1, 17, 2.0, 3.0, 4.0, 6.990000000000009, 0.325123319275001, 0.2732782149738146, 0.13747890356062056], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 570.104000000001, 437, 757, 561.0, 660.0, 672.9, 691.99, 0.32502926888566314, 0.2862130293426673, 0.15045300141777765], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 3.3559999999999985, 1, 16, 3.0, 4.0, 5.0, 8.0, 0.3251300845468272, 0.294557061264587, 0.15875492409513045], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 777.9080000000004, 629, 982, 760.0, 901.9000000000001, 918.95, 956.96, 0.3249916639638193, 0.3074440183578041, 0.17169969746526], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 76.0, 76, 76, 76.0, 76.0, 76.0, 76.0, 13.157894736842104, 6.2320106907894735, 866.4036800986843], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 0, 0.0, 22.990000000000023, 15, 1006, 20.0, 24.900000000000034, 26.0, 63.99000000000001, 0.32465909172073865, 0.16889564917046357, 14.809400560816115], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 30.2, 20, 290, 28.0, 35.0, 40.89999999999998, 105.83000000000015, 0.3250130005200208, 73.50839028678334, 0.10029698062922517], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 486.0, 486, 486, 486.0, 486.0, 486.0, 486.0, 2.05761316872428, 1.0790412808641976, 0.8439429012345679], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 2.7440000000000007, 2, 9, 3.0, 3.0, 4.0, 6.990000000000009, 0.3271891572130813, 0.3555338350806325, 0.14026957032865497], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 3.537999999999999, 2, 30, 3.0, 4.0, 5.0, 8.0, 0.32718787258518994, 0.3357222359413915, 0.12045881637169589], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 1.8640000000000008, 1, 9, 2.0, 3.0, 3.0, 6.0, 0.32724183564344256, 0.1855787171645542, 0.12687012573285808], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 91.79200000000003, 67, 119, 91.0, 110.0, 113.94999999999999, 116.99000000000001, 0.3272208478946611, 0.29804898148420833, 0.10673023749689141], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 0, 0.0, 83.38600000000004, 57, 498, 79.0, 93.0, 102.0, 395.0000000000009, 0.32495596846627284, 0.16905009175944158, 96.08732196474877], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 202.47399999999988, 12, 372, 259.0, 335.0, 337.0, 347.96000000000004, 0.3271842328609447, 0.18235089212506814, 0.13707230068100126], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 433.99599999999975, 308, 551, 421.0, 507.0, 519.0, 540.96, 0.32716239621590887, 0.17594883126959296, 0.13929961401380495], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 7.355999999999998, 4, 294, 6.0, 8.0, 11.0, 27.980000000000018, 0.3246036589324435, 0.14636011266181492, 0.23552785018242728], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 406.71799999999973, 278, 521, 398.0, 471.0, 480.95, 502.98, 0.32713157297291284, 0.16826510820367474, 0.1316193438133204], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 3.5939999999999976, 2, 21, 3.0, 5.0, 5.0, 9.990000000000009, 0.3251214165930267, 0.1996162947521502, 0.16256070829651334], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 4.332, 2, 67, 4.0, 5.0, 6.0, 11.0, 0.3251076756621793, 0.19040070719859917, 0.1533466868601881], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 677.0360000000003, 538, 875, 683.0, 790.9000000000001, 834.8, 849.99, 0.32494730979371694, 0.2969301242647255, 0.14311644210641244], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 246.35800000000012, 178, 330, 239.0, 292.0, 298.0, 311.99, 0.32502842373565566, 0.28779933797398083, 0.13362984999288188], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 4.564000000000001, 3, 36, 4.0, 5.0, 6.0, 10.0, 0.32512712470575994, 0.2167651751053412, 0.15208583274810453], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 1000.4899999999986, 811, 9991, 939.5, 1098.7, 1118.95, 1144.99, 0.3249620931718315, 0.24426423118680704, 0.17961771946802405], "isController": false}, {"data": ["Query single patient #2", 500, 0, 0.0, 134.36399999999995, 117, 167, 132.0, 150.0, 151.95, 156.99, 0.3272420498180207, 6.327119574367719, 0.16489931416611198], "isController": false}, {"data": ["Query single patient #1", 500, 0, 0.0, 182.29400000000007, 158, 253, 177.0, 203.0, 205.95, 212.99, 0.3272184922949862, 0.6342127088308418, 0.23391009410149402], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 7.218000000000002, 5, 21, 7.0, 9.0, 11.0, 14.0, 0.32713499749087455, 0.26698241089169805, 0.20190363126389915], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 7.0199999999999925, 5, 26, 7.0, 9.0, 10.0, 14.990000000000009, 0.32713628170359493, 0.27209496336891487, 0.20701592826555615], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 8.506000000000004, 6, 27, 8.0, 10.0, 11.0, 15.990000000000009, 0.32713178700318496, 0.26474353828848574, 0.19966539734081115], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 9.929999999999996, 7, 26, 10.0, 12.0, 14.0, 20.980000000000018, 0.327132643127074, 0.29253772718544235, 0.22745941592429364], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 7.980000000000006, 5, 31, 8.0, 9.0, 11.0, 15.0, 0.327082567414988, 0.24553871132575725, 0.18047036190377755], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 1601.732, 1377, 1973, 1573.0, 1787.9, 1856.0, 1949.98, 0.326793540991021, 0.27308642672014316, 0.20807557492787665], "isController": false}]}, function(index, item){
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

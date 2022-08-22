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

    var data = {"OkPercent": 97.82599446926186, "KoPercent": 2.1740055307381407};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9002127206977238, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Query cross patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.001, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.99, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.995, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [1.0, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [0.981, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.698, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.646, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 23505, 511, 2.1740055307381407, 188.77851520953104, 1, 3989, 16.0, 549.0, 1220.9500000000007, 2223.0, 26.078794461820447, 173.52713307071008, 216.01498963796465], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query cross patient #1", 500, 500, 100.0, 26.40599999999999, 16, 89, 28.0, 31.0, 32.94999999999999, 40.99000000000001, 0.5659290347627569, 0.32861133642160806, 0.28517517767342043], "isController": false}, {"data": ["Query participation #2", 500, 0, 0.0, 7.798000000000003, 4, 31, 7.0, 10.0, 12.949999999999989, 22.0, 0.5656742101208168, 6.047980946112744, 0.20439400170381072], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 8.090000000000002, 5, 36, 8.0, 10.0, 12.0, 19.0, 0.5656550115337057, 6.073874252840437, 0.23863570799078207], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 0, 0.0, 22.223999999999997, 14, 281, 20.0, 28.0, 32.0, 47.99000000000001, 0.5613114930773453, 0.3030665464243897, 6.248975606525134], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 45.85199999999999, 26, 68, 47.0, 57.0, 59.0, 62.99000000000001, 0.5654215330613279, 2.3516257035257424, 0.23522419246496648], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 2.3079999999999967, 1, 9, 2.0, 3.0, 4.0, 6.0, 0.5654541444961521, 0.35334478495778887, 0.23910316852229868], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 40.45800000000001, 25, 62, 42.0, 50.0, 51.0, 54.0, 0.5654138603292066, 2.3206406962421466, 0.20540425394771958], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 785.6020000000012, 560, 996, 793.0, 925.9000000000001, 947.95, 977.96, 0.5651020122152451, 2.3898384839556237, 0.2748250020343672], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 11.729999999999995, 7, 31, 12.0, 15.0, 16.0, 22.99000000000001, 0.5649596223357917, 0.8400750965515994, 0.2885487133609561], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 3.2279999999999984, 1, 21, 3.0, 4.0, 5.0, 9.990000000000009, 0.5623012967792507, 0.5424691936205793, 0.3075085216761527], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 18.49800000000001, 11, 38, 20.0, 23.0, 25.0, 29.0, 0.5653710247349824, 0.9212003091872791, 0.3693683745583039], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 689.0, 689, 689, 689.0, 689.0, 689.0, 689.0, 1.4513788098693758, 0.6193872460087083, 1716.676399219884], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 4.118000000000005, 2, 22, 4.0, 5.0, 6.0, 11.0, 0.562312047198224, 0.5649940120795873, 0.3300288480138014], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 19.476000000000006, 12, 45, 21.0, 24.0, 26.0, 32.99000000000001, 0.5653537644645761, 0.8882701425652587, 0.33623090093645197], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 11.199999999999989, 7, 24, 12.0, 14.0, 16.0, 20.99000000000001, 0.5653467328046965, 0.8750087805414438, 0.32297640497143304], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 1958.1120000000012, 1492, 2560, 1958.0, 2196.9, 2252.85, 2436.6600000000003, 0.5640221547902402, 0.8613598732783224, 0.31065282744306194], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 18.99800000000002, 12, 127, 17.0, 24.0, 31.0, 48.99000000000001, 0.5612787276484779, 0.3030488555246104, 4.525309741665853], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 23.317999999999987, 15, 55, 24.0, 29.0, 31.0, 41.960000000000036, 0.5654061878053194, 1.023502256677447, 0.47153992615795187], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 18.701999999999988, 11, 55, 20.0, 24.0, 25.0, 34.97000000000003, 0.5653844501183914, 0.9571108455296182, 0.4052658070184564], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 83.0, 83, 83, 83.0, 83.0, 83.0, 83.0, 12.048192771084338, 5.6122929216867465, 1643.1664156626505], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 708.0, 708, 708, 708.0, 708.0, 708.0, 708.0, 1.4124293785310735, 0.6469036899717514, 2701.1911855579096], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 2.2000000000000015, 1, 19, 2.0, 3.0, 4.0, 9.0, 0.5621716917320285, 0.47236695996100775, 0.23771517824215657], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 412.04399999999964, 310, 519, 422.0, 486.0, 495.0, 506.0, 0.5619732905334476, 0.49473296680030393, 0.26013216768833414], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 2.8699999999999974, 1, 13, 3.0, 4.0, 4.0, 8.990000000000009, 0.562244389644358, 0.509311056999774, 0.27453339338103416], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 1174.7600000000014, 926, 1487, 1168.5, 1338.9, 1387.5, 1455.92, 0.561659546695813, 0.5313968476436697, 0.29673614722894026], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 67.0, 67, 67, 67.0, 67.0, 67.0, 67.0, 14.925373134328359, 6.981693097014925, 982.7862639925372], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 2, 0.4, 45.85800000000004, 12, 666, 45.0, 52.0, 59.94999999999999, 90.91000000000008, 0.560867594865145, 0.3023394015234286, 25.65421524247428], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 44.85000000000001, 9, 221, 45.0, 54.0, 60.0, 81.95000000000005, 0.5616349417809219, 124.93945312061223, 0.17331703281520638], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 298.0, 298, 298, 298.0, 298.0, 298.0, 298.0, 3.3557046979865772, 1.7597787332214765, 1.3763632550335572], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 2.2020000000000004, 1, 24, 2.0, 3.0, 4.0, 6.990000000000009, 0.5656959700950482, 0.6146065740094381, 0.2425200496794201], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 3.2599999999999976, 2, 32, 3.0, 4.0, 6.0, 11.0, 0.565690849950502, 0.5803501979917974, 0.20826704143685476], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 2.020000000000001, 1, 11, 2.0, 3.0, 4.0, 7.0, 0.5656870099029168, 0.3208970049418417, 0.21931420208150193], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 126.72999999999992, 88, 190, 125.0, 156.0, 160.0, 168.99, 0.5656198175084222, 0.5152907010122332, 0.18448927641387985], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 9, 1.8, 175.8900000000001, 41, 615, 178.0, 209.0, 220.89999999999998, 363.7900000000002, 0.5614135945179085, 0.30110080398637334, 166.07644846110918], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 2.293999999999999, 1, 21, 2.0, 3.0, 4.0, 7.990000000000009, 0.5656882899129858, 0.3153734313463721, 0.23699245739518643], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 3.0440000000000014, 2, 20, 3.0, 4.0, 5.0, 7.990000000000009, 0.5657375747056468, 0.3043513458048296, 0.24088045173013864], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 11.680000000000007, 7, 298, 10.0, 15.0, 18.94999999999999, 42.0, 0.560699663468062, 0.2368386617556852, 0.4068357909734082], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 4.434000000000002, 2, 65, 4.0, 5.0, 6.0, 9.990000000000009, 0.5656972501456671, 0.29100704010227807, 0.22760475298829572], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 3.5420000000000007, 2, 11, 3.0, 5.0, 6.0, 9.990000000000009, 0.5621653710628749, 0.34525078829639155, 0.2810826855314374], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 3.9439999999999964, 2, 28, 4.0, 5.0, 6.0, 9.990000000000009, 0.5621489379882263, 0.32932046241809493, 0.2651542353987435], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 534.3320000000004, 372, 853, 545.0, 649.0, 662.0, 685.96, 0.5616109698347516, 0.5132202871292244, 0.24735014394089155], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 15.142000000000005, 6, 122, 14.0, 23.0, 29.0, 50.0, 0.561769348740794, 0.4973282600879731, 0.230961812324096], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 10.239999999999998, 6, 54, 11.0, 12.0, 14.0, 25.940000000000055, 0.5623196359767605, 0.37477615285365967, 0.2630381890945979], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 534.6999999999996, 432, 3989, 520.0, 578.0, 596.0, 673.9300000000001, 0.5620813196770056, 0.42237227510002234, 0.31068166693084487], "isController": false}, {"data": ["Query single patient #2", 500, 0, 0.0, 177.2899999999999, 141, 281, 182.0, 199.0, 202.0, 224.8900000000001, 0.5657907094902339, 10.939477173315273, 0.28510547470406317], "isController": false}, {"data": ["Query single patient #1", 500, 0, 0.0, 271.646, 206, 423, 274.0, 302.0, 307.0, 323.0, 0.5656083004149303, 1.09635436109452, 0.4043215584997353], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 18.884000000000007, 11, 39, 19.5, 23.900000000000034, 25.0, 31.970000000000027, 0.5649366423555598, 0.460929820392518, 0.3486718339538221], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 18.871999999999996, 11, 43, 20.0, 24.0, 26.0, 33.99000000000001, 0.5649449404661022, 0.4697638554865193, 0.35750422013870525], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 19.03799999999999, 12, 50, 20.0, 24.0, 25.0, 34.97000000000003, 0.564900899435212, 0.45726300500728156, 0.34478814662793705], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 21.760000000000012, 13, 45, 23.0, 27.0, 28.0, 40.99000000000001, 0.5649213234072891, 0.5052757825855093, 0.3927968576816307], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 18.227999999999984, 11, 44, 19.0, 23.0, 24.0, 29.980000000000018, 0.5646055552669793, 0.4238136613936272, 0.31152552609945644], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 2182.9159999999974, 1687, 2816, 2173.0, 2488.5, 2572.75, 2740.7700000000004, 0.5635606210888893, 0.47100569541408177, 0.3588296142089412], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["No results for path: $['rows'][1]", 500, 97.84735812133073, 2.1272069772388855], "isController": false}, {"data": ["500", 11, 2.152641878669276, 0.04679855349925548], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 23505, 511, "No results for path: $['rows'][1]", 500, "500", 11, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["Query cross patient #1", 500, 500, "No results for path: $['rows'][1]", 500, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 2, "500", 2, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 9, "500", 9, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});

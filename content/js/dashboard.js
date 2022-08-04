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

    var data = {"OkPercent": 97.80897681344395, "KoPercent": 2.191023186556052};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8787066581578388, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Query cross patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.387, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.842, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.339, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.987, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [1.0, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [0.907, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.532, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [0.999, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.502, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [0.952, 500, 1500, "Query single patient #2"], "isController": false}, {"data": [0.853, 500, 1500, "Query single patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 23505, 515, 2.191023186556052, 290.59842586683567, 1, 6897, 31.0, 799.0, 1838.800000000003, 3876.9900000000016, 16.82868888726604, 111.97542884115451, 139.39482750728135], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query cross patient #1", 500, 500, 100.0, 49.93400000000002, 19, 155, 42.0, 83.0, 91.94999999999999, 106.97000000000003, 0.36447239704748197, 0.21165453110261648, 0.18365991882470772], "isController": false}, {"data": ["Query participation #2", 500, 0, 0.0, 14.171999999999997, 4, 68, 12.0, 24.0, 28.0, 48.0, 0.3643924448328058, 3.89461363970114, 0.13166523885560366], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 15.484000000000009, 5, 73, 13.0, 27.0, 31.0, 40.97000000000003, 0.3643746529331431, 3.9126749499349227, 0.15372055670616974], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 0, 0.0, 69.1439999999999, 15, 297, 63.0, 125.90000000000003, 143.0, 172.0, 0.36122521814390923, 0.19501434809143042, 4.021452623867739], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 63.143999999999984, 26, 164, 52.0, 110.0, 116.94999999999999, 145.98000000000002, 0.3642193795304338, 1.5147919562969525, 0.15152095281246564], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 6.887999999999999, 1, 48, 6.0, 13.0, 16.0, 17.0, 0.3642467086667405, 0.22763356175547975, 0.15402228989521352], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 57.944, 24, 152, 48.0, 98.90000000000003, 107.89999999999998, 131.98000000000002, 0.36420531856310806, 1.4947334829701233, 0.13230896338425407], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 1145.022, 587, 2604, 897.0, 2233.9, 2332.8, 2459.9, 0.36409154426515766, 1.5397573630232997, 0.17706795805082864], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 24.09000000000001, 8, 71, 20.0, 40.0, 45.0, 61.950000000000045, 0.36372603863788966, 0.5409096372214677, 0.18577023262462528], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 10.763999999999987, 2, 40, 8.0, 22.0, 25.94999999999999, 36.0, 0.3621957465180312, 0.34938024233068615, 0.1980757988770483], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 39.430000000000014, 14, 129, 31.0, 69.0, 75.0, 95.97000000000003, 0.3641923197666838, 0.5934257777873276, 0.2379342401600698], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 903.0, 903, 903, 903.0, 903.0, 903.0, 903.0, 1.1074197120708749, 0.4726000138427464, 1309.8450044988926], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 10.876000000000008, 2, 60, 8.5, 20.0, 24.0, 32.0, 0.36220440498509165, 0.36391143472967963, 0.21258285878519542], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 40.762000000000015, 15, 160, 32.0, 72.0, 79.0, 102.96000000000004, 0.3641756083917714, 0.5722045231612045, 0.21658490772518435], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 24.179999999999982, 8, 63, 19.0, 43.0, 46.0, 58.98000000000002, 0.3641777303861158, 0.5636311872430726, 0.20805075417566188], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 2970.6380000000004, 1516, 6111, 2684.5, 4522.4000000000015, 5186.2, 5904.460000000001, 0.3633419905618285, 0.5548040589751285, 0.20012195573913208], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 69.18200000000014, 13, 207, 58.0, 135.90000000000003, 160.0, 182.97000000000003, 0.36119651402020386, 0.19495793482822937, 2.912146894287894], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 44.64400000000002, 18, 122, 36.0, 76.0, 84.0, 106.97000000000003, 0.3642069103162336, 0.659351796605373, 0.3037428724707651], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 38.18399999999994, 14, 113, 30.0, 69.0, 74.89999999999998, 85.0, 0.36421088975991944, 0.6166574081223399, 0.2610652276208798], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 191.0, 191, 191, 191.0, 191.0, 191.0, 191.0, 5.235602094240838, 2.4388498036649215, 714.0461387434555], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 653.0, 653, 653, 653.0, 653.0, 653.0, 653.0, 1.5313935681470139, 0.7013902182235834, 2928.703459992343], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 9.258000000000015, 1, 90, 7.0, 20.0, 23.0, 32.99000000000001, 0.3620892550013578, 0.3042469109260433, 0.1531100072417851], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 585.5580000000006, 320, 1336, 466.0, 1182.3000000000002, 1231.95, 1292.91, 0.3619477130333752, 0.3186405277831065, 0.1675422031033397], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 10.490000000000006, 1, 43, 7.5, 23.0, 27.0, 31.99000000000001, 0.36204992668488983, 0.3280462258557955, 0.17678219076410637], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 1640.8900000000003, 918, 3686, 1322.0, 3061.4000000000024, 3466.5, 3603.96, 0.36182094349876515, 0.34222325130128906, 0.19115735393831243], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 66.0, 66, 66, 66.0, 66.0, 66.0, 66.0, 15.151515151515152, 7.087476325757575, 997.6769649621211], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 6, 1.2, 102.29199999999996, 20, 767, 90.0, 175.90000000000003, 192.95, 214.97000000000003, 0.36099988303603786, 0.19401275940549095, 16.51221925941596], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 124.80000000000001, 10, 334, 106.5, 232.0, 253.0, 307.96000000000004, 0.3614461315143436, 80.40609147763334, 0.11154001714700447], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 357.0, 357, 357, 357.0, 357.0, 357.0, 357.0, 2.8011204481792715, 1.4689469537815127, 1.1488970588235294], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 8.507999999999994, 1, 63, 6.0, 19.0, 22.94999999999999, 28.0, 0.36438368144121036, 0.39597119182614526, 0.15621526968036262], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 10.546000000000008, 2, 65, 8.0, 21.900000000000034, 25.0, 43.940000000000055, 0.36438049485786245, 0.3738437125143566, 0.134151803282631], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 6.534000000000008, 1, 20, 5.0, 13.0, 16.0, 19.99000000000001, 0.36439855290046674, 0.2066089974830992, 0.14127561084129422], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 187.96999999999997, 83, 457, 140.0, 366.7000000000001, 386.95, 431.96000000000004, 0.3643467736000157, 0.33190639006856276, 0.11883967029531764], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 9, 1.8, 310.22599999999954, 43, 928, 267.0, 523.7, 551.0, 727.6200000000003, 0.3612614962439642, 0.19375399532636003, 106.86778312424723], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 6.987999999999994, 1, 44, 6.0, 13.0, 16.0, 19.0, 0.3643775738720874, 0.20316255935710678, 0.1526542765538335], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 9.75, 1, 39, 7.0, 20.0, 24.0, 28.99000000000001, 0.36441820633358846, 0.19596446694726868, 0.1551624394154732], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 58.806, 8, 357, 45.5, 127.0, 140.0, 173.97000000000003, 0.360914412756159, 0.15255189610898173, 0.2618744225369396], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 11.058000000000007, 2, 123, 8.0, 20.0, 24.0, 32.0, 0.3643860714152974, 0.18746880513616743, 0.14660845842099854], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 10.598000000000008, 2, 77, 8.0, 21.0, 24.0, 35.99000000000001, 0.3620834863136063, 0.22235108434046857, 0.18104174315680316], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 11.842000000000008, 2, 66, 11.0, 23.0, 28.0, 35.960000000000036, 0.3620667057215953, 0.21204592196122846, 0.17077951060891655], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 797.7320000000001, 377, 2015, 621.0, 1583.0, 1640.0, 1781.8100000000002, 0.36153917349252623, 0.33030557833252344, 0.1592325852003216], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 31.004, 6, 523, 28.0, 52.0, 64.0, 84.97000000000003, 0.36150101003382207, 0.32013526848137763, 0.14862492697679597], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 22.88399999999999, 8, 96, 20.0, 39.900000000000034, 43.0, 55.97000000000003, 0.36221621265279186, 0.24141073865122273, 0.16943512291082743], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 837.8520000000005, 466, 5330, 814.0, 1038.9, 1099.8, 1358.2200000000007, 0.36207614461321214, 0.27212073089595745, 0.20013193149519345], "isController": false}, {"data": ["Query single patient #2", 500, 0, 0.0, 260.714, 144, 586, 196.0, 499.0, 529.9, 563.99, 0.3644253777086827, 7.046129801349905, 0.1836362254860159], "isController": false}, {"data": ["Query single patient #1", 500, 0, 0.0, 429.17800000000005, 220, 913, 344.0, 729.8000000000001, 777.0, 840.0, 0.36435341114950587, 0.7062286363654581, 0.2604557587514046], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 39.357999999999976, 14, 114, 31.0, 68.0, 75.94999999999999, 91.97000000000003, 0.36368132787326435, 0.2967263168446281, 0.22445956954678034], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 38.45399999999997, 14, 106, 31.0, 68.0, 72.94999999999999, 82.99000000000001, 0.363700904014967, 0.3024663160680877, 0.2301544783219713], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 38.67600000000001, 14, 122, 29.0, 72.0, 76.0, 106.93000000000006, 0.36363715702652444, 0.29430746030718613, 0.22194650697419702], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 42.09800000000003, 16, 128, 35.0, 72.90000000000003, 80.0, 91.97000000000003, 0.3636588443649244, 0.32524240703061646, 0.2528565402224865], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 40.402, 14, 136, 31.0, 72.0, 77.0, 91.96000000000004, 0.36347167792338453, 0.2728969494639883, 0.20054833791671117], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 3277.7439999999983, 1666, 6897, 2944.5, 4955.6, 5769.7, 6373.5, 0.363045457647843, 0.30331880727949706, 0.23115784998671252], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["No results for path: $['rows'][1]", 500, 97.0873786407767, 2.1272069772388855], "isController": false}, {"data": ["500", 15, 2.912621359223301, 0.06381620931716656], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 23505, 515, "No results for path: $['rows'][1]", 500, "500", 15, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["Query cross patient #1", 500, 500, "No results for path: $['rows'][1]", 500, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 6, "500", 6, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 9, "500", 9, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});

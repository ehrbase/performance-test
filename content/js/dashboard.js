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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9205180640763463, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.003, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.996, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.499, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [1.0, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.753, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.755, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 22005, 0, 0.0, 180.5290161326972, 1, 3568, 11.0, 572.0, 1291.9500000000007, 2141.9900000000016, 27.32444000730142, 183.0245635912547, 240.69161583690644], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query participation #2", 500, 0, 0.0, 7.161999999999995, 4, 33, 7.0, 9.0, 12.0, 18.99000000000001, 0.633017162361306, 6.765772740271159, 0.22872690436883122], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 7.622000000000007, 5, 34, 7.0, 9.0, 11.0, 20.970000000000027, 0.6329971274590356, 6.796584118038772, 0.26704566314678063], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 0, 0.0, 19.811999999999994, 13, 268, 18.0, 25.0, 29.94999999999999, 45.940000000000055, 0.6288904736928825, 0.33891300683855496, 7.001319726659045], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 42.224000000000025, 25, 71, 44.0, 53.0, 55.0, 64.97000000000003, 0.6327688191774512, 2.6317992196062154, 0.26324171579061934], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 2.1999999999999997, 1, 15, 2.0, 3.0, 4.0, 7.0, 0.632812865844938, 0.39550804115308624, 0.2675859090926349], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 37.80999999999998, 22, 67, 39.0, 47.0, 49.0, 51.0, 0.6327560067527721, 2.596425292396551, 0.22986839307815551], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 750.374, 570, 1047, 748.0, 889.0, 906.95, 947.97, 0.6323566795203701, 2.6745476357448466, 0.3075328382823675], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 8.179999999999994, 5, 24, 8.0, 10.0, 12.0, 17.0, 0.6326095015416693, 0.9408830769999633, 0.3231003606506768], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 3.3839999999999986, 1, 20, 3.0, 5.0, 6.0, 15.950000000000045, 0.6297268874489135, 0.6075880515620375, 0.34438189157362453], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 12.377999999999993, 8, 44, 13.0, 15.0, 16.0, 23.980000000000018, 0.6327255793235405, 1.031268546768544, 0.413372473210399], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 633.0, 633, 633, 633.0, 633.0, 633.0, 633.0, 1.5797788309636651, 0.6741829581358609, 1868.546665185624], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 4.277999999999998, 2, 22, 4.0, 6.0, 7.0, 13.990000000000009, 0.6297411637868603, 0.632102693151061, 0.3696039447616241], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 13.510000000000005, 9, 63, 14.0, 16.0, 18.0, 28.980000000000018, 0.6327151706116457, 0.9934616796056919, 0.3762925184594651], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 8.049999999999997, 5, 25, 8.0, 10.0, 12.0, 16.0, 0.6327127686498416, 0.9793454475683582, 0.3614618844337474], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 1837.718000000001, 1485, 2315, 1828.0, 2083.9, 2134.0, 2259.79, 0.6314319234300393, 0.9644136018013489, 0.3477808640767013], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 16.841999999999977, 11, 137, 15.0, 20.900000000000034, 25.94999999999999, 45.99000000000001, 0.6288445986650887, 0.3396006475212832, 5.070059576737277], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 16.731999999999985, 11, 40, 17.0, 20.0, 22.0, 31.970000000000027, 0.6327560067527721, 1.1456344106637104, 0.5277086228192065], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 12.427999999999997, 8, 31, 13.0, 15.0, 16.0, 24.970000000000027, 0.632745597039763, 1.071465688737255, 0.45355006662811137], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 90.0, 90, 90, 90.0, 90.0, 90.0, 90.0, 11.11111111111111, 5.17578125, 1515.3645833333335], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 612.0, 612, 612, 612.0, 612.0, 612.0, 612.0, 1.6339869281045751, 0.7483787785947713, 3124.90744995915], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 2.069999999999998, 1, 16, 2.0, 3.0, 3.9499999999999886, 8.0, 0.6297617863067116, 0.5295165019629675, 0.2662957553425841], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 396.4459999999998, 305, 599, 404.5, 457.0, 464.95, 496.0, 0.6295302571127477, 0.5538144890795386, 0.2914036541713304], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 2.8999999999999986, 1, 17, 3.0, 4.0, 5.0, 10.0, 0.6298149351794469, 0.5707697850063738, 0.30752682381808927], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 1149.6720000000003, 916, 1503, 1136.5, 1334.0, 1352.9, 1417.8600000000001, 0.6289632547087335, 0.5951810486452761, 0.3322940632787352], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 61.0, 61, 61, 61.0, 61.0, 61.0, 61.0, 16.393442622950822, 7.668417008196721, 1079.4537653688524], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 0, 0.0, 39.75600000000002, 26, 577, 39.0, 46.0, 50.0, 89.95000000000005, 0.6283988522923362, 0.3393599270680292, 28.743110784832464], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 39.02200000000001, 27, 178, 39.0, 46.0, 52.0, 73.97000000000003, 0.6292553392315533, 142.3979023379982, 0.19418426484098716], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 264.0, 264, 264, 264.0, 264.0, 264.0, 264.0, 3.787878787878788, 1.9864169034090908, 1.553622159090909], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 2.1639999999999975, 1, 29, 2.0, 3.0, 4.0, 7.0, 0.6330540298953435, 0.6880753274155442, 0.27139718664458573], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 2.9959999999999987, 1, 21, 3.0, 4.0, 5.0, 8.990000000000009, 0.633046816344256, 0.6497384804470829, 0.23306508765799266], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 1.9859999999999989, 1, 15, 2.0, 3.0, 4.0, 9.970000000000027, 0.633031588276255, 0.35917124295752356, 0.245423379439134], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 116.79799999999999, 79, 220, 116.0, 143.0, 149.0, 160.99, 0.6329554589243555, 0.5767064874769762, 0.2064522688288425], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 0, 0.0, 156.74199999999996, 110, 655, 155.0, 180.0, 205.89999999999998, 331.8100000000002, 0.6289672106813727, 0.33966686279960856, 186.06004836443367], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 2.1420000000000003, 1, 10, 2.0, 3.0, 4.0, 6.0, 0.6330412059181756, 0.3522775398246223, 0.26520964583876694], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 3.0980000000000008, 2, 21, 3.0, 4.0, 5.0, 8.990000000000009, 0.6331205626162568, 0.3399560645985572, 0.26957086455145307], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 10.481999999999989, 6, 316, 9.0, 13.0, 16.0, 31.960000000000036, 0.6281801620704818, 0.2656269630630065, 0.4557986918148125], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 4.126000000000003, 2, 70, 4.0, 5.0, 5.0, 9.980000000000018, 0.6330652513015821, 0.3258060424179041, 0.2547098472033709], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 3.4219999999999984, 2, 12, 3.0, 4.0, 5.0, 9.0, 0.6297530612296307, 0.3868307378060915, 0.3148765306148153], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 3.7320000000000015, 2, 29, 3.0, 5.0, 6.0, 10.0, 0.629731646156307, 0.36898338641971107, 0.2970316260678674], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 504.34000000000003, 367, 845, 499.0, 613.9000000000001, 625.0, 669.96, 0.6290645432802696, 0.5742916969141868, 0.2770587002142594], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 13.95599999999999, 5, 120, 14.0, 21.0, 31.0, 47.0, 0.6293899952166361, 0.5574772711537977, 0.25876287889277716], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 6.956000000000003, 4, 47, 7.0, 8.0, 9.0, 14.0, 0.6297530612296307, 0.42004037189437277, 0.2945817542275323], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 515.9220000000005, 415, 3568, 500.0, 575.9000000000001, 607.9, 697.95, 0.6294462509551847, 0.4733140754252853, 0.34791658011780713], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 12.598000000000004, 8, 29, 13.0, 15.0, 16.0, 23.0, 0.6325934941554687, 0.5164532823378631, 0.3904287971740783], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 12.329999999999993, 8, 29, 13.0, 15.0, 16.94999999999999, 21.99000000000001, 0.632601497747306, 0.5256275960383964, 0.40031813529321714], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 12.548, 8, 27, 13.0, 15.0, 16.94999999999999, 21.0, 0.632577487579341, 0.512115954300072, 0.38609465794637515], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 14.986, 10, 26, 15.0, 18.0, 19.0, 21.99000000000001, 0.6325854907661496, 0.5658674897869073, 0.4398445990483384], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 12.283999999999997, 8, 38, 13.0, 15.0, 16.0, 19.0, 0.6322783137390283, 0.474826194595032, 0.348864499279835], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 2097.5839999999994, 1624, 2673, 2064.0, 2441.6000000000004, 2499.95, 2587.95, 0.6309530419508058, 0.5267225570129169, 0.40173963217961467], "isController": false}]}, function(index, item){
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

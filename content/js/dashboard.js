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

    var data = {"OkPercent": 97.81323122739843, "KoPercent": 2.186768772601574};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8887258030206339, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Query cross patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [0.998, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.476, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.003, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.853, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.419, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.991, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [1.0, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [0.984, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [0.975, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.598, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.528, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [0.975, 500, 1500, "Query single patient #2"], "isController": false}, {"data": [0.971, 500, 1500, "Query single patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 23505, 514, 2.186768772601574, 229.93716230589357, 1, 9178, 21.0, 641.9000000000015, 1414.8500000000022, 2752.930000000011, 20.723072569105565, 137.90035615990138, 171.65265491224105], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query cross patient #1", 500, 500, 100.0, 35.18000000000001, 17, 152, 30.0, 51.0, 72.84999999999997, 128.99, 0.44887171605452536, 0.26071731720148233, 0.22618926316810067], "isController": false}, {"data": ["Query participation #2", 500, 0, 0.0, 9.420000000000002, 5, 51, 8.0, 15.0, 19.94999999999999, 37.950000000000045, 0.44861557234374716, 4.807062183445637, 0.16209742360076804], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 9.738000000000003, 5, 56, 8.0, 14.0, 19.0, 32.0, 0.44860067989919045, 4.817073224584304, 0.18925341183247096], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 1, 0.2, 27.872, 12, 303, 22.0, 43.900000000000034, 61.849999999999966, 92.0, 0.4460991749841858, 0.24067921777847964, 4.966338471503631], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 55.19799999999997, 26, 198, 50.0, 84.0, 101.0, 183.93000000000006, 0.44852945134083394, 1.8654129633084968, 0.18659526003046414], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 3.009999999999999, 1, 18, 2.0, 5.0, 7.0, 12.990000000000009, 0.4485511796896026, 0.2802682686485153, 0.1896705671929667], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 49.810000000000024, 24, 285, 44.5, 75.0, 90.94999999999999, 174.91000000000008, 0.4485181856183541, 1.8408123670704228, 0.1629382471191677], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 923.7379999999991, 568, 3954, 852.0, 1109.1000000000004, 1364.9999999999998, 3784.190000000004, 0.4483255489073858, 1.896037045924676, 0.21803332358972474], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 15.956000000000003, 8, 127, 13.0, 26.0, 36.94999999999999, 57.98000000000002, 0.44842486282683447, 0.6668428042159112, 0.22902949536956488], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 4.342000000000001, 2, 29, 3.0, 7.0, 11.0, 20.980000000000018, 0.44670975926811074, 0.430903911614007, 0.24429439959974805], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 26.694000000000017, 13, 131, 23.0, 38.900000000000034, 68.84999999999997, 110.92000000000007, 0.4484860009579661, 0.7308018069164613, 0.2930050142977337], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 899.0, 899, 899, 899.0, 899.0, 899.0, 899.0, 1.1123470522803114, 0.47470279477196886, 1315.6730134176862], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 5.104000000000003, 2, 39, 4.0, 8.0, 10.0, 20.960000000000036, 0.44671694316956395, 0.4488222712630564, 0.26218445590323036], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 27.40000000000001, 13, 149, 23.0, 38.0, 63.94999999999999, 107.99000000000001, 0.4484775532499823, 0.7046116680517148, 0.26672151360277263], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 15.068000000000007, 7, 90, 13.0, 22.0, 31.94999999999999, 62.98000000000002, 0.44847433515922186, 0.6940700929507907, 0.2562084824884226], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 2486.9459999999985, 1482, 9178, 2241.0, 3361.900000000002, 4417.5, 6935.810000000001, 0.4474276934476004, 0.6831984930747141, 0.24643478428168616], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 26.316, 13, 223, 19.0, 44.0, 56.0, 138.9000000000001, 0.4460760916597153, 0.24079745022906007, 3.596488489006455], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 32.011999999999986, 16, 138, 28.0, 53.7000000000001, 71.0, 113.99000000000001, 0.44850209271076463, 0.8119324486330554, 0.3740437374755791], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 26.350000000000012, 12, 172, 22.0, 37.900000000000034, 66.94999999999999, 119.98000000000002, 0.4484888169313498, 0.7593257292988774, 0.3214753824488386], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 80.0, 80, 80, 80.0, 80.0, 80.0, 80.0, 12.5, 5.82275390625, 1704.78515625], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 999.0, 999, 999, 999.0, 999.0, 999.0, 999.0, 1.001001001001001, 0.45846627877877877, 1914.3577170920921], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 3.012000000000001, 1, 33, 2.0, 5.0, 8.0, 16.980000000000018, 0.44676005143101716, 0.37536657360282494, 0.18891318581018593], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 494.14999999999986, 303, 2197, 458.0, 579.0, 680.4499999999998, 1947.3500000000006, 0.4466507003929633, 0.39328466534249623, 0.20675042186158651], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 4.0859999999999985, 1, 47, 3.0, 7.0, 9.0, 18.99000000000001, 0.44679717910133004, 0.40478340920321765, 0.2181626851080713], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 1370.112000000001, 907, 6649, 1256.0, 1597.7, 1860.8, 4490.530000000001, 0.4463397020057614, 0.42218941144977384, 0.23581033084484074], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 83.0, 83, 83, 83.0, 83.0, 83.0, 83.0, 12.048192771084338, 5.635824548192771, 793.3334902108434], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 4, 0.8, 55.55200000000001, 14, 1035, 46.0, 77.90000000000003, 102.94999999999999, 193.87000000000012, 0.4456713280916443, 0.2398547378873218, 20.38511100112933], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 60.859999999999985, 12, 313, 50.0, 99.80000000000007, 142.89999999999998, 203.97000000000003, 0.44631739057859693, 99.28634232800489, 0.1377307572488639], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 457.0, 457, 457, 457.0, 457.0, 457.0, 457.0, 2.1881838074398248, 1.1475143599562363, 0.8974972647702407], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 2.823999999999998, 1, 23, 2.0, 4.900000000000034, 7.0, 13.0, 0.44864697046646723, 0.48751364307396755, 0.19233986331521397], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 4.1060000000000025, 2, 35, 3.0, 7.0, 9.0, 23.980000000000018, 0.44863932180091, 0.46034162286077557, 0.16517287531146785], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 2.6939999999999955, 1, 27, 2.0, 4.0, 7.0, 11.0, 0.44862442777954237, 0.25444014811784105, 0.17392958772312336], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 158.24800000000005, 85, 940, 138.0, 194.50000000000017, 234.84999999999997, 745.8700000000001, 0.44858538598529535, 0.40864463990929606, 0.1463159364444225], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 9, 1.8, 207.616, 40, 905, 188.0, 286.90000000000003, 352.79999999999995, 572.6900000000003, 0.4461624673855236, 0.23926333724617818, 131.98304911668757], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 2.8299999999999987, 1, 23, 2.0, 4.0, 7.0, 12.0, 0.4486369064870205, 0.25009141677964836, 0.18795432898723807], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 3.9579999999999993, 2, 26, 3.0, 6.0, 9.0, 15.990000000000009, 0.4486872308998333, 0.241330633582265, 0.1910426100315696], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 15.959999999999983, 7, 347, 11.0, 29.0, 40.0, 68.0, 0.4455446426821075, 0.18827306868649876, 0.32328092725859947], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 5.259999999999998, 2, 82, 4.0, 7.900000000000034, 11.0, 16.0, 0.44865502197512297, 0.23079795763260896, 0.1805135439978034], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 4.593999999999993, 2, 41, 4.0, 7.0, 10.0, 19.99000000000001, 0.44675685794114783, 0.27434797651533227, 0.22337842897057394], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 5.181999999999999, 2, 59, 4.0, 8.0, 12.0, 23.99000000000001, 0.44673849626035206, 0.26165962346199106, 0.21071747431030277], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 628.9140000000003, 363, 2746, 604.5, 764.0, 839.6999999999999, 2241.670000000002, 0.4463412957644889, 0.40780687331004023, 0.1965819574118989], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 21.480000000000025, 6, 230, 17.0, 42.0, 51.0, 70.98000000000002, 0.4463946932598865, 0.3952641917242888, 0.18352750572501195], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 13.716000000000015, 6, 77, 11.0, 20.0, 35.0, 64.0, 0.44672213168653685, 0.29770714561086575, 0.20896474714633903], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 640.0839999999998, 382, 4227, 598.0, 794.8000000000001, 837.9, 926.7700000000002, 0.446558153035479, 0.33563903867193606, 0.24682804161921987], "isController": false}, {"data": ["Query single patient #2", 500, 0, 0.0, 224.9220000000001, 141, 1131, 187.0, 250.90000000000003, 502.99999999999886, 1067.5500000000004, 0.4487822741772475, 8.677111482734, 0.2261441928471286], "isController": false}, {"data": ["Query single patient #1", 500, 0, 0.0, 340.29000000000013, 213, 1446, 295.0, 415.80000000000007, 582.2999999999998, 1250.91, 0.44856727612007247, 0.8694609300706044, 0.32065551378895807], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 24.771999999999995, 13, 149, 22.0, 33.0, 49.94999999999999, 97.96000000000004, 0.4483922894461907, 0.3658924870190432, 0.2767421161425708], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 25.20599999999998, 13, 157, 22.0, 33.0, 61.0, 120.81000000000017, 0.44841400450745755, 0.3729674724404753, 0.2837619872273755], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 25.328, 13, 152, 22.5, 34.0, 54.94999999999999, 108.96000000000004, 0.4483754014080781, 0.36288982878336923, 0.2736666268359852], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 28.251999999999995, 14, 117, 25.0, 39.900000000000034, 55.0, 108.95000000000005, 0.44838505155979713, 0.4010182502244167, 0.31176773116267137], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 24.935999999999996, 12, 146, 22.0, 34.900000000000034, 54.94999999999999, 116.99000000000001, 0.4482435576194681, 0.3364934620875599, 0.24732188481933545], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 2625.2120000000023, 1656, 8709, 2438.0, 3349.1000000000026, 4425.849999999999, 6252.080000000001, 0.4476131476514634, 0.37399914399580675, 0.28500368385620517], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["No results for path: $['rows'][1]", 500, 97.27626459143968, 2.1272069772388855], "isController": false}, {"data": ["500", 14, 2.7237354085603114, 0.05956179536268879], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 23505, 514, "No results for path: $['rows'][1]", 500, "500", 14, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["Query cross patient #1", 500, 500, "No results for path: $['rows'][1]", 500, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 1, "500", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 4, "500", 4, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 9, "500", 9, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});

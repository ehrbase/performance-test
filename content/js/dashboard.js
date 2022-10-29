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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8989363965113806, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Query cross patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [0.998, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.983, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.493, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.995, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [1.0, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [0.977, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.732, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.574, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #2"], "isController": false}, {"data": [0.999, 500, 1500, "Query single patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 23505, 514, 2.186768772601574, 188.95388215273337, 1, 3670, 16.0, 562.9000000000015, 1251.0, 2266.9900000000016, 26.162421835521233, 173.62565501707985, 216.75878755595897], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query cross patient #1", 500, 500, 100.0, 25.581999999999997, 16, 59, 27.0, 30.0, 32.0, 41.99000000000001, 0.5672426448482456, 0.32927770795966227, 0.28694500979628046], "isController": false}, {"data": ["Query participation #2", 500, 0, 0.0, 7.477999999999999, 4, 31, 7.0, 10.0, 12.0, 20.0, 0.5669821355268738, 6.079719539806115, 0.20597397892187214], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 7.867999999999997, 5, 41, 7.0, 10.0, 11.0, 16.99000000000001, 0.5669589907222831, 6.087908196299345, 0.24029316598971762], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 1, 0.2, 22.06199999999998, 10, 267, 20.0, 27.900000000000034, 33.94999999999999, 53.99000000000001, 0.563868226250998, 0.3042817968112124, 6.278540542689336], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 41.97399999999995, 26, 72, 43.0, 52.0, 54.0, 65.99000000000001, 0.5667250771312831, 2.357111429201303, 0.23687337208221595], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 2.542000000000002, 1, 14, 2.0, 3.0, 5.0, 10.0, 0.5667604088382886, 0.3541931538601485, 0.2407624783639214], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 37.304000000000016, 23, 96, 38.0, 46.0, 48.0, 56.99000000000001, 0.5667160843092185, 2.326017542271353, 0.2069841948551247], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 749.0320000000002, 571, 1249, 735.5, 886.9000000000001, 912.95, 1015.8400000000001, 0.5663873999193465, 2.3952102776940785, 0.27655634761686837], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 11.207999999999995, 7, 38, 11.0, 14.0, 16.0, 25.0, 0.5664676099485307, 0.8424136763549622, 0.2904252883036901], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 3.6899999999999946, 2, 22, 3.0, 5.0, 7.0, 15.0, 0.5644685133818551, 0.5446239172082742, 0.3097961958209009], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 17.976, 11, 38, 19.0, 23.0, 24.0, 31.0, 0.566685253942996, 0.9232774840223094, 0.3713337943317874], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 592.0, 592, 592, 592.0, 592.0, 592.0, 592.0, 1.6891891891891893, 0.7208746832770271, 1997.959446262669], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 4.773999999999997, 3, 22, 4.0, 6.0, 7.0, 14.0, 0.5644787095565116, 0.5672029808286095, 0.3324029901001724], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 18.765999999999984, 12, 37, 20.0, 23.0, 26.0, 31.99000000000001, 0.5666788313722468, 0.8903841526423101, 0.33812574801605744], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 10.902000000000005, 6, 30, 11.0, 14.0, 16.0, 19.99000000000001, 0.5666730511830433, 0.8771257677003161, 0.32484089945746725], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 1987.4820000000007, 1566, 3092, 1967.5, 2260.9, 2324.65, 2535.2800000000007, 0.5654221724650711, 0.8634659177649993, 0.31252827110862325], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 19.005999999999997, 11, 180, 17.0, 24.0, 30.0, 42.98000000000002, 0.5638173592599107, 0.3044514631483336, 4.546878664812835], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 22.01999999999999, 14, 41, 23.0, 27.0, 29.0, 34.0, 0.5667096610396175, 1.0259581094594044, 0.4737338572753053], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 17.869999999999997, 11, 36, 19.0, 23.0, 24.0, 31.99000000000001, 0.5666980995212535, 0.9593025582735656, 0.4073142590309009], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 85.0, 85, 85, 85.0, 85.0, 85.0, 85.0, 11.76470588235294, 5.480238970588235, 1604.5266544117646], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 733.0, 733, 733, 733.0, 733.0, 733.0, 733.0, 1.364256480218281, 0.6248401261937244, 2609.0659106412004], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 2.5400000000000014, 1, 21, 2.0, 3.0, 4.949999999999989, 12.990000000000009, 0.5644423873655215, 0.4742109800977614, 0.23977777197656433], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 409.2699999999997, 312, 824, 405.5, 478.0, 489.0, 642.7600000000002, 0.5642283725622513, 0.4965584361451466, 0.262278032558234], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 3.1479999999999997, 1, 18, 3.0, 4.0, 5.0, 12.0, 0.5644704251365454, 0.5113594910339518, 0.27672280607279864], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 1188.2239999999995, 928, 1833, 1189.0, 1358.0, 1377.9, 1621.9, 0.563854872777425, 0.5334419505769926, 0.29899726163881035], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 61.0, 61, 61, 61.0, 61.0, 61.0, 61.0, 16.393442622950822, 7.668417008196721, 1079.4857838114754], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 2, 0.4, 45.51800000000003, 10, 707, 43.0, 53.0, 65.0, 111.83000000000015, 0.5633771077346044, 0.3036921711004445, 25.770101295203972], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 45.108000000000004, 9, 186, 45.0, 55.0, 62.94999999999999, 95.96000000000004, 0.5641685284228105, 125.0216147067452, 0.17520077347505247], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 292.0, 292, 292, 292.0, 292.0, 292.0, 292.0, 3.4246575342465753, 1.7959385702054795, 1.4113334760273974], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 2.3019999999999996, 1, 13, 2.0, 3.0, 4.0, 6.990000000000009, 0.5670245725768771, 0.6160500487074108, 0.244197105963284], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 3.4040000000000017, 2, 36, 3.0, 4.0, 6.0, 13.0, 0.567018785332358, 0.581648312977359, 0.20986339808687862], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 2.217999999999997, 1, 13, 2.0, 3.0, 4.0, 8.0, 0.5669943516022693, 0.32167073496926324, 0.22092846317314987], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 123.39400000000005, 81, 271, 121.0, 149.0, 156.0, 202.84000000000015, 0.566931990838379, 0.5165503393087965, 0.1860245594938431], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 11, 2.2, 165.27999999999972, 28, 582, 164.0, 193.90000000000003, 221.0, 377.8800000000001, 0.5639559933859241, 0.3020061447940094, 166.829638199672], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 2.3120000000000003, 1, 45, 2.0, 3.0, 4.0, 9.970000000000027, 0.5670078541927963, 0.31614120926615574, 0.23865271987997577], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 3.248, 1, 17, 3.0, 4.0, 5.949999999999989, 9.990000000000009, 0.5670670159799485, 0.3050986678886961, 0.2425540556632983], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 12.027999999999995, 7, 345, 10.0, 15.0, 20.0, 40.91000000000008, 0.5631841984030349, 0.23795192364010728, 0.409738503720958], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 4.465999999999997, 2, 61, 4.0, 6.0, 7.0, 9.990000000000009, 0.5670284308055206, 0.2917239453979973, 0.2292478226108257], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 3.837999999999997, 2, 20, 3.0, 5.0, 6.949999999999989, 11.990000000000009, 0.5644353783579672, 0.34667687083517246, 0.283320102027339], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 4.076000000000002, 2, 26, 4.0, 5.0, 6.0, 11.0, 0.5644213608650548, 0.33068367195322523, 0.2673284765815933], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 518.582, 375, 856, 516.5, 629.0, 648.9, 706.8700000000001, 0.5639375473002618, 0.5153144554534452, 0.2494762782490416], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 16.258000000000006, 6, 117, 15.0, 26.0, 32.0, 55.960000000000036, 0.5642805873935203, 0.49961535461084955, 0.233096375456503], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 10.145999999999997, 6, 44, 10.0, 12.0, 14.949999999999989, 20.99000000000001, 0.5644889060995284, 0.37612601424544206, 0.26515543343151676], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 562.5780000000004, 455, 3670, 541.0, 635.0, 662.75, 731.96, 0.5642150020255319, 0.42387974406079076, 0.3129630089360372], "isController": false}, {"data": ["Query single patient #2", 500, 0, 0.0, 171.07799999999992, 141, 334, 175.0, 187.0, 191.0, 214.99, 0.5671171845580796, 10.965156488543665, 0.2868815445323098], "isController": false}, {"data": ["Query single patient #1", 500, 0, 0.0, 262.30199999999985, 209, 534, 265.0, 287.0, 295.95, 362.7800000000002, 0.5669371334751433, 1.0989943456524993, 0.40637876559644054], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 17.985999999999994, 12, 43, 19.0, 22.0, 24.0, 31.950000000000045, 0.5664457905713964, 0.4620969614290068, 0.35070960080299357], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 17.82000000000001, 11, 70, 19.0, 22.0, 23.94999999999999, 32.99000000000001, 0.5664547748172334, 0.4709230621298926, 0.3595660191710954], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 18.007999999999978, 11, 42, 19.0, 23.0, 25.0, 35.99000000000001, 0.5664323147369829, 0.4585667860517176, 0.3468291614649299], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 20.768, 13, 49, 22.0, 26.0, 28.0, 38.99000000000001, 0.5664348815131516, 0.5066616193778506, 0.3949555716800685], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 18.145999999999997, 11, 47, 19.0, 22.0, 24.0, 31.970000000000027, 0.5665491266078664, 0.4253046671042315, 0.31370444803384795], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 2217.6139999999987, 1734, 3079, 2201.0, 2554.8, 2659.9, 2881.91, 0.565193358299808, 0.4723382713335059, 0.3609731018828852], "isController": false}]}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 23505, 514, "No results for path: $['rows'][1]", 500, "500", 14, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["Query cross patient #1", 500, 500, "No results for path: $['rows'][1]", 500, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 1, "500", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 2, "500", 2, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 11, "500", 11, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});

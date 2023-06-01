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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8889385237183578, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Query cross patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.164, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.565, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [1.0, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [0.946, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [0.999, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.496, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.111, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 23505, 500, 2.1272069772388855, 327.9847266539043, 1, 23750, 9.0, 847.0, 1517.0, 6082.990000000002, 15.122076752340206, 95.25787005018175, 125.13647560676489], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query cross patient #1", 500, 500, 100.0, 6281.490000000002, 5262, 23750, 6060.5, 6593.6, 6808.95, 21337.960000000126, 0.3262438372539143, 0.1894731176301517, 0.16439630861623025], "isController": false}, {"data": ["Query participation #2", 500, 0, 0.0, 2.3880000000000012, 1, 11, 2.0, 3.0, 4.0, 6.0, 0.32735388722920467, 0.16805977739771993, 0.11828216628398998], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 3.7180000000000026, 2, 20, 4.0, 5.0, 5.0, 8.990000000000009, 0.32735152971369835, 0.18787867922659926, 0.13810142659796648], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 0, 0.0, 12.262000000000006, 8, 327, 11.0, 14.0, 16.0, 35.99000000000001, 0.32524090593902905, 0.1691983232449025, 3.578602819545938], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 33.938, 24, 46, 34.0, 40.0, 41.94999999999999, 43.99000000000001, 0.3272731080996167, 1.3610949787059752, 0.1361507266117546], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 2.2419999999999995, 1, 8, 2.0, 3.0, 4.0, 6.0, 0.3272818911656799, 0.20445849472421593, 0.1383916590573627], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 30.081999999999997, 21, 50, 30.0, 35.0, 37.0, 41.0, 0.32727182281241696, 1.3431919555195049, 0.11889171688107335], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 869.7580000000003, 689, 1083, 870.0, 1030.9, 1065.95, 1079.99, 0.32713221506456935, 1.3835105030295716, 0.15909359677944876], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 5.527999999999992, 3, 16, 5.0, 7.0, 8.0, 11.990000000000009, 0.3272906747031801, 0.4866882649192181, 0.16716115514625313], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 3.962000000000002, 2, 25, 4.0, 5.0, 6.0, 9.0, 0.32539478522317206, 0.31386297198513596, 0.1779502731689222], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 7.756, 5, 24, 8.0, 9.900000000000034, 10.0, 15.0, 0.3272688238482101, 0.5333171475036589, 0.21381137026802008], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 483.0, 483, 483, 483.0, 483.0, 483.0, 483.0, 2.070393374741201, 0.8956877587991718, 2448.8406605848863], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 4.128, 2, 16, 4.0, 5.0, 6.949999999999989, 9.990000000000009, 0.3253994440875897, 0.32689615442123476, 0.19098150966468888], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 8.096000000000002, 5, 35, 8.0, 10.0, 11.0, 15.0, 0.32726796701138894, 0.5141398937606362, 0.19463495303704673], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 6.688000000000004, 4, 19, 6.0, 8.0, 9.0, 13.0, 0.32726711017905435, 0.5064682247771966, 0.18696412056127618], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 1580.946, 1321, 1935, 1560.5, 1785.9, 1856.0, 1905.99, 0.32695936941308174, 0.4992867534618458, 0.18008309018454896], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 10.645999999999994, 7, 59, 10.0, 12.900000000000034, 16.0, 41.97000000000003, 0.3252339245001967, 0.1691946913286131, 2.6221985162828365], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 11.073999999999998, 8, 35, 11.0, 13.0, 14.949999999999989, 18.99000000000001, 0.3272731080996167, 0.5924506183743559, 0.2729406585127663], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 7.835999999999999, 5, 24, 8.0, 10.0, 11.0, 15.990000000000009, 0.3272701091118544, 0.554093223504212, 0.23458619149228624], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 61.0, 61, 61, 61.0, 61.0, 61.0, 61.0, 16.393442622950822, 7.7324538934426235, 2235.78381147541], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 582.0, 582, 582, 582.0, 582.0, 582.0, 582.0, 1.7182130584192439, 0.7970226589347079, 3285.9851535652924], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 2.3040000000000007, 1, 18, 2.0, 3.0, 4.0, 6.0, 0.3254119389735466, 0.2735208105409388, 0.13760094685111884], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 570.5539999999999, 446, 702, 561.5, 657.0, 670.95, 687.0, 0.32530671543664946, 0.28645734216443475, 0.1505814288251678], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 3.315999999999997, 1, 16, 3.0, 4.0, 5.0, 8.0, 0.3254049501902643, 0.29480608041114265, 0.15888913583508998], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 772.7799999999995, 614, 939, 751.0, 886.8000000000001, 901.0, 928.98, 0.3252582550545133, 0.3076962150916578, 0.17184054295360515], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 51.0, 51, 51, 51.0, 51.0, 51.0, 51.0, 19.607843137254903, 9.286917892156863, 1291.1113664215686], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 0, 0.0, 22.22799999999997, 15, 552, 20.0, 25.0, 29.94999999999999, 70.96000000000004, 0.325118879718369, 0.16913484220192615, 14.830373898090839], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 30.141999999999996, 20, 340, 28.0, 35.0, 41.0, 92.98000000000002, 0.3253422763418254, 73.5828628019827, 0.10039859308986018], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 444.0, 444, 444, 444.0, 444.0, 444.0, 444.0, 2.2522522522522523, 1.1811127533783783, 0.9237753378378378], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 2.685999999999996, 1, 10, 3.0, 3.900000000000034, 4.0, 6.0, 0.3273082431926432, 0.3556632375809433, 0.14032062379059604], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 3.3760000000000003, 2, 10, 3.0, 4.0, 5.0, 7.0, 0.3273065291106427, 0.3358439875018002, 0.12050250144014873], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 1.8179999999999994, 1, 9, 2.0, 2.0, 3.0, 6.0, 0.32735495883838744, 0.18564286928421875, 0.12691398306527327], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 91.52199999999999, 66, 120, 90.0, 112.0, 115.0, 118.99000000000001, 0.3273388854372822, 0.29815649593379634, 0.10676873802348852], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 0, 0.0, 81.51200000000001, 57, 393, 79.0, 93.0, 103.94999999999999, 332.29000000000065, 0.32529295883873016, 0.16922540244431636, 96.18696778005771], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 203.77600000000004, 12, 349, 260.0, 333.90000000000003, 337.95, 342.0, 0.3273022439841848, 0.18241666373458404, 0.13712174088790552], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 429.0259999999999, 343, 543, 414.0, 502.0, 512.95, 528.99, 0.3272540440418492, 0.1759981197209832, 0.13933863593969362], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 7.278, 4, 278, 6.0, 8.0, 10.0, 34.960000000000036, 0.3250641351538659, 0.1465677361737221, 0.2358619652532445], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 402.6239999999999, 314, 516, 394.0, 469.0, 476.95, 493.99, 0.3272392655703715, 0.168320501531807, 0.13166267325682915], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 3.4880000000000004, 2, 18, 3.0, 4.0, 5.0, 10.980000000000018, 0.32540960934576396, 0.19979323778493677, 0.16270480467288198], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 4.290000000000005, 2, 48, 4.0, 5.0, 6.0, 10.990000000000009, 0.32539986762733386, 0.19057183067850428, 0.1534845078750022], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 677.5379999999998, 549, 898, 683.5, 801.0, 830.95, 849.98, 0.32524852239596275, 0.2972053661046155, 0.14324910507869063], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 245.3119999999999, 174, 310, 238.0, 288.0, 295.95, 302.99, 0.3253573073949812, 0.28809055096494474, 0.13376506485672565], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 4.557999999999995, 3, 32, 4.0, 5.900000000000034, 6.0, 10.990000000000009, 0.32540177356982664, 0.21694828597056287, 0.15221430619135448], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 1001.1699999999988, 809, 9546, 955.0, 1089.9, 1110.95, 1139.95, 0.3252277895437965, 0.24446394715796443, 0.1797645789861219], "isController": false}, {"data": ["Query single patient #2", 500, 0, 0.0, 134.32399999999996, 118, 172, 133.0, 150.0, 151.0, 155.0, 0.3273328851055027, 6.328875845378092, 0.1649450866351947], "isController": false}, {"data": ["Query single patient #1", 500, 0, 0.0, 181.74600000000015, 160, 254, 175.5, 203.0, 205.0, 213.98000000000002, 0.3273039580213035, 0.6343783579340443, 0.2339711887417912], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 6.991999999999998, 5, 15, 7.0, 9.0, 10.0, 13.0, 0.3272874611591606, 0.2671068400051973, 0.2019977299341694], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 6.866000000000001, 4, 16, 7.0, 9.0, 9.0, 12.990000000000009, 0.32728810386291607, 0.27222124115340257, 0.20711200322575157], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 8.336, 5, 22, 8.0, 10.0, 11.0, 16.0, 0.32728424767824554, 0.2648669227474989, 0.1997584519520542], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 9.621999999999998, 7, 25, 9.0, 12.0, 13.0, 16.0, 0.32728596152688066, 0.2926748318650194, 0.22756602012415922], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 7.9460000000000015, 5, 28, 8.0, 10.0, 11.0, 25.940000000000055, 0.32725811371041325, 0.24567049276399586, 0.18056722094373387], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 1615.652, 1431, 1967, 1600.0, 1793.0, 1855.95, 1937.96, 0.32695381058127154, 0.27322035669189443, 0.208177621581044], "isController": false}]}, function(index, item){
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

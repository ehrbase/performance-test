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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9007232503722612, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Query cross patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.986, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.989, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [1.0, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [0.981, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.708, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.673, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #2"], "isController": false}, {"data": [0.998, 500, 1500, "Query single patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 23505, 515, 2.191023186556052, 184.57655817910916, 1, 3362, 16.0, 539.0, 1202.9500000000007, 2187.980000000003, 26.739275849673053, 177.925392839764, 221.48586676619715], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query cross patient #1", 500, 500, 100.0, 24.290000000000003, 15, 73, 25.0, 28.0, 30.0, 37.97000000000003, 0.5795522379409669, 0.33655458730085136, 0.2920399948999403], "isController": false}, {"data": ["Query participation #2", 500, 0, 0.0, 7.506000000000001, 4, 36, 7.0, 10.0, 12.0, 22.99000000000001, 0.5794991736341784, 6.2018205292508, 0.20938934984828714], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 7.644000000000001, 4, 44, 7.0, 10.0, 11.0, 18.99000000000001, 0.5794729809133189, 6.222281272128625, 0.24446516382280645], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 0, 0.0, 22.070000000000007, 14, 300, 20.0, 28.0, 34.0, 47.99000000000001, 0.5763688760806917, 0.3111964157060519, 6.416606628242075], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 43.03399999999998, 27, 87, 44.0, 52.0, 54.0, 61.99000000000001, 0.5792796310220462, 2.409295263969039, 0.24098937774940596], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 2.482, 1, 13, 2.0, 3.0, 4.0, 9.980000000000018, 0.5793192303859889, 0.36200889298467587, 0.24496604175501285], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 37.90200000000003, 22, 60, 39.0, 46.0, 48.0, 50.99000000000001, 0.5792702353574967, 2.377478914563433, 0.21043801518846558], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 762.0280000000008, 580, 1100, 755.0, 904.9000000000001, 922.0, 969.8700000000001, 0.5789375569529822, 2.44834954310248, 0.28155361656502453], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 10.795999999999992, 7, 26, 11.0, 13.0, 14.949999999999989, 22.0, 0.5790253844728553, 0.8610231867096304, 0.29573269148369463], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 3.256000000000001, 2, 15, 3.0, 4.0, 6.0, 10.990000000000009, 0.5768835825855, 0.5565371690418887, 0.3154832092264453], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 18.03999999999999, 10, 184, 18.0, 22.0, 23.0, 35.98000000000002, 0.5792058161531235, 0.9437751520125665, 0.3784069248109762], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 666.0, 666, 666, 666.0, 666.0, 666.0, 666.0, 1.5015015015015014, 0.6407774962462462, 1775.9610196133633], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 4.275999999999999, 2, 24, 4.0, 6.0, 7.0, 11.990000000000009, 0.5768902385556514, 0.5796417345762626, 0.33858499352729154], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 18.314, 12, 85, 19.0, 22.0, 24.0, 31.0, 0.5791930682173596, 0.9100141214509945, 0.3444615024847383], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 10.331999999999995, 7, 24, 11.0, 13.0, 14.0, 19.99000000000001, 0.5791843462688364, 0.8964585899843968, 0.33088168219459896], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 1910.1740000000007, 1519, 2425, 1895.5, 2164.9, 2222.65, 2355.96, 0.5779912492124869, 0.8826276331113846, 0.31834674273031505], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 19.203999999999994, 12, 241, 17.0, 24.0, 31.94999999999999, 47.99000000000001, 0.5763290147079164, 0.31114224988761585, 4.646652681082577], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 22.211999999999982, 14, 74, 23.0, 27.0, 29.0, 35.0, 0.5792407081101808, 1.0485784111630112, 0.4830776999278266], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 17.494000000000025, 11, 47, 19.0, 22.0, 23.0, 29.0, 0.5792192356391278, 0.9805638641337023, 0.4151825380460155], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 74.0, 74, 74, 74.0, 74.0, 74.0, 74.0, 13.513513513513514, 6.294869087837838, 1843.0109797297298], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 571.0, 571, 571, 571.0, 571.0, 571.0, 571.0, 1.7513134851138354, 0.8021152583187391, 3349.2878447898424], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 2.2680000000000033, 1, 28, 2.0, 3.0, 4.0, 9.990000000000009, 0.5770034135521945, 0.48486205399078636, 0.24398679498837914], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 407.7740000000001, 314, 585, 410.0, 473.90000000000003, 489.0, 538.7900000000002, 0.5767205592805296, 0.5077157190811458, 0.2669585401357139], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 2.9959999999999987, 1, 22, 3.0, 4.0, 5.0, 12.0, 0.5770067429007976, 0.5226835865960179, 0.28174157368203], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 1156.9419999999993, 928, 1478, 1149.5, 1324.8000000000002, 1359.95, 1422.98, 0.5762293853937376, 0.5450837369339987, 0.30443368896290235], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 61.0, 61, 61, 61.0, 61.0, 61.0, 61.0, 16.393442622950822, 7.668417008196721, 1079.4537653688524], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 5, 1.0, 44.87999999999999, 14, 772, 44.0, 53.900000000000034, 60.0, 97.97000000000003, 0.5758259070985514, 0.3096683761018429, 26.33841194988472], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 42.702000000000005, 7, 185, 43.0, 52.0, 57.0, 84.92000000000007, 0.5767159028256773, 128.29431387676505, 0.17797092313761134], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 296.0, 296, 296, 296.0, 296.0, 296.0, 296.0, 3.3783783783783785, 1.7716691300675678, 1.3856630067567568], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 2.2159999999999966, 1, 13, 2.0, 3.0, 4.949999999999989, 7.0, 0.5795468638980554, 0.6296550290758661, 0.2484580793469202], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 3.1900000000000004, 2, 20, 3.0, 4.0, 6.0, 14.960000000000036, 0.5795408182189088, 0.5945919007576917, 0.2133661020200475], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 2.2059999999999964, 1, 18, 2.0, 3.0, 4.0, 7.0, 0.5795206668660218, 0.3287115926300039, 0.2246774460408307], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 122.76200000000001, 88, 177, 123.0, 148.0, 153.0, 166.0, 0.5794528342776483, 0.5279256700357986, 0.18900121743040482], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 9, 1.8, 171.6680000000001, 33, 645, 172.5, 202.0, 220.89999999999998, 351.97, 0.5764619073971592, 0.3091716080260791, 170.52801568841082], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 2.2539999999999996, 1, 18, 2.0, 3.0, 4.0, 8.0, 0.5795361161112199, 0.32309364854495864, 0.24279393926925133], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 3.292000000000002, 2, 27, 3.0, 4.900000000000034, 5.949999999999989, 9.0, 0.5795918745855918, 0.3117717518657062, 0.2467793528508965], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 12.01200000000001, 6, 304, 10.0, 17.0, 23.899999999999977, 43.92000000000007, 0.5756429355947659, 0.24315067655314218, 0.41767841908878023], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 4.470000000000002, 2, 63, 4.0, 5.0, 7.0, 13.970000000000027, 0.5795508944208954, 0.29810083164104473, 0.23317868017715712], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 3.6119999999999997, 2, 18, 3.0, 5.0, 6.0, 13.0, 0.5769954232723026, 0.3543585837589636, 0.2884977116361513], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 3.9759999999999938, 2, 31, 4.0, 5.0, 6.949999999999989, 11.980000000000018, 0.5769767801464598, 0.3380069714661903, 0.2721482273542383], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 526.92, 383, 752, 522.0, 630.9000000000001, 642.95, 705.9200000000001, 0.5764911520137989, 0.5267203739035138, 0.2539038179279524], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 15.153999999999987, 5, 120, 14.0, 24.0, 33.94999999999999, 43.99000000000001, 0.57683300223119, 0.5106966199460776, 0.23715497455012793], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 9.402000000000001, 5, 52, 10.0, 12.0, 13.0, 19.980000000000018, 0.5768995571719, 0.3844934140425429, 0.2698582889505274], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 523.3140000000004, 428, 3362, 513.0, 567.0, 584.9, 659.99, 0.5766094900696314, 0.433322031787328, 0.3187118861127064], "isController": false}, {"data": ["Query single patient #2", 500, 0, 0.0, 173.658, 143, 295, 181.0, 193.0, 198.0, 223.0, 0.5793722617418479, 11.20207441703563, 0.29194930376835304], "isController": false}, {"data": ["Query single patient #1", 500, 1, 0.2, 260.34400000000016, 23, 403, 263.0, 288.0, 294.0, 328.9200000000001, 0.5794541773431099, 1.1213819062246126, 0.41421919708511373], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 17.25, 11, 44, 18.0, 21.0, 22.0, 30.960000000000036, 0.5790126444781301, 0.47244717667644426, 0.3573593665138459], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 17.064000000000007, 11, 36, 18.0, 21.0, 22.0, 26.99000000000001, 0.5790166675737928, 0.4814975947647629, 0.36640898494904073], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 16.84400000000001, 11, 33, 18.0, 21.0, 23.0, 28.0, 0.57899252983838, 0.46866957431890216, 0.35338899526268314], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 19.941999999999993, 13, 59, 21.0, 24.900000000000034, 26.0, 32.99000000000001, 0.5789992345630118, 0.5178673192856539, 0.40258540528209424], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 16.918000000000003, 10, 45, 18.0, 21.0, 23.0, 28.99000000000001, 0.5788457352961606, 0.43453564958936686, 0.31938265668196364], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 2146.5240000000017, 1707, 2768, 2134.5, 2440.7000000000003, 2535.5499999999997, 2641.9700000000003, 0.5775839662690965, 0.4826605232188755, 0.36775854102290123], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["No results for path: $['rows'][1]", 500, 97.0873786407767, 2.1272069772388855], "isController": false}, {"data": ["400", 1, 0.1941747572815534, 0.0042544139544777706], "isController": false}, {"data": ["500", 14, 2.7184466019417477, 0.05956179536268879], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 23505, 515, "No results for path: $['rows'][1]", 500, "500", 14, "400", 1, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["Query cross patient #1", 500, 500, "No results for path: $['rows'][1]", 500, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 5, "500", 5, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 9, "500", 9, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Query single patient #1", 500, 1, "400", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});

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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8889385237183578, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Query cross patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.466, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.001, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.848, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.376, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [1.0, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [0.991, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [0.988, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.624, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.526, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [0.985, 500, 1500, "Query single patient #2"], "isController": false}, {"data": [0.977, 500, 1500, "Query single patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 23505, 500, 2.1272069772388855, 226.5942565411605, 1, 6974, 15.0, 655.0, 1520.4000000000087, 2916.9900000000016, 21.559235846391477, 145.2152204905953, 178.5787343344704], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query cross patient #1", 500, 500, 100.0, 24.718, 13, 135, 21.0, 34.900000000000034, 48.94999999999999, 92.95000000000005, 0.46751124130779725, 0.27151719757632825, 0.2355818364402572], "isController": false}, {"data": ["Query participation #2", 500, 0, 0.0, 9.578, 4, 55, 8.0, 15.900000000000034, 20.0, 33.98000000000002, 0.4673154874894971, 4.995040322316838, 0.16885422887804094], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 9.9, 5, 51, 8.0, 15.0, 19.0, 31.0, 0.46729801744143123, 5.017845198594648, 0.1971413511081038], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 0, 0.0, 28.022000000000016, 14, 330, 23.0, 43.0, 56.0, 101.92000000000007, 0.463423812198427, 0.25013571800800055, 5.1592104092403], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 56.79400000000003, 27, 192, 51.0, 90.0, 115.94999999999999, 168.95000000000005, 0.46712688006891057, 1.9427323392756544, 0.19433208096616786], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 3.335999999999997, 1, 20, 3.0, 5.0, 9.0, 16.0, 0.4671535029038262, 0.29183863998301435, 0.1975365886302312], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 50.772000000000006, 24, 234, 45.0, 74.0, 101.94999999999999, 171.95000000000005, 0.46712688006891057, 1.9171863380218856, 0.16969843690003392], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 939.628, 566, 3942, 854.0, 1284.2000000000007, 1706.8, 2571.95, 0.46691313454662264, 1.9746732235472697, 0.22707298926193173], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 10.834000000000005, 5, 74, 9.0, 16.900000000000034, 23.94999999999999, 42.99000000000001, 0.4668011053850175, 0.6941432726375196, 0.2384150176917619], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 4.237999999999999, 1, 37, 3.0, 7.0, 10.0, 17.0, 0.46451435488710907, 0.4480522201811977, 0.2540312878288878], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 17.412000000000006, 8, 93, 15.0, 27.0, 40.89999999999998, 73.97000000000003, 0.46710898773745485, 0.7612006239525081, 0.30517178984019266], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 816.0, 816, 816, 816.0, 816.0, 816.0, 816.0, 1.2254901960784315, 0.5229875153186275, 1449.4975968903186], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 5.078000000000005, 2, 42, 4.0, 8.0, 10.0, 18.980000000000018, 0.46452428068415136, 0.4666609109205014, 0.2726358327062256], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 17.95599999999999, 8, 105, 15.0, 29.900000000000034, 38.94999999999999, 72.97000000000003, 0.46710156936785274, 0.7338193024001547, 0.27779771068849834], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 11.213999999999986, 5, 57, 9.0, 21.0, 28.0, 38.98000000000002, 0.46709633301352804, 0.7228635057518242, 0.26684702618448625], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 2364.4760000000006, 1470, 4748, 2246.0, 3187.0000000000005, 3507.5, 4472.770000000001, 0.4661830794189494, 0.7118897882013725, 0.25676489921121826], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 23.523999999999994, 12, 76, 19.0, 39.0, 50.0, 67.95000000000005, 0.4634053434343341, 0.250125749384366, 3.7362055814393185], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 22.675999999999974, 11, 84, 20.0, 38.0, 52.0, 68.97000000000003, 0.46712644365427414, 0.8456220311194965, 0.3895761551569825], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 16.455999999999978, 8, 95, 14.0, 25.0, 35.0, 63.88000000000011, 0.4671216431470919, 0.7908725233794383, 0.33483133405270066], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 104.0, 104, 104, 104.0, 104.0, 104.0, 104.0, 9.615384615384617, 4.479041466346154, 1311.3731971153848], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 778.0, 778, 778, 778.0, 778.0, 778.0, 778.0, 1.2853470437017993, 0.588698987789203, 2458.1534182197943], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 3.133999999999999, 1, 44, 2.0, 5.0, 8.0, 19.99000000000001, 0.46453593324804454, 0.3904596905331293, 0.19642974521133133], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 494.94400000000013, 311, 2188, 457.0, 657.6000000000001, 812.0, 1605.2500000000034, 0.46440519910908507, 0.4089441524303253, 0.21496881286885383], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 4.2219999999999995, 1, 38, 3.0, 7.0, 10.0, 25.960000000000036, 0.4645937731425773, 0.4209065325020512, 0.22685242829227406], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 1370.8919999999996, 911, 5361, 1263.0, 1812.8000000000002, 2219.65, 3038.4900000000007, 0.4641150856895683, 0.4390555904866618, 0.245201427107477], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 85.0, 85, 85, 85.0, 85.0, 85.0, 85.0, 11.76470588235294, 5.503216911764706, 774.6668198529411], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 0, 0.0, 53.600000000000016, 28, 809, 45.0, 76.90000000000003, 102.0, 166.93000000000006, 0.46306286448835726, 0.24994089436656242, 21.180603952056323], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 54.85600000000001, 28, 396, 47.0, 81.90000000000003, 99.94999999999999, 168.99, 0.4639415359434066, 104.9879353090941, 0.1431694583575356], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 380.0, 380, 380, 380.0, 380.0, 380.0, 380.0, 2.631578947368421, 1.3800370065789473, 1.079358552631579], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 2.766, 1, 15, 2.0, 5.0, 7.0, 10.0, 0.4673395109385486, 0.5078255343910473, 0.2003535598652567], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 3.8779999999999997, 2, 26, 3.0, 7.0, 9.0, 14.0, 0.46733514285500644, 0.47952510541912485, 0.17205600474251703], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 2.7419999999999987, 1, 25, 2.0, 5.0, 7.0, 12.0, 0.4673259701453477, 0.26502037512021964, 0.18118008803486627], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 157.44799999999987, 86, 673, 138.0, 211.90000000000003, 331.34999999999985, 647.7900000000002, 0.46728229551493106, 0.42562389633762826, 0.15241434248240915], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 0, 0.0, 213.4419999999999, 108, 1046, 189.0, 313.80000000000007, 381.6499999999999, 660.7300000000002, 0.46351918598614633, 0.2501871965687529, 137.11748513725732], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 2.8200000000000003, 1, 16, 2.0, 4.0, 6.949999999999989, 11.0, 0.46733164844696345, 0.2604598096534829, 0.19578640349975324], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 3.8480000000000034, 2, 36, 3.0, 6.0, 8.0, 15.990000000000009, 0.4673635368576906, 0.2513493880692371, 0.1989946309276886], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 16.171999999999983, 7, 323, 12.0, 28.0, 33.0, 57.98000000000002, 0.4629368156057852, 0.1956224506648236, 0.33590044335458835], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 5.254000000000008, 2, 52, 4.0, 8.0, 10.0, 24.940000000000055, 0.46734169501094047, 0.24038432048751215, 0.18803201010205806], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 4.565999999999997, 2, 25, 4.0, 8.0, 10.0, 20.970000000000027, 0.4645264385222485, 0.28520743863605746, 0.23226321926112425], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 5.092, 2, 41, 4.0, 9.0, 11.0, 16.0, 0.46451003945548275, 0.27204230054867923, 0.21909995025097476], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 642.0919999999998, 374, 2192, 602.0, 891.5000000000002, 1114.6999999999998, 1712.5300000000004, 0.4640302324977077, 0.4240212195804981, 0.20437269028951774], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 21.04800000000001, 6, 194, 16.5, 39.0, 50.0, 73.8900000000001, 0.4641077621094998, 0.4109483876780317, 0.19080992953915957], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 9.04199999999999, 4, 63, 7.0, 14.0, 22.0, 34.0, 0.46454024916080805, 0.30971315771931174, 0.21729958920705766], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 651.8319999999994, 393, 4828, 620.5, 776.0, 801.0, 977.1900000000007, 0.4643547373005945, 0.349041489109024, 0.2566648255001333], "isController": false}, {"data": ["Query single patient #2", 500, 0, 0.0, 212.74800000000013, 139, 1086, 187.0, 256.80000000000007, 330.95, 757.6900000000003, 0.467412033055379, 9.037261028294788, 0.23553184478181205], "isController": false}, {"data": ["Query single patient #1", 500, 0, 0.0, 308.94199999999995, 200, 1337, 271.0, 392.90000000000003, 491.95, 1167.8000000000002, 0.4672709414481474, 0.9056614357437038, 0.33402571205082415], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 16.86599999999999, 8, 124, 14.0, 27.900000000000034, 36.94999999999999, 55.0, 0.46676406476818166, 0.3809369107103683, 0.2880809462241121], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 16.90199999999999, 8, 122, 14.0, 25.0, 43.0, 66.95000000000005, 0.4667710366704662, 0.38823589808847925, 0.29537854664302937], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 16.71600000000001, 8, 83, 14.0, 28.800000000000068, 38.94999999999999, 66.92000000000007, 0.4667231090479875, 0.37771299579995876, 0.28486517886229706], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 19.38999999999999, 10, 80, 17.0, 28.0, 39.0, 71.99000000000001, 0.4667357435567131, 0.41737752708234155, 0.32452719669177704], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 17.681999999999995, 8, 98, 14.0, 27.900000000000034, 43.94999999999999, 83.99000000000001, 0.46644184169896774, 0.3501547930980601, 0.25736293023429374], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 2698.3219999999983, 1664, 6974, 2586.5, 3503.9000000000005, 3945.85, 5671.790000000003, 0.46573668365674087, 0.3891948609100681, 0.2965432790470655], "isController": false}]}, function(index, item){
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

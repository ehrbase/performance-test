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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8710487130397788, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Query cross patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.481, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [0.5, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [0.993, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [0.801, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [0.83, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [0.846, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.491, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 23505, 500, 2.1272069772388855, 486.1953626887905, 1, 22535, 13.0, 1025.0, 1829.8500000000022, 10402.970000000005, 10.180974896024546, 64.2224614415338, 84.35059217658892], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query cross patient #1", 500, 500, 100.0, 10966.924000000005, 9067, 22535, 10528.0, 12702.100000000002, 13127.75, 19311.110000000044, 0.2190791664475875, 0.12729697659796343, 0.11082325021469758], "isController": false}, {"data": ["Query participation #2", 500, 0, 0.0, 2.9259999999999984, 2, 9, 3.0, 4.0, 4.0, 6.990000000000009, 0.21986652343095556, 0.11287698245399183, 0.07987338546515181], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 4.411999999999996, 2, 16, 4.0, 5.0, 6.0, 9.990000000000009, 0.21986516988322083, 0.12612617001250154, 0.09318504270441194], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 0, 0.0, 16.702000000000027, 10, 417, 15.0, 20.0, 24.94999999999999, 38.99000000000001, 0.21869549014908035, 0.12850709314219055, 2.4351230260545056], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 45.173999999999985, 28, 98, 46.0, 56.0, 59.0, 72.97000000000003, 0.21979915632291838, 0.9141219384999762, 0.09186917861934478], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 2.7520000000000002, 1, 15, 3.0, 4.0, 4.0, 8.0, 0.21980427747916145, 0.13731542416620543, 0.09337388740569846], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 39.80200000000001, 25, 85, 41.0, 50.0, 52.0, 55.0, 0.21979857658441804, 0.9020992927706051, 0.08027799574469956], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 1113.0480000000025, 772, 1937, 1113.5, 1368.4, 1491.8, 1594.89, 0.21972787142579658, 0.9293373155714112, 0.10728899971962724], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 6.686, 4, 18, 6.0, 8.0, 10.0, 15.0, 0.21971000915311897, 0.3267135039429158, 0.1126442918021362], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 4.357999999999997, 3, 20, 4.0, 5.0, 6.0, 12.990000000000009, 0.21885372298633785, 0.2110976667293318, 0.1201130784358612], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 10.236, 7, 23, 10.0, 12.0, 14.0, 20.0, 0.2197979968489759, 0.358244977286075, 0.14402778895084262], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 533.0, 533, 533, 533.0, 533.0, 533.0, 533.0, 1.876172607879925, 0.8904491088180112, 2219.1219365619136], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 4.628, 3, 22, 4.0, 6.0, 7.0, 12.0, 0.21885535149482582, 0.21986200062133035, 0.128876735304082], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 15.771999999999993, 7, 36, 16.0, 20.0, 20.0, 24.980000000000018, 0.2197966441448372, 0.345301815822501, 0.13114819294189017], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 7.686, 5, 24, 7.0, 9.0, 10.0, 16.0, 0.2197966441448372, 0.34015033197535643, 0.12599670909474556], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 2185.988000000002, 1616, 3467, 2132.0, 2793.5, 2983.7, 3316.0, 0.21955554931041993, 0.3352746171994109, 0.12135589932587665], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 14.201999999999991, 9, 85, 13.0, 18.0, 23.0, 34.0, 0.21869128139094654, 0.12850462004467425, 1.7636255876234732], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 14.53400000000001, 10, 33, 14.0, 17.0, 19.0, 23.99000000000001, 0.21979983268836736, 0.39789565219995454, 0.1837389226379321], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 10.183999999999997, 6, 28, 10.0, 13.0, 14.949999999999989, 18.99000000000001, 0.2197990596996226, 0.3720743027973827, 0.15798057415910377], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 79.0, 79, 79, 79.0, 79.0, 79.0, 79.0, 12.658227848101266, 6.502175632911392, 1726.3894382911392], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 710.0, 710, 710, 710.0, 710.0, 710.0, 710.0, 1.4084507042253522, 0.7124779929577465, 2693.584947183099], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 2.733999999999998, 2, 17, 3.0, 3.0, 4.0, 8.0, 0.21883887593849052, 0.18400417205375033, 0.09296378030590173], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 716.4519999999997, 543, 1089, 709.0, 853.0, 869.0, 946.7700000000002, 0.2187859219135542, 0.1925957087219883, 0.1017012683895037], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 3.770000000000001, 2, 18, 3.0, 5.0, 5.949999999999989, 11.0, 0.2188544893402544, 0.1982749006893041, 0.10728999379766377], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 963.4419999999999, 760, 1296, 922.0, 1154.9, 1191.0, 1258.7800000000002, 0.21878008226131093, 0.20696723973374462, 0.11601326627723811], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 68.0, 68, 68, 68.0, 68.0, 68.0, 68.0, 14.705882352941176, 7.5827205882352935, 968.362247242647], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 0, 0.0, 29.932, 20, 514, 28.0, 35.0, 42.0, 78.0, 0.21864490012956897, 0.12847736607125287, 10.001296017645517], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 37.445999999999984, 27, 235, 35.0, 44.0, 50.0, 109.95000000000005, 0.2187576838636457, 49.50384270431093, 0.06793451510609311], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 990.0, 990, 990, 990.0, 990.0, 990.0, 990.0, 1.0101010101010102, 0.5297111742424242, 0.41627209595959597], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 3.0440000000000014, 2, 18, 3.0, 4.0, 4.0, 7.990000000000009, 0.21982911364022062, 0.2388108423785686, 0.09467249913607158], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 3.834000000000003, 2, 13, 4.0, 5.0, 5.0, 9.990000000000009, 0.21982805049889975, 0.22562429792416372, 0.08136213978426075], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 2.074000000000001, 1, 14, 2.0, 3.0, 4.0, 6.0, 0.21986710352794356, 0.12468654852510948, 0.08567087334731395], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 199.80200000000013, 90, 396, 200.5, 276.80000000000007, 306.0, 331.99, 0.2198473819474521, 0.20024790196895317, 0.07213742220150772], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 0, 0.0, 116.54999999999998, 85, 376, 114.0, 134.0, 143.95, 307.4300000000005, 0.21872438190676918, 0.12858601358190921, 64.70311500702981], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 270.804, 17, 530, 324.5, 445.0, 464.95, 509.94000000000005, 0.21982515107483508, 0.12251602731437415, 0.09252406261059953], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 501.6619999999993, 296, 969, 479.5, 755.6000000000001, 871.6499999999999, 936.99, 0.21986797367916514, 0.11824559744614553, 0.09404509030417414], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 8.162, 5, 263, 7.0, 10.0, 14.0, 27.99000000000001, 0.2186212867174451, 0.1028438086178325, 0.1590555259809537], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 517.318000000001, 295, 1080, 461.5, 882.7, 929.95, 1003.8600000000001, 0.21980079893194396, 0.11305788945844161, 0.08886477613068829], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 3.9800000000000026, 2, 29, 4.0, 5.0, 6.0, 10.990000000000009, 0.21883619410595348, 0.13435986679331446, 0.10984551149458995], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 4.412, 3, 28, 4.0, 5.0, 6.0, 11.0, 0.2188337038917386, 0.1281608989852681, 0.10364682264403634], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 872.0580000000001, 586, 1453, 863.0, 1131.8000000000004, 1278.8, 1358.7800000000002, 0.21874801759609055, 0.19988740971175573, 0.09677036325295801], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 475.6319999999998, 253, 1022, 390.5, 870.9000000000001, 903.9, 946.9200000000001, 0.21875108008345792, 0.19369510920163294, 0.0903629949954128], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 5.654000000000003, 3, 39, 5.0, 7.0, 7.949999999999989, 15.0, 0.21885611786014744, 0.14597532079929754, 0.1028025319245419], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 1178.8839999999998, 885, 9550, 1094.5, 1408.9, 1427.95, 1606.7900000000002, 0.21876696811296426, 0.1643785943412861, 0.12134730262515987], "isController": false}, {"data": ["Query single patient #2", 500, 0, 0.0, 170.31599999999995, 141, 293, 171.5, 189.0, 192.0, 234.0, 0.219939349524975, 4.252518731684551, 0.11125838188861041], "isController": false}, {"data": ["Query single patient #1", 500, 0, 0.0, 230.614, 194, 349, 224.5, 258.0, 264.95, 302.0, 0.21992009862976583, 0.4262476747573072, 0.15763803944750793], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 9.436000000000007, 6, 25, 9.0, 11.900000000000034, 13.0, 18.99000000000001, 0.219707305927044, 0.17937041772950074, 0.1360297187087362], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 9.193999999999999, 6, 37, 9.0, 11.0, 13.0, 20.0, 0.21970846444435949, 0.1826798640597818, 0.13946338075081413], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 10.39399999999999, 6, 38, 10.0, 13.0, 15.0, 21.99000000000001, 0.21970412006742282, 0.17780371224714253, 0.1345258625803458], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 12.372000000000003, 8, 29, 12.0, 15.0, 17.0, 24.99000000000001, 0.21970605088040607, 0.19647170688642251, 0.15319347688340815], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 9.554000000000002, 6, 42, 10.0, 12.0, 13.0, 19.99000000000001, 0.21968433119082528, 0.16491556858369072, 0.12164161697773236], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 2015.7440000000004, 1624, 2733, 1966.0, 2489.0, 2567.8, 2667.6400000000003, 0.21952855803105717, 0.18344998280542568, 0.14020671577374155], "isController": false}]}, function(index, item){
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

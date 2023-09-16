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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.891852797277175, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Query cross patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.198, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.647, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [1.0, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [0.984, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [0.998, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.496, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.094, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 23505, 500, 2.1272069772388855, 324.12707934482114, 1, 18037, 9.0, 843.9000000000015, 1511.0, 6049.990000000002, 15.28612464711196, 96.29125014063494, 126.49398593544839], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query cross patient #1", 500, 500, 100.0, 6188.663999999997, 5134, 18037, 6043.5, 6509.6, 6703.9, 15650.960000000077, 0.32972939108873345, 0.19149742790466864, 0.16615270097830712], "isController": false}, {"data": ["Query participation #2", 500, 0, 0.0, 2.3619999999999997, 1, 28, 2.0, 3.0, 4.0, 6.0, 0.3308182325837433, 0.16983833305820284, 0.11953393169529788], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 3.6080000000000014, 2, 15, 3.0, 4.0, 5.0, 9.990000000000009, 0.33081560602772503, 0.1898668357603069, 0.13956283379294648], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 0, 0.0, 13.048000000000007, 8, 363, 11.0, 15.0, 19.0, 33.97000000000003, 0.3289278924274221, 0.17111638435059767, 3.6191704726364886], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 32.43800000000001, 23, 54, 32.0, 38.0, 40.0, 48.99000000000001, 0.3307538939655936, 1.3755712068068489, 0.13759878791928015], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 2.233999999999998, 1, 7, 2.0, 3.0, 3.0, 6.0, 0.3307646153306753, 0.206634211008971, 0.13986433441228752], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 28.34199999999997, 21, 50, 28.0, 33.0, 35.0, 39.0, 0.33075411276201516, 1.3574840012168445, 0.12015676752682582], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 861.112, 670, 1111, 865.0, 1002.0, 1052.95, 1073.95, 0.33061064447255367, 1.3982215079333329, 0.16078525483137865], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 5.623999999999999, 3, 19, 5.0, 8.0, 8.0, 11.990000000000009, 0.3307013911946125, 0.4917600736190902, 0.1689031519480296], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 3.7640000000000007, 2, 18, 4.0, 5.0, 5.0, 9.990000000000009, 0.3290296258275095, 0.3173689958262592, 0.17993807662441927], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 7.6480000000000015, 5, 17, 7.0, 9.900000000000034, 11.0, 14.0, 0.3307497368885843, 0.5389896420345209, 0.21608552146334267], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 459.0, 459, 459, 459.0, 459.0, 459.0, 459.0, 2.1786492374727673, 0.942521105664488, 2576.8846166938997], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 4.065999999999998, 2, 18, 4.0, 5.0, 6.0, 9.0, 0.3290324406244509, 0.33054586132302627, 0.19311376642118652], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 8.006000000000004, 5, 24, 8.0, 10.0, 10.0, 14.990000000000009, 0.3307475489952882, 0.5196063374455175, 0.19670435286926805], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 6.55, 4, 16, 6.0, 8.0, 8.0, 11.990000000000009, 0.33074601748720345, 0.5118520716524865, 0.18895158225587308], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 1556.0940000000007, 1334, 1974, 1539.5, 1735.0, 1802.95, 1891.96, 0.33040047841989273, 0.5045415352636431, 0.18197838850470655], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 11.80999999999999, 8, 68, 11.0, 14.0, 18.94999999999999, 46.87000000000012, 0.32891966992253285, 0.1711121068012036, 2.651914838750421], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 11.092000000000008, 8, 40, 11.0, 13.0, 15.0, 18.0, 0.33075258119314366, 0.5987493821128342, 0.27584248470600065], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 7.805999999999996, 5, 30, 7.0, 10.0, 11.0, 13.990000000000009, 0.33075192481082644, 0.5599882026990018, 0.23708194610463534], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 43.0, 43, 43, 43.0, 43.0, 43.0, 43.0, 23.25581395348837, 10.969295058139537, 3171.6933139534885], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 460.0, 460, 460, 460.0, 460.0, 460.0, 460.0, 2.1739130434782608, 1.008406929347826, 4157.485563858695], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 2.3499999999999988, 1, 18, 2.0, 3.0, 3.0, 9.980000000000018, 0.3290872304940126, 0.2766100294516617, 0.13915504961319086], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 552.3179999999994, 437, 706, 537.5, 644.9000000000001, 658.0, 672.99, 0.3289510474788205, 0.2896664541231711, 0.1522683559618759], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 3.243999999999998, 2, 23, 3.0, 4.0, 5.0, 8.0, 0.32905474417967967, 0.29811267258098695, 0.16067126180648422], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 758.736, 612, 939, 742.0, 881.9000000000001, 900.0, 924.99, 0.3288954375624901, 0.31113701105582015, 0.17376214035283902], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 68.0, 68, 68, 68.0, 68.0, 68.0, 68.0, 14.705882352941176, 6.965188419117647, 968.3335248161764], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 0, 0.0, 25.566000000000003, 17, 1201, 23.0, 27.0, 31.0, 57.98000000000002, 0.32866173542598837, 0.1709779229284944, 14.9919820915507], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 30.559999999999988, 21, 237, 29.0, 35.0, 41.94999999999999, 107.99000000000001, 0.32904413337343286, 74.42011408433105, 0.10154096303320778], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 435.0, 435, 435, 435.0, 435.0, 435.0, 435.0, 2.2988505747126435, 1.2055495689655173, 0.9428879310344828], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 2.6839999999999993, 1, 11, 3.0, 3.0, 4.0, 6.0, 0.33077314915884387, 0.3594283113286496, 0.14180606687571531], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 3.4260000000000033, 2, 24, 3.0, 4.0, 5.0, 10.0, 0.3307716174136703, 0.33939945911398195, 0.12177822242671259], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 1.9240000000000028, 1, 21, 2.0, 3.0, 3.0, 6.980000000000018, 0.33082217249597384, 0.18760912479505568, 0.1282582055477555], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 92.15800000000011, 68, 127, 91.0, 112.0, 115.0, 119.99000000000001, 0.33080159843332363, 0.3013105067136184, 0.10789817761399423], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 0, 0.0, 83.358, 57, 367, 81.0, 94.0, 102.94999999999999, 287.94000000000005, 0.32898805904940875, 0.17114768450801812, 97.27958437458055], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 199.81199999999995, 12, 349, 260.0, 334.0, 337.95, 343.99, 0.3307674598911378, 0.18434794632272586, 0.13857347684892396], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 415.3240000000001, 328, 540, 402.0, 487.0, 498.95, 509.98, 0.3307342034729737, 0.1778697589791029, 0.1408204225724771], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 7.1880000000000015, 4, 251, 6.0, 8.0, 11.0, 26.0, 0.3286118384386469, 0.14816735539600356, 0.23843612886710414], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 390.25599999999974, 298, 509, 385.0, 453.90000000000003, 463.0, 482.97, 0.33070882807374014, 0.17010512386203092, 0.1330586300452939], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 3.4180000000000015, 2, 17, 3.0, 4.0, 5.0, 10.990000000000009, 0.3290850645401629, 0.20204987395219315, 0.16454253227008142], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 4.054000000000003, 2, 30, 4.0, 5.0, 5.0, 12.970000000000027, 0.3290794331935843, 0.1927267840630121, 0.15522008421142694], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 676.3959999999998, 540, 870, 680.5, 811.8000000000001, 831.0, 849.0, 0.3289278924274221, 0.30056749826490536, 0.1448696088718431], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 242.7159999999999, 171, 310, 237.0, 286.0, 289.0, 300.98, 0.32903785383085615, 0.29134952387399954, 0.13527825826444376], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 4.508000000000004, 3, 44, 4.0, 5.0, 6.0, 10.0, 0.32903460588563943, 0.21937032791424305, 0.15391364865158327], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 991.4500000000004, 810, 8552, 937.0, 1095.5000000000002, 1118.95, 1174.97, 0.328814112175592, 0.24715967801042474, 0.18174686278455573], "isController": false}, {"data": ["Query single patient #2", 500, 0, 0.0, 134.24199999999996, 117, 167, 133.0, 150.90000000000003, 152.0, 161.99, 0.33081429276535607, 6.3961877405433425, 0.1666993897137927], "isController": false}, {"data": ["Query single patient #1", 500, 0, 0.0, 181.55600000000007, 159, 269, 174.0, 204.0, 205.0, 211.98000000000002, 0.33079393853187034, 0.641142614983973, 0.23646597949739168], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 7.023999999999998, 4, 25, 7.0, 9.0, 10.0, 13.0, 0.33069657927458396, 0.26988909986871346, 0.2041017950210323], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 6.8980000000000015, 4, 29, 7.0, 9.0, 10.0, 14.990000000000009, 0.3306985477703973, 0.27505787121242686, 0.20927017476095455], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 8.287999999999997, 5, 23, 8.0, 10.0, 11.0, 15.990000000000009, 0.33069111135361795, 0.2676240536033757, 0.2018378365195422], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 9.789999999999997, 7, 22, 9.0, 12.0, 13.0, 17.99000000000001, 0.3306939546499538, 0.295722423059091, 0.22993564034254602], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 7.675999999999994, 5, 32, 7.0, 9.0, 10.0, 16.0, 0.3306720843980975, 0.24823333788834132, 0.18245090594230964], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 1633.0959999999993, 1363, 1991, 1611.0, 1845.9, 1893.6999999999998, 1951.98, 0.33033826638477803, 0.2760485917266781, 0.2103325680496829], "isController": false}]}, function(index, item){
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

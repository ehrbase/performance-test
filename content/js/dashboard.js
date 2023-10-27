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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8750053180174431, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Query cross patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [1.0, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [0.808, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [0.85, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.469, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 23505, 500, 2.1272069772388855, 461.14656456073146, 1, 19966, 11.0, 1005.9000000000015, 1880.0, 10336.990000000002, 10.724209200782928, 67.55461731557143, 88.74374631433727], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query cross patient #1", 500, 500, 100.0, 10481.963999999996, 8923, 19966, 10303.5, 11331.7, 11637.9, 18867.130000000056, 0.23088193667462595, 0.13412887696948064, 0.11634285090244822], "isController": false}, {"data": ["Query participation #2", 500, 0, 0.0, 2.875999999999998, 2, 10, 3.0, 4.0, 4.0, 6.0, 0.23183137513098473, 0.11901960177745116, 0.08376719609225035], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 4.176, 2, 20, 4.0, 5.0, 6.0, 9.0, 0.23183008523928575, 0.13305552675388732, 0.09780331721032368], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 0, 0.0, 16.28600000000001, 10, 462, 14.0, 18.0, 21.0, 78.94000000000005, 0.2304563773732398, 0.11988907889697124, 2.535695316273723], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 41.63600000000004, 25, 62, 42.0, 53.0, 55.0, 57.0, 0.23178903118675057, 0.9639865869192642, 0.09642785867730053], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 2.5780000000000007, 1, 11, 2.0, 4.0, 4.0, 8.0, 0.23179483375674523, 0.144806126076687, 0.09801480763346747], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 36.756000000000036, 23, 55, 37.0, 47.0, 49.0, 51.0, 0.23178806411999575, 0.9513066552321752, 0.0842042576685922], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 1019.4899999999999, 726, 1462, 984.5, 1280.5000000000002, 1381.95, 1444.95, 0.23171169133778283, 0.9799571667904781, 0.11268791238888266], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 6.921999999999997, 4, 37, 7.0, 9.0, 10.0, 14.980000000000018, 0.23174895840430645, 0.3446156801287319, 0.11836396996626199], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 4.3999999999999995, 2, 25, 4.0, 5.0, 6.0, 11.0, 0.2305768941661279, 0.2224053751336193, 0.12609673899710117], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 9.402000000000006, 6, 19, 9.0, 12.0, 13.0, 17.0, 0.23178655980997212, 0.3777192873247056, 0.1514308676883509], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 510.0, 510, 510, 510.0, 510.0, 510.0, 510.0, 1.9607843137254901, 0.8482689950980392, 2319.1961550245096], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 5.063999999999999, 3, 18, 5.0, 6.0, 7.0, 15.970000000000027, 0.23057923348084255, 0.23163980788484131, 0.1353301946503773], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 9.628000000000009, 6, 19, 10.0, 12.0, 13.0, 18.0, 0.2317851629681481, 0.36413584913914987, 0.137848793210549], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 7.425999999999994, 5, 22, 7.0, 9.0, 10.0, 14.990000000000009, 0.2317846257257756, 0.35870255296278697, 0.13241602153279172], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 2017.744, 1599, 2662, 1989.5, 2354.8, 2478.0, 2640.86, 0.23157218058554413, 0.3536247407259973, 0.12754561508813175], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 14.033999999999981, 10, 76, 13.0, 16.900000000000034, 19.0, 36.97000000000003, 0.23045096026610634, 0.11988626078452881, 1.8580108671454822], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 13.940000000000005, 9, 32, 13.5, 17.0, 18.0, 24.99000000000001, 0.23178860137830776, 0.41959848462986604, 0.19330807185261212], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 9.542000000000009, 6, 21, 9.0, 12.0, 13.0, 16.99000000000001, 0.23178741941330894, 0.3924337567490702, 0.1661444978997742], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 77.0, 77, 77, 77.0, 77.0, 77.0, 77.0, 12.987012987012989, 6.1257102272727275, 1771.205357142857], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 567.0, 567, 567, 567.0, 567.0, 567.0, 567.0, 1.763668430335097, 0.8181079144620812, 3372.9159777336863], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 2.8119999999999994, 2, 18, 3.0, 4.0, 4.0, 7.990000000000009, 0.2305839122526757, 0.1938143350732427, 0.09750276758340681], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 688.1520000000007, 507, 901, 683.5, 824.8000000000001, 841.0, 887.99, 0.2305265040932286, 0.20299614649014178, 0.10670855755877966], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 3.8319999999999985, 2, 20, 4.0, 5.0, 5.0, 12.990000000000009, 0.23058231719549183, 0.208899923325615, 0.11258902206811126], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 952.7380000000006, 743, 1278, 926.0, 1133.9, 1165.8, 1221.97, 0.23049834202542582, 0.2180527821322756, 0.12177695608960484], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 62.0, 62, 62, 62.0, 62.0, 62.0, 62.0, 16.129032258064516, 7.639238911290323, 1062.043220766129], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 0, 0.0, 30.071999999999985, 20, 1216, 27.0, 33.0, 37.94999999999999, 91.98000000000002, 0.23032293578826873, 0.11981965930055533, 10.506234697919954], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 38.72800000000002, 27, 294, 37.0, 45.0, 50.0, 123.97000000000003, 0.230532881365935, 52.1397636102867, 0.071141006359019], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 452.0, 452, 452, 452.0, 452.0, 452.0, 452.0, 2.2123893805309733, 1.1602081028761062, 0.907425331858407], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 3.2639999999999993, 2, 12, 3.0, 4.0, 4.0, 7.990000000000009, 0.23180009930316253, 0.25188114110900583, 0.09937523788485192], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 3.892000000000002, 2, 9, 4.0, 5.0, 5.0, 8.0, 0.23179945452952358, 0.23784570787960524, 0.08534022886487344], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 2.2259999999999986, 1, 10, 2.0, 3.0, 4.0, 7.0, 0.23183234255917867, 0.1314720309058014, 0.08988031249608781], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 125.686, 88, 168, 125.0, 153.0, 157.0, 162.0, 0.2318195516609871, 0.21115274807589773, 0.07561301782692352], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 0, 0.0, 100.25400000000006, 70, 488, 96.0, 114.0, 124.94999999999999, 378.9200000000001, 0.23049611060862957, 0.11992280454759607, 68.15616926873726], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 250.9460000000001, 15, 449, 316.0, 414.90000000000003, 425.95, 439.97, 0.23179741276999763, 0.12918857562691927, 0.09711043952961815], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 474.69800000000015, 364, 644, 458.0, 574.8000000000001, 592.0, 618.99, 0.23176926164802777, 0.12464614265838415, 0.09868300593607432], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 8.31399999999999, 5, 311, 7.0, 9.0, 12.0, 26.99000000000001, 0.23029227774722566, 0.1038361792565152, 0.16709683824823113], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 449.54400000000004, 328, 621, 454.5, 541.0, 554.0, 585.98, 0.23176431979026257, 0.11921150866868085, 0.09324892554061345], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 4.162000000000001, 2, 14, 4.0, 5.0, 7.0, 11.0, 0.23058295521571728, 0.14157207985710313, 0.11529147760785864], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 4.606000000000004, 3, 27, 4.0, 6.0, 6.0, 11.990000000000009, 0.2305804031560001, 0.1350404038834813, 0.10876009250424615], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 760.2540000000004, 540, 1154, 712.5, 967.0, 1102.0, 1135.0, 0.23050089226895398, 0.2106269432665849, 0.10151943595048657], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 272.1499999999999, 189, 362, 265.0, 332.0, 340.0, 351.99, 0.23054032196339203, 0.2041339993431906, 0.09478269096346488], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 5.2940000000000005, 3, 42, 5.0, 6.0, 7.0, 13.0, 0.2305804031560001, 0.15373002640491487, 0.10785938780441802], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 1259.0459999999998, 942, 11638, 1161.5, 1484.0, 1507.95, 1802.4800000000023, 0.23048474167961605, 0.17324844777169657, 0.12739683963931905], "isController": false}, {"data": ["Query single patient #2", 500, 0, 0.0, 165.98999999999995, 144, 208, 165.0, 185.0, 187.0, 190.0, 0.23181847685987964, 4.4821355429594405, 0.11681477935517372], "isController": false}, {"data": ["Query single patient #1", 500, 0, 0.0, 224.16599999999994, 193, 293, 217.0, 252.0, 255.0, 267.96000000000004, 0.23180482775278666, 0.44928257782151676, 0.16570423233890608], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 8.357999999999997, 5, 19, 8.0, 11.0, 12.0, 15.0, 0.23174648788197616, 0.18913364979281863, 0.14303103548965715], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 8.41800000000001, 5, 32, 8.0, 11.0, 12.0, 16.99000000000001, 0.23174766942956238, 0.1927556714158717, 0.14665282206089497], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 9.427999999999997, 6, 22, 9.0, 12.0, 13.0, 17.0, 0.23174358777079818, 0.18754709826322088, 0.14144506089526257], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 11.616000000000017, 7, 26, 11.0, 15.0, 16.0, 22.0, 0.23174498411156388, 0.20723749941484393, 0.16113518426507178], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 8.786000000000001, 5, 37, 8.0, 11.0, 12.949999999999989, 34.830000000000155, 0.23172715517840672, 0.17395603657929007, 0.12785726823808574], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 2093.8680000000013, 1683, 2752, 2039.0, 2525.6000000000004, 2669.5499999999997, 2732.88, 0.23154772985974692, 0.19349385538894923, 0.1474307811216357], "isController": false}]}, function(index, item){
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

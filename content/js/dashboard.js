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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8725803020633908, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Query cross patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [1.0, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [0.76, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [0.787, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.467, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 23505, 500, 2.1272069772388855, 463.4795149968093, 1, 21121, 11.0, 1013.9000000000015, 1852.0, 10385.970000000005, 10.723162212862867, 67.5480091430583, 88.73508239995137], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query cross patient #1", 500, 500, 100.0, 10527.705999999995, 9316, 21121, 10355.0, 11251.8, 11518.45, 20363.320000000072, 0.23080221773234977, 0.13408256493504994, 0.11630268002919186], "isController": false}, {"data": ["Query participation #2", 500, 0, 0.0, 2.820000000000001, 2, 11, 3.0, 4.0, 4.0, 7.0, 0.2318456723918637, 0.11902694182922526, 0.08377236209471638], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 4.188000000000001, 2, 17, 4.0, 5.0, 6.0, 9.990000000000009, 0.23184405983060546, 0.13306354726859876, 0.09780921274103668], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 0, 0.0, 16.408000000000012, 10, 502, 14.0, 18.900000000000034, 21.0, 72.81000000000017, 0.23062975299092195, 0.11997927315995512, 2.537602956004607], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 42.24000000000002, 25, 62, 44.0, 54.0, 55.0, 58.0, 0.23179805753227786, 0.9640241265559444, 0.09643161377807653], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 2.6239999999999988, 1, 16, 2.0, 4.0, 4.0, 7.0, 0.23180257096867513, 0.1448109596429406, 0.09801807932562143], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 36.53999999999997, 22, 70, 37.0, 47.0, 49.0, 51.0, 0.23179870229814506, 0.951350316538513, 0.08420812231924801], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 1018.7040000000014, 753, 1456, 981.0, 1249.6000000000001, 1392.0, 1420.97, 0.23170524867997522, 0.9799299194441946, 0.11268477914319106], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 6.733999999999995, 4, 33, 6.0, 9.0, 10.0, 13.0, 0.23176346035825068, 0.34463724484581243, 0.1183713767259425], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 4.511999999999996, 3, 43, 4.0, 5.0, 6.0, 12.990000000000009, 0.23073245556554373, 0.22255542352211247, 0.12618181163740672], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 9.338000000000003, 6, 25, 9.0, 12.0, 13.0, 18.99000000000001, 0.23179977691589468, 0.37774082591535413, 0.1514395026921226], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 510.0, 510, 510, 510.0, 510.0, 510.0, 510.0, 1.9607843137254901, 0.8482689950980392, 2319.1961550245096], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 5.058000000000007, 3, 15, 5.0, 6.0, 7.949999999999989, 12.990000000000009, 0.23073383974796483, 0.23179512528039933, 0.13542093524270202], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 9.572000000000005, 6, 21, 10.0, 12.0, 13.0, 16.0, 0.23179891722089788, 0.36415745715081116, 0.13785697323000665], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 7.425999999999999, 5, 16, 7.0, 9.0, 10.0, 14.0, 0.23179827245383505, 0.3587236722073408, 0.132423817759271], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 2034.6979999999994, 1540, 2719, 1988.5, 2421.9, 2561.95, 2664.99, 0.23157668522985375, 0.3536316195906002, 0.1275480961617554], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 14.224000000000002, 10, 73, 13.0, 18.0, 21.0, 40.97000000000003, 0.23062368948088452, 0.11997611877281444, 1.8594034964396313], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 13.710000000000004, 9, 29, 13.0, 17.0, 18.0, 21.0, 0.2318013888612015, 0.4196216333456034, 0.1933187364135411], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 9.427999999999994, 6, 21, 9.0, 12.0, 13.949999999999989, 17.99000000000001, 0.2318007440803885, 0.3924563164254007, 0.1661540489794972], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 71.0, 71, 71, 71.0, 71.0, 71.0, 71.0, 14.084507042253522, 6.643375880281691, 1920.8846830985917], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 575.0, 575, 575, 575.0, 575.0, 575.0, 575.0, 1.7391304347826089, 0.806725543478261, 3325.988451086957], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 2.827999999999999, 2, 24, 3.0, 4.0, 4.0, 8.0, 0.23074395543134352, 0.19394885730401532, 0.09757044209157396], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 695.5799999999997, 520, 962, 681.5, 828.0, 843.0, 887.9200000000001, 0.23068295534393216, 0.20313391373357134, 0.10678097737599984], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 3.7219999999999978, 2, 20, 3.0, 4.0, 5.949999999999989, 11.980000000000018, 0.23074118684036862, 0.20904385394890468, 0.11266659513689875], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 955.9759999999995, 720, 1223, 943.5, 1126.9, 1160.9, 1195.97, 0.23065092458729627, 0.21819712612984357, 0.12185756855637432], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 88.0, 88, 88, 88.0, 88.0, 88.0, 88.0, 11.363636363636363, 5.382191051136364, 748.257723721591], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 0, 0.0, 30.843999999999994, 20, 1240, 27.0, 34.0, 39.0, 89.96000000000004, 0.23049334796197782, 0.11990831190705585, 10.514008089164046], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 38.983999999999995, 26, 307, 37.0, 46.0, 52.0, 128.82000000000016, 0.23070733021786155, 52.17921881445386, 0.07119484018441821], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 440.0, 440, 440, 440.0, 440.0, 440.0, 440.0, 2.2727272727272725, 1.1918501420454546, 0.9321732954545454], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 3.266000000000001, 2, 16, 3.0, 4.0, 5.0, 8.0, 0.23181407027953532, 0.25189632240306814, 0.09938122739523048], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 3.9080000000000013, 2, 11, 4.0, 5.0, 6.0, 8.0, 0.23181364037822713, 0.23786026375176467, 0.08534545158456214], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 2.2179999999999995, 1, 11, 2.0, 3.0, 4.0, 8.0, 0.23184620991726798, 0.13147989507915694, 0.08988568880581582], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 124.39399999999993, 88, 174, 124.0, 152.90000000000003, 157.0, 165.0, 0.2318344924285173, 0.2111663568681664, 0.07561789108508281], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 0, 0.0, 104.706, 70, 489, 101.0, 119.0, 127.94999999999999, 366.99, 0.2306725257488207, 0.12000152460122489, 68.20833405418499], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 248.974, 15, 441, 314.0, 412.0, 420.95, 432.0, 0.2318111684766483, 0.12919624214971479, 0.09711620241843956], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 498.8740000000001, 377, 659, 490.5, 602.0, 613.95, 638.98, 0.2317631380728895, 0.12464284938293065, 0.09868039863259749], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 8.504, 5, 295, 7.0, 9.900000000000034, 12.0, 33.960000000000036, 0.23046487530928386, 0.10391400154204049, 0.16722207261210734], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 464.0979999999999, 325, 599, 479.0, 551.9000000000001, 564.95, 579.99, 0.23176657582962004, 0.11921266909689374, 0.0932498332439487], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 4.166000000000005, 2, 16, 4.0, 5.0, 7.0, 11.0, 0.2307431035501211, 0.1416704068681608, 0.11537155177506056], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 4.656000000000007, 2, 28, 4.0, 6.0, 6.0, 10.990000000000009, 0.23074044146184222, 0.1351341310049623, 0.10883557932233379], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 780.102, 546, 1137, 735.0, 1050.5000000000002, 1105.0, 1120.0, 0.23066262914800606, 0.21077473507820385, 0.1015906696735847], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 276.05199999999974, 195, 370, 270.0, 338.0, 345.95, 362.95000000000005, 0.23070573345274661, 0.20428046443255848, 0.09485069705430306], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 5.22, 3, 43, 5.0, 6.0, 8.0, 10.0, 0.23073511746955566, 0.15383317582777375, 0.10793175905070035], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 1262.1599999999985, 962, 10609, 1180.0, 1490.9, 1509.95, 1537.94, 0.23061720081453996, 0.17334801331929645, 0.12747005435647424], "isController": false}, {"data": ["Query single patient #2", 500, 0, 0.0, 167.01399999999995, 143, 199, 172.5, 186.0, 187.0, 190.0, 0.23180128139748357, 4.481803074235519, 0.11680611445420071], "isController": false}, {"data": ["Query single patient #1", 500, 0, 0.0, 226.49600000000007, 196, 282, 225.0, 252.0, 256.0, 264.0, 0.23179182498048315, 0.4492573759345846, 0.16569493738839222], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 8.314, 5, 21, 8.0, 11.0, 12.0, 15.0, 0.23176131180610662, 0.18914574793894667, 0.14304018463033144], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 8.243999999999998, 5, 41, 8.0, 10.0, 11.0, 16.99000000000001, 0.23176217122218393, 0.19276773325356078, 0.14666199897653825], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 9.530000000000008, 6, 29, 9.0, 12.0, 14.0, 18.970000000000027, 0.23175959299307317, 0.18756005108329069, 0.14145482970768627], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 11.613999999999999, 7, 25, 11.0, 14.900000000000034, 15.949999999999989, 19.0, 0.23176055982226748, 0.2072514279637193, 0.16114601425142036], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 8.876000000000001, 6, 34, 9.0, 11.0, 12.0, 31.0, 0.23175056964290017, 0.1739736136622986, 0.1278701873517955], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 2059.5540000000024, 1692, 2740, 1989.5, 2521.1000000000004, 2679.0, 2732.99, 0.2315559867642598, 0.19350075530668434, 0.14743603844755607], "isController": false}]}, function(index, item){
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

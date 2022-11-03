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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8991916613486493, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Query cross patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.498, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.986, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.496, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.993, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [1.0, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [0.98, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.716, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.599, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #2"], "isController": false}, {"data": [0.995, 500, 1500, "Query single patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 23505, 514, 2.186768772601574, 190.351074239523, 1, 3436, 19.0, 550.0, 1211.9000000000015, 2234.9900000000016, 25.899656324066903, 172.0907067232362, 214.5817439308527], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query cross patient #1", 500, 500, 100.0, 30.954000000000008, 20, 64, 33.0, 36.0, 38.0, 54.940000000000055, 0.5613058218639845, 0.3259268299271425, 0.28394181223197645], "isController": false}, {"data": ["Query participation #2", 500, 0, 0.0, 7.607999999999998, 4, 35, 7.0, 10.0, 12.0, 16.0, 0.5612762073893135, 5.993561670784563, 0.20390112221564904], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 8.155999999999997, 5, 47, 8.0, 10.0, 12.0, 21.0, 0.5612510060424283, 6.02668041708246, 0.23787396154532608], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 0, 0.0, 21.676, 13, 274, 20.0, 26.0, 30.0, 53.98000000000002, 0.5577319495631844, 0.3011338585959879, 6.210214539960378], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 44.980000000000025, 25, 83, 46.5, 55.0, 57.0, 63.98000000000002, 0.5611407767535088, 2.333821753772549, 0.23453930903369313], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 2.5619999999999994, 1, 13, 2.0, 3.0, 4.0, 8.990000000000009, 0.5611917917843766, 0.35071308361140385, 0.2383969037365272], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 39.788000000000004, 24, 95, 41.0, 49.0, 51.0, 66.95000000000005, 0.5611269224208362, 2.30301393895388, 0.2049428408060476], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 775.0559999999992, 575, 1520, 769.0, 906.9000000000001, 925.95, 1250.7900000000002, 0.5608279615361751, 2.371731591032473, 0.2738417780938355], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 13.695999999999998, 8, 38, 14.0, 17.0, 19.0, 31.950000000000045, 0.5607116103188878, 0.833758452026636, 0.28747421427482045], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 3.4420000000000024, 1, 22, 3.0, 5.0, 6.0, 10.990000000000009, 0.5584664065702456, 0.5387379263053315, 0.30650207079343555], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 22.813999999999993, 14, 75, 24.0, 28.0, 30.0, 38.98000000000002, 0.5610734007444321, 0.9141978764914733, 0.3676564959956191], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 703.0, 703, 703, 703.0, 703.0, 703.0, 703.0, 1.4224751066856332, 0.6070523648648649, 1682.4921652738265], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 4.532000000000001, 2, 25, 4.0, 6.0, 8.0, 13.980000000000018, 0.558475139479166, 0.5611704364902071, 0.32886768467376676], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 23.46400000000001, 15, 68, 24.0, 29.0, 31.94999999999999, 41.98000000000002, 0.5610677343411606, 0.8815678150647809, 0.33477772039301673], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 13.383999999999999, 8, 47, 14.0, 17.0, 18.0, 26.99000000000001, 0.5610677343411606, 0.8683860108140194, 0.3216276953693958], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 1995.0960000000007, 1583, 2701, 1982.0, 2244.8, 2338.95, 2564.83, 0.5597380425960651, 0.8547538814334892, 0.3093864571380594], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 19.47200000000001, 11, 406, 17.0, 23.0, 29.94999999999999, 63.850000000000136, 0.5576871598108325, 0.30104649995538507, 4.497441958708843], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 27.713999999999984, 18, 81, 29.0, 33.0, 36.0, 47.0, 0.5610979564812425, 1.015735246981293, 0.46904282299603867], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 23.271999999999995, 14, 71, 25.0, 29.0, 31.94999999999999, 42.98000000000002, 0.561087252434277, 0.9499316771066302, 0.40328146268713666], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 79.0, 79, 79, 79.0, 79.0, 79.0, 79.0, 12.658227848101266, 5.896459651898734, 1726.3894382911392], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 656.0, 656, 656, 656.0, 656.0, 656.0, 656.0, 1.524390243902439, 0.6981826410060975, 2915.312976371951], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 2.3020000000000005, 1, 23, 2.0, 3.0, 4.0, 10.0, 0.5584763870598788, 0.46923033332383923, 0.23724338708110082], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 409.76600000000025, 314, 656, 408.0, 479.0, 494.0, 554.7500000000002, 0.5582787150657094, 0.4914488274751287, 0.25951237145632583], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 3.08, 1, 18, 3.0, 4.0, 5.0, 10.990000000000009, 0.5585144409493852, 0.5059639044683389, 0.27380297788729624], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 1164.3120000000006, 933, 1760, 1154.5, 1344.8000000000002, 1376.95, 1461.8000000000002, 0.5578756985998435, 0.5277536796783735, 0.295826664394253], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 55.0, 55, 55, 55.0, 55.0, 55.0, 55.0, 18.18181818181818, 8.504971590909092, 1197.2478693181818], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 3, 0.6, 45.722000000000044, 13, 856, 44.0, 51.0, 58.0, 106.84000000000015, 0.5571645228833041, 0.3000853297466796, 25.485924074076138], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 48.440000000000026, 10, 189, 49.0, 58.0, 69.0, 98.0, 0.5580444337299914, 123.90263940891654, 0.1732989550059934], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 285.0, 285, 285, 285.0, 285.0, 285.0, 285.0, 3.5087719298245617, 1.8400493421052633, 1.4459978070175439], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 2.272000000000003, 1, 16, 2.0, 3.0, 4.0, 7.0, 0.5613259866988194, 0.6099223454613426, 0.2417429298185345], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 3.236, 2, 14, 3.0, 4.0, 6.0, 10.0, 0.5613196850322983, 0.5758657584327056, 0.2077540631125401], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 2.135999999999999, 1, 13, 2.0, 3.0, 4.0, 6.990000000000009, 0.5612976303136643, 0.31834345914258416, 0.21870874462417195], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 123.95999999999998, 87, 255, 122.0, 150.90000000000003, 154.0, 207.64000000000033, 0.5612396661746465, 0.511300297597333, 0.18415676546355592], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 10, 2.0, 171.60400000000004, 26, 426, 172.0, 201.90000000000003, 236.89999999999998, 384.7000000000003, 0.5578028813865641, 0.2989376766143373, 165.00942268517383], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 2.3779999999999992, 1, 18, 2.0, 3.0, 4.0, 8.0, 0.5613146438009533, 0.3129668997666054, 0.23625645652169033], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 3.246, 2, 14, 3.0, 4.0, 5.0, 10.0, 0.5613663207153154, 0.3019361384059891, 0.240115672337215], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 11.601999999999999, 7, 315, 10.0, 14.0, 19.0, 44.950000000000045, 0.5569863917084779, 0.2353332776811097, 0.4052293572488437], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 4.729999999999999, 2, 62, 4.0, 6.0, 6.0, 11.0, 0.5613291375851396, 0.2887599874486805, 0.22694361617211697], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 3.794000000000002, 2, 15, 3.0, 5.0, 6.0, 11.990000000000009, 0.5584676541119414, 0.34301148760983663, 0.2803245841929081], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 4.016000000000003, 2, 32, 4.0, 5.0, 6.0, 10.0, 0.558448941571721, 0.32708965311385546, 0.2644997428342624], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 526.0459999999994, 370, 1138, 526.5, 636.0, 651.0, 824.9300000000001, 0.5579827806513891, 0.5098731129719837, 0.2468419918311321], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 16.102000000000004, 6, 125, 16.0, 24.0, 29.94999999999999, 43.0, 0.5581578113069376, 0.4941942343135329, 0.23056714275667445], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 12.430000000000003, 7, 47, 13.0, 15.0, 16.0, 23.99000000000001, 0.5584826250470523, 0.37221885251646686, 0.26233412367932823], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 549.3259999999999, 378, 3436, 529.0, 607.9000000000001, 647.95, 686.97, 0.5582762216758559, 0.41951295947528733, 0.3096688417108263], "isController": false}, {"data": ["Query single patient #2", 500, 0, 0.0, 173.41999999999987, 142, 361, 179.0, 190.0, 195.0, 252.64000000000033, 0.5611634489554503, 10.850041580457932, 0.28386979156144854], "isController": false}, {"data": ["Query single patient #1", 500, 1, 0.2, 277.1560000000002, 28, 531, 278.5, 301.0, 307.9, 402.7000000000003, 0.5612302166348636, 1.0861141998260186, 0.4022880654394433], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 22.805999999999987, 15, 43, 24.0, 28.0, 30.0, 40.950000000000045, 0.56068331597084, 0.45745954634832564, 0.34714181867725835], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 22.591999999999995, 14, 68, 24.0, 28.0, 30.0, 37.99000000000001, 0.5606984059344319, 0.46626452909744376, 0.3559120740794734], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 22.636000000000042, 14, 53, 24.0, 29.0, 30.94999999999999, 39.98000000000002, 0.5606437086805587, 0.4538169920175549, 0.34328477084249054], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 25.411999999999985, 16, 59, 27.0, 32.0, 33.0, 41.0, 0.5606587965122537, 0.5014950580029558, 0.39092810616186446], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 22.636000000000003, 14, 55, 24.0, 28.0, 29.0, 46.940000000000055, 0.5604174886123167, 0.4206699447820648, 0.3103092930109214], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 2190.0240000000026, 1706, 2878, 2184.5, 2467.7000000000003, 2543.85, 2759.95, 0.5593779716954747, 0.4674466056245455, 0.3572589780164457], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["No results for path: $['rows'][1]", 500, 97.27626459143968, 2.1272069772388855], "isController": false}, {"data": ["400", 1, 0.19455252918287938, 0.0042544139544777706], "isController": false}, {"data": ["500", 13, 2.529182879377432, 0.055307381408211016], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 23505, 514, "No results for path: $['rows'][1]", 500, "500", 13, "400", 1, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["Query cross patient #1", 500, 500, "No results for path: $['rows'][1]", 500, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 3, "500", 3, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 10, "500", 10, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Query single patient #1", 500, 1, "400", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});

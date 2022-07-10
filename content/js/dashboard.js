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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8878961922995108, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Query cross patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.474, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.003, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.842, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.357, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [1.0, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [0.985, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [0.996, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.597, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.525, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [0.991, 500, 1500, "Query single patient #2"], "isController": false}, {"data": [0.964, 500, 1500, "Query single patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 23505, 500, 2.1272069772388855, 227.19098064241555, 1, 6400, 16.0, 651.0, 1505.9000000000015, 2868.9400000000096, 21.635677466863033, 145.72531698729748, 179.2119129838227], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query cross patient #1", 500, 500, 100.0, 26.659999999999993, 13, 116, 23.0, 39.0, 53.0, 101.93000000000006, 0.4683151986077926, 0.27198411305082065, 0.235986955548458], "isController": false}, {"data": ["Query participation #2", 500, 0, 0.0, 9.252, 4, 63, 8.0, 15.0, 19.0, 28.980000000000018, 0.46810299389312837, 4.998589364313793, 0.16913877709029052], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 9.563999999999986, 5, 39, 8.0, 14.0, 17.0, 32.99000000000001, 0.46808984703759976, 5.026347863251764, 0.1974754042189874], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 0, 0.0, 28.566000000000017, 15, 270, 23.0, 42.0, 54.0, 124.92000000000007, 0.4650232744148845, 0.25099903711118243, 5.177016922196956], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 54.98399999999998, 26, 203, 50.0, 81.0, 103.94999999999999, 139.95000000000005, 0.46795579128048614, 1.9461796951993349, 0.194676920981921], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 2.9580000000000006, 1, 20, 2.0, 4.0, 6.0, 11.0, 0.46797155856055694, 0.2923496930925526, 0.19788250474289173], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 51.222000000000044, 22, 266, 44.0, 80.0, 102.0, 184.9000000000001, 0.4679496598473923, 1.9205631981808926, 0.16999733736643546], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 922.5140000000004, 567, 2498, 869.5, 1229.4, 1517.6499999999999, 1938.3300000000006, 0.4677268475210477, 1.9781145857694107, 0.22746872076707203], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 12.005999999999997, 6, 64, 10.0, 19.0, 28.0, 41.97000000000003, 0.4676319213031592, 0.6953787137573569, 0.23883935043120338], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 4.3040000000000065, 1, 45, 3.0, 7.0, 9.949999999999989, 18.99000000000001, 0.46555194907979, 0.44905304260312445, 0.25459872215301016], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 19.231999999999996, 9, 130, 16.0, 29.0, 47.849999999999966, 94.96000000000004, 0.467939149193039, 0.762553454736246, 0.3057141511817803], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 588.0, 588, 588, 588.0, 588.0, 588.0, 588.0, 1.7006802721088434, 0.7257785926870749, 2011.5476854804424], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 5.150000000000001, 2, 27, 4.0, 8.0, 11.0, 21.980000000000018, 0.4655584513291228, 0.4676998383464667, 0.273242802000784], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 18.83, 10, 104, 17.0, 28.0, 37.94999999999999, 74.0, 0.4679268873597038, 0.7351158818012004, 0.2782885492207614], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 12.284000000000006, 6, 59, 10.0, 22.0, 34.0, 47.99000000000001, 0.4679163777283034, 0.7241325810056833, 0.26731550876079835], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 2362.8740000000003, 1479, 6267, 2257.5, 3007.9, 3484.95, 4840.340000000006, 0.46698290749162, 0.7131111740954308, 0.2572054295168688], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 25.28800000000001, 12, 828, 19.0, 39.0, 47.0, 81.92000000000007, 0.46499775871080307, 0.2509852648603984, 3.7490444296058496], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 24.57399999999997, 12, 122, 21.0, 39.0, 48.94999999999999, 73.99000000000001, 0.4679426526920273, 0.8470995846891971, 0.3902568607412024], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 19.201999999999998, 9, 99, 16.0, 31.0, 42.0, 79.91000000000008, 0.46793958712754347, 0.7922573648426694, 0.33541763374181344], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 89.0, 89, 89, 89.0, 89.0, 89.0, 89.0, 11.235955056179774, 5.2339360955056184, 1532.3911516853934], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 672.0, 672, 672, 672.0, 672.0, 672.0, 672.0, 1.488095238095238, 0.6815592447916666, 2845.8978562127973], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 2.894, 1, 24, 2.0, 5.0, 7.0, 13.980000000000018, 0.4654947371165022, 0.39126560076518024, 0.1968351769252397], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 493.01000000000005, 304, 2170, 454.5, 685.9000000000008, 882.1499999999999, 1334.8700000000001, 0.46536562846697394, 0.40978988363765145, 0.21541338661459536], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 3.828, 1, 32, 3.0, 6.0, 9.0, 16.0, 0.46553547752767144, 0.42175968540741804, 0.22731224488655832], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 1421.956, 909, 4737, 1291.0, 1968.2000000000007, 2390.6999999999994, 3492.5700000000015, 0.465147433130405, 0.44003219721460407, 0.2457468372300284], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 199.0, 199, 199, 199.0, 199.0, 199.0, 199.0, 5.025125628140704, 2.3506202889447234, 330.88783762562815], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 0, 0.0, 52.592, 27, 656, 44.0, 74.90000000000003, 94.94999999999999, 171.86000000000013, 0.4647276370737402, 0.25083946512404975, 21.25675104029282], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 58.25199999999998, 29, 214, 48.0, 86.0, 123.79999999999995, 198.96000000000004, 0.46523269543727686, 105.28011904112518, 0.14356790210759715], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 296.0, 296, 296, 296.0, 296.0, 296.0, 296.0, 3.3783783783783785, 1.7716691300675678, 1.3856630067567568], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 2.793999999999998, 1, 16, 2.0, 5.0, 6.0, 11.990000000000009, 0.46814989035929566, 0.5087061176774335, 0.20070097838645584], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 4.06, 2, 29, 3.0, 7.0, 9.0, 16.99000000000001, 0.4681455071139391, 0.4803566072067255, 0.17235435174019045], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 2.6899999999999995, 1, 21, 2.0, 5.0, 6.0, 11.990000000000009, 0.4681152649579211, 0.26546798390011167, 0.18148609393388151], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 160.41999999999987, 85, 894, 136.0, 219.80000000000007, 334.0, 628.8400000000001, 0.46807231904558183, 0.4263434889619186, 0.15267202593869564], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 0, 0.0, 206.1000000000001, 111, 744, 190.0, 297.0, 345.9, 497.8600000000001, 0.46507215129355167, 0.25102541869283096, 137.57688078666024], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 2.8180000000000005, 1, 22, 2.0, 5.0, 7.0, 12.0, 0.4681424388910267, 0.2609116907221659, 0.19612608035571336], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 3.8580000000000036, 2, 24, 3.0, 7.0, 8.0, 14.980000000000018, 0.46818583606753866, 0.2517916228327678, 0.19934475051313166], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 15.964000000000006, 7, 377, 11.0, 28.0, 33.0, 62.90000000000009, 0.46458686612929456, 0.19631970980742877, 0.3370976968106112], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 5.320000000000004, 2, 78, 4.0, 7.900000000000034, 11.0, 17.99000000000001, 0.46815252034590854, 0.2408013808509702, 0.18835824060792414], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 4.544000000000004, 2, 30, 4.0, 8.0, 10.949999999999989, 17.0, 0.46549083681287734, 0.28579955469982826, 0.23274541840643867], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 5.22, 2, 32, 4.0, 9.0, 11.949999999999989, 23.99000000000001, 0.465480002979072, 0.27261036385408133, 0.21955746234266774], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 658.904, 368, 2669, 610.0, 910.7, 1205.2499999999998, 1856.810000000001, 0.4650600392510673, 0.42496223567150015, 0.2048262477560853], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 21.327999999999992, 6, 186, 17.0, 40.0, 51.0, 87.84000000000015, 0.4653214533664146, 0.4120230615057244, 0.1913089178391216], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 10.443999999999994, 5, 72, 8.0, 17.0, 25.94999999999999, 48.99000000000001, 0.4655649537600888, 0.31039633748198264, 0.21777891879988528], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 637.4220000000005, 419, 4641, 607.0, 759.6000000000001, 798.4499999999998, 881.96, 0.46540504666616406, 0.3498309750677862, 0.25724536759086797], "isController": false}, {"data": ["Query single patient #2", 500, 0, 0.0, 203.33, 142, 832, 187.0, 246.90000000000003, 297.5499999999999, 647.96, 0.46822661044201525, 9.05301061955511, 0.23594231541804678], "isController": false}, {"data": ["Query single patient #1", 500, 0, 0.0, 320.5180000000003, 205, 1240, 276.5, 429.80000000000007, 584.9499999999996, 1033.6900000000003, 0.46809116168992143, 0.9072511811695352, 0.3346120413642798], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 18.886, 9, 76, 16.0, 28.0, 42.849999999999966, 71.93000000000006, 0.4676144275885031, 0.3816309114062381, 0.2886057795272792], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 18.21600000000001, 9, 95, 16.0, 26.0, 40.0, 78.90000000000009, 0.4676227369397646, 0.38894429812399106, 0.2959175132196948], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 18.268, 9, 96, 16.0, 27.0, 37.94999999999999, 75.97000000000003, 0.4676026200710008, 0.37842477273343655, 0.28540198978942916], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 21.93000000000001, 11, 113, 19.0, 32.0, 44.94999999999999, 84.94000000000005, 0.4676056812219846, 0.4181554671404136, 0.32513207522466114], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 19.174000000000007, 9, 100, 16.0, 31.0, 42.94999999999999, 85.0, 0.46741989825203656, 0.350889013657542, 0.2579025805785163], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 2672.3559999999984, 1671, 6400, 2536.5, 3501.700000000001, 4153.7, 5640.340000000002, 0.46670829704676325, 0.39000679381434156, 0.29716192351024373], "isController": false}]}, function(index, item){
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

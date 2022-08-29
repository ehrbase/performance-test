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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.901637949372474, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Query cross patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.001, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.993, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.989, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [1.0, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [0.979, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.723, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.693, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 23505, 515, 2.191023186556052, 184.9543501382692, 1, 2779, 17.0, 535.0, 1212.0, 2180.970000000005, 26.477854015272783, 175.94190505512418, 219.32046625538035], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query cross patient #1", 500, 500, 100.0, 27.509999999999994, 17, 54, 29.0, 33.0, 34.0, 40.99000000000001, 0.5730534234784572, 0.33278062927569485, 0.28876520167469133], "isController": false}, {"data": ["Query participation #2", 500, 0, 0.0, 7.362, 4, 23, 7.0, 9.0, 11.0, 20.0, 0.5728282363076866, 6.125043114275224, 0.20697895257211335], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 7.721999999999998, 5, 35, 7.0, 9.0, 11.0, 21.970000000000027, 0.5728124863957035, 6.150729582313727, 0.2416552676981874], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 0, 0.0, 21.44600000000001, 13, 258, 20.0, 26.0, 30.0, 48.97000000000003, 0.5699213736472917, 0.3077152429175871, 6.344827792557739], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 43.49200000000002, 26, 63, 44.0, 54.0, 56.0, 58.0, 0.5727291575268638, 2.382018598949844, 0.2382642784242617], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 2.4420000000000015, 1, 14, 2.0, 3.0, 4.0, 6.0, 0.5727606490523675, 0.35794296413659193, 0.24219273539030772], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 38.825999999999965, 24, 64, 39.0, 48.0, 50.0, 54.0, 0.572723909275951, 2.3506110534569045, 0.20805985766665408], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 765.6939999999998, 581, 971, 759.0, 912.9000000000001, 931.0, 958.9100000000001, 0.572383634407125, 2.4206327486434507, 0.2783662597019026], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 12.161999999999992, 8, 31, 13.0, 15.0, 16.94999999999999, 26.980000000000018, 0.5724485111186673, 0.8512756585733896, 0.29237360479986624], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 3.281999999999999, 2, 21, 3.0, 4.0, 5.949999999999989, 10.990000000000009, 0.5707234833308792, 0.5505620074656339, 0.31211440494657455], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 19.30000000000001, 13, 35, 20.0, 24.0, 25.0, 27.99000000000001, 0.572697013499614, 0.9331695157388593, 0.37415459182738453], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 674.0, 674, 674, 674.0, 674.0, 674.0, 674.0, 1.483679525222552, 0.6331718286350148, 1754.8813635942136], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 4.269999999999999, 2, 22, 4.0, 5.0, 6.949999999999989, 11.990000000000009, 0.5707326037848703, 0.5734870574254024, 0.33497099108858114], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 20.564, 13, 31, 22.0, 25.0, 26.0, 29.0, 0.5726930777442306, 0.8998339315351153, 0.3405957854943716], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 11.57400000000001, 7, 30, 12.0, 14.0, 16.0, 18.0, 0.5726904539373614, 0.8863749388652941, 0.3271717925325746], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 1888.8059999999994, 1483, 2413, 1889.5, 2111.9, 2184.9, 2248.96, 0.5714951914394593, 0.8727077595759734, 0.31476883591001464], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 18.932000000000016, 12, 235, 17.0, 23.0, 27.0, 53.940000000000055, 0.569886296286165, 0.30763174631397544, 4.594708263807205], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 24.323999999999998, 15, 91, 26.0, 30.0, 31.0, 38.0, 0.5727193171353038, 1.0368054131711697, 0.4776389617515131], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 19.632000000000005, 13, 39, 21.0, 24.0, 26.0, 30.0, 0.5727081651003099, 0.9695087935759326, 0.4105154230308862], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 84.0, 84, 84, 84.0, 84.0, 84.0, 84.0, 11.904761904761903, 5.545479910714286, 1623.6049107142856], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 667.0, 667, 667, 667.0, 667.0, 667.0, 667.0, 1.4992503748125936, 0.6866683845577211, 2867.2314233508246], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 2.2779999999999987, 1, 22, 2.0, 3.0, 4.0, 10.980000000000018, 0.5706739773807662, 0.479543362020163, 0.24131038301354665], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 404.5639999999999, 314, 578, 403.0, 470.0, 477.95, 503.99, 0.5704779921000207, 0.5021877652722664, 0.2640689143119237], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 2.9839999999999987, 1, 22, 3.0, 4.0, 5.0, 10.990000000000009, 0.5707111060381235, 0.5170453126783472, 0.2786675322451775], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 1167.577999999999, 931, 1467, 1167.0, 1351.0, 1368.9, 1429.8500000000001, 0.5701111260606917, 0.5392961742977941, 0.30120128828011156], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 73.0, 73, 73, 73.0, 73.0, 73.0, 73.0, 13.698630136986301, 6.407855308219179, 902.0093107876713], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 5, 1.0, 44.06999999999997, 9, 633, 43.0, 49.0, 57.0, 102.91000000000008, 0.5694858112610125, 0.30632330350176823, 26.048414480315724], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 46.19799999999999, 10, 185, 47.0, 56.0, 62.0, 82.95000000000005, 0.5702405160448574, 126.61056860250017, 0.17597265924821773], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 261.0, 261, 261, 261.0, 261.0, 261.0, 261.0, 3.8314176245210727, 2.009249281609195, 1.5714798850574712], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 2.2280000000000015, 1, 16, 2.0, 3.0, 4.0, 8.990000000000009, 0.5728558007378383, 0.6223530034113562, 0.24558954738663183], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 3.120000000000001, 1, 13, 3.0, 4.0, 6.0, 10.980000000000018, 0.5728485812259189, 0.5877258616645147, 0.21090226086149552], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 2.158000000000001, 1, 11, 2.0, 3.0, 4.0, 7.980000000000018, 0.5728407056022675, 0.32489018643673606, 0.22208765637119163], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 122.21000000000002, 84, 191, 121.0, 149.0, 153.0, 161.0, 0.572768522474864, 0.5218033108598058, 0.18682098291660607], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 10, 2.0, 165.7040000000002, 39, 592, 165.0, 195.90000000000003, 214.95, 341.8000000000002, 0.570007786306361, 0.30547852830544664, 168.61876817612327], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 2.178, 1, 10, 2.0, 3.0, 4.0, 6.990000000000009, 0.5728426744878787, 0.3193944748607992, 0.23998975327666008], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 3.1859999999999977, 1, 14, 3.0, 4.0, 5.0, 9.980000000000018, 0.5729024037839058, 0.3081409288352092, 0.24393110161111614], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 11.82199999999999, 7, 321, 10.0, 15.0, 19.0, 45.97000000000003, 0.5692971230000592, 0.24050246057332775, 0.4130739867080508], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 4.348000000000004, 2, 61, 4.0, 5.0, 6.0, 10.980000000000018, 0.5728643331229012, 0.294758839153444, 0.23048838402991725], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 3.6239999999999997, 2, 33, 3.0, 5.0, 6.0, 10.0, 0.570668115402789, 0.3505050252320907, 0.2853340577013945], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 3.9080000000000004, 2, 26, 4.0, 5.0, 6.0, 11.990000000000009, 0.570652484050263, 0.3342697235331378, 0.2691651853479268], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 522.5620000000004, 373, 777, 520.0, 630.0, 642.0, 714.7700000000002, 0.5701832911207637, 0.5209893913122312, 0.2511256487260395], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 15.968, 7, 108, 14.0, 24.0, 31.0, 44.99000000000001, 0.5703556509697187, 0.5050265354401892, 0.2344919229084488], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 10.70200000000001, 6, 64, 11.0, 13.0, 14.0, 18.99000000000001, 0.5707404215488754, 0.3803884584158529, 0.2669772089081165], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 520.3759999999994, 350, 2708, 509.5, 576.9000000000001, 610.9, 673.9200000000001, 0.5705548074948079, 0.4287073046705616, 0.31536525492388795], "isController": false}, {"data": ["Query single patient #2", 500, 0, 0.0, 173.6140000000001, 144, 260, 179.0, 191.0, 195.95, 216.98000000000002, 0.5729424490768751, 11.07778742051856, 0.2887092809801441], "isController": false}, {"data": ["Query single patient #1", 500, 0, 0.0, 267.61199999999985, 216, 415, 269.0, 295.0, 298.95, 336.8600000000001, 0.5727626173876985, 1.1102220264169576, 0.40943577727323754], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 19.925999999999995, 12, 55, 21.0, 24.0, 26.0, 33.97000000000003, 0.5724242625458226, 0.4670389433820886, 0.3532930995399999], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 19.51599999999997, 13, 59, 21.0, 24.0, 26.0, 32.99000000000001, 0.5724301606582489, 0.4759879768915668, 0.3622409610415481], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 19.636, 13, 62, 21.0, 24.0, 26.0, 34.99000000000001, 0.5724019818846221, 0.4633023877319373, 0.3493664440213758], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 22.372, 15, 41, 24.0, 27.0, 28.0, 35.98000000000002, 0.5724170539068036, 0.5120125206928765, 0.3980087327945744], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 19.771999999999995, 12, 104, 21.0, 24.0, 25.0, 31.970000000000027, 0.5723148418407935, 0.4296329512416371, 0.3157791851953597], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 2149.631999999998, 1666, 2779, 2145.0, 2417.6000000000004, 2511.95, 2650.8900000000003, 0.5712620893339656, 0.47734526295193974, 0.36373328344311084], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["No results for path: $['rows'][1]", 500, 97.0873786407767, 2.1272069772388855], "isController": false}, {"data": ["500", 15, 2.912621359223301, 0.06381620931716656], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 23505, 515, "No results for path: $['rows'][1]", 500, "500", 15, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["Query cross patient #1", 500, 500, "No results for path: $['rows'][1]", 500, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 5, "500", 5, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 10, "500", 10, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});

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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8730908317379281, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Query cross patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [1.0, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [0.778, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [0.815, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.444, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 23505, 500, 2.1272069772388855, 464.12729206551916, 1, 19897, 11.0, 1011.0, 1870.0, 10399.980000000003, 10.677878325337986, 67.26274120199383, 88.36035436626644], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query cross patient #1", 500, 500, 100.0, 10501.358000000007, 8930, 19897, 10361.0, 11284.5, 11544.0, 18463.460000000054, 0.22978268532318244, 0.13347726130863996, 0.1157889312761349], "isController": false}, {"data": ["Query participation #2", 500, 0, 0.0, 2.866000000000002, 2, 10, 3.0, 4.0, 4.0, 6.990000000000009, 0.230689873452763, 0.11843356774692584, 0.08335473943117415], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 4.21, 3, 14, 4.0, 5.0, 6.0, 8.990000000000009, 0.23068870266671526, 0.13240044672290552, 0.09732179643752051], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 0, 0.0, 16.09, 10, 436, 14.0, 18.0, 20.94999999999999, 79.95000000000005, 0.22946031850927892, 0.11937090456355272, 2.5247357506289507], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 42.22799999999995, 26, 64, 43.0, 54.0, 55.94999999999999, 58.99000000000001, 0.2306622035068036, 0.9593002272426363, 0.0959590807557601], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 2.5599999999999983, 1, 9, 2.0, 3.0, 4.0, 8.0, 0.23066592792058818, 0.14410087963874946, 0.09753744803673307], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 37.254000000000005, 22, 61, 38.5, 48.0, 49.0, 51.0, 0.23066039454921808, 0.9466784636483832, 0.08379459645733314], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 1032.4259999999995, 745, 1469, 1002.0, 1264.0, 1394.95, 1439.91, 0.23058742145615957, 0.9752023945062547, 0.11214114832535885], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 6.883999999999995, 4, 30, 7.0, 9.0, 10.0, 14.980000000000018, 0.2306149670958565, 0.3429294106899723, 0.11778479276477827], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 4.505999999999989, 3, 17, 4.0, 5.0, 6.0, 11.0, 0.22956798977412346, 0.22143222576152294, 0.12554499440772376], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 9.407999999999998, 6, 31, 9.0, 12.0, 13.0, 18.0, 0.23065784077504725, 0.3758799272262979, 0.1506934526157291], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 550.0, 550, 550, 550.0, 550.0, 550.0, 550.0, 1.8181818181818181, 0.7865767045454545, 2150.52734375], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 5.098000000000003, 3, 14, 5.0, 7.0, 7.949999999999989, 12.990000000000009, 0.22956925461617855, 0.23062518351192288, 0.13473742385187823], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 9.677999999999995, 6, 20, 10.0, 12.0, 13.0, 16.99000000000001, 0.23065709593489936, 0.3623636492201484, 0.13717790178159542], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 7.542000000000002, 5, 17, 7.0, 9.0, 10.0, 13.990000000000009, 0.23065656390916744, 0.3569568001879851, 0.1317715721551396], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 2047.7579999999996, 1620, 2694, 1996.0, 2433.9, 2557.75, 2646.99, 0.2304425695636985, 0.35189975630122167, 0.1269234465175058], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 13.995999999999999, 10, 90, 13.0, 17.0, 20.0, 41.97000000000003, 0.22945600112341658, 0.11936865855317895, 1.8499890090575462], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 13.92200000000001, 9, 39, 14.0, 17.0, 18.0, 24.980000000000018, 0.2306594368772772, 0.4175543991540796, 0.19236636630194798], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 9.542000000000002, 6, 39, 9.5, 12.0, 13.0, 17.99000000000001, 0.23065901124785604, 0.3905232757719926, 0.16533565845305304], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 62.0, 62, 62, 62.0, 62.0, 62.0, 62.0, 16.129032258064516, 7.60773689516129, 2199.7227822580644], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 575.0, 575, 575, 575.0, 575.0, 575.0, 575.0, 1.7391304347826089, 0.806725543478261, 3325.988451086957], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 2.852000000000002, 1, 22, 3.0, 4.0, 4.0, 8.980000000000018, 0.22957136271724338, 0.19296324961363137, 0.0970746094302406], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 700.4059999999995, 528, 885, 697.5, 830.0, 848.95, 874.99, 0.22950908465809802, 0.20210023117876325, 0.10623760364056489], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 3.791999999999998, 2, 16, 4.0, 5.0, 6.0, 10.0, 0.22956683034781672, 0.20797992595895806, 0.11209317888076988], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 955.5599999999996, 729, 1257, 919.0, 1147.9, 1174.0, 1215.94, 0.22948275047009542, 0.2170920265702013, 0.12124039844172033], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 57.0, 57, 57, 57.0, 57.0, 57.0, 57.0, 17.543859649122805, 8.309347587719298, 1155.2049067982455], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 0, 0.0, 30.516000000000005, 20, 1274, 27.0, 32.0, 37.0, 89.96000000000004, 0.22932350483368083, 0.11929973072260754, 10.460645420684797], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 38.983999999999966, 25, 279, 37.0, 45.0, 51.94999999999999, 123.0, 0.22952804901617394, 51.91250005953384, 0.07083092137608493], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 472.0, 472, 472, 472.0, 472.0, 472.0, 472.0, 2.1186440677966103, 1.111046742584746, 0.8689751059322034], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 3.236000000000004, 2, 22, 3.0, 4.0, 5.0, 8.0, 0.2306635868464551, 0.25064617160148345, 0.09888800256405643], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 3.9159999999999977, 2, 21, 4.0, 5.0, 6.0, 9.0, 0.23066273555855213, 0.23667933874875616, 0.08492172979059975], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 2.200000000000002, 1, 12, 2.0, 3.0, 4.0, 7.0, 0.23069061850461725, 0.1308245596404456, 0.08943767143196586], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 124.93799999999999, 88, 168, 123.5, 154.0, 157.0, 164.99, 0.23067954965815599, 0.21011437769693228, 0.07524118123615635], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 0, 0.0, 103.82200000000002, 70, 483, 100.0, 117.0, 125.94999999999999, 437.96000000000095, 0.22949602214544815, 0.11938947847373212, 67.86044975138697], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 252.238, 14, 449, 317.0, 414.90000000000003, 422.0, 434.98, 0.2306597561003739, 0.1285545209023871, 0.09663382360064492], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 491.9840000000001, 353, 641, 475.5, 597.0, 613.8499999999999, 628.0, 0.23065060538864396, 0.12404452626326183, 0.09820670307563356], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 8.454, 5, 294, 7.0, 10.0, 13.0, 29.950000000000045, 0.22929447923096466, 0.10338628320871944, 0.16637284967637378], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 456.86599999999993, 325, 601, 460.0, 546.0, 561.0, 583.94, 0.23062996575145006, 0.11862803638764285, 0.09279252528281], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 4.123999999999999, 2, 13, 4.0, 5.0, 6.0, 11.0, 0.22957020325686656, 0.14095027586877398, 0.11478510162843326], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 4.6200000000000045, 2, 32, 4.0, 6.0, 6.0, 10.980000000000018, 0.22956714655382982, 0.13444698580058329, 0.10828215994677715], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 782.842, 555, 1156, 752.0, 977.8000000000001, 1097.95, 1126.99, 0.22949201941502484, 0.20970505613948526, 0.10107509839470333], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 281.1659999999997, 193, 372, 275.0, 338.0, 348.0, 362.98, 0.22953257985438455, 0.2032416850388369, 0.09436837511591395], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 5.368000000000001, 3, 40, 5.0, 7.0, 7.0, 12.0, 0.2295700978519585, 0.15305644678174862, 0.107386793819422], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 1267.2559999999992, 963, 10696, 1184.5, 1503.8000000000002, 1514.0, 1540.98, 0.22947042814592483, 0.17248601879707012, 0.12683619368222018], "isController": false}, {"data": ["Query single patient #2", 500, 0, 0.0, 167.2020000000001, 143, 222, 173.0, 184.0, 186.0, 193.98000000000002, 0.23070594635348488, 4.460625124148637, 0.11625416827968574], "isController": false}, {"data": ["Query single patient #1", 500, 0, 0.0, 226.20000000000005, 196, 314, 221.5, 252.0, 254.0, 258.99, 0.2306877447596972, 0.4471174549824401, 0.1649056925430648], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 8.315999999999992, 5, 19, 8.0, 11.0, 11.0, 15.0, 0.23061305251428185, 0.1882086270671001, 0.14233149334865833], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 8.382000000000001, 5, 24, 9.0, 11.0, 11.949999999999989, 14.0, 0.23061390343550145, 0.19181266376469816, 0.14593536076777824], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 9.460000000000013, 6, 21, 9.0, 12.0, 12.0, 16.99000000000001, 0.23061081887595675, 0.1866303629987247, 0.1407536736303447], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 11.630000000000004, 8, 25, 11.0, 15.0, 16.0, 18.99000000000001, 0.23061166978069292, 0.2062240352879671, 0.16034717664438805], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 8.99599999999999, 6, 33, 9.0, 11.0, 13.0, 20.980000000000018, 0.23060145933827528, 0.17311098418742735, 0.12723615676379446], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 2082.540000000001, 1613, 2751, 2023.0, 2551.0, 2680.7, 2725.94, 0.23042409093087646, 0.19255488168990265, 0.146715339147394], "isController": false}]}, function(index, item){
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

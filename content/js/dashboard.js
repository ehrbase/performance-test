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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.892065517974899, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Query cross patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.213, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.637, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [1.0, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [0.974, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [0.998, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.497, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.109, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 23505, 500, 2.1272069772388855, 322.9382259093821, 1, 18166, 9.0, 839.0, 1502.9500000000007, 6046.980000000003, 15.364723431709836, 96.78636420016171, 127.14439758542439], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query cross patient #1", 500, 500, 100.0, 6180.863999999997, 5228, 18166, 6031.0, 6655.6, 6793.75, 14653.760000000068, 0.331242311037855, 0.1923760886692605, 0.16691507079641912], "isController": false}, {"data": ["Query participation #2", 500, 0, 0.0, 2.3599999999999994, 1, 17, 2.0, 3.0, 4.0, 7.980000000000018, 0.3324200646091638, 0.17066069547430027, 0.12011271865760799], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 3.6040000000000023, 2, 13, 3.0, 4.0, 5.0, 7.0, 0.33241741255593754, 0.1907861694660645, 0.14023859592203614], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 0, 0.0, 13.423999999999996, 8, 344, 11.0, 15.900000000000034, 19.0, 69.6700000000003, 0.3305551276703069, 0.1719629121691887, 3.637074827598973], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 33.75200000000004, 24, 46, 34.0, 40.0, 41.0, 44.99000000000001, 0.3323564270088786, 1.3822359758466614, 0.1382654667048655], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 2.3080000000000003, 1, 9, 2.0, 3.0, 4.0, 6.990000000000009, 0.3323659269087443, 0.2076345772488211, 0.14054145151512332], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 29.684000000000015, 21, 44, 30.0, 35.0, 36.0, 38.0, 0.3323551014846302, 1.3640547935160843, 0.12073837671121333], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 851.9099999999996, 685, 1091, 856.0, 996.9000000000001, 1048.0, 1074.97, 0.3322117863426406, 1.4049930715155634, 0.161563935154917], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 5.639999999999998, 3, 24, 5.0, 7.0, 9.0, 13.0, 0.332314457207535, 0.4941587374360212, 0.1697270128120516], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 3.7639999999999962, 2, 14, 4.0, 5.0, 5.0, 9.0, 0.3306865184397416, 0.31896716907042694, 0.1808441897717337], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 7.588, 5, 22, 7.0, 9.0, 11.0, 15.990000000000009, 0.3323551014846302, 0.541605743553142, 0.21713433876290786], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 495.0, 495, 495, 495.0, 495.0, 495.0, 495.0, 2.0202020202020203, 0.8739741161616161, 2389.4748263888887], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 3.894000000000003, 2, 23, 4.0, 5.0, 5.0, 10.0, 0.3306893616570976, 0.3322104035451884, 0.1940862366756989], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 7.773999999999999, 5, 21, 7.0, 10.0, 11.0, 15.990000000000009, 0.332353555053037, 0.5221293823724327, 0.1976594873313472], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 6.424000000000001, 4, 15, 6.0, 8.0, 8.0, 11.990000000000009, 0.33235178772026613, 0.5143371108576005, 0.18986894122690987], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 1557.9260000000015, 1339, 1973, 1535.5, 1767.7, 1841.9, 1925.95, 0.33200751665017697, 0.5069955799424299, 0.18286351502998027], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 11.44400000000001, 7, 69, 10.0, 14.0, 16.0, 42.940000000000055, 0.33054726065568674, 0.17195881955458095, 2.6650372890364746], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 10.922000000000006, 8, 24, 11.0, 13.0, 15.0, 20.0, 0.3323590780890948, 0.6016575650825547, 0.27718227801570994], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 7.633999999999998, 5, 19, 7.0, 10.0, 11.0, 13.0, 0.3323575316204955, 0.5627066173298528, 0.2382328400482849], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 53.0, 53, 53, 53.0, 53.0, 53.0, 53.0, 18.867924528301884, 8.89961674528302, 2573.260613207547], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 523.0, 523, 523, 523.0, 523.0, 523.0, 523.0, 1.9120458891013383, 0.8869353489483748, 3656.6794634321222], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 2.279999999999998, 1, 15, 2.0, 3.0, 4.0, 7.0, 0.33074842414913314, 0.27800632436464884, 0.1398574879458737], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 552.388, 430, 703, 543.0, 640.0, 653.95, 674.0, 0.33060583519299114, 0.2911236207537813, 0.15303434168113067], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 3.195999999999998, 2, 15, 3.0, 4.0, 5.0, 8.0, 0.3307127653804586, 0.29961478473740744, 0.16148084247092703], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 750.2860000000006, 616, 933, 729.5, 872.0, 899.95, 922.0, 0.3305457310018841, 0.31269819831917495, 0.17463402389845634], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 61.0, 61, 61, 61.0, 61.0, 61.0, 61.0, 16.393442622950822, 7.764472336065574, 1079.4537653688524], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 0, 0.0, 24.439999999999987, 16, 640, 22.0, 27.0, 35.0, 70.94000000000005, 0.33040921180882526, 0.17188700314714772, 15.07169363631858], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 31.087999999999997, 21, 217, 29.0, 35.0, 42.0, 158.52000000000044, 0.3306806134522196, 74.79023779056907, 0.1020459705575209], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 438.0, 438, 438, 438.0, 438.0, 438.0, 438.0, 2.28310502283105, 1.1972923801369864, 0.936429794520548], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 2.573999999999999, 1, 7, 2.0, 3.0, 4.0, 7.0, 0.33237056659210484, 0.3611641144069346, 0.14249089720110747], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 3.3360000000000003, 2, 17, 3.0, 4.0, 5.0, 8.0, 0.33236924095506964, 0.3410387550428723, 0.12236641000005982], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 1.8020000000000016, 1, 20, 2.0, 3.0, 3.0, 5.990000000000009, 0.33242161165975453, 0.18851616612005473, 0.12887830061418218], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 91.41600000000001, 65, 123, 91.0, 111.0, 114.0, 117.99000000000001, 0.33240525785340663, 0.30277119926997154, 0.1084212462139041], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 0, 0.0, 84.09400000000002, 58, 337, 82.0, 94.0, 100.0, 319.9200000000001, 0.3306117375101498, 0.1719923620010077, 97.7596953131819], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 212.2839999999999, 12, 354, 261.0, 335.0, 338.0, 344.0, 0.3323650431742191, 0.18523833377925644, 0.13924277687669923], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 413.80600000000004, 312, 537, 402.0, 490.90000000000003, 502.95, 516.99, 0.3322948013142924, 0.1787090527654238, 0.14148489587210106], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 7.120000000000006, 3, 307, 6.0, 8.0, 10.949999999999989, 25.980000000000018, 0.33034590519733215, 0.14894922645376973, 0.23969434332189235], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 388.25199999999984, 287, 514, 380.0, 458.0, 469.95, 487.97, 0.332300101550911, 0.17092361961707064, 0.13369886898337435], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 3.277999999999999, 2, 11, 3.0, 5.0, 5.949999999999989, 9.0, 0.3307464550594947, 0.20306992554731923, 0.16537322752974734], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 4.047999999999999, 2, 26, 4.0, 5.0, 6.0, 8.990000000000009, 0.3307412042684137, 0.19370000743340857, 0.15600390787269902], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 667.5240000000005, 543, 901, 673.0, 795.9000000000001, 832.0, 845.0, 0.3305804794871507, 0.3020775981063689, 0.14559745727412593], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 238.6199999999999, 174, 314, 232.5, 283.0, 290.0, 303.98, 0.33066639860643954, 0.2927915334769969, 0.13594780645831156], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 4.394000000000002, 3, 36, 4.0, 5.900000000000034, 7.0, 9.990000000000009, 0.33069089264054036, 0.2204745891744368, 0.154688415600409], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 975.3960000000006, 814, 8318, 926.0, 1072.0, 1104.95, 1138.96, 0.33050159566170384, 0.24842810859059575, 0.18267959291457458], "isController": false}, {"data": ["Query single patient #2", 500, 0, 0.0, 135.37, 116, 160, 141.0, 149.90000000000003, 151.0, 153.0, 0.33236349665010834, 6.426141098399869, 0.16748004323384366], "isController": false}, {"data": ["Query single patient #1", 500, 0, 0.0, 181.018, 158, 213, 179.5, 202.0, 204.0, 209.0, 0.33234206772599595, 0.6441431887074819, 0.2375726499760049], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 6.827999999999999, 4, 19, 7.0, 9.0, 10.0, 13.0, 0.33231070253141, 0.27120642305910614, 0.20509801171860462], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 6.778, 4, 19, 6.5, 9.0, 10.0, 12.990000000000009, 0.3323124694272528, 0.2764002473983257, 0.21029148455943342], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 8.091999999999993, 5, 28, 8.0, 10.0, 11.0, 16.0, 0.33230738965234663, 0.2689320867956994, 0.2028243345046061], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 9.54600000000001, 7, 26, 9.0, 12.0, 13.0, 18.99000000000001, 0.33230893565435615, 0.297166616668018, 0.23105855682216953], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 7.6079999999999925, 5, 32, 7.0, 9.0, 10.0, 14.0, 0.3323274888005636, 0.2494760389803528, 0.18336428825421724], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 1620.4080000000013, 1361, 1979, 1596.5, 1807.9, 1874.9, 1964.0, 0.33198172506999835, 0.277421955038719, 0.21137898900941302], "isController": false}]}, function(index, item){
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

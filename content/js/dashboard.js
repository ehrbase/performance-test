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

    var data = {"OkPercent": 97.83024888321634, "KoPercent": 2.169751116783663};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8994894703254627, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Query cross patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.001, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.994, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.492, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.987, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [1.0, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [0.991, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.715, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.598, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #2"], "isController": false}, {"data": [0.999, 500, 1500, "Query single patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 23505, 510, 2.169751116783663, 189.39119336311373, 1, 3740, 18.0, 553.9000000000015, 1187.9500000000007, 2252.0, 25.94582780492005, 173.8128199592185, 214.964280160576], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query cross patient #1", 500, 500, 100.0, 30.924000000000017, 19, 99, 32.0, 36.0, 38.0, 44.99000000000001, 0.5623468307819657, 0.3266587069987437, 0.28446841635259595], "isController": false}, {"data": ["Query participation #2", 500, 0, 0.0, 7.471999999999992, 4, 24, 7.0, 10.0, 13.0, 18.99000000000001, 0.5621527301509492, 6.003516669374369, 0.20421954650014953], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 7.868000000000009, 5, 36, 7.0, 10.0, 12.0, 18.99000000000001, 0.5621388258044206, 6.036277453454905, 0.2382502445303892], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 0, 0.0, 21.675999999999977, 13, 247, 20.0, 28.0, 31.0, 43.99000000000001, 0.5588071925191364, 0.3015878052344587, 6.222187118264836], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 43.156000000000006, 25, 100, 44.0, 53.0, 55.0, 77.97000000000003, 0.5620351968921702, 2.3374143704250336, 0.23491314870102425], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 2.6379999999999986, 1, 16, 2.0, 4.0, 4.0, 9.990000000000009, 0.5620870065719212, 0.35117703127002436, 0.23877719517459545], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 37.802000000000014, 23, 104, 39.0, 46.0, 48.0, 61.98000000000002, 0.5620314063149848, 2.3066306796786304, 0.20527318941582456], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 768.8480000000002, 574, 1217, 766.5, 905.0, 921.0, 1080.8400000000001, 0.5617264324866619, 2.3757221081059368, 0.27428048461262783], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 13.69599999999999, 8, 51, 14.0, 18.0, 20.0, 27.99000000000001, 0.5617655617487087, 0.8354529157598833, 0.2880145702324923], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 3.4160000000000004, 2, 21, 3.0, 4.0, 6.0, 10.990000000000009, 0.5593610754052292, 0.5395059422325443, 0.30699309021263554], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 21.50199999999999, 14, 52, 22.0, 27.0, 29.0, 37.0, 0.5619758170566403, 0.9157955719536978, 0.3682478254345759], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 780.0, 780, 780, 780.0, 780.0, 780.0, 780.0, 1.2820512820512822, 0.5471254006410257, 1516.3999899839744], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 4.609999999999996, 2, 34, 4.0, 6.0, 8.0, 13.0, 0.5593723394853103, 0.5619452337421226, 0.32939601631800985], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 22.297999999999988, 14, 61, 23.0, 28.0, 29.94999999999999, 34.0, 0.5619682375552134, 0.8828553939818822, 0.3353150323693705], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 12.981999999999994, 8, 42, 13.0, 17.0, 18.0, 27.99000000000001, 0.561970764032972, 0.8696563429359151, 0.32214535008530715], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 1991.2599999999998, 1471, 2702, 1976.5, 2276.6000000000004, 2341.6, 2586.4600000000005, 0.5608669657209329, 0.8564142796869689, 0.3100104517559062], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 18.734000000000016, 12, 91, 17.0, 25.0, 30.0, 46.97000000000003, 0.5587597321976355, 0.3015621909360231, 4.506091668445385], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 26.31000000000002, 17, 66, 27.0, 33.0, 34.0, 44.98000000000002, 0.5620187714269657, 1.0174976641094813, 0.4698125667397291], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 21.89800000000002, 14, 71, 23.0, 28.0, 29.0, 39.98000000000002, 0.5619871866921434, 0.9514871146875351, 0.4039282904349781], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 107.0, 107, 107, 107.0, 107.0, 107.0, 107.0, 9.345794392523365, 4.353460864485982, 1274.6239778037384], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 632.0, 632, 632, 632.0, 632.0, 632.0, 632.0, 1.5822784810126582, 0.7246959058544303, 3026.0210640822784], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 2.3160000000000007, 1, 17, 2.0, 3.0, 4.0, 9.0, 0.5595732917906121, 0.4702787280031739, 0.2377093573524573], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 401.5619999999997, 314, 726, 400.0, 469.0, 479.84999999999997, 505.97, 0.5593817265652619, 0.4925148519344539, 0.26002509945807095], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 3.016000000000002, 1, 17, 3.0, 4.0, 5.0, 9.0, 0.5596221431289593, 0.5070624751667674, 0.2743460115729859], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 1144.499999999999, 932, 2234, 1123.0, 1316.8000000000002, 1355.8, 1655.3800000000006, 0.5587790900394274, 0.5285449940797355, 0.2963057088783292], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 55.0, 55, 55, 55.0, 55.0, 55.0, 55.0, 18.18181818181818, 8.504971590909092, 1197.2478693181818], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 6, 1.2, 44.61600000000001, 14, 710, 43.0, 53.0, 60.94999999999999, 82.97000000000003, 0.5583248467956621, 0.30009306228336996, 25.538999828035948], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 48.21, 12, 206, 49.0, 57.0, 66.0, 98.97000000000003, 0.5591115047256104, 125.57052633394221, 0.17363033056908606], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 286.0, 286, 286, 286.0, 286.0, 286.0, 286.0, 3.4965034965034967, 1.8336156031468533, 1.4409418706293708], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 2.2899999999999996, 1, 11, 2.0, 3.0, 4.0, 6.990000000000009, 0.5621634748898441, 0.6108960211193574, 0.24210360588517696], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 3.4660000000000033, 2, 19, 3.0, 5.0, 6.0, 13.990000000000009, 0.56215905053585, 0.5768860805062355, 0.20806472671199916], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 2.3059999999999996, 1, 22, 2.0, 3.0, 4.0, 9.0, 0.5621622107815967, 0.3187701289206598, 0.21904562705259478], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 124.36400000000009, 85, 266, 123.0, 150.90000000000003, 156.0, 193.98000000000002, 0.5620971168914681, 0.5119541018193959, 0.18443811648001296], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 4, 0.8, 173.45999999999992, 42, 574, 174.0, 202.90000000000003, 243.44999999999987, 365.0, 0.5588652799356187, 0.3008059623240972, 165.32370175595472], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 2.463999999999998, 1, 18, 2.0, 3.0, 5.0, 8.990000000000009, 0.5621539942165596, 0.31337120693619325, 0.236609737800134], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 3.4939999999999998, 2, 44, 3.0, 5.0, 6.0, 13.0, 0.5621925509486999, 0.30231684820801125, 0.24046907940969783], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 12.021999999999991, 7, 305, 10.0, 16.0, 20.0, 36.0, 0.5581522036407152, 0.23588907506365725, 0.406077530969075], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 4.624000000000002, 3, 47, 4.0, 6.0, 6.0, 10.980000000000018, 0.5621647390037766, 0.2892535218215487, 0.2272814472144175], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 3.848000000000002, 2, 16, 4.0, 5.0, 7.0, 11.0, 0.5595651507300646, 0.3435587948393544, 0.280875476050052], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 4.151999999999994, 2, 25, 4.0, 5.0, 6.0, 11.990000000000009, 0.5595507478955296, 0.32767160652055677, 0.26502159446223816], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 523.4440000000003, 376, 1027, 528.0, 630.0, 644.0, 844.7900000000002, 0.5590571166293775, 0.5107914882575643, 0.24731725960264456], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 17.29200000000002, 7, 112, 15.5, 30.0, 36.94999999999999, 50.99000000000001, 0.5592359494763874, 0.4952121713230516, 0.2310125064731561], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 11.914000000000007, 7, 61, 12.0, 15.0, 16.0, 19.980000000000018, 0.5593798491240671, 0.37288020384081394, 0.2627555736608167], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 550.4120000000007, 409, 3740, 531.0, 609.9000000000001, 635.9, 748.7400000000002, 0.5591621514322939, 0.42027369938883574, 0.3101602558726005], "isController": false}, {"data": ["Query single patient #2", 500, 0, 0.0, 173.9140000000001, 141, 371, 179.0, 190.90000000000003, 197.0, 271.8700000000001, 0.5622355384585975, 10.870706637654376, 0.2844121180874546], "isController": false}, {"data": ["Query single patient #1", 500, 0, 0.0, 276.0859999999998, 216, 525, 279.0, 302.0, 308.95, 409.71000000000026, 0.5620592050684251, 1.0893475834545507, 0.40288228175803126], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 22.73800000000001, 14, 52, 24.0, 28.0, 30.0, 38.0, 0.5617270635605407, 0.45843840262517527, 0.3477880452122879], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 22.335999999999988, 14, 53, 24.0, 28.0, 30.0, 44.98000000000002, 0.5617428408683646, 0.4671966932726801, 0.356575045473083], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 22.24399999999999, 14, 51, 24.0, 28.0, 30.0, 42.0, 0.5616961426079102, 0.45454163277766607, 0.34392918106949194], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 25.16399999999999, 16, 56, 27.0, 31.0, 32.94999999999999, 47.98000000000002, 0.561707500929626, 0.5023058356213552, 0.3916593317028837], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 21.89200000000002, 14, 56, 23.0, 28.0, 31.0, 43.0, 0.5614993379922805, 0.42160923534458655, 0.31090832484533504], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 2194.323999999997, 1661, 2990, 2173.0, 2528.5, 2628.85, 2800.7300000000005, 0.560489105212773, 0.46831163621622773, 0.35796862774331395], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["No results for path: $['rows'][1]", 500, 98.03921568627452, 2.1272069772388855], "isController": false}, {"data": ["500", 10, 1.9607843137254901, 0.042544139544777704], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 23505, 510, "No results for path: $['rows'][1]", 500, "500", 10, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["Query cross patient #1", 500, 500, "No results for path: $['rows'][1]", 500, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 6, "500", 6, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 4, "500", 4, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});

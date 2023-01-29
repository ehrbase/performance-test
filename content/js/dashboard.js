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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8668793873643905, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Query cross patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.446, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [0.5, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [0.99, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [0.748, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [0.739, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [0.842, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.481, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 23505, 500, 2.1272069772388855, 505.8575196766613, 1, 24520, 13.0, 1054.9000000000015, 1909.0, 10730.950000000008, 9.762643776267867, 61.58361644169598, 80.88466891896944], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query cross patient #1", 500, 500, 100.0, 11383.820000000009, 9105, 24520, 10822.5, 13238.800000000001, 13644.3, 23226.700000000073, 0.21012243834482353, 0.12209262774918946, 0.10629240533458846], "isController": false}, {"data": ["Query participation #2", 500, 0, 0.0, 3.2619999999999987, 2, 12, 3.0, 4.0, 5.0, 8.0, 0.21083257784992937, 0.10823905713035778, 0.07659152242204464], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 4.592000000000004, 3, 13, 4.0, 6.0, 6.0, 9.0, 0.21083159994619577, 0.12094404144569758, 0.08935636169594625], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 0, 0.0, 16.171999999999993, 10, 427, 15.0, 19.0, 22.0, 36.97000000000003, 0.20963841984621764, 0.12318509141178477, 2.334274670982982], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 42.96399999999999, 26, 62, 44.0, 53.0, 55.0, 58.0, 0.2107836937734497, 0.8766275629979765, 0.08810099700687155], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 2.652000000000001, 1, 11, 2.0, 4.0, 4.0, 7.0, 0.2107886700246707, 0.13169516195736675, 0.08954401509837086], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 37.632000000000005, 23, 61, 38.0, 47.0, 49.0, 51.0, 0.21078333833592458, 0.8650869320548341, 0.07698532083753495], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 1171.4299999999998, 802, 1843, 1174.5, 1529.7, 1596.0, 1681.96, 0.21071653737099935, 0.8912239485876934, 0.10288893426318325], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 6.840000000000006, 4, 17, 7.0, 8.0, 9.0, 14.990000000000009, 0.21064214679735466, 0.313229397802539, 0.10799524127794063], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 4.406, 2, 17, 4.0, 5.0, 6.0, 10.990000000000009, 0.20978900680429666, 0.20235419913151545, 0.11513810725001436], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 10.181999999999995, 6, 37, 10.0, 12.0, 13.0, 16.99000000000001, 0.2107832494767306, 0.3435519954850228, 0.13812066445203733], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 537.0, 537, 537, 537.0, 537.0, 537.0, 537.0, 1.86219739292365, 0.8838163407821229, 2202.5921642225326], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 4.964000000000006, 3, 30, 5.0, 6.0, 7.0, 13.0, 0.20978988703653742, 0.21075483856773086, 0.1235383807451485], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 15.913999999999994, 7, 25, 17.0, 20.0, 21.0, 22.0, 0.21078280518188447, 0.3311529608660644, 0.12576981832630021], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 7.864000000000007, 6, 17, 8.0, 9.0, 10.0, 14.0, 0.21078342719519347, 0.3262017626079053, 0.12082995289411969], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 2362.0040000000004, 1645, 3743, 2259.5, 3055.5000000000005, 3303.4999999999995, 3634.99, 0.21049759948537547, 0.3214425793860122, 0.11634925909054933], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 14.082000000000003, 9, 78, 13.0, 17.0, 21.0, 47.98000000000002, 0.20963455247006105, 0.12318281891285197, 1.69058802177516], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 14.818000000000001, 10, 26, 15.0, 18.0, 19.0, 23.99000000000001, 0.2107839603523802, 0.38157454603985413, 0.1762022168570678], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 10.19800000000001, 6, 20, 10.0, 12.0, 14.0, 17.0, 0.21078387149266176, 0.35681345558868144, 0.15150090763535065], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 83.0, 83, 83, 83.0, 83.0, 83.0, 83.0, 12.048192771084338, 6.188817771084337, 1643.1899472891566], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 668.0, 668, 668, 668.0, 668.0, 668.0, 668.0, 1.4970059880239521, 0.7572745134730539, 2862.942084580838], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 2.9560000000000004, 1, 20, 3.0, 4.0, 4.0, 8.990000000000009, 0.2097716677351037, 0.17638027921867608, 0.08911198775856456], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 736.4759999999998, 552, 980, 713.5, 881.0, 902.9, 931.0, 0.20972424198318598, 0.18461877559422218, 0.09748900310937161], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 3.838, 2, 29, 4.0, 5.0, 6.0, 10.990000000000009, 0.20978812657944235, 0.19006107705958444, 0.10284535111609382], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 976.9760000000003, 777, 1363, 930.0, 1192.0, 1213.95, 1267.91, 0.20972098719863094, 0.19839728272381424, 0.11120946879771153], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 64.0, 64, 64, 64.0, 64.0, 64.0, 64.0, 15.625, 8.056640625, 1028.8848876953125], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 0, 0.0, 29.94400000000002, 19, 657, 27.0, 35.0, 39.0, 81.85000000000014, 0.20957770093262076, 0.12314941252750708, 9.586542491878864], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 37.384, 26, 246, 36.0, 42.0, 46.94999999999999, 134.99, 0.20969908600556375, 47.45392429427869, 0.06512139584938405], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 1061.0, 1061, 1061, 1061.0, 1061.0, 1061.0, 1061.0, 0.942507068803016, 0.49426396088595664, 0.38841599905749297], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 3.2300000000000004, 2, 10, 3.0, 4.0, 5.0, 7.0, 0.2108007561844726, 0.2290029074167295, 0.09078431003647697], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 3.882, 2, 18, 4.0, 5.0, 5.0, 8.0, 0.2107994230841389, 0.21635761099749024, 0.07802048959852408], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 2.24, 1, 17, 2.0, 3.0, 4.0, 6.990000000000009, 0.21083302235462537, 0.11955138290650187, 0.08215075773388233], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 207.42600000000007, 95, 352, 221.0, 303.90000000000003, 317.0, 335.97, 0.2108147103131821, 0.1920204965392657, 0.06917357682151287], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 0, 0.0, 114.49000000000001, 81, 424, 112.0, 129.0, 138.95, 313.7600000000002, 0.20966830892864105, 0.12326203317875188, 62.02414466861714], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 270.50599999999986, 18, 527, 340.0, 452.90000000000003, 479.95, 504.99, 0.21079675693405392, 0.11750807575550612, 0.08872402562361059], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 538.0379999999999, 313, 1127, 501.5, 865.9000000000001, 919.95, 997.98, 0.21083728969507445, 0.11337692895036343, 0.09018235633441662], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 8.41400000000001, 5, 257, 7.0, 10.0, 13.949999999999989, 31.0, 0.20955679575924105, 0.0985796914894375, 0.1524607547271822], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 556.2399999999996, 302, 1071, 505.0, 914.9000000000001, 953.95, 1028.94, 0.21077489704700153, 0.10841527931994743, 0.08521563220454945], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 4.258000000000004, 2, 16, 4.0, 5.0, 6.0, 11.990000000000009, 0.20977078765574433, 0.12879393740922168, 0.10529510239751229], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 4.758000000000004, 2, 27, 5.0, 6.0, 6.0, 10.990000000000009, 0.20976885150714725, 0.1228520292356946, 0.09935341111422501], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 906.678, 605, 1457, 918.5, 1198.0, 1341.8, 1417.98, 0.20969257809895223, 0.1916127365751666, 0.09276439245979039], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 523.3579999999997, 255, 1100, 422.0, 944.9000000000001, 992.8499999999999, 1042.95, 0.20969838242861763, 0.18567931673032412, 0.08662345289775904], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 5.714, 3, 36, 6.0, 7.0, 7.949999999999989, 12.990000000000009, 0.2097905912276484, 0.1399286853598475, 0.09854421326220593], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 1225.5019999999993, 920, 10054, 1148.0, 1473.9, 1494.8, 1543.0, 0.20971289465869647, 0.15757548379716232, 0.11632512125599569], "isController": false}, {"data": ["Query single patient #2", 500, 0, 0.0, 170.0239999999999, 144, 224, 171.0, 190.0, 192.0, 196.0, 0.21091092851848994, 4.077954564196857, 0.106691270481033], "isController": false}, {"data": ["Query single patient #1", 500, 0, 0.0, 229.43200000000013, 195, 335, 219.0, 258.0, 261.0, 265.99, 0.21089455989046982, 0.40875443550802176, 0.15116856148398908], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 9.441999999999997, 6, 23, 9.0, 12.0, 13.0, 18.980000000000018, 0.21063966210027965, 0.17196753663655642, 0.13041557204255594], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 9.213999999999997, 6, 20, 9.0, 11.0, 12.0, 17.99000000000001, 0.21064090444148986, 0.17514050669880205, 0.13370760535836756], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 10.280000000000006, 6, 27, 10.0, 12.0, 13.0, 19.0, 0.2106379760892195, 0.17046659879384482, 0.128974620124942], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 12.594, 8, 25, 13.0, 15.0, 16.0, 21.0, 0.21063859724804887, 0.1883750848873547, 0.14687105315928406], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 9.470000000000004, 6, 42, 9.0, 11.0, 12.0, 18.980000000000018, 0.2106002697368255, 0.15809622397401865, 0.11661167279373051], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 2048.9759999999987, 1615, 2729, 1986.5, 2551.7000000000003, 2628.0, 2680.9700000000003, 0.21045834881956016, 0.17587042350428306, 0.13441382824999254], "isController": false}]}, function(index, item){
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

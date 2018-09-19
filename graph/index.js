// globals
var chartLine;
var chartPie;
var chartBar;
var total;

function getResults() {
    $.ajax({
        url: '/results/',
        success: function(response) {
            total = response['total'];
            updateTotal(response['total']);
            updateTable(response['table']);
            for (var j = 0; response['bar'].length > j; j++) {
                chartBar.series[j].update(response['bar'][j]);
            }
            chartPie.series[0].setData(response['pie']);
            chartLine.xAxis[0].setCategories(response['line_cats']);
            chartLine.series[0].setData(response['line_data']);
            setTimeout(getResults, 2000);
        },
        cache: false
    });
}

function updateTotal(new_total) {
    var total_element = $('#total');
    var current_total = parseInt(total_element[0].innerText);
    if (current_total !== new_total) {
        total_element.fadeOut();
        total_element.empty();
        total_element.append(total);
        total_element.fadeIn('slow');
    }
}

function updateTable(rows) {
    var tbody = $('#time-table tbody');
    tbody.empty();
    for (var id in rows) {
        var percent = (rows[id]['votes']/total)*100;
        tbody.append('<tr><th scope="row">' + rows[id]['personality'] + '</th><td sorttable_customkey="'
            + percent + '">' + rows[id]['votes'] + '</td><td>' + percent.toFixed(1) + '%</td>');
    }
}

$(function () {
    //highchart colors and fonts
    Highcharts.theme = {
        colors: ['#405952', '#9C9B7A', '#FFD393', '#FF974F', '#F54F29', '#4384B2'],
        title: {
            style: {
                color: '#000',
                font: 'bold 16px "PT Sans Narrow", sans-serif'
            }
        },
        subtitle: {
            style: {
                color: '#666666',
                font: 'bold 12px "PT Sans Narrow", sans-serif'
            }
        },

        legend: {
            itemStyle: {
                font: '9pt "PT Sans Narrow", sans-serif',
                color: 'black'
            },
            itemHoverStyle:{
                color: 'gray'
            }
        }
    };
    Highcharts.setOptions(Highcharts.theme);

    //time section
    chartLine = new Highcharts.Chart({
        chart:{
            renderTo:'time-line'
        },
        title: {
            text: ''
        },
        yAxis: {
            title: {
                text: 'Values'
            }
        },
        plotOptions: {
            series: {
                dataLabels: {
                    enabled: true
                }
            }
        },
        xAxis: {
            categories: []
        },
        legend: {
            enabled: false
        },
        series: [{
            name: 'Votes',
            data: []
        }]
    });

    chartBar = new Highcharts.Chart({
        chart:{
            type:'bar',
            renderTo:'time-bar'
        },
        title: {
            text: ''
        },
        yAxis: {
            title: {
                text: 'Votes'
            },
            reversedStacks:false
        },
        xAxis: {
            categories: ['Values']
        },
        plotOptions: {
            series: {
                stacking: 'reverse',
                dataLabels: {
                    enabled: true
                }
            }
        },
        series: [{},{},{},{},{}]
    });

    chartPie = new Highcharts.Chart({
        chart:{
            type:'pie',
            renderTo:'time-pie'
        },
        title: {
            text: ''
        },
        yAxis: {
            title: {
                text: 'Votes'
            }
        },
        plotOptions: {
            series: {
                dataLabels: {
                    enabled: true
                }
            }
        },
        series: [{
            name: 'Votes',
            data: []
        }]
    });

    getResults();
});

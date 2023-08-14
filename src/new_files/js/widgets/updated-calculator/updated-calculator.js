(function () {
    const is_mobile = !window.matchMedia('(min-width: 768px)').matches;

    function initChart(tgt, data, options) {

        window.myChart = new Chart(tgt, {
            type: 'doughnut',
            options: options,
            data: data,
        })

    }

    const chart = document.getElementById('chart')
    const data = {
        labels: [
            'In interests',
            'Towards the principal',
        ],
        datasets: [{
            label: 'My First Dataset',
            data: [300, 50],
            backgroundColor: [
                '#FF662B',
                '#DDDDDD'
            ],

            hoverOffset: 4,
            borderWidth: 4,
            hoverBorderWidth: 4,
            cutout: '88%'
        }]
    }

    const config = {
        type: 'doughnut',
        data: data,
        options: {
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    enabled: false,
                    position: 'nearest',
                }
            },
            borderColor: "transparent",
            borderWidth:0
        }
    };

    new Chart(chart, config)
})()
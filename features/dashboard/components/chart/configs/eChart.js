const eChart = {
  series: [
    {
      name: "Black Ice Probability",
      data: [75, 70, 55, 40, 25, 10, 15, 35],
      color: "#60a5fa",
    },
  ],

  options: {
    chart: {
      type: "bar",
      width: "100%",
      height: "auto",
      foreColor: "#555",
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "55%",
        borderRadius: 5,
        distributed: false,
        dataLabels: {
          position: "top",
        },
      },
    },
    dataLabels: {
      enabled: true,
      formatter: function (val) {
        return val + "%";
      },
      offsetY: -20,
      style: {
        fontSize: "12px",
        colors: ["#304758"],
      },
    },
    stroke: {
      show: true,
      width: 1,
      colors: ["transparent"],
    },
    grid: {
      show: true,
      borderColor: "#f1f1f1",
      strokeDashArray: 2,
    },
    colors: [
      "#3b82f6",
      "#93c5fd",
      "#bfdbfe",
      "#60a5fa",
      "#2563eb",
    ],
    xaxis: {
      categories: [
        "00:00",
        "03:00",
        "06:00",
        "09:00",
        "12:00",
        "15:00",
        "18:00",
        "21:00",
        "00:00",
      ],
      labels: {
        style: {
          colors: Array(9).fill("#555"),
          fontSize: "12px",
          fontWeight: 500,
        },
      },
      title: {
        text: "Time of Day",
        style: {
          fontSize: "12px",
          fontWeight: 500,
        },
      },
    },
    yaxis: {
      title: {
        text: "Probability (%)",
        style: {
          fontSize: "12px",
          fontWeight: 500,
        },
      },
      labels: {
        show: true,
        align: "right",
        style: {
          colors: Array(10).fill("#555"),
          fontSize: "12px",
          fontWeight: 500,
        },
        formatter: function (val) {
          return val + "%";
        },
      },
      min: 0,
      max: 100,
    },
    fill: {
      opacity: 1,
      type: "gradient",
      gradient: {
        shade: "light",
        type: "vertical",
        shadeIntensity: 0.2,
        gradientToColors: undefined,
        inverseColors: false,
        opacityFrom: 0.9,
        opacityTo: 0.7,
        stops: [0, 100],
      },
    },
    tooltip: {
      y: {
        formatter: function (val) {
          return val + "% probability";
        },
      },
      theme: "dark",
    },
  },
};

export default eChart;

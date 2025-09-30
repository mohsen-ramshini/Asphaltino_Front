const lineChart = {
  series: [
    {
      name: "Asphalt Temperature",
      data: [1, 2, 0, -1, 2, 3, 4, 2, 1],
      offsetY: 0,
    },
    {
      name: "Air Temperature",
      data: [2, 3, 1, 0, 3, 4, 5, 3, 2],
      offsetY: 0,
    },
  ],

  options: {
    chart: {
      width: "100%",
      height: 350,
      type: "area",
      toolbar: {
        show: false,
      },
    },

    legend: {
      show: true,
      position: "top",
      horizontalAlign: "right",
      labels: {
        colors: "#555",
      },
    },

    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: "smooth",
    },
    colors: ["#f59e0b", "#3b82f6"],
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.7,
        opacityTo: 0.2,
        stops: [0, 90, 100],
      },
    },

    yaxis: {
      title: {
        text: "Temperature (°C)",
        style: {
          fontSize: "12px",
          fontWeight: 500,
        },
      },
      labels: {
        style: {
          fontSize: "12px",
          fontWeight: 500,
          colors: ["#555"],
        },
        formatter: function (val) {
          return val.toFixed(0) + "°C";
        },
      },
    },

    xaxis: {
      labels: {
        style: {
          fontSize: "12px",
          fontWeight: 500,
          colors: Array(9).fill("#555"),
        },
      },
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
    },

    tooltip: {
      y: {
        formatter: function (val) {
          return val.toFixed(1) + "°C";
        },
      },
      theme: "dark",
    },
    grid: {
      borderColor: "#f1f1f1",
      row: {
        colors: ["transparent", "transparent"],
        opacity: 0.5,
      },
    },
    markers: {
      size: 4,
      colors: ["#f59e0b", "#3b82f6"],
      strokeColors: "#fff",
      strokeWidth: 2,
      hover: {
        size: 6,
      },
    },
  },
};

export default lineChart;

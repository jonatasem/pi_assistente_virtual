import Chart from "react-apexcharts";

const DonutChart = ({ options, series }) => {
  return <Chart options={options} series={series} type="donut" width="250" />;
};

export default DonutChart;
